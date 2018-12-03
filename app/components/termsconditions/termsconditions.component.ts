import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import dialogs = require("ui/dialogs");
let xml2js = require("nativescript-xml2js");
@Component({
	moduleId: module.id,
	templateUrl: "./termsconditions.component.html",
	providers: [WebAPIService, Configuration]
})
export class TermsConditionsComponent {
	activateAccount: any = {};
	constructor(private page: Page, private router: Router, private activatedRoutes: ActivatedRoute, private webapi: WebAPIService) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["ACTIVATE_ACCOUNT"] != undefined) {
				this.activateAccount = JSON.parse(params["ACTIVATE_ACCOUNT"]);
			}
		});
	}
	/* To activate user account in server */
	activate() {
		if (this.webapi.netConnectivityCheck()) {
			let self = this;
			self.webapi.loader.show(self.webapi.options);
			this.webapi.activate_http(this.activateAccount).subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult_Activate.Successful == "true") {
						let navigationExtras: NavigationExtras = {
							queryParams: { "LOGIN_CREDENTIALS": JSON.stringify(result) }
						};
						self.router.navigate(["/orderconfirmation"], navigationExtras)
						self.webapi.loader.hide();
					} else {
						self.webapi.loader.hide();
						dialogs.alert({
							message: "We could not find the member in the system based on the information provided. Please call customer service 1-844-362-2447 to activate your account.",
							okButtonText: "Ok"
						});
					}
				});
			},
				error => {
					self.webapi.loader.hide();
					console.log("Error while activating. " + error);
				});
		}
	}
};