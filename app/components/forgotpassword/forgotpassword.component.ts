import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
let xml2js = require('nativescript-xml2js');
@Component({
	moduleId: module.id,
	templateUrl: "./forgotpassword.component.html",
	providers: [WebAPIService, Configuration]
})
export class ForgotPasswordComponent {
	public username: string; public email: string; errorMsg: boolean = false;
	formSubmitted = false;
	constructor(private page: Page, private router: Router, private webapi: WebAPIService) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
	}
	submit(usernameIsValid, emailIsValid) {
		this.formSubmitted = true;
		if (usernameIsValid && emailIsValid && this.webapi.netConnectivityCheck() && this.username.trim() != '') {
			this.forgotPassword();
		}
	}
	forgotPassword() {
		let self = this; self.webapi.loader.show(self.webapi.options);
		self.webapi.forgotPassword(this.username, this.email).subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult.Successful == "true") {
					self.webapi.loader.hide();
					self.router.navigate(["/forgotpasswordconfirm"]);
				} else if (result.APIResult.Message == "We could not find a member with that Login Name and Email.") {
					self.webapi.loader.hide(); self.errorMsg = true;
					setTimeout(function () {
						self.errorMsg = false;
					}, 5000);
				} else {
					self.webapi.loader.hide();
					//console.log("Session expired or error in forgotpassword...");
				}
			});
		},
			error => {
				self.webapi.loader.hide();
			//	console.log("Error in Forgot password.... " + error);
			});
	}
};


