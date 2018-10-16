"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ApplicationSettings = require("application-settings");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var router_1 = require("@angular/router");
var user_model_1 = require("../../shared/model/user.model");
var frame = require("ui/frame");
var xml2js = require('nativescript-xml2js');
var dialogs = require("ui/dialogs");
var DependentComponent = (function () {
    function DependentComponent(webapi, r) {
        this.webapi = webapi;
        this.r = r;
        this.dropdown = false;
        this.memlist = [];
        this.user = new user_model_1.User();
    }
    DependentComponent.prototype.ngAfterViewInit = function () {
        this.getFamliMembers();
    };
    DependentComponent.prototype.getFamliMembers = function () {
        var _this = this;
        var self = this;
        if (!ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
            self.webapi.personalAndLSSummary("FamilyMembers_Grid_Get").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_FamilyMembers_Grid.Successful == "true" && result.APIResult_FamilyMembers_Grid.FamilyMemberCount != '0') {
                        self.memlist = [];
                        var members = result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem;
                        if (members.length != undefined) {
                            for (var i = 0; i < members.length; i++) {
                                //  self.memlist.push(members[i]);
                                if (self.getAge(members[i].DateOfBirth) < 18 || members[i].RelationShip.indexOf('Primary') > -1) {
                                    self.getMemberInfoImageService(i, members[i]);
                                }
                            }
                        }
                        else {
                            // self.memlist.push(members);
                            self.getMemberInfoImageService(0, members);
                        }
                        // ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));
                    }
                    else {
                        console.log("error or no membrs list-->" + result.APIResult_FamilyMembers_Grid.Message);
                    }
                });
                _this.currentUserGender();
            }, function (error) {
                console.log("Error in members list " + error);
            });
        }
        else {
            self.memlist = [];
            var members = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
            if (this.webapi.netConnectivityCheck()) {
                if (members.length != undefined && members[0].photo == undefined) {
                    for (var i = 0; i < members.length; i++) {
                        //  self.memlist.push(members[i]);
                        if (self.getAge(members[i].DateOfBirth) < 18 || members[i].RelationShip.indexOf('Primary') > -1) {
                            //console.log("HIT GET MEMBER IMAGE SERVID " + i);
                            self.getMemberInfoImageService(i, members[i]);
                        }
                    }
                }
                else if (members.length == undefined && members[0].photo == undefined) {
                    //console.log("DIFFERENT SCENARIO  ");
                    //self.memlist.push(members);
                    self.getMemberInfoImageService(0, members);
                }
                else {
                    self.memlist = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                    var index_1 = self.memlist.findIndex(function (x) { return x.PersonId == JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId; });
                    if (self.memlist.length >= index_1) {
                        self.photo = self.memlist[index_1].photo;
                    }
                    // console.log(JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId + "    " + index);
                }
            }
            else {
                //alert("Please connect with internet to continue.");
            }
            this.currentUserGender();
        }
    };
    DependentComponent.prototype.getMemberInfoImageService = function (i, ObjectFam) {
        var self = this;
        this.webapi.getMemberInfoForImage(ObjectFam.PersonId).subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.ServiceCallResult_MemberInfo.Successful == "true") {
                    ObjectFam.photo = result.ServiceCallResult_MemberInfo.Picture.FileData;
                    //console.log("photo addeded==========================================" + result.ServiceCallResult_MemberInfo.ExternalMemberId + " + " + i);
                    self.memlist.push(ObjectFam);
                    //    console.log(self.memlist.length+" LENGTH");
                    if (self.memlist.length > 0) {
                        var index_2 = self.memlist.findIndex(function (x) { return x.PersonId == JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId; });
                        // console.log(index + "   <>>><<<<<<<<>>>>>>>>>>>  " + index);
                        if (index_2 != -1 && index_2 != 0) {
                            var primeMem = self.memlist[index_2];
                            var replaceObj = self.memlist[0];
                            self.memlist[0] = primeMem;
                            if (self.photoStatus != 'added') {
                                // console.log("photo addeddddddd");
                                self.photo = self.memlist[0].photo;
                            }
                            self.memlist[index_2] = replaceObj;
                        }
                        else {
                            var imgIndx = self.memlist.findIndex(function (x) { return x.PersonId == JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId; });
                            self.photo = self.memlist[imgIndx].photo;
                            self.photoStatus = 'added';
                            //   console.log("kkkkkkkkk");
                        }
                    }
                    ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));
                }
                else {
                    console.log(result.ServiceCallResult_MemberInfo.Message + " Error In Getting GetMember Info");
                }
            });
        }, function (error) {
            console.log("Error in getting thegetMember Info / Session expired..... " + error);
        });
    };
    DependentComponent.prototype.openDependents = function () {
        this.dropdown = !this.dropdown;
    };
    DependentComponent.prototype.currentUserGender = function () {
        if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                var userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                var index_3 = userList.findIndex(function (x) { return x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"); });
                if (index_3 >= 0) {
                    this.user.gender = userList[index_3].Gender;
                    //this.indx = index;
                    this.indx = userList[index_3].PersonId;
                }
            }
        }
        else if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
            var userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
            var personid_1 = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId;
            var index_4 = userList.findIndex(function (x) { return x.PersonId == personid_1; });
            if (index_4 >= 0) {
                this.user.gender = userList[index_4].Gender;
                //this.indx = index;
                this.indx = userList[index_4].PersonId;
            }
        }
    };
    DependentComponent.prototype.setMemberAccess = function (personId, dob, relationship, index) {
        this.dropdown = !this.dropdown;
        var age = this.getAge(dob);
        if ((age < 18 && relationship.indexOf("Dependent") > -1) || relationship.indexOf("Primary") > -1) {
            if (this.webapi.netConnectivityCheck()) {
                this.webapi.ExternalMemberId = personId;
                ApplicationSettings.setString("MEMBER_ACCESS", personId);
                this.getMemberInfoService();
                this.indx = index;
            }
        }
        else {
            dialogs.alert({
                message: "We apologize for this notice, however in compliance with HIPAA regulations, you are not able to access this members account due to their age.  Please call 1-844-362-2447 to speak to a customer care representative.",
                okButtonText: "Ok"
            });
        }
    };
    DependentComponent.prototype.getMemberInfoService = function () {
        var self = this;
        this.webapi.loader.show(this.webapi.options);
        this.webapi.getMemberInfo().subscribe(function (data) {
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
                    self.loadCurrentUser();
                }
                else {
                    self.webapi.loader.hide();
                    console.log("Error in getting thegetMember Info / Session expired " + result.ServiceCallResult_MemberInfo.Message);
                }
            });
        }, function (error) {
            self.webapi.loader.hide();
            console.log("Error in getting thegetMember Info / Session expired..... " + error);
        });
    };
    DependentComponent.prototype.getAge = function (dob) {
        var db = dob.split("/");
        var year = db[2];
        var month = db[0];
        var day = db[1];
        var now = new Date();
        var age = now.getFullYear() - year;
        var mdif = now.getMonth() - month + 1; //0=jan	
        if (mdif < 0) {
            --age;
        }
        else if (mdif == 0) {
            var ddif = now.getDate() - day;
            if (ddif < 0) {
                --age;
            }
        }
        return age;
    };
    DependentComponent.prototype.loadCurrentUser = function () {
        switch (true) {
            case this.r.url == "/home":
                this.r.navigate(["/home1"]);
                break;
            case this.r.url == "/home1":
                this.r.navigate(["/home"]);
                break;
            case this.r.url == "/inbox":
                this.r.navigate(["/inbox1"]);
                break;
            case this.r.url == "/inbox1":
                this.r.navigate(["/inbox"]);
                break;
            case this.r.url == "/followups":
                this.r.navigate(["/followups1"]);
                break;
            case this.r.url == "/followups1":
                this.r.navigate(["/followups"]);
                break;
            case this.r.url == "/consulthistory":
                this.r.navigate(["/consulthistory1"]);
                break;
            case this.r.url == "/consulthistory1":
                this.r.navigate(["/consulthistory"]);
                break;
            case this.r.url == "/scheduledconsults":
                this.r.navigate(["/scheduledconsults1"]);
                break;
            case this.r.url == "/scheduledconsults1":
                this.r.navigate(["/scheduledconsults"]);
                break;
            case this.r.url == "/userhealthrecords1" || this.r.url.indexOf('/userhealthrecords1') == 0:
                this.r.navigate(["/userhealthrecords"]);
                break;
            case this.r.url == "/userhealthrecords" || this.r.url.indexOf('/userhealthrecords') == 0:
                this.r.navigate(["/userhealthrecords1"]);
                break;
            case this.r.url == "/profile":
                this.r.navigate(["/profile1"]);
                break;
            case this.r.url == "/profile1":
                this.r.navigate(["/profile"]);
                break;
            default:
                console.log("Dependent Member.............................");
        }
    };
    return DependentComponent;
}());
DependentComponent = __decorate([
    core_1.Component({
        selector: "dependent",
        moduleId: module.id,
        templateUrl: "./dependent.component.html",
        providers: [configuration_1.Configuration, web_api_service_1.WebAPIService]
    }),
    __metadata("design:paramtypes", [web_api_service_1.WebAPIService, router_1.Router])
], DependentComponent);
exports.DependentComponent = DependentComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGVuZGVudC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsMERBQTREO0FBQzVELDBFQUF5RTtBQUN6RSx5RUFBc0U7QUFDdEUsMENBQXlDO0FBQ3pDLDREQUFxRDtBQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDNUMsb0NBQXVDO0FBT3ZDLElBQWEsa0JBQWtCO0lBRTNCLDRCQUFvQixNQUFxQixFQUFVLENBQVM7UUFBeEMsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFENUQsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUFDLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFBQyxTQUFJLEdBQUcsSUFBSSxpQkFBSSxFQUFFLENBQUM7SUFDQSxDQUFDO0lBQ2pFLDRDQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUNELDRDQUFlLEdBQWY7UUFBQSxpQkE2REM7UUE1REcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUNyRSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEVBQUUsVUFBVSxHQUFHLEVBQUUsTUFBTTtvQkFDMUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLDRC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SSxvQkFBb0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO2dCQUNwRixJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztnQkFDekMsS0FBSyxDQUFDO1lBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxVQUFVO2dCQUN6QixJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssQ0FBQztZQUNWLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksV0FBVztnQkFDMUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixLQUFLLENBQUM7WUFDVjtnQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxDQUFDLENBQUM7UUFDckUsQ0FBQztJQUNMLENBQUM7SUFDTCx5QkFBQztBQUFELENBQUMsQUF6UEQsSUF5UEM7QUF6UFksa0JBQWtCO0lBTjlCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsV0FBVztRQUNyQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLDRCQUE0QjtRQUN6QyxTQUFTLEVBQUUsQ0FBQyw2QkFBYSxFQUFFLCtCQUFhLENBQUM7S0FDNUMsQ0FBQztxQ0FHOEIsK0JBQWEsRUFBYSxlQUFNO0dBRm5ELGtCQUFrQixDQXlQOUI7QUF6UFksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgV2ViQVBJU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvd2ViLWFwaS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvdXNlci5tb2RlbFwiO1xubGV0IGZyYW1lID0gcmVxdWlyZShcInVpL2ZyYW1lXCIpO1xubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcbmltcG9ydCBkaWFsb2dzID0gcmVxdWlyZShcInVpL2RpYWxvZ3NcIik7XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJkZXBlbmRlbnRcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vZGVwZW5kZW50LmNvbXBvbmVudC5odG1sXCIsXG4gICAgcHJvdmlkZXJzOiBbQ29uZmlndXJhdGlvbiwgV2ViQVBJU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgRGVwZW5kZW50Q29tcG9uZW50IHtcbiAgICBkcm9wZG93bjogYm9vbGVhbiA9IGZhbHNlOyBtZW1saXN0OiBhbnkgPSBbXTsgdXNlciA9IG5ldyBVc2VyKCk7IGluZHg6IG51bWJlcjsgcGhvdG86IGFueTsgcGhvdG9TdGF0dXM6IGFueTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSByOiBSb3V0ZXIpIHsgfVxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5nZXRGYW1saU1lbWJlcnMoKTtcbiAgICB9XG4gICAgZ2V0RmFtbGlNZW1iZXJzKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIikpIHtcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLnBlcnNvbmFsQW5kTFNTdW1tYXJ5KFwiRmFtaWx5TWVtYmVyc19HcmlkX0dldFwiKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkLkZhbWlseU1lbWJlckNvdW50ICE9ICcwJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tZW1saXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWVtYmVycyA9IHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkLkZhbWlseU1lbWJlckxpc3QuQVBJUmVzdWx0X0ZhbWlseU1lbWJlckl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICBzZWxmLm1lbWxpc3QucHVzaChtZW1iZXJzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuZ2V0QWdlKG1lbWJlcnNbaV0uRGF0ZU9mQmlydGgpIDwgMTggfHwgbWVtYmVyc1tpXS5SZWxhdGlvblNoaXAuaW5kZXhPZignUHJpbWFyeScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0TWVtYmVySW5mb0ltYWdlU2VydmljZShpLCBtZW1iZXJzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VsZi5tZW1saXN0LnB1c2gobWVtYmVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nZXRNZW1iZXJJbmZvSW1hZ2VTZXJ2aWNlKDAsIG1lbWJlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIiwgSlNPTi5zdHJpbmdpZnkoc2VsZi5tZW1saXN0KSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIG9yIG5vIG1lbWJycyBsaXN0LS0+XCIgKyByZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5NZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVzZXJHZW5kZXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIG1lbWJlcnMgbGlzdCBcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYubWVtbGlzdCA9IFtdO1xuICAgICAgICAgICAgbGV0IG1lbWJlcnM6IGFueSA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIikpO1xuICAgICAgICAgICAgaWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggIT0gdW5kZWZpbmVkICYmIG1lbWJlcnNbMF0ucGhvdG8gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gIHNlbGYubWVtbGlzdC5wdXNoKG1lbWJlcnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuZ2V0QWdlKG1lbWJlcnNbaV0uRGF0ZU9mQmlydGgpIDwgMTggfHwgbWVtYmVyc1tpXS5SZWxhdGlvblNoaXAuaW5kZXhPZignUHJpbWFyeScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiSElUIEdFVCBNRU1CRVIgSU1BR0UgU0VSVklEIFwiICsgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nZXRNZW1iZXJJbmZvSW1hZ2VTZXJ2aWNlKGksIG1lbWJlcnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZW1iZXJzLmxlbmd0aCA9PSB1bmRlZmluZWQgJiYgbWVtYmVyc1swXS5waG90byA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkRJRkZFUkVOVCBTQ0VOQVJJTyAgXCIpO1xuICAgICAgICAgICAgICAgICAgICAvL3NlbGYubWVtbGlzdC5wdXNoKG1lbWJlcnMpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmdldE1lbWJlckluZm9JbWFnZVNlcnZpY2UoMCwgbWVtYmVycyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tZW1saXN0ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHNlbGYubWVtbGlzdC5maW5kSW5kZXgoeCA9PiB4LlBlcnNvbklkID09IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSXCIpKS5FeHRlcm5hbE1lbWJlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubWVtbGlzdC5sZW5ndGggPj0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGhvdG8gPSBzZWxmLm1lbWxpc3RbaW5kZXhdLnBob3RvO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSXCIpKS5FeHRlcm5hbE1lbWJlcklkICsgXCIgICAgXCIgKyBpbmRleCk7XG5cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9hbGVydChcIlBsZWFzZSBjb25uZWN0IHdpdGggaW50ZXJuZXQgdG8gY29udGludWUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VXNlckdlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgZ2V0TWVtYmVySW5mb0ltYWdlU2VydmljZShpOiBhbnksIE9iamVjdEZhbTogYW55KSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy53ZWJhcGkuZ2V0TWVtYmVySW5mb0ZvckltYWdlKE9iamVjdEZhbS5QZXJzb25JZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0RmFtLnBob3RvID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uUGljdHVyZS5GaWxlRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInBob3RvIGFkZGVkZWQ9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIiArIHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLkV4dGVybmFsTWVtYmVySWQgKyBcIiArIFwiICsgaSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWVtbGlzdC5wdXNoKE9iamVjdEZhbSk7XG4gICAgICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coc2VsZi5tZW1saXN0Lmxlbmd0aCtcIiBMRU5HVEhcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lbWxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5tZW1saXN0LmZpbmRJbmRleCh4ID0+IHguUGVyc29uSWQgPT0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJfREVGQVVMVFNcIikpLkV4dGVybmFsTWVtYmVySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbmRleCArIFwiICAgPD4+Pjw8PDw8PDw8Pj4+Pj4+Pj4+Pj4gIFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9IC0xICYmIGluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJpbWVNZW0gPSBzZWxmLm1lbWxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXBsYWNlT2JqID0gc2VsZi5tZW1saXN0WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubWVtbGlzdFswXSA9IHByaW1lTWVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnBob3RvU3RhdHVzICE9ICdhZGRlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBob3RvIGFkZGVkZGRkZGRkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBob3RvID0gc2VsZi5tZW1saXN0WzBdLnBob3RvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1lbWxpc3RbaW5kZXhdID0gcmVwbGFjZU9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGltZ0luZHggPSBzZWxmLm1lbWxpc3QuZmluZEluZGV4KHggPT4geC5QZXJzb25JZCA9PSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSkuRXh0ZXJuYWxNZW1iZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBob3RvID0gc2VsZi5tZW1saXN0W2ltZ0luZHhdLnBob3RvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGhvdG9TdGF0dXMgPSAnYWRkZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coXCJra2tra2tra2tcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIiwgSlNPTi5zdHJpbmdpZnkoc2VsZi5tZW1saXN0KSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5NZXNzYWdlICsgXCIgRXJyb3IgSW4gR2V0dGluZyBHZXRNZW1iZXIgSW5mb1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZ2V0dGluZyB0aGVnZXRNZW1iZXIgSW5mbyAvIFNlc3Npb24gZXhwaXJlZC4uLi4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3BlbkRlcGVuZGVudHMoKSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd24gPSAhdGhpcy5kcm9wZG93bjtcbiAgICB9XG4gICAgY3VycmVudFVzZXJHZW5kZXIoKSB7XG4gICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIk1FTUJFUl9BQ0NFU1NcIikpIHtcbiAgICAgICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKSkge1xuICAgICAgICAgICAgICAgIGxldCB1c2VyTGlzdCA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIikpO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHVzZXJMaXN0LmZpbmRJbmRleCh4ID0+IHguUGVyc29uSWQgPT0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJNRU1CRVJfQUNDRVNTXCIpKVxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlci5nZW5kZXIgPSB1c2VyTGlzdFtpbmRleF0uR2VuZGVyO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuaW5keCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZHggPSB1c2VyTGlzdFtpbmRleF0uUGVyc29uSWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKSB7XG4gICAgICAgICAgICBsZXQgdXNlckxpc3QgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKTtcbiAgICAgICAgICAgIGxldCBwZXJzb25pZCA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSX0RFRkFVTFRTXCIpKS5FeHRlcm5hbE1lbWJlcklkO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdXNlckxpc3QuZmluZEluZGV4KHggPT4geC5QZXJzb25JZCA9PSBwZXJzb25pZClcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyLmdlbmRlciA9IHVzZXJMaXN0W2luZGV4XS5HZW5kZXI7XG4gICAgICAgICAgICAgICAgLy90aGlzLmluZHggPSBpbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLmluZHggPSB1c2VyTGlzdFtpbmRleF0uUGVyc29uSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0TWVtYmVyQWNjZXNzKHBlcnNvbklkLCBkb2IsIHJlbGF0aW9uc2hpcCwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5kcm9wZG93biA9ICF0aGlzLmRyb3Bkb3duO1xuICAgICAgICBsZXQgYWdlID0gdGhpcy5nZXRBZ2UoZG9iKTtcbiAgICAgICAgaWYgKChhZ2UgPCAxOCAmJiByZWxhdGlvbnNoaXAuaW5kZXhPZihcIkRlcGVuZGVudFwiKSA+IC0xKSB8fCByZWxhdGlvbnNoaXAuaW5kZXhPZihcIlByaW1hcnlcIikgPiAtMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndlYmFwaS5FeHRlcm5hbE1lbWJlcklkID0gcGVyc29uSWQ7XG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJNRU1CRVJfQUNDRVNTXCIsIHBlcnNvbklkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldE1lbWJlckluZm9TZXJ2aWNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmR4ID0gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaWFsb2dzLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIldlIGFwb2xvZ2l6ZSBmb3IgdGhpcyBub3RpY2UsIGhvd2V2ZXIgaW4gY29tcGxpYW5jZSB3aXRoIEhJUEFBIHJlZ3VsYXRpb25zLCB5b3UgYXJlIG5vdCBhYmxlIHRvIGFjY2VzcyB0aGlzIG1lbWJlcnMgYWNjb3VudCBkdWUgdG8gdGhlaXIgYWdlLiAgUGxlYXNlIGNhbGwgMS04NDQtMzYyLTI0NDcgdG8gc3BlYWsgdG8gYSBjdXN0b21lciBjYXJlIHJlcHJlc2VudGF0aXZlLlwiLFxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPa1wiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIGdldE1lbWJlckluZm9TZXJ2aWNlKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMud2ViYXBpLmxvYWRlci5zaG93KHRoaXMud2ViYXBpLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLndlYmFwaS5nZXRNZW1iZXJJbmZvKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLkZpcnN0TmFtZSA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLkZpcnN0TmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLkZpcnN0TmFtZS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLkxhc3ROYW1lID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uTGFzdE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5MYXN0TmFtZS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLkRPQiA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLkRPQjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLkFkZHJlc3MxID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uQWRkcmVzczE7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5TdGF0ZSA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLlN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuWmlwID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uWmlwO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuUGhvbmUgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5QaG9uZS5tYXRjaChuZXcgUmVnRXhwKCcuezEsNH0kfC57MSwzfScsICdnJykpLmpvaW4oXCItXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuRW1haWwgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5FbWFpbDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLlBsYW5JZCA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLlBsYW5JZDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLlBsYW5PcHRpb24gPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5QbGFuT3B0aW9uO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuUmVsYXRpb25zaGlwID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uUmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuRXh0ZXJuYWxNZW1iZXJJZCA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLkV4dGVybmFsTWVtYmVySWQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5QaWN0dXJlRGF0YSA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLlBpY3R1cmUuRmlsZURhdGE7XG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiVVNFUlwiLCBKU09OLnN0cmluZ2lmeShzZWxmLnVzZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkQ3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgdGhlZ2V0TWVtYmVyIEluZm8gLyBTZXNzaW9uIGV4cGlyZWQgXCIgKyByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5NZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZ2V0dGluZyB0aGVnZXRNZW1iZXIgSW5mbyAvIFNlc3Npb24gZXhwaXJlZC4uLi4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldEFnZShkb2IpIHtcbiAgICAgICAgbGV0IGRiID0gZG9iLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgbGV0IHllYXIgPSBkYlsyXTsgbGV0IG1vbnRoID0gZGJbMF07IGxldCBkYXkgPSBkYlsxXTtcbiAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKClcbiAgICAgICAgbGV0IGFnZSA9IG5vdy5nZXRGdWxsWWVhcigpIC0geWVhclxuICAgICAgICBsZXQgbWRpZiA9IG5vdy5nZXRNb250aCgpIC0gbW9udGggKyAxIC8vMD1qYW5cdFxuICAgICAgICBpZiAobWRpZiA8IDApIHtcbiAgICAgICAgICAgIC0tYWdlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobWRpZiA9PSAwKSB7XG4gICAgICAgICAgICBsZXQgZGRpZiA9IG5vdy5nZXREYXRlKCkgLSBkYXlcbiAgICAgICAgICAgIGlmIChkZGlmIDwgMCkge1xuICAgICAgICAgICAgICAgIC0tYWdlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFnZVxuICAgIH1cblxuICAgIGxvYWRDdXJyZW50VXNlcigpIHtcbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIHRoaXMuci51cmwgPT0gXCIvaG9tZVwiOlxuICAgICAgICAgICAgICAgIHRoaXMuci5uYXZpZ2F0ZShbXCIvaG9tZTFcIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnIudXJsID09IFwiL2hvbWUxXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5yLm5hdmlnYXRlKFtcIi9ob21lXCJdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGhpcy5yLnVybCA9PSBcIi9pbmJveFwiOlxuICAgICAgICAgICAgICAgIHRoaXMuci5uYXZpZ2F0ZShbXCIvaW5ib3gxXCJdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGhpcy5yLnVybCA9PSBcIi9pbmJveDFcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnIubmF2aWdhdGUoW1wiL2luYm94XCJdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGhpcy5yLnVybCA9PSBcIi9mb2xsb3d1cHNcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnIubmF2aWdhdGUoW1wiL2ZvbGxvd3VwczFcIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnIudXJsID09IFwiL2ZvbGxvd3VwczFcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnIubmF2aWdhdGUoW1wiL2ZvbGxvd3Vwc1wiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMuci51cmwgPT0gXCIvY29uc3VsdGhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnIubmF2aWdhdGUoW1wiL2NvbnN1bHRoaXN0b3J5MVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMuci51cmwgPT0gXCIvY29uc3VsdGhpc3RvcnkxXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5yLm5hdmlnYXRlKFtcIi9jb25zdWx0aGlzdG9yeVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMuci51cmwgPT0gXCIvc2NoZWR1bGVkY29uc3VsdHNcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnIubmF2aWdhdGUoW1wiL3NjaGVkdWxlZGNvbnN1bHRzMVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMuci51cmwgPT0gXCIvc2NoZWR1bGVkY29uc3VsdHMxXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5yLm5hdmlnYXRlKFtcIi9zY2hlZHVsZWRjb25zdWx0c1wiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMuci51cmwgPT0gXCIvdXNlcmhlYWx0aHJlY29yZHMxXCIgfHwgdGhpcy5yLnVybC5pbmRleE9mKCcvdXNlcmhlYWx0aHJlY29yZHMxJykgPT0gMDpcbiAgICAgICAgICAgICAgICB0aGlzLnIubmF2aWdhdGUoW1wiL3VzZXJoZWFsdGhyZWNvcmRzXCJdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGhpcy5yLnVybCA9PSBcIi91c2VyaGVhbHRocmVjb3Jkc1wiIHx8IHRoaXMuci51cmwuaW5kZXhPZignL3VzZXJoZWFsdGhyZWNvcmRzJykgPT0gMDpcbiAgICAgICAgICAgICAgICB0aGlzLnIubmF2aWdhdGUoW1wiL3VzZXJoZWFsdGhyZWNvcmRzMVwiXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMuci51cmwgPT0gXCIvcHJvZmlsZVwiOlxuICAgICAgICAgICAgICAgIHRoaXMuci5uYXZpZ2F0ZShbXCIvcHJvZmlsZTFcIl0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnIudXJsID09IFwiL3Byb2ZpbGUxXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5yLm5hdmlnYXRlKFtcIi9wcm9maWxlXCJdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZXBlbmRlbnQgTWVtYmVyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=