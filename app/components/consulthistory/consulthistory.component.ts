import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import { RadSideComponent } from "../radside/radside.component";
import { Location } from '@angular/common';
import * as ApplicationSettings from "application-settings";
let utilityModule = require("utils/utils");
let xml2js = require('nativescript-xml2js');
import { TNSPlayer } from 'nativescript-audio';

@Component({
    moduleId: module.id,
    templateUrl: "./consulthistory.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class ConsultHistoryComponent {
    public phyFirstName: string; public phyLastName: string;
    public startDate: string; public endDate: string;
    public serviceName: Array<string>;
    public serviceStatus: Array<string>;
    servName: string; servStatus: string; isLoading: boolean = false;
    serviceNameIndex: number; servStatusIndex: number; consultHistoryList: any = [];
    pageNum = 1; totalCount = 0; user: any = {}; norecords: boolean = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private actRoute: ActivatedRoute, private location: Location) {
        this.serviceName = ["Secure Email Consult", "Diagnostic Consult", "Video Consult"];
        this.serviceStatus = ["New", "Serviced", "FollowUpOpen", "Closed"];
    }
    public seachHistoryTab: boolean = false;
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.conHisClass = true;
        let self = this;
        /* To get consult history data */
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.consulthistorydata(this.phyFirstName != undefined ? this.phyFirstName : "", this.phyLastName != undefined ? this.phyLastName : "", this.servName != undefined ? this.servName : "", this.servStatus != undefined ? this.servStatus : "", this.startDate != undefined ? this.startDate : "", this.endDate != undefined ? this.endDate : "", this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemSearchResultList.Successful == "true") {
                        if (result.APIResult_ConsultationItemSearchResultList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemSearchResultList.TotalItemCountInAllPages;
                            let total = result.APIResult_ConsultationItemSearchResultList.ItemList.ConsultationItemSearchResult;
                            if (total.length != undefined) {
                                for (let i = 0; i < total.length; i++) {
                                    self.consultHistoryList.push(total[i]);
                                }
                            } else {
                                self.consultHistoryList.push(total);
                            }
                            self.hideIndicator();
                        } else {
                            self.hideIndicator();
                            self.norecords = true;
                        }
                    } else {
                        self.hideIndicator();
                        self.norecords = true;
                        if (result.APIResult_ConsultationItemSearchResultList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                       // console.log("Session expired or Error in getting consult history list..");
                    }
                });
            },
                error => {
                    self.hideIndicator();                         self.norecords = true;
                   // console.log("Error while getting consult history.. " + error);
                });
        }
        //  });
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

    toggle() {
        if (this.seachHistoryTab)
            this.seachHistoryTab = false;
        else
            this.seachHistoryTab = true;
    }
    onSeriveChange(args) {
        this.servName = this.serviceName[args.selectedIndex];
    }
    onSeriveStatusChange(args) {
        this.servStatus = this.serviceStatus[args.selectedIndex];
    }
    /* To load the contents dynamically on scroll */
    loadMoreConsultItems() {
        let self = this;
        if (this.totalCount >= this.pageNum * 10 && this.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1; self.isLoading = true;
            this.webapi.consulthistorydata(this.phyFirstName != undefined ? this.phyFirstName : "", this.phyLastName != undefined ? this.phyLastName : "", this.servName != undefined ? this.servName : "", this.servStatus != undefined ? this.servStatus : "", this.startDate != undefined ? this.startDate : "", this.endDate != undefined ? this.endDate : "", this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemSearchResultList.Successful == "true") {
                        self.totalCount = result.APIResult_ConsultationItemSearchResultList.TotalItemCountInAllPages;
                        let total = result.APIResult_ConsultationItemSearchResultList.ItemList.ConsultationItemSearchResult;
                        if (total.length != undefined) {
                            for (let i = 0; i < total.length; i++) {
                                self.consultHistoryList.push(total[i]);
                            }
                        } else {
                            self.consultHistoryList.push(total);
                        }
                        self.isLoading = false;
                    } else {
                        self.isLoading = false;
                        if (result.APIResult_ConsultationItemSearchResultList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                       // console.log("Session expired or Error in Consult history load more..");
                    }
                });
            },
                error => {
                    this.isLoading = false;
                  //  console.log("Error while getting consult history load more.. " + error);
                });
        }
    }
    consultViewPage(item: any) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "consultViewData": JSON.stringify(item)
            }
        };
        this.router.navigate(["/consulthistoryview"], navigationExtras);
    }

    /* To search the consult history data based on user filled data */
    searchConsultHistory() {
        this.pageNum = 1;
        let self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.consulthistorydata(this.phyFirstName != undefined ? this.phyFirstName : "", this.phyLastName != undefined ? this.phyLastName : "", this.servName != undefined ? this.servName : "", this.servStatus != undefined ? this.servStatus : "", this.startDate != undefined ? this.startDate : "", this.endDate != undefined ? this.endDate : "", this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemSearchResultList.Successful == "true") {
                        if (result.APIResult_ConsultationItemSearchResultList.ItemCount != "0") {
                            self.seachHistoryTab = false;
                            self.totalCount = result.APIResult_ConsultationItemSearchResultList.TotalItemCountInAllPages;
                            self.consultHistoryList = [];
                            let total = result.APIResult_ConsultationItemSearchResultList.ItemList.ConsultationItemSearchResult;
                            if (total.length != undefined) {
                                for (let i = 0; i < total.length; i++) {
                                    self.consultHistoryList.push(total[i]);
                                }
                            } else {
                                self.consultHistoryList.push(total);
                            }
                            self.hideIndicator();
                        } else {
                            self.hideIndicator();
                        }
                    } else if (result.APIResult_ConsultationItemSearchResultList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.hideIndicator();
                        self.webapi.logout();

                    } else {
                        self.hideIndicator();
                       // console.log("Session expired or Error in Search consult history..");
                    }
                });
            },
                error => {
                    this.hideIndicator();
                   // console.log("Error while getting consult history search.. " + error);
                });
        }
    }
    hideIndicator() {
        this.webapi.loader.hide();
    }
    convertTime(time24) {
        return this.webapi.convertTime24to12(time24);
    }

};
// CONSULT HISTORY VIEW
@Component({
    moduleId: module.id,
    templateUrl: "./consulthistoryview.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class ConsultHistoryViewComponent {
    _player: TNSPlayer; play: boolean = false;
    isVisible: boolean = false;
    isReplyVisible: boolean = false; consultViewObj: any = {};
    content: string; read: boolean; actionsList: any = []; prognotes: any = []; phydocs: any = [];
    markReadVisible: boolean = false; formSubmitted = false; user: any = {};
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private actRoute: ActivatedRoute, private location: Location, private router: Router) {
        //this._player = new TNSPlayer();this._player.debug = true;
    }
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.conHisClass = true;
        ApplicationSettings.setString("refreshconsults", "no");
    }
    ngAfterViewInit() {
        let self = this;
        self.actRoute.queryParams.subscribe(params => {
            if (params["consultViewData"] != undefined && self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                let consultHisData = JSON.parse(params["consultViewData"]);
                self.webapi.consulthistoryView(consultHisData.ItemId).subscribe(data => {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        //  console.log("KKK TTTTT  ");
                         //console.log(JSON.stringify(result.APIResult_ConsultationItemDetail));
                        if (result.APIResult_ConsultationItemDetail.Successful == "true") {
                            self.prognotes = []; self.actionsList = []; self.phydocs = [];
                            let consultView = result.APIResult_ConsultationItemDetail.ConsultationDetail;
                            self.consultViewObj.subject = consultView.MedicalRequestSubject;
                            self.consultViewObj.schedule = consultView.ScheduleDate;
                            self.consultViewObj.headLine = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainType;
                            self.consultViewObj.description = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainDescription;
                            self.consultViewObj.status = consultHisData.Status;
                            self.consultViewObj.alreadyRead = consultView.AlreadyRead;
                            self.consultViewObj.ItemId = consultView.ContentShort.ItemId;
                            self.consultViewObj.consultType = consultView.ContentShort.ConsultationType;
                            self.consultViewObj.recordUrl = '';
                            self.consultViewObj.docName = consultView.PhysicianName;
                            self.consultViewObj.phyaddr = consultView.PhysicianCity+', '+consultView.PhysicianState+' '+consultView.PhysicianZip;
                            if (consultView.ProgressNoteDetailCount != "0") {
                                if (consultView.ProgressNoteDetailCount == "1") {
                                    self.prognotes.push(consultView.ProgressNotes.ProgressNoteDetail);
                                } else {
                                    for (let h = 0; h < consultView.ProgressNotes.ProgressNoteDetail.length; h++) {
                                        self.prognotes.push(consultView.ProgressNotes.ProgressNoteDetail[h]);
                                    }
                                }
                            }
                            if (consultView.PhysicianInstructionDocumentCount != "0") {
                                if (consultView.PhysicianInstructionDocumentCount == "1") {
                                    self.phydocs.push(consultView.PhysicianInstructionDocuments.MedicalDocumentItem);
                                } else {
                                    for (let k = 0; k < consultView.PhysicianInstructionDocuments.MedicalDocumentItem.length; k++) {
                                        self.phydocs.push(consultView.PhysicianInstructionDocuments.MedicalDocumentItem[k]);
                                    }
                                }
                            }
                            if (consultView.ActionItemCount == "1") {
                                self.actionsList.push(consultView.ActionItemList.ActionItem);
                                self.consultViewObj.recordUrl = consultView.ActionItemList.ActionItem.RecordingURL;
                                self.consultViewObj.audioItemId = consultView.ActionItemList.ActionItem.ItemId;
                            } else if (consultView.ActionItemCount != "0") {
                                for (let i = 0; i < consultView.ActionItemList.ActionItem.length; i++) {
                                    self.actionsList.push(consultView.ActionItemList.ActionItem[i]);
                                    if (self.consultViewObj.recordUrl == '') {
                                        self.consultViewObj.recordUrl = consultView.ActionItemList.ActionItem[i].RecordingURL;
                                        self.consultViewObj.audioItemId = consultView.ActionItemList.ActionItem[i].ItemId;
                                    }
                                }
                            }
                            self.hideIndicator();
                        } else {
                            self.hideIndicator();
                           // console.log("Session expired or Error in Consult history view component...");
                        }
                    });
                },
                    error => {
                        self.hideIndicator();
                      //  console.log("Error while getting consult history view data.. " + error);
                    });
            }
        });
        if (ApplicationSettings.hasKey("USER")) {
            self.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                let userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    let index = userList.findIndex(x => x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"))
                    if (index >= 0)
                        self.user.RelationShip = userList[index].RelationShip;
                } else {
                    self.user.RelationShip = "Primary Member";
                }
            }
        }
    }

    popupbtn(msg) {
        this.isVisible = true;
        if (msg == 'phynotes') {
            this.consultViewObj.actionpopup = 'phynotes';
            this.consultViewObj.consultHead = "Physician Progress Notes";
        } else if (msg == 'phyinstr') {
            this.consultViewObj.actionpopup = 'phyinstr';
            this.consultViewObj.consultHead = "Physician Instructions";
        } else {
            this.consultViewObj.actionpopup = 'actfolups';
            this.consultViewObj.consultHead = "Actions and Follow up messages";
        }
    }
    popupclose() {
        this.isVisible = false; this.formSubmitted = false;
        this.isReplyVisible = false; this.markReadVisible = false;
        if (this._player != undefined) {
            this._player.pause(); this._player.dispose();
        }
        this.play = false;
    }
    UserReply(value) {
        if (value == 'reply') {
            this.isReplyVisible = true;
            this.content = ""; this.formSubmitted = false;
        } else if (value == 'markread') {
            this.markAsReadOrUnread(value);
           // console.log("mark as read");
        } else if (value == 'markunread') {
            this.markAsReadOrUnread(value);
           // console.log("mark as unread");
        }
    }
    /* To make consult is mark read or unread */
    markAsReadOrUnread(value) {
        let self = this;
        if (value == 'markread')
            this.read = true;
        else
            this.read = false;
        this.markReadVisible = true;
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.markAsReadOrUnread(this.consultViewObj.ItemId, this.read).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        self.consultViewObj.alreadyRead = self.read != false ? 'true' : 'false';
                        ApplicationSettings.setString("refreshconsults", "yes");
                     //   console.log("Success ::: " + self.consultViewObj.ItemId + " " + self.read);
                    } else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                       // console.log("LOGOUT DUE SESSION TIME OUT IN MARK READ IN CH --->" + result.APIResult.Message);
                        self.webapi.logout();
                    } else {
                       // console.log("Session Expired or Error in Markas read or unread..." + result.APIResult.Message + " for itemId " + self.consultViewObj.ItemId);
                    }
                });
            },
                error => {
                    //console.log("Error while getting matk as read or unread.. " + error);
                });
        }
    }

    /* To open audio from the server using nativescript sound plugin */
    openAudio(itemId) {
        let self = this;
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.consultationRecordAudio(itemId).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PhoneCallFile.Successful == "true") {
                        self.playAudioUrl(result.APIResult_PhoneCallFile.DownloadURL);
                    } else if (result.APIResult_PhoneCallFile.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        //console.log("LOGOUT DUE SESSION TIME OUT IN OPEN AUDIO IN CH --->" + result.APIResult_PhoneCallFile.Message);
                        self.webapi.logout();
                    } else {
                      //  console.log("Session Expired or Error in AUDIO URL...");
                    }
                });
            },
                error => {
                   // console.log("Error while getting Audion URL.. " + error);
                });
        }
    }
    playAudioUrl(audiourl) {
        this._player = new TNSPlayer();
        this._player.playFromUrl({
            audioFile: audiourl, // ~ = app directory
            loop: false,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this)
        }).then(() => {
            this._player.getAudioTrackDuration().then((duration) => {
                this.play = true;
                // iOS: duration is in seconds
                // Android: duration is in milliseconds
               // console.log(`song duration:`, duration);
            });
        });
    }
    togglePlay() {
        if (this._player.isAudioPlaying()) {
            //  console.log("PAUSE..........");
            this._player.pause();
        } else {
            //  console.log("PLAYING........");
            this._player.play();
            this.play = true;
        }
    }
    _trackComplete(args: any) {
        //  console.log('reference back to player:', args.player);
        this.play = false;
        this._player.dispose();

        // iOS only: flag indicating if completed succesfully
        //  console.log('whether song play completed successfully:', args.flag);
    }
    _trackError(args: any) {
        // console.log('reference back to player:', args.player);
        //  console.log('the error:', args.error);

        // Android only: extra detail on error
        //   console.log('extra info on the error:', args.extra);
    }
    /* To reply for doctors help */
    replyOrFollowUpSubmit(contValid) {
        this.formSubmitted = true; let self = this;
        if (contValid && self.content.trim() != '' && self.webapi.netConnectivityCheck()) {
            self.isReplyVisible = false;
            self.webapi.followUpOrReply(this.consultViewObj.ItemId, this.consultViewObj.subject, this.content).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    //  console.log(JSON.stringify(result));
                    if (result.APIResult.Successful == "true") {
                        // alert("Your reply has been successfully submitted.");
                        self.consultViewObj.errorMsg = true;
                        setTimeout(function () {
                            self.consultViewObj.errorMsg = false;
                        }, 5000);
                    } else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        //console.log("LOGOUT DUE SESSION TIME OUT IN REPLY OR FOLLOW UP IN CH --->" + result.APIResult.Message);
                        self.webapi.logout();
                    } else {
                       // console.log("session expired or error in reply or follow up...");
                    }
                });
            },
                error => {
                   // console.log("Error while getting follow or reply.. " + error);
                });
        }
    }
    goback() {
        if (this._player != undefined) {
            this._player.dispose();
        }
        if (ApplicationSettings.hasKey("refreshconsults")) {
            if (ApplicationSettings.getString("refreshconsults") == "yes") {
                ApplicationSettings.remove("refreshconsults");
                this.router.navigate(["/consulthistory"]);
            } else
                this.location.back();

        } else {
            this.location.back();
        }
    }
    hideIndicator() {
        this.webapi.loader.hide();
    }
    /* Launch browser in a new tab */
    launchBrowser(url) {
        utilityModule.openUrl('https://www.247calladoc.com/member/' + url);
    }
    convertTime(time24) {
        return this.webapi.convertTime24to12(time24);
    }
};