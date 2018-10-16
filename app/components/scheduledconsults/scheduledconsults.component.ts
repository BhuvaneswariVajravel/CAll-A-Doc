import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import { Location } from '@angular/common';
import { RadSideComponent } from "../radside/radside.component";
import * as ApplicationSettings from "application-settings";
let xml2js = require('nativescript-xml2js');
// SCHEDULE CONSULT
@Component({
    moduleId: module.id,
    templateUrl: "./scheduledconsults.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class ScheduledConsultsComponent {
    pageNum = 1; totalCount = 0; user: any = {}; norecords: boolean = false;
    scheduledConsultList: any = []; isLoading: boolean = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private actRoute: ActivatedRoute, private location: Location) { }
    ngOnInit() {
        this.page.actionBarHidden = true;
        this.radSideComponent.schConslts = true;
        let self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.scheduledconsults(this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        if (result.APIResult_ConsultationItemList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                            let total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                            if (total.length != undefined) {
                                for (let i = 0; i < total.length; i++) {
                                    self.scheduledConsultList.push(total[i]);
                                    console.log(total[i].RelatedTime+"   REALTIME   Item Id"+total[i].ItemId);
                                }
                            } else {
                                self.scheduledConsultList.push(total);
                            }
                            self.hideIndicator();
                        } else {
                            self.hideIndicator();
                            self.norecords = true;
                        }
                    } else {
                        self.hideIndicator();
                        self.norecords = true;
                        if (result.APIResult_ConsultationItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                        //console.log("Session expired / Error in Scheduled list");
                    }
                });
            },
                error => {
                    self.norecords = true;
                    self.hideIndicator();
                    //console.log("Error while getting scheduled consult.. " + error);
                });
        }
    }

    ngAfterViewInit() {
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                let userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    let index = userList.findIndex(x => x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"))
                    if (index >= 0)
                        this.user.RelationShip = userList[index].RelationShip;
                } else {
                    this.user.RelationShip = "Primary Member";
                }

            }
        }
    }

    scheduleView(item: any) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "scheduleList": JSON.stringify(item)
            }
        };
        this.router.navigate(["/scheduledconsultsview"], navigationExtras);
    }
    hideIndicator() {
        this.webapi.loader.hide();
    }
    loadMoreScheduleList() {
        let self = this;
        if (this.totalCount >= this.pageNum * 6 && this.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1; self.isLoading = true;
            this.webapi.scheduledconsults(this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                        let total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                        if (total.length != undefined) {
                            for (let i = 0; i < total.length; i++) {
                                self.scheduledConsultList.push(total[i]);
                                console.log(total[i].RelatedTime+"   REALTIME   Item Id"+total[i].ItemId);
                            }
                        } else {
                            self.scheduledConsultList.push({ "ConsultationType": total.ConsultationType, "ItemId": total.ItemId, "RelatedTime": total.RelatedTime });
                        }
                        self.isLoading = false;
                    } else {
                        self.isLoading = false;
                        //console.log("Session expired / Error in load more Scheduled list");

                    }
                });
            },
                error => {
                    self.isLoading = false;
                    console.log("Error while getting Schedule consults load more.. " + error);
                });
        }
    }
    convertTime(time24) {
        return this.webapi.convertTime24to12(time24);
    }
};
// SCHEDULE CONSULT VIEW
@Component({
    moduleId: module.id,
    templateUrl: "./scheduledconsultsview.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class ScheduledConsultsViewComponent {
    actionsList: any = []; prognotes: any = []; phydocs: any = []; schViewObj: any = {};
    isVisible: boolean = false; phyInstrDoc: string; user: any = {};
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private actRoute: ActivatedRoute, private router: Router, private location: Location) { }
    ngOnInit() {
        let self = this; this.page.actionBarHidden = true;
        this.radSideComponent.schConslts = true;
        self.actRoute.queryParams.subscribe(params => {
            if (params["scheduleList"] != undefined && self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                let scheduleItem = JSON.parse(params["scheduleList"]);
                this.webapi.consulthistoryView(scheduleItem.ItemId).subscribe(data => {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_ConsultationItemDetail.Successful == "true") {
                            self.prognotes = []; self.actionsList = []; self.phydocs = [];
                            let scheduleView = result.APIResult_ConsultationItemDetail.ConsultationDetail;
                            self.schViewObj.subject = scheduleView.MedicalRequestSubject;
                            self.schViewObj.consultType = scheduleView.ContentShort.ConsultationType;
                            self.schViewObj.schedule = scheduleView.ScheduleDate;
                            self.schViewObj.headLine = scheduleView.MedicalRequestDetails.MedicalRequestDetail.ComplainType;
                            self.schViewObj.description = scheduleView.MedicalRequestDetails.MedicalRequestDetail.ComplainDescription;
                            self.schViewObj.docName = scheduleView.PhysicianName;
                            self.schViewObj.phyaddr = scheduleView.PhysicianCity + ', ' + scheduleView.PhysicianState + ' ' + scheduleView.PhysicianZip;
                            if (scheduleView.ProgressNoteDetailCount != "0") {
                                if (scheduleView.ProgressNoteDetailCount == "1") {
                                    self.prognotes.push(scheduleView.ProgressNotes.ProgressNoteDetail);
                                } else {
                                    for (let h = 0; h < scheduleView.ProgressNotes.ProgressNoteDetail.length; h++) {
                                        self.prognotes.push(scheduleView.ProgressNotes.ProgressNoteDetail[h]);
                                    }
                                }
                            }
                            if (scheduleView.PhysicianInstructionDocumentCount != "0") {
                                if (scheduleView.PhysicianInstructionDocumentCount == "1") {
                                    self.phydocs.push(scheduleView.PhysicianInstructionDocuments.MedicalDocumentItem);
                                } else {
                                    for (let k = 0; k < scheduleView.PhysicianInstructionDocuments.MedicalDocumentItem.length; k++) {
                                        self.phydocs.push(scheduleView.PhysicianInstructionDocuments.MedicalDocumentItem[k]);
                                    }
                                }
                            }
                            if (scheduleView.ActionItemCount == "1") {
                                self.actionsList.push(scheduleView.ActionItemList.ActionItem);
                            } else if (scheduleView.ActionItemCount != "0") {
                                for (let i = 0; i < scheduleView.ActionItemList.ActionItem.length; i++) {
                                    self.actionsList.push(scheduleView.ActionItemList.ActionItem[i]);
                                }
                            }
                            self.hideIndicator();
                        } else {
                            self.hideIndicator();
                           // console.log("Session expired / Error in Scheduled list view");
                        }
                    });
                },
                    error => {
                        //console.log("Error while getting consult history view data.. " + error);
                    });
            }
        });
    }

    ngAfterViewInit() {
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                let userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    let index = userList.findIndex(x => x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"))
                    if (index >= 0)
                        this.user.RelationShip = userList[index].RelationShip;
                } else {
                    this.user.RelationShip = "Primary Member";
                }
            }
        }
    }
    popupbtn(msg) {
        this.isVisible = true;
        if (msg == 'phynotes') {
            this.schViewObj.actionpopup = 'phynotes';
            this.schViewObj.consultHead = "Physician Progress Notes";
        } else if (msg == 'phyinstr') {
            this.schViewObj.actionpopup = 'phyinstr';
            this.schViewObj.consultHead = "Physician Instructions";
        } else {
            this.schViewObj.actionpopup = 'action';
            this.schViewObj.consultHead = "Actions and Follow up messages";
        }
    }
    popupclose() {
        this.isVisible = false;
    }
    hideIndicator() {
        this.webapi.loader.hide();
    }
    goback() {
        this.location.back();
    }
    convertTime(time24) {
        return this.webapi.convertTime24to12(time24);
    }
};