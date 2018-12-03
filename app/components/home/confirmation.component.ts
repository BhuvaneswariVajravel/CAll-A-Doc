import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import { RequestConsultModel } from "./requestconsult.model";
// CONFIRMATION
@Component({
	moduleId: module.id,
	templateUrl: "./confirmation.component.html"
})
export class ConfirmationComponent {
	requestconsult = new RequestConsultModel();
	diagnosticconsult: boolean = false; emailconsult: boolean = false;
	constructor(private page: Page, private activatedRoutes: ActivatedRoute) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined) {
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
				if (this.requestconsult.ServiceType == 3 || this.requestconsult.ServiceType == 7) {
					this.diagnosticconsult = true;
				} else if (this.requestconsult.ServiceType == 4) {
					this.emailconsult = true;
				}
			}
		});
	}
};
