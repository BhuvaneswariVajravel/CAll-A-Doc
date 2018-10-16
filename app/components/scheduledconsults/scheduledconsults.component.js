"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var common_1 = require("@angular/common");
var radside_component_1 = require("../radside/radside.component");
var ApplicationSettings = require("application-settings");
var xml2js = require('nativescript-xml2js');
// SCHEDULE CONSULT
var ScheduledConsultsComponent = (function () {
    function ScheduledConsultsComponent(page, webapi, router, actRoute, location) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.actRoute = actRoute;
        this.location = location;
        this.pageNum = 1;
        this.totalCount = 0;
        this.user = {};
        this.norecords = false;
        this.scheduledConsultList = [];
        this.isLoading = false;
    }
    ScheduledConsultsComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.schConslts = true;
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.scheduledconsults(this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        if (result.APIResult_ConsultationItemList.ItemCount != "0") {
                            self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                            var total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                            if (total.length != undefined) {
                                for (var i = 0; i < total.length; i++) {
                                    self.scheduledConsultList.push(total[i]);
                                    console.log(total[i].RelatedTime + "   REALTIME   Item Id" + total[i].ItemId);
                                }
                            }
                            else {
                                self.scheduledConsultList.push(total);
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
                        //console.log("Session expired / Error in Scheduled list");
                    }
                });
            }, function (error) {
                self.norecords = true;
                self.hideIndicator();
                //console.log("Error while getting scheduled consult.. " + error);
            });
        }
    };
    ScheduledConsultsComponent.prototype.ngAfterViewInit = function () {
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
    ScheduledConsultsComponent.prototype.scheduleView = function (item) {
        var navigationExtras = {
            queryParams: {
                "scheduleList": JSON.stringify(item)
            }
        };
        this.router.navigate(["/scheduledconsultsview"], navigationExtras);
    };
    ScheduledConsultsComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    ScheduledConsultsComponent.prototype.loadMoreScheduleList = function () {
        var self = this;
        if (this.totalCount >= this.pageNum * 6 && this.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1;
            self.isLoading = true;
            this.webapi.scheduledconsults(this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_ConsultationItemList.Successful == "true") {
                        self.totalCount = result.APIResult_ConsultationItemList.TotalItemCountInAllPages;
                        var total = result.APIResult_ConsultationItemList.ItemList.ConsultationItemShort;
                        if (total.length != undefined) {
                            for (var i = 0; i < total.length; i++) {
                                self.scheduledConsultList.push(total[i]);
                                console.log(total[i].RelatedTime + "   REALTIME   Item Id" + total[i].ItemId);
                            }
                        }
                        else {
                            self.scheduledConsultList.push({ "ConsultationType": total.ConsultationType, "ItemId": total.ItemId, "RelatedTime": total.RelatedTime });
                        }
                        self.isLoading = false;
                    }
                    else {
                        self.isLoading = false;
                        //console.log("Session expired / Error in load more Scheduled list");
                    }
                });
            }, function (error) {
                self.isLoading = false;
                console.log("Error while getting Schedule consults load more.. " + error);
            });
        }
    };
    ScheduledConsultsComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return ScheduledConsultsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], ScheduledConsultsComponent.prototype, "radSideComponent", void 0);
ScheduledConsultsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./scheduledconsults.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute, common_1.Location])
], ScheduledConsultsComponent);
exports.ScheduledConsultsComponent = ScheduledConsultsComponent;
;
// SCHEDULE CONSULT VIEW
var ScheduledConsultsViewComponent = (function () {
    function ScheduledConsultsViewComponent(page, webapi, actRoute, router, location) {
        this.page = page;
        this.webapi = webapi;
        this.actRoute = actRoute;
        this.router = router;
        this.location = location;
        this.actionsList = [];
        this.prognotes = [];
        this.phydocs = [];
        this.schViewObj = {};
        this.isVisible = false;
        this.user = {};
    }
    ScheduledConsultsViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.schConslts = true;
        self.actRoute.queryParams.subscribe(function (params) {
            if (params["scheduleList"] != undefined && self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                var scheduleItem = JSON.parse(params["scheduleList"]);
                _this.webapi.consulthistoryView(scheduleItem.ItemId).subscribe(function (data) {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_ConsultationItemDetail.Successful == "true") {
                            self.prognotes = [];
                            self.actionsList = [];
                            self.phydocs = [];
                            var scheduleView = result.APIResult_ConsultationItemDetail.ConsultationDetail;
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
                                }
                                else {
                                    for (var h = 0; h < scheduleView.ProgressNotes.ProgressNoteDetail.length; h++) {
                                        self.prognotes.push(scheduleView.ProgressNotes.ProgressNoteDetail[h]);
                                    }
                                }
                            }
                            if (scheduleView.PhysicianInstructionDocumentCount != "0") {
                                if (scheduleView.PhysicianInstructionDocumentCount == "1") {
                                    self.phydocs.push(scheduleView.PhysicianInstructionDocuments.MedicalDocumentItem);
                                }
                                else {
                                    for (var k = 0; k < scheduleView.PhysicianInstructionDocuments.MedicalDocumentItem.length; k++) {
                                        self.phydocs.push(scheduleView.PhysicianInstructionDocuments.MedicalDocumentItem[k]);
                                    }
                                }
                            }
                            if (scheduleView.ActionItemCount == "1") {
                                self.actionsList.push(scheduleView.ActionItemList.ActionItem);
                            }
                            else if (scheduleView.ActionItemCount != "0") {
                                for (var i = 0; i < scheduleView.ActionItemList.ActionItem.length; i++) {
                                    self.actionsList.push(scheduleView.ActionItemList.ActionItem[i]);
                                }
                            }
                            self.hideIndicator();
                        }
                        else {
                            self.hideIndicator();
                            // console.log("Session expired / Error in Scheduled list view");
                        }
                    });
                }, function (error) {
                    //console.log("Error while getting consult history view data.. " + error);
                });
            }
        });
    };
    ScheduledConsultsViewComponent.prototype.ngAfterViewInit = function () {
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
    ScheduledConsultsViewComponent.prototype.popupbtn = function (msg) {
        this.isVisible = true;
        if (msg == 'phynotes') {
            this.schViewObj.actionpopup = 'phynotes';
            this.schViewObj.consultHead = "Physician Progress Notes";
        }
        else if (msg == 'phyinstr') {
            this.schViewObj.actionpopup = 'phyinstr';
            this.schViewObj.consultHead = "Physician Instructions";
        }
        else {
            this.schViewObj.actionpopup = 'action';
            this.schViewObj.consultHead = "Actions and Follow up messages";
        }
    };
    ScheduledConsultsViewComponent.prototype.popupclose = function () {
        this.isVisible = false;
    };
    ScheduledConsultsViewComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    ScheduledConsultsViewComponent.prototype.goback = function () {
        this.location.back();
    };
    ScheduledConsultsViewComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return ScheduledConsultsViewComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], ScheduledConsultsViewComponent.prototype, "radSideComponent", void 0);
ScheduledConsultsViewComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./scheduledconsultsview.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.ActivatedRoute, router_1.Router, common_1.Location])
], ScheduledConsultsViewComponent);
exports.ScheduledConsultsViewComponent = ScheduledConsultsViewComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVkY29uc3VsdHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZWR1bGVkY29uc3VsdHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTZEO0FBQzdELDBDQUEyRTtBQUMzRSxnQ0FBK0I7QUFDL0IseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSwwQ0FBMkM7QUFDM0Msa0VBQWdFO0FBQ2hFLDBEQUE0RDtBQUM1RCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM1QyxtQkFBbUI7QUFNbkIsSUFBYSwwQkFBMEI7SUFJbkMsb0NBQW9CLElBQVUsRUFBVSxNQUFxQixFQUFVLE1BQWMsRUFBVSxRQUF3QixFQUFVLFFBQWtCO1FBQS9ILFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUhuSixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQUMsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUFDLFNBQUksR0FBUSxFQUFFLENBQUM7UUFBQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ3hFLHlCQUFvQixHQUFRLEVBQUUsQ0FBQztRQUFDLGNBQVMsR0FBWSxLQUFLLENBQUM7SUFFNEYsQ0FBQztJQUN4Siw2Q0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxN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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUsIE5hdmlnYXRpb25FeHRyYXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUmFkU2lkZUNvbXBvbmVudCB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUuY29tcG9uZW50XCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcbi8vIFNDSEVEVUxFIENPTlNVTFRcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9zY2hlZHVsZWRjb25zdWx0cy5jb21wb25lbnQuaHRtbFwiLFxuICAgIHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFJhZFNpZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlZENvbnN1bHRzQ29tcG9uZW50IHtcbiAgICBwYWdlTnVtID0gMTsgdG90YWxDb3VudCA9IDA7IHVzZXI6IGFueSA9IHt9OyBub3JlY29yZHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzY2hlZHVsZWRDb25zdWx0TGlzdDogYW55ID0gW107IGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24pIHsgfVxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yYWRTaWRlQ29tcG9uZW50LnNjaENvbnNsdHMgPSB0cnVlO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMud2ViYXBpLnNjaGVkdWxlZGNvbnN1bHRzKHRoaXMucGFnZU51bSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5JdGVtQ291bnQgIT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRvdGFsQ291bnQgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1MaXN0LlRvdGFsSXRlbUNvdW50SW5BbGxQYWdlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWwgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1MaXN0Lkl0ZW1MaXN0LkNvbnN1bHRhdGlvbkl0ZW1TaG9ydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodG90YWwubGVuZ3RoICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNjaGVkdWxlZENvbnN1bHRMaXN0LnB1c2godG90YWxbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codG90YWxbaV0uUmVsYXRlZFRpbWUrXCIgICBSRUFMVElNRSAgIEl0ZW0gSWRcIit0b3RhbFtpXS5JdGVtSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zY2hlZHVsZWRDb25zdWx0TGlzdC5wdXNoKHRvdGFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubm9yZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5ub3JlY29yZHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbUxpc3QuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlNlc3Npb24gZXhwaXJlZCAvIEVycm9yIGluIFNjaGVkdWxlZCBsaXN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ub3JlY29yZHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgc2NoZWR1bGVkIGNvbnN1bHQuLiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpO1xuICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJMaXN0ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKSk7XG4gICAgICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiTUVNQkVSX0FDQ0VTU1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB1c2VyTGlzdC5maW5kSW5kZXgoeCA9PiB4LlBlcnNvbklkID09IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiTUVNQkVSX0FDQ0VTU1wiKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gdXNlckxpc3RbaW5kZXhdLlJlbGF0aW9uU2hpcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gXCJQcmltYXJ5IE1lbWJlclwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2NoZWR1bGVWaWV3KGl0ZW06IGFueSkge1xuICAgICAgICBsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgXCJzY2hlZHVsZUxpc3RcIjogSlNPTi5zdHJpbmdpZnkoaXRlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NjaGVkdWxlZGNvbnN1bHRzdmlld1wiXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG4gICAgfVxuICAgIGhpZGVJbmRpY2F0b3IoKSB7XG4gICAgICAgIHRoaXMud2ViYXBpLmxvYWRlci5oaWRlKCk7XG4gICAgfVxuICAgIGxvYWRNb3JlU2NoZWR1bGVMaXN0KCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLnRvdGFsQ291bnQgPj0gdGhpcy5wYWdlTnVtICogNiAmJiB0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VOdW0gPSB0aGlzLnBhZ2VOdW0gKyAxOyBzZWxmLmlzTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLndlYmFwaS5zY2hlZHVsZWRjb25zdWx0cyh0aGlzLnBhZ2VOdW0pLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdGF0aW9uSXRlbUxpc3QuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50b3RhbENvdW50ID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtTGlzdC5Ub3RhbEl0ZW1Db3VudEluQWxsUGFnZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWwgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1MaXN0Lkl0ZW1MaXN0LkNvbnN1bHRhdGlvbkl0ZW1TaG9ydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbC5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNjaGVkdWxlZENvbnN1bHRMaXN0LnB1c2godG90YWxbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3RhbFtpXS5SZWxhdGVkVGltZStcIiAgIFJFQUxUSU1FICAgSXRlbSBJZFwiK3RvdGFsW2ldLkl0ZW1JZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNjaGVkdWxlZENvbnN1bHRMaXN0LnB1c2goeyBcIkNvbnN1bHRhdGlvblR5cGVcIjogdG90YWwuQ29uc3VsdGF0aW9uVHlwZSwgXCJJdGVtSWRcIjogdG90YWwuSXRlbUlkLCBcIlJlbGF0ZWRUaW1lXCI6IHRvdGFsLlJlbGF0ZWRUaW1lIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIC8gRXJyb3IgaW4gbG9hZCBtb3JlIFNjaGVkdWxlZCBsaXN0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgU2NoZWR1bGUgY29uc3VsdHMgbG9hZCBtb3JlLi4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29udmVydFRpbWUodGltZTI0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYmFwaS5jb252ZXJ0VGltZTI0dG8xMih0aW1lMjQpO1xuICAgIH1cbn07XG4vLyBTQ0hFRFVMRSBDT05TVUxUIFZJRVdcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9zY2hlZHVsZWRjb25zdWx0c3ZpZXcuY29tcG9uZW50Lmh0bWxcIixcbiAgICBwcm92aWRlcnM6IFtXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBSYWRTaWRlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZWRDb25zdWx0c1ZpZXdDb21wb25lbnQge1xuICAgIGFjdGlvbnNMaXN0OiBhbnkgPSBbXTsgcHJvZ25vdGVzOiBhbnkgPSBbXTsgcGh5ZG9jczogYW55ID0gW107IHNjaFZpZXdPYmo6IGFueSA9IHt9O1xuICAgIGlzVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlOyBwaHlJbnN0ckRvYzogc3RyaW5nOyB1c2VyOiBhbnkgPSB7fTtcbiAgICBAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uKSB7IH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzOyB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yYWRTaWRlQ29tcG9uZW50LnNjaENvbnNsdHMgPSB0cnVlO1xuICAgICAgICBzZWxmLmFjdFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgICAgICAgaWYgKHBhcmFtc1tcInNjaGVkdWxlTGlzdFwiXSAhPSB1bmRlZmluZWQgJiYgc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvYWRlci5zaG93KHNlbGYud2ViYXBpLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGxldCBzY2hlZHVsZUl0ZW0gPSBKU09OLnBhcnNlKHBhcmFtc1tcInNjaGVkdWxlTGlzdFwiXSk7XG4gICAgICAgICAgICAgICAgdGhpcy53ZWJhcGkuY29uc3VsdGhpc3RvcnlWaWV3KHNjaGVkdWxlSXRlbS5JdGVtSWQpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0YXRpb25JdGVtRGV0YWlsLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3RlcyA9IFtdOyBzZWxmLmFjdGlvbnNMaXN0ID0gW107IHNlbGYucGh5ZG9jcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzY2hlZHVsZVZpZXcgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRhdGlvbkl0ZW1EZXRhaWwuQ29uc3VsdGF0aW9uRGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2NoVmlld09iai5zdWJqZWN0ID0gc2NoZWR1bGVWaWV3Lk1lZGljYWxSZXF1ZXN0U3ViamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNjaFZpZXdPYmouY29uc3VsdFR5cGUgPSBzY2hlZHVsZVZpZXcuQ29udGVudFNob3J0LkNvbnN1bHRhdGlvblR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zY2hWaWV3T2JqLnNjaGVkdWxlID0gc2NoZWR1bGVWaWV3LlNjaGVkdWxlRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNjaFZpZXdPYmouaGVhZExpbmUgPSBzY2hlZHVsZVZpZXcuTWVkaWNhbFJlcXVlc3REZXRhaWxzLk1lZGljYWxSZXF1ZXN0RGV0YWlsLkNvbXBsYWluVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNjaFZpZXdPYmouZGVzY3JpcHRpb24gPSBzY2hlZHVsZVZpZXcuTWVkaWNhbFJlcXVlc3REZXRhaWxzLk1lZGljYWxSZXF1ZXN0RGV0YWlsLkNvbXBsYWluRGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zY2hWaWV3T2JqLmRvY05hbWUgPSBzY2hlZHVsZVZpZXcuUGh5c2ljaWFuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNjaFZpZXdPYmoucGh5YWRkciA9IHNjaGVkdWxlVmlldy5QaHlzaWNpYW5DaXR5ICsgJywgJyArIHNjaGVkdWxlVmlldy5QaHlzaWNpYW5TdGF0ZSArICcgJyArIHNjaGVkdWxlVmlldy5QaHlzaWNpYW5aaXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVkdWxlVmlldy5Qcm9ncmVzc05vdGVEZXRhaWxDb3VudCAhPSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZWR1bGVWaWV3LlByb2dyZXNzTm90ZURldGFpbENvdW50ID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2dub3Rlcy5wdXNoKHNjaGVkdWxlVmlldy5Qcm9ncmVzc05vdGVzLlByb2dyZXNzTm90ZURldGFpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBoID0gMDsgaCA8IHNjaGVkdWxlVmlldy5Qcm9ncmVzc05vdGVzLlByb2dyZXNzTm90ZURldGFpbC5sZW5ndGg7IGgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHJvZ25vdGVzLnB1c2goc2NoZWR1bGVWaWV3LlByb2dyZXNzTm90ZXMuUHJvZ3Jlc3NOb3RlRGV0YWlsW2hdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZWR1bGVWaWV3LlBoeXNpY2lhbkluc3RydWN0aW9uRG9jdW1lbnRDb3VudCAhPSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZWR1bGVWaWV3LlBoeXNpY2lhbkluc3RydWN0aW9uRG9jdW1lbnRDb3VudCA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waHlkb2NzLnB1c2goc2NoZWR1bGVWaWV3LlBoeXNpY2lhbkluc3RydWN0aW9uRG9jdW1lbnRzLk1lZGljYWxEb2N1bWVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBzY2hlZHVsZVZpZXcuUGh5c2ljaWFuSW5zdHJ1Y3Rpb25Eb2N1bWVudHMuTWVkaWNhbERvY3VtZW50SXRlbS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGh5ZG9jcy5wdXNoKHNjaGVkdWxlVmlldy5QaHlzaWNpYW5JbnN0cnVjdGlvbkRvY3VtZW50cy5NZWRpY2FsRG9jdW1lbnRJdGVtW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZWR1bGVWaWV3LkFjdGlvbkl0ZW1Db3VudCA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjdGlvbnNMaXN0LnB1c2goc2NoZWR1bGVWaWV3LkFjdGlvbkl0ZW1MaXN0LkFjdGlvbkl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NoZWR1bGVWaWV3LkFjdGlvbkl0ZW1Db3VudCAhPSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjaGVkdWxlVmlldy5BY3Rpb25JdGVtTGlzdC5BY3Rpb25JdGVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjdGlvbnNMaXN0LnB1c2goc2NoZWR1bGVWaWV3LkFjdGlvbkl0ZW1MaXN0LkFjdGlvbkl0ZW1baV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVJbmRpY2F0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIC8gRXJyb3IgaW4gU2NoZWR1bGVkIGxpc3Qgdmlld1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgY29uc3VsdCBoaXN0b3J5IHZpZXcgZGF0YS4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJVU0VSXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSk7XG4gICAgICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIikpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXNlckxpc3QgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKTtcbiAgICAgICAgICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJNRU1CRVJfQUNDRVNTXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHVzZXJMaXN0LmZpbmRJbmRleCh4ID0+IHguUGVyc29uSWQgPT0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJNRU1CRVJfQUNDRVNTXCIpKVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlci5SZWxhdGlvblNoaXAgPSB1c2VyTGlzdFtpbmRleF0uUmVsYXRpb25TaGlwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlci5SZWxhdGlvblNoaXAgPSBcIlByaW1hcnkgTWVtYmVyXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHBvcHVwYnRuKG1zZykge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChtc2cgPT0gJ3BoeW5vdGVzJykge1xuICAgICAgICAgICAgdGhpcy5zY2hWaWV3T2JqLmFjdGlvbnBvcHVwID0gJ3BoeW5vdGVzJztcbiAgICAgICAgICAgIHRoaXMuc2NoVmlld09iai5jb25zdWx0SGVhZCA9IFwiUGh5c2ljaWFuIFByb2dyZXNzIE5vdGVzXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnID09ICdwaHlpbnN0cicpIHtcbiAgICAgICAgICAgIHRoaXMuc2NoVmlld09iai5hY3Rpb25wb3B1cCA9ICdwaHlpbnN0cic7XG4gICAgICAgICAgICB0aGlzLnNjaFZpZXdPYmouY29uc3VsdEhlYWQgPSBcIlBoeXNpY2lhbiBJbnN0cnVjdGlvbnNcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NoVmlld09iai5hY3Rpb25wb3B1cCA9ICdhY3Rpb24nO1xuICAgICAgICAgICAgdGhpcy5zY2hWaWV3T2JqLmNvbnN1bHRIZWFkID0gXCJBY3Rpb25zIGFuZCBGb2xsb3cgdXAgbWVzc2FnZXNcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwb3B1cGNsb3NlKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBoaWRlSW5kaWNhdG9yKCkge1xuICAgICAgICB0aGlzLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgIH1cbiAgICBnb2JhY2soKSB7XG4gICAgICAgIHRoaXMubG9jYXRpb24uYmFjaygpO1xuICAgIH1cbiAgICBjb252ZXJ0VGltZSh0aW1lMjQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2ViYXBpLmNvbnZlcnRUaW1lMjR0bzEyKHRpbWUyNCk7XG4gICAgfVxufTsiXX0=