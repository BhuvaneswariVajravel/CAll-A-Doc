import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import * as ApplicationSettings from "application-settings";
import { WebAPIService } from "../../shared/services/web-api.service";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";

let xml2js = require('nativescript-xml2js');

// SERVICE TYPE
@Component({
    moduleId: module.id,
    templateUrl: "./secureemail.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class SecureEmailComponent {
    requestconsult = new RequestConsultModel();
    subject: string; description: string; formSubmitted: boolean = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private activatedRoutes: ActivatedRoute) { }

    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(params => {
            if (params["REQUEST_CONSULT"] != undefined) {
                this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
            }
        });
    }
    /* To schedule an appointment with doctor through email */
    showNextPage(sub, desc) {
        this.formSubmitted = true; let self = this;
        if (sub && desc && self.subject.trim() != '' && self.description.trim() != '' && self.webapi.netConnectivityCheck()) {
            this.webapi.consultationScheduleEmail_http(this.subject, this.description).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        let navigationExtras: NavigationExtras = {
                            queryParams: { "REQUEST_CONSULT": JSON.stringify(self.requestconsult) }
                        };
                        self.router.navigate(["/confirmation"], navigationExtras);
                    } else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                       // console.log("LOGOUT DUE SESSION TIME OUT IN SECURE EMAIL --->" + result.APIResult.Message);
                        self.webapi.logout();
                    } else {
                       // console.log("Session expired/Error in email consult in secure email");
                    }
                });
            },
                error => {
                   // console.log("Error in email consult " + error);
                });
        }
    }
    goback() {
        let navigationExtras: NavigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/healthrecords"], navigationExtras);
    }
}; 
