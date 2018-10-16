import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";
let xml2js = require('nativescript-xml2js');

// CREADIT DEBIT CARD
@Component({
	moduleId: module.id,
	templateUrl: "./creditcard.component.html",
	providers: [Configuration, WebAPIService, RadSideComponent]
})
export class CreditCardComponent {
	requestconsult = new RequestConsultModel(); billingInfo: any = {}; formSubmitted = false;
		@ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
	//public cardno: string; public cardname: string; 
	//mSelectedIndex: number = 0; selectedMonth: string; public cvv: string;
	//	ySelectedIndex: number = 0; selectedYear: string; 
	years: any = [];
	months: any = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
	constructor(private page: Page, private router: Router, private webapi: WebAPIService, private activatedRoutes: ActivatedRoute) { }
	ngOnInit() {
		this.radSideComponent.rcClass = true;
		for (let i = 0; i < 12; i++) {
			this.years.push((new Date()).getFullYear() + i);
		}
		this.page.actionBarHidden = true;
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined) {
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
			}
		});
	}
	ngAfterViewInit() {
		let self = this;
		if (self.webapi.netConnectivityCheck()) {
			self.webapi.getBillingInfo().subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult_CCInfo.Successful == "true") {
						self.billingInfo = result.APIResult_CCInfo;
						self.billingInfo.monthindx = self.months.indexOf(self.billingInfo.ExpMonth);
						self.billingInfo.yearindx = self.years.indexOf(new Date(self.billingInfo.ExpYear).getFullYear());
						self.billingInfo.ConsultFee = self.requestconsult.ConsultFee;
						self.billingInfo.ServiceType = self.requestconsult.ServiceType;
					} else if (result.APIResult_CCInfo.Message == "Please login using MemberLogin screen to get the key before calling any API functions") {
						//console.log("LOGOUT DUE SESSION TIME OUT IN CREDIT CARDDETAILS --->" + result.APIResult_CCInfo.Message);
						self.webapi.logout();
					} else {
						//console.log("Session expired or error in getting billing data...");
					}
				});
			},
				error => {
				//	console.log("Error in getting billing data.... " + error);
				});
		}

	}
	onMonthChange(args) {
		this.billingInfo.month = this.months[args.value];
	}
	onYearChange(args) {
		this.billingInfo.year = this.years[args.value];
	}
	showNextPage(cardnum, name, cvv) {
		this.formSubmitted = true; let self = this;
		if (cardnum && name && cvv && self.isValidCard() && self.webapi.netConnectivityCheck()) {
			self.webapi.loader.show(self.webapi.options);
		//	console.log("PaymentAmount: " + self.billingInfo.ConsultFee + " FeeScheduleMasterId: " + self.billingInfo.CardNumber + " ServiceId: " + self.billingInfo.ServiceType);
			self.webapi.paymentGateway(self.billingInfo).subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult.Successful == "true") {
				//		console.log("PAYMENT SUCCESFULL");
						let navigationExtras: NavigationExtras = {
							queryParams: { "REQUEST_CONSULT": JSON.stringify(self.requestconsult) }
						};
						if (self.requestconsult.ServiceType == 3) {
							self.router.navigate(["/billing"], navigationExtras);
						} else {
							self.router.navigate(["/secureemail"], navigationExtras);
						}
						self.webapi.loader.hide();
					} else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.loader.hide();
						//console.log("LOGOUT DUE SESSION TIME OUT IN CREDIT CARD --->" + result.APIResult.Message);
						self.webapi.logout();
					} else {
						self.billingInfo.errorMsg = "Your payment is unsuccessful. Please call customer support to resolve.";
						self.billingInfo.error = true;
						setTimeout(function () {
							self.billingInfo.error = false;
						}, 6000);
						self.webapi.loader.hide();
						//console.log("Session expired or error in payment data...");
					}
				});
			},
				error => {
					self.billingInfo.errorMsg = "Something went wrong with your card details. Please check.";
					self.billingInfo.error = true;
					setTimeout(function () {
						self.billingInfo.error = false;
					}, 6000);
					self.webapi.loader.hide();
					//console.log("Error in getting payment gateway.... " + error);
				});
		}
	}
	isValidCard() {
		if (this.billingInfo.CardNumber.indexOf('************') > -1 && this.billingInfo.CardNumber.indexOf('-') > -1) {
			return true;
		} else {
			return /^([0-9]{16})$/.test(this.billingInfo.CardNumber);
			//return /^(^[0-9]{17})$/.test(this.billingInfo.CardNumber);
		}
	}
	goback() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};
		if (this.requestconsult.ServiceType == 4) {
			this.router.navigate(["/healthrecords"], navigationExtras);
		} else if (this.requestconsult.ServiceType == 3 && this.requestconsult.SetPreferredPharmacy) {
			this.router.navigate(["/pharmacy"], navigationExtras);
		} else {
			this.router.navigate(["/searchpharmacy"], navigationExtras);
		}
	}
}; 
