import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { RadSideComponent } from "../radside/radside.component";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import { ValueList } from "nativescript-drop-down";
let xml2js = require('nativescript-xml2js');
import * as ApplicationSettings from "application-settings";
let http_request = require("http");

@Component({
	moduleId: module.id,
	templateUrl: "./familymembers.component.html",
	providers: [RadSideComponent, WebAPIService, Configuration]
})
export class FamilyMembersComponent {
	memlist: any = []; @ViewChild(RadSideComponent) rscomp: RadSideComponent; isLoading: boolean = true;
	primaryAccess: boolean = true;
	delFamMem: any = {};
	constructor(private page: Page, private webapi: WebAPIService, private router: Router) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
	}
	ngAfterViewInit() {
		this.rscomp.fmclass = true;
		this.getFamliMembers();
	}
	/* To load all dependent members when user navigate to family members tab */
	getFamliMembers() {
		let self = this;
		self.webapi.loader.show(self.webapi.options);
		self.webapi.personalAndLSSummary("FamilyMembers_Grid_Get").subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				//console.log(JSON.stringify(result));
				if (result.APIResult_FamilyMembers_Grid.Successful == "true" && result.APIResult_FamilyMembers_Grid.FamilyMemberCount != '0') {
					self.memlist = [];
					let members = result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem;
					if (members.length != undefined) {
						for (let i = 0; i < members.length; i++) {
							self.memlist.push(members[i]);
						}
					} else {
						self.memlist.push(members);
					}
					self.isLoading = false; self.webapi.loader.hide();
					if (JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId == JSON.parse(ApplicationSettings.getString("MEMBER_ACCESS"))) {
						ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
						ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));
					} else {
						self.primaryAccess = false;
					}					
				} else {
					self.webapi.loader.hide();
					self.isLoading = false;
					if (result.APIResult_FamilyMembers_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					}
					//console.log("error or no membrs list-->" + result.APIResult_FamilyMembers_Grid.Message);
				}
			});
		},
			error => {
				self.webapi.loader.hide();
				self.isLoading = false;
				//console.log("Error in members list " + error);
			});
	}
	editMember(item) {
		let editmember: any = {};
		editmember.PersonId = item.PersonId;
		editmember.fname = item.FirstName;
		editmember.lname = item.LastName;
		editmember.Gender = item.Gender;
		editmember.RelationShip = item.RelationShip;
		editmember.dob = item.DateOfBirth;

		let navigationExtras: NavigationExtras = {
			queryParams: { "EDIT_MEMBER": JSON.stringify(editmember) }
		};
		this.router.navigate(["/addmembers"], navigationExtras);
	}
	onSelctFamMember(i, item: any, type) {

		if (type == 'select' && i != 0) {
			//console.log("long selected");
			this.delFamMem = item;
			this.delFamMem.selected = true;
			this.delFamMem.index = i;
		} else {
			this.delFamMem = {};
			this.delFamMem.selected = false;
			this.delFamMem.index = -1;
		}
	}

	/* To delete the family member one at a time*/
	deleteFamilyMember() {
		let usr: any;
		if (this.delFamMem.PersonId != undefined && this.webapi.netConnectivityCheck()) {
			if (ApplicationSettings.hasKey("USER_DEFAULTS"))
				usr = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_Benefit.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<?xml version='1.0' encoding='UTF-8'?>" +
				"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Body><web:FamilyMembers_Grid_Save xmlns= 'https://www.247CallADoc.com/WebServices/'>" +
				"<web:Key>" + usr.Key + "</web:Key><web:GroupNumber>" + usr.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + usr.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
				"<web:PersonId>" + this.delFamMem.PersonId + "</web:PersonId>" +
				"<web:FirstName>" + this.delFamMem.FirstName + "</web:FirstName>" +
				"<web:LastName>" + this.delFamMem.LastName + "</web:LastName>" +
				"<web:Gender>" + this.delFamMem.Gender + "</web:Gender>" +
				"<web:DateOfBirth>" + this.delFamMem.DateOfBirth + "</web:DateOfBirth>" +
				"<web:RelationShip>" + this.delFamMem.RelationShip + "</web:RelationShip></web:Content>" +
				"<web:Action>" + "Delete" + "</web:Action><web:Demo/>" +
				"</web:FamilyMembers_Grid_Save></soapenv:Body></soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				//console.log(self.delFamMem);
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					//console.log(JSON.stringify(result['soap:Envelope']['soap:Body']));
					let resp = result['soap:Envelope']['soap:Body'].FamilyMembers_Grid_SaveResponse.FamilyMembers_Grid_SaveResult;
					if (resp.Successful == "true") {
						//	console.log("SUCCESS");
						self.memlist.splice(self.memlist.indexOf(self.delFamMem), 1);
						self.delFamMem.selected = false; self.delFamMem.index = -1;
					} else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						console.log("Error Or Session Expired ");
					}
				});
			}, function (e) {
				console.log("Error: " + e);
			});

		}

	}
};
@Component({
	moduleId: module.id,
	templateUrl: "./addmembers.component.html",
	providers: [RadSideComponent, WebAPIService, Configuration]
})
export class AddmembersComponent {

