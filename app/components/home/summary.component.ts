import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import * as ApplicationSettings from "application-settings";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";

// SUMMARY

@Component({
	moduleId: module.id,
	templateUrl: "./summary.component.html",
	providers: [RadSideComponent, WebAPIService, Configuration]
})
export class SummaryComponent {
	requestconsult = new RequestConsultModel();
	scheduledTime: any;
	user: any = {};
	consultList: any = [];
	@ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
	constructor(private page: Page, private router: Router, private activatedRoutes: ActivatedRoute, private webapi:WebAPIService) { }
	ngOnInit() {
		this.page.actionBarHidden = true; this.radSideComponent.rcClass = true;
		if (ApplicationSettings.hasKey("USER")) {
			this.user = JSON.parse(ApplicationSettings.getString("USER"));
		}
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined)
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
		});
		//	console.log(JSON.stringify(this.requestconsult));
		if (this.requestconsult.ScheduleTimeNow) {
			let date = new Date();
			this.scheduledTime = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		} else {
			this.scheduledTime = this.requestconsult.ScheduleTimeFuture;
		}

		if (this.requestconsult.ShortTermConditionChecked) {
			let input: any = {};
			input.conditionType = "Short Term Medical Condition";
			input.conditionDescription = this.requestconsult.ShortTermConditionDescription;
			this.consultList.push(input);
		}

		if (this.requestconsult.LongTermConditionChecked) {
			let input: any = {};
			input.conditionType = "Long Term Medical Condition";
			input.conditionDescription = this.requestconsult.LongTermConditionDescription;
			this.consultList.push(input);
		}

		if (this.requestconsult.MedicationRefillChecked) {
			let input: any = {};
			input.conditionType = "Medication Refill";
			input.conditionDescription = this.requestconsult.MedicationRefillDescription1 + "," + this.requestconsult.MedicationRefillDescription2;;
			this.consultList.push(input);
		}

		if (this.requestconsult.OtherHealthIssuesChecked) {
			let input: any = {};
			input.conditionType = "Other Health Issues";
			input.conditionDescription = this.requestconsult.OtherHealthIssuesDescription;
			this.consultList.push(input);
		}
	}

	goback() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};
		this.router.navigate(["/billing"], navigationExtras);
	}

	showNextPage() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};
		this.router.navigate(["/additionalquestions"], navigationExtras);
	}
	  convertTime(time24) {
        return this.webapi.convertTime24to12(time24);
    }
};


