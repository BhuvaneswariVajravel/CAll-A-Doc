import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import * as ApplicationSettings from "application-settings";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import { TextField } from "ui/text-field";
let xml2js = require('nativescript-xml2js');
@Component({
	moduleId: module.id,
	templateUrl: "./login.component.html",
	providers: [WebAPIService, Configuration]
})
export class LoginComponent {
	public username: string; public password: string;
	formSubmitted: boolean = false; errorMsg: boolean = false;
	constructor(private page: Page, private webapi: WebAPIService, private rs: RouterExtensions) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
		if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
			if (JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).NeedPasswordChange != "true")
				this.rs.navigate(["/home"], { clearHistory: true });
			else				
				this.webapi.logout();//this.rs.navigate(["/changepassword"], { clearHistory: true });
		}
	}
	loadedField(args) {
		let textfield: TextField = <TextField>args.object;
		textfield.dismissSoftInput();
		textfield.android.setFocusable(false);
		setTimeout(() => {
			textfield.android.setFocusableInTouchMode(true);
		}, 300);
	}
	doLogin(validUsername, validPassword) {
		this.formSubmitted = true; let self = this;
		if (validUsername && validPassword && self.webapi.netConnectivityCheck() && self.username.trim() != '') {
			self.webapi.loader.show(self.webapi.options);
			this.webapi.authenticate_http(this.username, this.password).subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					ApplicationSettings.setString("USER_DEFAULTS", JSON.stringify(result.APIResult_Login));
					ApplicationSettings.setString("MEMBER_ACCESS", result.APIResult_Login.ExternalMemberId);
					ApplicationSettings.setString("LOGIN_CRD", JSON.stringify({ username: self.username, password: self.password }));
					if (result.APIResult_Login.Successful == "true" && result.APIResult_Login.NeedPasswordChange == "false") {
						self.webapi.loader.hide();
						self.rs.navigate(["/home"], { clearHistory: true });
					} else if (result.APIResult_Login.Successful == "true" &&   result.APIResult_Login.NeedPasswordChange == "true") {
						self.webapi.loader.hide();
						self.rs.navigate(["/changepassword"], { clearHistory: true });
					} else {
						//console.log("error");
						self.webapi.loader.hide();
						self.errorMsg = true;
						setTimeout(function () {
							self.errorMsg = false;
						}, 6000);
					}
				});
			},
				error => {
					self.webapi.loader.hide();
				//	console.log("Error while authenticating. " + error);
				});
		}
	}
};