	addMember: any = {}; addform: boolean = false; @ViewChild(RadSideComponent) rscomp: RadSideComponent;
	gender = new ValueList<string>(); relation = new ValueList<string>();

	constructor(private page: Page, private webapi: WebAPIService, private actRoute: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.page.actionBarHidden = true;
	}
	ngAfterViewInit() {
		this.rscomp.fmclass = true;
		this.gender.push([{ value: "M", display: "Male" }, { value: "F", display: "Female" }, { value: "U", display: "Unknown" }]);
		this.relation.push([{ value: "1", display: "Spouse" }, { value: "3", display: "Child" }, { value: "5", display: "Other" }, { value: "6", display: "Unknown" }]);
		this.actRoute.queryParams.subscribe(params => {
			if (params["EDIT_MEMBER"] != undefined) {
				this.addMember = JSON.parse(params["EDIT_MEMBER"]);
				this.addMember.isEdited = true;
			}
			if (this.addMember.Gender != undefined) {
				for (let i = 0; i < this.gender.length; i++) {
					if (this.gender.getDisplay(i) == this.addMember.Gender)
						this.addMember.genindx = i;
				}
				for (let j = 0; j < this.relation.length; j++) {
					if (this.relation.getDisplay(j) == this.addMember.RelationShip.split(" ", 2)[1])
						this.addMember.relindx = j;
				}
			}
		});
	}

/* To add new family member after filling all mandatory fileds and validations succeeded */
	addFamilyMember(fname, lname, dob) {
		this.addform = true; let usr: any;
		if (fname && lname && dob && this.isValidDate() && this.addMember.gendervalue != 'Unknown' && this.addMember.gendervalue != null && this.addMember.relationvalue != null && this.addMember.fname.trim() != '' && this.addMember.lname.trim() != '' && this.webapi.netConnectivityCheck()) {
			if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
				usr = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
				if (this.addMember.PersonId != undefined) {
					this.addMember.operation = "Update";
					this.addMember.PersonId = this.addMember.PersonId;
				} else {
					this.addMember.PersonId = 0;
					this.addMember.operation = "Add";
				}
			//	console.log(this.addMember.PersonId + "  " + this.addMember.fname + "  " + this.addMember.gendervalue + "  " + this.addMember.dob + " " + this.addMember.relationvalue);
			}
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_Benefit.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<?xml version='1.0' encoding='UTF-8'?>" +
				"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Body><web:FamilyMembers_Grid_Save xmlns= 'https://www.247CallADoc.com/WebServices/'>" +
				"<web:Key>" + usr.Key + "</web:Key><web:GroupNumber>" + usr.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + usr.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
				"<web:PersonId>" + this.addMember.PersonId + "</web:PersonId>" +
				"<web:FirstName>" + this.addMember.fname + "</web:FirstName>" +
				"<web:LastName>" + this.addMember.lname + "</web:LastName>" +
				"<web:Gender>" + this.addMember.gendervalue + "</web:Gender>" +
				"<web:DateOfBirth>" + this.addMember.dob + "</web:DateOfBirth>" +
				"<web:RelationShip>" + this.addMember.relationvalue + "</web:RelationShip></web:Content>" +
				"<web:Action>" + this.addMember.operation + "</web:Action><web:Demo/>" +
				"</web:FamilyMembers_Grid_Save></soapenv:Body></soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					//console.log(JSON.stringify(result['soap:Envelope']['soap:Body']));
					let resp = result['soap:Envelope']['soap:Body'].FamilyMembers_Grid_SaveResponse.FamilyMembers_Grid_SaveResult;
					if (resp.Successful == "true") {
						self.router.navigate(["/familymembers"]);
					} else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						//console.log("Error Or Session Expired " + " " + usr.Key + "  " + self.addMember.PersonId + " " + usr.ExternalMemberId + "  " + self.addMember.fname + " " + self.addMember.lname + " " + self.addMember.gendervalue + " " + self.addMember.relationvalue + " " + self.addMember.operation);
					}
				});
			}, function (e) {
				console.log("Error: " + e);
			});

		}

	}
	isValidDate() {
		let date = this.addMember.dob;
		let matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
		if (matches == null) return false;
		let d: any = matches[2]; let m: any;
		m = parseInt(matches[1]) - 1;
		let y: any = matches[3];
		let composedDate = new Date(y, m, d);
		return composedDate.getDate() == d &&
			composedDate.getMonth() == m &&
			composedDate.getFullYear() == y && composedDate.getTime() < new Date().getTime();
	}
	onGenderChge(args) {
		this.addMember.genindx = args.selectedIndex;
		this.addMember.genderItemId = this.gender.getValue(args.selectedIndex);
		this.addMember.gendervalue = this.gender.getDisplay(args.selectedIndex);
		//console.log(this.addMember.gendervalue);
	}
	onRelChange(args) {
		this.addMember.relindx = args.selectedIndex;
		this.addMember.relationItemId = this.relation.getValue(args.selectedIndex);
		this.addMember.relationvalue = this.relation.getDisplay(args.selectedIndex);
	}
};