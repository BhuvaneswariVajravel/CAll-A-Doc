import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { RequestConsultModel } from "./requestconsult.model"
//import { User } from "../../shared/model/user.model";
import { RadSideComponent } from "../radside/radside.component";
let phone = require("nativescript-phone");
let application = require('application');
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
// EMERGENCY CALL

@Component({
	moduleId: module.id,
	templateUrl: "./emergencycall.component.html",
	providers: [RadSideComponent, WebAPIService, Configuration]
})
export class EmergencyCallComponent {
	//user = new User();
	requestconsult = new RequestConsultModel();
	@ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
	constructor(private page: Page, private router: Router, private activatedRoutes: ActivatedRoute) { }

	ngOnInit() {
		this.page.actionBarHidden = true;
		this.radSideComponent.rcClass = true;
		//	this.user = JSON.parse(ApplicationSettings.getString("USER"));
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined) {
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
			}
		});
	}

	callNumber() {
		let number = "911";
		let dialResult = phone.dial(number, true);
	}

	goback() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};
		this.router.navigate(["/medicalemergency"], navigationExtras);
	}

}; 
