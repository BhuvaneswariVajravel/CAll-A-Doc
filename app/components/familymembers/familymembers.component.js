"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var radside_component_1 = require("../radside/radside.component");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var xml2js = require('nativescript-xml2js');
var ApplicationSettings = require("application-settings");
var http_request = require("http");
var FamilyMembersComponent = (function () {
    function FamilyMembersComponent(page, webapi, router) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.memlist = [];
        this.isLoading = true;
        this.primaryAccess = true;
        this.delFamMem = {};
    }
    FamilyMembersComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
    };
    FamilyMembersComponent.prototype.ngAfterViewInit = function () {
        this.rscomp.fmclass = true;
        this.getFamliMembers();
    };
    FamilyMembersComponent.prototype.getFamliMembers = function () {
        var self = this;
        self.webapi.loader.show(self.webapi.options);
        self.webapi.personalAndLSSummary("FamilyMembers_Grid_Get").subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                //console.log(JSON.stringify(result));
                if (result.APIResult_FamilyMembers_Grid.Successful == "true" && result.APIResult_FamilyMembers_Grid.FamilyMemberCount != '0') {
                    self.memlist = [];
                    var members = result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem;
                    if (members.length != undefined) {
                        for (var i = 0; i < members.length; i++) {
                            self.memlist.push(members[i]);
                        }
                    }
                    else {
                        self.memlist.push(members);
                    }
                    self.isLoading = false;
                    self.webapi.loader.hide();
                    if (JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId == JSON.parse(ApplicationSettings.getString("MEMBER_ACCESS"))) {
                        ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
                        ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));
                    }
                    else {
                        self.primaryAccess = false;
                    }
                }
                else {
                    self.webapi.loader.hide();
                    self.isLoading = false;
                    if (result.APIResult_FamilyMembers_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    //console.log("error or no membrs list-->" + result.APIResult_FamilyMembers_Grid.Message);
                }
            });
        }, function (error) {
            self.webapi.loader.hide();
            self.isLoading = false;
            //console.log("Error in members list " + error);
        });
    };
    FamilyMembersComponent.prototype.editMember = function (item) {
        var editmember = {};
        editmember.PersonId = item.PersonId;
        editmember.fname = item.FirstName;
        editmember.lname = item.LastName;
        editmember.Gender = item.Gender;
        editmember.RelationShip = item.RelationShip;
        editmember.dob = item.DateOfBirth;
        var navigationExtras = {
            queryParams: { "EDIT_MEMBER": JSON.stringify(editmember) }
        };
        this.router.navigate(["/addmembers"], navigationExtras);
    };
    FamilyMembersComponent.prototype.onSelctFamMember = function (i, item, type) {
        if (type == 'select' && i != 0) {
            //console.log("long selected");
            this.delFamMem = item;
            this.delFamMem.selected = true;
            this.delFamMem.index = i;
        }
        else {
            this.delFamMem = {};
            this.delFamMem.selected = false;
            this.delFamMem.index = -1;
        }
    };
    FamilyMembersComponent.prototype.deleteFamilyMember = function () {
        var _this = this;
        var usr;
        if (this.delFamMem.PersonId != undefined && this.webapi.netConnectivityCheck()) {
            if (ApplicationSettings.hasKey("USER_DEFAULTS"))
                usr = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_Benefit.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<?xml version='1.0' encoding='UTF-8'?>" +
                    "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Body><web:FamilyMembers_Grid_Save xmlns= 'https://www.247CallADoc.com/WebServices/'>" +
                    "<web:Key>" + usr.Key + "</web:Key><web:GroupNumber>" + usr.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + usr.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
                    "<web:PersonId>" + this.delFamMem.PersonId + "</web:PersonId>" +
                    "<web:FirstName>" + this.delFamMem.FirstName + "</web:FirstName>" +
                    "<web:LastName>" + this.delFamMem.LastName + "</web:LastName>" +
                    "<web:Gender>" + this.delFamMem.Gender + "</web:Gender>" +
                    "<web:DateOfBirth>" + this.delFamMem.DateOfBirth + "</web:DateOfBirth>" +
                    "<web:RelationShip>" + this.delFamMem.RelationShip + "</web:RelationShip></web:Content>" +
                    "<web:Action>" + "Delete" + "</web:Action><web:Demo/>" +
                    "</web:FamilyMembers_Grid_Save></soapenv:Body></soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                //console.log(self.delFamMem);
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    //console.log(JSON.stringify(result['soap:Envelope']['soap:Body']));
                    var resp = result['soap:Envelope']['soap:Body'].FamilyMembers_Grid_SaveResponse.FamilyMembers_Grid_SaveResult;
                    if (resp.Successful == "true") {
                        //	console.log("SUCCESS");
                        self.memlist.splice(self.memlist.indexOf(self.delFamMem), 1);
                        self.delFamMem.selected = false;
                        self.delFamMem.index = -1;
                    }
                    else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        console.log("Error Or Session Expired ");
                    }
                });
            }, function (e) {
                console.log("Error: " + e);
            });
        }
    };
    return FamilyMembersComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], FamilyMembersComponent.prototype, "rscomp", void 0);
FamilyMembersComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./familymembers.component.html",
        providers: [radside_component_1.RadSideComponent, web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router])
], FamilyMembersComponent);
exports.FamilyMembersComponent = FamilyMembersComponent;
;
var AddmembersComponent = (function () {
    function AddmembersComponent(page, webapi, actRoute, router) {
        this.page = page;
        this.webapi = webapi;
        this.actRoute = actRoute;
        this.router = router;
        this.addMember = {};
        this.addform = false;
        this.gender = new nativescript_drop_down_1.ValueList();
        this.relation = new nativescript_drop_down_1.ValueList();
    }
    AddmembersComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
    };
    AddmembersComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.rscomp.fmclass = true;
        this.gender.push([{ value: "M", display: "Male" }, { value: "F", display: "Female" }, { value: "U", display: "Unknown" }]);
        this.relation.push([{ value: "1", display: "Spouse" }, { value: "3", display: "Child" }, { value: "5", display: "Other" }, { value: "6", display: "Unknown" }]);
        this.actRoute.queryParams.subscribe(function (params) {
            if (params["EDIT_MEMBER"] != undefined) {
                _this.addMember = JSON.parse(params["EDIT_MEMBER"]);
                _this.addMember.isEdited = true;
            }
            if (_this.addMember.Gender != undefined) {
                for (var i = 0; i < _this.gender.length; i++) {
                    if (_this.gender.getDisplay(i) == _this.addMember.Gender)
                        _this.addMember.genindx = i;
                }
                for (var j = 0; j < _this.relation.length; j++) {
                    if (_this.relation.getDisplay(j) == _this.addMember.RelationShip.split(" ", 2)[1])
                        _this.addMember.relindx = j;
                }
            }
        });
    };
    AddmembersComponent.prototype.addFamilyMember = function (fname, lname, dob) {
        var _this = this;
        this.addform = true;
        var usr;
        if (fname && lname && dob && this.isValidDate() && this.addMember.gendervalue != 'Unknown' && this.addMember.gendervalue != null && this.addMember.relationvalue != null && this.addMember.fname.trim() != '' && this.addMember.lname.trim() != '' && this.webapi.netConnectivityCheck()) {
            if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
                usr = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
                if (this.addMember.PersonId != undefined) {
                    this.addMember.operation = "Update";
                    this.addMember.PersonId = this.addMember.PersonId;
                }
                else {
                    this.addMember.PersonId = 0;
                    this.addMember.operation = "Add";
                }
                //	console.log(this.addMember.PersonId + "  " + this.addMember.fname + "  " + this.addMember.gendervalue + "  " + this.addMember.dob + " " + this.addMember.relationvalue);
            }
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_Benefit.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<?xml version='1.0' encoding='UTF-8'?>" +
                    "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Body><web:FamilyMembers_Grid_Save xmlns= 'https://www.247CallADoc.com/WebServices/'>" +
                    "<web:Key>" + usr.Key + "</web:Key><web:GroupNumber>" + usr.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + usr.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
                    "<web:PersonId>" + this.addMember.PersonId + "</web:PersonId>" +
                    "<web:FirstName>" + this.addMember.fname + "</web:FirstName>" +
                    "<web:LastName>" + this.addMember.lname + "</web:LastName>" +
                    "<web:Gender>" + this.addMember.gendervalue + "</web:Gender>" +
                    "<web:DateOfBirth>" + this.addMember.dob + "</web:DateOfBirth>" +
                    "<web:RelationShip>" + this.addMember.relationvalue + "</web:RelationShip></web:Content>" +
                    "<web:Action>" + this.addMember.operation + "</web:Action><web:Demo/>" +
                    "</web:FamilyMembers_Grid_Save></soapenv:Body></soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    //console.log(JSON.stringify(result['soap:Envelope']['soap:Body']));
                    var resp = result['soap:Envelope']['soap:Body'].FamilyMembers_Grid_SaveResponse.FamilyMembers_Grid_SaveResult;
                    if (resp.Successful == "true") {
                        self.router.navigate(["/familymembers"]);
                    }
                    else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //console.log("Error Or Session Expired " + " " + usr.Key + "  " + self.addMember.PersonId + " " + usr.ExternalMemberId + "  " + self.addMember.fname + " " + self.addMember.lname + " " + self.addMember.gendervalue + " " + self.addMember.relationvalue + " " + self.addMember.operation);
                    }
                });
            }, function (e) {
                console.log("Error: " + e);
            });
        }
    };
    AddmembersComponent.prototype.isValidDate = function () {
        var date = this.addMember.dob;
        var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
        if (matches == null)
            return false;
        var d = matches[2];
        var m;
        m = parseInt(matches[1]) - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y && composedDate.getTime() < new Date().getTime();
    };
    AddmembersComponent.prototype.onGenderChge = function (args) {
        this.addMember.genindx = args.selectedIndex;
        this.addMember.genderItemId = this.gender.getValue(args.selectedIndex);
        this.addMember.gendervalue = this.gender.getDisplay(args.selectedIndex);
        //console.log(this.addMember.gendervalue);
    };
    AddmembersComponent.prototype.onRelChange = function (args) {
        this.addMember.relindx = args.selectedIndex;
        this.addMember.relationItemId = this.relation.getValue(args.selectedIndex);
        this.addMember.relationvalue = this.relation.getDisplay(args.selectedIndex);
    };
    return AddmembersComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], AddmembersComponent.prototype, "rscomp", void 0);
AddmembersComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./addmembers.component.html",
        providers: [radside_component_1.RadSideComponent, web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.ActivatedRoute, router_1.Router])
], AddmembersComponent);
exports.AddmembersComponent = AddmembersComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFtaWx5bWVtYmVycy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmYW1pbHltZW1iZXJzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLGtFQUFnRTtBQUNoRSx5RUFBc0U7QUFDdEUsMEVBQXlFO0FBQ3pFLGlFQUFtRDtBQUNuRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM1QywwREFBNEQ7QUFDNUQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBT25DLElBQWEsc0JBQXNCO0lBSWxDLGdDQUFvQixJQUFVLEVBQVUsTUFBcUIsRUFBVSxNQUFjO1FBQWpFLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUhyRixZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQXdELGNBQVMsR0FBWSxJQUFJLENBQUM7UUFDcEcsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFDOUIsY0FBUyxHQUFRLEVBQUUsQ0FBQztJQUNxRSxDQUFDO0lBQzFGLHlDQUFRLEdBQVI7UUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDbEMsQ0FBQztJQUNELGdEQUFlLEdBQWY7UUFDQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDRCxnREFBZSxHQUFmO1FBQ0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFN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QyxDQUFDO1FBQ3hFLDBDQUEwQztJQUMzQyxDQUFDO0lBQ0QseUNBQVcsR0FBWCxVQUFZLElBQUk7UUFDZixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUNGLDBCQUFDO0FBQUQsQ0FBQyxBQTFHRCxJQTBHQztBQXhHNEU7SUFBNUIsZ0JBQVMsQ0FBQyxvQ0FBZ0IsQ0FBQzs4QkFBUyxvQ0FBZ0I7bURBQUM7QUFGekYsbUJBQW1CO0lBTC9CLGdCQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLDZCQUE2QjtRQUMxQyxTQUFTLEVBQUUsQ0FBQyxvQ0FBZ0IsRUFBRSwrQkFBYSxFQUFFLDZCQUFhLENBQUM7S0FDM0QsQ0FBQztxQ0FNeUIsV0FBSSxFQUFrQiwrQkFBYSxFQUFvQix1QkFBYyxFQUFrQixlQUFNO0dBTDNHLG1CQUFtQixDQTBHL0I7QUExR1ksa0RBQW1CO0FBMEcvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgUmFkU2lkZUNvbXBvbmVudCB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVmFsdWVMaXN0IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd25cIjtcbmxldCB4bWwyanMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQteG1sMmpzJyk7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xubGV0IGh0dHBfcmVxdWVzdCA9IHJlcXVpcmUoXCJodHRwXCIpO1xuXG5AQ29tcG9uZW50KHtcblx0bW9kdWxlSWQ6IG1vZHVsZS5pZCxcblx0dGVtcGxhdGVVcmw6IFwiLi9mYW1pbHltZW1iZXJzLmNvbXBvbmVudC5odG1sXCIsXG5cdHByb3ZpZGVyczogW1JhZFNpZGVDb21wb25lbnQsIFdlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb25dXG59KVxuZXhwb3J0IGNsYXNzIEZhbWlseU1lbWJlcnNDb21wb25lbnQge1xuXHRtZW1saXN0OiBhbnkgPSBbXTsgQFZpZXdDaGlsZChSYWRTaWRlQ29tcG9uZW50KSByc2NvbXA6IFJhZFNpZGVDb21wb25lbnQ7IGlzTG9hZGluZzogYm9vbGVhbiA9IHRydWU7XG5cdHByaW1hcnlBY2Nlc3M6IGJvb2xlYW4gPSB0cnVlO1xuXHRkZWxGYW1NZW06IGFueSA9IHt9O1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7IH1cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG5cdH1cblx0bmdBZnRlclZpZXdJbml0KCkge1xuXHRcdHRoaXMucnNjb21wLmZtY2xhc3MgPSB0cnVlO1xuXHRcdHRoaXMuZ2V0RmFtbGlNZW1iZXJzKCk7XG5cdH1cblx0Z2V0RmFtbGlNZW1iZXJzKCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcblx0XHRzZWxmLndlYmFwaS5wZXJzb25hbEFuZExTU3VtbWFyeShcIkZhbWlseU1lbWJlcnNfR3JpZF9HZXRcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG5cdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkLkZhbWlseU1lbWJlckNvdW50ICE9ICcwJykge1xuXHRcdFx0XHRcdHNlbGYubWVtbGlzdCA9IFtdO1xuXHRcdFx0XHRcdGxldCBtZW1iZXJzID0gcmVzdWx0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJzX0dyaWQuRmFtaWx5TWVtYmVyTGlzdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVySXRlbTtcblx0XHRcdFx0XHRpZiAobWVtYmVycy5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG1lbWJlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5tZW1saXN0LnB1c2gobWVtYmVyc1tpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGYubWVtbGlzdC5wdXNoKG1lbWJlcnMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzZWxmLmlzTG9hZGluZyA9IGZhbHNlOyBzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdGlmIChKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUl9ERUZBVUxUU1wiKSkuRXh0ZXJuYWxNZW1iZXJJZCA9PSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiTUVNQkVSX0FDQ0VTU1wiKSkpIHtcblx0XHRcdFx0XHRcdEFwcGxpY2F0aW9uU2V0dGluZ3MucmVtb3ZlKFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpO1xuXHRcdFx0XHRcdFx0QXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIiwgSlNPTi5zdHJpbmdpZnkoc2VsZi5tZW1saXN0KSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGYucHJpbWFyeUFjY2VzcyA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cdFx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHRzZWxmLmlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImVycm9yIG9yIG5vIG1lbWJycyBsaXN0LS0+XCIgKyByZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5NZXNzYWdlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0c2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIG1lbWJlcnMgbGlzdCBcIiArIGVycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cdGVkaXRNZW1iZXIoaXRlbSkge1xuXHRcdGxldCBlZGl0bWVtYmVyOiBhbnkgPSB7fTtcblx0XHRlZGl0bWVtYmVyLlBlcnNvbklkID0gaXRlbS5QZXJzb25JZDtcblx0XHRlZGl0bWVtYmVyLmZuYW1lID0gaXRlbS5GaXJzdE5hbWU7XG5cdFx0ZWRpdG1lbWJlci5sbmFtZSA9IGl0ZW0uTGFzdE5hbWU7XG5cdFx0ZWRpdG1lbWJlci5HZW5kZXIgPSBpdGVtLkdlbmRlcjtcblx0XHRlZGl0bWVtYmVyLlJlbGF0aW9uU2hpcCA9IGl0ZW0uUmVsYXRpb25TaGlwO1xuXHRcdGVkaXRtZW1iZXIuZG9iID0gaXRlbS5EYXRlT2ZCaXJ0aDtcblxuXHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJFRElUX01FTUJFUlwiOiBKU09OLnN0cmluZ2lmeShlZGl0bWVtYmVyKSB9XG5cdFx0fTtcblx0XHR0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvYWRkbWVtYmVyc1wiXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG5cdH1cblx0b25TZWxjdEZhbU1lbWJlcihpLCBpdGVtOiBhbnksIHR5cGUpIHtcblxuXHRcdGlmICh0eXBlID09ICdzZWxlY3QnICYmIGkgIT0gMCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImxvbmcgc2VsZWN0ZWRcIik7XG5cdFx0XHR0aGlzLmRlbEZhbU1lbSA9IGl0ZW07XG5cdFx0XHR0aGlzLmRlbEZhbU1lbS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHR0aGlzLmRlbEZhbU1lbS5pbmRleCA9IGk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZGVsRmFtTWVtID0ge307XG5cdFx0XHR0aGlzLmRlbEZhbU1lbS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5kZWxGYW1NZW0uaW5kZXggPSAtMTtcblx0XHR9XG5cdH1cblx0ZGVsZXRlRmFtaWx5TWVtYmVyKCkge1xuXHRcdGxldCB1c3I6IGFueTtcblx0XHRpZiAodGhpcy5kZWxGYW1NZW0uUGVyc29uSWQgIT0gdW5kZWZpbmVkICYmIHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcblx0XHRcdGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJfREVGQVVMVFNcIikpXG5cdFx0XHRcdHVzciA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSX0RFRkFVTFRTXCIpKTtcblx0XHRcdGh0dHBfcmVxdWVzdC5yZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiBcImh0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9XZWJTZXJ2aWNlcy9BUElfQmVuZWZpdC5hc214XCIsXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3htbFwiIH0sXG5cdFx0XHRcdGNvbnRlbnQ6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLyc+XCIgK1xuXHRcdFx0XHRcIjxzb2FwZW52OkJvZHk+PHdlYjpGYW1pbHlNZW1iZXJzX0dyaWRfU2F2ZSB4bWxucz0gJ2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nPlwiICtcblx0XHRcdFx0XCI8d2ViOktleT5cIiArIHVzci5LZXkgKyBcIjwvd2ViOktleT48d2ViOkdyb3VwTnVtYmVyPlwiICsgdXNyLkdyb3VwTnVtYmVyICsgXCI8L3dlYjpHcm91cE51bWJlcj5cIiArXG5cdFx0XHRcdFwiPHdlYjpFeHRlcm5hbE1lbWJlcklkPlwiICsgdXNyLkV4dGVybmFsTWVtYmVySWQgKyBcIjwvd2ViOkV4dGVybmFsTWVtYmVySWQ+PHdlYjpDb250ZW50PlwiICtcblx0XHRcdFx0XCI8d2ViOlBlcnNvbklkPlwiICsgdGhpcy5kZWxGYW1NZW0uUGVyc29uSWQgKyBcIjwvd2ViOlBlcnNvbklkPlwiICtcblx0XHRcdFx0XCI8d2ViOkZpcnN0TmFtZT5cIiArIHRoaXMuZGVsRmFtTWVtLkZpcnN0TmFtZSArIFwiPC93ZWI6Rmlyc3ROYW1lPlwiICtcblx0XHRcdFx0XCI8d2ViOkxhc3ROYW1lPlwiICsgdGhpcy5kZWxGYW1NZW0uTGFzdE5hbWUgKyBcIjwvd2ViOkxhc3ROYW1lPlwiICtcblx0XHRcdFx0XCI8d2ViOkdlbmRlcj5cIiArIHRoaXMuZGVsRmFtTWVtLkdlbmRlciArIFwiPC93ZWI6R2VuZGVyPlwiICtcblx0XHRcdFx0XCI8d2ViOkRhdGVPZkJpcnRoPlwiICsgdGhpcy5kZWxGYW1NZW0uRGF0ZU9mQmlydGggKyBcIjwvd2ViOkRhdGVPZkJpcnRoPlwiICtcblx0XHRcdFx0XCI8d2ViOlJlbGF0aW9uU2hpcD5cIiArIHRoaXMuZGVsRmFtTWVtLlJlbGF0aW9uU2hpcCArIFwiPC93ZWI6UmVsYXRpb25TaGlwPjwvd2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6QWN0aW9uPlwiICsgXCJEZWxldGVcIiArIFwiPC93ZWI6QWN0aW9uPjx3ZWI6RGVtby8+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOkZhbWlseU1lbWJlcnNfR3JpZF9TYXZlPjwvc29hcGVudjpCb2R5Pjwvc29hcGVudjpFbnZlbG9wZT5cIlxuXHRcdFx0fSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKHNlbGYuZGVsRmFtTWVtKTtcblx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKHJlc3BvbnNlLmNvbnRlbnQsIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10pKTtcblx0XHRcdFx0XHRsZXQgcmVzcCA9IHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5GYW1pbHlNZW1iZXJzX0dyaWRfU2F2ZVJlc3BvbnNlLkZhbWlseU1lbWJlcnNfR3JpZF9TYXZlUmVzdWx0O1xuXHRcdFx0XHRcdGlmIChyZXNwLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhcIlNVQ0NFU1NcIik7XG5cdFx0XHRcdFx0XHRzZWxmLm1lbWxpc3Quc3BsaWNlKHNlbGYubWVtbGlzdC5pbmRleE9mKHNlbGYuZGVsRmFtTWVtKSwgMSk7XG5cdFx0XHRcdFx0XHRzZWxmLmRlbEZhbU1lbS5zZWxlY3RlZCA9IGZhbHNlOyBzZWxmLmRlbEZhbU1lbS5pbmRleCA9IC0xO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzcC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJFcnJvciBPciBTZXNzaW9uIEV4cGlyZWQgXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGUpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0fVxufTtcbkBDb21wb25lbnQoe1xuXHRtb2R1bGVJZDogbW9kdWxlLmlkLFxuXHR0ZW1wbGF0ZVVybDogXCIuL2FkZG1lbWJlcnMuY29tcG9uZW50Lmh0bWxcIixcblx0cHJvdmlkZXJzOiBbUmFkU2lkZUNvbXBvbmVudCwgV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgQWRkbWVtYmVyc0NvbXBvbmVudCB7XG5cblx0YWRkTWVtYmVyOiBhbnkgPSB7fTsgYWRkZm9ybTogYm9vbGVhbiA9IGZhbHNlOyBAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJzY29tcDogUmFkU2lkZUNvbXBvbmVudDtcblx0Z2VuZGVyID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7IHJlbGF0aW9uID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7XG5cblx0Y29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHsgfVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xuXHR9XG5cdG5nQWZ0ZXJWaWV3SW5pdCgpIHtcblx0XHR0aGlzLnJzY29tcC5mbWNsYXNzID0gdHJ1ZTtcblx0XHR0aGlzLmdlbmRlci5wdXNoKFt7IHZhbHVlOiBcIk1cIiwgZGlzcGxheTogXCJNYWxlXCIgfSwgeyB2YWx1ZTogXCJGXCIsIGRpc3BsYXk6IFwiRmVtYWxlXCIgfSwgeyB2YWx1ZTogXCJVXCIsIGRpc3BsYXk6IFwiVW5rbm93blwiIH1dKTtcblx0XHR0aGlzLnJlbGF0aW9uLnB1c2goW3sgdmFsdWU6IFwiMVwiLCBkaXNwbGF5OiBcIlNwb3VzZVwiIH0sIHsgdmFsdWU6IFwiM1wiLCBkaXNwbGF5OiBcIkNoaWxkXCIgfSwgeyB2YWx1ZTogXCI1XCIsIGRpc3BsYXk6IFwiT3RoZXJcIiB9LCB7IHZhbHVlOiBcIjZcIiwgZGlzcGxheTogXCJVbmtub3duXCIgfV0pO1xuXHRcdHRoaXMuYWN0Um91dGUucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiRURJVF9NRU1CRVJcIl0gIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuYWRkTWVtYmVyID0gSlNPTi5wYXJzZShwYXJhbXNbXCJFRElUX01FTUJFUlwiXSk7XG5cdFx0XHRcdHRoaXMuYWRkTWVtYmVyLmlzRWRpdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLmFkZE1lbWJlci5HZW5kZXIgIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nZW5kZXIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAodGhpcy5nZW5kZXIuZ2V0RGlzcGxheShpKSA9PSB0aGlzLmFkZE1lbWJlci5HZW5kZXIpXG5cdFx0XHRcdFx0XHR0aGlzLmFkZE1lbWJlci5nZW5pbmR4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucmVsYXRpb24ubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRpZiAodGhpcy5yZWxhdGlvbi5nZXREaXNwbGF5KGopID09IHRoaXMuYWRkTWVtYmVyLlJlbGF0aW9uU2hpcC5zcGxpdChcIiBcIiwgMilbMV0pXG5cdFx0XHRcdFx0XHR0aGlzLmFkZE1lbWJlci5yZWxpbmR4ID0gajtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0YWRkRmFtaWx5TWVtYmVyKGZuYW1lLCBsbmFtZSwgZG9iKSB7XG5cdFx0dGhpcy5hZGRmb3JtID0gdHJ1ZTsgbGV0IHVzcjogYW55O1xuXHRcdGlmIChmbmFtZSAmJiBsbmFtZSAmJiBkb2IgJiYgdGhpcy5pc1ZhbGlkRGF0ZSgpICYmIHRoaXMuYWRkTWVtYmVyLmdlbmRlcnZhbHVlICE9ICdVbmtub3duJyAmJiB0aGlzLmFkZE1lbWJlci5nZW5kZXJ2YWx1ZSAhPSBudWxsICYmIHRoaXMuYWRkTWVtYmVyLnJlbGF0aW9udmFsdWUgIT0gbnVsbCAmJiB0aGlzLmFkZE1lbWJlci5mbmFtZS50cmltKCkgIT0gJycgJiYgdGhpcy5hZGRNZW1iZXIubG5hbWUudHJpbSgpICE9ICcnICYmIHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcblx0XHRcdGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJfREVGQVVMVFNcIikpIHtcblx0XHRcdFx0dXNyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJfREVGQVVMVFNcIikpO1xuXHRcdFx0XHRpZiAodGhpcy5hZGRNZW1iZXIuUGVyc29uSWQgIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGRNZW1iZXIub3BlcmF0aW9uID0gXCJVcGRhdGVcIjtcblx0XHRcdFx0XHR0aGlzLmFkZE1lbWJlci5QZXJzb25JZCA9IHRoaXMuYWRkTWVtYmVyLlBlcnNvbklkO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuYWRkTWVtYmVyLlBlcnNvbklkID0gMDtcblx0XHRcdFx0XHR0aGlzLmFkZE1lbWJlci5vcGVyYXRpb24gPSBcIkFkZFwiO1xuXHRcdFx0XHR9XG5cdFx0XHQvL1x0Y29uc29sZS5sb2codGhpcy5hZGRNZW1iZXIuUGVyc29uSWQgKyBcIiAgXCIgKyB0aGlzLmFkZE1lbWJlci5mbmFtZSArIFwiICBcIiArIHRoaXMuYWRkTWVtYmVyLmdlbmRlcnZhbHVlICsgXCIgIFwiICsgdGhpcy5hZGRNZW1iZXIuZG9iICsgXCIgXCIgKyB0aGlzLmFkZE1lbWJlci5yZWxhdGlvbnZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGh0dHBfcmVxdWVzdC5yZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiBcImh0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9XZWJTZXJ2aWNlcy9BUElfQmVuZWZpdC5hc214XCIsXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3htbFwiIH0sXG5cdFx0XHRcdGNvbnRlbnQ6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLyc+XCIgK1xuXHRcdFx0XHRcIjxzb2FwZW52OkJvZHk+PHdlYjpGYW1pbHlNZW1iZXJzX0dyaWRfU2F2ZSB4bWxucz0gJ2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nPlwiICtcblx0XHRcdFx0XCI8d2ViOktleT5cIiArIHVzci5LZXkgKyBcIjwvd2ViOktleT48d2ViOkdyb3VwTnVtYmVyPlwiICsgdXNyLkdyb3VwTnVtYmVyICsgXCI8L3dlYjpHcm91cE51bWJlcj5cIiArXG5cdFx0XHRcdFwiPHdlYjpFeHRlcm5hbE1lbWJlcklkPlwiICsgdXNyLkV4dGVybmFsTWVtYmVySWQgKyBcIjwvd2ViOkV4dGVybmFsTWVtYmVySWQ+PHdlYjpDb250ZW50PlwiICtcblx0XHRcdFx0XCI8d2ViOlBlcnNvbklkPlwiICsgdGhpcy5hZGRNZW1iZXIuUGVyc29uSWQgKyBcIjwvd2ViOlBlcnNvbklkPlwiICtcblx0XHRcdFx0XCI8d2ViOkZpcnN0TmFtZT5cIiArIHRoaXMuYWRkTWVtYmVyLmZuYW1lICsgXCI8L3dlYjpGaXJzdE5hbWU+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6TGFzdE5hbWU+XCIgKyB0aGlzLmFkZE1lbWJlci5sbmFtZSArIFwiPC93ZWI6TGFzdE5hbWU+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6R2VuZGVyPlwiICsgdGhpcy5hZGRNZW1iZXIuZ2VuZGVydmFsdWUgKyBcIjwvd2ViOkdlbmRlcj5cIiArXG5cdFx0XHRcdFwiPHdlYjpEYXRlT2ZCaXJ0aD5cIiArIHRoaXMuYWRkTWVtYmVyLmRvYiArIFwiPC93ZWI6RGF0ZU9mQmlydGg+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6UmVsYXRpb25TaGlwPlwiICsgdGhpcy5hZGRNZW1iZXIucmVsYXRpb252YWx1ZSArIFwiPC93ZWI6UmVsYXRpb25TaGlwPjwvd2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6QWN0aW9uPlwiICsgdGhpcy5hZGRNZW1iZXIub3BlcmF0aW9uICsgXCI8L3dlYjpBY3Rpb24+PHdlYjpEZW1vLz5cIiArXG5cdFx0XHRcdFwiPC93ZWI6RmFtaWx5TWVtYmVyc19HcmlkX1NhdmU+PC9zb2FwZW52OkJvZHk+PC9zb2FwZW52OkVudmVsb3BlPlwiXG5cdFx0XHR9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhyZXNwb25zZS5jb250ZW50LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddKSk7XG5cdFx0XHRcdFx0bGV0IHJlc3AgPSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRmFtaWx5TWVtYmVyc19HcmlkX1NhdmVSZXNwb25zZS5GYW1pbHlNZW1iZXJzX0dyaWRfU2F2ZVJlc3VsdDtcblx0XHRcdFx0XHRpZiAocmVzcC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnJvdXRlci5uYXZpZ2F0ZShbXCIvZmFtaWx5bWVtYmVyc1wiXSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXNwLk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvZ291dCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3IgT3IgU2Vzc2lvbiBFeHBpcmVkIFwiICsgXCIgXCIgKyB1c3IuS2V5ICsgXCIgIFwiICsgc2VsZi5hZGRNZW1iZXIuUGVyc29uSWQgKyBcIiBcIiArIHVzci5FeHRlcm5hbE1lbWJlcklkICsgXCIgIFwiICsgc2VsZi5hZGRNZW1iZXIuZm5hbWUgKyBcIiBcIiArIHNlbGYuYWRkTWVtYmVyLmxuYW1lICsgXCIgXCIgKyBzZWxmLmFkZE1lbWJlci5nZW5kZXJ2YWx1ZSArIFwiIFwiICsgc2VsZi5hZGRNZW1iZXIucmVsYXRpb252YWx1ZSArIFwiIFwiICsgc2VsZi5hZGRNZW1iZXIub3BlcmF0aW9uKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdH1cblx0aXNWYWxpZERhdGUoKSB7XG5cdFx0bGV0IGRhdGUgPSB0aGlzLmFkZE1lbWJlci5kb2I7XG5cdFx0bGV0IG1hdGNoZXMgPSAvXihcXGR7MSwyfSlbLVxcL10oXFxkezEsMn0pWy1cXC9dKFxcZHs0fSkkLy5leGVjKGRhdGUpO1xuXHRcdGlmIChtYXRjaGVzID09IG51bGwpIHJldHVybiBmYWxzZTtcblx0XHRsZXQgZDogYW55ID0gbWF0Y2hlc1syXTsgbGV0IG06IGFueTtcblx0XHRtID0gcGFyc2VJbnQobWF0Y2hlc1sxXSkgLSAxO1xuXHRcdGxldCB5OiBhbnkgPSBtYXRjaGVzWzNdO1xuXHRcdGxldCBjb21wb3NlZERhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkKTtcblx0XHRyZXR1cm4gY29tcG9zZWREYXRlLmdldERhdGUoKSA9PSBkICYmXG5cdFx0XHRjb21wb3NlZERhdGUuZ2V0TW9udGgoKSA9PSBtICYmXG5cdFx0XHRjb21wb3NlZERhdGUuZ2V0RnVsbFllYXIoKSA9PSB5ICYmIGNvbXBvc2VkRGF0ZS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fVxuXHRvbkdlbmRlckNoZ2UoYXJncykge1xuXHRcdHRoaXMuYWRkTWVtYmVyLmdlbmluZHggPSBhcmdzLnNlbGVjdGVkSW5kZXg7XG5cdFx0dGhpcy5hZGRNZW1iZXIuZ2VuZGVySXRlbUlkID0gdGhpcy5nZW5kZXIuZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0XHR0aGlzLmFkZE1lbWJlci5nZW5kZXJ2YWx1ZSA9IHRoaXMuZ2VuZGVyLmdldERpc3BsYXkoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMuYWRkTWVtYmVyLmdlbmRlcnZhbHVlKTtcblx0fVxuXHRvblJlbENoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5hZGRNZW1iZXIucmVsaW5keCA9IGFyZ3Muc2VsZWN0ZWRJbmRleDtcblx0XHR0aGlzLmFkZE1lbWJlci5yZWxhdGlvbkl0ZW1JZCA9IHRoaXMucmVsYXRpb24uZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0XHR0aGlzLmFkZE1lbWJlci5yZWxhdGlvbnZhbHVlID0gdGhpcy5yZWxhdGlvbi5nZXREaXNwbGF5KGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdH1cbn07Il19