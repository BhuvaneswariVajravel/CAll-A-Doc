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
var ConsultHistoryComponent = (function () {
    function ConsultHistoryComponent(page, webapi, router, actRoute, location) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.actRoute = actRoute;
        this.location = location;
        this.isLoading = false;
        this.consultHistoryList = [];
        this.pageNum = 1;
        this.totalCount = 0;
        this.user = {};
        this.norecords = false;
        this.seachHistoryTab = false;
        this.serviceName = ["Secure Email Consult", "Diagnostic Consult", "Video Consult"];
        this.serviceStatus = ["New", "Serviced", "FollowUpOpen", "Closed"];
    }
    ConsultHistoryComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.conHisClass = true;
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.consulthistorydata(this.phyFirstName != undefined ? this.phyFirstName : "", this.phyLastName != undefined ? this.phyLastName : "", this.servName != undefined ? this.servName : "", this.servStatus != undefined ? this.servStatus : "", this.startDate != undefined ? this.startDate : "", this.endDate != undefined ? this.endDate : "", this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemSearchResultList.Successful == "true") {
                        if (result.APIResult_ConsultationItemSearchResultList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemSearchResultList.TotalItemCountInAllPages;
                            var total = result.APIResult_ConsultationItemSearchResultList.ItemList.ConsultationItemSearchResult;
                            if (total.length != undefined) {
                                for (var i = 0; i < total.length; i++) {
                                    self.consultHistoryList.push(total[i]);
                                }
                            }
                            else {
                                self.consultHistoryList.push(total);
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
                        if (result.APIResult_ConsultationItemSearchResultList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                        // console.log("Session expired or Error in getting consult history list..");
                    }
                });
            }, function (error) {
                self.hideIndicator();
                self.norecords = true;
                // console.log("Error while getting consult history.. " + error);
            });
        }
        //  });
    };
    ConsultHistoryComponent.prototype.ngAfterViewInit = function () {
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
    ConsultHistoryComponent.prototype.toggle = function () {
        if (this.seachHistoryTab)
            this.seachHistoryTab = false;
        else
            this.seachHistoryTab = true;
    };
    ConsultHistoryComponent.prototype.onSeriveChange = function (args) {
        this.servName = this.serviceName[args.selectedIndex];
    };
    ConsultHistoryComponent.prototype.onSeriveStatusChange = function (args) {
        this.servStatus = this.serviceStatus[args.selectedIndex];
    };
    ConsultHistoryComponent.prototype.loadMoreConsultItems = function () {
        var _this = this;
        var self = this;
        if (this.totalCount >= this.pageNum * 10 && this.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1;
            self.isLoading = true;
            this.webapi.consulthistorydata(this.phyFirstName != undefined ? this.phyFirstName : "", this.phyLastName != undefined ? this.phyLastName : "", this.servName != undefined ? this.servName : "", this.servStatus != undefined ? this.servStatus : "", this.startDate != undefined ? this.startDate : "", this.endDate != undefined ? this.endDate : "", this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemSearchResultList.Successful == "true") {
                        self.totalCount = result.APIResult_ConsultationItemSearchResultList.TotalItemCountInAllPages;
                        var total = result.APIResult_ConsultationItemSearchResultList.ItemList.ConsultationItemSearchResult;
                        if (total.length != undefined) {
                            for (var i = 0; i < total.length; i++) {
                                self.consultHistoryList.push(total[i]);
                            }
                        }
                        else {
                            self.consultHistoryList.push(total);
                        }
                        self.isLoading = false;
                    }
                    else {
                        self.isLoading = false;
                        if (result.APIResult_ConsultationItemSearchResultList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                        // console.log("Session expired or Error in Consult history load more..");
                    }
                });
            }, function (error) {
                _this.isLoading = false;
                //  console.log("Error while getting consult history load more.. " + error);
            });
        }
    };
    ConsultHistoryComponent.prototype.consultViewPage = function (item) {
        var navigationExtras = {
            queryParams: {
                "consultViewData": JSON.stringify(item)
            }
        };
        this.router.navigate(["/consulthistoryview"], navigationExtras);
    };
    ConsultHistoryComponent.prototype.searchConsultHistory = function () {
        var _this = this;
        this.pageNum = 1;
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.consulthistorydata(this.phyFirstName != undefined ? this.phyFirstName : "", this.phyLastName != undefined ? this.phyLastName : "", this.servName != undefined ? this.servName : "", this.servStatus != undefined ? this.servStatus : "", this.startDate != undefined ? this.startDate : "", this.endDate != undefined ? this.endDate : "", this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemSearchResultList.Successful == "true") {
                        if (result.APIResult_ConsultationItemSearchResultList.ItemCount != "0") {
                            self.seachHistoryTab = false;
                            self.totalCount = result.APIResult_ConsultationItemSearchResultList.TotalItemCountInAllPages;
                            self.consultHistoryList = [];
                            var total = result.APIResult_ConsultationItemSearchResultList.ItemList.ConsultationItemSearchResult;
                            if (total.length != undefined) {
                                for (var i = 0; i < total.length; i++) {
                                    self.consultHistoryList.push(total[i]);
                                }
                            }
                            else {
                                self.consultHistoryList.push(total);
                            }
                            self.hideIndicator();
                        }
                        else {
                            self.hideIndicator();
                        }
                    }
                    else if (result.APIResult_ConsultationItemSearchResultList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.hideIndicator();
                        self.webapi.logout();
                    }
                    else {
                        self.hideIndicator();
                        // console.log("Session expired or Error in Search consult history..");
                    }
                });
            }, function (error) {
                _this.hideIndicator();
                // console.log("Error while getting consult history search.. " + error);
            });
        }
    };
    ConsultHistoryComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    ConsultHistoryComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return ConsultHistoryComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], ConsultHistoryComponent.prototype, "radSideComponent", void 0);
ConsultHistoryComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./consulthistory.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute, common_1.Location])
], ConsultHistoryComponent);
exports.ConsultHistoryComponent = ConsultHistoryComponent;
;
// CONSULT HISTORY VIEW
var ConsultHistoryViewComponent = (function () {
    function ConsultHistoryViewComponent(page, webapi, actRoute, location, router) {
        this.page = page;
        this.webapi = webapi;
        this.actRoute = actRoute;
        this.location = location;
        this.router = router;
        this.play = false;
        this.isVisible = false;
        this.isReplyVisible = false;
        this.consultViewObj = {};
        this.actionsList = [];
        this.prognotes = [];
        this.phydocs = [];
        this.markReadVisible = false;
        this.formSubmitted = false;
        this.user = {};
        //this._player = new TNSPlayer();this._player.debug = true;
    }
    ConsultHistoryViewComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.conHisClass = true;
        ApplicationSettings.setString("refreshconsults", "no");
    };
    ConsultHistoryViewComponent.prototype.ngAfterViewInit = function () {
        var self = this;
        self.actRoute.queryParams.subscribe(function (params) {
            if (params["consultViewData"] != undefined && self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                var consultHisData_1 = JSON.parse(params["consultViewData"]);
                self.webapi.consulthistoryView(consultHisData_1.ItemId).subscribe(function (data) {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        //  console.log("KKK TTTTT  ");
                        //console.log(JSON.stringify(result.APIResult_ConsultationItemDetail));
                        if (result.APIResult_ConsultationItemDetail.Successful == "true") {
                            self.prognotes = [];
                            self.actionsList = [];
                            self.phydocs = [];
                            var consultView = result.APIResult_ConsultationItemDetail.ConsultationDetail;
                            self.consultViewObj.subject = consultView.MedicalRequestSubject;
                            self.consultViewObj.schedule = consultView.ScheduleDate;
                            self.consultViewObj.headLine = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainType;
                            self.consultViewObj.description = consultView.MedicalRequestDetails.MedicalRequestDetail.ComplainDescription;
                            self.consultViewObj.status = consultHisData_1.Status;
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
                    //  console.log("Error while getting consult history view data.. " + error);
                });
            }
        });
        if (ApplicationSettings.hasKey("USER")) {
            self.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                var userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    var index_2 = userList.findIndex(function (x) { return x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"); });
                    if (index_2 >= 0)
                        self.user.RelationShip = userList[index_2].RelationShip;
                }
                else {
                    self.user.RelationShip = "Primary Member";
                }
            }
        }
    };
    ConsultHistoryViewComponent.prototype.popupbtn = function (msg) {
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
    ConsultHistoryViewComponent.prototype.popupclose = function () {
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
    ConsultHistoryViewComponent.prototype.UserReply = function (value) {
        if (value == 'reply') {
            this.isReplyVisible = true;
            this.content = "";
            this.formSubmitted = false;
        }
        else if (value == 'markread') {
            this.markAsReadOrUnread(value);
            // console.log("mark as read");
        }
        else if (value == 'markunread') {
            this.markAsReadOrUnread(value);
            // console.log("mark as unread");
        }
    };
    ConsultHistoryViewComponent.prototype.markAsReadOrUnread = function (value) {
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
                        ApplicationSettings.setString("refreshconsults", "yes");
                        //   console.log("Success ::: " + self.consultViewObj.ItemId + " " + self.read);
                    }
                    else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        // console.log("LOGOUT DUE SESSION TIME OUT IN MARK READ IN CH --->" + result.APIResult.Message);
                        self.webapi.logout();
                    }
                    else {
                        // console.log("Session Expired or Error in Markas read or unread..." + result.APIResult.Message + " for itemId " + self.consultViewObj.ItemId);
                    }
                });
            }, function (error) {
                //console.log("Error while getting matk as read or unread.. " + error);
            });
        }
    };
    ConsultHistoryViewComponent.prototype.openAudio = function (itemId) {
        var self = this;
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.consultationRecordAudio(itemId).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PhoneCallFile.Successful == "true") {
                        self.playAudioUrl(result.APIResult_PhoneCallFile.DownloadURL);
                    }
                    else if (result.APIResult_PhoneCallFile.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        //console.log("LOGOUT DUE SESSION TIME OUT IN OPEN AUDIO IN CH --->" + result.APIResult_PhoneCallFile.Message);
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
    ConsultHistoryViewComponent.prototype.playAudioUrl = function (audiourl) {
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
                // console.log(`song duration:`, duration);
            });
        });
    };
    ConsultHistoryViewComponent.prototype.togglePlay = function () {
        if (this._player.isAudioPlaying()) {
            //  console.log("PAUSE..........");
            this._player.pause();
        }
        else {
            //  console.log("PLAYING........");
            this._player.play();
            this.play = true;
        }
    };
    ConsultHistoryViewComponent.prototype._trackComplete = function (args) {
        //  console.log('reference back to player:', args.player);
        this.play = false;
        this._player.dispose();
        // iOS only: flag indicating if completed succesfully
        //  console.log('whether song play completed successfully:', args.flag);
    };
    ConsultHistoryViewComponent.prototype._trackError = function (args) {
        // console.log('reference back to player:', args.player);
        //  console.log('the error:', args.error);
        // Android only: extra detail on error
        //   console.log('extra info on the error:', args.extra);
    };
    ConsultHistoryViewComponent.prototype.replyOrFollowUpSubmit = function (contValid) {
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
                    else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        //console.log("LOGOUT DUE SESSION TIME OUT IN REPLY OR FOLLOW UP IN CH --->" + result.APIResult.Message);
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
    ConsultHistoryViewComponent.prototype.goback = function () {
        if (this._player != undefined) {
            this._player.dispose();
        }
        if (ApplicationSettings.hasKey("refreshconsults")) {
            if (ApplicationSettings.getString("refreshconsults") == "yes") {
                ApplicationSettings.remove("refreshconsults");
                this.router.navigate(["/consulthistory"]);
            }
            else
                this.location.back();
        }
        else {
            this.location.back();
        }
    };
    ConsultHistoryViewComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    ConsultHistoryViewComponent.prototype.launchBrowser = function (url) {
        utilityModule.openUrl('https://www.247calladoc.com/member/' + url);
    };
    ConsultHistoryViewComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return ConsultHistoryViewComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], ConsultHistoryViewComponent.prototype, "radSideComponent", void 0);
ConsultHistoryViewComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./consulthistoryview.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.ActivatedRoute, common_1.Location, router_1.Router])
], ConsultHistoryViewComponent);
exports.ConsultHistoryViewComponent = ConsultHistoryViewComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VsdGhpc3RvcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3VsdGhpc3RvcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTZEO0FBQzdELDBDQUEyRTtBQUMzRSxnQ0FBK0I7QUFDL0IseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSxrRUFBZ0U7QUFDaEUsMENBQTJDO0FBQzNDLDBEQUE0RDtBQUM1RCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0MsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDNUMseURBQStDO0FBTy9DLElBQWEsdUJBQXVCO0lBU2hDLGlDQUFvQixJQUFVLEVBQVUsTUFBcUIsRUFBVSxNQUFjLEVBQVUsUUFBd0IsRUFBVSxRQUFrQjtRQUEvSCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFKN0csY0FBUyxHQUFZLEtBQUssQ0FBQztRQUNkLHVCQUFrQixHQUFRLEVBQUUsQ0FBQztRQUNoRixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQUMsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUFDLFNBQUksR0FBUSxFQUFFLENBQUM7UUFBQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBTWpFLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBSHBDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELDBDQUFRLEdB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RUFBb0IsdUJBQWMsRUFBb0IsaUJBQVEsRUFBa0IsZUFBTTtHQVAxSSwyQkFBMkIsQ0E0UXZDO0FBNVFZLGtFQUEyQjtBQTRRdkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSwgTmF2aWdhdGlvbkV4dHJhcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5sZXQgdXRpbGl0eU1vZHVsZSA9IHJlcXVpcmUoXCJ1dGlscy91dGlsc1wiKTtcbmxldCB4bWwyanMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQteG1sMmpzJyk7XG5pbXBvcnQgeyBUTlNQbGF5ZXIgfSBmcm9tICduYXRpdmVzY3JpcHQtYXVkaW8nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29uc3VsdGhpc3RvcnkuY29tcG9uZW50Lmh0bWxcIixcbiAgICBwcm92aWRlcnM6IFtXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBSYWRTaWRlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBDb25zdWx0SGlzdG9yeUNvbXBvbmVudCB7XG4gICAgcHVibGljIHBoeUZpcnN0TmFtZTogc3RyaW5nOyBwdWJsaWMgcGh5TGFzdE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgc3RhcnREYXRlOiBzdHJpbmc7IHB1YmxpYyBlbmREYXRlOiBzdHJpbmc7XG4gICAgcHVibGljIHNlcnZpY2VOYW1lOiBBcnJheTxzdHJpbmc+O1xuICAgIHB1YmxpYyBzZXJ2aWNlU3RhdHVzOiBBcnJheTxzdHJpbmc+O1xuICAgIHNlcnZOYW1lOiBzdHJpbmc7IHNlcnZTdGF0dXM6IHN0cmluZzsgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG4gICAgc2VydmljZU5hbWVJbmRleDogbnVtYmVyOyBzZXJ2U3RhdHVzSW5kZXg6IG51bWJlcjsgY29uc3VsdEhpc3RvcnlMaXN0OiBhbnkgPSBbXTtcbiAgICBwYWdlTnVtID0gMTsgdG90YWxDb3VudCA9IDA7IHVzZXI6IGFueSA9IHt9OyBub3JlY29yZHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2VydmljZU5hbWUgPSBbXCJTZWN1cmUgRW1haWwgQ29uc3VsdFwiLCBcIkRpYWdub3N0aWMgQ29uc3VsdFwiLCBcIlZpZGVvIENvbnN1bHRcIl07XG4gICAgICAgIHRoaXMuc2VydmljZVN0YXR1cyA9IFtcIk5ld1wiLCBcIlNlcnZpY2VkXCIsIFwiRm9sbG93VXBPcGVuXCIsIFwiQ2xvc2VkXCJdO1xuICAgIH1cbiAgICBwdWJsaWMgc2VhY2hIaXN0b3J5VGFiOiBib29sZWFuID0gZmFsc2U7XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlOyB0aGlzLnJhZFNpZGVDb21wb25lbnQuY29uSGlzQ2xhc3MgPSB0cnVlO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMud2ViYXBpLmNvbnN1bHRoaXN0b3J5ZGF0YSh0aGlzLnBoeUZpcnN0TmFtZSAhPSB1bmRlZmluZWQgPyB0aGlzLnBoeUZpcnN0TmFtZSA6IFwiXCIsIHRoaXMucGh5TGFzdE5hbWUgIT0gdW5kZWZpbmVkID8gdGhpcy5waHlMYXN0TmFtZSA6IFwiXCIsIHRoaXMuc2Vydk5hbWUgIT0gdW5kZWZpbmVkID8gdGhpcy5zZXJ2TmFtZSA6IFwiXCIsIHRoaXMuc2VydlN0YXR1cyAhPSB1bmRlZmluZWQgPyB0aGlzLnNlcnZTdGF0dXMgOiBcIlwiLCB0aGlzLnN0YXJ0RGF0ZSAhPSB1bmRlZmluZWQgPyB0aGlzLnN0YXJ0RGF0ZSA6IFwiXCIsIHRoaXMuZW5kRGF0ZSAhPSB1bmRlZmluZWQgPyB0aGlzLmVuZERhdGUgOiBcIlwiLCB0aGlzLnBhZ2VOdW0pLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbVNlYXJjaFJlc3VsdExpc3QuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbVNlYXJjaFJlc3VsdExpc3QuSXRlbUNvdW50ICE9IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50b3RhbENvdW50ID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtU2VhcmNoUmVzdWx0TGlzdC5Ub3RhbEl0ZW1Db3VudEluQWxsUGFnZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtU2VhcmNoUmVzdWx0TGlzdC5JdGVtTGlzdC5Db25zdWx0YXRpb25JdGVtU2VhcmNoUmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbC5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdEhpc3RvcnlMaXN0LnB1c2godG90YWxbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0SGlzdG9yeUxpc3QucHVzaCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5vcmVjb3JkcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubm9yZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1TZWFyY2hSZXN1bHRMaXN0Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgb3IgRXJyb3IgaW4gZ2V0dGluZyBjb25zdWx0IGhpc3RvcnkgbGlzdC4uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7ICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubm9yZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgY29uc3VsdCBoaXN0b3J5Li4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpO1xuICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJMaXN0ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKSk7XG4gICAgICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiTUVNQkVSX0FDQ0VTU1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB1c2VyTGlzdC5maW5kSW5kZXgoeCA9PiB4LlBlcnNvbklkID09IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiTUVNQkVSX0FDQ0VTU1wiKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gdXNlckxpc3RbaW5kZXhdLlJlbGF0aW9uU2hpcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gXCJQcmltYXJ5IE1lbWJlclwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5zZWFjaEhpc3RvcnlUYWIpXG4gICAgICAgICAgICB0aGlzLnNlYWNoSGlzdG9yeVRhYiA9IGZhbHNlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnNlYWNoSGlzdG9yeVRhYiA9IHRydWU7XG4gICAgfVxuICAgIG9uU2VyaXZlQ2hhbmdlKGFyZ3MpIHtcbiAgICAgICAgdGhpcy5zZXJ2TmFtZSA9IHRoaXMuc2VydmljZU5hbWVbYXJncy5zZWxlY3RlZEluZGV4XTtcbiAgICB9XG4gICAgb25TZXJpdmVTdGF0dXNDaGFuZ2UoYXJncykge1xuICAgICAgICB0aGlzLnNlcnZTdGF0dXMgPSB0aGlzLnNlcnZpY2VTdGF0dXNbYXJncy5zZWxlY3RlZEluZGV4XTtcbiAgICB9XG4gICAgbG9hZE1vcmVDb25zdWx0SXRlbXMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMudG90YWxDb3VudCA+PSB0aGlzLnBhZ2VOdW0gKiAxMCAmJiB0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VOdW0gPSB0aGlzLnBhZ2VOdW0gKyAxOyBzZWxmLmlzTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLndlYmFwaS5jb25zdWx0aGlzdG9yeWRhdGEodGhpcy5waHlGaXJzdE5hbWUgIT0gdW5kZWZpbmVkID8gdGhpcy5waHlGaXJzdE5hbWUgOiBcIlwiLCB0aGlzLnBoeUxhc3ROYW1lICE9IHVuZGVmaW5lZCA/IHRoaXMucGh5TGFzdE5hbWUgOiBcIlwiLCB0aGlzLnNlcnZOYW1lICE9IHVuZGVmaW5lZCA/IHRoaXMuc2Vydk5hbWUgOiBcIlwiLCB0aGlzLnNlcnZTdGF0dXMgIT0gdW5kZWZpbmVkID8gdGhpcy5zZXJ2U3RhdHVzIDogXCJcIiwgdGhpcy5zdGFydERhdGUgIT0gdW5kZWZpbmVkID8gdGhpcy5zdGFydERhdGUgOiBcIlwiLCB0aGlzLmVuZERhdGUgIT0gdW5kZWZpbmVkID8gdGhpcy5lbmREYXRlIDogXCJcIiwgdGhpcy5wYWdlTnVtKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1TZWFyY2hSZXN1bHRMaXN0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudG90YWxDb3VudCA9IHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbVNlYXJjaFJlc3VsdExpc3QuVG90YWxJdGVtQ291bnRJbkFsbFBhZ2VzO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtU2VhcmNoUmVzdWx0TGlzdC5JdGVtTGlzdC5Db25zdWx0YXRpb25JdGVtU2VhcmNoUmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFsLmxlbmd0aCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdEhpc3RvcnlMaXN0LnB1c2godG90YWxbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0SGlzdG9yeUxpc3QucHVzaCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1TZWFyY2hSZXN1bHRMaXN0Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgb3IgRXJyb3IgaW4gQ29uc3VsdCBoaXN0b3J5IGxvYWQgbW9yZS4uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgY29uc3VsdCBoaXN0b3J5IGxvYWQgbW9yZS4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN1bHRWaWV3UGFnZShpdGVtOiBhbnkpIHtcbiAgICAgICAgbGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtczoge1xuICAgICAgICAgICAgICAgIFwiY29uc3VsdFZpZXdEYXRhXCI6IEpTT04uc3RyaW5naWZ5KGl0ZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jb25zdWx0aGlzdG9yeXZpZXdcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cbiAgICBzZWFyY2hDb25zdWx0SGlzdG9yeSgpIHtcbiAgICAgICAgdGhpcy5wYWdlTnVtID0gMTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLnNob3coc2VsZi53ZWJhcGkub3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLndlYmFwaS5jb25zdWx0aGlzdG9yeWRhdGEodGhpcy5waHlGaXJzdE5hbWUgIT0gdW5kZWZpbmVkID8gdGhpcy5waHlGaXJzdE5hbWUgOiBcIlwiLCB0aGlzLnBoeUxhc3ROYW1lICE9IHVuZGVmaW5lZCA/IHRoaXMucGh5TGFzdE5hbWUgOiBcIlwiLCB0aGlzLnNlcnZOYW1lICE9IHVuZGVmaW5lZCA/IHRoaXMuc2Vydk5hbWUgOiBcIlwiLCB0aGlzLnNlcnZTdGF0dXMgIT0gdW5kZWZpbmVkID8gdGhpcy5zZXJ2U3RhdHVzIDogXCJcIiwgdGhpcy5zdGFydERhdGUgIT0gdW5kZWZpbmVkID8gdGhpcy5zdGFydERhdGUgOiBcIlwiLCB0aGlzLmVuZERhdGUgIT0gdW5kZWZpbmVkID8gdGhpcy5lbmREYXRlIDogXCJcIiwgdGhpcy5wYWdlTnVtKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1TZWFyY2hSZXN1bHRMaXN0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1TZWFyY2hSZXN1bHRMaXN0Lkl0ZW1Db3VudCAhPSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhY2hIaXN0b3J5VGFiID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50b3RhbENvdW50ID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtU2VhcmNoUmVzdWx0TGlzdC5Ub3RhbEl0ZW1Db3VudEluQWxsUGFnZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0SGlzdG9yeUxpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWwgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1TZWFyY2hSZXN1bHRMaXN0Lkl0ZW1MaXN0LkNvbnN1bHRhdGlvbkl0ZW1TZWFyY2hSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFsLmxlbmd0aCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0SGlzdG9yeUxpc3QucHVzaCh0b3RhbFtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnN1bHRIaXN0b3J5TGlzdC5wdXNoKHRvdGFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbVNlYXJjaFJlc3VsdExpc3QuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIEVycm9yIGluIFNlYXJjaCBjb25zdWx0IGhpc3RvcnkuLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgZ2V0dGluZyBjb25zdWx0IGhpc3Rvcnkgc2VhcmNoLi4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUluZGljYXRvcigpIHtcbiAgICAgICAgdGhpcy53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICB9XG4gICAgY29udmVydFRpbWUodGltZTI0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYmFwaS5jb252ZXJ0VGltZTI0dG8xMih0aW1lMjQpO1xuICAgIH1cblxufTtcbi8vIENPTlNVTFQgSElTVE9SWSBWSUVXXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29uc3VsdGhpc3Rvcnl2aWV3LmNvbXBvbmVudC5odG1sXCIsXG4gICAgcHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbiwgUmFkU2lkZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgQ29uc3VsdEhpc3RvcnlWaWV3Q29tcG9uZW50IHtcbiAgICBfcGxheWVyOiBUTlNQbGF5ZXI7IHBsYXk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpc1JlcGx5VmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlOyBjb25zdWx0Vmlld09iajogYW55ID0ge307XG4gICAgY29udGVudDogc3RyaW5nOyByZWFkOiBib29sZWFuOyBhY3Rpb25zTGlzdDogYW55ID0gW107IHByb2dub3RlczogYW55ID0gW107IHBoeWRvY3M6IGFueSA9IFtdO1xuICAgIG1hcmtSZWFkVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlOyBmb3JtU3VibWl0dGVkID0gZmFsc2U7IHVzZXI6IGFueSA9IHt9O1xuICAgIEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHtcbiAgICAgICAgLy90aGlzLl9wbGF5ZXIgPSBuZXcgVE5TUGxheWVyKCk7dGhpcy5fcGxheWVyLmRlYnVnID0gdHJ1ZTtcbiAgICB9XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlOyB0aGlzLnJhZFNpZGVDb21wb25lbnQuY29uSGlzQ2xhc3MgPSB0cnVlO1xuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInJlZnJlc2hjb25zdWx0c1wiLCBcIm5vXCIpO1xuICAgIH1cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5hY3RSb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXNbXCJjb25zdWx0Vmlld0RhdGFcIl0gIT0gdW5kZWZpbmVkICYmIHNlbGYud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcbiAgICAgICAgICAgICAgICBsZXQgY29uc3VsdEhpc0RhdGEgPSBKU09OLnBhcnNlKHBhcmFtc1tcImNvbnN1bHRWaWV3RGF0YVwiXSk7XG4gICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkuY29uc3VsdGhpc3RvcnlWaWV3KGNvbnN1bHRIaXNEYXRhLkl0ZW1JZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIktLSyBUVFRUVCAgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtRGV0YWlsKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtRGV0YWlsLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3RlcyA9IFtdOyBzZWxmLmFjdGlvbnNMaXN0ID0gW107IHNlbGYucGh5ZG9jcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb25zdWx0VmlldyA9IHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbURldGFpbC5Db25zdWx0YXRpb25EZXRhaWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5zdWJqZWN0ID0gY29uc3VsdFZpZXcuTWVkaWNhbFJlcXVlc3RTdWJqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouc2NoZWR1bGUgPSBjb25zdWx0Vmlldy5TY2hlZHVsZURhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5oZWFkTGluZSA9IGNvbnN1bHRWaWV3Lk1lZGljYWxSZXF1ZXN0RGV0YWlscy5NZWRpY2FsUmVxdWVzdERldGFpbC5Db21wbGFpblR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5kZXNjcmlwdGlvbiA9IGNvbnN1bHRWaWV3Lk1lZGljYWxSZXF1ZXN0RGV0YWlscy5NZWRpY2FsUmVxdWVzdERldGFpbC5Db21wbGFpbkRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouc3RhdHVzID0gY29uc3VsdEhpc0RhdGEuU3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouYWxyZWFkeVJlYWQgPSBjb25zdWx0Vmlldy5BbHJlYWR5UmVhZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnN1bHRWaWV3T2JqLkl0ZW1JZCA9IGNvbnN1bHRWaWV3LkNvbnRlbnRTaG9ydC5JdGVtSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5jb25zdWx0VHlwZSA9IGNvbnN1bHRWaWV3LkNvbnRlbnRTaG9ydC5Db25zdWx0YXRpb25UeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmoucmVjb3JkVXJsID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5kb2NOYW1lID0gY29uc3VsdFZpZXcuUGh5c2ljaWFuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnN1bHRWaWV3T2JqLnBoeWFkZHIgPSBjb25zdWx0Vmlldy5QaHlzaWNpYW5DaXR5KycsICcrY29uc3VsdFZpZXcuUGh5c2ljaWFuU3RhdGUrJyAnK2NvbnN1bHRWaWV3LlBoeXNpY2lhblppcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uc3VsdFZpZXcuUHJvZ3Jlc3NOb3RlRGV0YWlsQ291bnQgIT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnN1bHRWaWV3LlByb2dyZXNzTm90ZURldGFpbENvdW50ID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3Rlcy5wdXNoKGNvbnN1bHRWaWV3LlByb2dyZXNzTm90ZXMuUHJvZ3Jlc3NOb3RlRGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGggPSAwOyBoIDwgY29uc3VsdFZpZXcuUHJvZ3Jlc3NOb3Rlcy5Qcm9ncmVzc05vdGVEZXRhaWwubGVuZ3RoOyBoKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3Rlcy5wdXNoKGNvbnN1bHRWaWV3LlByb2dyZXNzTm90ZXMuUHJvZ3Jlc3NOb3RlRGV0YWlsW2hdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uc3VsdFZpZXcuUGh5c2ljaWFuSW5zdHJ1Y3Rpb25Eb2N1bWVudENvdW50ICE9IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25zdWx0Vmlldy5QaHlzaWNpYW5JbnN0cnVjdGlvbkRvY3VtZW50Q291bnQgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGh5ZG9jcy5wdXNoKGNvbnN1bHRWaWV3LlBoeXNpY2lhbkluc3RydWN0aW9uRG9jdW1lbnRzLk1lZGljYWxEb2N1bWVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjb25zdWx0Vmlldy5QaHlzaWNpYW5JbnN0cnVjdGlvbkRvY3VtZW50cy5NZWRpY2FsRG9jdW1lbnRJdGVtLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waHlkb2NzLnB1c2goY29uc3VsdFZpZXcuUGh5c2ljaWFuSW5zdHJ1Y3Rpb25Eb2N1bWVudHMuTWVkaWNhbERvY3VtZW50SXRlbVtrXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1Db3VudCA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjdGlvbnNMaXN0LnB1c2goY29uc3VsdFZpZXcuQWN0aW9uSXRlbUxpc3QuQWN0aW9uSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmoucmVjb3JkVXJsID0gY29uc3VsdFZpZXcuQWN0aW9uSXRlbUxpc3QuQWN0aW9uSXRlbS5SZWNvcmRpbmdVUkw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouYXVkaW9JdGVtSWQgPSBjb25zdWx0Vmlldy5BY3Rpb25JdGVtTGlzdC5BY3Rpb25JdGVtLkl0ZW1JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1Db3VudCAhPSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1MaXN0LkFjdGlvbkl0ZW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWN0aW9uc0xpc3QucHVzaChjb25zdWx0Vmlldy5BY3Rpb25JdGVtTGlzdC5BY3Rpb25JdGVtW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbnN1bHRWaWV3T2JqLnJlY29yZFVybCA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmoucmVjb3JkVXJsID0gY29uc3VsdFZpZXcuQWN0aW9uSXRlbUxpc3QuQWN0aW9uSXRlbVtpXS5SZWNvcmRpbmdVUkw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5hdWRpb0l0ZW1JZCA9IGNvbnN1bHRWaWV3LkFjdGlvbkl0ZW1MaXN0LkFjdGlvbkl0ZW1baV0uSXRlbUlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIEVycm9yIGluIENvbnN1bHQgaGlzdG9yeSB2aWV3IGNvbXBvbmVudC4uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgZ2V0dGluZyBjb25zdWx0IGhpc3RvcnkgdmlldyBkYXRhLi4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuICAgICAgICAgICAgc2VsZi51c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpO1xuICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJMaXN0ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKSk7XG4gICAgICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiTUVNQkVSX0FDQ0VTU1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB1c2VyTGlzdC5maW5kSW5kZXgoeCA9PiB4LlBlcnNvbklkID09IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiTUVNQkVSX0FDQ0VTU1wiKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuUmVsYXRpb25TaGlwID0gdXNlckxpc3RbaW5kZXhdLlJlbGF0aW9uU2hpcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuUmVsYXRpb25TaGlwID0gXCJQcmltYXJ5IE1lbWJlclwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvcHVwYnRuKG1zZykge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChtc2cgPT0gJ3BoeW5vdGVzJykge1xuICAgICAgICAgICAgdGhpcy5jb25zdWx0Vmlld09iai5hY3Rpb25wb3B1cCA9ICdwaHlub3Rlcyc7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmNvbnN1bHRIZWFkID0gXCJQaHlzaWNpYW4gUHJvZ3Jlc3MgTm90ZXNcIjtcbiAgICAgICAgfSBlbHNlIGlmIChtc2cgPT0gJ3BoeWluc3RyJykge1xuICAgICAgICAgICAgdGhpcy5jb25zdWx0Vmlld09iai5hY3Rpb25wb3B1cCA9ICdwaHlpbnN0cic7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmNvbnN1bHRIZWFkID0gXCJQaHlzaWNpYW4gSW5zdHJ1Y3Rpb25zXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmFjdGlvbnBvcHVwID0gJ2FjdGZvbHVwcyc7XG4gICAgICAgICAgICB0aGlzLmNvbnN1bHRWaWV3T2JqLmNvbnN1bHRIZWFkID0gXCJBY3Rpb25zIGFuZCBGb2xsb3cgdXAgbWVzc2FnZXNcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwb3B1cGNsb3NlKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlOyB0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1JlcGx5VmlzaWJsZSA9IGZhbHNlOyB0aGlzLm1hcmtSZWFkVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5fcGxheWVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBhdXNlKCk7IHRoaXMuX3BsYXllci5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGF5ID0gZmFsc2U7XG4gICAgfVxuICAgIFVzZXJSZXBseSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gJ3JlcGx5Jykge1xuICAgICAgICAgICAgdGhpcy5pc1JlcGx5VmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBcIlwiOyB0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSAnbWFya3JlYWQnKSB7XG4gICAgICAgICAgICB0aGlzLm1hcmtBc1JlYWRPclVucmVhZCh2YWx1ZSk7XG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibWFyayBhcyByZWFkXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09ICdtYXJrdW5yZWFkJykge1xuICAgICAgICAgICAgdGhpcy5tYXJrQXNSZWFkT3JVbnJlYWQodmFsdWUpO1xuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm1hcmsgYXMgdW5yZWFkXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1hcmtBc1JlYWRPclVucmVhZCh2YWx1ZSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICh2YWx1ZSA9PSAnbWFya3JlYWQnKVxuICAgICAgICAgICAgdGhpcy5yZWFkID0gdHJ1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5yZWFkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWFya1JlYWRWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIHRoaXMud2ViYXBpLm1hcmtBc1JlYWRPclVucmVhZCh0aGlzLmNvbnN1bHRWaWV3T2JqLkl0ZW1JZCwgdGhpcy5yZWFkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouYWxyZWFkeVJlYWQgPSBzZWxmLnJlYWQgIT0gZmFsc2UgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJyZWZyZXNoY29uc3VsdHNcIiwgXCJ5ZXNcIik7XG4gICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwiU3VjY2VzcyA6OjogXCIgKyBzZWxmLmNvbnN1bHRWaWV3T2JqLkl0ZW1JZCArIFwiIFwiICsgc2VsZi5yZWFkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0Lk1lc3NhZ2UgPT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkxPR09VVCBEVUUgU0VTU0lPTiBUSU1FIE9VVCBJTiBNQVJLIFJFQUQgSU4gQ0ggLS0tPlwiICsgcmVzdWx0LkFQSVJlc3VsdC5NZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNlc3Npb24gRXhwaXJlZCBvciBFcnJvciBpbiBNYXJrYXMgcmVhZCBvciB1bnJlYWQuLi5cIiArIHJlc3VsdC5BUElSZXN1bHQuTWVzc2FnZSArIFwiIGZvciBpdGVtSWQgXCIgKyBzZWxmLmNvbnN1bHRWaWV3T2JqLkl0ZW1JZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgZ2V0dGluZyBtYXRrIGFzIHJlYWQgb3IgdW5yZWFkLi4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb3BlbkF1ZGlvKGl0ZW1JZCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICB0aGlzLndlYmFwaS5jb25zdWx0YXRpb25SZWNvcmRBdWRpbyhpdGVtSWQpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfUGhvbmVDYWxsRmlsZS5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXlBdWRpb1VybChyZXN1bHQuQVBJUmVzdWx0X1Bob25lQ2FsbEZpbGUuRG93bmxvYWRVUkwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfUGhvbmVDYWxsRmlsZS5NZXNzYWdlID09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJMT0dPVVQgRFVFIFNFU1NJT04gVElNRSBPVVQgSU4gT1BFTiBBVURJTyBJTiBDSCAtLS0+XCIgKyByZXN1bHQuQVBJUmVzdWx0X1Bob25lQ2FsbEZpbGUuTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJTZXNzaW9uIEV4cGlyZWQgb3IgRXJyb3IgaW4gQVVESU8gVVJMLi4uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgQXVkaW9uIFVSTC4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBsYXlBdWRpb1VybChhdWRpb3VybCkge1xuICAgICAgICB0aGlzLl9wbGF5ZXIgPSBuZXcgVE5TUGxheWVyKCk7XG4gICAgICAgIHRoaXMuX3BsYXllci5wbGF5RnJvbVVybCh7XG4gICAgICAgICAgICBhdWRpb0ZpbGU6IGF1ZGlvdXJsLCAvLyB+ID0gYXBwIGRpcmVjdG9yeVxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrOiB0aGlzLl90cmFja0NvbXBsZXRlLmJpbmQodGhpcyksXG4gICAgICAgICAgICBlcnJvckNhbGxiYWNrOiB0aGlzLl90cmFja0Vycm9yLmJpbmQodGhpcylcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuZ2V0QXVkaW9UcmFja0R1cmF0aW9uKCkudGhlbigoZHVyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIGlPUzogZHVyYXRpb24gaXMgaW4gc2Vjb25kc1xuICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQ6IGR1cmF0aW9uIGlzIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHNvbmcgZHVyYXRpb246YCwgZHVyYXRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0b2dnbGVQbGF5KCkge1xuICAgICAgICBpZiAodGhpcy5fcGxheWVyLmlzQXVkaW9QbGF5aW5nKCkpIHtcbiAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIlBBVVNFLi4uLi4uLi4uLlwiKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5wYXVzZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiUExBWUlORy4uLi4uLi4uXCIpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMucGxheSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3RyYWNrQ29tcGxldGUoYXJnczogYW55KSB7XG4gICAgICAgIC8vICBjb25zb2xlLmxvZygncmVmZXJlbmNlIGJhY2sgdG8gcGxheWVyOicsIGFyZ3MucGxheWVyKTtcbiAgICAgICAgdGhpcy5wbGF5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BsYXllci5kaXNwb3NlKCk7XG5cbiAgICAgICAgLy8gaU9TIG9ubHk6IGZsYWcgaW5kaWNhdGluZyBpZiBjb21wbGV0ZWQgc3VjY2VzZnVsbHlcbiAgICAgICAgLy8gIGNvbnNvbGUubG9nKCd3aGV0aGVyIHNvbmcgcGxheSBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5OicsIGFyZ3MuZmxhZyk7XG4gICAgfVxuICAgIF90cmFja0Vycm9yKGFyZ3M6IGFueSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVmZXJlbmNlIGJhY2sgdG8gcGxheWVyOicsIGFyZ3MucGxheWVyKTtcbiAgICAgICAgLy8gIGNvbnNvbGUubG9nKCd0aGUgZXJyb3I6JywgYXJncy5lcnJvcik7XG5cbiAgICAgICAgLy8gQW5kcm9pZCBvbmx5OiBleHRyYSBkZXRhaWwgb24gZXJyb3JcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZygnZXh0cmEgaW5mbyBvbiB0aGUgZXJyb3I6JywgYXJncy5leHRyYSk7XG4gICAgfVxuICAgIHJlcGx5T3JGb2xsb3dVcFN1Ym1pdChjb250VmFsaWQpIHtcbiAgICAgICAgdGhpcy5mb3JtU3VibWl0dGVkID0gdHJ1ZTsgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoY29udFZhbGlkICYmIHNlbGYuY29udGVudC50cmltKCkgIT0gJycgJiYgc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgc2VsZi5pc1JlcGx5VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi53ZWJhcGkuZm9sbG93VXBPclJlcGx5KHRoaXMuY29uc3VsdFZpZXdPYmouSXRlbUlkLCB0aGlzLmNvbnN1bHRWaWV3T2JqLnN1YmplY3QsIHRoaXMuY29udGVudCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiWW91ciByZXBseSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgc3VibWl0dGVkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29uc3VsdFZpZXdPYmouZXJyb3JNc2cgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25zdWx0Vmlld09iai5lcnJvck1zZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdC5NZXNzYWdlID09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJMT0dPVVQgRFVFIFNFU1NJT04gVElNRSBPVVQgSU4gUkVQTFkgT1IgRk9MTE9XIFVQIElOIENIIC0tLT5cIiArIHJlc3VsdC5BUElSZXN1bHQuTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJzZXNzaW9uIGV4cGlyZWQgb3IgZXJyb3IgaW4gcmVwbHkgb3IgZm9sbG93IHVwLi4uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgZm9sbG93IG9yIHJlcGx5Li4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ29iYWNrKCkge1xuICAgICAgICBpZiAodGhpcy5fcGxheWVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJyZWZyZXNoY29uc3VsdHNcIikpIHtcbiAgICAgICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInJlZnJlc2hjb25zdWx0c1wiKSA9PSBcInllc1wiKSB7XG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5yZW1vdmUoXCJyZWZyZXNoY29uc3VsdHNcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NvbnN1bHRoaXN0b3J5XCJdKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubG9jYXRpb24uYmFjaygpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uLmJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWRlSW5kaWNhdG9yKCkge1xuICAgICAgICB0aGlzLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgIH1cbiAgICBsYXVuY2hCcm93c2VyKHVybCkge1xuICAgICAgICB1dGlsaXR5TW9kdWxlLm9wZW5VcmwoJ2h0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9tZW1iZXIvJyArIHVybCk7XG4gICAgfVxuICAgIGNvbnZlcnRUaW1lKHRpbWUyNCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWJhcGkuY29udmVydFRpbWUyNHRvMTIodGltZTI0KTtcbiAgICB9XG59OyJdfQ==