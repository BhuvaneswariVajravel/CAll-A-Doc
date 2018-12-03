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
    templateUrl: "./followups.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class FollowUpComponent {
    followUpsList: any = []; user: any = {}; norecords: boolean = false;
    pageNum = 1; totalCount = 0; @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private actRoute: ActivatedRoute, private location: Location) {
    }
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.folUpClass = true;
        let self = this;
        if (self.webapi.netConnectivityCheck()) {//replace this if with above code
            self.webapi.loader.show(self.webapi.options);
            this.webapi.followUpList(this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        if (result.APIResult_ConsultationItemList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                            let total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                            if (total.length != undefined) {
                                for (let i = 0; i < total.length; i++) {
                                    self.followUpsList.push(total[i]);
                                }
                            } else {
                                self.followUpsList.push(total);
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
                        //console.log("Session Expired or error in getting follow ups list");
                    }
                });
            },
                error => {
	    	    self.norecords = true;
                    self.hideIndicator();
                   // console.log("Error while getting consult history.. " + error);
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

    loadMoreFollowUps() {
        let self = this;
        if (this.totalCount >= this.pageNum * 8 && this.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1;
            self.webapi.loader.show(self.webapi.options);
            self.webapi.followUpList(this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        if (result.APIResult_ConsultationItemList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                            let total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                            if (total.length != undefined) {
                                for (let i = 0; i < total.length; i++) {
                                    self.followUpsList.push(total[i]);
                                }
                            } else {
                                self.followUpsList.push(total);
                            }
                            self.hideIndicator();
                        } else {
                            self.hideIndicator();
                        }
                    } else if (result.APIResult_ConsultationItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.hideIndicator();
                        self.webapi.logout();
                    } else {
                        self.hideIndicator();
                       // console.log("Session Expired or error in getting load more follow ups list");

                    }
                });
            },
                error => {
                    self.hideIndicator();
                    console.log("Error while getting consult history.. " + error);
                });
        }
    }
    followUpView(item: any) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "followUpViewData": JSON.stringify(item)
            }
        };
        this.router.navigate(["/followupview"], navigationExtras);
    }
    hideIndicator() {
        this.webapi.loader.hide();
    }

    convertTime(time24) {
        return this.webapi.convertTime24to12(time24);
    }
};
// FOLLOWUP VIEW
@Component({
    moduleId: module.id,
    templateUrl: "./followupview.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class FollowUpViewComponent {
    _player: TNSPlayer; play: boolean = false;
    isVisible: boolean = false;
    isReplyVisible: boolean = false;
    consultViewObj: any = {}; user: any = {};
    content: string; read: boolean; actionsList: any = []; prognotes: any = []; phydocs: any = [];
    markReadVisible: boolean = false; formSubmitted = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private actRoute: ActivatedRoute, private location: Location, private router: Router) { }
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.folUpClass = true;
        ApplicationSettings.setString("refreshfollowups","No");
    }

    /* To load the all follow up contents when user taps on followups button */
    ngAfterViewInit() {
        let self = this;
        self.actRoute.queryParams.subscribe(params => {
            if (params["followUpViewData"] != undefined && self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                let consultHisData = JSON.parse(params["followUpViewData"]);
                this.webapi.consulthistoryView(consultHisData.ItemId).subscribe(data => {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_ConsultationItemDetail.Successful == "true") {
                            //console.log(JSON.stringify(result.APIResult_ConsultationItemDetail));
                            self.prognotes = []; self.actionsList = []; self.phydocs = [];
                            let consultView = result.APIResult_ConsultationItemDetail.ConsultationDetail;
                            self.consultViewObj.subject = consultView.MedicalRequestSubject;
                            self.consultViewObj.schedule = consultView.ScheduleDate;
                            self.consultViewObj.headLine = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainType;
                            self.consultViewObj.description = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainDescription;
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
                       // console.log("Error while getting consult history view data.. " + error);
                    });
            }
        });
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

    /* To Show all type of pop up messages */

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
    /* To close pop up */
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
            console.log("mark as read");
        } else if (value == 'markunread') {
            this.markAsReadOrUnread(value);
            console.log("mark as unread");
        }
    }
    /* To mark the content as read or unread update in server */
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
                        ApplicationSettings.setString("refreshfollowups", "yes");
                    } else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                      //  console.log("Session Expired or Error in Markas read or unread..." + result.APIResult.Message + " for itemId " + self.consultViewObj.ItemId);
                    }
                });
            },
                error => {
                   // console.log("Error while getting matk as read or unread.. " + error);
                });
        }
    }

    /* Load the audio file from server using sound plugin */
    openAudio(itemId) {
        let self = this;
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.consultationRecordAudio(itemId).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PhoneCallFile.Successful == "true") {
                        self.playAudioUrl(result.APIResult_PhoneCallFile.DownloadURL);
                    } else if (result.APIResult_PhoneCallFile.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
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
    /* To Play Audio file */
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
                //console.log(`song duration:`, duration);
            });
        });
    }
    togglePlay() {
        if (this._player.isAudioPlaying()) {
            //  console.log("PAUSE..........");
            this._player.pause();
        } else {
            //   console.log("PLAYING........");
            this._player.play();
            this.play = true;
        }
    }
    _trackComplete(args: any) {
        // console.log('reference back to player:', args.player);
        this.play = false;
        this._player.dispose();

        // iOS only: flag indicating if completed succesfully
        //  console.log('whether song play completed successfully:', args.flag);
    }
    _trackError(args: any) {
        //  console.log('reference back to player:', args.player);
        //  console.log('the error:', args.error);

        // Android only: extra detail on error
        //  console.log('extra info on the error:', args.extra);
    }

    /* To reply for the follow up messages */

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
                    } else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
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
        if (ApplicationSettings.hasKey("refreshfollowups")) {
            if (ApplicationSettings.getString("refreshfollowups") == "yes"){
                ApplicationSettings.remove("refreshfollowups");
                this.router.navigate(["/followups"]);
            } else
                this.location.back();

        } else {
            this.location.back();
        }
    }
    hideIndicator() {
        this.webapi.loader.hide();
    }
    launchBrowser(url) {
        utilityModule.openUrl('https://www.247calladoc.com/member/' + url);
    }
    /* To convert 24 time format to 12 hours time format */
    convertTime(time24) {
        return this.webapi.convertTime24to12(time24);
    }
};