import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
@Component({
	moduleId: module.id,
	templateUrl: "./orderconfirmation.component.html"
})
export class OrderconfirmationComponent {
	activateAccount: any = {};
	constructor(private page: Page, private activatedRoutes: ActivatedRoute) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["LOGIN_CREDENTIALS"] != undefined) {
				this.activateAccount = JSON.parse(params["LOGIN_CREDENTIALS"]);// Afetr successive response from server activateAccount data will fetch here.
				//console.log(JSON.stringify(this.activateAccount));
			}
		});
	}
};


