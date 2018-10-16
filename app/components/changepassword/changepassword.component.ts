import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import { RouterExtensions } from "nativescript-angular/router";
import * as ApplicationSettings from "application-settings";

@Component({
	moduleId: module.id,
	templateUrl: "./changepassword.component.html",
	providers: [WebAPIService, Configuration]
})
export class ChangePasswordComponent {
	public username: string; public memberid: any; public password: string; public cnfmpassword: string; matchFlag: boolean = false;
	formSubmitted: boolean = false; validPwd: boolean = false;
	constructor(private page: Page, private webapi: WebAPIService, private router: Router, private rs: RouterExtensions) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
		if (ApplicationSettings.hasKey("USER_DEFAULTS"))
			this.memberid = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId;
		if (ApplicationSettings.hasKey("LOGIN_CRD"))
			this.username = JSON.parse(ApplicationSettings.getString("LOGIN_CRD")).username;

		//console.log(this.memberid+"====="+this.username);
	}
	changePwd(newpwd) {
		this.formSubmitted = true; let self = this;
		if (this.cnfmpassword != this.password) {
			self.matchFlag = true;
			return
		}
		self.matchFlag = false; self.validPwd = false;
		if (newpwd && !this.matchFlag && this.isAlphaNum()) {
			let changePassword: any = {};
			changePassword.Password = this.password;
			changePassword.ConfirmPassword = this.cnfmpassword;
			let navigationExtras: NavigationExtras = {
				queryParams: { "CHANGE_PWD": JSON.stringify(changePassword) }
			};
			this.router.navigate(["/passwordtermsconditions"], navigationExtras);
		}
	}
	isAlphaNum() {
		//return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9$@$!%*#?&-₹+;:"]+)$/.test(this.password);
		return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9$@$!%*#?&-₹_+]+)$/.test(this.password);
	}
	loadedField(args) {
		let textfield: TextField = <TextField>args.object;
		textfield.dismissSoftInput();
		textfield.android.setFocusable(false);
		setTimeout(() => {
			textfield.android.setFocusableInTouchMode(true);
		}, 300);
	}
	pwdChecker(args) {
		let textField = <TextField>args.object;
		if (textField.text != this.password)
			this.matchFlag = true;
		else
			this.matchFlag = false;
	}
	logOut() {
		this.webapi.clearCache();
		this.rs.navigate(["/login"], { clearHistory: true });
	}
};


