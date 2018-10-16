import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { ValueList } from "nativescript-drop-down";
import * as ApplicationSettings from "application-settings";
import { User } from "../../shared/model/user.model";
import { WebAPIService } from "../../shared/services/web-api.service";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";

//let xml2js = require('nativescript-xml2js');
//let application = require('application');
// SERVICE TYPE
@Component({
    moduleId: module.id,
    templateUrl: "./servicetype.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class ServiceTypeComponent {
    requestconsult = new RequestConsultModel();
    mSelectedIndex: number = null;
    membersList: any = []; familyMembers = new ValueList<string>();
    user = new User();
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private activatedRoutes: ActivatedRoute) { }

    ngOnInit() {
        this.radSideComponent.rcClass = true; this.page.actionBarHidden = true; this.radSideComponent.navIcon = true;
        this.user = JSON.parse(ApplicationSettings.getString("USER"));
       /* if (this.webapi.netConnectivityCheck()) {
            this.webapi.getFamilyMembers_http().subscribe(data => {
                let self = this;
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_FamilyMembers_Grid.Successful == "true") {
                        // console.log("Count  " + JSON.stringify(result.APIResult_FamilyMembers_Grid));
                        for (let loop = 0; loop < result.APIResult_FamilyMembers_Grid.FamilyMemberCount; loop++) {
                            if (result.APIResult_FamilyMembers_Grid.FamilyMemberCount == "1") {
                                self.familyMembers.setItem(loop, {
                                    value: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem.PersonId,
                                    display: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem.FirstName + " " + result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem.LastName,
                                });
                            } else {
                                if (result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].RelationShip == "Primary Member") {
                                    self.familyMembers.setItem(loop, {
                                        value: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].PersonId,
                                        display: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].FirstName + " " + result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].LastName,
                                    });
                                }
                            }
                        }
                        self.activatedRoutes.queryParams.subscribe(params => {
                            if (params["REQUEST_CONSULT"] != undefined) {
                                self.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                                self.mSelectedIndex = self.familyMembers.getIndex(self.requestconsult.ExternalMemberId);
                            } else {
                                self.mSelectedIndex = 0;
                            }
                        });
                    } else {
                        console.log("Error in getting the family members information / Session expired ");
                    }
                });
            },
                error => {
                    console.log("Error in getting the family members information.. " + error);
                });
        }*/
    }
  /*  onMemberChange(args) {
        //console.log("Member Id " + this.familyMembers.getValue(args.selectedIndex));
        this.requestconsult.ExternalMemberId = this.familyMembers.getValue(args.selectedIndex);
    }*/
    gotoMedicalEmergency(serviceId, serviceName) {
        this.requestconsult.ServiceName = serviceName;
        this.requestconsult.ServiceType = serviceId;
            let navigationExtras: NavigationExtras = {
                queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
            };
            this.router.navigate(["/medicalemergency"], navigationExtras)
    }
};

