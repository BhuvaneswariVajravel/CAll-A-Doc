"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var radside_component_1 = require("../radside/radside.component");
var common_1 = require("@angular/common");
var ApplicationSettings = require("application-settings");
var utilityModule = require("utils/utils");
var xml2js = require('nativescript-xml2js');
var nativescript_audio_1 = require("nativescript-audio");
var FollowUpComponent = (function () {
    function FollowUpComponent(page, webapi, router, actRoute, location) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.actRoute = actRoute;
        this.location = location;
        this.followUpsList = [];
        this.user = {};
        this.norecords = false;
        this.pageNum = 1;
        this.totalCount = 0;
    }
    FollowUpComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.folUpClass = true;
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.followUpList(this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        if (result.APIResult_ConsultationItemList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                            var total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                            if (total.length != undefined) {
                                for (var i = 0; i < total.length; i++) {
                                    self.followUpsList.push(total[i]);
                                }
                            }
                            else {
                                self.followUpsList.push(total);
                            }
                            self.hideIndicator();
                        }
                        else {
                            self.hideIndicator();
                            self.norecords = true;
                        }
                    }
                    else {
                        self.hideIndicator();
                        self.norecords = true;
                        if (result.APIResult_ConsultationItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                        //console.log("Session Expired or error in getting follow ups list");
                    }
                });
            }, function (error) {
                self.norecords = true;
                self.hideIndicator();
                // console.log("Error while getting consult history.. " + error);
            });
        }
    };
    FollowUpComponent.prototype.ngAfterViewInit = function () {
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                var userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    var index_1 = userList.findIndex(function (x) { return x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"); });
                    if (index_1 >= 0)
                        this.user.RelationShip = userList[index_1].RelationShip;
                }
                else {
                    this.user.RelationShip = "Primary Member";
                }
            }
        }
    };
    FollowUpComponent.prototype.loadMoreFollowUps = function () {
        var self = this;
        if (this.totalCount >= this.pageNum * 8 && this.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1;
            self.webapi.loader.show(self.webapi.options);
            self.webapi.followUpList(this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        if (result.APIResult_ConsultationItemList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                            var total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                            if (total.length != undefined) {
                                for (var i = 0; i < total.length; i++) {
                                    self.followUpsList.push(total[i]);
                                }
                            }
                            else {
                                self.followUpsList.push(total);
                            }
                            self.hideIndicator();
                        }
                        else {
                            self.hideIndicator();
                        }
                    }
                    else if (result.APIResult_ConsultationItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        self.hideIndicator();
                        // console.log("Session Expired or error in getting load more follow ups list");
                    }
                });
            }, function (error) {
                self.hideIndicator();
                console.log("Error while getting consult history.. " + error);
            });
        }
    };
    FollowUpComponent.prototype.followUpView = function (item) {
        var navigationExtras = {
            queryParams: {
                "followUpViewData": JSON.stringify(item)
            }
        };
        this.router.navigate(["/followupview"], navigationExtras);
    };
    FollowUpComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    FollowUpComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return FollowUpComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], FollowUpComponent.prototype, "radSideComponent", void 0);
FollowUpComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./followups.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute, common_1.Location])
], FollowUpComponent);
exports.FollowUpComponent = FollowUpComponent;
;
// FOLLOWUP VIEW
var FollowUpViewComponent = (function () {
    function FollowUpViewComponent(page, webapi, actRoute, location, router) {
        this.page = page;
        this.webapi = webapi;
        this.actRoute = actRoute;
        this.location = location;
        this.router = router;
        this.play = false;
        this.isVisible = false;
        this.isReplyVisible = false;
        this.consultViewObj = {};
        this.user = {};
        this.actionsList = [];
        this.prognotes = [];
        this.phydocs = [];
        this.markReadVisible = false;
        this.formSubmitted = false;
    }
    FollowUpViewComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.folUpClass = true;
        ApplicationSettings.setString("refreshfollowups", "No");
    };
    FollowUpViewComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var self = this;
        self.actRoute.queryParams.subscribe(function (params) {
            if (params["followUpViewData"] != undefined && self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                var consultHisData = JSON.parse(params["followUpViewData"]);
                _this.webapi.consulthistoryView(consultHisData.ItemId).subscribe(function (data) {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_ConsultationItemDetail.Successful == "true") {
                            //console.log(JSON.stringify(result.APIResult_ConsultationItemDetail));
                            self.prognotes = [];
                            self.actionsList = [];
                            self.phydocs = [];
                            var consultView = result.APIResult_ConsultationItemDetail.ConsultationDetail;
                            self.consultViewObj.subject = consultView.MedicalRequestSubject;
                            self.consultViewObj.schedule = consultView.ScheduleDate;
                            self.consultViewObj.headLine = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainType;
                            self.consultViewObj.description = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainDescription;
                            self.consultViewObj.alreadyRead = consultView.AlreadyRead;
                            self.consultViewObj.ItemId = consultView.ContentShort.ItemId;
                            self.consultViewObj.consultType = consultView.ContentShort.ConsultationType;
                            self.consultViewObj.recordUrl = '';
                            self.consultViewObj.docName = consultView.PhysicianName;
                            self.consultViewObj.phyaddr = consultView.PhysicianCity + ', ' + consultView.PhysicianState + ' ' + consultView.PhysicianZip;
                            if (consultView.ProgressNoteDetailCount != "0") {
                                if (consultView.ProgressNoteDetailCount == "1") {
                                    self.prognotes.push(consultView.ProgressNotes.ProgressNoteDetail);
                                }
                                else {
                                    for (var h = 0; h < consultView.ProgressNotes.ProgressNoteDetail.length; h++) {
                                        self.prognotes.push(consultView.ProgressNotes.ProgressNoteDetail[h]);
                                    }
                                }
                            }
                            if (consultView.PhysicianInstructionDocumentCount != "0") {
                                if (consultView.PhysicianInstructionDocumentCount == "1") {
                                    self.phydocs.push(consultView.PhysicianInstructionDocuments.MedicalDocumentItem);
                                }
                                else {
                                    for (var k = 0; k < consultView.PhysicianInstructionDocuments.MedicalDocumentItem.length; k++) {
                                        self.phydocs.push(consultView.PhysicianInstructionDocuments.MedicalDocumentItem[k]);
                                    }
                                }
                            }
                            if (consultView.ActionItemCount == "1") {
                                self.actionsList.push(consultView.ActionItemList.ActionItem);
                                self.consultViewObj.recordUrl = consultView.ActionItemList.ActionItem.RecordingURL;
                                self.consultViewObj.audioItemId = consultView.ActionItemList.ActionItem.ItemId;
                            }
                            else if (consultView.ActionItemCount != "0") {
                                for (var i = 0; i < consultView.ActionItemList.ActionItem.length; i++) {
                                    self.actionsList.push(consultView.ActionItemList.ActionItem[i]);
                                    if (self.consultViewObj.recordUrl == '') {
                                        self.consultViewObj.recordUrl = consultView.ActionItemList.ActionItem[i].RecordingURL;
                                        self.consultViewObj.audioItemId = consultView.ActionItemList.ActionItem[i].ItemId;
                                    }
                                }
                            }
                            self.hideIndicator();
                        }
                        else {
                            self.hideIndicator();
                            // console.log("Session expired or Error in Consult history view component...");
                        }
                    });
                }, function (error) {
                    self.hideIndicator();
                    // console.log("Error while getting consult history view data.. " + error);
                });
            }
        });
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                var userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    var index_2 = userList.findIndex(function (x) { return x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"); });
                    if (index_2 >= 0)
                        this.user.RelationShip = userList[index_2].RelationShip;
                }
                else {
                    this.user.RelationShip = "Primary Member";
                }
            }
        }
    };
    FollowUpViewComponent.prototype.popupbtn = function (msg) {
        this.isVisible = true;
        if (msg == 'phynotes') {
            this.consultViewObj.actionpopup = 'phynotes';
            this.consultViewObj.consultHead = "Physician Progress Notes";
        }
        else if (msg == 'phyinstr') {
            this.consultViewObj.actionpopup = 'phyinstr';
            this.consultViewObj.consultHead = "Physician Instructions";
        }
        else {
            this.consultViewObj.actionpopup = 'actfolups';
            this.consultViewObj.consultHead = "Actions and Follow up messages";
        }
    };
    FollowUpViewComponent.prototype.popupclose = function () {
        this.isVisible = false;
        this.formSubmitted = false;
        this.isReplyVisible = false;
        this.markReadVisible = false;
        if (this._player != undefined) {
            this._player.pause();
            this._player.dispose();
        }
        this.play = false;
    };
    FollowUpViewComponent.prototype.UserReply = function (value) {
        if (value == 'reply') {
            this.isReplyVisible = true;
            this.content = "";
            this.formSubmitted = false;
        }
        else if (value == 'markread') {
            this.markAsReadOrUnread(value);
            console.log("mark as read");
        }
        else if (value == 'markunread') {
            this.markAsReadOrUnread(value);
            console.log("mark as unread");
        }
    };
    FollowUpViewComponent.prototype.markAsReadOrUnread = function (value) {
        var self = this;
        if (value == 'markread')
            this.read = true;
        else
            this.read = false;
        this.markReadVisible = true;
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.markAsReadOrUnread(this.consultViewObj.ItemId, this.read).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        self.consultViewObj.alreadyRead = self.read != false ? 'true' : 'false';
                        ApplicationSettings.setString("refreshfollowups", "yes");
                    }
                    else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //  console.log("Session Expired or Error in Markas read or unread..." + result.APIResult.Message + " for itemId " + self.consultViewObj.ItemId);
                    }
                });
            }, function (error) {
                // console.log("Error while getting matk as read or unread.. " + error);
            });
        }
    };
    FollowUpViewComponent.prototype.openAudio = function (itemId) {
        var self = this;
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.consultationRecordAudio(itemId).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PhoneCallFile.Successful == "true") {
                        self.playAudioUrl(result.APIResult_PhoneCallFile.DownloadURL);
                    }
                    else if (result.APIResult_PhoneCallFile.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //  console.log("Session Expired or Error in AUDIO URL...");
                    }
                });
            }, function (error) {
                // console.log("Error while getting Audion URL.. " + error);
            });
        }
    };
    FollowUpViewComponent.prototype.playAudioUrl = function (audiourl) {
        var _this = this;
        this._player = new nativescript_audio_1.TNSPlayer();
        this._player.playFromUrl({
            audioFile: audiourl,
            loop: false,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this)
        }).then(function () {
            _this._player.getAudioTrackDuration().then(function (duration) {
                _this.play = true;
                // iOS: duration is in seconds
                // Android: duration is in milliseconds
                //console.log(`song duration:`, duration);
            });
        });
    };
    FollowUpViewComponent.prototype.togglePlay = function () {
        if (this._player.isAudioPlaying()) {
            //  console.log("PAUSE..........");
            this._player.pause();
        }
        else {
            //   console.log("PLAYING........");
            this._player.play();
            this.play = true;
        }
    };
    FollowUpViewComponent.prototype._trackComplete = function (args) {
        // console.log('reference back to player:', args.player);
        this.play = false;
        this._player.dispose();
        // iOS only: flag indicating if completed succesfully
        //  console.log('whether song play completed successfully:', args.flag);
    };
    FollowUpViewComponent.prototype._trackError = function (args) {
        //  console.log('reference back to player:', args.player);
        //  console.log('the error:', args.error);
        // Android only: extra detail on error
        //  console.log('extra info on the error:', args.extra);
    };
    FollowUpViewComponent.prototype.replyOrFollowUpSubmit = function (contValid) {
        this.formSubmitted = true;
        var self = this;
        if (contValid && self.content.trim() != '' && self.webapi.netConnectivityCheck()) {
            self.isReplyVisible = false;
            self.webapi.followUpOrReply(this.consultViewObj.ItemId, this.consultViewObj.subject, this.content).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    //  console.log(JSON.stringify(result));
                    if (result.APIResult.Successful == "true") {
                        // alert("Your reply has been successfully submitted.");
                        self.consultViewObj.errorMsg = true;
                        setTimeout(function () {
                            self.consultViewObj.errorMsg = false;
                        }, 5000);
                    }
                    else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        // console.log("session expired or error in reply or follow up...");
                    }
                });
            }, function (error) {
                // console.log("Error while getting follow or reply.. " + error);
            });
        }
    };
    FollowUpViewComponent.prototype.goback = function () {
        if (this._player != undefined) {
            this._player.dispose();
        }
        if (ApplicationSettings.hasKey("refreshfollowups")) {
            if (ApplicationSettings.getString("refreshfollowups") == "yes") {
                ApplicationSettings.remove("refreshfollowups");
                this.router.navigate(["/followups"]);
            }
            else
                this.location.back();
        }
        else {
            this.location.back();
        }
    };
    FollowUpViewComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    FollowUpViewComponent.prototype.launchBrowser = function (url) {
        utilityModule.openUrl('https://www.247calladoc.com/member/' + url);
    };
    FollowUpViewComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return FollowUpViewComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], FollowUpViewComponent.prototype, "radSideComponent", void 0);
FollowUpViewComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./followupview.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.ActivatedRoute, common_1.Location, router_1.Router])
], FollowUpViewComponent);
exports.FollowUpViewComponent = FollowUpViewComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9sbG93dXBzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvbGxvd3Vwcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQTJFO0FBQzNFLGdDQUErQjtBQUMvQix5RUFBc0U7QUFDdEUsMEVBQXlFO0FBQ3pFLGtFQUFnRTtBQUNoRSwwQ0FBMkM7QUFDM0MsMERBQTREO0FBQzVELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM1Qyx5REFBK0M7QUFPL0MsSUFBYSxpQkFBaUI7SUFHMUIsMkJBQW9CLElBQVUsRUFBVSxNQUFxQixFQUFVLE1BQWMsRUFBVSxRQUF3QixFQUFVLFFBQWtCO1FBQS9ILFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUZuSixrQkFBYSxHQUFRLEVBQUUsQ0FBQztRQUFDLFNBQUksR0FBUSxFQUFFLENBQUM7UUFBQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ3BFLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFBQyxlQUFVLEdBQUcsQ0FBQyxDQUFDO0lBRTVCLENBQUM7SUFDRCxvQ0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDMUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFD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QUNELDZDQUFhLEdBQWIsVUFBYyxHQUFHO1FBQ2IsYUFBYSxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBQ0QsMkNBQVcsR0FBWCxVQUFZLE1BQU07UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0wsNEJBQUM7QUFBRCxDQUFDLEFBclFELElBcVFDO0FBOVBnQztJQUE1QixnQkFBUyxDQUFDLG9DQUFnQixDQUFDOzhCQUFtQixvQ0FBZ0I7K0RBQUM7QUFQdkQscUJBQXFCO0lBTGpDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLCtCQUErQjtRQUM1QyxTQUFTLEVBQUUsQ0FBQywrQkFBYSxFQUFFLDZCQUFhLEVBQUUsb0NBQWdCLENBQUM7S0FDOUQsQ0FBQztxQ0FTNEIsV0FBSSxFQUFrQiwrQkFBYSxFQUFvQix1QkFBYyxFQUFvQixpQkFBUSxFQUFrQixlQUFNO0dBUjFJLHFCQUFxQixDQXFRakM7QUFyUVksc0RBQXFCO0FBcVFqQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgV2ViQVBJU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvd2ViLWFwaS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFJhZFNpZGVDb21wb25lbnQgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmxldCB1dGlsaXR5TW9kdWxlID0gcmVxdWlyZShcInV0aWxzL3V0aWxzXCIpO1xubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcbmltcG9ydCB7IFROU1BsYXllciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hdWRpbyc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9mb2xsb3d1cHMuY29tcG9uZW50Lmh0bWxcIixcbiAgICBwcm92aWRlcnM6IFtXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBSYWRTaWRlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBGb2xsb3dVcENvbXBvbmVudCB7XG4gICAgZm9sbG93VXBzTGlzdDogYW55ID0gW107IHVzZXI6IGFueSA9IHt9OyBub3JlY29yZHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwYWdlTnVtID0gMTsgdG90YWxDb3VudCA9IDA7IEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24pIHtcbiAgICB9XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlOyB0aGlzLnJhZFNpZGVDb21wb25lbnQuZm9sVXBDbGFzcyA9IHRydWU7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHNlbGYud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHsvL3JlcGxhY2UgdGhpcyBpZiB3aXRoIGFib3ZlIGNvZGVcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvYWRlci5zaG93KHNlbGYud2ViYXBpLm9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy53ZWJhcGkuZm9sbG93VXBMaXN0KHRoaXMucGFnZU51bSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5JdGVtQ291bnQgIT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRvdGFsQ291bnQgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1MaXN0LlRvdGFsSXRlbUNvdW50SW5BbGxQYWdlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWwgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1MaXN0Lkl0ZW1MaXN0LkNvbnN1bHRhdGlvbkl0ZW1TaG9ydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodG90YWwubGVuZ3RoICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZvbGxvd1Vwc0xpc3QucHVzaCh0b3RhbFtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZvbGxvd1Vwc0xpc3QucHVzaCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5vcmVjb3JkcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubm9yZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1MaXN0Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJTZXNzaW9uIEV4cGlyZWQgb3IgZXJyb3IgaW4gZ2V0dGluZyBmb2xsb3cgdXBzIGxpc3RcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuXHQgICAgXHQgICAgc2VsZi5ub3JlY29yZHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgY29uc3VsdCBoaXN0b3J5Li4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJVU0VSXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSk7XG4gICAgICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIikpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXNlckxpc3QgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKTtcbiAgICAgICAgICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJNRU1CRVJfQUNDRVNTXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHVzZXJMaXN0LmZpbmRJbmRleCh4ID0+IHguUGVyc29uSWQgPT0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJNRU1CRVJfQUNDRVNTXCIpKVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlci5SZWxhdGlvblNoaXAgPSB1c2VyTGlzdFtpbmRleF0uUmVsYXRpb25TaGlwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlci5SZWxhdGlvblNoaXAgPSBcIlByaW1hcnkgTWVtYmVyXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZE1vcmVGb2xsb3dVcHMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMudG90YWxDb3VudCA+PSB0aGlzLnBhZ2VOdW0gKiA4ICYmIHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZU51bSA9IHRoaXMucGFnZU51bSArIDE7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLmZvbGxvd1VwTGlzdCh0aGlzLnBhZ2VOdW0pLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbUxpc3QuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbUxpc3QuSXRlbUNvdW50ICE9IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50b3RhbENvdW50ID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5Ub3RhbEl0ZW1Db3VudEluQWxsUGFnZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5JdGVtTGlzdC5Db25zdWx0YXRpb25JdGVtU2hvcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFsLmxlbmd0aCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb2xsb3dVcHNMaXN0LnB1c2godG90YWxbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb2xsb3dVcHNMaXN0LnB1c2godG90YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNlc3Npb24gRXhwaXJlZCBvciBlcnJvciBpbiBnZXR0aW5nIGxvYWQgbW9yZSBmb2xsb3cgdXBzIGxpc3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgY29uc3VsdCBoaXN0b3J5Li4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9sbG93VXBWaWV3KGl0ZW06IGFueSkge1xuICAgICAgICBsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgXCJmb2xsb3dVcFZpZXdEYXRhXCI6IEpTT04uc3RyaW5naWZ5KGl0ZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9mb2xsb3d1cHZpZXdcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cbiAgICBoaWRlSW5kaWNhdG9yKCkge1xuICAgICAgICB0aGlzLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgIH1cblxuICAgIGNvbnZlcnRUaW1lKHRpbWUyNCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWJhcGkuY29udmVydFRpbWUyNHRvMTIodGltZTI0KTtcbiAgICB9XG59O1xuLy8gRk9MTE9XVVAgVklFV1xuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2ZvbGxvd3Vwdmlldy5jb21wb25lbnQuaHRtbFwiLFxuICAgIHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFJhZFNpZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEZvbGxvd1VwVmlld0NvbXBvbmVudCB7XG4gICAgX3BsYXllcjogVE5TUGxheWVyOyBwbGF5OiBib29sZWFuID0gZmFsc2U7XG4gICAgaXNWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgaXNSZXBseVZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBjb25zdWx0Vmlld09iajogYW55ID0ge307IHVzZXI6IGFueSA9IHt9O1xuICAgIGNvbnRlbnQ6IHN0cmluZzsgcmVhZDogYm9vbGVhbjsgYWN0aW9uc0xpc3Q6IGFueSA9IFtdOyBwcm9nbm90ZXM6IGFueSA9IFtdOyBwaHlkb2NzOiBhbnkgPSBbXTtcbiAgICBtYXJrUmVhZFZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTsgZm9ybVN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgIEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHsgfVxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTsgdGhpcy5yYWRTaWRlQ29tcG9uZW50LmZvbFVwQ2xhc3MgPSB0cnVlO1xuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInJlZnJlc2hmb2xsb3d1cHNcIixcIk5vXCIpO1xuICAgIH1cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5hY3RSb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXNbXCJmb2xsb3dVcFZpZXdEYXRhXCJdICE9IHVuZGVmaW5lZCAmJiBzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLnNob3coc2VsZi53ZWJhcGkub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnN1bHRIaXNEYXRhID0gSlNPTi5wYXJzZShwYXJhbXNbXCJmb2xsb3dVcFZpZXdEYXRhXCJdKTtcbiAgICAgICAgICAgICAgICB0aGlzLndlYmFwaS5jb25zdWx0aGlzdG9yeVZpZXcoY29uc3VsdEhpc0RhdGEuSXRlbUlkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbURldGFpbC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1EZXRhaWwpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3RlcyA9IFtdOyBzZWxmLmFjdGlvbnNMaXN0ID0gW107IHNlbGYucGh5ZG9jcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb25zdWx0VmlldyA9IHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbURldGFpbC5Db25zdWx0YXRpb25EZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5zdWJqZWN0ID0gY29uc3VsdFZpZXcuTWVkaWNhbFJlcXVlc3RTdWJqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouc2NoZWR1bGUgPSBjb25zdWx0Vmlldy5TY2hlZHVsZURhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5oZWFkTGluZSA9IGNvbnN1bHRWaWV3Lk1lZGljYWxSZXF1ZXN0RGV0YWlscy5NZWRpY2FsUmVxdWVzdERldGFpbC5Db21wbGFpblR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5kZXNjcmlwdGlvbiA9IGNvbnN1bHRWaWV3Lk1lZGljYWxSZXF1ZXN0RGV0YWlscy5NZWRpY2FsUmVxdWVzdERldGFpbC5Db21wbGFpbkRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouYWxyZWFkeVJlYWQgPSBjb25zdWx0Vmlldy5BbHJlYWR5UmVhZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnN1bHRWaWV3T2JqLkl0ZW1JZCA9IGNvbnN1bHRWaWV3LkNvbnRlbnRTaG9ydC5JdGVtSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5jb25zdWx0VHlwZSA9IGNvbnN1bHRWaWV3LkNvbnRlbnRTaG9ydC5Db25zdWx0YXRpb25UeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmoucmVjb3JkVXJsID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5kb2NOYW1lID0gY29uc3VsdFZpZXcuUGh5c2ljaWFuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnN1bHRWaWV3T2JqLnBoeWFkZHIgPSBjb25zdWx0Vmlldy5QaHlzaWNpYW5DaXR5KycsICcrY29uc3VsdFZpZXcuUGh5c2ljaWFuU3RhdGUrJyAnK2NvbnN1bHRWaWV3LlBoeXNpY2lhblppcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uc3VsdFZpZXcuUHJvZ3Jlc3NOb3RlRGV0YWlsQ291bnQgIT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnN1bHRWaWV3LlByb2dyZXNzTm90ZURldGFpbENvdW50ID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3Rlcy5wdXNoKGNvbnN1bHRWaWV3LlByb2dyZXNzTm90ZXMuUHJvZ3Jlc3NOb3RlRGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGggPSAwOyBoIDwgY29uc3VsdFZpZXcuUHJvZ3Jlc3NOb3Rlcy5Qcm9ncmVzc05vdGVEZXRhaWwubGVuZ3RoOyBoKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3Rlcy5wdXNoKGNvbnN1bHRWaWV3LlByb2dyZXNzTm90ZXMuUHJvZ3Jlc3NOb3RlRGV0YWlsW2hdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uc3VsdFZpZXcuUGh5c2ljaWFuSW5zdHJ1Y3Rpb25Eb2N1bWVudENvdW50ICE9IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25zdWx0Vmlldy5QaHlzaWNpYW5JbnN0cnVjdGlvbkRvY3VtZW50Q291bnQgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGh5ZG9jcy5wdXNoKGNvbnN1bHRWaWV3LlBoeXNpY2lhbkluc3RydWN0aW9uRG9jdW1lbnRzLk1lZGljYWxEb2N1bWVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjb25zdWx0Vmlldy5QaHlzaWNpYW5JbnN0cnVjdGlvbkRvY3VtZW50cy5NZWRpY2FsRG9jdW1lbnRJdGVtLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waHlkb2NzLnB1c2goY29uc3VsdFZpZXcuUGh5c2ljaWFuSW5zdHJ1Y3Rpb25Eb2N1bWVudHMuTWVkaWNhbERvY3VtZW50SXRlbVtrXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1Db3VudCA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjdGlvbnNMaXN0LnB1c2goY29uc3VsdFZpZXcuQWN0aW9uSXRlbUxpc3QuQWN0aW9uSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmoucmVjb3JkVXJsID0gY29uc3VsdFZpZXcuQWN0aW9uSXRlbUxpc3QuQWN0aW9uSXRlbS5SZWNvcmRpbmdVUkw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouYXVkaW9JdGVtSWQgPSBjb25zdWx0Vmlldy5BY3Rpb25JdGVtTGlzdC5BY3Rpb25JdGVtLkl0ZW1JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1Db3VudCAhPSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1MaXN0LkFjdGlvbkl0ZW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWN0aW9uc0xpc3QucHVzaChjb25zdWx0Vmlldy5BY3Rpb25JdGVtTGlzdC5BY3Rpb25JdGVtW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbnN1bHRWaWV3T2JqLnJlY29yZFVybCA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmoucmVjb3JkVXJsID0gY29uc3VsdFZpZXcuQWN0aW9uSXRlbUxpc3QuQWN0aW9uSXRlbVtpXS5SZWNvcmRpbmdVUkw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5hdWRpb0l0ZW1JZCA9IGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1MaXN0LkFjdGlvbkl0ZW1baV0uSXRlbUlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIEVycm9yIGluIENvbnN1bHQgaGlzdG9yeSB2aWV3IGNvbXBvbmVudC4uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgZ2V0dGluZyBjb25zdWx0IGhpc3RvcnkgdmlldyBkYXRhLi4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpO1xuICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJMaXN0ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKSk7XG4gICAgICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiTUVNQkVSX0FDQ0VTU1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB1c2VyTGlzdC5maW5kSW5kZXgoeCA9PiB4LlBlcnNvbklkID09IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiTUVNQkVSX0FDQ0VTU1wiKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gdXNlckxpc3RbaW5kZXhdLlJlbGF0aW9uU2hpcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gXCJQcmltYXJ5IE1lbWJlclwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvcHVwYnRuKG1zZykge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChtc2cgPT0gJ3BoeW5vdGVzJykge1xuICAgICAgICAgICAgdGhpcy5jb25zdWx0Vmlld09iai5hY3Rpb25wb3B1cCA9ICdwaHlub3Rlcyc7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmNvbnN1bHRIZWFkID0gXCJQaHlzaWNpYW4gUHJvZ3Jlc3MgTm90ZXNcIjtcbiAgICAgICAgfSBlbHNlIGlmIChtc2cgPT0gJ3BoeWluc3RyJykge1xuICAgICAgICAgICAgdGhpcy5jb25zdWx0Vmlld09iai5hY3Rpb25wb3B1cCA9ICdwaHlpbnN0cic7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmNvbnN1bHRIZWFkID0gXCJQaHlzaWNpYW4gSW5zdHJ1Y3Rpb25zXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmFjdGlvbnBvcHVwID0gJ2FjdGZvbHVwcyc7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmNvbnN1bHRIZWFkID0gXCJBY3Rpb25zIGFuZCBGb2xsb3cgdXAgbWVzc2FnZXNcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwb3B1cGNsb3NlKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlOyB0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1JlcGx5VmlzaWJsZSA9IGZhbHNlOyB0aGlzLm1hcmtSZWFkVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5fcGxheWVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBhdXNlKCk7IHRoaXMuX3BsYXllci5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGF5ID0gZmFsc2U7XG4gICAgfVxuICAgIFVzZXJSZXBseSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gJ3JlcGx5Jykge1xuICAgICAgICAgICAgdGhpcy5pc1JlcGx5VmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBcIlwiOyB0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSAnbWFya3JlYWQnKSB7XG4gICAgICAgICAgICB0aGlzLm1hcmtBc1JlYWRPclVucmVhZCh2YWx1ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1hcmsgYXMgcmVhZFwiKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSAnbWFya3VucmVhZCcpIHtcbiAgICAgICAgICAgIHRoaXMubWFya0FzUmVhZE9yVW5yZWFkKHZhbHVlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFyayBhcyB1bnJlYWRcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWFya0FzUmVhZE9yVW5yZWFkKHZhbHVlKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHZhbHVlID09ICdtYXJrcmVhZCcpXG4gICAgICAgICAgICB0aGlzLnJlYWQgPSB0cnVlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnJlYWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXJrUmVhZFZpc2libGUgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgdGhpcy53ZWJhcGkubWFya0FzUmVhZE9yVW5yZWFkKHRoaXMuY29uc3VsdFZpZXdPYmouSXRlbUlkLCB0aGlzLnJlYWQpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5hbHJlYWR5UmVhZCA9IHNlbGYucmVhZCAhPSBmYWxzZSA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInJlZnJlc2hmb2xsb3d1cHNcIiwgXCJ5ZXNcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJTZXNzaW9uIEV4cGlyZWQgb3IgRXJyb3IgaW4gTWFya2FzIHJlYWQgb3IgdW5yZWFkLi4uXCIgKyByZXN1bHQuQVBJUmVzdWx0Lk1lc3NhZ2UgKyBcIiBmb3IgaXRlbUlkIFwiICsgc2VsZi5jb25zdWx0Vmlld09iai5JdGVtSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgbWF0ayBhcyByZWFkIG9yIHVucmVhZC4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9wZW5BdWRpbyhpdGVtSWQpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgdGhpcy53ZWJhcGkuY29uc3VsdGF0aW9uUmVjb3JkQXVkaW8oaXRlbUlkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X1Bob25lQ2FsbEZpbGUuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5QXVkaW9VcmwocmVzdWx0LkFQSVJlc3VsdF9QaG9uZUNhbGxGaWxlLkRvd25sb2FkVVJMKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0X1Bob25lQ2FsbEZpbGUuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBFeHBpcmVkIG9yIEVycm9yIGluIEFVRElPIFVSTC4uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBnZXR0aW5nIEF1ZGlvbiBVUkwuLiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwbGF5QXVkaW9VcmwoYXVkaW91cmwpIHtcbiAgICAgICAgdGhpcy5fcGxheWVyID0gbmV3IFROU1BsYXllcigpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIucGxheUZyb21Vcmwoe1xuICAgICAgICAgICAgYXVkaW9GaWxlOiBhdWRpb3VybCwgLy8gfiA9IGFwcCBkaXJlY3RvcnlcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjazogdGhpcy5fdHJhY2tDb21wbGV0ZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgZXJyb3JDYWxsYmFjazogdGhpcy5fdHJhY2tFcnJvci5iaW5kKHRoaXMpXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLmdldEF1ZGlvVHJhY2tEdXJhdGlvbigpLnRoZW4oKGR1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBpT1M6IGR1cmF0aW9uIGlzIGluIHNlY29uZHNcbiAgICAgICAgICAgICAgICAvLyBBbmRyb2lkOiBkdXJhdGlvbiBpcyBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBzb25nIGR1cmF0aW9uOmAsIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdG9nZ2xlUGxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BsYXllci5pc0F1ZGlvUGxheWluZygpKSB7XG4gICAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJQQVVTRS4uLi4uLi4uLi5cIik7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coXCJQTEFZSU5HLi4uLi4uLi5cIik7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIucGxheSgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfdHJhY2tDb21wbGV0ZShhcmdzOiBhbnkpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZmVyZW5jZSBiYWNrIHRvIHBsYXllcjonLCBhcmdzLnBsYXllcik7XG4gICAgICAgIHRoaXMucGxheSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wbGF5ZXIuZGlzcG9zZSgpO1xuXG4gICAgICAgIC8vIGlPUyBvbmx5OiBmbGFnIGluZGljYXRpbmcgaWYgY29tcGxldGVkIHN1Y2Nlc2Z1bGx5XG4gICAgICAgIC8vICBjb25zb2xlLmxvZygnd2hldGhlciBzb25nIHBsYXkgY29tcGxldGVkIHN1Y2Nlc3NmdWxseTonLCBhcmdzLmZsYWcpO1xuICAgIH1cbiAgICBfdHJhY2tFcnJvcihhcmdzOiBhbnkpIHtcbiAgICAgICAgLy8gIGNvbnNvbGUubG9nKCdyZWZlcmVuY2UgYmFjayB0byBwbGF5ZXI6JywgYXJncy5wbGF5ZXIpO1xuICAgICAgICAvLyAgY29uc29sZS5sb2coJ3RoZSBlcnJvcjonLCBhcmdzLmVycm9yKTtcblxuICAgICAgICAvLyBBbmRyb2lkIG9ubHk6IGV4dHJhIGRldGFpbCBvbiBlcnJvclxuICAgICAgICAvLyAgY29uc29sZS5sb2coJ2V4dHJhIGluZm8gb24gdGhlIGVycm9yOicsIGFyZ3MuZXh0cmEpO1xuICAgIH1cbiAgICByZXBseU9yRm9sbG93VXBTdWJtaXQoY29udFZhbGlkKSB7XG4gICAgICAgIHRoaXMuZm9ybVN1Ym1pdHRlZCA9IHRydWU7IGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKGNvbnRWYWxpZCAmJiBzZWxmLmNvbnRlbnQudHJpbSgpICE9ICcnICYmIHNlbGYud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIHNlbGYuaXNSZXBseVZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLmZvbGxvd1VwT3JSZXBseSh0aGlzLmNvbnN1bHRWaWV3T2JqLkl0ZW1JZCwgdGhpcy5jb25zdWx0Vmlld09iai5zdWJqZWN0LCB0aGlzLmNvbnRlbnQpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIllvdXIgcmVwbHkgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHN1Ym1pdHRlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnN1bHRWaWV3T2JqLmVycm9yTXNnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouZXJyb3JNc2cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHQuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2Vzc2lvbiBleHBpcmVkIG9yIGVycm9yIGluIHJlcGx5IG9yIGZvbGxvdyB1cC4uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBnZXR0aW5nIGZvbGxvdyBvciByZXBseS4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdvYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BsYXllciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwicmVmcmVzaGZvbGxvd3Vwc1wiKSkge1xuICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwicmVmcmVzaGZvbGxvd3Vwc1wiKSA9PSBcInllc1wiKXtcbiAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnJlbW92ZShcInJlZnJlc2hmb2xsb3d1cHNcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2ZvbGxvd3Vwc1wiXSk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2F0aW9uLmJhY2soKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2NhdGlvbi5iYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUluZGljYXRvcigpIHtcbiAgICAgICAgdGhpcy53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICB9XG4gICAgbGF1bmNoQnJvd3Nlcih1cmwpIHtcbiAgICAgICAgdXRpbGl0eU1vZHVsZS5vcGVuVXJsKCdodHRwczovL3d3dy4yNDdjYWxsYWRvYy5jb20vbWVtYmVyLycgKyB1cmwpO1xuICAgIH1cbiAgICBjb252ZXJ0VGltZSh0aW1lMjQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2ViYXBpLmNvbnZlcnRUaW1lMjR0bzEyKHRpbWUyNCk7XG4gICAgfVxufTsiXX0=