import { Component, OnInit } from "@angular/core";
import * as ApplicationSettings from "application-settings";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Router } from '@angular/router';
import { User } from "../../shared/model/user.model";
let frame = require("ui/frame");
let xml2js = require('nativescript-xml2js');
import dialogs = require("ui/dialogs");
@Component({
    selector: "dependent",
    moduleId: module.id,
    templateUrl: "./dependent.component.html",
    providers: [Configuration, WebAPIService]
})
export class DependentComponent {
    dropdown: boolean = false; memlist: any = []; user = new User(); indx: number; photo: any; photoStatus: any;
    constructor(private webapi: WebAPIService, private r: Router) { }
    ngAfterViewInit() {
        this.getFamliMembers();
    }
    getFamliMembers() {
        let self = this;
        if (!ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
            self.webapi.personalAndLSSummary("FamilyMembers_Grid_Get").subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_FamilyMembers_Grid.Successful == "true" && result.APIResult_FamilyMembers_Grid.FamilyMemberCount != '0') {
                        self.memlist = [];
                        let members = result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem;
                        if (members.length != undefined) {
                            for (let i = 0; i < members.length; i++) {
                                //  self.memlist.push(members[i]);
                                if (self.getAge(members[i].DateOfBirth) < 18 || members[i].RelationShip.indexOf('Primary') > -1) {
                                    self.getMemberInfoImageService(i, members[i]);
                                }
                            }
                        } else {
                            // self.memlist.push(members);
                            self.getMemberInfoImageService(0, members);
                        }
                        // ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));
                    } else {
                        console.log("error or no membrs list-->" + result.APIResult_FamilyMembers_Grid.Message);
                    }
                });
                this.currentUserGender();
            },
                error => {
                    console.log("Error in members list " + error);
                });
        } else {
            self.memlist = [];
            let members: any = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
            if (this.webapi.netConnectivityCheck()) {
                if (members.length != undefined && members[0].photo == undefined) {
                    for (let i = 0; i < members.length; i++) {
                        //  self.memlist.push(members[i]);
                        if (self.getAge(members[i].DateOfBirth) < 18 || members[i].RelationShip.indexOf('Primary') > -1) {
                            //console.log("HIT GET MEMBER IMAGE SERVID " + i);
                            self.getMemberInfoImageService(i, members[i]);
                        }
                    }
                } else if (members.length == undefined && members[0].photo == undefined) {
                    //console.log("DIFFERENT SCENARIO  ");
                    //self.memlist.push(members);
                    self.getMemberInfoImageService(0, members);
                } else {
                    self.memlist = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                    let index = self.memlist.findIndex(x => x.PersonId == JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId);
                    if (self.memlist.length >= index) {
                        self.photo = self.memlist[index].photo;
                    }
                    // console.log(JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId + "    " + index);


                }
            } else {
                //alert("Please connect with internet to continue.");
            }
            this.currentUserGender();
        }

    }
    getMemberInfoImageService(i: any, ObjectFam: any) {
        let self = this;
        this.webapi.getMemberInfoForImage(ObjectFam.PersonId).subscribe(data => {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.ServiceCallResult_MemberInfo.Successful == "true") {
                    ObjectFam.photo = result.ServiceCallResult_MemberInfo.Picture.FileData;
                    //console.log("photo addeded==========================================" + result.ServiceCallResult_MemberInfo.ExternalMemberId + " + " + i);
                    self.memlist.push(ObjectFam);
                //    console.log(self.memlist.length+" LENGTH");
                    if (self.memlist.length > 0) {
                        let index = self.memlist.findIndex(x => x.PersonId == JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId);
                       // console.log(index + "   <>>><<<<<<<<>>>>>>>>>>>  " + index);
                        if (index != -1 && index != 0) {
                            let primeMem = self.memlist[index];
                            let replaceObj = self.memlist[0];
                            self.memlist[0] = primeMem;
                            if (self.photoStatus != 'added') {
                               // console.log("photo addeddddddd");
                                self.photo = self.memlist[0].photo;
                            }
                            self.memlist[index] = replaceObj;
                        } else {
                            let imgIndx = self.memlist.findIndex(x => x.PersonId == JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId)
                            self.photo = self.memlist[imgIndx].photo;
                            self.photoStatus = 'added';
                         //   console.log("kkkkkkkkk");
                        }
                    }
                    ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));

                } else {
                    console.log(result.ServiceCallResult_MemberInfo.Message + " Error In Getting GetMember Info");
                }
            })
        },
            error => {
                console.log("Error in getting thegetMember Info / Session expired..... " + error);
            });
    }

    openDependents() {
        this.dropdown = !this.dropdown;
    }
    currentUserGender() {
        if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                let userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                let index = userList.findIndex(x => x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"))
                if (index >= 0) {
                    this.user.gender = userList[index].Gender;
                    //this.indx = index;
                    this.indx = userList[index].PersonId;
                }
            }
        } else if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
            let userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
            let personid = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId;
            let index = userList.findIndex(x => x.PersonId == personid)
            if (index >= 0) {
                this.user.gender = userList[index].Gender;
                //this.indx = index;
                this.indx = userList[index].PersonId;
            }
        }
    }
    setMemberAccess(personId, dob, relationship, index) {
        this.dropdown = !this.dropdown;
        let age = this.getAge(dob);
        if ((age < 18 && relationship.indexOf("Dependent") > -1) || relationship.indexOf("Primary") > -1) {
            if (this.webapi.netConnectivityCheck()) {
                this.webapi.ExternalMemberId = personId;
                ApplicationSettings.setString("MEMBER_ACCESS", personId);
                this.getMemberInfoService();
                this.indx = index;
            }
        } else {
            dialogs.alert({
                message: "We apologize for this notice, however in compliance with HIPAA regulations, you are not able to access this members account due to their age.  Please call 1-844-362-2447 to speak to a customer care representative.",
                okButtonText: "Ok"
            })
        }
    }
    getMemberInfoService() {
        let self = this;
        this.webapi.loader.show(this.webapi.options);
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
                    self.loadCurrentUser();
                } else {
                    self.webapi.loader.hide();
                    console.log("Error in getting thegetMember Info / Session expired " + result.ServiceCallResult_MemberInfo.Message);
                }
            });
        },
            error => {
                self.webapi.loader.hide();
                console.log("Error in getting thegetMember Info / Session expired..... " + error);
            });
    }
    getAge(dob) {
        let db = dob.split("/");
        let year = db[2]; let month = db[0]; let day = db[1];
        let now = new Date()
        let age = now.getFullYear() - year
        let mdif = now.getMonth() - month + 1 //0=jan	
        if (mdif < 0) {
            --age
        }
        else if (mdif == 0) {
            let ddif = now.getDate() - day
            if (ddif < 0) {
                --age
            }
        }
        return age
    }

    loadCurrentUser() {
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
    }
}
