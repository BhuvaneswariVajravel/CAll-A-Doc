import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { ValueList } from "nativescript-drop-down";
import { RequestConsultModel } from "./requestconsult.model"
import { WebAPIService } from "../../shared/services/web-api.service";
import { RadSideComponent } from "../radside/radside.component";
import * as ApplicationSettings from "application-settings";
let xml2js = require('nativescript-xml2js');
// MEMBER DETAILS
@Component({
    moduleId: module.id,
    templateUrl: "./memberdetails.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class MemberDetailsComponent {
    statesInfo = new ValueList<string>(); sSelectedIndex: number = null;
    requestconsult = new RequestConsultModel();
    userState: string;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private activatedRoutes: ActivatedRoute) { }
    ngOnInit() {
        let user = JSON.parse(ApplicationSettings.getString("USER"));
        this.userState = user.State;
        this.page.actionBarHidden = true; let self = this;
        this.radSideComponent.rcClass = true;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            //Loading USStates dynamically
            self.webapi.getCodeList("USStates").subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CodeList.Successful == "true") {
                        for (let loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
                            self.statesInfo.setItem(loop, {
                                value: result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId,
                                display: result.APIResult_CodeList.List.List.CodeListItem[loop].Value,
                            });
                            if (result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId == self.userState) {
                                self.sSelectedIndex = loop;
                            }
                        }
                        self.activatedRoutes.queryParams.subscribe(params => {
                            if (params["REQUEST_CONSULT"] != undefined) {
                                //console.log(JSON.parse(params["REQUEST_CONSULT"]).State)
                                self.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                                if (self.requestconsult.StateId != undefined)
                                    self.sSelectedIndex = self.statesInfo.getIndex(self.requestconsult.StateId);
                            }
                        });
                    } else {
                        self.webapi.loader.hide();
                        //console.log("Session expired in member details component/Error in getting the states. ");
                    }
                });
                self.activatedRoutes.queryParams.subscribe(params => {
                    if (params["REQUEST_CONSULT"] != undefined)
                        self.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                });
                self.webapi.loader.hide();
            },
                error => {
                    self.webapi.loader.hide();
                    //console.log("Error in getting the service type.. " + error);
                });
        }
    }
    onStateChange(args) {
        //console.log("State " + this.statesInfo.getValue(args.selectedIndex));
        this.requestconsult.StateId = this.statesInfo.getValue(args.selectedIndex);
        this.requestconsult.State = this.statesInfo.getDisplay(args.selectedIndex);
    }
    goback() {
        let navigationExtras: NavigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/medicalemergency"], navigationExtras);
    }
    //Navigate to next page based on seleted module.
    showNextPage() {
        let navigationExtras: NavigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        if (this.requestconsult.ServiceType == 3) {
            this.router.navigate(["/consultationdetails"], navigationExtras);
        } else if (this.requestconsult.ServiceType == 4) {
            this.router.navigate(["/healthrecords"], navigationExtras);
        } else if (this.requestconsult.ServiceType == 7) {
            this.router.navigate(["/consultationdetails"], navigationExtras);
        }
    }
};

