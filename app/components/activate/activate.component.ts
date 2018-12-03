import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";

@Component({
	moduleId: module.id,
	templateUrl: "./activate.component.html",
	providers: [WebAPIService, Configuration]
})
export class ActivateComponent {
	firstName: string; lastName: string; dob: string; externalMemberId: string; authorize: boolean = false;
	formSubmitted = false;
	constructor(private page: Page, private router: Router, private webapi: WebAPIService) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
	}
	/* Navigate to Terms and condition once we get user acceptence */
	gotoTermsAndConditions(firstnameIsValid, lastnameIsValid, dobIsValid, memberIdIsValid) {
		this.formSubmitted = true;
		if (firstnameIsValid && lastnameIsValid && dobIsValid && memberIdIsValid && this.authorize && this.isValidDate() && this.firstName.trim() != '' && this.lastName.trim() != '' && this.webapi.netConnectivityCheck()) {
			let activateAccount: any = {};
			activateAccount.FirstName = this.firstName;
			activateAccount.LastName = this.lastName;
			activateAccount.DOB = this.dob;
			activateAccount.ExternalMemberId = this.externalMemberId;
			let navigationExtras: NavigationExtras = {
				queryParams: { "ACTIVATE_ACCOUNT": JSON.stringify(activateAccount) }
			};
			this.router.navigate(["/termsconditions"], navigationExtras);
		}
	}
	/* To Validate date */
	isValidDate() {
		let date = this.dob;
		let matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
		if (matches == null) return false;
		let d: any = matches[2];
		let m: any;
		m = parseInt(matches[1]) - 1;
		let y: any = matches[3];
		let composedDate = new Date(y, m, d);
		return composedDate.getDate() == d &&
			composedDate.getMonth() == m &&
			composedDate.getFullYear() == y && composedDate.getTime() < new Date().getTime();
	}
	onAccepting() {
		this.authorize = !this.authorize;
	}
};