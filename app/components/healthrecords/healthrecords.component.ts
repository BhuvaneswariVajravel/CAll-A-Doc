import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Page } from "ui/page";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import { RadSideComponent } from "../radside/radside.component";
import { ValueList } from "nativescript-drop-down";
import { TabView } from "ui/tab-view";
import * as imagepicker from "nativescript-imagepicker";
import { takePicture } from 'nativescript-camera';
import { ImageSource } from 'tns-core-modules/image-source';
//import { ImageAsset } from 'tns-core-modules/image-asset';
import * as ApplicationSettings from "application-settings";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { RequestConsultModel } from "../home/requestconsult.model";
import { RouterExtensions } from "nativescript-angular/router";
let ImageSourceModule = require("image-source");
let xml2js = require('nativescript-xml2js');
let http_request = require("http");
let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let PhotoViewer = require("nativescript-photoviewer");
import dialogs = require("ui/dialogs");

declare let android: any;

@Component({
	moduleId: module.id,
	templateUrl: "./healthrecords.component.html",
	providers: [WebAPIService, Configuration, RadSideComponent]
})
export class HealthRecordsComponent {
	photoViewer = new PhotoViewer();
	isVisible: boolean; @ViewChild(RadSideComponent) rscomp: RadSideComponent;
	healthView: boolean = false; personalData: any = [];
	personalLsObj: any = {}; editorupdate: any = {};
	drugList: any = []; drugname: string; reaction: string; deleteDrugObj: any = {}; drugform: boolean = false;
	height = new ValueList<string>(); height2 = new ValueList<string>(); drink = new ValueList<string>(); exercise = new ValueList<string>();
	bloodgrp = new ValueList<string>(); marialstatus = new ValueList<string>(); smoke = new ValueList<string>(); smokehis = new ValueList<string>(); extimes = new ValueList<string>();
	codeListArray: any = ["EMR_HeightFeet", "EMR_HeightInches", "EMR_BloodType", "EMR_MaritalStatus", "EMR_SmokeFrequency", "EMR_DrinkFreqency", "EMR_ExerciseFrequency", "EMR_ExerciseIntensity", "EMR_SmokeHistory", "EMR_FamilyHistoryCondition"];
	editSurgery: boolean = false; viewFamily: boolean = false; editFamily: boolean = false; editMedImg: boolean = false;
	surgHisList: any = []; delSurgery: any = {}; surgform: boolean = false; surgery: string; surgwhen: string;
	medimglist: any = []; imgdate: string; medimgform: boolean = false; pic1: any = null;

	editMedication: boolean = false;
	medication: boolean = false; Medication: string;
	medicalCondition: boolean = false;
	editMode: boolean = false;
	requestconsult = new RequestConsultModel();
	mcSubmitted: boolean = false; mSubmitted: boolean = false; Description: string;
	medicationsList: any = []; medicationUsageFrequency = new ValueList<string>(); medicationItem: any = {}; msSelectedIndex: number = null; mSelectedIndex: number = null; updateMedicationItem: any = {};
	medicationStatus = new ValueList<string>([{ value: "Y", display: "Currently taking this" }, { value: "N", display: "Took it in the past" }]);
	medicalConditionsList: any = []; emrMedicalCondition = new ValueList<string>(); medicalConditionItem: any = {}; mcSelectedIndex: number = null; updateMedCondition: any = {}; mcsSelectedIndex: number = null;
	medicalConditionStatus = new ValueList<string>([{ value: "Y", display: "Currently in condition" }, { value: "N", display: "Had condition in past" }]);

