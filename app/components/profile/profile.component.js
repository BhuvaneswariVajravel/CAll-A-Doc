"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var radside_component_1 = require("../radside/radside.component");
var nativescript_google_maps_sdk_1 = require("nativescript-google-maps-sdk");
var nativescript_camera_1 = require("nativescript-camera");
var image_source_1 = require("tns-core-modules/image-source");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var ApplicationSettings = require("application-settings");
var xml2js = require('nativescript-xml2js');
var platformModule = require("platform");
var permissions = require("nativescript-permissions");
var http_request = require("http");
var ProfileComponent = (function () {
    function ProfileComponent(page, webapi) {
        this.page = page;
        this.webapi = webapi;
        this.mapView = null;
        this.pfEdit = false;
        this.billEdit = false;
        this.insurEdit = false;
        this.formSubmitted = false;
        this.billFormSubmit = false;
        this.authorize = false;
        this.insrFormSubmit = false;
        this.pic1 = null;
        this.memlist = [];
        this.user = {};
        this.usrdata = {};
        this.planInfo = {};
        this.insureInfo = {};
        this.gender = ["Male", "Female", "Unknown"];
        this.pharmacyList = [];
        this.pharmaciesAddr = [];
        this.placeG = [];
        this.centeredOnLocation = false;
        this.selectedPharmacy = {};
        this.pharSearchTab = true;
        this.personalInfo = {};
        this.carstates = new nativescript_drop_down_1.ValueList();
        this.prefPhar = {};
        this.billingInfo = {};
        this.years = [];
        this.months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        this.timezones = new nativescript_drop_down_1.ValueList();
        this.imgdtls = {};
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.pfClass = true;
        this.getStates();
        for (var i = 0; i < 12; i++) {
            this.years.push((new Date()).getFullYear() + i);
        }
    };
    ProfileComponent.prototype.ngAfterViewInit = function () {
        this.getPersonalData();
        this.timezones.push({ value: "2", display: "Atlantic (GMT-4:00)" }, { value: "3", display: "Eastern (GMT-5:00)" }, { value: "4", display: "Eastern (GMT-5:00) No DST Adjustment" }, { value: "5", display: "Central (GMT-6:00)" }, { value: "6", display: "Central (GMT-6:00) No DST Adjustment" }, { value: "7", display: "Mountain (GMT-7:00)" }, { value: "8", display: "Mountain (GMT-7:00) No DST Adjustment" }, { value: "9", display: "Pacific (GMT-8:00)" }, { value: "10", display: "Pacific (GMT-8:00) No DST Adjustment" }, { value: "11", display: "Alaska (GMT-9:00)" }, { value: "12", display: "Alaska (GMT-9:00) No DST Adjustment" }, { value: "13", display: "Hawaii (GMT-10:00)" }, { value: "14", display: "Hawaii (GMT-10:00) No DST Adjustment" });
        this.loginDetailsShow();
        if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
            var data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
            this.usrdata.GroupNumber = data.GroupNumber;
            this.usrdata.Key = data.Key;
            //   this.usrdata.ExternalMemberId = data.ExternalMemberId;
        }
        if (ApplicationSettings.hasKey("USER")) {
            var data = JSON.parse(ApplicationSettings.getString("USER"));
            this.usrdata.ExternalMemberId = data.ExternalMemberId;
            //  console.log("EX ID "+this.usrdata.ExternalMemberId);
        }
    };
    ProfileComponent.prototype.getStates = function () {
        var _this = this;
        this.webapi.getCodeList("USStates").subscribe(function (data) {
            var self = _this;
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_CodeList.Successful == "true") {
                    for (var l = 0; l < result.APIResult_CodeList.List.ItemCount; l++) {
                        self.carstates.push({ value: result.APIResult_CodeList.List.List.CodeListItem[l].ItemId, display: result.APIResult_CodeList.List.List.CodeListItem[l].Value });
                    }
                }
                else {
                    // console.log("Session expired profile in getting the states. ");
                }
            });
        }, function (error) {
            // console.log("Error in getting the states.. " + error);
        });
    };
    ProfileComponent.prototype.setStateForInsurance = function () {
        var slength = this.carstates.length;
        for (var s = 0; s < slength; s++) {
            if (this.carstates.getItem(s).value == this.insureInfo.CarrierState)
                this.insureInfo.stateIndx = s;
        }
    };
    ProfileComponent.prototype.setStateForContact = function () {
        var slength = this.carstates.length;
        for (var s = 0; s < slength; s++) {
            if (this.carstates.getItem(s).value == this.personalInfo.State)
                this.personalInfo.stateIndx = s;
        }
    };
    ProfileComponent.prototype.setBillingState = function () {
        var slength = this.carstates.length;
        for (var s = 0; s < slength; s++) {
            if (this.carstates.getItem(s).value == this.billingInfo.State)
                this.billingInfo.stateindx = s;
        }
    };
    ProfileComponent.prototype.setTimeZone = function () {
        for (var z = 0; z < this.timezones.length; z++) {
            if (this.timezones.getItem(z).value == this.personalInfo.TimeZoneId)
                this.personalInfo.timezoneid = z;
        }
    };
    ProfileComponent.prototype.getPersonalData = function () {
        if (this.webapi.netConnectivityCheck()) {
            var self_1 = this;
            self_1.webapi.getMemberInfo().subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.ServiceCallResult_MemberInfo.Successful == "true") {
                        self_1.personalInfo = result.ServiceCallResult_MemberInfo;
                        for (var i = 0; i < self_1.gender.length; i++) {
                            if (self_1.gender[i].indexOf(self_1.personalInfo.Gender) > -1)
                                self_1.personalInfo.genderIndx = i;
                        }
                        self_1.setStateForContact();
                        self_1.setTimeZone();
                        self_1.personalInfo.Phone = self_1.formatPhoneNumber(self_1.personalInfo.Phone);
                        self_1.personalInfo.Phone2 = self_1.formatPhoneNumber(self_1.personalInfo.Phone2);
                    }
                    else {
                        //console.log("Session expired or error in getting Personal Information...");
                    }
                });
            }, function (error) {
                // console.log("Error in Personal Info get.... " + error);
            });
        }
    };
    ProfileComponent.prototype.onTabChange = function (args) {
        var tabView = args.object;
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
        }
    };
    ProfileComponent.prototype.onCarStateChage = function (args) {
        this.insureInfo.CarrierState = this.carstates.getValue(args.selectedIndex);
    };
    ProfileComponent.prototype.onPersonalStateChage = function (args) {
        this.personalInfo.State = this.carstates.getValue(args.selectedIndex);
    };
    ProfileComponent.prototype.onStateChange = function (args) {
        this.state = this.carstates.getDisplay(args.selectedIndex);
    };
    ProfileComponent.prototype.onTimeZoneChange = function (args) {
        this.personalInfo.TimeZoneId = this.timezones.getValue(args.selectedIndex);
    };
    ProfileComponent.prototype.getBillingInfo = function () {
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.getBillingInfo().subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CCInfo.Successful == "true") {
                        self.billingInfo = result.APIResult_CCInfo;
                        self.billingInfo.monthindx = self.months.indexOf(self.billingInfo.ExpMonth);
                        self.billingInfo.yearindx = self.years.indexOf(new Date(self.billingInfo.ExpYear).getFullYear());
                        self.setBillingState();
                    }
                    else if (result.APIResult_CCInfo.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        // console.log("Session expired or error in getting billing data...");
                    }
                });
            }, function (error) {
                // console.log("Error in getting billing data.... " + error);
            });
        }
    };
    ProfileComponent.prototype.insuranceInfoGet = function () {
        if (this.webapi.netConnectivityCheck()) {
            var self_2 = this;
            self_2.webapi.getPlanInfo("InsuranceInfo_Get").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_InsuranceInfo.Successful == "true") {
                        self_2.insureInfo = result.APIResult_InsuranceInfo;
                        self_2.insureInfo.CarrierPhone = self_2.formatPhoneNumber(self_2.insureInfo.CarrierPhone);
                        self_2.setStateForInsurance();
                    }
                    else if (result.APIResult_InsuranceInfo.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self_2.webapi.logout();
                    }
                    else {
                        // console.log("Session expired or error in getting insure data..." + result.APIResult_InsuranceInfo.Message);
                    }
                });
            }, function (error) {
                //console.log("Error in Insurance get Info.... " + error);
            });
        }
    };
    ProfileComponent.prototype.getPlanInfo = function () {
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.getPlanInfo("PlanHistory_Get").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PlanHistory.Successful == "true") {
                        self.planInfo = result.APIResult_PlanHistory.PlanHistory.PlanHistory;
                    }
                    else if (result.APIResult_PlanHistory.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //console.log("Session expired or error in getting plan data..." + result.APIResult_PlanHistory.Message);
                    }
                });
            }, function (error) {
                //console.log("Error in Personal and Lifestyle.... " + error);
            });
        }
    };
    ProfileComponent.prototype.updateContactInfo = function (fname, lname, dob, addr1, city, zip, phone, email) {
        //console.log(fname + " " + lname + " " + dob + " " + addr1 + " --" + city + " " + zip + " " + phone + "  " + email);
        this.formSubmitted = true;
        this.personalInfo.Phone2error = false;
        var emailval = ((this.personalInfo.Email != undefined && this.personalInfo.Email.trim() != '') ? email : true);
        var phone2val = ((this.personalInfo.Phone2 != undefined && this.personalInfo.Phone2.trim() != '') ? this.isValidPhone(this.personalInfo.Phone2) : true);
        if (fname && lname && dob && addr1 && city && zip && phone && this.isValidPhone(this.personalInfo.Phone) && emailval && this.personalInfo.FirstName.trim() != '' && this.personalInfo.LastName.trim() != '' && this.personalInfo.Address1.trim() != '' && this.personalInfo.City.trim() != '' && phone2val && this.webapi.netConnectivityCheck()) {
            var self_3 = this;
            self_3.webapi.personalInfoSave(self_3.personalInfo).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    //console.log(JSON.stringify(result.ServiceCallResult));
                    if (result.ServiceCallResult.Successful == "true") {
                        self_3.pfEdit = false;
                        self_3.getFamliMembers();
                    }
                    else if (result.ServiceCallResult.Message.indexOf("phone 2") > -1) {
                        self_3.personalInfo.Phone2 = "";
                        self_3.personalInfo.Phone2error = true;
                    }
                    else if (result.ServiceCallResult.Message.indexOf("phone") > -1) {
                        self_3.personalInfo.Phone = "";
                    }
                    else if (result.ServiceCallResult.Message.indexOf("email") > -1) {
                        self_3.personalInfo.Email = "";
                    }
                    else if (result.ServiceCallResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self_3.webapi.logout();
                    }
                    else {
                        // console.log("Session expired in save Insurance data..." + result.ServiceCallResult.Message);
                    }
                });
            }, function (error) {
                //console.log("Error in Personal and Lifestyle.... " + error);
            });
        }
        else {
            this.focusContactInfoError(fname, lname, dob, addr1, city, zip, phone, email);
        }
    };
    ProfileComponent.prototype.updateBillInfo = function (cardno, name, addr, city, zip, phone) {
        this.billFormSubmit = true;
        // console.log(cardno + "---" + name + " -- " + addr + " -- " + city + "--" + zip + "--" + phone);
        if (cardno && name && addr && city && zip && phone && this.isValidPhone(this.billingInfo.Phone) && this.isValidCard() && this.authorize && this.billingInfo.NameOnCard.trim() != '' && this.billingInfo.Address1.trim() != '' && this.billingInfo.City.trim() != '' && this.webapi.netConnectivityCheck()) {
            var self_4 = this;
            self_4.webapi.saveBillingInfo(self_4.billingInfo).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    // console.log(JSON.stringify(result.APIResult));
                    if (result.APIResult.Successful == "true") {
                        self_4.billEdit = false;
                        self_4.insureInfo.invalph = false;
                    }
                    else if (result.APIResult.Message.indexOf("phone") > -1) {
                        self_4.billingInfo.Phone = "";
                    }
                    else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self_4.webapi.logout();
                    }
                    else {
                        //console.log("Session expired in save billing data..." + result.APIResult.Message);
                    }
                });
            }, function (error) {
                //console.log("Error in SAVE Billing Data.... " + error);
            });
        }
        else {
            this.focusBillInfoError(cardno, name, addr, city, zip, phone);
        }
    };
    ProfileComponent.prototype.updateInsuranceInfo = function (name, phone, id) {
        this.insrFormSubmit = true;
        if (name && phone && this.isValidNo(this.insureInfo.InsuranceMemberId) && this.isValidPhone(this.insureInfo.CarrierPhone) && this.insureInfo.CarrierName.trim() != '' && this.webapi.netConnectivityCheck()) {
            if (this.insureInfo.CarrierZip != null && this.insureInfo.CarrierZip != undefined && this.insureInfo.CarrierZip.trim() != '' && this.insureInfo.CarrierZip.length != 5) {
                this.insureInfo.invalzip = true;
                return;
            }
            var self_5 = this;
            self_5.insureInfo.invalzip = false;
            self_5.webapi.saveInsureInfo(self_5.insureInfo).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        self_5.insurEdit = false;
                    }
                    else if (result.APIResult.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self_5.webapi.logout();
                    }
                    else {
                        //console.log("Session expired in save Insurance data..." + result.APIResult.Message);
                    }
                });
            }, function (error) {
                //console.log("Error in Personal and Lifestyle.... " + error);
            });
            // console.log("Update Insure info");
        }
    };
    ProfileComponent.prototype.formatPhoneNumber = function (s) {
        var s2 = ("" + s).replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (m != null)
            return m[1] + "-" + m[2] + "-" + m[3];
    };
    ProfileComponent.prototype.focusContactInfoError = function (fname, lname, dob, addr1, city, zip, phone, email) {
        var name = true;
        switch (name || "") {
            case !fname || this.personalInfo.FirstName == undefined || this.personalInfo.FirstName.trim() == '':
                this.page.getViewById("firstName").focus();
                break;
            case !lname || this.personalInfo.LastName == undefined || this.personalInfo.LastName.trim() == '':
                this.page.getViewById("lastName").focus();
                break;
            case !dob || this.personalInfo.DOB == undefined || !this.isValidDate():
                this.page.getViewById("dob").focus();
                break;
            case !addr1 || this.personalInfo.Address1 == undefined || this.personalInfo.Address1.trim() == '':
                this.page.getViewById("addr1").focus();
                break;
            case !city || this.personalInfo.City == undefined || this.personalInfo.City.trim() == '':
                this.page.getViewById("city").focus();
                break;
            case !zip || this.personalInfo.Zip == undefined:
                this.page.getViewById("zip").focus();
                break;
            case !phone || this.personalInfo.Phone == undefined || !this.isValidPhone(this.personalInfo.Phone):
                this.page.getViewById("phone").focus();
                break;
            case this.personalInfo.Email != undefined && this.personalInfo.Email.trim() != '' && !email:
                this.page.getViewById("email").focus();
                break;
            case this.personalInfo.Phone2 != undefined && this.personalInfo.Phone2.trim() != '' && !this.isValidPhone(this.personalInfo.Phone2):
                this.page.getViewById("phone2").focus();
                break;
            default:
        }
    };
    ProfileComponent.prototype.focusBillInfoError = function (cardno, name, addr, city, zip, phone) {
        switch (true || "") {
            case !cardno || this.billingInfo.CardNumber == undefined || !this.isValidCard():
                this.page.getViewById("cardno").focus();
                break;
            case !name || this.billingInfo.NameOnCard == undefined || this.billingInfo.NameOnCard.trim() == '':
                this.page.getViewById("cardname").focus();
                break;
            case !addr || this.billingInfo.Address1 == undefined || this.billingInfo.Address1.trim() == '':
                this.page.getViewById("billingaddr").focus();
                break;
            case !city || this.billingInfo.City == undefined || this.billingInfo.City.trim() == '':
                this.page.getViewById("billingcity").focus();
                break;
            case !zip || this.billingInfo.Zip == undefined:
                this.page.getViewById("billingzip").focus();
                break;
            case !phone || this.billingInfo.Phone == undefined || !this.isValidPhone(this.billingInfo.Phone):
                this.page.getViewById("billingphone").focus();
                break;
            default:
        }
    };
    ProfileComponent.prototype.onMonthChange = function (args) {
        this.billingInfo.month = this.months[args.value];
    };
    ProfileComponent.prototype.onYearChange = function (args) {
        this.billingInfo.year = this.years[args.value];
    };
    ProfileComponent.prototype.onBSTChange = function (args) {
        this.billingInfo.state = this.carstates.getValue(args.selectedIndex);
    };
    ProfileComponent.prototype.isValidCard = function () {
        //return /^([0-9*-]{13})$/.test(this.billingInfo.CardNumber);
        return /^(^[0-9\-\*]{17})$/.test(this.billingInfo.CardNumber);
    };
    ProfileComponent.prototype.isValidDate = function () {
        var date = this.personalInfo.DOB;
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
    ProfileComponent.prototype.onMapReady = function (event) {
        if (this.mapView || !event.object)
            return;
        this.mapView = event.object;
        this.mapView.latitude = 36.778259;
        this.mapView.longitude = -119.417931;
        this.mapView.zoom = 2;
    };
    ;
    ProfileComponent.prototype.searchPharmacy = function (pvalue, zvalue) {
        this.formSubmitted = true;
        var self = this;
        if (pvalue && self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            self.pharmacyList = [];
            this.webapi.pharmacySearch(this.pharname != undefined ? this.pharname : "", this.zipcode != undefined ? this.zipcode : "", this.state != undefined ? this.state : "", this.city != undefined ? this.city : "").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PharmacyList.Successful == "true" && result.APIResult_PharmacyList.PharmacyListCount != "0") {
                        var list = result.APIResult_PharmacyList.PharmacyList.PharmacyItem;
                        if (list.length != undefined) {
                            self.pharSearchTab = false;
                            self.pharmaciesAddr = [];
                            for (var i = 0; i < list.length; i++) {
                                list[i].MemberDefaultPharmacy = false;
                                self.pharmacyList.push(list[i]);
                                self.pharmaciesAddr.push(list[i].PharmacyAddress1 + " " + list[i].PharmacyCity + ", " + list[i].PharmacyState + " " + list[i].PharmacyZip);
                            }
                        }
                        else {
                            self.pharSearchTab = false;
                            self.pharmacyList.push(list);
                            self.pharmaciesAddr.push(list.PharmacyAddress1 + " " + list.PharmacyCity + ", " + list.PharmacyState + " " + list.PharmacyZip);
                        }
                        self.searchPharmacyToPlaceMarkers(self.pharmaciesAddr);
                        self.webapi.loader.hide();
                    }
                    else if (result.APIResult_PharmacyList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        self.webapi.loader.hide();
                        //console.log("No pharmacies found / Session expired / error in search pharmacy");
                    }
                });
            }, function (error) {
                self.webapi.loader.hide();
                //console.log("Error in Pharmacy Search.. " + error);
            });
        }
    };
    ProfileComponent.prototype.searchPharmacyToPlaceMarkers = function (pharAddrs) {
        var self = this;
        var searchField = "";
        for (var i = 0; i < pharAddrs.length; i++) {
            searchField = "";
            searchField = pharAddrs[i].split(' ').join('%20');
            this.webapi.getPlaces(searchField).subscribe(function (data) {
                //console.log(JSON.stringify(data));
                self.placeG = JSON.parse(JSON.stringify(data)).results;
                var marker = new nativescript_google_maps_sdk_1.Marker();
                marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(self.placeG[0].geometry.location.lat, self.placeG[0].geometry.location.lng);
                marker.title = self.placeG[0].name;
                marker.snippet = self.placeG[0].formatted_address;
                self.mapView.addMarker(marker);
                //self.mapView.zoom = 100;
                self.centeredOnLocation = true;
                //console.log("Marker added........");
            }, function (error) {
                //console.log(error);
            });
        }
    };
    ProfileComponent.prototype.onMarkerSelect = function (event) {
        for (var i = 0; i < this.pharmacyList.length; i++) {
            if (this.pharmacyList[i].PharmacyAddress1.toUpperCase() == event.marker.title.toUpperCase()) {
                this.setAsPreferredPharmacy(i);
                this.pharmacyList.splice(0, 0, this.pharmacyList.splice(i, 1)[0]);
            }
        }
    };
    ProfileComponent.prototype.setAsPreferredPharmacy = function (index) {
        for (var i = 0; i < this.pharmacyList.length; i++) {
            if (i == index) {
                this.pharmacyList[index].MemberDefaultPharmacy = !this.pharmacyList[index].MemberDefaultPharmacy;
                if (this.pharmacyList[index].MemberDefaultPharmacy) {
                    this.selectedPharmacy = this.pharmacyList[index];
                }
                else {
                    this.selectedPharmacy = {};
                }
            }
            else {
                this.pharmacyList[i].MemberDefaultPharmacy = false;
            }
        }
    };
    ProfileComponent.prototype.preferredPharList = function () {
        var _this = this;
        this.webapi.getMembersPreferredPharmacy_http().subscribe(function (data) {
            var self = _this;
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_PreferredPharmacy.Successful == "true" && result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId != "0") {
                    self.prefPhar = result.APIResult_PreferredPharmacy.PreferredPharmacy;
                    self.pharmaciesAddr.push(self.prefPhar.PharmacyAddress1 + " " + self.prefPhar.PharmacyCity + ", " + self.prefPhar.PharmacyState + " " + self.prefPhar.PharmacyZip);
                    self.searchPharmacyToPlaceMarkers(self.pharmaciesAddr);
                }
                else if (result.APIResult_PreferredPharmacy.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                }
                else {
                    //console.log("Error/No Data in getting preferred pharmacy ");
                }
            });
        }, function (error) {
            // console.log("Error in getting preferred pharmacy.. " + error);
        });
    };
    ProfileComponent.prototype.updatePreferredPhar = function () {
        var _this = this;
        this.page.getViewById("scrollid").scrollToVerticalOffset(0, false);
        this.selectedPharmacy.submitted = true;
        if (this.selectedPharmacy.PharmacyId != null && this.selectedPharmacy.PharmacyId != undefined && this.webapi.netConnectivityCheck()) {
            this.webapi.savePrefPhar(this.selectedPharmacy).subscribe(function (data) {
                var self = _this;
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PreferredPharmacy.Successful == "true" && result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId != "0") {
                        self.prefPhar = result.APIResult_PreferredPharmacy.PreferredPharmacy;
                        self.selectedPharmacy.error = false;
                        setTimeout(function () {
                            self.selectedPharmacy.error = true;
                        }, 5000);
                    }
                    else if (result.APIResult_PreferredPharmacy.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        // console.log("Error in getting preferred pharmacy ");
                    }
                });
            }, function (error) {
                // console.log("Error in getting preferred pharmacy.. " + error);
            });
        }
    };
    ProfileComponent.prototype.mapInGoogle = function (item) {
        this.page.getViewById("scrollid").scrollToVerticalOffset(0, false);
        var markPhar = [];
        markPhar.push(item.PharmacyAddress1 + " " + item.PharmacyCity + ", " + item.PharmacyState + " " + item.PharmacyZip);
        var self = this;
        var searchField = "";
        for (var i = 0; i < markPhar.length; i++) {
            searchField = "";
            searchField = markPhar[i].split(' ').join('%20');
            this.webapi.getPlaces(searchField).subscribe(function (data) {
                self.placeG = JSON.parse(JSON.stringify(data)).results;
                var marker = new nativescript_google_maps_sdk_1.Marker();
                marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(self.placeG[0].geometry.location.lat, self.placeG[0].geometry.location.lng);
                marker.title = self.placeG[0].name;
                marker.snippet = self.placeG[0].formatted_address;
                self.mapView.addMarker(marker);
                self.mapView.latitude = self.placeG[0].geometry.location.lat;
                self.mapView.longitude = self.placeG[0].geometry.location.lng;
                self.mapView.zoom = 16;
                self.centeredOnLocation = true;
                //console.log("Marker added. and Zoomed.......");
            }, function (error) {
                //console.log(error);
            });
        }
        //this.searchPharmacyToPlaceMarkers(markPhar.push(item.PharmacyAddress1 + " " + item.PharmacyCity + ", " + item.PharmacyState + " " +item.PharmacyZip));
    };
    ProfileComponent.prototype.personalInfoEdit = function () {
        this.pfEdit = true;
    };
    ProfileComponent.prototype.billingInfoEdit = function () {
        this.billEdit = true;
    };
    ProfileComponent.prototype.insureInfoEdit = function () {
        this.insurEdit = true;
    };
    ProfileComponent.prototype.isValidPhone = function (phoneno) {
        return /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(phoneno);
    };
    ProfileComponent.prototype.isAuthorize = function () {
        this.authorize = !this.authorize;
    };
    ProfileComponent.prototype.isValidNo = function (num) {
        return /^\d+$/.test(num);
    };
    ProfileComponent.prototype.onRequestPermissionsTap = function () {
        var _this = this;
        this.pic1 = null;
        this.imgdtls = {};
        if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
            permissions.requestPermission(android.Manifest.permission.CAMERA, "I need these permissions to read from storage")
                .then(function () {
                // console.log("Permissions granted!");
                _this.onTakePictureTap();
            })
                .catch(function () {
                //console.log("Uh oh, no permissions - plan B time!");
                alert("You don't have permission to access the camera");
            });
        }
        else {
            this.onTakePictureTap();
        }
    };
    ProfileComponent.prototype.onTakePictureTap = function () {
        var _that = this;
        this.user.showPic = true;
        nativescript_camera_1.takePicture({ width: 180, height: 180, keepAspectRatio: false, saveToGallery: true })
            .then(function (imageAsset) {
            var source = new image_source_1.ImageSource();
            source.fromAsset(imageAsset).then(function (source) {
                //  console.log(`Size: ${source.width}x${source.height}`);
                _that.user.showPic = false;
                _that.imgdtls.imageName = "sample.jpg";
                _that.imgdtls.base64textString = source.toBase64String("jpg", 10);
                _that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
                setTimeout(function () {
                    _that.savePersonalImage(_that.imgdtls, "Add");
                }, 500);
            });
            _that.cameraImage = imageAsset;
            if (_that.pic1 == null) {
                _that.pic1 = imageAsset;
            }
        }, function (error) {
            // console.log("Error: " + error);
        });
    };
    ProfileComponent.prototype.savePersonalImage = function (item, operation) {
        if (this.webapi.netConnectivityCheck()) {
            var self_6 = this;
            self_6.webapi.loader.show(self_6.webapi.options);
            if (operation == 'Add') {
                item.Action = "Add";
                item.DocumentType = "Profile Image";
                item.ItemId = 0;
                item.FileName = "sample.jpg";
                item.FileSize = item.imageSize;
                item.FileData = item.base64textString;
            }
            else { }
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
            }).then(function (response) {
                // console.log("response");
                // console.log(this.usrdata.ExternalMemberId+" == "+this.webapi.ExternalMemberId);
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    // console.log(response.content);
                    self_6.webapi.loader.hide();
                    if (result) {
                        var resp = result['soap:Envelope']['soap:Body'].PersonalImage_SaveResponse.PersonalImage_SaveResult;
                        if (resp.Successful == "true" && operation == "Add") {
                            self_6.imgdtls.result = true;
                        }
                        else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self_6.webapi.logout();
                        }
                        setTimeout(function () {
                            self_6.imgdtls.result = false;
                        }, 4000);
                        var userData = JSON.parse(ApplicationSettings.getString("USER"));
                        userData.PictureData = item.FileData;
                        ApplicationSettings.setString("USER", JSON.stringify(userData));
                        self_6.getFamliMembers();
                    }
                });
            }, function (e) {
                self_6.webapi.loader.hide();
                // console.log("Error:... " + e);
            });
        }
    };
    ProfileComponent.prototype.toggle = function () {
        if (this.pharSearchTab)
            this.pharSearchTab = false;
        else
            this.pharSearchTab = true;
    };
    ProfileComponent.prototype.getFamliMembers = function () {
        var self = this;
        self.webapi.personalAndLSSummary("FamilyMembers_Grid_Get").subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
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
                    ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
                    ApplicationSettings.setString("FAMILY_MEMBER_DETAILS", JSON.stringify(self.memlist));
                }
                else if (result.APIResult_FamilyMembers_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                }
                else {
                    //console.log("error or no membrs list in my profile-->" + result.APIResult_FamilyMembers_Grid.Message);
                }
            });
            self.updateUserDetails();
        }, function (error) {
            //console.log("Error in members list in my profile " + error);
        });
    };
    ProfileComponent.prototype.updateUserDetails = function () {
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            this.user.FirstName = this.personalInfo.FirstName != undefined && this.personalInfo.FirstName.length > 1 ? this.personalInfo.FirstName.charAt(0).toUpperCase() + this.personalInfo.FirstName.substr(1).toLowerCase() : this.personalInfo.FirstName;
            this.user.LastName = this.personalInfo.LastName != undefined && this.personalInfo.LastName.length > 1 ? this.personalInfo.LastName.charAt(0).toUpperCase() + this.personalInfo.LastName.substr(1).toLowerCase() : this.personalInfo.LastName;
            ApplicationSettings.setString("USER", JSON.stringify(this.user));
            this.loginDetailsShow();
        }
    };
    ProfileComponent.prototype.loginDetailsShow = function () {
        if (ApplicationSettings.hasKey("LOGIN_CRD")) {
            var loginCredentials = JSON.parse(ApplicationSettings.getString("LOGIN_CRD"));
            this.user.username = loginCredentials.username;
            if (ApplicationSettings.hasKey("USER")) {
                this.user.showPic = true;
                this.pic1 = null;
                var userData = JSON.parse(ApplicationSettings.getString("USER"));
                this.user.ExternalMemberId = userData.ExternalMemberId;
                this.user.pic2 = userData.PictureData;
            }
        }
    };
    return ProfileComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], ProfileComponent.prototype, "radSideComponent", void 0);
ProfileComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./profile.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService])
], ProfileComponent);
exports.ProfileComponent = ProfileComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9maWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCxnQ0FBK0I7QUFDL0IseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSxrRUFBZ0U7QUFDaEUsNkVBQXlFO0FBRXpFLDJEQUFrRDtBQUVsRCw4REFBNEQ7QUFFNUQsaUVBQW1EO0FBRW5ELDBEQUE0RDtBQUM1RCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM1QyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDekMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDdEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBUW5DLElBQWEsZ0JBQWdCO0lBV3pCLDBCQUFvQixJQUFVLEVBQVUsTUFBcUI7UUFBekMsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFWN0QsWUFBTyxHQUFRLElBQUksQ0FBQztRQUFDLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFBQyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBQUMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUVwRyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUFDLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQUMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMxRSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUFDLFNBQUksR0FBUSxJQUFJLENBQUM7UUFBQyxZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQUMsU0FBSSxHQUFRLEVBQUUsQ0FBQztRQUFDLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFDL0YsYUFBUSxHQUFRLEVBQUUsQ0FBQztRQUFDLGVBQVUsR0FBUSxFQUFFLENBQUM7UUFBQyxXQUFN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QUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQzNDLElBQUksUUFBUSxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDO2dCQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQzFDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVMLHVCQUFDO0FBQUQsQ0FBQyxBQXJ0QkQsSUFxdEJDO0FBbnRCZ0M7SUFBNUIsZ0JBQVMsQ0FBQyxvQ0FBZ0IsQ0FBQzs4QkFBMEIsb0NBQWdCOzBEQUFDO0FBRjlELGdCQUFnQjtJQUw1QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSwwQkFBMEI7UUFDdkMsU0FBUyxFQUFFLENBQUMsK0JBQWEsRUFBRSw2QkFBYSxDQUFDO0tBQzVDLENBQUM7cUNBWTRCLFdBQUksRUFBa0IsK0JBQWE7R0FYcEQsZ0JBQWdCLENBcXRCNUI7QUFydEJZLDRDQUFnQjtBQXF0QjVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgV2ViQVBJU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvd2ViLWFwaS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFJhZFNpZGVDb21wb25lbnQgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTWFwVmlldywgTWFya2VyLCBQb3NpdGlvbiB9IGZyb20gJ25hdGl2ZXNjcmlwdC1nb29nbGUtbWFwcy1zZGsnO1xuaW1wb3J0IHsgVGV4dEZpZWxkIH0gZnJvbSBcInVpL3RleHQtZmllbGRcIjtcbmltcG9ydCB7IHRha2VQaWN0dXJlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWNhbWVyYSc7XG5pbXBvcnQgeyBJbWFnZUFzc2V0IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9pbWFnZS1hc3NldCc7XG5pbXBvcnQgeyBJbWFnZVNvdXJjZSB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvaW1hZ2Utc291cmNlJztcbmltcG9ydCB7IFRhYlZpZXcgfSBmcm9tIFwidWkvdGFiLXZpZXdcIjtcbmltcG9ydCB7IFZhbHVlTGlzdCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XG5pbXBvcnQgeyBTY3JvbGxWaWV3IH0gZnJvbSBcInVpL3Njcm9sbC12aWV3XCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcbmxldCBwbGF0Zm9ybU1vZHVsZSA9IHJlcXVpcmUoXCJwbGF0Zm9ybVwiKTtcbmxldCBwZXJtaXNzaW9ucyA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIik7XG5sZXQgaHR0cF9yZXF1ZXN0ID0gcmVxdWlyZShcImh0dHBcIik7XG5kZWNsYXJlIGxldCBhbmRyb2lkOiBhbnk7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9wcm9maWxlLmNvbXBvbmVudC5odG1sXCIsXG4gICAgcHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgUHJvZmlsZUNvbXBvbmVudCB7XG4gICAgbWFwVmlldzogYW55ID0gbnVsbDsgcGZFZGl0OiBib29sZWFuID0gZmFsc2U7IGJpbGxFZGl0OiBib29sZWFuID0gZmFsc2U7IGluc3VyRWRpdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcHVibGljIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG4gICAgZm9ybVN1Ym1pdHRlZCA9IGZhbHNlOyBiaWxsRm9ybVN1Ym1pdCA9IGZhbHNlOyBhdXRob3JpemU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpbnNyRm9ybVN1Ym1pdCA9IGZhbHNlOyBwaWMxOiBhbnkgPSBudWxsOyBtZW1saXN0OiBhbnkgPSBbXTsgdXNlcjogYW55ID0ge307IHVzcmRhdGE6IGFueSA9IHt9O1xuICAgIHBsYW5JbmZvOiBhbnkgPSB7fTsgaW5zdXJlSW5mbzogYW55ID0ge307IGdlbmRlciA9IFtcIk1hbGVcIiwgXCJGZW1hbGVcIiwgXCJVbmtub3duXCJdO1xuICAgIHBoYXJtYWN5TGlzdDogYW55ID0gW107IHBoYXJtYWNpZXNBZGRyOiBhbnkgPSBbXTsgcGxhY2VHOiBhbnkgPSBbXTsgemlwY29kZTogc3RyaW5nOyBjaXR5OiBzdHJpbmc7XG4gICAgcGhhcm5hbWU6IHN0cmluZzsgc3RhdGU6IHN0cmluZzsgY2VudGVyZWRPbkxvY2F0aW9uOiBib29sZWFuID0gZmFsc2U7IHNlbGVjdGVkUGhhcm1hY3k6IGFueSA9IHt9OyBwaGFyU2VhcmNoVGFiOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwZXJzb25hbEluZm86IGFueSA9IHt9OyBjYXJzdGF0ZXMgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTsgcHJlZlBoYXI6IGFueSA9IHt9OyBiaWxsaW5nSW5mbzogYW55ID0ge307IHllYXJzOiBhbnkgPSBbXTtcbiAgICBtb250aHM6IGFueSA9IFtcIjAxXCIsIFwiMDJcIiwgXCIwM1wiLCBcIjA0XCIsIFwiMDVcIiwgXCIwNlwiLCBcIjA3XCIsIFwiMDhcIiwgXCIwOVwiLCBcIjEwXCIsIFwiMTFcIiwgXCIxMlwiXTtcbiAgICB0aW1lem9uZXMgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKVxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UpIHsgfVxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTsgdGhpcy5yYWRTaWRlQ29tcG9uZW50LnBmQ2xhc3MgPSB0cnVlO1xuICAgICAgICB0aGlzLmdldFN0YXRlcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMueWVhcnMucHVzaCgobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSArIGkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5nZXRQZXJzb25hbERhdGEoKTtcbiAgICAgICAgdGhpcy50aW1lem9uZXMucHVzaCh7IHZhbHVlOiBcIjJcIiwgZGlzcGxheTogXCJBdGxhbnRpYyAoR01ULTQ6MDApXCIgfSxcbiAgICAgICAgICAgIHsgdmFsdWU6IFwiM1wiLCBkaXNwbGF5OiBcIkVhc3Rlcm4gKEdNVC01OjAwKVwiIH0sXG4gICAgICAgICAgICB7IHZhbHVlOiBcIjRcIiwgZGlzcGxheTogXCJFYXN0ZXJuIChHTVQtNTowMCkgTm8gRFNUIEFkanVzdG1lbnRcIiB9LFxuICAgICAgICAgICAgeyB2YWx1ZTogXCI1XCIsIGRpc3BsYXk6IFwiQ2VudHJhbCAoR01ULTY6MDApXCIgfSxcbiAgICAgICAgICAgIHsgdmFsdWU6IFwiNlwiLCBkaXNwbGF5OiBcIkNlbnRyYWwgKEdNVC02OjAwKSBObyBEU1QgQWRqdXN0bWVudFwiIH0sXG4gICAgICAgICAgICB7IHZhbHVlOiBcIjdcIiwgZGlzcGxheTogXCJNb3VudGFpbiAoR01ULTc6MDApXCIgfSxcbiAgICAgICAgICAgIHsgdmFsdWU6IFwiOFwiLCBkaXNwbGF5OiBcIk1vdW50YWluIChHTVQtNzowMCkgTm8gRFNUIEFkanVzdG1lbnRcIiB9LFxuICAgICAgICAgICAgeyB2YWx1ZTogXCI5XCIsIGRpc3BsYXk6IFwiUGFjaWZpYyAoR01ULTg6MDApXCIgfSxcbiAgICAgICAgICAgIHsgdmFsdWU6IFwiMTBcIiwgZGlzcGxheTogXCJQYWNpZmljIChHTVQtODowMCkgTm8gRFNUIEFkanVzdG1lbnRcIiB9LFxuICAgICAgICAgICAgeyB2YWx1ZTogXCIxMVwiLCBkaXNwbGF5OiBcIkFsYXNrYSAoR01ULTk6MDApXCIgfSxcbiAgICAgICAgICAgIHsgdmFsdWU6IFwiMTJcIiwgZGlzcGxheTogXCJBbGFza2EgKEdNVC05OjAwKSBObyBEU1QgQWRqdXN0bWVudFwiIH0sXG4gICAgICAgICAgICB7IHZhbHVlOiBcIjEzXCIsIGRpc3BsYXk6IFwiSGF3YWlpIChHTVQtMTA6MDApXCIgfSxcbiAgICAgICAgICAgIHsgdmFsdWU6IFwiMTRcIiwgZGlzcGxheTogXCJIYXdhaWkgKEdNVC0xMDowMCkgTm8gRFNUIEFkanVzdG1lbnRcIiB9KTtcbiAgICAgICAgdGhpcy5sb2dpbkRldGFpbHNTaG93KCk7XG4gICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJfREVGQVVMVFNcIikpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJfREVGQVVMVFNcIikpO1xuICAgICAgICAgICAgdGhpcy51c3JkYXRhLkdyb3VwTnVtYmVyID0gZGF0YS5Hcm91cE51bWJlcjtcbiAgICAgICAgICAgIHRoaXMudXNyZGF0YS5LZXkgPSBkYXRhLktleTtcbiAgICAgICAgICAgIC8vICAgdGhpcy51c3JkYXRhLkV4dGVybmFsTWVtYmVySWQgPSBkYXRhLkV4dGVybmFsTWVtYmVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSk7XG4gICAgICAgICAgICB0aGlzLnVzcmRhdGEuRXh0ZXJuYWxNZW1iZXJJZCA9IGRhdGEuRXh0ZXJuYWxNZW1iZXJJZDtcbiAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIkVYIElEIFwiK3RoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRTdGF0ZXMoKSB7XG4gICAgICAgIHRoaXMud2ViYXBpLmdldENvZGVMaXN0KFwiVVNTdGF0ZXNcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuTGlzdC5JdGVtQ291bnQ7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jYXJzdGF0ZXMucHVzaCh7IHZhbHVlOiByZXN1bHQuQVBJUmVzdWx0X0NvZGVMaXN0Lkxpc3QuTGlzdC5Db2RlTGlzdEl0ZW1bbF0uSXRlbUlkLCBkaXNwbGF5OiByZXN1bHQuQVBJUmVzdWx0X0NvZGVMaXN0Lkxpc3QuTGlzdC5Db2RlTGlzdEl0ZW1bbF0uVmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIHByb2ZpbGUgaW4gZ2V0dGluZyB0aGUgc3RhdGVzLiBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgdGhlIHN0YXRlcy4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldFN0YXRlRm9ySW5zdXJhbmNlKCkge1xuICAgICAgICBsZXQgc2xlbmd0aCA9IHRoaXMuY2Fyc3RhdGVzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgcyA9IDA7IHMgPCBzbGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhcnN0YXRlcy5nZXRJdGVtKHMpLnZhbHVlID09IHRoaXMuaW5zdXJlSW5mby5DYXJyaWVyU3RhdGUpXG4gICAgICAgICAgICAgICAgdGhpcy5pbnN1cmVJbmZvLnN0YXRlSW5keCA9IHM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0U3RhdGVGb3JDb250YWN0KCkge1xuICAgICAgICBsZXQgc2xlbmd0aCA9IHRoaXMuY2Fyc3RhdGVzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgcyA9IDA7IHMgPCBzbGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhcnN0YXRlcy5nZXRJdGVtKHMpLnZhbHVlID09IHRoaXMucGVyc29uYWxJbmZvLlN0YXRlKVxuICAgICAgICAgICAgICAgIHRoaXMucGVyc29uYWxJbmZvLnN0YXRlSW5keCA9IHM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0QmlsbGluZ1N0YXRlKCkge1xuICAgICAgICBsZXQgc2xlbmd0aCA9IHRoaXMuY2Fyc3RhdGVzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgcyA9IDA7IHMgPCBzbGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhcnN0YXRlcy5nZXRJdGVtKHMpLnZhbHVlID09IHRoaXMuYmlsbGluZ0luZm8uU3RhdGUpXG4gICAgICAgICAgICAgICAgdGhpcy5iaWxsaW5nSW5mby5zdGF0ZWluZHggPSBzO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVab25lKCkge1xuICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IHRoaXMudGltZXpvbmVzLmxlbmd0aDsgeisrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50aW1lem9uZXMuZ2V0SXRlbSh6KS52YWx1ZSA9PSB0aGlzLnBlcnNvbmFsSW5mby5UaW1lWm9uZUlkKVxuICAgICAgICAgICAgICAgIHRoaXMucGVyc29uYWxJbmZvLnRpbWV6b25laWQgPSB6O1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldFBlcnNvbmFsRGF0YSgpIHtcbiAgICAgICAgaWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLmdldE1lbWJlckluZm8oKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBlcnNvbmFsSW5mbyA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxmLmdlbmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmdlbmRlcltpXS5pbmRleE9mKHNlbGYucGVyc29uYWxJbmZvLkdlbmRlcikgPiAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wZXJzb25hbEluZm8uZ2VuZGVySW5keCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlRm9yQ29udGFjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRUaW1lWm9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wZXJzb25hbEluZm8uUGhvbmUgPSBzZWxmLmZvcm1hdFBob25lTnVtYmVyKHNlbGYucGVyc29uYWxJbmZvLlBob25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGVyc29uYWxJbmZvLlBob25lMiA9IHNlbGYuZm9ybWF0UGhvbmVOdW1iZXIoc2VsZi5wZXJzb25hbEluZm8uUGhvbmUyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgb3IgZXJyb3IgaW4gZ2V0dGluZyBQZXJzb25hbCBJbmZvcm1hdGlvbi4uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnJvciBpbiBQZXJzb25hbCBJbmZvIGdldC4uLi4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRhYkNoYW5nZShhcmdzKSB7XG4gICAgICAgIGxldCB0YWJWaWV3ID0gPFRhYlZpZXc+YXJncy5vYmplY3Q7XG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSB0YWJWaWV3LnNlbGVjdGVkSW5kZXggPT0gMSAmJiB0aGlzLmJpbGxpbmdJbmZvLk5hbWVPbkNhcmQgPT0gdW5kZWZpbmVkOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmlsbGluZ0luZm8oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGFiVmlldy5zZWxlY3RlZEluZGV4ID09IDIgJiYgdGhpcy5pbnN1cmVJbmZvLkNhcnJpZXJOYW1lID09IHVuZGVmaW5lZDpcbiAgICAgICAgICAgICAgICB0aGlzLmluc3VyYW5jZUluZm9HZXQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGFiVmlldy5zZWxlY3RlZEluZGV4ID09IDMgJiYgdGhpcy5wcmVmUGhhci5QaGFybWFjeU5hbWUgPT0gdW5kZWZpbmVkOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlZmVycmVkUGhhckxpc3QoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGFiVmlldy5zZWxlY3RlZEluZGV4ID09IDQgJiYgdGhpcy5wbGFuSW5mby5QbGFuSWQgPT0gdW5kZWZpbmVkOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGxhbkluZm8oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGFiVmlldy5zZWxlY3RlZEluZGV4ID09IDU6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJOb3RoaW5nLiBpbiBQcm9maWxlLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkNhclN0YXRlQ2hhZ2UoYXJncykge1xuICAgICAgICB0aGlzLmluc3VyZUluZm8uQ2FycmllclN0YXRlID0gdGhpcy5jYXJzdGF0ZXMuZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcbiAgICB9XG4gICAgb25QZXJzb25hbFN0YXRlQ2hhZ2UoYXJncykge1xuICAgICAgICB0aGlzLnBlcnNvbmFsSW5mby5TdGF0ZSA9IHRoaXMuY2Fyc3RhdGVzLmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG4gICAgfVxuICAgIG9uU3RhdGVDaGFuZ2UoYXJncykge1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5jYXJzdGF0ZXMuZ2V0RGlzcGxheShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuICAgIH1cbiAgICBvblRpbWVab25lQ2hhbmdlKGFyZ3MpIHtcbiAgICAgICAgdGhpcy5wZXJzb25hbEluZm8uVGltZVpvbmVJZCA9IHRoaXMudGltZXpvbmVzLmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG4gICAgfVxuICAgIGdldEJpbGxpbmdJbmZvKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5nZXRCaWxsaW5nSW5mbygpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfQ0NJbmZvLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYmlsbGluZ0luZm8gPSByZXN1bHQuQVBJUmVzdWx0X0NDSW5mbztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYmlsbGluZ0luZm8ubW9udGhpbmR4ID0gc2VsZi5tb250aHMuaW5kZXhPZihzZWxmLmJpbGxpbmdJbmZvLkV4cE1vbnRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYmlsbGluZ0luZm8ueWVhcmluZHggPSBzZWxmLnllYXJzLmluZGV4T2YobmV3IERhdGUoc2VsZi5iaWxsaW5nSW5mby5FeHBZZWFyKS5nZXRGdWxsWWVhcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0QmlsbGluZ1N0YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdF9DQ0luZm8uTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIGVycm9yIGluIGdldHRpbmcgYmlsbGluZyBkYXRhLi4uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgYmlsbGluZyBkYXRhLi4uLiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluc3VyYW5jZUluZm9HZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5nZXRQbGFuSW5mbyhcIkluc3VyYW5jZUluZm9fR2V0XCIpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfSW5zdXJhbmNlSW5mby5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmluc3VyZUluZm8gPSByZXN1bHQuQVBJUmVzdWx0X0luc3VyYW5jZUluZm87XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmluc3VyZUluZm8uQ2FycmllclBob25lID0gc2VsZi5mb3JtYXRQaG9uZU51bWJlcihzZWxmLmluc3VyZUluZm8uQ2FycmllclBob25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0U3RhdGVGb3JJbnN1cmFuY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0X0luc3VyYW5jZUluZm8uTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIGVycm9yIGluIGdldHRpbmcgaW5zdXJlIGRhdGEuLi5cIiArIHJlc3VsdC5BUElSZXN1bHRfSW5zdXJhbmNlSW5mby5NZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBJbnN1cmFuY2UgZ2V0IEluZm8uLi4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldFBsYW5JbmZvKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5nZXRQbGFuSW5mbyhcIlBsYW5IaXN0b3J5X0dldFwiKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X1BsYW5IaXN0b3J5LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxhbkluZm8gPSByZXN1bHQuQVBJUmVzdWx0X1BsYW5IaXN0b3J5LlBsYW5IaXN0b3J5LlBsYW5IaXN0b3J5O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfUGxhbkhpc3RvcnkuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIGVycm9yIGluIGdldHRpbmcgcGxhbiBkYXRhLi4uXCIgKyByZXN1bHQuQVBJUmVzdWx0X1BsYW5IaXN0b3J5Lk1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVycm9yIGluIFBlcnNvbmFsIGFuZCBMaWZlc3R5bGUuLi4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQ29udGFjdEluZm8oZm5hbWUsIGxuYW1lLCBkb2IsIGFkZHIxLCBjaXR5LCB6aXAsIHBob25lLCBlbWFpbCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKGZuYW1lICsgXCIgXCIgKyBsbmFtZSArIFwiIFwiICsgZG9iICsgXCIgXCIgKyBhZGRyMSArIFwiIC0tXCIgKyBjaXR5ICsgXCIgXCIgKyB6aXAgKyBcIiBcIiArIHBob25lICsgXCIgIFwiICsgZW1haWwpO1xuICAgICAgICB0aGlzLmZvcm1TdWJtaXR0ZWQgPSB0cnVlOyB0aGlzLnBlcnNvbmFsSW5mby5QaG9uZTJlcnJvciA9IGZhbHNlO1xuICAgICAgICBsZXQgZW1haWx2YWwgPSAoKHRoaXMucGVyc29uYWxJbmZvLkVtYWlsICE9IHVuZGVmaW5lZCAmJiB0aGlzLnBlcnNvbmFsSW5mby5FbWFpbC50cmltKCkgIT0gJycpID8gZW1haWwgOiB0cnVlKTtcbiAgICAgICAgbGV0IHBob25lMnZhbCA9ICgodGhpcy5wZXJzb25hbEluZm8uUGhvbmUyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnBlcnNvbmFsSW5mby5QaG9uZTIudHJpbSgpICE9ICcnKSA/IHRoaXMuaXNWYWxpZFBob25lKHRoaXMucGVyc29uYWxJbmZvLlBob25lMikgOiB0cnVlKTtcbiAgICAgICAgaWYgKGZuYW1lICYmIGxuYW1lICYmIGRvYiAmJiBhZGRyMSAmJiBjaXR5ICYmIHppcCAmJiBwaG9uZSAmJiB0aGlzLmlzVmFsaWRQaG9uZSh0aGlzLnBlcnNvbmFsSW5mby5QaG9uZSkgJiYgZW1haWx2YWwgJiYgdGhpcy5wZXJzb25hbEluZm8uRmlyc3ROYW1lLnRyaW0oKSAhPSAnJyAmJiB0aGlzLnBlcnNvbmFsSW5mby5MYXN0TmFtZS50cmltKCkgIT0gJycgJiYgdGhpcy5wZXJzb25hbEluZm8uQWRkcmVzczEudHJpbSgpICE9ICcnICYmIHRoaXMucGVyc29uYWxJbmZvLkNpdHkudHJpbSgpICE9ICcnICYmIHBob25lMnZhbCAmJiB0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5wZXJzb25hbEluZm9TYXZlKHNlbGYucGVyc29uYWxJbmZvKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0KSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuU2VydmljZUNhbGxSZXN1bHQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wZkVkaXQgPSBmYWxzZTsgc2VsZi5nZXRGYW1saU1lbWJlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuU2VydmljZUNhbGxSZXN1bHQuTWVzc2FnZS5pbmRleE9mKFwicGhvbmUgMlwiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBlcnNvbmFsSW5mby5QaG9uZTIgPSBcIlwiOyBzZWxmLnBlcnNvbmFsSW5mby5QaG9uZTJlcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0Lk1lc3NhZ2UuaW5kZXhPZihcInBob25lXCIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGVyc29uYWxJbmZvLlBob25lID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuU2VydmljZUNhbGxSZXN1bHQuTWVzc2FnZS5pbmRleE9mKFwiZW1haWxcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wZXJzb25hbEluZm8uRW1haWwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgaW4gc2F2ZSBJbnN1cmFuY2UgZGF0YS4uLlwiICsgcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0Lk1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVycm9yIGluIFBlcnNvbmFsIGFuZCBMaWZlc3R5bGUuLi4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb2N1c0NvbnRhY3RJbmZvRXJyb3IoZm5hbWUsIGxuYW1lLCBkb2IsIGFkZHIxLCBjaXR5LCB6aXAsIHBob25lLCBlbWFpbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlQmlsbEluZm8oY2FyZG5vLCBuYW1lLCBhZGRyLCBjaXR5LCB6aXAsIHBob25lKSB7XG4gICAgICAgIHRoaXMuYmlsbEZvcm1TdWJtaXQgPSB0cnVlO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKGNhcmRubyArIFwiLS0tXCIgKyBuYW1lICsgXCIgLS0gXCIgKyBhZGRyICsgXCIgLS0gXCIgKyBjaXR5ICsgXCItLVwiICsgemlwICsgXCItLVwiICsgcGhvbmUpO1xuICAgICAgICBpZiAoY2FyZG5vICYmIG5hbWUgJiYgYWRkciAmJiBjaXR5ICYmIHppcCAmJiBwaG9uZSAmJiB0aGlzLmlzVmFsaWRQaG9uZSh0aGlzLmJpbGxpbmdJbmZvLlBob25lKSAmJiB0aGlzLmlzVmFsaWRDYXJkKCkgJiYgdGhpcy5hdXRob3JpemUgJiYgdGhpcy5iaWxsaW5nSW5mby5OYW1lT25DYXJkLnRyaW0oKSAhPSAnJyAmJiB0aGlzLmJpbGxpbmdJbmZvLkFkZHJlc3MxLnRyaW0oKSAhPSAnJyAmJiB0aGlzLmJpbGxpbmdJbmZvLkNpdHkudHJpbSgpICE9ICcnICYmIHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLnNhdmVCaWxsaW5nSW5mbyhzZWxmLmJpbGxpbmdJbmZvKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdC5BUElSZXN1bHQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5iaWxsRWRpdCA9IGZhbHNlOyBzZWxmLmluc3VyZUluZm8uaW52YWxwaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHQuTWVzc2FnZS5pbmRleE9mKFwicGhvbmVcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5iaWxsaW5nSW5mby5QaG9uZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgaW4gc2F2ZSBiaWxsaW5nIGRhdGEuLi5cIiArIHJlc3VsdC5BUElSZXN1bHQuTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiRXJyb3IgaW4gU0FWRSBCaWxsaW5nIERhdGEuLi4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb2N1c0JpbGxJbmZvRXJyb3IoY2FyZG5vLCBuYW1lLCBhZGRyLCBjaXR5LCB6aXAsIHBob25lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGVJbnN1cmFuY2VJbmZvKG5hbWUsIHBob25lLCBpZCkge1xuICAgICAgICB0aGlzLmluc3JGb3JtU3VibWl0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKG5hbWUgJiYgcGhvbmUgJiYgdGhpcy5pc1ZhbGlkTm8odGhpcy5pbnN1cmVJbmZvLkluc3VyYW5jZU1lbWJlcklkKSAmJiB0aGlzLmlzVmFsaWRQaG9uZSh0aGlzLmluc3VyZUluZm8uQ2FycmllclBob25lKSAmJiB0aGlzLmluc3VyZUluZm8uQ2Fycmllck5hbWUudHJpbSgpICE9ICcnICYmIHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluc3VyZUluZm8uQ2FycmllclppcCAhPSBudWxsICYmIHRoaXMuaW5zdXJlSW5mby5DYXJyaWVyWmlwICE9IHVuZGVmaW5lZCAmJiB0aGlzLmluc3VyZUluZm8uQ2FycmllclppcC50cmltKCkgIT0gJycgJiYgdGhpcy5pbnN1cmVJbmZvLkNhcnJpZXJaaXAubGVuZ3RoICE9IDUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc3VyZUluZm8uaW52YWx6aXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpczsgc2VsZi5pbnN1cmVJbmZvLmludmFsemlwID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5zYXZlSW5zdXJlSW5mbyhzZWxmLmluc3VyZUluZm8pLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnN1ckVkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlNlc3Npb24gZXhwaXJlZCBpbiBzYXZlIEluc3VyYW5jZSBkYXRhLi4uXCIgKyByZXN1bHQuQVBJUmVzdWx0Lk1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVycm9yIGluIFBlcnNvbmFsIGFuZCBMaWZlc3R5bGUuLi4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVXBkYXRlIEluc3VyZSBpbmZvXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvcm1hdFBob25lTnVtYmVyKHMpIHtcbiAgICAgICAgbGV0IHMyID0gKFwiXCIgKyBzKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgICAgICBsZXQgbSA9IHMyLm1hdGNoKC9eKFxcZHszfSkoXFxkezN9KShcXGR7NH0pJC8pO1xuICAgICAgICBpZiAobSAhPSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIG1bMV0gKyBcIi1cIiArIG1bMl0gKyBcIi1cIiArIG1bM107XG4gICAgfVxuICAgIGZvY3VzQ29udGFjdEluZm9FcnJvcihmbmFtZSwgbG5hbWUsIGRvYiwgYWRkcjEsIGNpdHksIHppcCwgcGhvbmUsIGVtYWlsKSB7XG4gICAgICAgIGxldCBuYW1lOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgc3dpdGNoIChuYW1lIHx8IFwiXCIpIHtcbiAgICAgICAgICAgIGNhc2UgIWZuYW1lIHx8IHRoaXMucGVyc29uYWxJbmZvLkZpcnN0TmFtZSA9PSB1bmRlZmluZWQgfHwgdGhpcy5wZXJzb25hbEluZm8uRmlyc3ROYW1lLnRyaW0oKSA9PSAnJzpcbiAgICAgICAgICAgICAgICAoPFRleHRGaWVsZD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJmaXJzdE5hbWVcIikpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICFsbmFtZSB8fCB0aGlzLnBlcnNvbmFsSW5mby5MYXN0TmFtZSA9PSB1bmRlZmluZWQgfHwgdGhpcy5wZXJzb25hbEluZm8uTGFzdE5hbWUudHJpbSgpID09ICcnOlxuICAgICAgICAgICAgICAgICg8VGV4dEZpZWxkPnRoaXMucGFnZS5nZXRWaWV3QnlJZChcImxhc3ROYW1lXCIpKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAhZG9iIHx8IHRoaXMucGVyc29uYWxJbmZvLkRPQiA9PSB1bmRlZmluZWQgfHwgIXRoaXMuaXNWYWxpZERhdGUoKTpcbiAgICAgICAgICAgICAgICAoPFRleHRGaWVsZD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJkb2JcIikpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICFhZGRyMSB8fCB0aGlzLnBlcnNvbmFsSW5mby5BZGRyZXNzMSA9PSB1bmRlZmluZWQgfHwgdGhpcy5wZXJzb25hbEluZm8uQWRkcmVzczEudHJpbSgpID09ICcnOlxuICAgICAgICAgICAgICAgICg8VGV4dEZpZWxkPnRoaXMucGFnZS5nZXRWaWV3QnlJZChcImFkZHIxXCIpKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAhY2l0eSB8fCB0aGlzLnBlcnNvbmFsSW5mby5DaXR5ID09IHVuZGVmaW5lZCB8fCB0aGlzLnBlcnNvbmFsSW5mby5DaXR5LnRyaW0oKSA9PSAnJzpcbiAgICAgICAgICAgICAgICAoPFRleHRGaWVsZD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJjaXR5XCIpKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAhemlwIHx8IHRoaXMucGVyc29uYWxJbmZvLlppcCA9PSB1bmRlZmluZWQ6XG4gICAgICAgICAgICAgICAgKDxUZXh0RmllbGQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwiemlwXCIpKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAhcGhvbmUgfHwgdGhpcy5wZXJzb25hbEluZm8uUGhvbmUgPT0gdW5kZWZpbmVkIHx8ICF0aGlzLmlzVmFsaWRQaG9uZSh0aGlzLnBlcnNvbmFsSW5mby5QaG9uZSk6XG4gICAgICAgICAgICAgICAgKDxUZXh0RmllbGQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwicGhvbmVcIikpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMucGVyc29uYWxJbmZvLkVtYWlsICE9IHVuZGVmaW5lZCAmJiB0aGlzLnBlcnNvbmFsSW5mby5FbWFpbC50cmltKCkgIT0gJycgJiYgIWVtYWlsOlxuICAgICAgICAgICAgICAgICg8VGV4dEZpZWxkPnRoaXMucGFnZS5nZXRWaWV3QnlJZChcImVtYWlsXCIpKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnBlcnNvbmFsSW5mby5QaG9uZTIgIT0gdW5kZWZpbmVkICYmIHRoaXMucGVyc29uYWxJbmZvLlBob25lMi50cmltKCkgIT0gJycgJiYgIXRoaXMuaXNWYWxpZFBob25lKHRoaXMucGVyc29uYWxJbmZvLlBob25lMik6XG4gICAgICAgICAgICAgICAgKDxUZXh0RmllbGQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwicGhvbmUyXCIpKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQWxsIENvbnRhY3QgaW5mbyBmaW5lLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9jdXNCaWxsSW5mb0Vycm9yKGNhcmRubywgbmFtZSwgYWRkciwgY2l0eSwgemlwLCBwaG9uZSkge1xuICAgICAgICBzd2l0Y2ggKHRydWUgfHwgXCJcIikge1xuICAgICAgICAgICAgY2FzZSAhY2FyZG5vIHx8IHRoaXMuYmlsbGluZ0luZm8uQ2FyZE51bWJlciA9PSB1bmRlZmluZWQgfHwgIXRoaXMuaXNWYWxpZENhcmQoKTpcbiAgICAgICAgICAgICAgICAoPFRleHRGaWVsZD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJjYXJkbm9cIikpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICFuYW1lIHx8IHRoaXMuYmlsbGluZ0luZm8uTmFtZU9uQ2FyZCA9PSB1bmRlZmluZWQgfHwgdGhpcy5iaWxsaW5nSW5mby5OYW1lT25DYXJkLnRyaW0oKSA9PSAnJzpcbiAgICAgICAgICAgICAgICAoPFRleHRGaWVsZD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJjYXJkbmFtZVwiKSkuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIWFkZHIgfHwgdGhpcy5iaWxsaW5nSW5mby5BZGRyZXNzMSA9PSB1bmRlZmluZWQgfHwgdGhpcy5iaWxsaW5nSW5mby5BZGRyZXNzMS50cmltKCkgPT0gJyc6XG4gICAgICAgICAgICAgICAgKDxUZXh0RmllbGQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwiYmlsbGluZ2FkZHJcIikpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICFjaXR5IHx8IHRoaXMuYmlsbGluZ0luZm8uQ2l0eSA9PSB1bmRlZmluZWQgfHwgdGhpcy5iaWxsaW5nSW5mby5DaXR5LnRyaW0oKSA9PSAnJzpcbiAgICAgICAgICAgICAgICAoPFRleHRGaWVsZD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJiaWxsaW5nY2l0eVwiKSkuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIXppcCB8fCB0aGlzLmJpbGxpbmdJbmZvLlppcCA9PSB1bmRlZmluZWQ6XG4gICAgICAgICAgICAgICAgKDxUZXh0RmllbGQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwiYmlsbGluZ3ppcFwiKSkuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIXBob25lIHx8IHRoaXMuYmlsbGluZ0luZm8uUGhvbmUgPT0gdW5kZWZpbmVkIHx8ICF0aGlzLmlzVmFsaWRQaG9uZSh0aGlzLmJpbGxpbmdJbmZvLlBob25lKTpcbiAgICAgICAgICAgICAgICAoPFRleHRGaWVsZD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJiaWxsaW5ncGhvbmVcIikpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJBbGwgQmlsbGluZyBpbmZvIGZpbmUuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvbk1vbnRoQ2hhbmdlKGFyZ3MpIHtcbiAgICAgICAgdGhpcy5iaWxsaW5nSW5mby5tb250aCA9IHRoaXMubW9udGhzW2FyZ3MudmFsdWVdO1xuICAgIH1cbiAgICBvblllYXJDaGFuZ2UoYXJncykge1xuICAgICAgICB0aGlzLmJpbGxpbmdJbmZvLnllYXIgPSB0aGlzLnllYXJzW2FyZ3MudmFsdWVdO1xuICAgIH1cbiAgICBvbkJTVENoYW5nZShhcmdzKSB7XG4gICAgICAgIHRoaXMuYmlsbGluZ0luZm8uc3RhdGUgPSB0aGlzLmNhcnN0YXRlcy5nZXRWYWx1ZShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuICAgIH1cbiAgICBpc1ZhbGlkQ2FyZCgpIHtcbiAgICAgICAgLy9yZXR1cm4gL14oWzAtOSotXXsxM30pJC8udGVzdCh0aGlzLmJpbGxpbmdJbmZvLkNhcmROdW1iZXIpO1xuICAgICAgICByZXR1cm4gL14oXlswLTlcXC1cXCpdezE3fSkkLy50ZXN0KHRoaXMuYmlsbGluZ0luZm8uQ2FyZE51bWJlcik7XG4gICAgfVxuICAgIGlzVmFsaWREYXRlKCkge1xuICAgICAgICBsZXQgZGF0ZSA9IHRoaXMucGVyc29uYWxJbmZvLkRPQjtcbiAgICAgICAgbGV0IG1hdGNoZXMgPSAvXihcXGR7MSwyfSlbLVxcL10oXFxkezEsMn0pWy1cXC9dKFxcZHs0fSkkLy5leGVjKGRhdGUpO1xuICAgICAgICBpZiAobWF0Y2hlcyA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGxldCBkOiBhbnkgPSBtYXRjaGVzWzJdO1xuICAgICAgICBsZXQgbTogYW55O1xuICAgICAgICBtID0gcGFyc2VJbnQobWF0Y2hlc1sxXSkgLSAxO1xuICAgICAgICBsZXQgeTogYW55ID0gbWF0Y2hlc1szXTtcbiAgICAgICAgbGV0IGNvbXBvc2VkRGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQpO1xuICAgICAgICByZXR1cm4gY29tcG9zZWREYXRlLmdldERhdGUoKSA9PSBkICYmXG4gICAgICAgICAgICBjb21wb3NlZERhdGUuZ2V0TW9udGgoKSA9PSBtICYmXG4gICAgICAgICAgICBjb21wb3NlZERhdGUuZ2V0RnVsbFllYXIoKSA9PSB5ICYmIGNvbXBvc2VkRGF0ZS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9XG4gICAgb25NYXBSZWFkeShldmVudCkge1xuICAgICAgICBpZiAodGhpcy5tYXBWaWV3IHx8ICFldmVudC5vYmplY3QpIHJldHVybjtcbiAgICAgICAgdGhpcy5tYXBWaWV3ID0gZXZlbnQub2JqZWN0O1xuICAgICAgICB0aGlzLm1hcFZpZXcubGF0aXR1ZGUgPSAzNi43NzgyNTk7XG4gICAgICAgIHRoaXMubWFwVmlldy5sb25naXR1ZGUgPSAtMTE5LjQxNzkzMTtcbiAgICAgICAgdGhpcy5tYXBWaWV3Lnpvb20gPSAyO1xuICAgIH07XG4gICAgc2VhcmNoUGhhcm1hY3kocHZhbHVlLCB6dmFsdWUpIHtcbiAgICAgICAgdGhpcy5mb3JtU3VibWl0dGVkID0gdHJ1ZTsgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAocHZhbHVlICYmIHNlbGYud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvYWRlci5zaG93KHNlbGYud2ViYXBpLm9wdGlvbnMpOyBzZWxmLnBoYXJtYWN5TGlzdCA9IFtdO1xuICAgICAgICAgICAgdGhpcy53ZWJhcGkucGhhcm1hY3lTZWFyY2godGhpcy5waGFybmFtZSAhPSB1bmRlZmluZWQgPyB0aGlzLnBoYXJuYW1lIDogXCJcIiwgdGhpcy56aXBjb2RlICE9IHVuZGVmaW5lZCA/IHRoaXMuemlwY29kZSA6IFwiXCIsIHRoaXMuc3RhdGUgIT0gdW5kZWZpbmVkID8gdGhpcy5zdGF0ZSA6IFwiXCIsIHRoaXMuY2l0eSAhPSB1bmRlZmluZWQgPyB0aGlzLmNpdHkgOiBcIlwiKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X1BoYXJtYWN5TGlzdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIHJlc3VsdC5BUElSZXN1bHRfUGhhcm1hY3lMaXN0LlBoYXJtYWN5TGlzdENvdW50ICE9IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHJlc3VsdC5BUElSZXN1bHRfUGhhcm1hY3lMaXN0LlBoYXJtYWN5TGlzdC5QaGFybWFjeUl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waGFyU2VhcmNoVGFiID0gZmFsc2U7IHNlbGYucGhhcm1hY2llc0FkZHIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFtpXS5NZW1iZXJEZWZhdWx0UGhhcm1hY3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waGFybWFjeUxpc3QucHVzaChsaXN0W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waGFybWFjaWVzQWRkci5wdXNoKGxpc3RbaV0uUGhhcm1hY3lBZGRyZXNzMSArIFwiIFwiICsgbGlzdFtpXS5QaGFybWFjeUNpdHkgKyBcIiwgXCIgKyBsaXN0W2ldLlBoYXJtYWN5U3RhdGUgKyBcIiBcIiArIGxpc3RbaV0uUGhhcm1hY3laaXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waGFyU2VhcmNoVGFiID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5waGFybWFjeUxpc3QucHVzaChsaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBoYXJtYWNpZXNBZGRyLnB1c2gobGlzdC5QaGFybWFjeUFkZHJlc3MxICsgXCIgXCIgKyBsaXN0LlBoYXJtYWN5Q2l0eSArIFwiLCBcIiArIGxpc3QuUGhhcm1hY3lTdGF0ZSArIFwiIFwiICsgbGlzdC5QaGFybWFjeVppcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaFBoYXJtYWN5VG9QbGFjZU1hcmtlcnMoc2VsZi5waGFybWFjaWVzQWRkcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfUGhhcm1hY3lMaXN0Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJObyBwaGFybWFjaWVzIGZvdW5kIC8gU2Vzc2lvbiBleHBpcmVkIC8gZXJyb3IgaW4gc2VhcmNoIHBoYXJtYWN5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVycm9yIGluIFBoYXJtYWN5IFNlYXJjaC4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNlYXJjaFBoYXJtYWN5VG9QbGFjZU1hcmtlcnMocGhhckFkZHJzOiBhbnlbXSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7IGxldCBzZWFyY2hGaWVsZCA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGhhckFkZHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzZWFyY2hGaWVsZCA9IFwiXCI7IHNlYXJjaEZpZWxkID0gcGhhckFkZHJzW2ldLnNwbGl0KCcgJykuam9pbignJTIwJyk7XG4gICAgICAgICAgICB0aGlzLndlYmFwaS5nZXRQbGFjZXMoc2VhcmNoRmllbGQpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucGxhY2VHID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSkucmVzdWx0cztcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHNlbGYucGxhY2VHWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdCwgc2VsZi5wbGFjZUdbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gc2VsZi5wbGFjZUdbMF0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnNuaXBwZXQgPSBzZWxmLnBsYWNlR1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICAvL3NlbGYubWFwVmlldy56b29tID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNlbnRlcmVkT25Mb2NhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJNYXJrZXIgYWRkZWQuLi4uLi4uLlwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvbk1hcmtlclNlbGVjdChldmVudCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGhhcm1hY3lMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5waGFybWFjeUxpc3RbaV0uUGhhcm1hY3lBZGRyZXNzMS50b1VwcGVyQ2FzZSgpID09IGV2ZW50Lm1hcmtlci50aXRsZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBc1ByZWZlcnJlZFBoYXJtYWN5KGkpO1xuICAgICAgICAgICAgICAgIHRoaXMucGhhcm1hY3lMaXN0LnNwbGljZSgwLCAwLCB0aGlzLnBoYXJtYWN5TGlzdC5zcGxpY2UoaSwgMSlbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHNldEFzUHJlZmVycmVkUGhhcm1hY3koaW5kZXgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBoYXJtYWN5TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBoYXJtYWN5TGlzdFtpbmRleF0uTWVtYmVyRGVmYXVsdFBoYXJtYWN5ID0gIXRoaXMucGhhcm1hY3lMaXN0W2luZGV4XS5NZW1iZXJEZWZhdWx0UGhhcm1hY3k7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGhhcm1hY3lMaXN0W2luZGV4XS5NZW1iZXJEZWZhdWx0UGhhcm1hY3kpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFBoYXJtYWN5ID0gdGhpcy5waGFybWFjeUxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQaGFybWFjeSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5waGFybWFjeUxpc3RbaV0uTWVtYmVyRGVmYXVsdFBoYXJtYWN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJlZmVycmVkUGhhckxpc3QoKSB7XG4gICAgICAgIHRoaXMud2ViYXBpLmdldE1lbWJlcnNQcmVmZXJyZWRQaGFybWFjeV9odHRwKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfUHJlZmVycmVkUGhhcm1hY3kuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X1ByZWZlcnJlZFBoYXJtYWN5LlByZWZlcnJlZFBoYXJtYWN5LlBoYXJtYWN5SWQgIT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmVmUGhhciA9IHJlc3VsdC5BUElSZXN1bHRfUHJlZmVycmVkUGhhcm1hY3kuUHJlZmVycmVkUGhhcm1hY3k7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucGhhcm1hY2llc0FkZHIucHVzaChzZWxmLnByZWZQaGFyLlBoYXJtYWN5QWRkcmVzczEgKyBcIiBcIiArIHNlbGYucHJlZlBoYXIuUGhhcm1hY3lDaXR5ICsgXCIsIFwiICsgc2VsZi5wcmVmUGhhci5QaGFybWFjeVN0YXRlICsgXCIgXCIgKyBzZWxmLnByZWZQaGFyLlBoYXJtYWN5WmlwKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hQaGFybWFjeVRvUGxhY2VNYXJrZXJzKHNlbGYucGhhcm1hY2llc0FkZHIpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0X1ByZWZlcnJlZFBoYXJtYWN5Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVycm9yL05vIERhdGEgaW4gZ2V0dGluZyBwcmVmZXJyZWQgcGhhcm1hY3kgXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnJvciBpbiBnZXR0aW5nIHByZWZlcnJlZCBwaGFybWFjeS4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZVByZWZlcnJlZFBoYXIoKSB7XG4gICAgICAgICg8U2Nyb2xsVmlldz50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzY3JvbGxpZFwiKSkuc2Nyb2xsVG9WZXJ0aWNhbE9mZnNldCgwLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRQaGFybWFjeS5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5SWQgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGVkUGhhcm1hY3kuUGhhcm1hY3lJZCAhPSB1bmRlZmluZWQgJiYgdGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgdGhpcy53ZWJhcGkuc2F2ZVByZWZQaGFyKHRoaXMuc2VsZWN0ZWRQaGFybWFjeSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfUHJlZmVycmVkUGhhcm1hY3kuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X1ByZWZlcnJlZFBoYXJtYWN5LlByZWZlcnJlZFBoYXJtYWN5LlBoYXJtYWN5SWQgIT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHJlZlBoYXIgPSByZXN1bHQuQVBJUmVzdWx0X1ByZWZlcnJlZFBoYXJtYWN5LlByZWZlcnJlZFBoYXJtYWN5O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFBoYXJtYWN5LmVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUGhhcm1hY3kuZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdF9QcmVmZXJyZWRQaGFybWFjeS5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnJvciBpbiBnZXR0aW5nIHByZWZlcnJlZCBwaGFybWFjeSBcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZ2V0dGluZyBwcmVmZXJyZWQgcGhhcm1hY3kuLiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcEluR29vZ2xlKGl0ZW0pIHtcbiAgICAgICAgKDxTY3JvbGxWaWV3PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNjcm9sbGlkXCIpKS5zY3JvbGxUb1ZlcnRpY2FsT2Zmc2V0KDAsIGZhbHNlKTtcbiAgICAgICAgbGV0IG1hcmtQaGFyOiBhbnkgPSBbXTtcbiAgICAgICAgbWFya1BoYXIucHVzaChpdGVtLlBoYXJtYWN5QWRkcmVzczEgKyBcIiBcIiArIGl0ZW0uUGhhcm1hY3lDaXR5ICsgXCIsIFwiICsgaXRlbS5QaGFybWFjeVN0YXRlICsgXCIgXCIgKyBpdGVtLlBoYXJtYWN5WmlwKVxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7IGxldCBzZWFyY2hGaWVsZCA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya1BoYXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkID0gXCJcIjsgc2VhcmNoRmllbGQgPSBtYXJrUGhhcltpXS5zcGxpdCgnICcpLmpvaW4oJyUyMCcpO1xuICAgICAgICAgICAgdGhpcy53ZWJhcGkuZ2V0UGxhY2VzKHNlYXJjaEZpZWxkKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucGxhY2VHID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSkucmVzdWx0cztcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHNlbGYucGxhY2VHWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdCwgc2VsZi5wbGFjZUdbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gc2VsZi5wbGFjZUdbMF0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnNuaXBwZXQgPSBzZWxmLnBsYWNlR1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFZpZXcubGF0aXR1ZGUgPSBzZWxmLnBsYWNlR1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFwVmlldy5sb25naXR1ZGUgPSBzZWxmLnBsYWNlR1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sbmc7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFwVmlldy56b29tID0gMTY7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2VudGVyZWRPbkxvY2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIk1hcmtlciBhZGRlZC4gYW5kIFpvb21lZC4uLi4uLi5cIik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy90aGlzLnNlYXJjaFBoYXJtYWN5VG9QbGFjZU1hcmtlcnMobWFya1BoYXIucHVzaChpdGVtLlBoYXJtYWN5QWRkcmVzczEgKyBcIiBcIiArIGl0ZW0uUGhhcm1hY3lDaXR5ICsgXCIsIFwiICsgaXRlbS5QaGFybWFjeVN0YXRlICsgXCIgXCIgK2l0ZW0uUGhhcm1hY3laaXApKTtcbiAgICB9XG4gICAgcGVyc29uYWxJbmZvRWRpdCgpIHtcbiAgICAgICAgdGhpcy5wZkVkaXQgPSB0cnVlO1xuICAgIH1cbiAgICBiaWxsaW5nSW5mb0VkaXQoKSB7XG4gICAgICAgIHRoaXMuYmlsbEVkaXQgPSB0cnVlO1xuICAgIH1cbiAgICBpbnN1cmVJbmZvRWRpdCgpIHtcbiAgICAgICAgdGhpcy5pbnN1ckVkaXQgPSB0cnVlO1xuICAgIH1cbiAgICBpc1ZhbGlkUGhvbmUocGhvbmVubzogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAvXihcXCgpP1xcZHszfShcXCkpPygtfFxccyk/XFxkezN9KC18XFxzKVxcZHs0fSQvLnRlc3QocGhvbmVubyk7XG4gICAgfVxuXG4gICAgaXNBdXRob3JpemUoKSB7XG4gICAgICAgIHRoaXMuYXV0aG9yaXplID0gIXRoaXMuYXV0aG9yaXplO1xuICAgIH1cbiAgICBpc1ZhbGlkTm8obnVtOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIC9eXFxkKyQvLnRlc3QobnVtKTtcbiAgICB9XG4gICAgb25SZXF1ZXN0UGVybWlzc2lvbnNUYXAoKSB7XG4gICAgICAgIHRoaXMucGljMSA9IG51bGw7IHRoaXMuaW1nZHRscyA9IHt9O1xuICAgICAgICBpZiAocGxhdGZvcm1Nb2R1bGUuZGV2aWNlLm9zID09PSBcIkFuZHJvaWRcIiAmJiBwbGF0Zm9ybU1vZHVsZS5kZXZpY2Uuc2RrVmVyc2lvbiA+PSAyMykge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oYW5kcm9pZC5NYW5pZmVzdC5wZXJtaXNzaW9uLkNBTUVSQSwgXCJJIG5lZWQgdGhlc2UgcGVybWlzc2lvbnMgdG8gcmVhZCBmcm9tIHN0b3JhZ2VcIilcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJQZXJtaXNzaW9ucyBncmFudGVkIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblRha2VQaWN0dXJlVGFwKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVWggb2gsIG5vIHBlcm1pc3Npb25zIC0gcGxhbiBCIHRpbWUhXCIpO1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIllvdSBkb24ndCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZSBjYW1lcmFcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uVGFrZVBpY3R1cmVUYXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbWVyYUltYWdlOiBJbWFnZUFzc2V0O1xuICAgIGltZ2R0bHM6IGFueSA9IHt9O1xuICAgIG9uVGFrZVBpY3R1cmVUYXAoKSB7XG4gICAgICAgIGxldCBfdGhhdCA9IHRoaXM7IHRoaXMudXNlci5zaG93UGljID0gdHJ1ZTtcbiAgICAgICAgdGFrZVBpY3R1cmUoeyB3aWR0aDogMTgwLCBoZWlnaHQ6IDE4MCwga2VlcEFzcGVjdFJhdGlvOiBmYWxzZSwgc2F2ZVRvR2FsbGVyeTogdHJ1ZSB9KVxuICAgICAgICAgICAgLnRoZW4oKGltYWdlQXNzZXQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gbmV3IEltYWdlU291cmNlKCk7XG4gICAgICAgICAgICAgICAgc291cmNlLmZyb21Bc3NldChpbWFnZUFzc2V0KS50aGVuKChzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhgU2l6ZTogJHtzb3VyY2Uud2lkdGh9eCR7c291cmNlLmhlaWdodH1gKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoYXQudXNlci5zaG93UGljID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIF90aGF0LmltZ2R0bHMuaW1hZ2VOYW1lID0gXCJzYW1wbGUuanBnXCI7XG4gICAgICAgICAgICAgICAgICAgIF90aGF0LmltZ2R0bHMuYmFzZTY0dGV4dFN0cmluZyA9IHNvdXJjZS50b0Jhc2U2NFN0cmluZyhcImpwZ1wiLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGF0LmltZ2R0bHMuaW1hZ2VTaXplID0gTWF0aC5yb3VuZChfdGhhdC5pbWdkdGxzLmJhc2U2NHRleHRTdHJpbmcucmVwbGFjZSgvXFw9L2csIFwiXCIpLmxlbmd0aCAqIDAuNzUpIC0gMjAwO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGF0LnNhdmVQZXJzb25hbEltYWdlKF90aGF0LmltZ2R0bHMsIFwiQWRkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF90aGF0LmNhbWVyYUltYWdlID0gaW1hZ2VBc3NldDtcbiAgICAgICAgICAgICAgICBpZiAoX3RoYXQucGljMSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGF0LnBpYzEgPSBpbWFnZUFzc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgc2F2ZVBlcnNvbmFsSW1hZ2UoaXRlbTogYW55LCBvcGVyYXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvYWRlci5zaG93KHNlbGYud2ViYXBpLm9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PSAnQWRkJykge1xuICAgICAgICAgICAgICAgIGl0ZW0uQWN0aW9uID0gXCJBZGRcIjtcbiAgICAgICAgICAgICAgICBpdGVtLkRvY3VtZW50VHlwZSA9IFwiUHJvZmlsZSBJbWFnZVwiO1xuICAgICAgICAgICAgICAgIGl0ZW0uSXRlbUlkID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLkZpbGVOYW1lID0gXCJzYW1wbGUuanBnXCI7XG4gICAgICAgICAgICAgICAgaXRlbS5GaWxlU2l6ZSA9IGl0ZW0uaW1hZ2VTaXplO1xuICAgICAgICAgICAgICAgIGl0ZW0uRmlsZURhdGEgPSBpdGVtLmJhc2U2NHRleHRTdHJpbmc7XG4gICAgICAgICAgICB9IGVsc2UgeyB9XG4gICAgICAgICAgICBodHRwX3JlcXVlc3QucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9XZWJTZXJ2aWNlcy9BUElfU2VjdXJpdHkuYXNteFwiLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQveG1sXCIgfSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J3V0Zi04Jz8+XCIgK1xuICAgICAgICAgICAgICAgIFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLyc+XCIgK1xuICAgICAgICAgICAgICAgIFwiPHNvYXBlbnY6Qm9keT48d2ViOlBlcnNvbmFsSW1hZ2VfU2F2ZT5cIiArXG4gICAgICAgICAgICAgICAgXCI8d2ViOktleT5cIiArIHRoaXMudXNyZGF0YS5LZXkgKyBcIjwvd2ViOktleT5cIiArXG4gICAgICAgICAgICAgICAgXCI8d2ViOkdyb3VwTnVtYmVyPlwiICsgdGhpcy51c3JkYXRhLkdyb3VwTnVtYmVyICsgXCI8L3dlYjpHcm91cE51bWJlcj5cIiArXG4gICAgICAgICAgICAgICAgXCI8d2ViOkV4dGVybmFsTWVtYmVySWQ+XCIgKyB0aGlzLnVzcmRhdGEuRXh0ZXJuYWxNZW1iZXJJZCArIFwiPC93ZWI6RXh0ZXJuYWxNZW1iZXJJZD5cIiArXG4gICAgICAgICAgICAgICAgXCI8d2ViOkFjdGlvbj5cIiArIGl0ZW0uQWN0aW9uICsgXCI8L3dlYjpBY3Rpb24+PHdlYjpDb250ZW50PlwiICtcbiAgICAgICAgICAgICAgICBcIjx3ZWI6RG9jdW1lbnRUeXBlPlwiICsgaXRlbS5Eb2N1bWVudFR5cGUgKyBcIjwvd2ViOkRvY3VtZW50VHlwZT5cIiArXG4gICAgICAgICAgICAgICAgXCI8d2ViOkl0ZW1JZD5cIiArIGl0ZW0uSXRlbUlkICsgXCI8L3dlYjpJdGVtSWQ+XCIgK1xuICAgICAgICAgICAgICAgIFwiPHdlYjpGaWxlTmFtZT5cIiArIGl0ZW0uRmlsZU5hbWUgKyBcIjwvd2ViOkZpbGVOYW1lPlwiICtcbiAgICAgICAgICAgICAgICBcIjx3ZWI6RmlsZVNpemU+XCIgKyBpdGVtLkZpbGVTaXplICsgXCI8L3dlYjpGaWxlU2l6ZT5cIiArXG4gICAgICAgICAgICAgICAgXCI8d2ViOkZpbGVEYXRhPlwiICsgaXRlbS5GaWxlRGF0YSArIFwiPC93ZWI6RmlsZURhdGE+XCIgK1xuICAgICAgICAgICAgICAgIFwiPC93ZWI6Q29udGVudD48d2ViOkRlbW8vPjwvd2ViOlBlcnNvbmFsSW1hZ2VfU2F2ZT48L3NvYXBlbnY6Qm9keT48L3NvYXBlbnY6RW52ZWxvcGU+XCJcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZXNwb25zZVwiKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnVzcmRhdGEuRXh0ZXJuYWxNZW1iZXJJZCtcIiA9PSBcIit0aGlzLndlYmFwaS5FeHRlcm5hbE1lbWJlcklkKTtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcocmVzcG9uc2UuY29udGVudCwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5jb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3AgPSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uUGVyc29uYWxJbWFnZV9TYXZlUmVzcG9uc2UuUGVyc29uYWxJbWFnZV9TYXZlUmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiBvcGVyYXRpb24gPT0gXCJBZGRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW1nZHRscy5yZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwLk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW1nZHRscy5yZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDQwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJEYXRhOiBhbnkgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyRGF0YS5QaWN0dXJlRGF0YSA9IGl0ZW0uRmlsZURhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcIlVTRVJcIiwgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0RmFtbGlNZW1iZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3I6Li4uIFwiICsgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLnBoYXJTZWFyY2hUYWIpXG4gICAgICAgICAgICB0aGlzLnBoYXJTZWFyY2hUYWIgPSBmYWxzZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5waGFyU2VhcmNoVGFiID0gdHJ1ZTtcbiAgICB9XG4gICAgZ2V0RmFtbGlNZW1iZXJzKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYud2ViYXBpLnBlcnNvbmFsQW5kTFNTdW1tYXJ5KFwiRmFtaWx5TWVtYmVyc19HcmlkX0dldFwiKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJzX0dyaWQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5GYW1pbHlNZW1iZXJDb3VudCAhPSAnMCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tZW1saXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZW1iZXJzID0gcmVzdWx0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJzX0dyaWQuRmFtaWx5TWVtYmVyTGlzdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVySXRlbTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tZW1saXN0LnB1c2gobWVtYmVyc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1lbWxpc3QucHVzaChtZW1iZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnJlbW92ZShcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKTtcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJGQU1JTFlfTUVNQkVSX0RFVEFJTFNcIiwgSlNPTi5zdHJpbmdpZnkoc2VsZi5tZW1saXN0KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJlcnJvciBvciBubyBtZW1icnMgbGlzdCBpbiBteSBwcm9maWxlLS0+XCIgKyByZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5NZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYudXBkYXRlVXNlckRldGFpbHMoKTtcbiAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiRXJyb3IgaW4gbWVtYmVycyBsaXN0IGluIG15IHByb2ZpbGUgXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVVc2VyRGV0YWlscygpIHtcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpO1xuICAgICAgICAgICAgdGhpcy51c2VyLkZpcnN0TmFtZSA9IHRoaXMucGVyc29uYWxJbmZvLkZpcnN0TmFtZSAhPSB1bmRlZmluZWQgJiYgdGhpcy5wZXJzb25hbEluZm8uRmlyc3ROYW1lLmxlbmd0aCA+IDEgPyB0aGlzLnBlcnNvbmFsSW5mby5GaXJzdE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnBlcnNvbmFsSW5mby5GaXJzdE5hbWUuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCkgOiB0aGlzLnBlcnNvbmFsSW5mby5GaXJzdE5hbWU7XG4gICAgICAgICAgICB0aGlzLnVzZXIuTGFzdE5hbWUgPSB0aGlzLnBlcnNvbmFsSW5mby5MYXN0TmFtZSAhPSB1bmRlZmluZWQgJiYgdGhpcy5wZXJzb25hbEluZm8uTGFzdE5hbWUubGVuZ3RoID4gMSA/IHRoaXMucGVyc29uYWxJbmZvLkxhc3ROYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5wZXJzb25hbEluZm8uTGFzdE5hbWUuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCkgOiB0aGlzLnBlcnNvbmFsSW5mby5MYXN0TmFtZTtcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiVVNFUlwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLnVzZXIpKTtcbiAgICAgICAgICAgIHRoaXMubG9naW5EZXRhaWxzU2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxvZ2luRGV0YWlsc1Nob3coKSB7XG4gICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIkxPR0lOX0NSRFwiKSkge1xuICAgICAgICAgICAgbGV0IGxvZ2luQ3JlZGVudGlhbHM6IGFueSA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJMT0dJTl9DUkRcIikpO1xuICAgICAgICAgICAgdGhpcy51c2VyLnVzZXJuYW1lID0gbG9naW5DcmVkZW50aWFscy51c2VybmFtZTtcbiAgICAgICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXIuc2hvd1BpYyA9IHRydWU7IHRoaXMucGljMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJEYXRhOiBhbnkgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSk7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyLkV4dGVybmFsTWVtYmVySWQgPSB1c2VyRGF0YS5FeHRlcm5hbE1lbWJlcklkO1xuICAgICAgICAgICAgICAgIHRoaXMudXNlci5waWMyID0gdXNlckRhdGEuUGljdHVyZURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn07Il19