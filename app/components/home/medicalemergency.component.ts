import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";

// MEDICAL EMERGENCY
let application = require('application');
@Component({
	moduleId: module.id,
	templateUrl: "./medicalemergency.component.html",
	providers: [RadSideComponent, WebAPIService, Configuration]
})
export class MedicalEmergencyComponent {
	requestconsult = new RequestConsultModel();
	@ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
	constructor(private page: Page, private router: Router, private activatedRoutes: ActivatedRoute) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
		this.radSideComponent.rcClass = true; this.radSideComponent.navIcon = false;
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined)
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
		});
	}
	showNextPage(page) {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};
		this.router.navigate(["/" + page], navigationExtras);
	}
	goback() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};
		this.router.navigate(["/servicetype"], navigationExtras);
	}
};