	familyHistoryItem: any = []; familyHistoryCondition: any = []; familyHistory: any = []; updateFamilyHistoryItem: any = {};
	familyHistoryWho = new ValueList<string>(); fSelectedIndex: number = null; addNewMember: boolean = false; addFHForm: boolean = false;
	usrdata: any = {};
	constructor(private page: Page, private webapi: WebAPIService, private _changeDetectionRef: ChangeDetectorRef, private router: Router, private actR: ActivatedRoute, private rs: RouterExtensions) { }
	ngOnInit() {
		this.page.actionBarHidden = true; this.rscomp.hlthClass = true;
	}
	ngAfterViewInit() {
		this.getPersonalData();
		this.actR.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined) {
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
			}
		});
		if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
			let data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
			this.usrdata.GroupNumber = data.GroupNumber;
			this.usrdata.Key = data.Key;
			this.usrdata.ExternalMemberId = data.ExternalMemberId;
		}
		if (ApplicationSettings.hasKey("USER")) {
			let data = JSON.parse(ApplicationSettings.getString("USER"));
			this.usrdata.ExternalMemberId = data.ExternalMemberId;
		}
	}
	editPersonal() {
		this.healthView = true;
	}

	/* To Auto select the all drop dropdowns dynamically with user data */

	codeList() {
		let self = this;
		if (this.webapi.netConnectivityCheck()) {
			for (let j = 0; j < self.codeListArray.length; ++j) {
				this.webapi.getCodeList(self.codeListArray[j]).subscribe(data => {
					xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
						if (result.APIResult_CodeList.Successful == "true") {
							let items = result.APIResult_CodeList.List;
							switch (true) {
								case j == 0:
									self.height = new ValueList<string>();
									for (let i = 0; i < items.ItemCount; i++) {
										self.height.push({ value: items.List.CodeListItem[i].ItemId, display: items.List.CodeListItem[i].Value });
										if (self.personalData.Height != undefined && items.List.CodeListItem[i].Value == self.personalData.Height.split(";", 2)[0])
											self.personalLsObj.htindx = i;
									}
									break;
								case j == 1:
									self.height2 = new ValueList<string>();
									for (let k = 0; k < items.ItemCount; k++) {
										self.height2.push({ value: items.List.CodeListItem[k].ItemId, display: items.List.CodeListItem[k].Value });
										if (self.personalData.Height != undefined && items.List.CodeListItem[k].Value == self.personalData.Height.split(";", 2)[1])
											self.personalLsObj.htindx1 = k;
									}
									break;
								case j == 2:
									self.bloodgrp = new ValueList<string>();
									for (let l = 0; l < items.ItemCount; l++) {
										self.bloodgrp.push({ value: items.List.CodeListItem[l].ItemId, display: items.List.CodeListItem[l].Value });
										if (items.List.CodeListItem[l].Value == self.personalData.BloodType)
											self.personalLsObj.bloodIndex = l;
									}
									break;
								case j == 3:
									self.marialstatus = new ValueList<string>();
									for (let m = 0; m < items.ItemCount; m++) {
										self.marialstatus.push({ value: items.List.CodeListItem[m].ItemId, display: items.List.CodeListItem[m].Value });
										if (items.List.CodeListItem[m].Value == self.personalData.MaritalStatus)
											self.personalLsObj.maritalIndex = m;
									}
									break;
								case j == 4:
									self.smoke = new ValueList<string>();
									for (let n = 0; n < items.ItemCount; n++) {
										self.smoke.push({ value: items.List.CodeListItem[n].ItemId, display: items.List.CodeListItem[n].Value });
										if (items.List.CodeListItem[n].Value == self.personalData.Smoke.split(",", 2)[0])
											self.personalLsObj.smokeIndx = n;
									}
									break;
								case j == 5:
									self.drink = new ValueList<string>();
									for (let o = 0; o < items.ItemCount; o++) {
										self.drink.push({ value: items.List.CodeListItem[o].ItemId, display: items.List.CodeListItem[o].Value });
										if (items.List.CodeListItem[o].Value == self.personalData.Drink)
											self.personalLsObj.drinkIndx = o;
									}
									break;
								case j == 6:
									self.exercise = new ValueList<string>();
									for (let p = 0; p < items.ItemCount; p++) {
										self.exercise.push({ value: items.List.CodeListItem[p].ItemId, display: items.List.CodeListItem[p].Value });
										if (items.List.CodeListItem[p].Value == self.personalData.Exercise.split(", ", 2)[0])
											self.personalLsObj.exIndex = p;
									}
									break;
								case j == 7:
									self.extimes = new ValueList<string>();
									for (let q = 0; q < items.ItemCount; q++) {
										self.extimes.push({ value: items.List.CodeListItem[q].ItemId, display: items.List.CodeListItem[q].Value });
										if (items.List.CodeListItem[q].Value == self.personalData.Exercise.split(", ", 2)[1])
											self.personalLsObj.extimeIndx = q;
									}
									break;
								case j == 8:
									self.smokehis = new ValueList<string>();
									for (let r = 0; r < items.ItemCount; r++) {
										self.smokehis.push({ value: items.List.CodeListItem[r].ItemId, display: items.List.CodeListItem[r].Value });
										if (items.List.CodeListItem[r].Value == self.personalData.Smoke.split(", ", 2)[1])
											self.personalLsObj.smoktindx = r;
									}
									break;
								case j == 9:
									for (let s = 0; s < items.ItemCount; s++) {
										self.familyHistoryCondition.push(items.List.CodeListItem[s]);
									}
									break;
								default:
								//console.log("CodeList over.............................");
							}
						} else {
							//console.log("Error in getting the codelist index. " + self.codeListArray[j]);
						}
					});
				},
					error => {
						//console.log("Error in getting the CodeList " + error);
					});
			}
		}
	}

	/* To get Personal Lifestyle Tab data from server */
	getPersonalData() {
		let self = this;
		self.webapi.personalAndLSSummary("EMR_PersonalAndLifeStyle_Summary_Get").subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult_EMRPersonalAndLifeStyle_Summary.Successful == "true") {
					self.personalData = result.APIResult_EMRPersonalAndLifeStyle_Summary.Content;
					self.codeList();
				} else {
					if (result.APIResult_EMRPersonalAndLifeStyle_Summary.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					}
					//console.log("Session expired or error in getting personal data...");
				}
			});
		},
			error => {
				//console.log("Error in Personal and Lifestyle.... " + error);
			});
	}
	onHeight1Change(args) {
		this.personalLsObj.HeightFeetItemId = this.height.getValue(args.selectedIndex);
		this.personalLsObj.HeightFeetItem = this.height.getDisplay(args.selectedIndex);
		this.personalLsObj.htindx = args.selectedIndex;
	}
	onHeight2Change(args) {
		this.personalLsObj.HeightInchesItemId = this.height2.getValue(args.selectedIndex);
		this.personalLsObj.HeightInchesItem = this.height2.getDisplay(args.selectedIndex);
		this.personalLsObj.htindx1 = args.selectedIndex;
	}
	onBloodTypeChange(args) {
		this.personalLsObj.BloodTypeItemId = this.bloodgrp.getValue(args.selectedIndex);
		this.personalLsObj.BloodTypeItem = this.bloodgrp.getDisplay(args.selectedIndex);
	}
	onMaritalStateChange(args) {
		this.personalLsObj.MaritalStatusItemId = this.marialstatus.getValue(args.selectedIndex);
		this.personalLsObj.MaritalStatusItem = this.marialstatus.getDisplay(args.selectedIndex);
	}
	onSmokeChange(args) {
		this.personalLsObj.SmokeStatusItemId = this.smoke.getValue(args.selectedIndex);
		this.personalLsObj.SmokeStatusItem = this.smoke.getDisplay(args.selectedIndex);
	}
	onSmokeTimeChange(args) {
		this.personalLsObj.SmokeLengthItemId = this.smokehis.getValue(args.selectedIndex);
		this.personalLsObj.SmokeLengthItem = this.smokehis.getDisplay(args.selectedIndex);
	}
	onDrinkChange(args) {
		this.personalLsObj.DrinkItemId = this.drink.getValue(args.selectedIndex);
		this.personalLsObj.DrinkItem = this.drink.getDisplay(args.selectedIndex);
	}
	onExerciseChange(args) {
		this.personalLsObj.ExerciseItemId = this.exercise.getValue(args.selectedIndex);
		this.personalLsObj.ExerciseItem = this.exercise.getDisplay(args.selectedIndex);
	}
	onExerciseTimeChange(args) {
		this.personalLsObj.ExerciseLengthItemId = this.extimes.getValue(args.selectedIndex);
		this.personalLsObj.ExerciseLengthItem = this.extimes.getDisplay(args.selectedIndex);
	}

	/* To Update Personal Lifestyle data to server */
	updatePersonalInfo() {

		if (this.webapi.netConnectivityCheck()) {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<?xml version='1.0' encoding='UTF-8'?>" +
				"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
				"<soapenv:Body><web:EMR_PersonalAndLifeStyle_Save><web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
				"<web:HeightFeetItem>" + this.personalLsObj.HeightFeetItem + "</web:HeightFeetItem>" +
				"<web:HeightFeetItemId>" + this.personalLsObj.HeightFeetItemId + "</web:HeightFeetItemId>" +
				"<web:HeightInchesItem>" + this.personalLsObj.HeightInchesItem + "</web:HeightInchesItem>" +
				"<web:HeightInchesItemId>" + this.personalLsObj.HeightInchesItemId + "</web:HeightInchesItemId>" +
				"<web:WeightPounds>" + this.personalData.Weight + "</web:WeightPounds>" +
				"<web:BloodTypeItem>" + this.personalLsObj.BloodTypeItem + "</web:BloodTypeItem >" +
				"<web:BloodTypeItemId>" + this.personalLsObj.BloodTypeItemId + "</web:BloodTypeItemId>" +
				"<web:BloodPressureSystolic/><web:BloodPressureDiastolic/>" +
				"<web:MaritalStatusItem>" + this.personalLsObj.MaritalStatusItem + "</web:MaritalStatusItem>" +
				"<web:MaritalStatusItemId>" + this.personalLsObj.MaritalStatusItemId + "</web:MaritalStatusItemId>" +
				"<web:SmokeStatusItem>" + this.personalLsObj.SmokeStatusItem + "</web:SmokeStatusItem>" +
				"<web:SmokeStatusItemId>" + this.personalLsObj.SmokeStatusItemId + "</web:SmokeStatusItemId>" +
				"<web:SmokeLengthItem>" + this.personalLsObj.SmokeLengthItem + "</web:SmokeLengthItem>" +
				"<web:SmokeLengthItemId>" + this.personalLsObj.SmokeLengthItemId + "</web:SmokeLengthItemId>" +
				"<web:DrinkItem>" + this.personalLsObj.DrinkItem + "</web:DrinkItem>" +
				"<web:DrinkItemId>" + this.personalLsObj.DrinkItemId + "</web:DrinkItemId>" +
				"<web:ExerciseItem>" + this.personalLsObj.ExerciseItem + "</web:ExerciseItem>" +
				"<web:ExerciseItemId>" + this.personalLsObj.ExerciseItemId + "</web:ExerciseItemId>" +
				"<web:ExerciseLengthItem>" + this.personalLsObj.ExerciseLengthItem + "</web:ExerciseLengthItem>" +
				"<web:ExerciseLengthItemId>" + this.personalLsObj.ExerciseLengthItemId + "</web:ExerciseLengthItemId>" +
				"</web:Content><web:Demo/></web:EMR_PersonalAndLifeStyle_Save></soapenv:Body></soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					let resp = result['soap:Envelope']['soap:Body'].EMR_PersonalAndLifeStyle_SaveResponse.EMR_PersonalAndLifeStyle_SaveResult;
					if (resp.Successful == "true") {
						self.healthView = false;
					} else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						//console.log("Session expired or Error in Save PF");
					}
				});
			}, function (e) {
				//console.log("Error::: " + e);
			});
		}
	}

	/* To update Surgery details To  server ie. add or delete or update */
	updateOrAddSurgery(operation, surgname, when) {
		this.surgform = true;

		if (operation == 'Add') {
			operation = (operation == 'Add' && this.editorupdate.add == 1) ? "Add" : "Update";
			if (this.editorupdate.add == 1) {
				this.delSurgery.ItemId = 0; this.delSurgery.Surgery = this.surgery; this.delSurgery.When = this.surgwhen;
			} else {
				this.delSurgery.Surgery = this.surgery; this.delSurgery.When = this.surgwhen;
			}
		}
		if ((operation == 'Delete' || (surgname && when && this.surgery.trim() != '' && this.surgwhen.trim() != '')) && this.webapi.netConnectivityCheck()) {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<?xml version='1.0' encoding='UTF-8'?>" +
				"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
				"<soapenv:Body><web:EMR_SurgeryHistory_Save><web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
				"<web:ItemId>" + this.delSurgery.ItemId + "</web:ItemId>" +
				"<web:Surgery>" + this.delSurgery.Surgery + "</web:Surgery>" +
				"<web:When>" + this.delSurgery.When + "</web:When>" +
				"</web:Content><web:Action>" + operation + "</web:Action><web:Demo/>" +
				"</web:EMR_SurgeryHistory_Save></soapenv:Body></soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					let resp = result['soap:Envelope']['soap:Body'].EMR_SurgeryHistory_SaveResponse.EMR_SurgeryHistory_SaveResult;
					self.delSurgery.selected = false;
					if (resp.Successful == "true" && operation == 'Delete') {
						self.surgHisList.splice(self.surgHisList.indexOf(self.delSurgery), 1);
						self.delSurgery.indx = -1;
					} else if (resp.Successful == "true" && operation == 'Add') {
						self.editSurgery = false; let additem = resp.SurgeryHistoryList.EMR_SurgeryItem;
						if (additem.length != undefined)
							self.surgHisList.push({ "ItemId": additem[additem.length - 1].ItemId, "Surgery": additem[additem.length - 1].Surgery, "When": additem[additem.length - 1].When, "img": "res://rededit" });
						else
							self.surgHisList.push({ "ItemId": additem.ItemId, "Surgery": additem.Surgery, "When": additem.When, "img": "res://rededit" });
					} else if (resp.Successful == "true" && operation == 'Update') {
						self.editSurgery = false; self.surgHisList[self.delSurgery.index] = self.delSurgery;
					} else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						//console.log("Session expired or Error in delete surgery");
					}
				});
			}, function (e) {
				//console.log("Error:: " + e);
			});
		}
	}
	/* Loading the data dynamically when user changes tab by using tab index */
	onTabChange(args) {
		let tabView = <TabView>args.object;
		switch (true) {
			case tabView.selectedIndex == 1 && this.drugList.length == 0:
				this.drugAllergyGet();
				break;
			case tabView.selectedIndex == 2 && this.medicationsList.length == 0:
				this.getMedicationsList();
				break;
			case tabView.selectedIndex == 3 && this.medicalConditionsList.length == 0:
				this.getMedicalConditionsList();
				break;
			case tabView.selectedIndex == 4 && this.surgHisList.length == 0:
				this.surgeryHisGet();
				break;
			case tabView.selectedIndex == 5 && this.familyHistory.length == 0:
				this.getFamilyHistoryList();
				break;
			case tabView.selectedIndex == 6 && this.medimglist.length == 0:
				this.medicalImagList();
				break;
			default:
			//console.log("Nothing.............................");
		}
	}
	/* To Get drug allergies list from server */
	drugAllergyGet() {
		let self = this;
		self.webapi.gridGetInHealth("EMR_DrugAllergy_Grid_Get").subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult_EMRDrugAllergy_Grid.Successful == "true" && result.APIResult_EMRDrugAllergy_Grid.DrugAllergyCount != '0') {
					self.drugList = [];
					let drugs = result.APIResult_EMRDrugAllergy_Grid.DrugAllergyList.EMR_DrugAllergyItem;
					if (drugs.length != undefined) {
						for (let i = 0; i < drugs.length; i++) {
							//	self.drugList.push(drugs[i]);
							self.drugList.push({ "ItemId": drugs[i].ItemId, "Drug": drugs[i].Drug, "Reaction": drugs[i].Reaction, "img": "res://rededit" });
						}
					} else {
						self.drugList.push({ "ItemId": drugs.ItemId, "Drug": drugs.Drug, "Reaction": drugs.Reaction, "img": "res://rededit" });
					}
				} else if (result.APIResult_EMRDrugAllergy_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
					self.webapi.logout();
				} else {
					//console.log("error or no drug allergies");
				}
			});
		},
			error => {
				//console.log("Error in Drug.... " + error);
			});
	}

	showMedication() {
		this.medication = true;
	}
	closeMedicationStatus() {
		this.medication = false;
	}
	/* To View Medication data */
	editMedicationDetails(medItem) {
		this.editMedication = true;
		this.mSubmitted = false;
		this.medicationItem = medItem;
		this.Medication = medItem.Medication;
		this.getMedicationUsageFrequency();
	}
	closeMedication() {
		this.mSelectedIndex = null;
		this.msSelectedIndex = null;
		this.Medication = null;
		this.editMedication = false;
	}
	/* To get Medication List from Server */

	getMedicationsList() {
		let self = this;
		self.medicationsList = [];
		self.webapi.getMedications_http().subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult_EMRMedications_Grid.Successful == "true" && result.APIResult_EMRMedications_Grid.MedicationCount != '0') {
					let m = parseInt(result.APIResult_EMRMedications_Grid.MedicationCount);
					if (m == 1) {
						result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem.img = "res://rededit";
						self.medicationsList.push(result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem);
					} else {
						for (let i = 0; i < m; i++) {
							result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem[i].img = "res://rededit";
							self.medicationsList.push(result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem[i])
						}
					}
				} else if (result.APIResult_EMRMedications_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
					self.webapi.logout();
				} else {
					//console.log("Error/No Medications");
				}
			});
		},
			error => {
				//console.log("Error in Medications.... " + error);
			});
	}
	/* To Load drop down data ie medical usage frequency dynamically */
	getMedicationUsageFrequency() {
		let self = this;
		if (self.medicationUsageFrequency.length == 0) {
			self.webapi.getCodeList("EMR_MedicationUsageFrequency").subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult_CodeList.Successful == "true") {
						for (let loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
							self.medicationUsageFrequency.setItem(loop, {
								value: result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId,
								display: result.APIResult_CodeList.List.List.CodeListItem[loop].Value,
							});
							if (result.APIResult_CodeList.List.List.CodeListItem[loop].Value == self.medicationItem.Frequency) {
								self.mSelectedIndex = loop;
							}
						}
					} else {
						//console.log("Error/No Medications");
					}
				});
			},
				error => {
					//console.log("Error in Medications.... " + error);
				});
		} else {
			for (let loop = 0; loop < self.medicationUsageFrequency.length; loop++) {
				if (self.medicationUsageFrequency.getDisplay(loop) == self.medicationItem.Frequency) {
					self.mSelectedIndex = loop;
				}
			}
		}
		for (let loop = 0; loop < self.medicationStatus.length; loop++) {
			if (self.medicationItem.Status.toLowerCase().indexOf("current") >= 0) {
				self.msSelectedIndex = 0;
			} else if ((self.medicationItem.Status.toLowerCase().indexOf("past") >= 0) || (self.medicalConditionItem.Status.toLowerCase().indexOf("before") >= 0)) {
				self.msSelectedIndex = 1;
			}
		}
	}
	onMedicationUsageFrequencyChange(args) {
		this.mSelectedIndex = args.selectedIndex;
		this.updateMedicationItem.FrequencyItemId = this.medicationUsageFrequency.getValue(args.selectedIndex);
		this.updateMedicationItem.Frequency = this.medicationUsageFrequency.getDisplay(args.selectedIndex);
	}

	onNedicationStatusChange(args) {
		this.msSelectedIndex = args.selectedIndex;
		this.updateMedicationItem.Status = this.medicationStatus.getValue(args.selectedIndex);
	}
	/* To Update Or Add Medications */
	updateMedications() {
		this.mSubmitted = true;
		if (this.medicationItem.ItemId != undefined) {
			this.updateMedicationItem.Action = "Update";
			this.updateMedicationItem.ItemId = this.medicationItem.ItemId;
		} else {
			this.updateMedicationItem.Action = "Add";
			this.updateMedicationItem.ItemId = 0;
		}
		this.updateMedicationItem.Medication = this.Medication;
		if (this.updateMedicationItem.Medication != undefined && this.updateMedicationItem.Medication != "" && this.updateMedicationItem.Frequency != undefined && this.updateMedicationItem.Status != undefined) {

			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Header/>" +
				"<soapenv:Body>" +
				"<web:EMR_Medication_Save>" +
				"<web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
				"<web:Content>" +
				"<web:ItemId>" + this.updateMedicationItem.ItemId + "</web:ItemId>" +
				"<web:Medication>" + this.updateMedicationItem.Medication + "</web:Medication>" +
				"<web:Frequency>" + this.updateMedicationItem.Frequency + "</web:Frequency>" +
				"<web:FrequencyItemId>" + this.updateMedicationItem.FrequencyItemId + "</web:FrequencyItemId>" +
				"<web:Status>" + this.updateMedicationItem.Status + "</web:Status>" +
				"</web:Content>" +
				"<web:Action>" + this.updateMedicationItem.Action + "</web:Action>" +
				"<web:Demo></web:Demo>" +
				"</web:EMR_Medication_Save>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {

					let res = result['soap:Envelope']['soap:Body'].EMR_Medication_SaveResponse.EMR_Medication_SaveResult;
					if (res.Successful == "true") {
						self.editMedication = false;
						self.getMedicationsList();
					} else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						alert("Error while updating medical condition. / Session expired.Try After some time ");
						//console.log("Error while updating medical condition.");
					}
				});
			}, function (e) {
				//console.log("Error:-- " + e);
			});
		}
	}
	/* To Delete Medication Based on medication ItemId */
	deleteMedications() {
		if (this.delMedication.Medication != undefined && this.delMedication.Frequency != undefined && this.delMedication.Status != undefined) {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Header/>" +
				"<soapenv:Body>" +
				"<web:EMR_Medication_Save>" +
				"<web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
				"<web:Content>" +
				"<web:ItemId>" + this.delMedication.ItemId + "</web:ItemId>" +
				"<web:Medication>" + this.delMedication.Medication + "</web:Medication>" +
				"<web:Frequency>" + this.delMedication.Frequency + "</web:Frequency>" +
				"<web:FrequencyItemId>" + this.delMedication.FrequencyItemId + "</web:FrequencyItemId>" +
				"<web:Status>" + this.delMedication.Status + "</web:Status>" +
				"</web:Content>" +
				"<web:Action>Delete</web:Action>" +
				"<web:Demo></web:Demo>" +
				"</web:EMR_Medication_Save>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					let res = result['soap:Envelope']['soap:Body'].EMR_Medication_SaveResponse.EMR_Medication_SaveResult;
					if (res.Successful == "true") {
						self.editMedication = false;
						self.delMedication = {};
						self.getMedicationsList();
						self.delMedication.index = -1;
					} else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						//	alert("Error while updating medical condition. / Session expired.Try After some time ");
						//console.log("Error while updating medical condition.");
					}
				});
			}, function (e) {
				//console.log("Error:++ " + e);
			});
		}
	}

	addMedication() {
		this.editMedication = true;
		this.mSubmitted = false;
		this.medicationItem = {};
		this.mSelectedIndex = null;
		this.msSelectedIndex = null;
		this.Medication = "";
		this.getMedicationUsageFrequency();
	}
	delMedication: any = {};
	onSelectMedication(i, item) {
		for (let index in this.medicationsList) {
			this.medicationsList[index].img = "res://rededit";
		}
		this.medicationsList[i].img = "res://checkedicon";
		this.delMedication = item;
		this.delMedication.selected = true;
		this.delMedication.index = i;
	}
	editMedicalCondition(item) {
		this.editMode = true;
		this.mcSubmitted = false;
		this.medicalConditionItem = item;
		this.Description = item.Description;
		this.getEMRMedicalConditionsList();
	}
	closeMedicalCondition() {
		this.mcSelectedIndex = null;
		this.mcsSelectedIndex = null;
		this.Description = "";
		this.editMode = false;
	}
	delMedicalCondition: any = {};
	onSelectMedicalCondition(i, item) {
		for (let index in this.medicalConditionsList) {
			this.medicalConditionsList[index].img = "res://rededit";
		}
		this.medicalConditionsList[i].img = "res://checkedicon";
		this.delMedicalCondition = item;
		this.delMedicalCondition.selected = true;
		this.delMedicalCondition.index = i;
	}

	/* To get Medical condition list  */

	getMedicalConditionsList() {
		let self = this;
		self.medicalConditionsList = [];
		self.webapi.getMedicalConditions_http().subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult_EMRMedicalCondition_Grid.Successful == "true" && result.APIResult_EMRMedicalCondition_Grid.MedicalConditionCount != '0') {
					let m = parseInt(result.APIResult_EMRMedicalCondition_Grid.MedicalConditionCount);
					if (m == 1) {
						result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem.img = "res://rededit";
						self.medicalConditionsList.push(result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem);
					} else {
						for (let i = 0; i < m; i++) {
							result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem[i].img = "res://rededit";
							self.medicalConditionsList.push(result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem[i])
						}
					}
				} else {
					//console.log("Error/No Medications");
				}
			});
		},
			error => {
				//console.log("Error in Medications.... " + error);
			});
	}

	/* To load drop down Get Emr medical conditions List */

	getEMRMedicalConditionsList() {
		let self = this;
		if (self.emrMedicalCondition.length == 0) {
			self.webapi.getCodeList("EMR_MedicalCondition").subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult_CodeList.Successful == "true") {
						for (let loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
							self.emrMedicalCondition.setItem(loop, {
								value: result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId,
								display: result.APIResult_CodeList.List.List.CodeListItem[loop].Value,
							});
							if (result.APIResult_CodeList.List.List.CodeListItem[loop].Value == self.medicalConditionItem.MedicalCondition) {
								self.mcSelectedIndex = loop;
							}
						}
					} else {
						//console.log("Error/No Medications");
					}
				});
			},
				error => {
					//console.log("Error in Medications.... " + error);
				});
		} else {
			for (let loop = 0; loop < self.emrMedicalCondition.length; loop++) {
				if (self.medicalConditionItem.MedicalCondition == self.emrMedicalCondition.getDisplay(loop)) {
					self.mcSelectedIndex = loop;
				}
			}
		}
		for (let loop = 0; loop < self.medicalConditionStatus.length; loop++) {
			if (self.medicalConditionItem.Status.toLowerCase().indexOf("current") >= 0) {
				self.mcsSelectedIndex = 0;
			} else if ((self.medicalConditionItem.Status.toLowerCase().indexOf("past") >= 0) || (self.medicalConditionItem.Status.toLowerCase().indexOf("before") >= 0)) {
				self.mcsSelectedIndex = 1;
			}
		}
	}

	onMedicalConditionChange(args) {
		this.mcSelectedIndex = args.selectedIndex;
		this.updateMedCondition.MedicalConditionItemId = this.emrMedicalCondition.getValue(args.selectedIndex);
		this.updateMedCondition.MedicalCondition = this.emrMedicalCondition.getDisplay(args.selectedIndex);
	}

	onNedicalConditionStatusChange(args) {
		this.mcsSelectedIndex = args.selectedIndex;
		this.updateMedCondition.Status = this.medicalConditionStatus.getValue(args.selectedIndex);
	}

	/* To Update Medical condition */

	updateMedicalCondition() {
		this.mcSubmitted = true;
		if (this.medicalConditionItem.ItemId != undefined) {
			this.updateMedCondition.Action = "Update";
			this.updateMedCondition.ItemId = this.medicalConditionItem.ItemId;
		} else {
			this.updateMedCondition.Action = "Add";
			this.updateMedCondition.ItemId = 0;
		}
		this.updateMedCondition.Description = this.Description;
		//this.updateMedCondition.Description = this.medicalConditionItem.Description;
		if (this.updateMedCondition.MedicalCondition != undefined && this.updateMedCondition.Description != "" && this.updateMedCondition.Description != undefined && this.updateMedCondition.Status != undefined) {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Header/>" +
				"<soapenv:Body>" +
				"<web:EMR_MedicalCondition_Save>" +
				"<web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
				"<web:Content>" +
				"<web:ItemId>" + this.updateMedCondition.ItemId + "</web:ItemId>" +
				"<web:MedicalCondition>" + this.updateMedCondition.MedicalCondition + "</web:MedicalCondition>" +
				"<web:MedicalConditionItemId>" + this.updateMedCondition.MedicalConditionItemId + "</web:MedicalConditionItemId>" +
				"<web:Description>" + this.updateMedCondition.Description + "</web:Description>" +
				"<web:Status>" + this.updateMedCondition.Status + "</web:Status>" +
				"</web:Content>" +
				"<web:Action>" + this.updateMedCondition.Action + "</web:Action>" +
				"<web:Demo></web:Demo>" +
				"</web:EMR_MedicalCondition_Save>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					let res = result['soap:Envelope']['soap:Body'].EMR_MedicalCondition_SaveResponse.EMR_MedicalCondition_SaveResult;
					if (res.Successful == "true") {
						self.editMode = false;
						self.getMedicalConditionsList();
					} else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						alert("Error while updating medical condition. / Session expired.Try After some time ");
						//console.log("Error while updating medical condition.");
					}
				});
			}, function (e) {
				//console.log("Error:> " + e);
			});
		}
	}

	/* To delete Medical condition */

	deleteMedicalConditions() {
		if (this.delMedicalCondition.MedicalCondition != undefined && this.delMedicalCondition.Description != undefined && this.delMedicalCondition.Status != undefined) {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Header/>" +
				"<soapenv:Body>" +
				"<web:EMR_MedicalCondition_Save>" +
				"<web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
				"<web:Content>" +
				"<web:ItemId>" + this.delMedicalCondition.ItemId + "</web:ItemId>" +
				"<web:MedicalCondition>" + this.delMedicalCondition.MedicalCondition + "</web:MedicalCondition>" +
				"<web:MedicalConditionItemId>" + this.delMedicalCondition.MedicalConditionItemId + "</web:MedicalConditionItemId>" +
				"<web:Description>" + this.delMedicalCondition.Description + "</web:Description>" +
				"<web:Status>" + this.delMedicalCondition.Status + "</web:Status>" +
				"</web:Content>" +
				"<web:Action>Delete</web:Action>" +
				"<web:Demo></web:Demo>" +
				"</web:EMR_MedicalCondition_Save>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					let res = result['soap:Envelope']['soap:Body'].EMR_MedicalCondition_SaveResponse.EMR_MedicalCondition_SaveResult;
					if (res.Successful == "true") {
						self.editMode = false; self.delMedicalCondition.index = -1;
						self.getMedicalConditionsList();
						self.delMedicalCondition = {};
					} else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						alert("Error while updating medical condition. / Session expired.Try After some time ");
						//console.log("Error while updating medical condition.");
					}
				});
			}, function (e) {
				//console.log("Error:<< " + e);
			});
		}
	}
	addMedicalCondition() {
		this.editMode = true;
		this.mcSubmitted = false;
		this.medicalConditionItem = {};
		this.mcSelectedIndex = null;
		this.mcsSelectedIndex = null;
		this.getEMRMedicalConditionsList();
	}

	/* To get Surgery history List from server*/
	surgeryHisGet() {
		let self = this;
		self.webapi.gridGetInHealth("EMR_SurgeryHistory_Grid_Get").subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult_EMRSurgeryHistory_Grid.Successful == "true" && result.APIResult_EMRSurgeryHistory_Grid.SurgeryHistoryCount != '0') {
					self.surgHisList = [];
					let surgery = result.APIResult_EMRSurgeryHistory_Grid.SurgeryHistoryList.EMR_SurgeryItem;
					if (surgery.length != undefined) {
						for (let i = 0; i < surgery.length; i++) {
							self.surgHisList.push({ "ItemId": surgery[i].ItemId, "Surgery": surgery[i].Surgery, "When": surgery[i].When, "img": "res://rededit" });
						}
					} else {
						self.surgHisList.push({ "ItemId": surgery.ItemId, "Surgery": surgery.Surgery, "When": surgery.When, "img": "res://rededit" });
					}
				} else if (result.APIResult_EMRSurgeryHistory_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
					self.webapi.logout();
				} else {
					//console.log("error or no sugery his-->" + result.APIResult_EMRSurgeryHistory_Grid.Message);
				}
			});
		},
			error => {
				//console.log("Error in Surgery His " + error);
			});
	}
	imageViewArray: any = [];
	/* To load all medical images List from server */
	medicalImagList() {
		let self = this;
		self.webapi.gridGetInHealth("EMR_MedicalImage_Grid_Get").subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult_EMRMedicalImage_Grid.Successful == "true" && result.APIResult_EMRMedicalImage_Grid.MedicalImageCount != '0') {
					self.medimglist = []; self.imageViewArray = [];
					let images = result.APIResult_EMRMedicalImage_Grid.MedicalImageList.EMR_MedicalImageItem;
					if (images.length != undefined) {
						for (let i = 0; i < images.length; i++) {
							self.medimglist.push(images[i]);
							self.imageViewArray.push('https://www.247calladoc.com/member/' + self.medimglist[i].ImageSourceSmallURL);//To view in photo viewer
						}
					} else {
						self.medimglist.push(images);
					}
					self.createItemSpec(self.medimglist.length / 3);
				} else if (result.APIResult_EMRMedicalImage_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
					self.webapi.logout();
				} else {
					//console.log("error / no images-->" + result.APIResult_EMRMedicalImage_Grid.Message);
				}
			});
		},
			error => {
				//console.log("Error in Medical Images His " + error);
			});
	}
	itemSpec: any = [];
	createItemSpec(length) {
		for (let i = 0; i < length; i++) {
			this.itemSpec.push("auto");
		}
		return this.itemSpec.join(",");
	}
	isValidDate() {
		let date = this.imgdate;
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
	editDrug(item: any, i) {
		if (this.deleteDrugObj.selected != true) {
			this.isVisible = true; this.deleteDrugObj = {};
			this.drugname = item.Drug; this.editorupdate.add = 0; this.drugform = false; this.reaction = item.Reaction;
			this.deleteDrugObj.ItemId = item.ItemId; this.deleteDrugObj.index = i; this.deleteDrugObj.img = "res://rededit";
		}
	}
	editSurgeryHis(item: any, i) {
		if (this.delSurgery.selected != true) {
			this.editSurgery = true; this.delSurgery = {};
			this.surgery = item.Surgery; this.editorupdate.add = 0; this.surgform = false; this.surgwhen = item.When;
			this.delSurgery.ItemId = item.ItemId; this.delSurgery.index = i; this.delSurgery.img = "res://rededit";
		}
	}
	addDrug() {
		this.isVisible = true; this.drugname = ""; this.reaction = "";
		this.deleteDrugObj = {}; this.editorupdate.add = 1; this.drugform = false;
	}
	addSurgery() {
		this.editSurgery = true; this.surgery = ""; this.surgwhen = "";
		this.delSurgery = {}; this.editorupdate.add = 1; this.surgform = false;
	}

	editMedicalImages() {
		this.editMedImg = true; this.medimgform = false; this.imgdate = ""; this.pic1 = null;
	}
	popupclose() {
		this.isVisible = false; this.editSurgery = false; this.editMedImg = false;
	}
	onSelectDrug(i, item) {
		for (let index in this.drugList) {
			this.drugList[index].img = "res://rededit";
		}
		this.drugList[i].img = "res://checkedicon";
		this.deleteDrugObj = item;
		this.deleteDrugObj.selected = true;
		this.deleteDrugObj.indx = i;
	}
	cancelSelect() {
		this.deleteDrugObj.selected = false;
		this.delSurgery.selected = false;
		this.delMedication.selected = false;
		this.delMedicalCondition.selected = false;
		for (let i in this.drugList) {
			this.drugList[i].img = "res://rededit";
			this.deleteDrugObj.indx = -1;
		}
		for (let j in this.surgHisList) {
			this.surgHisList[j].img = "res://rededit";
			this.delSurgery.indx = -1;
		}
		for (let k in this.medicationsList) {
			this.medicationsList[k].img = "res://rededit";
			this.delMedication.index = -1
		}
		for (let l in this.medicalConditionsList) {
			this.medicalConditionsList[l].img = "res://rededit";
			this.delMedicalCondition.index = -1;
		}
	}
	onSelectSurgery(i, item) {
		for (let index in this.surgHisList) {
			this.surgHisList[index].img = "res://rededit";
		}
		this.surgHisList[i].img = "res://checkedicon";
		this.delSurgery = item;
		this.delSurgery.selected = true;
		this.delSurgery.indx = i;
	}
	/* To Add or update or delete drug allergy in server */
	updateOrAddDrug(operation, drug, react) {
		this.drugform = true;

		if (operation == 'Add') {
			operation = (operation == 'Add' && this.editorupdate.add == 1) ? "Add" : "Update";
			if (this.editorupdate.add == 1) {
				this.deleteDrugObj.ItemId = 0; this.deleteDrugObj.Drug = this.drugname; this.deleteDrugObj.Reaction = this.reaction;
			} else {
				this.deleteDrugObj.Drug = this.drugname; this.deleteDrugObj.Reaction = this.reaction;
			}
		}
		if ((operation == 'Delete' || (drug && react && this.drugname.trim() != '' && this.reaction.trim() != '')) && this.webapi.netConnectivityCheck()) {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<?xml version='1.0' encoding='UTF-8'?>" +
				"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
				"<soapenv:Body><web:EMR_DrugAllergy_Save><web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
				"<web:ItemId>" + this.deleteDrugObj.ItemId + "</web:ItemId>" +
				"<web:Drug>" + this.deleteDrugObj.Drug + "</web:Drug>" +
				"<web:Reaction>" + this.deleteDrugObj.Reaction + "</web:Reaction>" +
				"</web:Content><web:Action>" + operation + "</web:Action><web:Demo/>" +
				"</web:EMR_DrugAllergy_Save></soapenv:Body></soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					self.deleteDrugObj.selected = false; self.deleteDrugObj.indx = -1;
					let resp = result['soap:Envelope']['soap:Body'].EMR_DrugAllergy_SaveResponse.EMR_DrugAllergy_SaveResult;
					if (resp.Successful == "true" && operation == 'Delete') {
						self.drugList.splice(self.drugList.indexOf(self.deleteDrugObj), 1);
					} else if (resp.Successful == "true" && operation == 'Add') {
						self.isVisible = false; let additem = resp.DrugAllergyList.EMR_DrugAllergyItem;
						if (additem.length != undefined)
							self.drugList.push({ "ItemId": additem[additem.length - 1].ItemId, "Drug": additem[additem.length - 1].Drug, "Reaction": additem[additem.length - 1].Reaction, "img": "res://rededit" });
						else
							self.drugList.push({ "ItemId": additem.ItemId, "Drug": additem.Drug, "Reaction": additem.Reaction, "img": "res://rededit" });
					} else if (resp.Successful == "true" && operation == 'Update') {
						self.isVisible = false;
						self.drugList[self.deleteDrugObj.index] = self.deleteDrugObj;
					} else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						//console.log("Session expired or Error in delete drug " + result.Message);
					}
				});
			}, function (e) {
				//console.log("Error:// " + e);
			});
		}
	}
	onSelectSingleTap() {
		if (this.pic1 == null) {
			let context = imagepicker.create({
				mode: "single"
			});
			this.startSelection(context);
		} else {
			alert("User can upload only 1 images");
		}
	}
	imgdtls: any = {};
	/* Selecting image from gallery */
	startSelection(context) {
		let _that = this;
		context
			.authorize()
			.then(() => {
				return context.present();
			})
			.then((selection) => {
				selection.forEach(function (selected) {
					selected.getImage().then(res => {
						//	if (application.android) {
						_that.imgdtls.imageName = "test.jpg";
						_that.imgdtls.base64textString = res.toBase64String("jpg", 10);// To convert image in to base64
						_that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;

						/*	} else if (application.ios) {
								let defManager = NSFileManager.defaultManager;
								let fileAttributes = defManager.attributesOfItemAtPathError(selected.fileUri);
								console.log("ios");
								console.log(defManager);
								let fileSizeNumber = fileAttributes.objectForKey(NSFileSize);
								console.log(fileSizeNumber);
								_that.imgdtls.imageSize = fileSizeNumber / 1000;
								//   file_size = fileSizeNumber / 1000;
								console.log("file size in bytes");
						}*/
					});
					if (_that.pic1 == null) {
						_that.pic1 = selected;
					}
				});
				_that._changeDetectionRef.detectChanges();
			}).catch(function (e) {
				console.log(e);
			});
	}
	/* Checking Android Permissions */
	onRequestPermissionsTap() {
		if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
			permissions.requestPermission(android.Manifest.permission.CAMERA, "I need these permissions to read from storage")
				.then(() => {
					//console.log("Permissions granted!");
					this.onTakePictureTap();
				})
				.catch(() => {
					//console.log("Uh oh, no permissions - plan B time!");
					alert("You don't have permission to access the camera");
				});
		} else {
			this.onTakePictureTap();
		}
	}
	//cameraImage: ImageAsset;
	/* Taking Picture from Camera and upload*/
	onTakePictureTap() {
		let _that = this;
		takePicture({ width: 180, height: 180, keepAspectRatio: false, saveToGallery: true })
			.then((imageAsset) => {
				let source = new ImageSource();
				source.fromAsset(imageAsset).then((source) => {
					//console.log(`Size: ${source.width}x${source.height}`);
					_that.imgdtls.imageName = "sample.jpg";
					_that.imgdtls.base64textString = source.toBase64String("jpg", 10);
					_that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
				});
				//	_that.cameraImage = imageAsset;
				if (_that.pic1 == null) {
					_that.pic1 = imageAsset;
				}
			}, (error) => {
				//console.log("Error: " + error);
			});
	}

	deleteImage(id) {
		if (id == "pic1") {
			this.pic1 = null;
		}
	}
	deleteImageWithConfirm(date, operation, data: any) {
		let self = this;
		dialogs.confirm({
			message: "Are you sure you want to delete image?",
			okButtonText: "Yes",
			cancelButtonText: "No",
		}).then(function (result) {
			if (result)
				self.delOrUploadMedImage(date, operation, data);
		});
	}
	/* To add or delete the uploaded medical images in server */
	delOrUploadMedImage(date, operation, data: any) {
		let item: any = {}; this.medimgform = true;
		if (this.webapi.netConnectivityCheck()) {
			let self = this;
			self.webapi.loader.show(self.webapi.options);
			if (operation == "Add") {
				item.ItemId = 0; item.ImageTakeTime = this.imgdate;
				item.TheDocument = {};
				item.ImageSourceSmallURL = "test"; item.ImageSourceNormalURL = "test";
				item.TheDocument.FileName = this.imgdtls.imageName; item.TheDocument.DocumentType = "MedicalImage"; item.TheDocument.FileSize = this.imgdtls.imageSize;
				item.TheDocument.FileData = this.imgdtls.base64textString; item.TheDocument.ItemId = "0";
			} else if (operation == "Delete") {
				item.TheDocument = {};
				item.ItemId = data.ItemId; item.TheDocument = data.TheDocument; item.TheDocument.FileData = "";
				item.ImageTakeTime = ""; item.ImageSourceSmallURL = ""; item.ImageSourceNormalURL = "";
				item.TheDocument.ItemId = ""; item.TheDocument.FileName = "";
				item.TheDocument.FileSize = 0; item.TheDocument.FileData = "";
			}
			if (((date && this.isValidDate() && this.pic1 != null) || (operation == 'Delete')) && this.webapi.netConnectivityCheck()) {
				http_request.request({
					url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
					method: "POST",
					headers: { "Content-Type": "text/xml" },
					content: "<?xml version='1.0' encoding='utf-8'?>" +
					"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
					"<soapenv:Body>" +
					"<web:EMR_MedicalImage_Save xmlns='https://www.247CallADoc.com/WebServices/'>" +
					"<web:Key>" + this.usrdata.Key + "</web:Key>" +
					"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
					"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
					"<web:Action>" + operation + "</web:Action>" +
					"<web:Content>" + "<web:ItemId>" + item.ItemId + "</web:ItemId>" +
					"<web:ImageTakeTime>" + item.ImageTakeTime + "</web:ImageTakeTime>" +
					"<web:ImageSourceSmallURL>" + item.ImageSourceSmallURL + "</web:ImageSourceSmallURL>" +
					"<web:ImageSourceNormalURL>" + item.ImageSourceNormalURL + "</web:ImageSourceNormalURL>" +
					"<web:TheDocument>" +
					"<web:DocumentType>" + item.TheDocument.DocumentType + "</web:DocumentType>" +
					"<web:ItemId>" + item.TheDocument.ItemId + "</web:ItemId>" +
					"<web:FileName>" + item.TheDocument.FileName + "</web:FileName>" +
					"<web:FileSize>" + item.TheDocument.FileSize + "</web:FileSize>" +
					"<web:FileData>" + item.TheDocument.FileData + "</web:FileData>" +
					"</web:TheDocument></web:Content><web:Demo/></web:EMR_MedicalImage_Save></soapenv:Body>" +
					"</soapenv:Envelope>"
				}).then((response) => {
					xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
						//console.log(response.content);
						self.webapi.loader.hide();
						if (result) {
							let resp = result['soap:Envelope']['soap:Body'].EMR_MedicalImage_SaveResponse.EMR_MedicalImage_SaveResult;
							if (resp.Successful == "true" && operation == "Add") {
								self.medicalImagList();
								//console.log(":::::::::::::::::::::::SUCCESS::::::::::::::::::::::::::::");
								self.editMedImg = false; self.pic1 = null;
							} else if (resp.Successful == "true" && operation == "Delete") {
								let indx = self.medimglist.indexOf(data);
								self.medimglist.splice(indx, 1);
								self.imageViewArray.splice(indx, 1);

							} else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
								self.webapi.logout();
							} else {
								self.editMedImg = false; self.pic1 = null;
								alert("Image format or size is not supported. Please try with another image.");
							}
						}
					});
				}, function (e) {
					self.webapi.loader.hide();
					//console.log("Error:... " + e);
				});
			}
		}
	}

	ViewFamilyHistory(fItemId) {
		this.viewFamily = true;
		this.familyHistoryItem = []; this.updateFamilyHistoryItem = {};
		for (let i = 0; i < this.familyHistory.length; i++) {
			if (fItemId == this.familyHistory[i].ConditionItemId) {
				this.familyHistoryItem.push(this.familyHistory[i]);
			}
		}
		this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[0].Answer;
		this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[0].Condition;
		this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[0].ConditionItemId;
	}

	closeViewFamilyHistory() {
		this.viewFamily = false;
	}

	editFamilyHistory(fItemId) {
		this.editFamily = true;
		this.addNewMember = false;
		this.familyHistoryItem = []; this.updateFamilyHistoryItem = {};
		for (let i = 0; i < this.familyHistory.length; i++) {
			if (fItemId == this.familyHistory[i].ConditionItemId) {
				this.familyHistoryItem.push(this.familyHistory[i]);
			}
		}
		this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[0].Answer;
		this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[0].Condition;
		this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[0].ConditionItemId;

		this.fSelectedIndex = null;
		this.getFamilyHistoryWho();
	}

	editFamilyHistoryItem(itemId) {
		this.addNewMember = true;
		for (let i = 0; i < this.familyHistoryItem.length; i++) {
			if (itemId == this.familyHistoryItem[i].ItemId) {
				this.updateFamilyHistoryItem.WhoItemId = this.familyHistoryItem[i].WhoItemId;
				this.updateFamilyHistoryItem.WhatAge = this.familyHistoryItem[i].WhatAge;
				this.updateFamilyHistoryItem.Description = this.familyHistoryItem[i].Description;
				this.updateFamilyHistoryItem.ItemId = this.familyHistoryItem[i].ItemId
				this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[i].Answer;
				this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[i].Condition;
				this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[i].ConditionItemId;
			}
		}
		for (let loop = 0; loop < this.familyHistoryWho.length; loop++) {
			if (this.updateFamilyHistoryItem.WhoItemId == this.familyHistoryWho.getValue(loop)) {
				this.fSelectedIndex = loop;
			}
		}
	}

	closeFamilyHistory() {
		this.editFamily = false;
		this.fSelectedIndex = null;
		this.getFamilyHistoryList();
	}

	onAnswerChange(ans) {
		this.updateFamilyHistoryItem.Answer = ans;
		this.addNewMember = false;
		if (ans == 'Y')
			this.familyHistoryItem[0].Answer = ans;
	}
	/* To get Family History List */
	getFamilyHistoryList() {
		let self = this;
		self.webapi.getFamilyHistory_http().subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				let l = parseInt(result.APIResult_EMRFamilyHistory_Grid.FamilyHistoryCount);
				if (result.APIResult_EMRFamilyHistory_Grid.Successful == "true" && l > 0) {
					self.familyHistory = [];
					if (l > 1) {
						for (let i = 0; i < l; i++) {
							self.familyHistory.push(result.APIResult_EMRFamilyHistory_Grid.FamilyHistoryList.EMR_FamilyHistoryItem[i]);
						}
					} else {
						self.familyHistory.push(result.APIResult_EMRFamilyHistory_Grid.FamilyHistoryList.EMR_FamilyHistoryItem);
					}
					for (let l = 0; l < self.familyHistory.length; l++) {
						for (let m = 0; m < self.familyHistoryCondition.length; m++) {
							if (self.familyHistory[l].ConditionItemId == self.familyHistoryCondition[m].ItemId) {
								self.familyHistoryCondition[m].Answer = self.familyHistory[l].Answer;
							}
						}
					}
				} else if (result.APIResult_EMRFamilyHistory_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
					self.webapi.logout();
				} else {
					//console.log("Error or No family History");
				}
			});

		},
			error => {
				//console.log("Error in Family History.... " + error);
			});
	}
	/* To load the family relation dropdown */
	getFamilyHistoryWho() {
		let self = this;
		if (self.familyHistoryWho.length == 0) {
			self.webapi.getCodeList("EMR_FamilyHistoryWho").subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult_CodeList.Successful == "true") {
						for (let loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
							self.familyHistoryWho.setItem(loop, {
								value: result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId,
								display: result.APIResult_CodeList.List.List.CodeListItem[loop].Value,
							});

							if (result.APIResult_CodeList.List.List.CodeListItem[loop].Value == self.familyHistoryItem.Who) {
								self.fSelectedIndex = loop;
							}
						}
					} else {
						//console.log("Error/No Medications");
					}
				});
			},
				error => {
					//console.log("Error in Medications.... " + error);
				});
		} else {
			for (let loop = 0; loop < self.familyHistoryWho.length; loop++) {
				if (self.familyHistoryItem.Who == self.familyHistoryWho.getDisplay(loop)) {
					self.fSelectedIndex = loop;
				}
			}
		}
	}

	showForm() {
		this.addNewMember = true;
		this.updateFamilyHistoryItem = {};
		this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[0].Answer;
		this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[0].Condition;
		this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[0].ConditionItemId;
		this.fSelectedIndex = null;
	}

	hideForm() {
		this.addNewMember = false;
	}

	/* To add or update New Family History Item */
	addNewFamilyHistoryItem() {
		this.addFHForm = true;

		if (this.updateFamilyHistoryItem.ItemId != undefined && parseInt(this.updateFamilyHistoryItem.ItemId) != 0) {

			this.updateFamilyHistoryItem.Action = "Update";
		} else {
			this.updateFamilyHistoryItem.ItemId = 0;
			this.updateFamilyHistoryItem.Action = "Add";
		}
		if (this.updateFamilyHistoryItem.Description == undefined || this.updateFamilyHistoryItem.Description == null) {
			this.updateFamilyHistoryItem.Description = ""
		}

		if (this.updateFamilyHistoryItem.Who != undefined && this.updateFamilyHistoryItem.Who != "" && this.updateFamilyHistoryItem.WhatAge != undefined && this.updateFamilyHistoryItem.WhatAge != "") {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Header/>" +
				"<soapenv:Body>" +
				"<web:EMR_FamilyHistory_Save xmlns='https://www.247CallADoc.com/WebServices/'>" +
				"<web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
				"<web:Content>" +
				"<web:Answer>" + this.updateFamilyHistoryItem.Answer + "</web:Answer>" +
				"<web:ItemId>" + this.updateFamilyHistoryItem.ItemId + "</web:ItemId>" +
				"<web:Condition>" + this.updateFamilyHistoryItem.Condition + "</web:Condition>" +
				"<web:ConditionItemId>" + this.updateFamilyHistoryItem.ConditionItemId + "</web:ConditionItemId>" +
				"<web:Who>" + this.updateFamilyHistoryItem.Who + "</web:Who>" +
				"<web:WhoItemId>" + this.updateFamilyHistoryItem.WhoItemId + "</web:WhoItemId>" +
				"<web:WhatAge>" + this.updateFamilyHistoryItem.WhatAge + "</web:WhatAge>" +
				"<web:Description>" + this.updateFamilyHistoryItem.Description + "</web:Description>" +
				"</web:Content>" +
				"<web:Action>" + this.updateFamilyHistoryItem.Action + "</web:Action>" +
				"<web:Demo></web:Demo>" +
				"</web:EMR_FamilyHistory_Save>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {

					let res = result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult;
					if (res.Successful == "true") {
						self.familyHistoryItem = [];//this.updateFamilyHistoryItem={};
						let l = parseInt(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryCount);
						for (let i = 0; i < l; i++) {
							if (self.updateFamilyHistoryItem.ConditionItemId == result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i].ConditionItemId) {
								self.familyHistoryItem.push(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i]);
							}
						}
						self.addFHForm = false;
						self.addNewMember = false;
						self.fSelectedIndex = null;
					} else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						alert("Error while updating family History item. / Session expired.Try After some time ");
						//console.log("Error while updating medical condition.");
					}
				});
			}, function (e) {
				//console.log("Error:? " + e.Message);
			});
		}
	}
	/* To Delete Family History Item */
	deleteFamilyHistoryItem(itemId) {
		for (let i = 0; i < this.familyHistoryItem.length; i++) {
			if (itemId == this.familyHistoryItem[i].ItemId) {
				this.updateFamilyHistoryItem.Who = this.familyHistoryItem[i].Who;
				this.updateFamilyHistoryItem.WhoItemId = this.familyHistoryItem[i].WhoItemId;
				this.updateFamilyHistoryItem.WhatAge = this.familyHistoryItem[i].WhatAge;
				this.updateFamilyHistoryItem.Description = this.familyHistoryItem[i].Description;
				this.updateFamilyHistoryItem.ItemId = this.familyHistoryItem[i].ItemId
				this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[i].Answer;
				this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[i].Condition;
				this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[i].ConditionItemId;
			}
		}
		if (this.updateFamilyHistoryItem.Who != undefined && this.updateFamilyHistoryItem.Who != "" && this.updateFamilyHistoryItem.WhatAge != undefined && this.updateFamilyHistoryItem.WhatAge != "") {
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
				"<soapenv:Header/>" +
				"<soapenv:Body>" +
				"<web:EMR_FamilyHistory_Save xmlns='https://www.247CallADoc.com/WebServices/'>" +
				"<web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
				"<web:Content>" +
				"<web:Answer>" + this.updateFamilyHistoryItem.Answer + "</web:Answer>" +
				"<web:ItemId>" + this.updateFamilyHistoryItem.ItemId + "</web:ItemId>" +
				"<web:Condition>" + this.updateFamilyHistoryItem.Condition + "</web:Condition>" +
				"<web:ConditionItemId>" + this.updateFamilyHistoryItem.ConditionItemId + "</web:ConditionItemId>" +
				"<web:Who>" + this.updateFamilyHistoryItem.Who + "</web:Who>" +
				"<web:WhoItemId>" + this.updateFamilyHistoryItem.WhoItemId + "</web:WhoItemId>" +
				"<web:WhatAge>" + this.updateFamilyHistoryItem.WhatAge + "</web:WhatAge>" +
				"<web:Description>" + this.updateFamilyHistoryItem.Description + "</web:Description>" +
				"</web:Content>" +
				"<web:Action>Delete</web:Action>" +
				"<web:Demo></web:Demo>" +
				"</web:EMR_FamilyHistory_Save>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>"
			}).then((response) => {
				let self = this;
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					let res = result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult;
					if (res.Successful == "true") {
						self.familyHistoryItem = [];//this.updateFamilyHistoryItem={};
						let l = parseInt(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryCount);
						for (let i = 0; i < l; i++) {
							if (self.updateFamilyHistoryItem.ConditionItemId == result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i].ConditionItemId) {
								self.familyHistoryItem.push(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i]);
							}
						}
						self.addFHForm = false;
						self.addNewMember = false;
						self.fSelectedIndex = null;
					} else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.logout();
					} else {
						alert("Error while updating family History item. / Session expired.Try After some time ");
						//console.log("Error while updating medical condition.");
					}
				});
			}, function (e) {
				//console.log("Error:>>>> " + e.Message);
			});
		}
	}

	onFamilyHistoryWhoChange(args) {
		this.fSelectedIndex = args.selectedIndex;
		this.updateFamilyHistoryItem.Who = this.familyHistoryWho.getDisplay(args.selectedIndex);
		this.updateFamilyHistoryItem.WhoItemId = this.familyHistoryWho.getValue(args.selectedIndex);
	}

	updateFamilyCondition() {
		//	console.log(this.familyHistoryItem[0].ItemId + "  +++  " + this.familyHistoryItem.length);
		if (this.familyHistoryItem[0].ItemId == 0 && !this.addNewMember) {
			let self = this;
			let conditionId = this.updateFamilyHistoryItem.ConditionItemId;
			let type = this.updateFamilyHistoryItem.Answer;
			if (type == "Y") {
				type = "Yes";
			} else if (type == "N") {
				type = "None";
			} else if (type == "U") {
				type = "Unknown";
			}
			self.webapi.setFamilyHistoryCondition_http(conditionId, type).subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult.Successful == "true") {
						self.closeFamilyHistory();
					} else {
						//console.log("Error in Updating Family History Conditions");
					}
				});
			},
				error => {
					//console.log("Error in Updating Family History Condition.... " + error);
				});
		}
	}

	goback() {
		if (this.requestconsult.ServiceName != undefined) {
			if (this.webapi.netConnectivityCheck()) {
				//this.consultationFeeDetails();
				let navigationExtras: NavigationExtras = {
					queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
				};
				this.router.navigate(["/healthrecords"], navigationExtras);
			}
		} else {
			this.rs.navigate(["/home"], { clearHistory: true });
		}
	}
	/* To Show Payment Fee details */
	consultationFeeDetails() {
		let self = this; self.webapi.loader.show(self.webapi.options);
		self.webapi.consultationFeeDetails(this.requestconsult.ServiceType).subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult_ConsultFee.Successful == "true") {
					self.requestconsult.ConsultAvailable = result.APIResult_ConsultFee.ConsultAvailable;
					self.requestconsult.ConsultFee = result.APIResult_ConsultFee.ConsultFee;
					self.requestconsult.FeeDescription = result.APIResult_ConsultFee.FeeDescription;

					if (self.requestconsult.FeeDescription != "Free") {
						self.showingPayment();
					} else {
						self.freeCheckUp();
					}
				} else {
					self.webapi.loader.hide();
					//console.log("Session expired/Acccess denied .Try after some time ...");
				}
			});
		},
			error => {
				self.webapi.loader.hide();
				//console.log("Error in Consultation feedetails... " + error);
			});
	}

	showingPayment() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		}; this.webapi.loader.hide();
		if ((this.requestconsult.ServiceType == 3 || this.requestconsult.ServiceType == 7) && this.requestconsult.UserPreferredPharmacy != null) {
			this.router.navigate(["/pharmacy"], navigationExtras);
		} else if (this.requestconsult.ServiceType == 3 || this.requestconsult.ServiceType == 7) {
			this.router.navigate(["/searchpharmacy"], navigationExtras);
		} else if (this.requestconsult.ServiceType == 4) {
			this.router.navigate(["/creditcard"], navigationExtras);
		}
	}

	freeCheckUp() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		}; this.webapi.loader.hide();

		if ((this.requestconsult.ServiceType == 3 || this.requestconsult.ServiceType == 7) && this.requestconsult.UserPreferredPharmacy != null) {
			this.router.navigate(["/pharmacy"], navigationExtras);
		} else if ((this.requestconsult.ServiceType == 3 || this.requestconsult.ServiceType == 7) && this.requestconsult.UserPreferredPharmacy == null) {
			this.router.navigate(["/searchpharmacy"], navigationExtras);
		} else if (this.requestconsult.ServiceType == 4) {
			this.router.navigate(["/secureemail"], navigationExtras);
		}
	}
	/* To show Images in a Image viewer */
	showImageInPhotoViewer(i) {
		this.photoViewer.showViewer(this.imageViewArray);
	}

};