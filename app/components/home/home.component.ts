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
import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    templateUrl: "./home.component.html",
    providers: [Configuration, WebAPIService]
})
export class HomeComponent {
    user = new User(); intervalId = 0; videoConsults: any = [];
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;

    constructor(private page: Page, private webapi: WebAPIService, private rs: RouterExtensions) { }
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.homeClass = true; this.radSideComponent.navIcon = true;
        this.getMemberInfoService();
        clearInterval(this.intervalId);
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
    ngAfterViewInit() {
        // this.dateobj = new Date();
        this.scheduledConsultsList();
        this.intervalId = setInterval(() => {
            this.scheduledConsultsList();
        }, 300000);//5 minutes  300000
        //   this.searchForVideoConsult();
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

    /*  searchForVideoConsult(){
           setInterval(() => {
              console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          }, 1000);//5 minutes
  
      }*/

    getTimeInMinute(timeInMilli) {
        let seconds = timeInMilli / 1000;
        let minutes = seconds / 60;
        return Math.floor(minutes);
    }

    scheduledConsultsList() {

        if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
            //  console.log("SCHEDULELELELELEL");
            let self = this; let date = new Date(); self.videoConsults = [];
            this.webapi.videochathistory().subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemSearchResultList.Successful == "true") {
                        let total = result.APIResult_ConsultationItemSearchResultList.ItemList.ConsultationItemSearchResult;
                        if (total.length != undefined) {
                            for (let i = 0; i < total.length; i++) {
                                let minute = self.getTimeInMinute(Date.parse(total[i].ServiceTime) - date.getTime());
                                if (Date.parse(total[i].ServiceTime) > date.getTime()) {
                                    self.videoConsults.push(total[i].ItemId);
                                }
                                if (total.length == i + 1) {
                                    ApplicationSettings.setString("VIDEO_CONSULTS", JSON.stringify(self.videoConsults));
                                }
                                if (minute > 0 && minute <= 5) {
                                    if (ApplicationSettings.hasKey("ALERT_LIST")) {
                                        let data = ApplicationSettings.getString("ALERT_LIST");
                                        if (data.indexOf(String(total[i].ItemId)) == -1) {
                                            ApplicationSettings.setString("ALERT_LIST", data + String(total[i].ItemId) + ",");
                                            self.showAlert();
                                        }
                                    } else {
                                        ApplicationSettings.setString("ALERT_LIST", String(total[i].ItemId) + ",");
                                        self.showAlert();
                                    }
                                }

                            }
                        } else {
                            if (Date.parse(total.ServiceTime) > date.getTime()) {
                                self.videoConsults.push(total.ItemId);
                                ApplicationSettings.setString("VIDEO_CONSULTS", JSON.stringify(self.videoConsults));
                            }
                            let minute = self.getTimeInMinute(Date.parse(total.ServiceTime) - date.getTime());
                            if (minute > 0 && minute <= 5) {
                                if (ApplicationSettings.hasKey("ALERT_LIST")) {
                                    let data = ApplicationSettings.getString("ALERT_LIST");
                                    if (data.indexOf(String(total.ItemId)) == -1) {
                                        ApplicationSettings.setString("ALERT_LIST", data + String(total.ItemId) + ",");
                                        self.showAlert();
                                    }
                                } else {
                                    ApplicationSettings.setString("ALERT_LIST", String(total.ItemId) + ",");
                                    self.showAlert();
                                }

                            }
                        }
                    }
                });
            },
                error => {
                    //console.log("Error while getting scheduled consult.. " + error);
                });
        }
    }

    showAlert() {
        let self = this;
        dialogs.alert("You have an appointment for video consult within 5 minutes.Please join with doctor in scheduled consults.").then(function () {
            self.rs.navigate([self.rs.router.url == '/scheduledconsults1' ? '/scheduledconsults' : '/scheduledconsults1']);
        });
    }
};