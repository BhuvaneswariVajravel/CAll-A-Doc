import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
let xml2js = require('nativescript-xml2js');


@Component({
	moduleId: module.id,
	templateUrl: "./inboxview.component.html",
	providers: [WebAPIService, Configuration]
})
export class InboxviewComponent {
	isVisible: boolean = false; itemDetails: any = [];
	constructor(private page: Page, private router: Router, private actRoute: ActivatedRoute, private webapi: WebAPIService) { }
	popupbtn() {
		this.isVisible = !this.isVisible;
	}
	popupclose() {
		this.isVisible = false;
	}
	ngOnInit() {
		let self = this;
		this.page.actionBarHidden = true;
		self.actRoute.queryParams.subscribe(params => {
			if (params["inboxItem"] != undefined && self.webapi.netConnectivityCheck()) {
				self.webapi.loader.show(self.webapi.options);
				let inboxItem = JSON.parse(params["inboxItem"]);
				this.webapi.getInboxItemDtls(inboxItem.ItemId).subscribe(data => {
					xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
						if (result.APIResult_InboxItemDetail.Successful == "true") {
							let inboxView = result.APIResult_InboxItemDetail.ItemSummary;
							self.itemDetails.push({ "ItemId": inboxView.ItemId, "From": inboxView.From, "Subject": inboxView.Subject, "SentDate": inboxView.SentDate, "AlreadyOpened": inboxView.AlreadyOpened })
							self.hideIndicator();
						} else {
							self.hideIndicator();
							//console.log("Session expired / error in inbox item view");
						}
					});
				},
					error => {
						self.hideIndicator();
						//console.log("Error while getting consult history view data.. " + error);
					});
			}
		});
	}
	updateInboxItemStatus(item: any) {
		let self = this;
		this.webapi.inboxItemStatusUpdate(item.ItemId, true).subscribe(data => {
			xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
				if (result.APIResult.Successful == "true") {
					//console.log("UPDATED STATUS");
				} else {
					//console.log("Session expired / UPDATION Failed..");
				}
			});
		},
			error => {
			//	console.log("Error while update inbox status.. " + error);
			});
	}
	goback() {
		this.actRoute.queryParams.subscribe(params => {
			if (params["INBOX_LIST"] != undefined) {
				let navigationExtras: NavigationExtras = {
					queryParams: { "INBOX_LIST": params["INBOX_LIST"] }
				};
				this.router.navigate(["/inbox"], navigationExtras);
			} else {
				this.router.navigate(["/inbox"]);
			}
		});
	}
	hideIndicator() {
		this.webapi.loader.hide();
	}
};


