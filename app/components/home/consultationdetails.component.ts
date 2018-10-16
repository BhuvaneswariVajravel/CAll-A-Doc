import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
// CONSULTATION DETAILS 
@Component({
    moduleId: module.id,
    templateUrl: "./consultationdetails.component.html",
    providers: [RadSideComponent, WebAPIService, Configuration]
})
export class ConsultationDetailsComponent {
    public isShortTermCondChecked: boolean = false;
    public isLongTermCondChecked: boolean = false;
    public isMedicationRefillChecked: boolean = false;
    public isOtherHealthIssuesChecked: boolean = false;
    requestconsult = new RequestConsultModel();
    shortTermComplaint: any = {}; longTermComplaint: any = {}; formSubmitted = false;
    medRefill: any = {}; medRefill1: any = {}; otherIssues: any = {};
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private router: Router, private activatedRoutes: ActivatedRoute) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(params => {
            if (params["REQUEST_CONSULT"] != undefined) {
                this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                this.isShortTermCondChecked = this.requestconsult.ShortTermConditionChecked;
                this.isLongTermCondChecked = this.requestconsult.LongTermConditionChecked;
                this.isMedicationRefillChecked = this.requestconsult.MedicationRefillChecked;
                this.isOtherHealthIssuesChecked = this.requestconsult.OtherHealthIssuesChecked;
                this.shortTermComplaint.description = this.requestconsult.ShortTermConditionDescription;
                this.longTermComplaint.description = this.requestconsult.LongTermConditionDescription;
                this.medRefill.description = this.requestconsult.MedicationRefillDescription1;
                this.medRefill1.description = this.requestconsult.MedicationRefillDescription2;
                this.otherIssues.description = this.requestconsult.OtherHealthIssuesDescription;
            }
        });
    }

    OnCheckEvent(conditionType) {
        this.formSubmitted = false;
        //console.log("conditionType....   " + conditionType);
        if (conditionType == 'ShortTerm') {
            this.isShortTermCondChecked = !this.isShortTermCondChecked;
            this.isLongTermCondChecked = false; //this.longTermComplaint.description != undefined ? this.longTermComplaint.description = "" : "";
            this.isMedicationRefillChecked = false; // this.medRefill.description != undefined ? this.medRefill.description = "" : "";
            this.isOtherHealthIssuesChecked = false; // this.otherIssues.description != undefined ? this.otherIssues.description = "" : "";

        }
        if (conditionType == 'LongTerm') {
            this.isLongTermCondChecked = !this.isLongTermCondChecked;
            this.isShortTermCondChecked = false; //this.shortTermComplaint.description != undefined ? this.shortTermComplaint.description = "" : "";
            this.isMedicationRefillChecked = false; //this.medRefill.description != undefined ? this.medRefill.description = "" : "";
            this.isOtherHealthIssuesChecked = false; // this.otherIssues.description != undefined ? this.otherIssues.description = "" : "";
        }
        if (conditionType == 'MedicationRefill') {
            this.isMedicationRefillChecked = !this.isMedicationRefillChecked;
            this.isLongTermCondChecked = false; // this.longTermComplaint.description != undefined ? this.longTermComplaint.description = "" : "";
            this.isShortTermCondChecked = false; // this.shortTermComplaint.description != undefined ? this.shortTermComplaint.description = "" : "";
            this.isOtherHealthIssuesChecked = false; // this.otherIssues.description != undefined ? this.otherIssues.description = "" : "";
        }
        if (conditionType == 'OtherHealthIssues') {
            this.isOtherHealthIssuesChecked = !this.isOtherHealthIssuesChecked;
            this.isLongTermCondChecked = false; //this.longTermComplaint.description != undefined ? this.longTermComplaint.description = "" : "";
            this.isShortTermCondChecked = false; //this.shortTermComplaint.description != undefined ? this.shortTermComplaint.description = "" : "";
            this.isMedicationRefillChecked = false; // this.medRefill.description != undefined ? this.medRefill.description = "" : "";
        }
    }

    getComplaintDetails() {
        this.formSubmitted = true;
        if (this.isShortTermCondChecked || this.isLongTermCondChecked || this.isMedicationRefillChecked || this.isOtherHealthIssuesChecked) {
            let isValid = this.validate();
            if (isValid) {
                this.requestconsult.ShortTermConditionChecked = this.isShortTermCondChecked;
                this.requestconsult.LongTermConditionChecked = this.isLongTermCondChecked;
                this.requestconsult.MedicationRefillChecked = this.isMedicationRefillChecked;
                this.requestconsult.OtherHealthIssuesChecked = this.isOtherHealthIssuesChecked;
                this.requestconsult.ShortTermConditionDescription = this.shortTermComplaint.description;
                this.requestconsult.LongTermConditionDescription = this.longTermComplaint.description;
                this.requestconsult.MedicationRefillDescription1 = this.medRefill.description;
                this.requestconsult.MedicationRefillDescription2 = this.medRefill1.description;
                this.requestconsult.OtherHealthIssuesDescription = this.otherIssues.description;

                let navigationExtras: NavigationExtras = {
                    queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
                };
                this.router.navigate(["/scheduletype"], navigationExtras);
            }
        }
    }

    validate(): boolean {
        if (this.isShortTermCondChecked && this.shortTermComplaint.description == undefined) {
            return false;
        }

        if (this.isLongTermCondChecked && this.longTermComplaint.description == undefined) {
            return false;
        }

        if (this.isMedicationRefillChecked && this.medRefill.description == undefined && this.medRefill1.description == undefined) {
            return false;
        }

        if (this.isOtherHealthIssuesChecked && this.otherIssues.description == undefined) {
            return false;
        }
        return true;
    }

    goback() {
        let navigationExtras: NavigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/memberdetails"], navigationExtras);
    }
};

