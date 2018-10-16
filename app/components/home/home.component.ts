import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import { User } from "../../shared/model/user.model";
import * as ApplicationSettings from "application-settings";
import { RadSideComponent } from "../radside/radside.component";
let xml2js = require('nativescript-xml2js');
import { RouterExtensions } from "nativescript-angular/router";
@Component({
    moduleId: module.id,
    templateUrl: "./home.component.html",
    providers: [Configuration, WebAPIService]
})
export class HomeComponent {
    user = new User();
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;

    constructor(private page: Page, private webapi: WebAPIService, private rs: RouterExtensions) {}
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.homeClass = true; this.radSideComponent.navIcon = true;
        this.getMemberInfoService();
    }
    getMemberInfoService() {
        let self = this;
        self.webapi.loader.show(self.webapi.options);
        this.webapi.getMemberInfo().subscribe(data => {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {                
                if (result.ServiceCallResult_MemberInfo.Successful == "true") {
                    self.user.FirstName = result.ServiceCallResult_MemberInfo.FirstName.charAt(0).toUpperCase() + result.ServiceCallResult_MemberInfo.FirstName.substr(1).toLowerCase();
                    self.user.LastName = result.ServiceCallResult_MemberInfo.LastName.charAt(0).toUpperCase() + result.ServiceCallResult_MemberInfo.LastName.substr(1).toLowerCase();
                    self.user.DOB = result.ServiceCallResult_MemberInfo.DOB;
                    self.user.Address1 = result.ServiceCallResult_MemberInfo.Address1;
                    self.user.State = result.ServiceCallResult_MemberInfo.State;
                    self.user.Zip = result.ServiceCallResult_MemberInfo.Zip;
                    self.user.Phone = result.ServiceCallResult_MemberInfo.Phone.match(new RegExp('.{1,4}$|.{1,3}', 'g')).join("-");
                    self.user.Email = result.ServiceCallResult_MemberInfo.Email;
                    self.user.PlanId = result.ServiceCallResult_MemberInfo.PlanId;
                    self.user.PlanOption = result.ServiceCallResult_MemberInfo.PlanOption;
                    self.user.Relationship = result.ServiceCallResult_MemberInfo.Relationship;
                    self.user.ExternalMemberId = result.ServiceCallResult_MemberInfo.ExternalMemberId;
                    self.user.PictureData = result.ServiceCallResult_MemberInfo.Picture.FileData;
                    ApplicationSettings.setString("USER", JSON.stringify(self.user));
                    self.webapi.loader.hide();
                } else {
                    self.webapi.loader.hide();
                   // console.log("Error in getting thegetMember Info / Session expired " + result.ServiceCallResult_MemberInfo.Message);
                }
            });
        },
            error => {
                self.webapi.loader.hide();
               // console.log("Error in getting thegetMember Info / Session expired..... " + error);
            });
    }
    openProfile(data: any) {
        let self = this;
        self.webapi.loader.show(self.webapi.options);
        setTimeout(() => {
            self.rs.navigate([data]).then(function () {
                setTimeout(() => {
                    self.webapi.loader.hide();
                }, 1000);
            });
        }, 500);
    }
};




