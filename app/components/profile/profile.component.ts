import { Component, OnInit, ViewChild } from "@angular/core";
import { Page } from "ui/page";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import { RadSideComponent } from "../radside/radside.component";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { TextField } from "ui/text-field";
import { takePicture } from 'nativescript-camera';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { TabView } from "ui/tab-view";
import { ValueList } from "nativescript-drop-down";
import { ScrollView } from "ui/scroll-view";
import * as ApplicationSettings from "application-settings";
let xml2js = require('nativescript-xml2js');
let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let http_request = require("http");
declare let android: any;

@Component({
    moduleId: module.id,
    templateUrl: "./profile.component.html",
    providers: [WebAPIService, Configuration]
})
export class ProfileComponent {
    mapView: any = null; pfEdit: boolean = false; billEdit: boolean = false; insurEdit: boolean = false;
    @ViewChild(RadSideComponent) public radSideComponent: RadSideComponent;
    formSubmitted = false; billFormSubmit = false; authorize: boolean = false;
    insrFormSubmit = false; pic1: any = null; memlist: any = []; user: any = {}; usrdata: any = {};
    planInfo: any = {}; insureInfo: any = {}; gender = ["Male", "Female", "Unknown"];
    pharmacyList: any = []; pharmaciesAddr: any = []; placeG: any = []; zipcode: string; city: string;
    pharname: string; state: string; centeredOnLocation: boolean = false; selectedPharmacy: any = {}; pharSearchTab: boolean = true;
    personalInfo: any = {}; carstates = new ValueList<string>(); prefPhar: any = {}; billingInfo: any = {}; years: any = [];
    months: any = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    timezones = new ValueList<string>(); pharCategory: boolean = false;
    constructor(private page: Page, private webapi: WebAPIService) { }
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.pfClass = true;
        this.getStates();
        for (let i = 0; i < 12; i++) {
            this.years.push((new Date()).getFullYear() + i);
        }
    }
    ngAfterViewInit() {
        this.getPersonalData();
        // To show Time zone drop down
        this.timezones.push({ value: "2", display: "Atlantic (GMT-4:00)" },
            { value: "3", display: "Eastern (GMT-5:00)" },
            { value: "4", display: "Eastern (GMT-5:00) No DST Adjustment" },
            { value: "5", display: "Central (GMT-6:00)" },
            { value: "6", display: "Central (GMT-6:00) No DST Adjustment" },
            { value: "7", display: "Mountain (GMT-7:00)" },
            { value: "8", display: "Mountain (GMT-7:00) No DST Adjustment" },
            { value: "9", display: "Pacific (GMT-8:00)" },
            { value: "10", display: "Pacific (GMT-8:00) No DST Adjustment" },
            { value: "11", display: "Alaska (GMT-9:00)" },
            { value: "12", display: "Alaska (GMT-9:00) No DST Adjustment" },
            { value: "13", display: "Hawaii (GMT-10:00)" },
            { value: "14", display: "Hawaii (GMT-10:00) No DST Adjustment" });
        this.loginDetailsShow();
        if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
            let data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
            this.usrdata.GroupNumber = data.GroupNumber;
            this.usrdata.Key = data.Key;
            //   this.usrdata.ExternalMemberId = data.ExternalMemberId;
        }
        if (ApplicationSettings.hasKey("USER")) {
            let data = JSON.parse(ApplicationSettings.getString("USER"));
            this.usrdata.ExternalMemberId = data.ExternalMemberId;
            //  console.log("EX ID "+this.usrdata.ExternalMemberId);
        }
    }
    /* To load USStates drop down dynamically */
    getStates() {
        this.webapi.getCodeList("USStates").subscribe(data => {
            let self = this;
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_CodeList.Successful == "true") {
                    for (let l = 0; l < result.APIResult_CodeList.List.ItemCount; l++) {
                        self.carstates.push({ value: result.APIResult_CodeList.List.List.CodeListItem[l].ItemId, display: result.APIResult_CodeList.List.List.CodeListItem[l].Value });
                    }
                } else {
                    // console.log("Session expired profile in getting the states. ");
                }
            });
        },
            error => {
                // console.log("Error in getting the states.. " + error);
            });
    }
    setStateForInsurance() {
        let slength = this.carstates.length;
        for (let s = 0; s < slength; s++) {
            if (this.carstates.getItem(s).value == this.insureInfo.CarrierState)
                this.insureInfo.stateIndx = s;
        }
    }
    setStateForContact() {
        let slength = this.carstates.length;
        for (let s = 0; s < slength; s++) {
            if (this.carstates.getItem(s).value == this.personalInfo.State)
                this.personalInfo.stateIndx = s;
        }
    }
    setBillingState() {
        let slength = this.carstates.length;
        for (let s = 0; s < slength; s++) {
            if (this.carstates.getItem(s).value == this.billingInfo.State)
                this.billingInfo.stateindx = s;
        }
    }
    setTimeZone() {
        for (let z = 0; z < this.timezones.length; z++) {
            if (this.timezones.getItem(z).value == this.personalInfo.TimeZoneId)
                this.personalInfo.timezoneid = z;
        }
    }
    /* To Load Personal data dynamically */
    getPersonalData() {
        if (this.webapi.netConnectivityCheck()) {
            let self = this;
            self.webapi.getMemberInfo().subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.ServiceCallResult_MemberInfo.Successful == "true") {
                        self.personalInfo = result.ServiceCallResult_MemberInfo;
                        for (let i = 0; i < self.gender.length; i++) {
                            if (self.gender[i].indexOf(self.personalInfo.Gender) > -1)
                                self.personalInfo.genderIndx = i;
                        }
                        self.setStateForContact();
                        self.setTimeZone();
                        self.personalInfo.Phone = self.formatPhoneNumber(self.personalInfo.Phone);
                        self.personalInfo.Phone2 = self.formatPhoneNumber(self.personalInfo.Phone2);
                    } else {
                        //console.log("Session expired or error in getting Personal Information...");
                    }
                });
            },
                error => {
                    // console.log("Error in Personal Info get.... " + error);
                });
        }
    }
    /* To Load different tab data dynamically when user taps based on their tab index */
    onTabChange(args) {
        let tabView = <TabView>args.object;
        switch (true) {
            case tabView.selectedIndex == 1 && this.billingInfo.NameOnCard == undefined:
                this.getBillingInfo();
                break;
            case tabView.selectedIndex == 2 && this.insureInfo.CarrierName == undefined:
                this.insuranceInfoGet();
                break;
            case tabView.selectedIndex == 3 && this.prefPhar.PharmacyName == undefined:
                this.preferredPharList();
                break;
            case tabView.selectedIndex == 4 && this.planInfo.PlanId == undefined:
                this.getPlanInfo();
                break;
            case tabView.selectedIndex == 5:
                break;
            default:
            //console.log("Nothing. in Profile............................");
        }
    }
    onCarStateChage(args) {
        this.insureInfo.CarrierState = this.carstates.getValue(args.selectedIndex);
    }
    onPersonalStateChage(args) {
        this.personalInfo.State = this.carstates.getValue(args.selectedIndex);
    }
    onStateChange(args) {
        this.state = this.carstates.getDisplay(args.selectedIndex);
    }
    onTimeZoneChange(args) {
        this.personalInfo.TimeZoneId = this.timezones.getValue(args.selectedIndex);
    }
    /* To load billing info data */
    getBillingInfo() {
        let self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.getBillingInfo().subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CCInfo.Successful == "true") {
                        self.billingInfo = result.APIResult_CCInfo;
                        self.billingInfo.monthindx = self.months.indexOf(self.billingInfo.ExpMonth);
                        self.billingInfo.yearindx = self.years.indexOf(new Date(self.billingInfo.ExpYear).getFullYear());
                        self.setBillingState();
                    } else if (result.APIResult_CCInfo.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                        // console.log("Session expired or error in getting billing data...");
                    }
                });
            },
                error => {
                    // console.log("Error in getting billing data.... " + error);
                });
        }
    }
    /* To load Insurance  info data */
    insuranceInfoGet() {
        if (this.webapi.netConnectivityCheck()) {
            let self = this;
            self.webapi.getPlanInfo("InsuranceInfo_Get").subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_InsuranceInfo.Successful == "true") {
                        self.insureInfo = result.APIResult_InsuranceInfo;
                        self.insureInfo.CarrierPhone = self.formatPhoneNumber(self.insureInfo.CarrierPhone);
                        self.setStateForInsurance();
                    } else if (result.APIResult_InsuranceInfo.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                        // console.log("Session expired or error in getting insure data..." + result.APIResult_InsuranceInfo.Message);
                    }
                });
            },
                error => {
                    //console.log("Error in Insurance get Info.... " + error);
                });
        }
    }
    /* To load Plan info data */
    getPlanInfo() {
        let self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.getPlanInfo("PlanHistory_Get").subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PlanHistory.Successful == "true") {
                        self.planInfo = result.APIResult_PlanHistory.PlanHistory.PlanHistory;
                    } else if (result.APIResult_PlanHistory.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                        //console.log("Session expired or error in getting plan data..." + result.APIResult_PlanHistory.Message);
                    }
                });
            },
                error => {
                    //console.log("Error in Personal and Lifestyle.... " + error);
                });
        }
    }
    /* To Update Contact info after successive validation*/
    updateContactInfo(fname, lname, dob, addr1, city, zip, phone, email) {
        //console.log(fname + " " + lname + " " + dob + " " + addr1 + " --" + city + " " + zip + " " + phone + "  " + email);
        this.formSubmitted = true; this.personalInfo.Phone2error = false;
        let emailval = ((this.personalInfo.Email != undefined && this.personalInfo.Email.trim() != '') ? email : true);
        let phone2val = ((this.personalInfo.Phone2 != undefined && this.personalInfo.Phone2.trim() != '') ? this.isValidPhone(this.personalInfo.Phone2) : true);
        if (fname && lname && dob && addr1 && city && zip && phone && this.isValidPhone(this.personalInfo.Phone) && emailval && this.personalInfo.FirstName.trim() != '' && this.personalInfo.LastName.trim() != '' && this.personalInfo.Address1.trim() != '' && this.personalInfo.City.trim() != '' && phone2val && this.webapi.netConnectivityCheck()) {
            let self = this;
            self.webapi.personalInfoSave(self.personalInfo).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    //console.log(JSON.stringify(result.ServiceCallResult));
                    if (result.ServiceCallResult.Successful == "true") {
                        self.pfEdit = false; self.getFamliMembers();
                    } else if (result.ServiceCallResult.Message.indexOf("phone 2") > -1) {
                        self.personalInfo.Phone2 = ""; self.personalInfo.Phone2error = true;
                    } else if (result.ServiceCallResult.Message.indexOf("phone") > -1) {
                        self.personalInfo.Phone = "";
                    } else if (result.ServiceCallResult.Message.indexOf("email") > -1) {
                        self.personalInfo.Email = "";
                    } else if (result.ServiceCallResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                        // console.log("Session expired in save Insurance data..." + result.ServiceCallResult.Message);
                    }
                });
            },
                error => {
                    //console.log("Error in Personal and Lifestyle.... " + error);
                });
        } else {
            this.focusContactInfoError(fname, lname, dob, addr1, city, zip, phone, email);
        }
    }
    /* To Update Billing info after successive validation*/
    updateBillInfo(cardno, name, addr, city, zip, phone) {
        this.billFormSubmit = true;
        // console.log(cardno + "---" + name + " -- " + addr + " -- " + city + "--" + zip + "--" + phone);
        if (cardno && name && addr && city && zip && phone && this.isValidPhone(this.billingInfo.Phone) && this.isValidCard() && this.authorize && this.billingInfo.NameOnCard.trim() != '' && this.billingInfo.Address1.trim() != '' && this.billingInfo.City.trim() != '' && this.webapi.netConnectivityCheck()) {
            let self = this;
            self.webapi.saveBillingInfo(self.billingInfo).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    // console.log(JSON.stringify(result.APIResult));
                    if (result.APIResult.Successful == "true") {
                        self.billEdit = false; self.insureInfo.invalph = false;
                    } else if (result.APIResult.Message.indexOf("phone") > -1) {
                        self.billingInfo.Phone = "";
                    } else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                        //console.log("Session expired in save billing data..." + result.APIResult.Message);
                    }
                });
            },
                error => {
                    //console.log("Error in SAVE Billing Data.... " + error);
                });
        } else {
            this.focusBillInfoError(cardno, name, addr, city, zip, phone);
        }
    }
    /* To Update Insurance info after successive validation*/
    updateInsuranceInfo(name, phone, id) {
        this.insrFormSubmit = true;
        if (name && phone && this.isValidNo(this.insureInfo.InsuranceMemberId) && this.isValidPhone(this.insureInfo.CarrierPhone) && this.insureInfo.CarrierName.trim() != '' && this.webapi.netConnectivityCheck()) {
            if (this.insureInfo.CarrierZip != null && this.insureInfo.CarrierZip != undefined && this.insureInfo.CarrierZip.trim() != '' && this.insureInfo.CarrierZip.length != 5) {
                this.insureInfo.invalzip = true;
                return;
            }
            let self = this; self.insureInfo.invalzip = false;
            self.webapi.saveInsureInfo(self.insureInfo).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        self.insurEdit = false;
                    } else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                        //console.log("Session expired in save Insurance data..." + result.APIResult.Message);
                    }
                });
            },
                error => {
                    //console.log("Error in Personal and Lifestyle.... " + error);
                });

            // console.log("Update Insure info");
        }
    }
    formatPhoneNumber(s) {
        let s2 = ("" + s).replace(/\D/g, '');
        let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (m != null)
            return m[1] + "-" + m[2] + "-" + m[3];
    }
    /* To Make Focus for invalid data inside ContactInfo */
    focusContactInfoError(fname, lname, dob, addr1, city, zip, phone, email) {
        let name: boolean = true;
        switch (name || "") {
            case !fname || this.personalInfo.FirstName == undefined || this.personalInfo.FirstName.trim() == '':
                (<TextField>this.page.getViewById("firstName")).focus();
                break;
            case !lname || this.personalInfo.LastName == undefined || this.personalInfo.LastName.trim() == '':
                (<TextField>this.page.getViewById("lastName")).focus();
                break;
            case !dob || this.personalInfo.DOB == undefined || !this.isValidDate():
                (<TextField>this.page.getViewById("dob")).focus();
                break;
            case !addr1 || this.personalInfo.Address1 == undefined || this.personalInfo.Address1.trim() == '':
                (<TextField>this.page.getViewById("addr1")).focus();
                break;
            case !city || this.personalInfo.City == undefined || this.personalInfo.City.trim() == '':
                (<TextField>this.page.getViewById("city")).focus();
                break;
            case !zip || this.personalInfo.Zip == undefined:
                (<TextField>this.page.getViewById("zip")).focus();
                break;
            case !phone || this.personalInfo.Phone == undefined || !this.isValidPhone(this.personalInfo.Phone):
                (<TextField>this.page.getViewById("phone")).focus();
                break;
            case this.personalInfo.Email != undefined && this.personalInfo.Email.trim() != '' && !email:
                (<TextField>this.page.getViewById("email")).focus();
                break;
            case this.personalInfo.Phone2 != undefined && this.personalInfo.Phone2.trim() != '' && !this.isValidPhone(this.personalInfo.Phone2):
                (<TextField>this.page.getViewById("phone2")).focus();
                break;
            default:
            //console.log("All Contact info fine.............................");
        }
    }
    /* To Make Focus for invalid data inside BillingInfo */
    focusBillInfoError(cardno, name, addr, city, zip, phone) {
        switch (true || "") {
            case !cardno || this.billingInfo.CardNumber == undefined || !this.isValidCard():
                (<TextField>this.page.getViewById("cardno")).focus();
                break;
            case !name || this.billingInfo.NameOnCard == undefined || this.billingInfo.NameOnCard.trim() == '':
                (<TextField>this.page.getViewById("cardname")).focus();
                break;
            case !addr || this.billingInfo.Address1 == undefined || this.billingInfo.Address1.trim() == '':
                (<TextField>this.page.getViewById("billingaddr")).focus();
                break;
            case !city || this.billingInfo.City == undefined || this.billingInfo.City.trim() == '':
                (<TextField>this.page.getViewById("billingcity")).focus();
                break;
            case !zip || this.billingInfo.Zip == undefined:
                (<TextField>this.page.getViewById("billingzip")).focus();
                break;
            case !phone || this.billingInfo.Phone == undefined || !this.isValidPhone(this.billingInfo.Phone):
                (<TextField>this.page.getViewById("billingphone")).focus();
                break;
            default:
            //console.log("All Billing info fine.............................");
        }
    }
    onMonthChange(args) {
        this.billingInfo.month = this.months[args.value];
    }
    onYearChange(args) {
        this.billingInfo.year = this.years[args.value];
    }
    onBSTChange(args) {
        this.billingInfo.state = this.carstates.getValue(args.selectedIndex);
    }
    isValidCard() {
        //return /^([0-9*-]{13})$/.test(this.billingInfo.CardNumber);
        return /^(^[0-9\-\*]{17})$/.test(this.billingInfo.CardNumber);
    }
    isValidDate() {
        let date = this.personalInfo.DOB;
        let matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
        if (matches == null) return false;
        let d: any = matches[2];
        let m: any;
        m = parseInt(matches[1]) - 1;
        let y: any = matches[3];
        let composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y && composedDate.getTime() < new Date().getTime();
    }
    onMapReady(event) {
        if (this.mapView || !event.object) return;
        this.mapView = event.object;
        this.mapView.latitude = 36.778259;
        this.mapView.longitude = -119.417931;
        this.mapView.zoom = 2;
    };
    /* Search the Pharmacy */
    searchPharmacy(pvalue, zvalue, from) {
        //console.log("search pharmacy called in profile" + pvalue + " " + zvalue + " " + this.state + " city" + this.city);
        let self = this;
        if (!from) {
            this.formSubmitted = true;
        }
        if (!from && this.pharCategory && (!this.city || !this.state)) {
            return false;
        } else if (!from && !this.pharCategory && (!zvalue || this.zipcode == '')) {
            return false;
        }
        if (pvalue && self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options); self.pharmacyList = [];
            this.webapi.pharmacySearch(this.pharname != undefined ? this.pharname : "", this.zipcode != undefined ? this.zipcode : "", this.state != undefined ? this.state : "", this.city != undefined ? this.city : "").subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PharmacyList.Successful == "true" && result.APIResult_PharmacyList.PharmacyListCount != "0") {
                        let list = result.APIResult_PharmacyList.PharmacyList.PharmacyItem;
                        if (list.length != undefined) {
                            self.pharSearchTab = false; self.pharmaciesAddr = [];
                            for (let i = 0; i < list.length; i++) {
                                list[i].MemberDefaultPharmacy = false;
                                self.pharmacyList.push(list[i]);
                                self.pharmaciesAddr.push(list[i].PharmacyAddress1 + " " + list[i].PharmacyCity + ", " + list[i].PharmacyState + " " + list[i].PharmacyZip);
                            }
                        } else {
                            self.pharSearchTab = false;
                            self.pharmacyList.push(list);
                            self.pharmaciesAddr.push(list.PharmacyAddress1 + " " + list.PharmacyCity + ", " + list.PharmacyState + " " + list.PharmacyZip);
                        }
                        self.searchPharmacyToPlaceMarkers(self.pharmaciesAddr);
                        self.webapi.loader.hide();
                    } else if (result.APIResult_PharmacyList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.loader.hide();
                        self.webapi.logout();
                    } else {
                        self.webapi.loader.hide();
                        //console.log("No pharmacies found / Session expired / error in search pharmacy");
                    }
                });
            },
                error => {
                    self.webapi.loader.hide();
                    //console.log("Error in Pharmacy Search.. " + error);
                });
        }
    }
    /* Placing Markers inside map by using their address */
    searchPharmacyToPlaceMarkers(pharAddrs: any[]) {
        let self = this; let searchField = "";
        for (let i = 0; i < pharAddrs.length; i++) {
            searchField = ""; searchField = pharAddrs[i].split(' ').join('%20');
            this.webapi.getPlaces(searchField).subscribe(
                data => {
                    //console.log(JSON.stringify(data));
                    self.placeG = JSON.parse(JSON.stringify(data)).results;
                    let marker = new Marker();
                    marker.position = Position.positionFromLatLng(self.placeG[0].geometry.location.lat, self.placeG[0].geometry.location.lng);
                    marker.title = self.placeG[0].name;
                    marker.snippet = self.placeG[0].formatted_address;
                    self.mapView.addMarker(marker);
                    //self.mapView.zoom = 100;
                    self.centeredOnLocation = true;
                    //console.log("Marker added........");
                },
                error => {
                    //console.log(error);
                }
            );
        }
    }
    onMarkerSelect(event) {
        for (let i = 0; i < this.pharmacyList.length; i++) {
            if (this.pharmacyList[i].PharmacyAddress1.toUpperCase() == event.marker.title.toUpperCase()) {
                this.setAsPreferredPharmacy(i);
                this.pharmacyList.splice(0, 0, this.pharmacyList.splice(i, 1)[0]);
            }
        }
    }
    setAsPreferredPharmacy(index) {
        for (let i = 0; i < this.pharmacyList.length; i++) {
            if (i == index) {
                this.pharmacyList[index].MemberDefaultPharmacy = !this.pharmacyList[index].MemberDefaultPharmacy;
                if (this.pharmacyList[index].MemberDefaultPharmacy) {
                    this.selectedPharmacy = this.pharmacyList[index];
                } else {
                    this.selectedPharmacy = {};
                }
            } else {
                this.pharmacyList[i].MemberDefaultPharmacy = false;
            }
        }
    }
    /* To show Preferred pharmacy */
    preferredPharList() {
        this.webapi.getMembersPreferredPharmacy_http().subscribe(data => {
            let self = this;
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_PreferredPharmacy.Successful == "true" && result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId != "0") {
                    self.prefPhar = result.APIResult_PreferredPharmacy.PreferredPharmacy;
                    self.pharmaciesAddr.push(self.prefPhar.PharmacyAddress1 + " " + self.prefPhar.PharmacyCity + ", " + self.prefPhar.PharmacyState + " " + self.prefPhar.PharmacyZip);
                    self.searchPharmacyToPlaceMarkers(self.pharmaciesAddr);

                } else if (result.APIResult_PreferredPharmacy.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                } else {
                    //console.log("Error/No Data in getting preferred pharmacy ");
                }
            });
        },
            error => {
                // console.log("Error in getting preferred pharmacy.. " + error);
            });
    }
    /* To update Preferred pharmacy */
    updatePreferredPhar() {
        (<ScrollView>this.page.getViewById("scrollid")).scrollToVerticalOffset(0, false);
        this.selectedPharmacy.submitted = true;
        if (this.selectedPharmacy.PharmacyId != null && this.selectedPharmacy.PharmacyId != undefined && this.webapi.netConnectivityCheck()) {
            this.webapi.savePrefPhar(this.selectedPharmacy).subscribe(data => {
                let self = this;
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PreferredPharmacy.Successful == "true" && result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId != "0") {
                        self.prefPhar = result.APIResult_PreferredPharmacy.PreferredPharmacy;
                        self.selectedPharmacy.error = false;
                        setTimeout(function () {
                            self.selectedPharmacy.error = true;
                        }, 5000);
                    } else if (result.APIResult_PreferredPharmacy.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                        // console.log("Error in getting preferred pharmacy ");
                    }
                });
            },
                error => {
                    // console.log("Error in getting preferred pharmacy.. " + error);
                });
        }
    }
    /* Mapit the user selected pharmacy inside the google map */
    mapInGoogle(item) {
        (<ScrollView>this.page.getViewById("scrollid")).scrollToVerticalOffset(0, false);
        let markPhar: any = [];
        markPhar.push(item.PharmacyAddress1 + " " + item.PharmacyCity + ", " + item.PharmacyState + " " + item.PharmacyZip)
        let self = this; let searchField = "";
        for (let i = 0; i < markPhar.length; i++) {
            searchField = ""; searchField = markPhar[i].split(' ').join('%20');
            this.webapi.getPlaces(searchField).subscribe(
                data => {
                    self.placeG = JSON.parse(JSON.stringify(data)).results;
                    let marker = new Marker();
                    marker.position = Position.positionFromLatLng(self.placeG[0].geometry.location.lat, self.placeG[0].geometry.location.lng);
                    marker.title = self.placeG[0].name;
                    marker.snippet = self.placeG[0].formatted_address;
                    self.mapView.addMarker(marker);
                    self.mapView.latitude = self.placeG[0].geometry.location.lat;
                    self.mapView.longitude = self.placeG[0].geometry.location.lng;
                    self.mapView.zoom = 16;
                    self.centeredOnLocation = true;
                    //console.log("Marker added. and Zoomed.......");
                },
                error => {
                    //console.log(error);
                }
            );
        }
        //this.searchPharmacyToPlaceMarkers(markPhar.push(item.PharmacyAddress1 + " " + item.PharmacyCity + ", " + item.PharmacyState + " " +item.PharmacyZip));
    }
    personalInfoEdit() {
        this.pfEdit = true;
    }
    billingInfoEdit() {
        this.billEdit = true;
    }
    insureInfoEdit() {
        this.insurEdit = true;
    }
    isValidPhone(phoneno: string) {
        return /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(phoneno);
    }

    isAuthorize() {
        this.authorize = !this.authorize;
    }
    isValidNo(num: any) {
        return /^\d+$/.test(num);
    }
    /* Checking Android permissions */
    onRequestPermissionsTap() {
        this.pic1 = null; this.imgdtls = {};
        if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
            permissions.requestPermission(android.Manifest.permission.CAMERA, "I need these permissions to read from storage")
                .then(() => {
                    // console.log("Permissions granted!");
                    this.onTakePictureTap();
                })
                .catch(() => {
                    //console.log("Uh oh, no permissions - plan B time!");
                    alert("You don't have permission to access the camera");
                });
        } else {
            this.onTakePictureTap();
        }
    }

    cameraImage: ImageAsset;
    imgdtls: any = {};
    /* Taking Picture from camera */
    onTakePictureTap() {
        let _that = this; this.user.showPic = true;
        takePicture({ width: 180, height: 180, keepAspectRatio: false, saveToGallery: true })
            .then((imageAsset) => {
                let source = new ImageSource();
                source.fromAsset(imageAsset).then((source) => {
                    //  console.log(`Size: ${source.width}x${source.height}`);
                    _that.user.showPic = false;
                    _that.imgdtls.imageName = "sample.jpg";
                    _that.imgdtls.base64textString = source.toBase64String("jpg", 10);
                    _that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
                    setTimeout(() => {
                        _that.savePersonalImage(_that.imgdtls, "Add");
                    }, 500);
                });
                _that.cameraImage = imageAsset;
                if (_that.pic1 == null) {
                    _that.pic1 = imageAsset;
                }
            }, (error) => {
                // console.log("Error: " + error);
            });
    }
    /* To save picture in server */
    savePersonalImage(item: any, operation) {
        if (this.webapi.netConnectivityCheck()) {
            let self = this;
            self.webapi.loader.show(self.webapi.options);
            if (operation == 'Add') {
                item.Action = "Add";
                item.DocumentType = "Profile Image";
                item.ItemId = 0;
                item.FileName = "sample.jpg";
                item.FileSize = item.imageSize;
                item.FileData = item.base64textString;
            } else { }
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_Security.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<?xml version='1.0' encoding='utf-8'?>" +
                "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                "<soapenv:Body><web:PersonalImage_Save>" +
                "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                "<web:Action>" + item.Action + "</web:Action><web:Content>" +
                "<web:DocumentType>" + item.DocumentType + "</web:DocumentType>" +
                "<web:ItemId>" + item.ItemId + "</web:ItemId>" +
                "<web:FileName>" + item.FileName + "</web:FileName>" +
                "<web:FileSize>" + item.FileSize + "</web:FileSize>" +
                "<web:FileData>" + item.FileData + "</web:FileData>" +
                "</web:Content><web:Demo/></web:PersonalImage_Save></soapenv:Body></soapenv:Envelope>"
            }).then((response) => {
                // console.log("response");
                // console.log(this.usrdata.ExternalMemberId+" == "+this.webapi.ExternalMemberId);
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    // console.log(response.content);
                    self.webapi.loader.hide();
                    if (result) {
                        let resp = result['soap:Envelope']['soap:Body'].PersonalImage_SaveResponse.PersonalImage_SaveResult;
                        if (resp.Successful == "true" && operation == "Add") {
                            self.imgdtls.result = true;
                        } else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                        setTimeout(() => {
                            self.imgdtls.result = false;
                        }, 4000);
                        let userData: any = JSON.parse(ApplicationSettings.getString("USER"));
                        userData.PictureData = item.FileData;
                        ApplicationSettings.setString("USER", JSON.stringify(userData));
                        self.getFamliMembers();
                    }
                });
            }, function (e) {
                self.webapi.loader.hide();
                // console.log("Error:... " + e);
            });
        }
    }
    toggle() {
        if (this.pharSearchTab)
            this.pharSearchTab = false;
        else
            this.pharSearchTab = true;
    }
    /* To get Family members data */
    getFamliMembers() {
        let self = this;
        self.webapi.personalAndLSSummary("FamilyMembers_Grid_Get").subscribe(data => {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_FamilyMembers_Grid.Successful == "true" && result.APIResult_FamilyMembers_Grid.FamilyMemberCount != '0') {
                    self.memlist = [];
                    let members = result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem;
                    if (members.length != undefined) {
                        for (let i = 0; i < members.length; i++) {
                            self.memlist.push(members[i]);
                        }
                    } else {
                        self.memlist.push(members);
                    }
                    ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
                    ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));
                } else if (result.APIResult_FamilyMembers_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                } else {
                    //console.log("error or no membrs list in my profile-->" + result.APIResult_FamilyMembers_Grid.Message);
                }
            });
            self.updateUserDetails();
        },
            error => {
                //console.log("Error in members list in my profile " + error);
            });
    }

    updateUserDetails() {
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            this.user.FirstName = this.personalInfo.FirstName != undefined && this.personalInfo.FirstName.length > 1 ? this.personalInfo.FirstName.charAt(0).toUpperCase() + this.personalInfo.FirstName.substr(1).toLowerCase() : this.personalInfo.FirstName;
            this.user.LastName = this.personalInfo.LastName != undefined && this.personalInfo.LastName.length > 1 ? this.personalInfo.LastName.charAt(0).toUpperCase() + this.personalInfo.LastName.substr(1).toLowerCase() : this.personalInfo.LastName;
            ApplicationSettings.setString("USER", JSON.stringify(this.user));
            this.loginDetailsShow();
        }
    }
    loginDetailsShow() {
        if (ApplicationSettings.hasKey("LOGIN_CRD")) {
            let loginCredentials: any = JSON.parse(ApplicationSettings.getString("LOGIN_CRD"));
            this.user.username = loginCredentials.username;
            if (ApplicationSettings.hasKey("USER")) {
                this.user.showPic = true; this.pic1 = null;
                let userData: any = JSON.parse(ApplicationSettings.getString("USER"));
                this.user.ExternalMemberId = userData.ExternalMemberId;
                this.user.pic2 = userData.PictureData;
            }
        }
    }
    
    toggleSearchItem(param) {
		if (param) {
			this.city = '';
			this.state = undefined;
		} else {
			this.zipcode = '';
		}
		this.pharCategory = !param;
	}

};