import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
let xml2js = require("nativescript-xml2js");

@Component({
	moduleId: module.id,
	templateUrl: "./passwordtermsconditions.component.html",
	providers: [WebAPIService, Configuration]
})
export class PasswordTermsConditionsComponent {
	changePwd: any = {};

	isVisible: boolean = false; authorize: boolean = false; formSubmitted: boolean = false;
	constructor(private page: Page, private rs: RouterExtensions, private webapi: WebAPIService, private actRoute: ActivatedRoute) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
		this.actRoute.queryParams.subscribe(params => {
			if (params["CHANGE_PWD"] != undefined) {
				this.changePwd = JSON.parse(params["CHANGE_PWD"]);
			}
		});
	}
	changePassword() {
		let self = this;
		self.webapi.loader.show(self.webapi.options);
		this.webapi.changepassword(this.changePwd).subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult.Successful == "true") {
					self.webapi.loader.hide();
					self.isVisible = true;
				} else if (result.APIResult.Message == "Password should have at least 6 characters, and at least one digit.") {
					self.webapi.loader.hide();
					//console.log("Password not match with requirement");
				} else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
					self.webapi.loader.hide();
					self.webapi.logout();
				} else {
					self.webapi.loader.hide();
				//	console.log("Session Expired or Something went wrong in changepassword ");
				}
			});
		},
			error => {
				self.webapi.loader.hide();
				//console.log("Error in ChangePwd.. " + error);
			});
	}
	popupbtn() {
		this.formSubmitted = true;
		if (this.authorize && this.webapi.netConnectivityCheck()) {
			this.changePassword();
		}
	}
	popupclose() {
		this.isVisible = false;
		this.rs.navigate(["/home"], { clearHistory: true });
	}
	onAccepting() {
		this.authorize = !this.authorize;
	}

};


