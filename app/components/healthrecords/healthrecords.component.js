"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var radside_component_1 = require("../radside/radside.component");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var imagepicker = require("nativescript-imagepicker");
var nativescript_camera_1 = require("nativescript-camera");
var image_source_1 = require("tns-core-modules/image-source");
//import { ImageAsset } from 'tns-core-modules/image-asset';
var ApplicationSettings = require("application-settings");
var router_1 = require("@angular/router");
var requestconsult_model_1 = require("../home/requestconsult.model");
var router_2 = require("nativescript-angular/router");
var ImageSourceModule = require("image-source");
var xml2js = require('nativescript-xml2js');
var http_request = require("http");
var platformModule = require("platform");
var permissions = require("nativescript-permissions");
var PhotoViewer = require("nativescript-photoviewer");
var dialogs = require("ui/dialogs");
var HealthRecordsComponent = (function () {
    function HealthRecordsComponent(page, webapi, _changeDetectionRef, router, actR, rs) {
        this.page = page;
        this.webapi = webapi;
        this._changeDetectionRef = _changeDetectionRef;
        this.router = router;
        this.actR = actR;
        this.rs = rs;
        this.photoViewer = new PhotoViewer();
        this.healthView = false;
        this.personalData = [];
        this.personalLsObj = {};
        this.editorupdate = {};
        this.drugList = [];
        this.deleteDrugObj = {};
        this.drugform = false;
        this.height = new nativescript_drop_down_1.ValueList();
        this.height2 = new nativescript_drop_down_1.ValueList();
        this.drink = new nativescript_drop_down_1.ValueList();
        this.exercise = new nativescript_drop_down_1.ValueList();
        this.bloodgrp = new nativescript_drop_down_1.ValueList();
        this.marialstatus = new nativescript_drop_down_1.ValueList();
        this.smoke = new nativescript_drop_down_1.ValueList();
        this.smokehis = new nativescript_drop_down_1.ValueList();
        this.extimes = new nativescript_drop_down_1.ValueList();
        this.codeListArray = ["EMR_HeightFeet", "EMR_HeightInches", "EMR_BloodType", "EMR_MaritalStatus", "EMR_SmokeFrequency", "EMR_DrinkFreqency", "EMR_ExerciseFrequency", "EMR_ExerciseIntensity", "EMR_SmokeHistory", "EMR_FamilyHistoryCondition"];
        this.editSurgery = false;
        this.viewFamily = false;
        this.editFamily = false;
        this.editMedImg = false;
        this.surgHisList = [];
        this.delSurgery = {};
        this.surgform = false;
        this.medimglist = [];
        this.medimgform = false;
        this.pic1 = null;
        this.editMedication = false;
        this.medication = false;
        this.medicalCondition = false;
        this.editMode = false;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.mcSubmitted = false;
        this.mSubmitted = false;
        this.medicationsList = [];
        this.medicationUsageFrequency = new nativescript_drop_down_1.ValueList();
        this.medicationItem = {};
        this.msSelectedIndex = null;
        this.mSelectedIndex = null;
        this.updateMedicationItem = {};
        this.medicationStatus = new nativescript_drop_down_1.ValueList([{ value: "Y", display: "Currently taking this" }, { value: "N", display: "Took it in the past" }]);
        this.medicalConditionsList = [];
        this.emrMedicalCondition = new nativescript_drop_down_1.ValueList();
        this.medicalConditionItem = {};
        this.mcSelectedIndex = null;
        this.updateMedCondition = {};
        this.mcsSelectedIndex = null;
        this.medicalConditionStatus = new nativescript_drop_down_1.ValueList([{ value: "Y", display: "Currently in condition" }, { value: "N", display: "Had condition in past" }]);
        this.familyHistoryItem = [];
        this.familyHistoryCondition = [];
        this.familyHistory = [];
        this.updateFamilyHistoryItem = {};
        this.familyHistoryWho = new nativescript_drop_down_1.ValueList();
        this.fSelectedIndex = null;
        this.addNewMember = false;
        this.addFHForm = false;
        this.usrdata = {};
        this.delMedication = {};
        this.delMedicalCondition = {};
        this.imageViewArray = [];
        this.itemSpec = [];
        this.imgdtls = {};
    }
    HealthRecordsComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.rscomp.hlthClass = true;
    };
    HealthRecordsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.getPersonalData();
        this.actR.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
            }
        });
        if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
            var data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
            this.usrdata.GroupNumber = data.GroupNumber;
            this.usrdata.Key = data.Key;
            this.usrdata.ExternalMemberId = data.ExternalMemberId;
        }
        if (ApplicationSettings.hasKey("USER")) {
            var data = JSON.parse(ApplicationSettings.getString("USER"));
            this.usrdata.ExternalMemberId = data.ExternalMemberId;
        }
    };
    HealthRecordsComponent.prototype.editPersonal = function () {
        this.healthView = true;
    };
    HealthRecordsComponent.prototype.codeList = function () {
        var self = this;
        if (this.webapi.netConnectivityCheck()) {
            var _loop_1 = function (j) {
                this_1.webapi.getCodeList(self.codeListArray[j]).subscribe(function (data) {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_CodeList.Successful == "true") {
                            var items = result.APIResult_CodeList.List;
                            switch (true) {
                                case j == 0:
                                    self.height = new nativescript_drop_down_1.ValueList();
                                    for (var i = 0; i < items.ItemCount; i++) {
                                        self.height.push({ value: items.List.CodeListItem[i].ItemId, display: items.List.CodeListItem[i].Value });
                                        if (self.personalData.Height != undefined && items.List.CodeListItem[i].Value == self.personalData.Height.split(";", 2)[0])
                                            self.personalLsObj.htindx = i;
                                    }
                                    break;
                                case j == 1:
                                    self.height2 = new nativescript_drop_down_1.ValueList();
                                    for (var k = 0; k < items.ItemCount; k++) {
                                        self.height2.push({ value: items.List.CodeListItem[k].ItemId, display: items.List.CodeListItem[k].Value });
                                        if (self.personalData.Height != undefined && items.List.CodeListItem[k].Value == self.personalData.Height.split(";", 2)[1])
                                            self.personalLsObj.htindx1 = k;
                                    }
                                    break;
                                case j == 2:
                                    self.bloodgrp = new nativescript_drop_down_1.ValueList();
                                    for (var l = 0; l < items.ItemCount; l++) {
                                        self.bloodgrp.push({ value: items.List.CodeListItem[l].ItemId, display: items.List.CodeListItem[l].Value });
                                        if (items.List.CodeListItem[l].Value == self.personalData.BloodType)
                                            self.personalLsObj.bloodIndex = l;
                                    }
                                    break;
                                case j == 3:
                                    self.marialstatus = new nativescript_drop_down_1.ValueList();
                                    for (var m = 0; m < items.ItemCount; m++) {
                                        self.marialstatus.push({ value: items.List.CodeListItem[m].ItemId, display: items.List.CodeListItem[m].Value });
                                        if (items.List.CodeListItem[m].Value == self.personalData.MaritalStatus)
                                            self.personalLsObj.maritalIndex = m;
                                    }
                                    break;
                                case j == 4:
                                    self.smoke = new nativescript_drop_down_1.ValueList();
                                    for (var n = 0; n < items.ItemCount; n++) {
                                        self.smoke.push({ value: items.List.CodeListItem[n].ItemId, display: items.List.CodeListItem[n].Value });
                                        if (items.List.CodeListItem[n].Value == self.personalData.Smoke.split(",", 2)[0])
                                            self.personalLsObj.smokeIndx = n;
                                    }
                                    break;
                                case j == 5:
                                    self.drink = new nativescript_drop_down_1.ValueList();
                                    for (var o = 0; o < items.ItemCount; o++) {
                                        self.drink.push({ value: items.List.CodeListItem[o].ItemId, display: items.List.CodeListItem[o].Value });
                                        if (items.List.CodeListItem[o].Value == self.personalData.Drink)
                                            self.personalLsObj.drinkIndx = o;
                                    }
                                    break;
                                case j == 6:
                                    self.exercise = new nativescript_drop_down_1.ValueList();
                                    for (var p = 0; p < items.ItemCount; p++) {
                                        self.exercise.push({ value: items.List.CodeListItem[p].ItemId, display: items.List.CodeListItem[p].Value });
                                        if (items.List.CodeListItem[p].Value == self.personalData.Exercise.split(", ", 2)[0])
                                            self.personalLsObj.exIndex = p;
                                    }
                                    break;
                                case j == 7:
                                    self.extimes = new nativescript_drop_down_1.ValueList();
                                    for (var q = 0; q < items.ItemCount; q++) {
                                        self.extimes.push({ value: items.List.CodeListItem[q].ItemId, display: items.List.CodeListItem[q].Value });
                                        if (items.List.CodeListItem[q].Value == self.personalData.Exercise.split(", ", 2)[1])
                                            self.personalLsObj.extimeIndx = q;
                                    }
                                    break;
                                case j == 8:
                                    self.smokehis = new nativescript_drop_down_1.ValueList();
                                    for (var r = 0; r < items.ItemCount; r++) {
                                        self.smokehis.push({ value: items.List.CodeListItem[r].ItemId, display: items.List.CodeListItem[r].Value });
                                        if (items.List.CodeListItem[r].Value == self.personalData.Smoke.split(", ", 2)[1])
                                            self.personalLsObj.smoktindx = r;
                                    }
                                    break;
                                case j == 9:
                                    for (var s = 0; s < items.ItemCount; s++) {
                                        self.familyHistoryCondition.push(items.List.CodeListItem[s]);
                                    }
                                    break;
                                default:
                            }
                        }
                        else {
                            //console.log("Error in getting the codelist index. " + self.codeListArray[j]);
                        }
                    });
                }, function (error) {
                    //console.log("Error in getting the CodeList " + error);
                });
            };
            var this_1 = this;
            for (var j = 0; j < self.codeListArray.length; ++j) {
                _loop_1(j);
            }
        }
    };
    HealthRecordsComponent.prototype.getPersonalData = function () {
        var self = this;
        self.webapi.personalAndLSSummary("EMR_PersonalAndLifeStyle_Summary_Get").subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_EMRPersonalAndLifeStyle_Summary.Successful == "true") {
                    self.personalData = result.APIResult_EMRPersonalAndLifeStyle_Summary.Content;
                    self.codeList();
                }
                else {
                    if (result.APIResult_EMRPersonalAndLifeStyle_Summary.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    //console.log("Session expired or error in getting personal data...");
                }
            });
        }, function (error) {
            //console.log("Error in Personal and Lifestyle.... " + error);
        });
    };
    HealthRecordsComponent.prototype.onHeight1Change = function (args) {
        this.personalLsObj.HeightFeetItemId = this.height.getValue(args.selectedIndex);
        this.personalLsObj.HeightFeetItem = this.height.getDisplay(args.selectedIndex);
        this.personalLsObj.htindx = args.selectedIndex;
    };
    HealthRecordsComponent.prototype.onHeight2Change = function (args) {
        this.personalLsObj.HeightInchesItemId = this.height2.getValue(args.selectedIndex);
        this.personalLsObj.HeightInchesItem = this.height2.getDisplay(args.selectedIndex);
        this.personalLsObj.htindx1 = args.selectedIndex;
    };
    HealthRecordsComponent.prototype.onBloodTypeChange = function (args) {
        this.personalLsObj.BloodTypeItemId = this.bloodgrp.getValue(args.selectedIndex);
        this.personalLsObj.BloodTypeItem = this.bloodgrp.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onMaritalStateChange = function (args) {
        this.personalLsObj.MaritalStatusItemId = this.marialstatus.getValue(args.selectedIndex);
        this.personalLsObj.MaritalStatusItem = this.marialstatus.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onSmokeChange = function (args) {
        this.personalLsObj.SmokeStatusItemId = this.smoke.getValue(args.selectedIndex);
        this.personalLsObj.SmokeStatusItem = this.smoke.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onSmokeTimeChange = function (args) {
        this.personalLsObj.SmokeLengthItemId = this.smokehis.getValue(args.selectedIndex);
        this.personalLsObj.SmokeLengthItem = this.smokehis.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onDrinkChange = function (args) {
        this.personalLsObj.DrinkItemId = this.drink.getValue(args.selectedIndex);
        this.personalLsObj.DrinkItem = this.drink.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onExerciseChange = function (args) {
        this.personalLsObj.ExerciseItemId = this.exercise.getValue(args.selectedIndex);
        this.personalLsObj.ExerciseItem = this.exercise.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onExerciseTimeChange = function (args) {
        this.personalLsObj.ExerciseLengthItemId = this.extimes.getValue(args.selectedIndex);
        this.personalLsObj.ExerciseLengthItem = this.extimes.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.updatePersonalInfo = function () {
        var _this = this;
        if (this.webapi.netConnectivityCheck()) {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<?xml version='1.0' encoding='UTF-8'?>" +
                    "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
                    "<soapenv:Body><web:EMR_PersonalAndLifeStyle_Save><web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
                    "<web:HeightFeetItem>" + this.personalLsObj.HeightFeetItem + "</web:HeightFeetItem>" +
                    "<web:HeightFeetItemId>" + this.personalLsObj.HeightFeetItemId + "</web:HeightFeetItemId>" +
                    "<web:HeightInchesItem>" + this.personalLsObj.HeightInchesItem + "</web:HeightInchesItem>" +
                    "<web:HeightInchesItemId>" + this.personalLsObj.HeightInchesItemId + "</web:HeightInchesItemId>" +
                    "<web:WeightPounds>" + this.personalData.Weight + "</web:WeightPounds>" +
                    "<web:BloodTypeItem>" + this.personalLsObj.BloodTypeItem + "</web:BloodTypeItem >" +
                    "<web:BloodTypeItemId>" + this.personalLsObj.BloodTypeItemId + "</web:BloodTypeItemId>" +
                    "<web:BloodPressureSystolic/><web:BloodPressureDiastolic/>" +
                    "<web:MaritalStatusItem>" + this.personalLsObj.MaritalStatusItem + "</web:MaritalStatusItem>" +
                    "<web:MaritalStatusItemId>" + this.personalLsObj.MaritalStatusItemId + "</web:MaritalStatusItemId>" +
                    "<web:SmokeStatusItem>" + this.personalLsObj.SmokeStatusItem + "</web:SmokeStatusItem>" +
                    "<web:SmokeStatusItemId>" + this.personalLsObj.SmokeStatusItemId + "</web:SmokeStatusItemId>" +
                    "<web:SmokeLengthItem>" + this.personalLsObj.SmokeLengthItem + "</web:SmokeLengthItem>" +
                    "<web:SmokeLengthItemId>" + this.personalLsObj.SmokeLengthItemId + "</web:SmokeLengthItemId>" +
                    "<web:DrinkItem>" + this.personalLsObj.DrinkItem + "</web:DrinkItem>" +
                    "<web:DrinkItemId>" + this.personalLsObj.DrinkItemId + "</web:DrinkItemId>" +
                    "<web:ExerciseItem>" + this.personalLsObj.ExerciseItem + "</web:ExerciseItem>" +
                    "<web:ExerciseItemId>" + this.personalLsObj.ExerciseItemId + "</web:ExerciseItemId>" +
                    "<web:ExerciseLengthItem>" + this.personalLsObj.ExerciseLengthItem + "</web:ExerciseLengthItem>" +
                    "<web:ExerciseLengthItemId>" + this.personalLsObj.ExerciseLengthItemId + "</web:ExerciseLengthItemId>" +
                    "</web:Content><web:Demo/></web:EMR_PersonalAndLifeStyle_Save></soapenv:Body></soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var resp = result['soap:Envelope']['soap:Body'].EMR_PersonalAndLifeStyle_SaveResponse.EMR_PersonalAndLifeStyle_SaveResult;
                    if (resp.Successful == "true") {
                        self.healthView = false;
                    }
                    else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //console.log("Session expired or Error in Save PF");
                    }
                });
            }, function (e) {
                //console.log("Error::: " + e);
            });
        }
    };
    HealthRecordsComponent.prototype.updateOrAddSurgery = function (operation, surgname, when) {
        var _this = this;
        this.surgform = true;
        if (operation == 'Add') {
            operation = (operation == 'Add' && this.editorupdate.add == 1) ? "Add" : "Update";
            if (this.editorupdate.add == 1) {
                this.delSurgery.ItemId = 0;
                this.delSurgery.Surgery = this.surgery;
                this.delSurgery.When = this.surgwhen;
            }
            else {
                this.delSurgery.Surgery = this.surgery;
                this.delSurgery.When = this.surgwhen;
            }
        }
        if ((operation == 'Delete' || (surgname && when && this.surgery.trim() != '' && this.surgwhen.trim() != '')) && this.webapi.netConnectivityCheck()) {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<?xml version='1.0' encoding='UTF-8'?>" +
                    "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
                    "<soapenv:Body><web:EMR_SurgeryHistory_Save><web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
                    "<web:ItemId>" + this.delSurgery.ItemId + "</web:ItemId>" +
                    "<web:Surgery>" + this.delSurgery.Surgery + "</web:Surgery>" +
                    "<web:When>" + this.delSurgery.When + "</web:When>" +
                    "</web:Content><web:Action>" + operation + "</web:Action><web:Demo/>" +
                    "</web:EMR_SurgeryHistory_Save></soapenv:Body></soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var resp = result['soap:Envelope']['soap:Body'].EMR_SurgeryHistory_SaveResponse.EMR_SurgeryHistory_SaveResult;
                    self.delSurgery.selected = false;
                    if (resp.Successful == "true" && operation == 'Delete') {
                        self.surgHisList.splice(self.surgHisList.indexOf(self.delSurgery), 1);
                        self.delSurgery.indx = -1;
                    }
                    else if (resp.Successful == "true" && operation == 'Add') {
                        self.editSurgery = false;
                        var additem = resp.SurgeryHistoryList.EMR_SurgeryItem;
                        if (additem.length != undefined)
                            self.surgHisList.push({ "ItemId": additem[additem.length - 1].ItemId, "Surgery": additem[additem.length - 1].Surgery, "When": additem[additem.length - 1].When, "img": "res://rededit" });
                        else
                            self.surgHisList.push({ "ItemId": additem.ItemId, "Surgery": additem.Surgery, "When": additem.When, "img": "res://rededit" });
                    }
                    else if (resp.Successful == "true" && operation == 'Update') {
                        self.editSurgery = false;
                        self.surgHisList[self.delSurgery.index] = self.delSurgery;
                    }
                    else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //console.log("Session expired or Error in delete surgery");
                    }
                });
            }, function (e) {
                //console.log("Error:: " + e);
            });
        }
    };
    HealthRecordsComponent.prototype.onTabChange = function (args) {
        var tabView = args.object;
        switch (true) {
            case tabView.selectedIndex == 1 && this.drugList.length == 0:
                this.drugAllergyGet();
                break;
            case tabView.selectedIndex == 2 && this.medicationsList.length == 0:
                this.getMedicationsList();
                break;
            case tabView.selectedIndex == 3 && this.medicalConditionsList.length == 0:
                this.getMedicalConditionsList();
                break;
            case tabView.selectedIndex == 4 && this.surgHisList.length == 0:
                this.surgeryHisGet();
                break;
            case tabView.selectedIndex == 5 && this.familyHistory.length == 0:
                this.getFamilyHistoryList();
                break;
            case tabView.selectedIndex == 6 && this.medimglist.length == 0:
                this.medicalImagList();
                break;
            default:
        }
    };
    HealthRecordsComponent.prototype.drugAllergyGet = function () {
        var self = this;
        self.webapi.gridGetInHealth("EMR_DrugAllergy_Grid_Get").subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_EMRDrugAllergy_Grid.Successful == "true" && result.APIResult_EMRDrugAllergy_Grid.DrugAllergyCount != '0') {
                    self.drugList = [];
                    var drugs = result.APIResult_EMRDrugAllergy_Grid.DrugAllergyList.EMR_DrugAllergyItem;
                    if (drugs.length != undefined) {
                        for (var i = 0; i < drugs.length; i++) {
                            //	self.drugList.push(drugs[i]);
                            self.drugList.push({ "ItemId": drugs[i].ItemId, "Drug": drugs[i].Drug, "Reaction": drugs[i].Reaction, "img": "res://rededit" });
                        }
                    }
                    else {
                        self.drugList.push({ "ItemId": drugs.ItemId, "Drug": drugs.Drug, "Reaction": drugs.Reaction, "img": "res://rededit" });
                    }
                }
                else if (result.APIResult_EMRDrugAllergy_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                }
                else {
                    //console.log("error or no drug allergies");
                }
            });
        }, function (error) {
            //console.log("Error in Drug.... " + error);
        });
    };
    HealthRecordsComponent.prototype.showMedication = function () {
        this.medication = true;
    };
    HealthRecordsComponent.prototype.closeMedicationStatus = function () {
        this.medication = false;
    };
    HealthRecordsComponent.prototype.editMedicationDetails = function (medItem) {
        this.editMedication = true;
        this.mSubmitted = false;
        this.medicationItem = medItem;
        this.Medication = medItem.Medication;
        this.getMedicationUsageFrequency();
    };
    HealthRecordsComponent.prototype.closeMedication = function () {
        this.mSelectedIndex = null;
        this.msSelectedIndex = null;
        this.Medication = null;
        this.editMedication = false;
    };
    HealthRecordsComponent.prototype.getMedicationsList = function () {
        var self = this;
        self.medicationsList = [];
        self.webapi.getMedications_http().subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_EMRMedications_Grid.Successful == "true" && result.APIResult_EMRMedications_Grid.MedicationCount != '0') {
                    var m = parseInt(result.APIResult_EMRMedications_Grid.MedicationCount);
                    if (m == 1) {
                        result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem.img = "res://rededit";
                        self.medicationsList.push(result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem);
                    }
                    else {
                        for (var i = 0; i < m; i++) {
                            result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem[i].img = "res://rededit";
                            self.medicationsList.push(result.APIResult_EMRMedications_Grid.MedicationList.EMR_MedicationItem[i]);
                        }
                    }
                }
                else if (result.APIResult_EMRMedications_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                }
                else {
                    //console.log("Error/No Medications");
                }
            });
        }, function (error) {
            //console.log("Error in Medications.... " + error);
        });
    };
    HealthRecordsComponent.prototype.getMedicationUsageFrequency = function () {
        var self = this;
        if (self.medicationUsageFrequency.length == 0) {
            self.webapi.getCodeList("EMR_MedicationUsageFrequency").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CodeList.Successful == "true") {
                        for (var loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
                            self.medicationUsageFrequency.setItem(loop, {
                                value: result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId,
                                display: result.APIResult_CodeList.List.List.CodeListItem[loop].Value,
                            });
                            if (result.APIResult_CodeList.List.List.CodeListItem[loop].Value == self.medicationItem.Frequency) {
                                self.mSelectedIndex = loop;
                            }
                        }
                    }
                    else {
                        //console.log("Error/No Medications");
                    }
                });
            }, function (error) {
                //console.log("Error in Medications.... " + error);
            });
        }
        else {
            for (var loop = 0; loop < self.medicationUsageFrequency.length; loop++) {
                if (self.medicationUsageFrequency.getDisplay(loop) == self.medicationItem.Frequency) {
                    self.mSelectedIndex = loop;
                }
            }
        }
        for (var loop = 0; loop < self.medicationStatus.length; loop++) {
            if (self.medicationItem.Status.toLowerCase().indexOf("current") >= 0) {
                self.msSelectedIndex = 0;
            }
            else if ((self.medicationItem.Status.toLowerCase().indexOf("past") >= 0) || (self.medicalConditionItem.Status.toLowerCase().indexOf("before") >= 0)) {
                self.msSelectedIndex = 1;
            }
        }
    };
    HealthRecordsComponent.prototype.onMedicationUsageFrequencyChange = function (args) {
        this.mSelectedIndex = args.selectedIndex;
        this.updateMedicationItem.FrequencyItemId = this.medicationUsageFrequency.getValue(args.selectedIndex);
        this.updateMedicationItem.Frequency = this.medicationUsageFrequency.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onNedicationStatusChange = function (args) {
        this.msSelectedIndex = args.selectedIndex;
        this.updateMedicationItem.Status = this.medicationStatus.getValue(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.updateMedications = function () {
        var _this = this;
        this.mSubmitted = true;
        if (this.medicationItem.ItemId != undefined) {
            this.updateMedicationItem.Action = "Update";
            this.updateMedicationItem.ItemId = this.medicationItem.ItemId;
        }
        else {
            this.updateMedicationItem.Action = "Add";
            this.updateMedicationItem.ItemId = 0;
        }
        this.updateMedicationItem.Medication = this.Medication;
        if (this.updateMedicationItem.Medication != undefined && this.updateMedicationItem.Medication != "" && this.updateMedicationItem.Frequency != undefined && this.updateMedicationItem.Status != undefined) {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Header/>" +
                    "<soapenv:Body>" +
                    "<web:EMR_Medication_Save>" +
                    "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                    "<web:Content>" +
                    "<web:ItemId>" + this.updateMedicationItem.ItemId + "</web:ItemId>" +
                    "<web:Medication>" + this.updateMedicationItem.Medication + "</web:Medication>" +
                    "<web:Frequency>" + this.updateMedicationItem.Frequency + "</web:Frequency>" +
                    "<web:FrequencyItemId>" + this.updateMedicationItem.FrequencyItemId + "</web:FrequencyItemId>" +
                    "<web:Status>" + this.updateMedicationItem.Status + "</web:Status>" +
                    "</web:Content>" +
                    "<web:Action>" + this.updateMedicationItem.Action + "</web:Action>" +
                    "<web:Demo></web:Demo>" +
                    "</web:EMR_Medication_Save>" +
                    "</soapenv:Body>" +
                    "</soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var res = result['soap:Envelope']['soap:Body'].EMR_Medication_SaveResponse.EMR_Medication_SaveResult;
                    if (res.Successful == "true") {
                        self.editMedication = false;
                        self.getMedicationsList();
                    }
                    else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        alert("Error while updating medical condition. / Session expired.Try After some time ");
                        //console.log("Error while updating medical condition.");
                    }
                });
            }, function (e) {
                //console.log("Error:-- " + e);
            });
        }
    };
    HealthRecordsComponent.prototype.deleteMedications = function () {
        var _this = this;
        if (this.delMedication.Medication != undefined && this.delMedication.Frequency != undefined && this.delMedication.Status != undefined) {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Header/>" +
                    "<soapenv:Body>" +
                    "<web:EMR_Medication_Save>" +
                    "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                    "<web:Content>" +
                    "<web:ItemId>" + this.delMedication.ItemId + "</web:ItemId>" +
                    "<web:Medication>" + this.delMedication.Medication + "</web:Medication>" +
                    "<web:Frequency>" + this.delMedication.Frequency + "</web:Frequency>" +
                    "<web:FrequencyItemId>" + this.delMedication.FrequencyItemId + "</web:FrequencyItemId>" +
                    "<web:Status>" + this.delMedication.Status + "</web:Status>" +
                    "</web:Content>" +
                    "<web:Action>Delete</web:Action>" +
                    "<web:Demo></web:Demo>" +
                    "</web:EMR_Medication_Save>" +
                    "</soapenv:Body>" +
                    "</soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var res = result['soap:Envelope']['soap:Body'].EMR_Medication_SaveResponse.EMR_Medication_SaveResult;
                    if (res.Successful == "true") {
                        self.editMedication = false;
                        self.delMedication = {};
                        self.getMedicationsList();
                        self.delMedication.index = -1;
                    }
                    else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //	alert("Error while updating medical condition. / Session expired.Try After some time ");
                        //console.log("Error while updating medical condition.");
                    }
                });
            }, function (e) {
                //console.log("Error:++ " + e);
            });
        }
    };
    HealthRecordsComponent.prototype.addMedication = function () {
        this.editMedication = true;
        this.mSubmitted = false;
        this.medicationItem = {};
        this.mSelectedIndex = null;
        this.msSelectedIndex = null;
        this.Medication = "";
        this.getMedicationUsageFrequency();
    };
    HealthRecordsComponent.prototype.onSelectMedication = function (i, item) {
        for (var index_1 in this.medicationsList) {
            this.medicationsList[index_1].img = "res://rededit";
        }
        this.medicationsList[i].img = "res://checkedicon";
        this.delMedication = item;
        this.delMedication.selected = true;
        this.delMedication.index = i;
    };
    HealthRecordsComponent.prototype.editMedicalCondition = function (item) {
        this.editMode = true;
        this.mcSubmitted = false;
        this.medicalConditionItem = item;
        this.Description = item.Description;
        this.getEMRMedicalConditionsList();
    };
    HealthRecordsComponent.prototype.closeMedicalCondition = function () {
        this.mcSelectedIndex = null;
        this.mcsSelectedIndex = null;
        this.Description = "";
        this.editMode = false;
    };
    HealthRecordsComponent.prototype.onSelectMedicalCondition = function (i, item) {
        for (var index_2 in this.medicalConditionsList) {
            this.medicalConditionsList[index_2].img = "res://rededit";
        }
        this.medicalConditionsList[i].img = "res://checkedicon";
        this.delMedicalCondition = item;
        this.delMedicalCondition.selected = true;
        this.delMedicalCondition.index = i;
    };
    HealthRecordsComponent.prototype.getMedicalConditionsList = function () {
        var self = this;
        self.medicalConditionsList = [];
        self.webapi.getMedicalConditions_http().subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_EMRMedicalCondition_Grid.Successful == "true" && result.APIResult_EMRMedicalCondition_Grid.MedicalConditionCount != '0') {
                    var m = parseInt(result.APIResult_EMRMedicalCondition_Grid.MedicalConditionCount);
                    if (m == 1) {
                        result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem.img = "res://rededit";
                        self.medicalConditionsList.push(result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem);
                    }
                    else {
                        for (var i = 0; i < m; i++) {
                            result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem[i].img = "res://rededit";
                            self.medicalConditionsList.push(result.APIResult_EMRMedicalCondition_Grid.MedicalConditionList.EMR_MedicalConditionItem[i]);
                        }
                    }
                }
                else {
                    //console.log("Error/No Medications");
                }
            });
        }, function (error) {
            //console.log("Error in Medications.... " + error);
        });
    };
    HealthRecordsComponent.prototype.getEMRMedicalConditionsList = function () {
        var self = this;
        if (self.emrMedicalCondition.length == 0) {
            self.webapi.getCodeList("EMR_MedicalCondition").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CodeList.Successful == "true") {
                        for (var loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
                            self.emrMedicalCondition.setItem(loop, {
                                value: result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId,
                                display: result.APIResult_CodeList.List.List.CodeListItem[loop].Value,
                            });
                            if (result.APIResult_CodeList.List.List.CodeListItem[loop].Value == self.medicalConditionItem.MedicalCondition) {
                                self.mcSelectedIndex = loop;
                            }
                        }
                    }
                    else {
                        //console.log("Error/No Medications");
                    }
                });
            }, function (error) {
                //console.log("Error in Medications.... " + error);
            });
        }
        else {
            for (var loop = 0; loop < self.emrMedicalCondition.length; loop++) {
                if (self.medicalConditionItem.MedicalCondition == self.emrMedicalCondition.getDisplay(loop)) {
                    self.mcSelectedIndex = loop;
                }
            }
        }
        for (var loop = 0; loop < self.medicalConditionStatus.length; loop++) {
            if (self.medicalConditionItem.Status.toLowerCase().indexOf("current") >= 0) {
                self.mcsSelectedIndex = 0;
            }
            else if ((self.medicalConditionItem.Status.toLowerCase().indexOf("past") >= 0) || (self.medicalConditionItem.Status.toLowerCase().indexOf("before") >= 0)) {
                self.mcsSelectedIndex = 1;
            }
        }
    };
    HealthRecordsComponent.prototype.onMedicalConditionChange = function (args) {
        this.mcSelectedIndex = args.selectedIndex;
        this.updateMedCondition.MedicalConditionItemId = this.emrMedicalCondition.getValue(args.selectedIndex);
        this.updateMedCondition.MedicalCondition = this.emrMedicalCondition.getDisplay(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.onNedicalConditionStatusChange = function (args) {
        this.mcsSelectedIndex = args.selectedIndex;
        this.updateMedCondition.Status = this.medicalConditionStatus.getValue(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.updateMedicalCondition = function () {
        var _this = this;
        this.mcSubmitted = true;
        if (this.medicalConditionItem.ItemId != undefined) {
            this.updateMedCondition.Action = "Update";
            this.updateMedCondition.ItemId = this.medicalConditionItem.ItemId;
        }
        else {
            this.updateMedCondition.Action = "Add";
            this.updateMedCondition.ItemId = 0;
        }
        this.updateMedCondition.Description = this.Description;
        //this.updateMedCondition.Description = this.medicalConditionItem.Description;
        if (this.updateMedCondition.MedicalCondition != undefined && this.updateMedCondition.Description != "" && this.updateMedCondition.Description != undefined && this.updateMedCondition.Status != undefined) {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Header/>" +
                    "<soapenv:Body>" +
                    "<web:EMR_MedicalCondition_Save>" +
                    "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                    "<web:Content>" +
                    "<web:ItemId>" + this.updateMedCondition.ItemId + "</web:ItemId>" +
                    "<web:MedicalCondition>" + this.updateMedCondition.MedicalCondition + "</web:MedicalCondition>" +
                    "<web:MedicalConditionItemId>" + this.updateMedCondition.MedicalConditionItemId + "</web:MedicalConditionItemId>" +
                    "<web:Description>" + this.updateMedCondition.Description + "</web:Description>" +
                    "<web:Status>" + this.updateMedCondition.Status + "</web:Status>" +
                    "</web:Content>" +
                    "<web:Action>" + this.updateMedCondition.Action + "</web:Action>" +
                    "<web:Demo></web:Demo>" +
                    "</web:EMR_MedicalCondition_Save>" +
                    "</soapenv:Body>" +
                    "</soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var res = result['soap:Envelope']['soap:Body'].EMR_MedicalCondition_SaveResponse.EMR_MedicalCondition_SaveResult;
                    if (res.Successful == "true") {
                        self.editMode = false;
                        self.getMedicalConditionsList();
                    }
                    else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        alert("Error while updating medical condition. / Session expired.Try After some time ");
                        //console.log("Error while updating medical condition.");
                    }
                });
            }, function (e) {
                //console.log("Error:> " + e);
            });
        }
    };
    HealthRecordsComponent.prototype.deleteMedicalConditions = function () {
        var _this = this;
        if (this.delMedicalCondition.MedicalCondition != undefined && this.delMedicalCondition.Description != undefined && this.delMedicalCondition.Status != undefined) {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Header/>" +
                    "<soapenv:Body>" +
                    "<web:EMR_MedicalCondition_Save>" +
                    "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                    "<web:Content>" +
                    "<web:ItemId>" + this.delMedicalCondition.ItemId + "</web:ItemId>" +
                    "<web:MedicalCondition>" + this.delMedicalCondition.MedicalCondition + "</web:MedicalCondition>" +
                    "<web:MedicalConditionItemId>" + this.delMedicalCondition.MedicalConditionItemId + "</web:MedicalConditionItemId>" +
                    "<web:Description>" + this.delMedicalCondition.Description + "</web:Description>" +
                    "<web:Status>" + this.delMedicalCondition.Status + "</web:Status>" +
                    "</web:Content>" +
                    "<web:Action>Delete</web:Action>" +
                    "<web:Demo></web:Demo>" +
                    "</web:EMR_MedicalCondition_Save>" +
                    "</soapenv:Body>" +
                    "</soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var res = result['soap:Envelope']['soap:Body'].EMR_MedicalCondition_SaveResponse.EMR_MedicalCondition_SaveResult;
                    if (res.Successful == "true") {
                        self.editMode = false;
                        self.delMedicalCondition.index = -1;
                        self.getMedicalConditionsList();
                        self.delMedicalCondition = {};
                    }
                    else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        alert("Error while updating medical condition. / Session expired.Try After some time ");
                        //console.log("Error while updating medical condition.");
                    }
                });
            }, function (e) {
                //console.log("Error:<< " + e);
            });
        }
    };
    HealthRecordsComponent.prototype.addMedicalCondition = function () {
        this.editMode = true;
        this.mcSubmitted = false;
        this.medicalConditionItem = {};
        this.mcSelectedIndex = null;
        this.mcsSelectedIndex = null;
        this.getEMRMedicalConditionsList();
    };
    HealthRecordsComponent.prototype.surgeryHisGet = function () {
        var self = this;
        self.webapi.gridGetInHealth("EMR_SurgeryHistory_Grid_Get").subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_EMRSurgeryHistory_Grid.Successful == "true" && result.APIResult_EMRSurgeryHistory_Grid.SurgeryHistoryCount != '0') {
                    self.surgHisList = [];
                    var surgery = result.APIResult_EMRSurgeryHistory_Grid.SurgeryHistoryList.EMR_SurgeryItem;
                    if (surgery.length != undefined) {
                        for (var i = 0; i < surgery.length; i++) {
                            self.surgHisList.push({ "ItemId": surgery[i].ItemId, "Surgery": surgery[i].Surgery, "When": surgery[i].When, "img": "res://rededit" });
                        }
                    }
                    else {
                        self.surgHisList.push({ "ItemId": surgery.ItemId, "Surgery": surgery.Surgery, "When": surgery.When, "img": "res://rededit" });
                    }
                }
                else if (result.APIResult_EMRSurgeryHistory_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                }
                else {
                    //console.log("error or no sugery his-->" + result.APIResult_EMRSurgeryHistory_Grid.Message);
                }
            });
        }, function (error) {
            //console.log("Error in Surgery His " + error);
        });
    };
    HealthRecordsComponent.prototype.medicalImagList = function () {
        var self = this;
        self.webapi.gridGetInHealth("EMR_MedicalImage_Grid_Get").subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_EMRMedicalImage_Grid.Successful == "true" && result.APIResult_EMRMedicalImage_Grid.MedicalImageCount != '0') {
                    self.medimglist = [];
                    self.imageViewArray = [];
                    var images = result.APIResult_EMRMedicalImage_Grid.MedicalImageList.EMR_MedicalImageItem;
                    if (images.length != undefined) {
                        for (var i = 0; i < images.length; i++) {
                            self.medimglist.push(images[i]);
                            self.imageViewArray.push('https://www.247calladoc.com/member/' + self.medimglist[i].ImageSourceSmallURL);
                        }
                    }
                    else {
                        self.medimglist.push(images);
                    }
                    self.createItemSpec(self.medimglist.length / 3);
                }
                else if (result.APIResult_EMRMedicalImage_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                }
                else {
                    //console.log("error / no images-->" + result.APIResult_EMRMedicalImage_Grid.Message);
                }
            });
        }, function (error) {
            //console.log("Error in Medical Images His " + error);
        });
    };
    HealthRecordsComponent.prototype.createItemSpec = function (length) {
        for (var i = 0; i < length; i++) {
            this.itemSpec.push("auto");
        }
        return this.itemSpec.join(",");
    };
    HealthRecordsComponent.prototype.isValidDate = function () {
        var date = this.imgdate;
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
    HealthRecordsComponent.prototype.editDrug = function (item, i) {
        if (this.deleteDrugObj.selected != true) {
            this.isVisible = true;
            this.deleteDrugObj = {};
            this.drugname = item.Drug;
            this.editorupdate.add = 0;
            this.drugform = false;
            this.reaction = item.Reaction;
            this.deleteDrugObj.ItemId = item.ItemId;
            this.deleteDrugObj.index = i;
            this.deleteDrugObj.img = "res://rededit";
        }
    };
    HealthRecordsComponent.prototype.editSurgeryHis = function (item, i) {
        if (this.delSurgery.selected != true) {
            this.editSurgery = true;
            this.delSurgery = {};
            this.surgery = item.Surgery;
            this.editorupdate.add = 0;
            this.surgform = false;
            this.surgwhen = item.When;
            this.delSurgery.ItemId = item.ItemId;
            this.delSurgery.index = i;
            this.delSurgery.img = "res://rededit";
        }
    };
    HealthRecordsComponent.prototype.addDrug = function () {
        this.isVisible = true;
        this.drugname = "";
        this.reaction = "";
        this.deleteDrugObj = {};
        this.editorupdate.add = 1;
        this.drugform = false;
    };
    HealthRecordsComponent.prototype.addSurgery = function () {
        this.editSurgery = true;
        this.surgery = "";
        this.surgwhen = "";
        this.delSurgery = {};
        this.editorupdate.add = 1;
        this.surgform = false;
    };
    HealthRecordsComponent.prototype.editMedicalImages = function () {
        this.editMedImg = true;
        this.medimgform = false;
        this.imgdate = "";
        this.pic1 = null;
    };
    HealthRecordsComponent.prototype.popupclose = function () {
        this.isVisible = false;
        this.editSurgery = false;
        this.editMedImg = false;
    };
    HealthRecordsComponent.prototype.onSelectDrug = function (i, item) {
        for (var index_3 in this.drugList) {
            this.drugList[index_3].img = "res://rededit";
        }
        this.drugList[i].img = "res://checkedicon";
        this.deleteDrugObj = item;
        this.deleteDrugObj.selected = true;
        this.deleteDrugObj.indx = i;
    };
    HealthRecordsComponent.prototype.cancelSelect = function () {
        this.deleteDrugObj.selected = false;
        this.delSurgery.selected = false;
        this.delMedication.selected = false;
        this.delMedicalCondition.selected = false;
        for (var i in this.drugList) {
            this.drugList[i].img = "res://rededit";
            this.deleteDrugObj.indx = -1;
        }
        for (var j in this.surgHisList) {
            this.surgHisList[j].img = "res://rededit";
            this.delSurgery.indx = -1;
        }
        for (var k in this.medicationsList) {
            this.medicationsList[k].img = "res://rededit";
            this.delMedication.index = -1;
        }
        for (var l in this.medicalConditionsList) {
            this.medicalConditionsList[l].img = "res://rededit";
            this.delMedicalCondition.index = -1;
        }
    };
    HealthRecordsComponent.prototype.onSelectSurgery = function (i, item) {
        for (var index_4 in this.surgHisList) {
            this.surgHisList[index_4].img = "res://rededit";
        }
        this.surgHisList[i].img = "res://checkedicon";
        this.delSurgery = item;
        this.delSurgery.selected = true;
        this.delSurgery.indx = i;
    };
    HealthRecordsComponent.prototype.updateOrAddDrug = function (operation, drug, react) {
        var _this = this;
        this.drugform = true;
        if (operation == 'Add') {
            operation = (operation == 'Add' && this.editorupdate.add == 1) ? "Add" : "Update";
            if (this.editorupdate.add == 1) {
                this.deleteDrugObj.ItemId = 0;
                this.deleteDrugObj.Drug = this.drugname;
                this.deleteDrugObj.Reaction = this.reaction;
            }
            else {
                this.deleteDrugObj.Drug = this.drugname;
                this.deleteDrugObj.Reaction = this.reaction;
            }
        }
        if ((operation == 'Delete' || (drug && react && this.drugname.trim() != '' && this.reaction.trim() != '')) && this.webapi.netConnectivityCheck()) {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<?xml version='1.0' encoding='UTF-8'?>" +
                    "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
                    "<soapenv:Body><web:EMR_DrugAllergy_Save><web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId><web:Content>" +
                    "<web:ItemId>" + this.deleteDrugObj.ItemId + "</web:ItemId>" +
                    "<web:Drug>" + this.deleteDrugObj.Drug + "</web:Drug>" +
                    "<web:Reaction>" + this.deleteDrugObj.Reaction + "</web:Reaction>" +
                    "</web:Content><web:Action>" + operation + "</web:Action><web:Demo/>" +
                    "</web:EMR_DrugAllergy_Save></soapenv:Body></soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    self.deleteDrugObj.selected = false;
                    self.deleteDrugObj.indx = -1;
                    var resp = result['soap:Envelope']['soap:Body'].EMR_DrugAllergy_SaveResponse.EMR_DrugAllergy_SaveResult;
                    if (resp.Successful == "true" && operation == 'Delete') {
                        self.drugList.splice(self.drugList.indexOf(self.deleteDrugObj), 1);
                    }
                    else if (resp.Successful == "true" && operation == 'Add') {
                        self.isVisible = false;
                        var additem = resp.DrugAllergyList.EMR_DrugAllergyItem;
                        if (additem.length != undefined)
                            self.drugList.push({ "ItemId": additem[additem.length - 1].ItemId, "Drug": additem[additem.length - 1].Drug, "Reaction": additem[additem.length - 1].Reaction, "img": "res://rededit" });
                        else
                            self.drugList.push({ "ItemId": additem.ItemId, "Drug": additem.Drug, "Reaction": additem.Reaction, "img": "res://rededit" });
                    }
                    else if (resp.Successful == "true" && operation == 'Update') {
                        self.isVisible = false;
                        self.drugList[self.deleteDrugObj.index] = self.deleteDrugObj;
                    }
                    else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        //console.log("Session expired or Error in delete drug " + result.Message);
                    }
                });
            }, function (e) {
                //console.log("Error:// " + e);
            });
        }
    };
    HealthRecordsComponent.prototype.onSelectSingleTap = function () {
        if (this.pic1 == null) {
            var context = imagepicker.create({
                mode: "single"
            });
            this.startSelection(context);
        }
        else {
            alert("User can upload only 1 images");
        }
    };
    HealthRecordsComponent.prototype.startSelection = function (context) {
        var _that = this;
        context
            .authorize()
            .then(function () {
            return context.present();
        })
            .then(function (selection) {
            selection.forEach(function (selected) {
                selected.getImage().then(function (res) {
                    //	if (application.android) {
                    _that.imgdtls.imageName = "test.jpg";
                    _that.imgdtls.base64textString = res.toBase64String("jpg", 10);
                    _that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
                    /*	} else if (application.ios) {
                            let defManager = NSFileManager.defaultManager;
                            let fileAttributes = defManager.attributesOfItemAtPathError(selected.fileUri);
                            console.log("ios");
                            console.log(defManager);
                            let fileSizeNumber = fileAttributes.objectForKey(NSFileSize);
                            console.log(fileSizeNumber);
                            _that.imgdtls.imageSize = fileSizeNumber / 1000;
                            //   file_size = fileSizeNumber / 1000;
                            console.log("file size in bytes");
                    }*/
                });
                if (_that.pic1 == null) {
                    _that.pic1 = selected;
                }
            });
            _that._changeDetectionRef.detectChanges();
        }).catch(function (e) {
            console.log(e);
        });
    };
    HealthRecordsComponent.prototype.onRequestPermissionsTap = function () {
        var _this = this;
        if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
            permissions.requestPermission(android.Manifest.permission.CAMERA, "I need these permissions to read from storage")
                .then(function () {
                //console.log("Permissions granted!");
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
    //cameraImage: ImageAsset;
    HealthRecordsComponent.prototype.onTakePictureTap = function () {
        var _that = this;
        nativescript_camera_1.takePicture({ width: 180, height: 180, keepAspectRatio: false, saveToGallery: true })
            .then(function (imageAsset) {
            var source = new image_source_1.ImageSource();
            source.fromAsset(imageAsset).then(function (source) {
                //console.log(`Size: ${source.width}x${source.height}`);
                _that.imgdtls.imageName = "sample.jpg";
                _that.imgdtls.base64textString = source.toBase64String("jpg", 10);
                _that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
            });
            //	_that.cameraImage = imageAsset;
            if (_that.pic1 == null) {
                _that.pic1 = imageAsset;
            }
        }, function (error) {
            //console.log("Error: " + error);
        });
    };
    HealthRecordsComponent.prototype.deleteImage = function (id) {
        if (id == "pic1") {
            this.pic1 = null;
        }
    };
    HealthRecordsComponent.prototype.deleteImageWithConfirm = function (date, operation, data) {
        var self = this;
        dialogs.confirm({
            message: "Are you sure you want to delete image?",
            okButtonText: "Yes",
            cancelButtonText: "No",
        }).then(function (result) {
            if (result)
                self.delOrUploadMedImage(date, operation, data);
        });
    };
    HealthRecordsComponent.prototype.delOrUploadMedImage = function (date, operation, data) {
        var item = {};
        this.medimgform = true;
        if (this.webapi.netConnectivityCheck()) {
            var self_1 = this;
            self_1.webapi.loader.show(self_1.webapi.options);
            if (operation == "Add") {
                item.ItemId = 0;
                item.ImageTakeTime = this.imgdate;
                item.TheDocument = {};
                item.ImageSourceSmallURL = "test";
                item.ImageSourceNormalURL = "test";
                item.TheDocument.FileName = this.imgdtls.imageName;
                item.TheDocument.DocumentType = "MedicalImage";
                item.TheDocument.FileSize = this.imgdtls.imageSize;
                item.TheDocument.FileData = this.imgdtls.base64textString;
                item.TheDocument.ItemId = "0";
            }
            else if (operation == "Delete") {
                item.TheDocument = {};
                item.ItemId = data.ItemId;
                item.TheDocument = data.TheDocument;
                item.TheDocument.FileData = "";
                item.ImageTakeTime = "";
                item.ImageSourceSmallURL = "";
                item.ImageSourceNormalURL = "";
                item.TheDocument.ItemId = "";
                item.TheDocument.FileName = "";
                item.TheDocument.FileSize = 0;
                item.TheDocument.FileData = "";
            }
            if (((date && this.isValidDate() && this.pic1 != null) || (operation == 'Delete')) && this.webapi.netConnectivityCheck()) {
                http_request.request({
                    url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                    method: "POST",
                    headers: { "Content-Type": "text/xml" },
                    content: "<?xml version='1.0' encoding='utf-8'?>" +
                        "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
                        "<soapenv:Body>" +
                        "<web:EMR_MedicalImage_Save xmlns='https://www.247CallADoc.com/WebServices/'>" +
                        "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                        "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                        "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                        "<web:Action>" + operation + "</web:Action>" +
                        "<web:Content>" + "<web:ItemId>" + item.ItemId + "</web:ItemId>" +
                        "<web:ImageTakeTime>" + item.ImageTakeTime + "</web:ImageTakeTime>" +
                        "<web:ImageSourceSmallURL>" + item.ImageSourceSmallURL + "</web:ImageSourceSmallURL>" +
                        "<web:ImageSourceNormalURL>" + item.ImageSourceNormalURL + "</web:ImageSourceNormalURL>" +
                        "<web:TheDocument>" +
                        "<web:DocumentType>" + item.TheDocument.DocumentType + "</web:DocumentType>" +
                        "<web:ItemId>" + item.TheDocument.ItemId + "</web:ItemId>" +
                        "<web:FileName>" + item.TheDocument.FileName + "</web:FileName>" +
                        "<web:FileSize>" + item.TheDocument.FileSize + "</web:FileSize>" +
                        "<web:FileData>" + item.TheDocument.FileData + "</web:FileData>" +
                        "</web:TheDocument></web:Content><web:Demo/></web:EMR_MedicalImage_Save></soapenv:Body>" +
                        "</soapenv:Envelope>"
                }).then(function (response) {
                    xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                        //console.log(response.content);
                        self_1.webapi.loader.hide();
                        if (result) {
                            var resp = result['soap:Envelope']['soap:Body'].EMR_MedicalImage_SaveResponse.EMR_MedicalImage_SaveResult;
                            if (resp.Successful == "true" && operation == "Add") {
                                self_1.medicalImagList();
                                //console.log(":::::::::::::::::::::::SUCCESS::::::::::::::::::::::::::::");
                                self_1.editMedImg = false;
                                self_1.pic1 = null;
                            }
                            else if (resp.Successful == "true" && operation == "Delete") {
                                var indx = self_1.medimglist.indexOf(data);
                                self_1.medimglist.splice(indx, 1);
                                self_1.imageViewArray.splice(indx, 1);
                            }
                            else if (resp.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                                self_1.webapi.logout();
                            }
                            else {
                                self_1.editMedImg = false;
                                self_1.pic1 = null;
                                alert("Image format or size is not supported. Please try with another image.");
                            }
                        }
                    });
                }, function (e) {
                    self_1.webapi.loader.hide();
                    //console.log("Error:... " + e);
                });
            }
        }
    };
    HealthRecordsComponent.prototype.ViewFamilyHistory = function (fItemId) {
        this.viewFamily = true;
        this.familyHistoryItem = [];
        this.updateFamilyHistoryItem = {};
        for (var i = 0; i < this.familyHistory.length; i++) {
            if (fItemId == this.familyHistory[i].ConditionItemId) {
                this.familyHistoryItem.push(this.familyHistory[i]);
            }
        }
        this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[0].Answer;
        this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[0].Condition;
        this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[0].ConditionItemId;
    };
    HealthRecordsComponent.prototype.closeViewFamilyHistory = function () {
        this.viewFamily = false;
    };
    HealthRecordsComponent.prototype.editFamilyHistory = function (fItemId) {
        this.editFamily = true;
        this.addNewMember = false;
        this.familyHistoryItem = [];
        this.updateFamilyHistoryItem = {};
        for (var i = 0; i < this.familyHistory.length; i++) {
            if (fItemId == this.familyHistory[i].ConditionItemId) {
                this.familyHistoryItem.push(this.familyHistory[i]);
            }
        }
        this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[0].Answer;
        this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[0].Condition;
        this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[0].ConditionItemId;
        this.fSelectedIndex = null;
        this.getFamilyHistoryWho();
    };
    HealthRecordsComponent.prototype.editFamilyHistoryItem = function (itemId) {
        this.addNewMember = true;
        for (var i = 0; i < this.familyHistoryItem.length; i++) {
            if (itemId == this.familyHistoryItem[i].ItemId) {
                this.updateFamilyHistoryItem.WhoItemId = this.familyHistoryItem[i].WhoItemId;
                this.updateFamilyHistoryItem.WhatAge = this.familyHistoryItem[i].WhatAge;
                this.updateFamilyHistoryItem.Description = this.familyHistoryItem[i].Description;
                this.updateFamilyHistoryItem.ItemId = this.familyHistoryItem[i].ItemId;
                this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[i].Answer;
                this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[i].Condition;
                this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[i].ConditionItemId;
            }
        }
        for (var loop = 0; loop < this.familyHistoryWho.length; loop++) {
            if (this.updateFamilyHistoryItem.WhoItemId == this.familyHistoryWho.getValue(loop)) {
                this.fSelectedIndex = loop;
            }
        }
    };
    HealthRecordsComponent.prototype.closeFamilyHistory = function () {
        this.editFamily = false;
        this.fSelectedIndex = null;
        this.getFamilyHistoryList();
    };
    HealthRecordsComponent.prototype.onAnswerChange = function (ans) {
        this.updateFamilyHistoryItem.Answer = ans;
        this.addNewMember = false;
        if (ans == 'Y')
            this.familyHistoryItem[0].Answer = ans;
    };
    HealthRecordsComponent.prototype.getFamilyHistoryList = function () {
        var self = this;
        self.webapi.getFamilyHistory_http().subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                var l = parseInt(result.APIResult_EMRFamilyHistory_Grid.FamilyHistoryCount);
                if (result.APIResult_EMRFamilyHistory_Grid.Successful == "true" && l > 0) {
                    self.familyHistory = [];
                    if (l > 1) {
                        for (var i = 0; i < l; i++) {
                            self.familyHistory.push(result.APIResult_EMRFamilyHistory_Grid.FamilyHistoryList.EMR_FamilyHistoryItem[i]);
                        }
                    }
                    else {
                        self.familyHistory.push(result.APIResult_EMRFamilyHistory_Grid.FamilyHistoryList.EMR_FamilyHistoryItem);
                    }
                    for (var l_1 = 0; l_1 < self.familyHistory.length; l_1++) {
                        for (var m = 0; m < self.familyHistoryCondition.length; m++) {
                            if (self.familyHistory[l_1].ConditionItemId == self.familyHistoryCondition[m].ItemId) {
                                self.familyHistoryCondition[m].Answer = self.familyHistory[l_1].Answer;
                            }
                        }
                    }
                }
                else if (result.APIResult_EMRFamilyHistory_Grid.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.logout();
                }
                else {
                    //console.log("Error or No family History");
                }
            });
        }, function (error) {
            //console.log("Error in Family History.... " + error);
        });
    };
    HealthRecordsComponent.prototype.getFamilyHistoryWho = function () {
        var self = this;
        if (self.familyHistoryWho.length == 0) {
            self.webapi.getCodeList("EMR_FamilyHistoryWho").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CodeList.Successful == "true") {
                        for (var loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
                            self.familyHistoryWho.setItem(loop, {
                                value: result.APIResult_CodeList.List.List.CodeListItem[loop].ItemId,
                                display: result.APIResult_CodeList.List.List.CodeListItem[loop].Value,
                            });
                            if (result.APIResult_CodeList.List.List.CodeListItem[loop].Value == self.familyHistoryItem.Who) {
                                self.fSelectedIndex = loop;
                            }
                        }
                    }
                    else {
                        //console.log("Error/No Medications");
                    }
                });
            }, function (error) {
                //console.log("Error in Medications.... " + error);
            });
        }
        else {
            for (var loop = 0; loop < self.familyHistoryWho.length; loop++) {
                if (self.familyHistoryItem.Who == self.familyHistoryWho.getDisplay(loop)) {
                    self.fSelectedIndex = loop;
                }
            }
        }
    };
    HealthRecordsComponent.prototype.showForm = function () {
        this.addNewMember = true;
        this.updateFamilyHistoryItem = {};
        this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[0].Answer;
        this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[0].Condition;
        this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[0].ConditionItemId;
        this.fSelectedIndex = null;
    };
    HealthRecordsComponent.prototype.hideForm = function () {
        this.addNewMember = false;
    };
    HealthRecordsComponent.prototype.addNewFamilyHistoryItem = function () {
        var _this = this;
        this.addFHForm = true;
        if (this.updateFamilyHistoryItem.ItemId != undefined && parseInt(this.updateFamilyHistoryItem.ItemId) != 0) {
            this.updateFamilyHistoryItem.Action = "Update";
        }
        else {
            this.updateFamilyHistoryItem.ItemId = 0;
            this.updateFamilyHistoryItem.Action = "Add";
        }
        if (this.updateFamilyHistoryItem.Description == undefined || this.updateFamilyHistoryItem.Description == null) {
            this.updateFamilyHistoryItem.Description = "";
        }
        if (this.updateFamilyHistoryItem.Who != undefined && this.updateFamilyHistoryItem.Who != "" && this.updateFamilyHistoryItem.WhatAge != undefined && this.updateFamilyHistoryItem.WhatAge != "") {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Header/>" +
                    "<soapenv:Body>" +
                    "<web:EMR_FamilyHistory_Save xmlns='https://www.247CallADoc.com/WebServices/'>" +
                    "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                    "<web:Content>" +
                    "<web:Answer>" + this.updateFamilyHistoryItem.Answer + "</web:Answer>" +
                    "<web:ItemId>" + this.updateFamilyHistoryItem.ItemId + "</web:ItemId>" +
                    "<web:Condition>" + this.updateFamilyHistoryItem.Condition + "</web:Condition>" +
                    "<web:ConditionItemId>" + this.updateFamilyHistoryItem.ConditionItemId + "</web:ConditionItemId>" +
                    "<web:Who>" + this.updateFamilyHistoryItem.Who + "</web:Who>" +
                    "<web:WhoItemId>" + this.updateFamilyHistoryItem.WhoItemId + "</web:WhoItemId>" +
                    "<web:WhatAge>" + this.updateFamilyHistoryItem.WhatAge + "</web:WhatAge>" +
                    "<web:Description>" + this.updateFamilyHistoryItem.Description + "</web:Description>" +
                    "</web:Content>" +
                    "<web:Action>" + this.updateFamilyHistoryItem.Action + "</web:Action>" +
                    "<web:Demo></web:Demo>" +
                    "</web:EMR_FamilyHistory_Save>" +
                    "</soapenv:Body>" +
                    "</soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var res = result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult;
                    if (res.Successful == "true") {
                        self.familyHistoryItem = []; //this.updateFamilyHistoryItem={};
                        var l = parseInt(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryCount);
                        for (var i = 0; i < l; i++) {
                            if (self.updateFamilyHistoryItem.ConditionItemId == result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i].ConditionItemId) {
                                self.familyHistoryItem.push(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i]);
                            }
                        }
                        self.addFHForm = false;
                        self.addNewMember = false;
                        self.fSelectedIndex = null;
                    }
                    else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        alert("Error while updating family History item. / Session expired.Try After some time ");
                        //console.log("Error while updating medical condition.");
                    }
                });
            }, function (e) {
                //console.log("Error:? " + e.Message);
            });
        }
    };
    HealthRecordsComponent.prototype.deleteFamilyHistoryItem = function (itemId) {
        var _this = this;
        for (var i = 0; i < this.familyHistoryItem.length; i++) {
            if (itemId == this.familyHistoryItem[i].ItemId) {
                this.updateFamilyHistoryItem.Who = this.familyHistoryItem[i].Who;
                this.updateFamilyHistoryItem.WhoItemId = this.familyHistoryItem[i].WhoItemId;
                this.updateFamilyHistoryItem.WhatAge = this.familyHistoryItem[i].WhatAge;
                this.updateFamilyHistoryItem.Description = this.familyHistoryItem[i].Description;
                this.updateFamilyHistoryItem.ItemId = this.familyHistoryItem[i].ItemId;
                this.updateFamilyHistoryItem.Answer = this.familyHistoryItem[i].Answer;
                this.updateFamilyHistoryItem.Condition = this.familyHistoryItem[i].Condition;
                this.updateFamilyHistoryItem.ConditionItemId = this.familyHistoryItem[i].ConditionItemId;
            }
        }
        if (this.updateFamilyHistoryItem.Who != undefined && this.updateFamilyHistoryItem.Who != "" && this.updateFamilyHistoryItem.WhatAge != undefined && this.updateFamilyHistoryItem.WhatAge != "") {
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_EMR.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'>" +
                    "<soapenv:Header/>" +
                    "<soapenv:Body>" +
                    "<web:EMR_FamilyHistory_Save xmlns='https://www.247CallADoc.com/WebServices/'>" +
                    "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                    "<web:Content>" +
                    "<web:Answer>" + this.updateFamilyHistoryItem.Answer + "</web:Answer>" +
                    "<web:ItemId>" + this.updateFamilyHistoryItem.ItemId + "</web:ItemId>" +
                    "<web:Condition>" + this.updateFamilyHistoryItem.Condition + "</web:Condition>" +
                    "<web:ConditionItemId>" + this.updateFamilyHistoryItem.ConditionItemId + "</web:ConditionItemId>" +
                    "<web:Who>" + this.updateFamilyHistoryItem.Who + "</web:Who>" +
                    "<web:WhoItemId>" + this.updateFamilyHistoryItem.WhoItemId + "</web:WhoItemId>" +
                    "<web:WhatAge>" + this.updateFamilyHistoryItem.WhatAge + "</web:WhatAge>" +
                    "<web:Description>" + this.updateFamilyHistoryItem.Description + "</web:Description>" +
                    "</web:Content>" +
                    "<web:Action>Delete</web:Action>" +
                    "<web:Demo></web:Demo>" +
                    "</web:EMR_FamilyHistory_Save>" +
                    "</soapenv:Body>" +
                    "</soapenv:Envelope>"
            }).then(function (response) {
                var self = _this;
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    var res = result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult;
                    if (res.Successful == "true") {
                        self.familyHistoryItem = []; //this.updateFamilyHistoryItem={};
                        var l = parseInt(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryCount);
                        for (var i = 0; i < l; i++) {
                            if (self.updateFamilyHistoryItem.ConditionItemId == result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i].ConditionItemId) {
                                self.familyHistoryItem.push(result['soap:Envelope']['soap:Body'].EMR_FamilyHistory_SaveResponse.EMR_FamilyHistory_SaveResult.FamilyHistoryList.EMR_FamilyHistoryItem[i]);
                            }
                        }
                        self.addFHForm = false;
                        self.addNewMember = false;
                        self.fSelectedIndex = null;
                    }
                    else if (res.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        alert("Error while updating family History item. / Session expired.Try After some time ");
                        //console.log("Error while updating medical condition.");
                    }
                });
            }, function (e) {
                //console.log("Error:>>>> " + e.Message);
            });
        }
    };
    HealthRecordsComponent.prototype.onFamilyHistoryWhoChange = function (args) {
        this.fSelectedIndex = args.selectedIndex;
        this.updateFamilyHistoryItem.Who = this.familyHistoryWho.getDisplay(args.selectedIndex);
        this.updateFamilyHistoryItem.WhoItemId = this.familyHistoryWho.getValue(args.selectedIndex);
    };
    HealthRecordsComponent.prototype.updateFamilyCondition = function () {
        //	console.log(this.familyHistoryItem[0].ItemId + "  +++  " + this.familyHistoryItem.length);
        if (this.familyHistoryItem[0].ItemId == 0 && !this.addNewMember) {
            var self_2 = this;
            var conditionId = this.updateFamilyHistoryItem.ConditionItemId;
            var type = this.updateFamilyHistoryItem.Answer;
            if (type == "Y") {
                type = "Yes";
            }
            else if (type == "N") {
                type = "None";
            }
            else if (type == "U") {
                type = "Unknown";
            }
            self_2.webapi.setFamilyHistoryCondition_http(conditionId, type).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        self_2.closeFamilyHistory();
                    }
                    else {
                        //console.log("Error in Updating Family History Conditions");
                    }
                });
            }, function (error) {
                //console.log("Error in Updating Family History Condition.... " + error);
            });
        }
    };
    HealthRecordsComponent.prototype.goback = function () {
        if (this.requestconsult.ServiceName != undefined) {
            if (this.webapi.netConnectivityCheck()) {
                //this.consultationFeeDetails();
                var navigationExtras = {
                    queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
                };
                this.router.navigate(["/healthrecords"], navigationExtras);
            }
        }
        else {
            this.rs.navigate(["/home"], { clearHistory: true });
        }
    };
    HealthRecordsComponent.prototype.consultationFeeDetails = function () {
        var self = this;
        self.webapi.loader.show(self.webapi.options);
        self.webapi.consultationFeeDetails(this.requestconsult.ServiceType).subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult_ConsultFee.Successful == "true") {
                    self.requestconsult.ConsultAvailable = result.APIResult_ConsultFee.ConsultAvailable;
                    self.requestconsult.ConsultFee = result.APIResult_ConsultFee.ConsultFee;
                    self.requestconsult.FeeDescription = result.APIResult_ConsultFee.FeeDescription;
                    if (self.requestconsult.FeeDescription != "Free") {
                        self.showingPayment();
                    }
                    else {
                        self.freeCheckUp();
                    }
                }
                else {
                    self.webapi.loader.hide();
                    //console.log("Session expired/Acccess denied .Try after some time ...");
                }
            });
        }, function (error) {
            self.webapi.loader.hide();
            //console.log("Error in Consultation feedetails... " + error);
        });
    };
    HealthRecordsComponent.prototype.showingPayment = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.webapi.loader.hide();
        if (this.requestconsult.ServiceType == 3 && this.requestconsult.UserPreferredPharmacy != null) {
            this.router.navigate(["/pharmacy"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 3) {
            this.router.navigate(["/searchpharmacy"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 4) {
            this.router.navigate(["/creditcard"], navigationExtras);
        }
    };
    HealthRecordsComponent.prototype.freeCheckUp = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.webapi.loader.hide();
        if (this.requestconsult.ServiceType == 3 && this.requestconsult.UserPreferredPharmacy != null) {
            this.router.navigate(["/pharmacy"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 3 && this.requestconsult.UserPreferredPharmacy == null) {
            this.router.navigate(["/searchpharmacy"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 4) {
            this.router.navigate(["/secureemail"], navigationExtras);
        }
    };
    HealthRecordsComponent.prototype.showImageInPhotoViewer = function (i) {
        this.photoViewer.showViewer(this.imageViewArray);
    };
    return HealthRecordsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], HealthRecordsComponent.prototype, "rscomp", void 0);
HealthRecordsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./healthrecords.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, core_1.ChangeDetectorRef, router_1.Router, router_1.ActivatedRoute, router_2.RouterExtensions])
], HealthRecordsComponent);
exports.HealthRecordsComponent = HealthRecordsComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRocmVjb3Jkcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoZWFsdGhyZWNvcmRzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFnRjtBQUNoRixnQ0FBK0I7QUFDL0IseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSxrRUFBZ0U7QUFDaEUsaUVBQW1EO0FBRW5ELHNEQUF3RDtBQUN4RCwyREFBa0Q7QUFDbEQsOERBQTREO0FBQzVELDREQUE0RDtBQUM1RCwwREFBNEQ7QUFDNUQsMENBQTJFO0FBQzNFLHFFQUFtRTtBQUNuRSxzREFBK0Q7QUFDL0QsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDaEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDNUMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RCxvQ0FBdUM7QUFTdkMsSUFBYSxzQkFBc0I7SUEyQmxDLGdDQUFvQixJQUFVLEVBQVUsTUFBcUIsRUFBVSxtQkFBc0MsRUFBVSxNQUFjLEVBQVUsSUFBb0IsRUFBVSxFQUFvQjtRQUE3SyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBbUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFrQjtRQTFCak0sZ0JBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FB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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFZhbHVlTGlzdCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XG5pbXBvcnQgeyBUYWJWaWV3IH0gZnJvbSBcInVpL3RhYi12aWV3XCI7XG5pbXBvcnQgKiBhcyBpbWFnZXBpY2tlciBmcm9tIFwibmF0aXZlc2NyaXB0LWltYWdlcGlja2VyXCI7XG5pbXBvcnQgeyB0YWtlUGljdHVyZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1jYW1lcmEnO1xuaW1wb3J0IHsgSW1hZ2VTb3VyY2UgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2ltYWdlLXNvdXJjZSc7XG4vL2ltcG9ydCB7IEltYWdlQXNzZXQgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2ltYWdlLWFzc2V0JztcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFJlcXVlc3RDb25zdWx0TW9kZWwgfSBmcm9tIFwiLi4vaG9tZS9yZXF1ZXN0Y29uc3VsdC5tb2RlbFwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmxldCBJbWFnZVNvdXJjZU1vZHVsZSA9IHJlcXVpcmUoXCJpbWFnZS1zb3VyY2VcIik7XG5sZXQgeG1sMmpzID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXhtbDJqcycpO1xubGV0IGh0dHBfcmVxdWVzdCA9IHJlcXVpcmUoXCJodHRwXCIpO1xubGV0IHBsYXRmb3JtTW9kdWxlID0gcmVxdWlyZShcInBsYXRmb3JtXCIpO1xubGV0IHBlcm1pc3Npb25zID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1wZXJtaXNzaW9uc1wiKTtcbmxldCBQaG90b1ZpZXdlciA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtcGhvdG92aWV3ZXJcIik7XG5pbXBvcnQgZGlhbG9ncyA9IHJlcXVpcmUoXCJ1aS9kaWFsb2dzXCIpO1xuXG5kZWNsYXJlIGxldCBhbmRyb2lkOiBhbnk7XG5cbkBDb21wb25lbnQoe1xuXHRtb2R1bGVJZDogbW9kdWxlLmlkLFxuXHR0ZW1wbGF0ZVVybDogXCIuL2hlYWx0aHJlY29yZHMuY29tcG9uZW50Lmh0bWxcIixcblx0cHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbiwgUmFkU2lkZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgSGVhbHRoUmVjb3Jkc0NvbXBvbmVudCB7XG5cdHBob3RvVmlld2VyID0gbmV3IFBob3RvVmlld2VyKCk7XG5cdGlzVmlzaWJsZTogYm9vbGVhbjsgQFZpZXdDaGlsZChSYWRTaWRlQ29tcG9uZW50KSByc2NvbXA6IFJhZFNpZGVDb21wb25lbnQ7XG5cdGhlYWx0aFZpZXc6IGJvb2xlYW4gPSBmYWxzZTsgcGVyc29uYWxEYXRhOiBhbnkgPSBbXTtcblx0cGVyc29uYWxMc09iajogYW55ID0ge307IGVkaXRvcnVwZGF0ZTogYW55ID0ge307XG5cdGRydWdMaXN0OiBhbnkgPSBbXTsgZHJ1Z25hbWU6IHN0cmluZzsgcmVhY3Rpb246IHN0cmluZzsgZGVsZXRlRHJ1Z09iajogYW55ID0ge307IGRydWdmb3JtOiBib29sZWFuID0gZmFsc2U7XG5cdGhlaWdodCA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpOyBoZWlnaHQyID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7IGRyaW5rID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7IGV4ZXJjaXNlID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7XG5cdGJsb29kZ3JwID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7IG1hcmlhbHN0YXR1cyA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpOyBzbW9rZSA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpOyBzbW9rZWhpcyA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpOyBleHRpbWVzID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7XG5cdGNvZGVMaXN0QXJyYXk6IGFueSA9IFtcIkVNUl9IZWlnaHRGZWV0XCIsIFwiRU1SX0hlaWdodEluY2hlc1wiLCBcIkVNUl9CbG9vZFR5cGVcIiwgXCJFTVJfTWFyaXRhbFN0YXR1c1wiLCBcIkVNUl9TbW9rZUZyZXF1ZW5jeVwiLCBcIkVNUl9Ecmlua0ZyZXFlbmN5XCIsIFwiRU1SX0V4ZXJjaXNlRnJlcXVlbmN5XCIsIFwiRU1SX0V4ZXJjaXNlSW50ZW5zaXR5XCIsIFwiRU1SX1Ntb2tlSGlzdG9yeVwiLCBcIkVNUl9GYW1pbHlIaXN0b3J5Q29uZGl0aW9uXCJdO1xuXHRlZGl0U3VyZ2VyeTogYm9vbGVhbiA9IGZhbHNlOyB2aWV3RmFtaWx5OiBib29sZWFuID0gZmFsc2U7IGVkaXRGYW1pbHk6IGJvb2xlYW4gPSBmYWxzZTsgZWRpdE1lZEltZzogYm9vbGVhbiA9IGZhbHNlO1xuXHRzdXJnSGlzTGlzdDogYW55ID0gW107IGRlbFN1cmdlcnk6IGFueSA9IHt9OyBzdXJnZm9ybTogYm9vbGVhbiA9IGZhbHNlOyBzdXJnZXJ5OiBzdHJpbmc7IHN1cmd3aGVuOiBzdHJpbmc7XG5cdG1lZGltZ2xpc3Q6IGFueSA9IFtdOyBpbWdkYXRlOiBzdHJpbmc7IG1lZGltZ2Zvcm06IGJvb2xlYW4gPSBmYWxzZTsgcGljMTogYW55ID0gbnVsbDtcblxuXHRlZGl0TWVkaWNhdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXHRtZWRpY2F0aW9uOiBib29sZWFuID0gZmFsc2U7IE1lZGljYXRpb246IHN0cmluZztcblx0bWVkaWNhbENvbmRpdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXHRlZGl0TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRyZXF1ZXN0Y29uc3VsdCA9IG5ldyBSZXF1ZXN0Q29uc3VsdE1vZGVsKCk7XG5cdG1jU3VibWl0dGVkOiBib29sZWFuID0gZmFsc2U7IG1TdWJtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTsgRGVzY3JpcHRpb246IHN0cmluZztcblx0bWVkaWNhdGlvbnNMaXN0OiBhbnkgPSBbXTsgbWVkaWNhdGlvblVzYWdlRnJlcXVlbmN5ID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7IG1lZGljYXRpb25JdGVtOiBhbnkgPSB7fTsgbXNTZWxlY3RlZEluZGV4OiBudW1iZXIgPSBudWxsOyBtU2VsZWN0ZWRJbmRleDogbnVtYmVyID0gbnVsbDsgdXBkYXRlTWVkaWNhdGlvbkl0ZW06IGFueSA9IHt9O1xuXHRtZWRpY2F0aW9uU3RhdHVzID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KFt7IHZhbHVlOiBcIllcIiwgZGlzcGxheTogXCJDdXJyZW50bHkgdGFraW5nIHRoaXNcIiB9LCB7IHZhbHVlOiBcIk5cIiwgZGlzcGxheTogXCJUb29rIGl0IGluIHRoZSBwYXN0XCIgfV0pO1xuXHRtZWRpY2FsQ29uZGl0aW9uc0xpc3Q6IGFueSA9IFtdOyBlbXJNZWRpY2FsQ29uZGl0aW9uID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7IG1lZGljYWxDb25kaXRpb25JdGVtOiBhbnkgPSB7fTsgbWNTZWxlY3RlZEluZGV4OiBudW1iZXIgPSBudWxsOyB1cGRhdGVNZWRDb25kaXRpb246IGFueSA9IHt9OyBtY3NTZWxlY3RlZEluZGV4OiBudW1iZXIgPSBudWxsO1xuXHRtZWRpY2FsQ29uZGl0aW9uU3RhdHVzID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KFt7IHZhbHVlOiBcIllcIiwgZGlzcGxheTogXCJDdXJyZW50bHkgaW4gY29uZGl0aW9uXCIgfSwgeyB2YWx1ZTogXCJOXCIsIGRpc3BsYXk6IFwiSGFkIGNvbmRpdGlvbiBpbiBwYXN0XCIgfV0pO1xuXG5cdGZhbWlseUhpc3RvcnlJdGVtOiBhbnkgPSBbXTsgZmFtaWx5SGlzdG9yeUNvbmRpdGlvbjogYW55ID0gW107IGZhbWlseUhpc3Rvcnk6IGFueSA9IFtdOyB1cGRhdGVGYW1pbHlIaXN0b3J5SXRlbTogYW55ID0ge307XG5cdGZhbWlseUhpc3RvcnlXaG8gPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTsgZlNlbGVjdGVkSW5kZXg6IG51bWJlciA9IG51bGw7IGFkZE5ld01lbWJlcjogYm9vbGVhbiA9IGZhbHNlOyBhZGRGSEZvcm06IGJvb2xlYW4gPSBmYWxzZTtcblx0dXNyZGF0YTogYW55ID0ge307XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgX2NoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgYWN0UjogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgcnM6IFJvdXRlckV4dGVuc2lvbnMpIHsgfVxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTsgdGhpcy5yc2NvbXAuaGx0aENsYXNzID0gdHJ1ZTtcblx0fVxuXHRuZ0FmdGVyVmlld0luaXQoKSB7XG5cdFx0dGhpcy5nZXRQZXJzb25hbERhdGEoKTtcblx0XHR0aGlzLmFjdFIucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLnJlcXVlc3Rjb25zdWx0ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJSRVFVRVNUX0NPTlNVTFRcIl0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJfREVGQVVMVFNcIikpIHtcblx0XHRcdGxldCBkYXRhID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJfREVGQVVMVFNcIikpO1xuXHRcdFx0dGhpcy51c3JkYXRhLkdyb3VwTnVtYmVyID0gZGF0YS5Hcm91cE51bWJlcjtcblx0XHRcdHRoaXMudXNyZGF0YS5LZXkgPSBkYXRhLktleTtcblx0XHRcdHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkID0gZGF0YS5FeHRlcm5hbE1lbWJlcklkO1xuXHRcdH1cblx0XHRpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJVU0VSXCIpKSB7XG5cdFx0XHRsZXQgZGF0YSA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSXCIpKTtcblx0XHRcdHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkID0gZGF0YS5FeHRlcm5hbE1lbWJlcklkO1xuXHRcdH1cblx0fVxuXHRlZGl0UGVyc29uYWwoKSB7XG5cdFx0dGhpcy5oZWFsdGhWaWV3ID0gdHJ1ZTtcblx0fVxuXG5cdGNvZGVMaXN0KCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRpZiAodGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLmNvZGVMaXN0QXJyYXkubGVuZ3RoOyArK2opIHtcblx0XHRcdFx0dGhpcy53ZWJhcGkuZ2V0Q29kZUxpc3Qoc2VsZi5jb2RlTGlzdEFycmF5W2pdKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cdFx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBpdGVtcyA9IHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuTGlzdDtcblx0XHRcdFx0XHRcdFx0c3dpdGNoICh0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBqID09IDA6XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmhlaWdodCA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5JdGVtQ291bnQ7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmhlaWdodC5wdXNoKHsgdmFsdWU6IGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW2ldLkl0ZW1JZCwgZGlzcGxheTogaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1baV0uVmFsdWUgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChzZWxmLnBlcnNvbmFsRGF0YS5IZWlnaHQgIT0gdW5kZWZpbmVkICYmIGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW2ldLlZhbHVlID09IHNlbGYucGVyc29uYWxEYXRhLkhlaWdodC5zcGxpdChcIjtcIiwgMilbMF0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5wZXJzb25hbExzT2JqLmh0aW5keCA9IGk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIGogPT0gMTpcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuaGVpZ2h0MiA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBpdGVtcy5JdGVtQ291bnQ7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmhlaWdodDIucHVzaCh7IHZhbHVlOiBpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtrXS5JdGVtSWQsIGRpc3BsYXk6IGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW2tdLlZhbHVlIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoc2VsZi5wZXJzb25hbERhdGEuSGVpZ2h0ICE9IHVuZGVmaW5lZCAmJiBpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtrXS5WYWx1ZSA9PSBzZWxmLnBlcnNvbmFsRGF0YS5IZWlnaHQuc3BsaXQoXCI7XCIsIDIpWzFdKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGYucGVyc29uYWxMc09iai5odGluZHgxID0gaztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgaiA9PSAyOlxuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5ibG9vZGdycCA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgbCA9IDA7IGwgPCBpdGVtcy5JdGVtQ291bnQ7IGwrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmJsb29kZ3JwLnB1c2goeyB2YWx1ZTogaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1bbF0uSXRlbUlkLCBkaXNwbGF5OiBpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtsXS5WYWx1ZSB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW2xdLlZhbHVlID09IHNlbGYucGVyc29uYWxEYXRhLkJsb29kVHlwZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnBlcnNvbmFsTHNPYmouYmxvb2RJbmRleCA9IGw7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIGogPT0gMzpcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYubWFyaWFsc3RhdHVzID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBtID0gMDsgbSA8IGl0ZW1zLkl0ZW1Db3VudDsgbSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGYubWFyaWFsc3RhdHVzLnB1c2goeyB2YWx1ZTogaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1bbV0uSXRlbUlkLCBkaXNwbGF5OiBpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVttXS5WYWx1ZSB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW21dLlZhbHVlID09IHNlbGYucGVyc29uYWxEYXRhLk1hcml0YWxTdGF0dXMpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5wZXJzb25hbExzT2JqLm1hcml0YWxJbmRleCA9IG07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIGogPT0gNDpcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuc21va2UgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTtcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IG4gPSAwOyBuIDwgaXRlbXMuSXRlbUNvdW50OyBuKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5zbW9rZS5wdXNoKHsgdmFsdWU6IGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW25dLkl0ZW1JZCwgZGlzcGxheTogaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1bbl0uVmFsdWUgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtuXS5WYWx1ZSA9PSBzZWxmLnBlcnNvbmFsRGF0YS5TbW9rZS5zcGxpdChcIixcIiwgMilbMF0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5wZXJzb25hbExzT2JqLnNtb2tlSW5keCA9IG47XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIGogPT0gNTpcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuZHJpbmsgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTtcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IG8gPSAwOyBvIDwgaXRlbXMuSXRlbUNvdW50OyBvKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5kcmluay5wdXNoKHsgdmFsdWU6IGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW29dLkl0ZW1JZCwgZGlzcGxheTogaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1bb10uVmFsdWUgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtvXS5WYWx1ZSA9PSBzZWxmLnBlcnNvbmFsRGF0YS5Ecmluaylcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnBlcnNvbmFsTHNPYmouZHJpbmtJbmR4ID0gbztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgaiA9PSA2OlxuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5leGVyY2lzZSA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgcCA9IDA7IHAgPCBpdGVtcy5JdGVtQ291bnQ7IHArKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmV4ZXJjaXNlLnB1c2goeyB2YWx1ZTogaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1bcF0uSXRlbUlkLCBkaXNwbGF5OiBpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtwXS5WYWx1ZSB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW3BdLlZhbHVlID09IHNlbGYucGVyc29uYWxEYXRhLkV4ZXJjaXNlLnNwbGl0KFwiLCBcIiwgMilbMF0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5wZXJzb25hbExzT2JqLmV4SW5kZXggPSBwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBqID09IDc6XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmV4dGltZXMgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTtcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IHEgPSAwOyBxIDwgaXRlbXMuSXRlbUNvdW50OyBxKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5leHRpbWVzLnB1c2goeyB2YWx1ZTogaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1bcV0uSXRlbUlkLCBkaXNwbGF5OiBpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtxXS5WYWx1ZSB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW3FdLlZhbHVlID09IHNlbGYucGVyc29uYWxEYXRhLkV4ZXJjaXNlLnNwbGl0KFwiLCBcIiwgMilbMV0pXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5wZXJzb25hbExzT2JqLmV4dGltZUluZHggPSBxO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBqID09IDg6XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnNtb2tlaGlzID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCByID0gMDsgciA8IGl0ZW1zLkl0ZW1Db3VudDsgcisrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuc21va2VoaXMucHVzaCh7IHZhbHVlOiBpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtyXS5JdGVtSWQsIGRpc3BsYXk6IGl0ZW1zLkxpc3QuQ29kZUxpc3RJdGVtW3JdLlZhbHVlIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoaXRlbXMuTGlzdC5Db2RlTGlzdEl0ZW1bcl0uVmFsdWUgPT0gc2VsZi5wZXJzb25hbERhdGEuU21va2Uuc3BsaXQoXCIsIFwiLCAyKVsxXSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnBlcnNvbmFsTHNPYmouc21va3RpbmR4ID0gcjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgaiA9PSA5OlxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgcyA9IDA7IHMgPCBpdGVtcy5JdGVtQ291bnQ7IHMrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmZhbWlseUhpc3RvcnlDb25kaXRpb24ucHVzaChpdGVtcy5MaXN0LkNvZGVMaXN0SXRlbVtzXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkNvZGVMaXN0IG92ZXIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgdGhlIGNvZGVsaXN0IGluZGV4LiBcIiArIHNlbGYuY29kZUxpc3RBcnJheVtqXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgdGhlIENvZGVMaXN0IFwiICsgZXJyb3IpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRnZXRQZXJzb25hbERhdGEoKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdHNlbGYud2ViYXBpLnBlcnNvbmFsQW5kTFNTdW1tYXJ5KFwiRU1SX1BlcnNvbmFsQW5kTGlmZVN0eWxlX1N1bW1hcnlfR2V0XCIpLnN1YnNjcmliZShkYXRhID0+IHtcblx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9FTVJQZXJzb25hbEFuZExpZmVTdHlsZV9TdW1tYXJ5LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRzZWxmLnBlcnNvbmFsRGF0YSA9IHJlc3VsdC5BUElSZXN1bHRfRU1SUGVyc29uYWxBbmRMaWZlU3R5bGVfU3VtbWFyeS5Db250ZW50O1xuXHRcdFx0XHRcdHNlbGYuY29kZUxpc3QoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9FTVJQZXJzb25hbEFuZExpZmVTdHlsZV9TdW1tYXJ5Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvZ291dCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIGVycm9yIGluIGdldHRpbmcgcGVyc29uYWwgZGF0YS4uLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIFBlcnNvbmFsIGFuZCBMaWZlc3R5bGUuLi4uIFwiICsgZXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblx0b25IZWlnaHQxQ2hhbmdlKGFyZ3MpIHtcblx0XHR0aGlzLnBlcnNvbmFsTHNPYmouSGVpZ2h0RmVldEl0ZW1JZCA9IHRoaXMuaGVpZ2h0LmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdFx0dGhpcy5wZXJzb25hbExzT2JqLkhlaWdodEZlZXRJdGVtID0gdGhpcy5oZWlnaHQuZ2V0RGlzcGxheShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5odGluZHggPSBhcmdzLnNlbGVjdGVkSW5kZXg7XG5cdH1cblx0b25IZWlnaHQyQ2hhbmdlKGFyZ3MpIHtcblx0XHR0aGlzLnBlcnNvbmFsTHNPYmouSGVpZ2h0SW5jaGVzSXRlbUlkID0gdGhpcy5oZWlnaHQyLmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdFx0dGhpcy5wZXJzb25hbExzT2JqLkhlaWdodEluY2hlc0l0ZW0gPSB0aGlzLmhlaWdodDIuZ2V0RGlzcGxheShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5odGluZHgxID0gYXJncy5zZWxlY3RlZEluZGV4O1xuXHR9XG5cdG9uQmxvb2RUeXBlQ2hhbmdlKGFyZ3MpIHtcblx0XHR0aGlzLnBlcnNvbmFsTHNPYmouQmxvb2RUeXBlSXRlbUlkID0gdGhpcy5ibG9vZGdycC5nZXRWYWx1ZShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5CbG9vZFR5cGVJdGVtID0gdGhpcy5ibG9vZGdycC5nZXREaXNwbGF5KGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdH1cblx0b25NYXJpdGFsU3RhdGVDaGFuZ2UoYXJncykge1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5NYXJpdGFsU3RhdHVzSXRlbUlkID0gdGhpcy5tYXJpYWxzdGF0dXMuZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0XHR0aGlzLnBlcnNvbmFsTHNPYmouTWFyaXRhbFN0YXR1c0l0ZW0gPSB0aGlzLm1hcmlhbHN0YXR1cy5nZXREaXNwbGF5KGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdH1cblx0b25TbW9rZUNoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5wZXJzb25hbExzT2JqLlNtb2tlU3RhdHVzSXRlbUlkID0gdGhpcy5zbW9rZS5nZXRWYWx1ZShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5TbW9rZVN0YXR1c0l0ZW0gPSB0aGlzLnNtb2tlLmdldERpc3BsYXkoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0fVxuXHRvblNtb2tlVGltZUNoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5wZXJzb25hbExzT2JqLlNtb2tlTGVuZ3RoSXRlbUlkID0gdGhpcy5zbW9rZWhpcy5nZXRWYWx1ZShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5TbW9rZUxlbmd0aEl0ZW0gPSB0aGlzLnNtb2tlaGlzLmdldERpc3BsYXkoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0fVxuXHRvbkRyaW5rQ2hhbmdlKGFyZ3MpIHtcblx0XHR0aGlzLnBlcnNvbmFsTHNPYmouRHJpbmtJdGVtSWQgPSB0aGlzLmRyaW5rLmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdFx0dGhpcy5wZXJzb25hbExzT2JqLkRyaW5rSXRlbSA9IHRoaXMuZHJpbmsuZ2V0RGlzcGxheShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHR9XG5cdG9uRXhlcmNpc2VDaGFuZ2UoYXJncykge1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5FeGVyY2lzZUl0ZW1JZCA9IHRoaXMuZXhlcmNpc2UuZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0XHR0aGlzLnBlcnNvbmFsTHNPYmouRXhlcmNpc2VJdGVtID0gdGhpcy5leGVyY2lzZS5nZXREaXNwbGF5KGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdH1cblx0b25FeGVyY2lzZVRpbWVDaGFuZ2UoYXJncykge1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5FeGVyY2lzZUxlbmd0aEl0ZW1JZCA9IHRoaXMuZXh0aW1lcy5nZXRWYWx1ZShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHRcdHRoaXMucGVyc29uYWxMc09iai5FeGVyY2lzZUxlbmd0aEl0ZW0gPSB0aGlzLmV4dGltZXMuZ2V0RGlzcGxheShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHR9XG5cdHVwZGF0ZVBlcnNvbmFsSW5mbygpIHtcblxuXHRcdGlmICh0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG5cdFx0XHRodHRwX3JlcXVlc3QucmVxdWVzdCh7XG5cdFx0XHRcdHVybDogXCJodHRwczovL3d3dy4yNDdjYWxsYWRvYy5jb20vV2ViU2VydmljZXMvQVBJX0VNUi5hc214XCIsXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3htbFwiIH0sXG5cdFx0XHRcdGNvbnRlbnQ6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLycgPlwiICtcblx0XHRcdFx0XCI8c29hcGVudjpCb2R5Pjx3ZWI6RU1SX1BlcnNvbmFsQW5kTGlmZVN0eWxlX1NhdmU+PHdlYjpLZXk+XCIgKyB0aGlzLnVzcmRhdGEuS2V5ICsgXCI8L3dlYjpLZXk+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6R3JvdXBOdW1iZXI+XCIgKyB0aGlzLnVzcmRhdGEuR3JvdXBOdW1iZXIgKyBcIjwvd2ViOkdyb3VwTnVtYmVyPlwiICtcblx0XHRcdFx0XCI8d2ViOkV4dGVybmFsTWVtYmVySWQ+XCIgKyB0aGlzLnVzcmRhdGEuRXh0ZXJuYWxNZW1iZXJJZCArIFwiPC93ZWI6RXh0ZXJuYWxNZW1iZXJJZD48d2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6SGVpZ2h0RmVldEl0ZW0+XCIgKyB0aGlzLnBlcnNvbmFsTHNPYmouSGVpZ2h0RmVldEl0ZW0gKyBcIjwvd2ViOkhlaWdodEZlZXRJdGVtPlwiICtcblx0XHRcdFx0XCI8d2ViOkhlaWdodEZlZXRJdGVtSWQ+XCIgKyB0aGlzLnBlcnNvbmFsTHNPYmouSGVpZ2h0RmVldEl0ZW1JZCArIFwiPC93ZWI6SGVpZ2h0RmVldEl0ZW1JZD5cIiArXG5cdFx0XHRcdFwiPHdlYjpIZWlnaHRJbmNoZXNJdGVtPlwiICsgdGhpcy5wZXJzb25hbExzT2JqLkhlaWdodEluY2hlc0l0ZW0gKyBcIjwvd2ViOkhlaWdodEluY2hlc0l0ZW0+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6SGVpZ2h0SW5jaGVzSXRlbUlkPlwiICsgdGhpcy5wZXJzb25hbExzT2JqLkhlaWdodEluY2hlc0l0ZW1JZCArIFwiPC93ZWI6SGVpZ2h0SW5jaGVzSXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOldlaWdodFBvdW5kcz5cIiArIHRoaXMucGVyc29uYWxEYXRhLldlaWdodCArIFwiPC93ZWI6V2VpZ2h0UG91bmRzPlwiICtcblx0XHRcdFx0XCI8d2ViOkJsb29kVHlwZUl0ZW0+XCIgKyB0aGlzLnBlcnNvbmFsTHNPYmouQmxvb2RUeXBlSXRlbSArIFwiPC93ZWI6Qmxvb2RUeXBlSXRlbSA+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6Qmxvb2RUeXBlSXRlbUlkPlwiICsgdGhpcy5wZXJzb25hbExzT2JqLkJsb29kVHlwZUl0ZW1JZCArIFwiPC93ZWI6Qmxvb2RUeXBlSXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOkJsb29kUHJlc3N1cmVTeXN0b2xpYy8+PHdlYjpCbG9vZFByZXNzdXJlRGlhc3RvbGljLz5cIiArXG5cdFx0XHRcdFwiPHdlYjpNYXJpdGFsU3RhdHVzSXRlbT5cIiArIHRoaXMucGVyc29uYWxMc09iai5NYXJpdGFsU3RhdHVzSXRlbSArIFwiPC93ZWI6TWFyaXRhbFN0YXR1c0l0ZW0+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6TWFyaXRhbFN0YXR1c0l0ZW1JZD5cIiArIHRoaXMucGVyc29uYWxMc09iai5NYXJpdGFsU3RhdHVzSXRlbUlkICsgXCI8L3dlYjpNYXJpdGFsU3RhdHVzSXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOlNtb2tlU3RhdHVzSXRlbT5cIiArIHRoaXMucGVyc29uYWxMc09iai5TbW9rZVN0YXR1c0l0ZW0gKyBcIjwvd2ViOlNtb2tlU3RhdHVzSXRlbT5cIiArXG5cdFx0XHRcdFwiPHdlYjpTbW9rZVN0YXR1c0l0ZW1JZD5cIiArIHRoaXMucGVyc29uYWxMc09iai5TbW9rZVN0YXR1c0l0ZW1JZCArIFwiPC93ZWI6U21va2VTdGF0dXNJdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6U21va2VMZW5ndGhJdGVtPlwiICsgdGhpcy5wZXJzb25hbExzT2JqLlNtb2tlTGVuZ3RoSXRlbSArIFwiPC93ZWI6U21va2VMZW5ndGhJdGVtPlwiICtcblx0XHRcdFx0XCI8d2ViOlNtb2tlTGVuZ3RoSXRlbUlkPlwiICsgdGhpcy5wZXJzb25hbExzT2JqLlNtb2tlTGVuZ3RoSXRlbUlkICsgXCI8L3dlYjpTbW9rZUxlbmd0aEl0ZW1JZD5cIiArXG5cdFx0XHRcdFwiPHdlYjpEcmlua0l0ZW0+XCIgKyB0aGlzLnBlcnNvbmFsTHNPYmouRHJpbmtJdGVtICsgXCI8L3dlYjpEcmlua0l0ZW0+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RHJpbmtJdGVtSWQ+XCIgKyB0aGlzLnBlcnNvbmFsTHNPYmouRHJpbmtJdGVtSWQgKyBcIjwvd2ViOkRyaW5rSXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOkV4ZXJjaXNlSXRlbT5cIiArIHRoaXMucGVyc29uYWxMc09iai5FeGVyY2lzZUl0ZW0gKyBcIjwvd2ViOkV4ZXJjaXNlSXRlbT5cIiArXG5cdFx0XHRcdFwiPHdlYjpFeGVyY2lzZUl0ZW1JZD5cIiArIHRoaXMucGVyc29uYWxMc09iai5FeGVyY2lzZUl0ZW1JZCArIFwiPC93ZWI6RXhlcmNpc2VJdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RXhlcmNpc2VMZW5ndGhJdGVtPlwiICsgdGhpcy5wZXJzb25hbExzT2JqLkV4ZXJjaXNlTGVuZ3RoSXRlbSArIFwiPC93ZWI6RXhlcmNpc2VMZW5ndGhJdGVtPlwiICtcblx0XHRcdFx0XCI8d2ViOkV4ZXJjaXNlTGVuZ3RoSXRlbUlkPlwiICsgdGhpcy5wZXJzb25hbExzT2JqLkV4ZXJjaXNlTGVuZ3RoSXRlbUlkICsgXCI8L3dlYjpFeGVyY2lzZUxlbmd0aEl0ZW1JZD5cIiArXG5cdFx0XHRcdFwiPC93ZWI6Q29udGVudD48d2ViOkRlbW8vPjwvd2ViOkVNUl9QZXJzb25hbEFuZExpZmVTdHlsZV9TYXZlPjwvc29hcGVudjpCb2R5Pjwvc29hcGVudjpFbnZlbG9wZT5cIlxuXHRcdFx0fSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcocmVzcG9uc2UuY29udGVudCwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRsZXQgcmVzcCA9IHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5FTVJfUGVyc29uYWxBbmRMaWZlU3R5bGVfU2F2ZVJlc3BvbnNlLkVNUl9QZXJzb25hbEFuZExpZmVTdHlsZV9TYXZlUmVzdWx0O1xuXHRcdFx0XHRcdGlmIChyZXNwLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYuaGVhbHRoVmlldyA9IGZhbHNlOyBcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlc3AuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgb3IgRXJyb3IgaW4gU2F2ZSBQRlwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yOjo6IFwiICsgZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0dXBkYXRlT3JBZGRTdXJnZXJ5KG9wZXJhdGlvbiwgc3VyZ25hbWUsIHdoZW4pIHtcblx0XHR0aGlzLnN1cmdmb3JtID0gdHJ1ZTtcblxuXHRcdGlmIChvcGVyYXRpb24gPT0gJ0FkZCcpIHtcblx0XHRcdG9wZXJhdGlvbiA9IChvcGVyYXRpb24gPT0gJ0FkZCcgJiYgdGhpcy5lZGl0b3J1cGRhdGUuYWRkID09IDEpID8gXCJBZGRcIiA6IFwiVXBkYXRlXCI7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3J1cGRhdGUuYWRkID09IDEpIHtcblx0XHRcdFx0dGhpcy5kZWxTdXJnZXJ5Lkl0ZW1JZCA9IDA7IHRoaXMuZGVsU3VyZ2VyeS5TdXJnZXJ5ID0gdGhpcy5zdXJnZXJ5OyB0aGlzLmRlbFN1cmdlcnkuV2hlbiA9IHRoaXMuc3VyZ3doZW47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmRlbFN1cmdlcnkuU3VyZ2VyeSA9IHRoaXMuc3VyZ2VyeTsgdGhpcy5kZWxTdXJnZXJ5LldoZW4gPSB0aGlzLnN1cmd3aGVuO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoKG9wZXJhdGlvbiA9PSAnRGVsZXRlJyB8fCAoc3VyZ25hbWUgJiYgd2hlbiAmJiB0aGlzLnN1cmdlcnkudHJpbSgpICE9ICcnICYmIHRoaXMuc3VyZ3doZW4udHJpbSgpICE9ICcnKSkgJiYgdGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuXHRcdFx0aHR0cF9yZXF1ZXN0LnJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6IFwiaHR0cHM6Ly93d3cuMjQ3Y2FsbGFkb2MuY29tL1dlYlNlcnZpY2VzL0FQSV9FTVIuYXNteFwiLFxuXHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdFx0XHRoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC94bWxcIiB9LFxuXHRcdFx0XHRjb250ZW50OiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04Jz8+XCIgK1xuXHRcdFx0XHRcIjxzb2FwZW52OkVudmVsb3BlIHhtbG5zOnNvYXBlbnY9J2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyB4bWxuczp3ZWI9J2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nID5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6Qm9keT48d2ViOkVNUl9TdXJnZXJ5SGlzdG9yeV9TYXZlPjx3ZWI6S2V5PlwiICsgdGhpcy51c3JkYXRhLktleSArIFwiPC93ZWI6S2V5PlwiICtcblx0XHRcdFx0XCI8d2ViOkdyb3VwTnVtYmVyPlwiICsgdGhpcy51c3JkYXRhLkdyb3VwTnVtYmVyICsgXCI8L3dlYjpHcm91cE51bWJlcj5cIiArXG5cdFx0XHRcdFwiPHdlYjpFeHRlcm5hbE1lbWJlcklkPlwiICsgdGhpcy51c3JkYXRhLkV4dGVybmFsTWVtYmVySWQgKyBcIjwvd2ViOkV4dGVybmFsTWVtYmVySWQ+PHdlYjpDb250ZW50PlwiICtcblx0XHRcdFx0XCI8d2ViOkl0ZW1JZD5cIiArIHRoaXMuZGVsU3VyZ2VyeS5JdGVtSWQgKyBcIjwvd2ViOkl0ZW1JZD5cIiArXG5cdFx0XHRcdFwiPHdlYjpTdXJnZXJ5PlwiICsgdGhpcy5kZWxTdXJnZXJ5LlN1cmdlcnkgKyBcIjwvd2ViOlN1cmdlcnk+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6V2hlbj5cIiArIHRoaXMuZGVsU3VyZ2VyeS5XaGVuICsgXCI8L3dlYjpXaGVuPlwiICtcblx0XHRcdFx0XCI8L3dlYjpDb250ZW50Pjx3ZWI6QWN0aW9uPlwiICsgb3BlcmF0aW9uICsgXCI8L3dlYjpBY3Rpb24+PHdlYjpEZW1vLz5cIiArXG5cdFx0XHRcdFwiPC93ZWI6RU1SX1N1cmdlcnlIaXN0b3J5X1NhdmU+PC9zb2FwZW52OkJvZHk+PC9zb2FwZW52OkVudmVsb3BlPlwiXG5cdFx0XHR9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhyZXNwb25zZS5jb250ZW50LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdGxldCByZXNwID0gcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9TdXJnZXJ5SGlzdG9yeV9TYXZlUmVzcG9uc2UuRU1SX1N1cmdlcnlIaXN0b3J5X1NhdmVSZXN1bHQ7XG5cdFx0XHRcdFx0c2VsZi5kZWxTdXJnZXJ5LnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKHJlc3AuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiBvcGVyYXRpb24gPT0gJ0RlbGV0ZScpIHtcblx0XHRcdFx0XHRcdHNlbGYuc3VyZ0hpc0xpc3Quc3BsaWNlKHNlbGYuc3VyZ0hpc0xpc3QuaW5kZXhPZihzZWxmLmRlbFN1cmdlcnkpLCAxKTtcblx0XHRcdFx0XHRcdHNlbGYuZGVsU3VyZ2VyeS5pbmR4ID0gLTE7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXNwLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIgJiYgb3BlcmF0aW9uID09ICdBZGQnKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmVkaXRTdXJnZXJ5ID0gZmFsc2U7IGxldCBhZGRpdGVtID0gcmVzcC5TdXJnZXJ5SGlzdG9yeUxpc3QuRU1SX1N1cmdlcnlJdGVtO1xuXHRcdFx0XHRcdFx0aWYgKGFkZGl0ZW0ubGVuZ3RoICE9IHVuZGVmaW5lZClcblx0XHRcdFx0XHRcdFx0c2VsZi5zdXJnSGlzTGlzdC5wdXNoKHsgXCJJdGVtSWRcIjogYWRkaXRlbVthZGRpdGVtLmxlbmd0aCAtIDFdLkl0ZW1JZCwgXCJTdXJnZXJ5XCI6IGFkZGl0ZW1bYWRkaXRlbS5sZW5ndGggLSAxXS5TdXJnZXJ5LCBcIldoZW5cIjogYWRkaXRlbVthZGRpdGVtLmxlbmd0aCAtIDFdLldoZW4sIFwiaW1nXCI6IFwicmVzOi8vcmVkZWRpdFwiIH0pO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRzZWxmLnN1cmdIaXNMaXN0LnB1c2goeyBcIkl0ZW1JZFwiOiBhZGRpdGVtLkl0ZW1JZCwgXCJTdXJnZXJ5XCI6IGFkZGl0ZW0uU3VyZ2VyeSwgXCJXaGVuXCI6IGFkZGl0ZW0uV2hlbiwgXCJpbWdcIjogXCJyZXM6Ly9yZWRlZGl0XCIgfSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXNwLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIgJiYgb3BlcmF0aW9uID09ICdVcGRhdGUnKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmVkaXRTdXJnZXJ5ID0gZmFsc2U7IHNlbGYuc3VyZ0hpc0xpc3Rbc2VsZi5kZWxTdXJnZXJ5LmluZGV4XSA9IHNlbGYuZGVsU3VyZ2VyeTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlc3AuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgb3IgRXJyb3IgaW4gZGVsZXRlIHN1cmdlcnlcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvcjo6IFwiICsgZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0b25UYWJDaGFuZ2UoYXJncykge1xuXHRcdGxldCB0YWJWaWV3ID0gPFRhYlZpZXc+YXJncy5vYmplY3Q7XG5cdFx0c3dpdGNoICh0cnVlKSB7XG5cdFx0XHRjYXNlIHRhYlZpZXcuc2VsZWN0ZWRJbmRleCA9PSAxICYmIHRoaXMuZHJ1Z0xpc3QubGVuZ3RoID09IDA6XG5cdFx0XHRcdHRoaXMuZHJ1Z0FsbGVyZ3lHZXQoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRhYlZpZXcuc2VsZWN0ZWRJbmRleCA9PSAyICYmIHRoaXMubWVkaWNhdGlvbnNMaXN0Lmxlbmd0aCA9PSAwOlxuXHRcdFx0XHR0aGlzLmdldE1lZGljYXRpb25zTGlzdCgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgdGFiVmlldy5zZWxlY3RlZEluZGV4ID09IDMgJiYgdGhpcy5tZWRpY2FsQ29uZGl0aW9uc0xpc3QubGVuZ3RoID09IDA6XG5cdFx0XHRcdHRoaXMuZ2V0TWVkaWNhbENvbmRpdGlvbnNMaXN0KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0YWJWaWV3LnNlbGVjdGVkSW5kZXggPT0gNCAmJiB0aGlzLnN1cmdIaXNMaXN0Lmxlbmd0aCA9PSAwOlxuXHRcdFx0XHR0aGlzLnN1cmdlcnlIaXNHZXQoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRhYlZpZXcuc2VsZWN0ZWRJbmRleCA9PSA1ICYmIHRoaXMuZmFtaWx5SGlzdG9yeS5sZW5ndGggPT0gMDpcblx0XHRcdFx0dGhpcy5nZXRGYW1pbHlIaXN0b3J5TGlzdCgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgdGFiVmlldy5zZWxlY3RlZEluZGV4ID09IDYgJiYgdGhpcy5tZWRpbWdsaXN0Lmxlbmd0aCA9PSAwOlxuXHRcdFx0XHR0aGlzLm1lZGljYWxJbWFnTGlzdCgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJOb3RoaW5nLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cIik7XG5cdFx0fVxuXHR9XG5cdGRydWdBbGxlcmd5R2V0KCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRzZWxmLndlYmFwaS5ncmlkR2V0SW5IZWFsdGgoXCJFTVJfRHJ1Z0FsbGVyZ3lfR3JpZF9HZXRcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0VNUkRydWdBbGxlcmd5X0dyaWQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X0VNUkRydWdBbGxlcmd5X0dyaWQuRHJ1Z0FsbGVyZ3lDb3VudCAhPSAnMCcpIHtcblx0XHRcdFx0XHRzZWxmLmRydWdMaXN0ID0gW107XG5cdFx0XHRcdFx0bGV0IGRydWdzID0gcmVzdWx0LkFQSVJlc3VsdF9FTVJEcnVnQWxsZXJneV9HcmlkLkRydWdBbGxlcmd5TGlzdC5FTVJfRHJ1Z0FsbGVyZ3lJdGVtO1xuXHRcdFx0XHRcdGlmIChkcnVncy5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRydWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdC8vXHRzZWxmLmRydWdMaXN0LnB1c2goZHJ1Z3NbaV0pO1xuXHRcdFx0XHRcdFx0XHRzZWxmLmRydWdMaXN0LnB1c2goeyBcIkl0ZW1JZFwiOiBkcnVnc1tpXS5JdGVtSWQsIFwiRHJ1Z1wiOiBkcnVnc1tpXS5EcnVnLCBcIlJlYWN0aW9uXCI6IGRydWdzW2ldLlJlYWN0aW9uLCBcImltZ1wiOiBcInJlczovL3JlZGVkaXRcIiB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5kcnVnTGlzdC5wdXNoKHsgXCJJdGVtSWRcIjogZHJ1Z3MuSXRlbUlkLCBcIkRydWdcIjogZHJ1Z3MuRHJ1ZywgXCJSZWFjdGlvblwiOiBkcnVncy5SZWFjdGlvbiwgXCJpbWdcIjogXCJyZXM6Ly9yZWRlZGl0XCIgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfRU1SRHJ1Z0FsbGVyZ3lfR3JpZC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImVycm9yIG9yIG5vIGRydWcgYWxsZXJnaWVzXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3IgaW4gRHJ1Zy4uLi4gXCIgKyBlcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXG5cdHNob3dNZWRpY2F0aW9uKCkge1xuXHRcdHRoaXMubWVkaWNhdGlvbiA9IHRydWU7XG5cdH1cblx0Y2xvc2VNZWRpY2F0aW9uU3RhdHVzKCkge1xuXHRcdHRoaXMubWVkaWNhdGlvbiA9IGZhbHNlO1xuXHR9XG5cdGVkaXRNZWRpY2F0aW9uRGV0YWlscyhtZWRJdGVtKSB7XG5cdFx0dGhpcy5lZGl0TWVkaWNhdGlvbiA9IHRydWU7XG5cdFx0dGhpcy5tU3VibWl0dGVkID0gZmFsc2U7XG5cdFx0dGhpcy5tZWRpY2F0aW9uSXRlbSA9IG1lZEl0ZW07XG5cdFx0dGhpcy5NZWRpY2F0aW9uID0gbWVkSXRlbS5NZWRpY2F0aW9uO1xuXHRcdHRoaXMuZ2V0TWVkaWNhdGlvblVzYWdlRnJlcXVlbmN5KCk7XG5cdH1cblx0Y2xvc2VNZWRpY2F0aW9uKCkge1xuXHRcdHRoaXMubVNlbGVjdGVkSW5kZXggPSBudWxsO1xuXHRcdHRoaXMubXNTZWxlY3RlZEluZGV4ID0gbnVsbDtcblx0XHR0aGlzLk1lZGljYXRpb24gPSBudWxsO1xuXHRcdHRoaXMuZWRpdE1lZGljYXRpb24gPSBmYWxzZTtcblx0fVxuXG5cdGdldE1lZGljYXRpb25zTGlzdCgpIHtcblx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0c2VsZi5tZWRpY2F0aW9uc0xpc3QgPSBbXTtcblx0XHRzZWxmLndlYmFwaS5nZXRNZWRpY2F0aW9uc19odHRwKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0VNUk1lZGljYXRpb25zX0dyaWQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X0VNUk1lZGljYXRpb25zX0dyaWQuTWVkaWNhdGlvbkNvdW50ICE9ICcwJykge1xuXHRcdFx0XHRcdGxldCBtID0gcGFyc2VJbnQocmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2F0aW9uc19HcmlkLk1lZGljYXRpb25Db3VudCk7XG5cdFx0XHRcdFx0aWYgKG0gPT0gMSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2F0aW9uc19HcmlkLk1lZGljYXRpb25MaXN0LkVNUl9NZWRpY2F0aW9uSXRlbS5pbWcgPSBcInJlczovL3JlZGVkaXRcIjtcblx0XHRcdFx0XHRcdHNlbGYubWVkaWNhdGlvbnNMaXN0LnB1c2gocmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2F0aW9uc19HcmlkLk1lZGljYXRpb25MaXN0LkVNUl9NZWRpY2F0aW9uSXRlbSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdC5BUElSZXN1bHRfRU1STWVkaWNhdGlvbnNfR3JpZC5NZWRpY2F0aW9uTGlzdC5FTVJfTWVkaWNhdGlvbkl0ZW1baV0uaW1nID0gXCJyZXM6Ly9yZWRlZGl0XCI7XG5cdFx0XHRcdFx0XHRcdHNlbGYubWVkaWNhdGlvbnNMaXN0LnB1c2gocmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2F0aW9uc19HcmlkLk1lZGljYXRpb25MaXN0LkVNUl9NZWRpY2F0aW9uSXRlbVtpXSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2F0aW9uc19HcmlkLk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcblx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3IvTm8gTWVkaWNhdGlvbnNcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBNZWRpY2F0aW9ucy4uLi4gXCIgKyBlcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGdldE1lZGljYXRpb25Vc2FnZUZyZXF1ZW5jeSgpIHtcblx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0aWYgKHNlbGYubWVkaWNhdGlvblVzYWdlRnJlcXVlbmN5Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRzZWxmLndlYmFwaS5nZXRDb2RlTGlzdChcIkVNUl9NZWRpY2F0aW9uVXNhZ2VGcmVxdWVuY3lcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsb29wID0gMDsgbG9vcCA8IHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuTGlzdC5JdGVtQ291bnQ7IGxvb3ArKykge1xuXHRcdFx0XHRcdFx0XHRzZWxmLm1lZGljYXRpb25Vc2FnZUZyZXF1ZW5jeS5zZXRJdGVtKGxvb3AsIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5MaXN0Lkxpc3QuQ29kZUxpc3RJdGVtW2xvb3BdLkl0ZW1JZCxcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiByZXN1bHQuQVBJUmVzdWx0X0NvZGVMaXN0Lkxpc3QuTGlzdC5Db2RlTGlzdEl0ZW1bbG9vcF0uVmFsdWUsXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5MaXN0Lkxpc3QuQ29kZUxpc3RJdGVtW2xvb3BdLlZhbHVlID09IHNlbGYubWVkaWNhdGlvbkl0ZW0uRnJlcXVlbmN5KSB7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5tU2VsZWN0ZWRJbmRleCA9IGxvb3A7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yL05vIE1lZGljYXRpb25zXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIE1lZGljYXRpb25zLi4uLiBcIiArIGVycm9yKTtcblx0XHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAobGV0IGxvb3AgPSAwOyBsb29wIDwgc2VsZi5tZWRpY2F0aW9uVXNhZ2VGcmVxdWVuY3kubGVuZ3RoOyBsb29wKyspIHtcblx0XHRcdFx0aWYgKHNlbGYubWVkaWNhdGlvblVzYWdlRnJlcXVlbmN5LmdldERpc3BsYXkobG9vcCkgPT0gc2VsZi5tZWRpY2F0aW9uSXRlbS5GcmVxdWVuY3kpIHtcblx0XHRcdFx0XHRzZWxmLm1TZWxlY3RlZEluZGV4ID0gbG9vcDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGxldCBsb29wID0gMDsgbG9vcCA8IHNlbGYubWVkaWNhdGlvblN0YXR1cy5sZW5ndGg7IGxvb3ArKykge1xuXHRcdFx0aWYgKHNlbGYubWVkaWNhdGlvbkl0ZW0uU3RhdHVzLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImN1cnJlbnRcIikgPj0gMCkge1xuXHRcdFx0XHRzZWxmLm1zU2VsZWN0ZWRJbmRleCA9IDA7XG5cdFx0XHR9IGVsc2UgaWYgKChzZWxmLm1lZGljYXRpb25JdGVtLlN0YXR1cy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJwYXN0XCIpID49IDApIHx8IChzZWxmLm1lZGljYWxDb25kaXRpb25JdGVtLlN0YXR1cy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJiZWZvcmVcIikgPj0gMCkpIHtcblx0XHRcdFx0c2VsZi5tc1NlbGVjdGVkSW5kZXggPSAxO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRvbk1lZGljYXRpb25Vc2FnZUZyZXF1ZW5jeUNoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5tU2VsZWN0ZWRJbmRleCA9IGFyZ3Muc2VsZWN0ZWRJbmRleDtcblx0XHR0aGlzLnVwZGF0ZU1lZGljYXRpb25JdGVtLkZyZXF1ZW5jeUl0ZW1JZCA9IHRoaXMubWVkaWNhdGlvblVzYWdlRnJlcXVlbmN5LmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdFx0dGhpcy51cGRhdGVNZWRpY2F0aW9uSXRlbS5GcmVxdWVuY3kgPSB0aGlzLm1lZGljYXRpb25Vc2FnZUZyZXF1ZW5jeS5nZXREaXNwbGF5KGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdH1cblxuXHRvbk5lZGljYXRpb25TdGF0dXNDaGFuZ2UoYXJncykge1xuXHRcdHRoaXMubXNTZWxlY3RlZEluZGV4ID0gYXJncy5zZWxlY3RlZEluZGV4O1xuXHRcdHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uU3RhdHVzID0gdGhpcy5tZWRpY2F0aW9uU3RhdHVzLmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdH1cblxuXHR1cGRhdGVNZWRpY2F0aW9ucygpIHtcblx0XHR0aGlzLm1TdWJtaXR0ZWQgPSB0cnVlO1xuXHRcdGlmICh0aGlzLm1lZGljYXRpb25JdGVtLkl0ZW1JZCAhPSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uQWN0aW9uID0gXCJVcGRhdGVcIjtcblx0XHRcdHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uSXRlbUlkID0gdGhpcy5tZWRpY2F0aW9uSXRlbS5JdGVtSWQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uQWN0aW9uID0gXCJBZGRcIjtcblx0XHRcdHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uSXRlbUlkID0gMDtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVNZWRpY2F0aW9uSXRlbS5NZWRpY2F0aW9uID0gdGhpcy5NZWRpY2F0aW9uO1xuXHRcdGlmICh0aGlzLnVwZGF0ZU1lZGljYXRpb25JdGVtLk1lZGljYXRpb24gIT0gdW5kZWZpbmVkICYmIHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uTWVkaWNhdGlvbiAhPSBcIlwiICYmIHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uRnJlcXVlbmN5ICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVwZGF0ZU1lZGljYXRpb25JdGVtLlN0YXR1cyAhPSB1bmRlZmluZWQpIHtcblxuXHRcdFx0aHR0cF9yZXF1ZXN0LnJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6IFwiaHR0cHM6Ly93d3cuMjQ3Y2FsbGFkb2MuY29tL1dlYlNlcnZpY2VzL0FQSV9FTVIuYXNteFwiLFxuXHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdFx0XHRoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC94bWxcIiB9LFxuXHRcdFx0XHRjb250ZW50OiBcIjxzb2FwZW52OkVudmVsb3BlIHhtbG5zOnNvYXBlbnY9J2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyB4bWxuczp3ZWI9J2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nPlwiICtcblx0XHRcdFx0XCI8c29hcGVudjpIZWFkZXIvPlwiICtcblx0XHRcdFx0XCI8c29hcGVudjpCb2R5PlwiICtcblx0XHRcdFx0XCI8d2ViOkVNUl9NZWRpY2F0aW9uX1NhdmU+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6S2V5PlwiICsgdGhpcy51c3JkYXRhLktleSArIFwiPC93ZWI6S2V5PlwiICtcblx0XHRcdFx0XCI8d2ViOkdyb3VwTnVtYmVyPlwiICsgdGhpcy51c3JkYXRhLkdyb3VwTnVtYmVyICsgXCI8L3dlYjpHcm91cE51bWJlcj5cIiArXG5cdFx0XHRcdFwiPHdlYjpFeHRlcm5hbE1lbWJlcklkPlwiICsgdGhpcy51c3JkYXRhLkV4dGVybmFsTWVtYmVySWQgKyBcIjwvd2ViOkV4dGVybmFsTWVtYmVySWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6Q29udGVudD5cIiArXG5cdFx0XHRcdFwiPHdlYjpJdGVtSWQ+XCIgKyB0aGlzLnVwZGF0ZU1lZGljYXRpb25JdGVtLkl0ZW1JZCArIFwiPC93ZWI6SXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOk1lZGljYXRpb24+XCIgKyB0aGlzLnVwZGF0ZU1lZGljYXRpb25JdGVtLk1lZGljYXRpb24gKyBcIjwvd2ViOk1lZGljYXRpb24+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RnJlcXVlbmN5PlwiICsgdGhpcy51cGRhdGVNZWRpY2F0aW9uSXRlbS5GcmVxdWVuY3kgKyBcIjwvd2ViOkZyZXF1ZW5jeT5cIiArXG5cdFx0XHRcdFwiPHdlYjpGcmVxdWVuY3lJdGVtSWQ+XCIgKyB0aGlzLnVwZGF0ZU1lZGljYXRpb25JdGVtLkZyZXF1ZW5jeUl0ZW1JZCArIFwiPC93ZWI6RnJlcXVlbmN5SXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOlN0YXR1cz5cIiArIHRoaXMudXBkYXRlTWVkaWNhdGlvbkl0ZW0uU3RhdHVzICsgXCI8L3dlYjpTdGF0dXM+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6QWN0aW9uPlwiICsgdGhpcy51cGRhdGVNZWRpY2F0aW9uSXRlbS5BY3Rpb24gKyBcIjwvd2ViOkFjdGlvbj5cIiArXG5cdFx0XHRcdFwiPHdlYjpEZW1vPjwvd2ViOkRlbW8+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOkVNUl9NZWRpY2F0aW9uX1NhdmU+XCIgK1xuXHRcdFx0XHRcIjwvc29hcGVudjpCb2R5PlwiICtcblx0XHRcdFx0XCI8L3NvYXBlbnY6RW52ZWxvcGU+XCJcblx0XHRcdH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKHJlc3BvbnNlLmNvbnRlbnQsIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cblx0XHRcdFx0XHRsZXQgcmVzID0gcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9NZWRpY2F0aW9uX1NhdmVSZXNwb25zZS5FTVJfTWVkaWNhdGlvbl9TYXZlUmVzdWx0O1xuXHRcdFx0XHRcdGlmIChyZXMuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0c2VsZi5lZGl0TWVkaWNhdGlvbiA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0c2VsZi5nZXRNZWRpY2F0aW9uc0xpc3QoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlcy5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBtZWRpY2FsIGNvbmRpdGlvbi4gLyBTZXNzaW9uIGV4cGlyZWQuVHJ5IEFmdGVyIHNvbWUgdGltZSBcIik7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgbWVkaWNhbCBjb25kaXRpb24uXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3I6LS0gXCIgKyBlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGRlbGV0ZU1lZGljYXRpb25zKCkge1xuXHRcdGlmICh0aGlzLmRlbE1lZGljYXRpb24uTWVkaWNhdGlvbiAhPSB1bmRlZmluZWQgJiYgdGhpcy5kZWxNZWRpY2F0aW9uLkZyZXF1ZW5jeSAhPSB1bmRlZmluZWQgJiYgdGhpcy5kZWxNZWRpY2F0aW9uLlN0YXR1cyAhPSB1bmRlZmluZWQpIHtcblx0XHRcdGh0dHBfcmVxdWVzdC5yZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiBcImh0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9XZWJTZXJ2aWNlcy9BUElfRU1SLmFzbXhcIixcblx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQveG1sXCIgfSxcblx0XHRcdFx0Y29udGVudDogXCI8c29hcGVudjpFbnZlbG9wZSB4bWxuczpzb2FwZW52PSdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycgeG1sbnM6d2ViPSdodHRwczovL3d3dy4yNDdDYWxsQURvYy5jb20vV2ViU2VydmljZXMvJz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6SGVhZGVyLz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6Qm9keT5cIiArXG5cdFx0XHRcdFwiPHdlYjpFTVJfTWVkaWNhdGlvbl9TYXZlPlwiICtcblx0XHRcdFx0XCI8d2ViOktleT5cIiArIHRoaXMudXNyZGF0YS5LZXkgKyBcIjwvd2ViOktleT5cIiArXG5cdFx0XHRcdFwiPHdlYjpHcm91cE51bWJlcj5cIiArIHRoaXMudXNyZGF0YS5Hcm91cE51bWJlciArIFwiPC93ZWI6R3JvdXBOdW1iZXI+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RXh0ZXJuYWxNZW1iZXJJZD5cIiArIHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkICsgXCI8L3dlYjpFeHRlcm5hbE1lbWJlcklkPlwiICtcblx0XHRcdFx0XCI8d2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6SXRlbUlkPlwiICsgdGhpcy5kZWxNZWRpY2F0aW9uLkl0ZW1JZCArIFwiPC93ZWI6SXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOk1lZGljYXRpb24+XCIgKyB0aGlzLmRlbE1lZGljYXRpb24uTWVkaWNhdGlvbiArIFwiPC93ZWI6TWVkaWNhdGlvbj5cIiArXG5cdFx0XHRcdFwiPHdlYjpGcmVxdWVuY3k+XCIgKyB0aGlzLmRlbE1lZGljYXRpb24uRnJlcXVlbmN5ICsgXCI8L3dlYjpGcmVxdWVuY3k+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RnJlcXVlbmN5SXRlbUlkPlwiICsgdGhpcy5kZWxNZWRpY2F0aW9uLkZyZXF1ZW5jeUl0ZW1JZCArIFwiPC93ZWI6RnJlcXVlbmN5SXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOlN0YXR1cz5cIiArIHRoaXMuZGVsTWVkaWNhdGlvbi5TdGF0dXMgKyBcIjwvd2ViOlN0YXR1cz5cIiArXG5cdFx0XHRcdFwiPC93ZWI6Q29udGVudD5cIiArXG5cdFx0XHRcdFwiPHdlYjpBY3Rpb24+RGVsZXRlPC93ZWI6QWN0aW9uPlwiICtcblx0XHRcdFx0XCI8d2ViOkRlbW8+PC93ZWI6RGVtbz5cIiArXG5cdFx0XHRcdFwiPC93ZWI6RU1SX01lZGljYXRpb25fU2F2ZT5cIiArXG5cdFx0XHRcdFwiPC9zb2FwZW52OkJvZHk+XCIgK1xuXHRcdFx0XHRcIjwvc29hcGVudjpFbnZlbG9wZT5cIlxuXHRcdFx0fSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcocmVzcG9uc2UuY29udGVudCwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRsZXQgcmVzID0gcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9NZWRpY2F0aW9uX1NhdmVSZXNwb25zZS5FTVJfTWVkaWNhdGlvbl9TYXZlUmVzdWx0O1xuXHRcdFx0XHRcdGlmIChyZXMuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0c2VsZi5lZGl0TWVkaWNhdGlvbiA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0c2VsZi5kZWxNZWRpY2F0aW9uID0ge307XG5cdFx0XHRcdFx0XHRzZWxmLmdldE1lZGljYXRpb25zTGlzdCgpO1xuXHRcdFx0XHRcdFx0c2VsZi5kZWxNZWRpY2F0aW9uLmluZGV4ID0gLTE7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXMuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vXHRhbGVydChcIkVycm9yIHdoaWxlIHVwZGF0aW5nIG1lZGljYWwgY29uZGl0aW9uLiAvIFNlc3Npb24gZXhwaXJlZC5UcnkgQWZ0ZXIgc29tZSB0aW1lIFwiKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSB1cGRhdGluZyBtZWRpY2FsIGNvbmRpdGlvbi5cIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvcjorKyBcIiArIGUpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0YWRkTWVkaWNhdGlvbigpIHtcblx0XHR0aGlzLmVkaXRNZWRpY2F0aW9uID0gdHJ1ZTtcblx0XHR0aGlzLm1TdWJtaXR0ZWQgPSBmYWxzZTtcblx0XHR0aGlzLm1lZGljYXRpb25JdGVtID0ge307XG5cdFx0dGhpcy5tU2VsZWN0ZWRJbmRleCA9IG51bGw7XG5cdFx0dGhpcy5tc1NlbGVjdGVkSW5kZXggPSBudWxsO1xuXHRcdHRoaXMuTWVkaWNhdGlvbiA9IFwiXCI7XG5cdFx0dGhpcy5nZXRNZWRpY2F0aW9uVXNhZ2VGcmVxdWVuY3koKTtcblx0fVxuXHRkZWxNZWRpY2F0aW9uOiBhbnkgPSB7fTtcblx0b25TZWxlY3RNZWRpY2F0aW9uKGksIGl0ZW0pIHtcblx0XHRmb3IgKGxldCBpbmRleCBpbiB0aGlzLm1lZGljYXRpb25zTGlzdCkge1xuXHRcdFx0dGhpcy5tZWRpY2F0aW9uc0xpc3RbaW5kZXhdLmltZyA9IFwicmVzOi8vcmVkZWRpdFwiO1xuXHRcdH1cblx0XHR0aGlzLm1lZGljYXRpb25zTGlzdFtpXS5pbWcgPSBcInJlczovL2NoZWNrZWRpY29uXCI7XG5cdFx0dGhpcy5kZWxNZWRpY2F0aW9uID0gaXRlbTtcblx0XHR0aGlzLmRlbE1lZGljYXRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdHRoaXMuZGVsTWVkaWNhdGlvbi5pbmRleCA9IGk7XG5cdH1cblx0ZWRpdE1lZGljYWxDb25kaXRpb24oaXRlbSkge1xuXHRcdHRoaXMuZWRpdE1vZGUgPSB0cnVlO1xuXHRcdHRoaXMubWNTdWJtaXR0ZWQgPSBmYWxzZTtcblx0XHR0aGlzLm1lZGljYWxDb25kaXRpb25JdGVtID0gaXRlbTtcblx0XHR0aGlzLkRlc2NyaXB0aW9uID0gaXRlbS5EZXNjcmlwdGlvbjtcblx0XHR0aGlzLmdldEVNUk1lZGljYWxDb25kaXRpb25zTGlzdCgpO1xuXHR9XG5cdGNsb3NlTWVkaWNhbENvbmRpdGlvbigpIHtcblx0XHR0aGlzLm1jU2VsZWN0ZWRJbmRleCA9IG51bGw7XG5cdFx0dGhpcy5tY3NTZWxlY3RlZEluZGV4ID0gbnVsbDtcblx0XHR0aGlzLkRlc2NyaXB0aW9uID0gXCJcIjtcblx0XHR0aGlzLmVkaXRNb2RlID0gZmFsc2U7XG5cdH1cblx0ZGVsTWVkaWNhbENvbmRpdGlvbjogYW55ID0ge307XG5cdG9uU2VsZWN0TWVkaWNhbENvbmRpdGlvbihpLCBpdGVtKSB7XG5cdFx0Zm9yIChsZXQgaW5kZXggaW4gdGhpcy5tZWRpY2FsQ29uZGl0aW9uc0xpc3QpIHtcblx0XHRcdHRoaXMubWVkaWNhbENvbmRpdGlvbnNMaXN0W2luZGV4XS5pbWcgPSBcInJlczovL3JlZGVkaXRcIjtcblx0XHR9XG5cdFx0dGhpcy5tZWRpY2FsQ29uZGl0aW9uc0xpc3RbaV0uaW1nID0gXCJyZXM6Ly9jaGVja2VkaWNvblwiO1xuXHRcdHRoaXMuZGVsTWVkaWNhbENvbmRpdGlvbiA9IGl0ZW07XG5cdFx0dGhpcy5kZWxNZWRpY2FsQ29uZGl0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHR0aGlzLmRlbE1lZGljYWxDb25kaXRpb24uaW5kZXggPSBpO1xuXHR9XG5cblx0Z2V0TWVkaWNhbENvbmRpdGlvbnNMaXN0KCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRzZWxmLm1lZGljYWxDb25kaXRpb25zTGlzdCA9IFtdO1xuXHRcdHNlbGYud2ViYXBpLmdldE1lZGljYWxDb25kaXRpb25zX2h0dHAoKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0aWYgKHJlc3VsdC5BUElSZXN1bHRfRU1STWVkaWNhbENvbmRpdGlvbl9HcmlkLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIgJiYgcmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2FsQ29uZGl0aW9uX0dyaWQuTWVkaWNhbENvbmRpdGlvbkNvdW50ICE9ICcwJykge1xuXHRcdFx0XHRcdGxldCBtID0gcGFyc2VJbnQocmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2FsQ29uZGl0aW9uX0dyaWQuTWVkaWNhbENvbmRpdGlvbkNvdW50KTtcblx0XHRcdFx0XHRpZiAobSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQuQVBJUmVzdWx0X0VNUk1lZGljYWxDb25kaXRpb25fR3JpZC5NZWRpY2FsQ29uZGl0aW9uTGlzdC5FTVJfTWVkaWNhbENvbmRpdGlvbkl0ZW0uaW1nID0gXCJyZXM6Ly9yZWRlZGl0XCI7XG5cdFx0XHRcdFx0XHRzZWxmLm1lZGljYWxDb25kaXRpb25zTGlzdC5wdXNoKHJlc3VsdC5BUElSZXN1bHRfRU1STWVkaWNhbENvbmRpdGlvbl9HcmlkLk1lZGljYWxDb25kaXRpb25MaXN0LkVNUl9NZWRpY2FsQ29uZGl0aW9uSXRlbSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdC5BUElSZXN1bHRfRU1STWVkaWNhbENvbmRpdGlvbl9HcmlkLk1lZGljYWxDb25kaXRpb25MaXN0LkVNUl9NZWRpY2FsQ29uZGl0aW9uSXRlbVtpXS5pbWcgPSBcInJlczovL3JlZGVkaXRcIjtcblx0XHRcdFx0XHRcdFx0c2VsZi5tZWRpY2FsQ29uZGl0aW9uc0xpc3QucHVzaChyZXN1bHQuQVBJUmVzdWx0X0VNUk1lZGljYWxDb25kaXRpb25fR3JpZC5NZWRpY2FsQ29uZGl0aW9uTGlzdC5FTVJfTWVkaWNhbENvbmRpdGlvbkl0ZW1baV0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvci9ObyBNZWRpY2F0aW9uc1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIE1lZGljYXRpb25zLi4uLiBcIiArIGVycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0Z2V0RU1STWVkaWNhbENvbmRpdGlvbnNMaXN0KCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRpZiAoc2VsZi5lbXJNZWRpY2FsQ29uZGl0aW9uLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRzZWxmLndlYmFwaS5nZXRDb2RlTGlzdChcIkVNUl9NZWRpY2FsQ29uZGl0aW9uXCIpLnN1YnNjcmliZShkYXRhID0+IHtcblx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgbG9vcCA9IDA7IGxvb3AgPCByZXN1bHQuQVBJUmVzdWx0X0NvZGVMaXN0Lkxpc3QuSXRlbUNvdW50OyBsb29wKyspIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5lbXJNZWRpY2FsQ29uZGl0aW9uLnNldEl0ZW0obG9vcCwge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiByZXN1bHQuQVBJUmVzdWx0X0NvZGVMaXN0Lkxpc3QuTGlzdC5Db2RlTGlzdEl0ZW1bbG9vcF0uSXRlbUlkLFxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuTGlzdC5MaXN0LkNvZGVMaXN0SXRlbVtsb29wXS5WYWx1ZSxcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvZGVMaXN0Lkxpc3QuTGlzdC5Db2RlTGlzdEl0ZW1bbG9vcF0uVmFsdWUgPT0gc2VsZi5tZWRpY2FsQ29uZGl0aW9uSXRlbS5NZWRpY2FsQ29uZGl0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5tY1NlbGVjdGVkSW5kZXggPSBsb29wO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvci9ObyBNZWRpY2F0aW9uc1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBNZWRpY2F0aW9ucy4uLi4gXCIgKyBlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKGxldCBsb29wID0gMDsgbG9vcCA8IHNlbGYuZW1yTWVkaWNhbENvbmRpdGlvbi5sZW5ndGg7IGxvb3ArKykge1xuXHRcdFx0XHRpZiAoc2VsZi5tZWRpY2FsQ29uZGl0aW9uSXRlbS5NZWRpY2FsQ29uZGl0aW9uID09IHNlbGYuZW1yTWVkaWNhbENvbmRpdGlvbi5nZXREaXNwbGF5KGxvb3ApKSB7XG5cdFx0XHRcdFx0c2VsZi5tY1NlbGVjdGVkSW5kZXggPSBsb29wO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAobGV0IGxvb3AgPSAwOyBsb29wIDwgc2VsZi5tZWRpY2FsQ29uZGl0aW9uU3RhdHVzLmxlbmd0aDsgbG9vcCsrKSB7XG5cdFx0XHRpZiAoc2VsZi5tZWRpY2FsQ29uZGl0aW9uSXRlbS5TdGF0dXMudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiY3VycmVudFwiKSA+PSAwKSB7XG5cdFx0XHRcdHNlbGYubWNzU2VsZWN0ZWRJbmRleCA9IDA7XG5cdFx0XHR9IGVsc2UgaWYgKChzZWxmLm1lZGljYWxDb25kaXRpb25JdGVtLlN0YXR1cy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJwYXN0XCIpID49IDApIHx8IChzZWxmLm1lZGljYWxDb25kaXRpb25JdGVtLlN0YXR1cy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJiZWZvcmVcIikgPj0gMCkpIHtcblx0XHRcdFx0c2VsZi5tY3NTZWxlY3RlZEluZGV4ID0gMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRvbk1lZGljYWxDb25kaXRpb25DaGFuZ2UoYXJncykge1xuXHRcdHRoaXMubWNTZWxlY3RlZEluZGV4ID0gYXJncy5zZWxlY3RlZEluZGV4O1xuXHRcdHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLk1lZGljYWxDb25kaXRpb25JdGVtSWQgPSB0aGlzLmVtck1lZGljYWxDb25kaXRpb24uZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0XHR0aGlzLnVwZGF0ZU1lZENvbmRpdGlvbi5NZWRpY2FsQ29uZGl0aW9uID0gdGhpcy5lbXJNZWRpY2FsQ29uZGl0aW9uLmdldERpc3BsYXkoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0fVxuXG5cdG9uTmVkaWNhbENvbmRpdGlvblN0YXR1c0NoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5tY3NTZWxlY3RlZEluZGV4ID0gYXJncy5zZWxlY3RlZEluZGV4O1xuXHRcdHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLlN0YXR1cyA9IHRoaXMubWVkaWNhbENvbmRpdGlvblN0YXR1cy5nZXRWYWx1ZShhcmdzLnNlbGVjdGVkSW5kZXgpO1xuXHR9XG5cblx0dXBkYXRlTWVkaWNhbENvbmRpdGlvbigpIHtcblx0XHR0aGlzLm1jU3VibWl0dGVkID0gdHJ1ZTtcblx0XHRpZiAodGhpcy5tZWRpY2FsQ29uZGl0aW9uSXRlbS5JdGVtSWQgIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLnVwZGF0ZU1lZENvbmRpdGlvbi5BY3Rpb24gPSBcIlVwZGF0ZVwiO1xuXHRcdFx0dGhpcy51cGRhdGVNZWRDb25kaXRpb24uSXRlbUlkID0gdGhpcy5tZWRpY2FsQ29uZGl0aW9uSXRlbS5JdGVtSWQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLkFjdGlvbiA9IFwiQWRkXCI7XG5cdFx0XHR0aGlzLnVwZGF0ZU1lZENvbmRpdGlvbi5JdGVtSWQgPSAwO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZU1lZENvbmRpdGlvbi5EZXNjcmlwdGlvbiA9IHRoaXMuRGVzY3JpcHRpb247XG5cdFx0Ly90aGlzLnVwZGF0ZU1lZENvbmRpdGlvbi5EZXNjcmlwdGlvbiA9IHRoaXMubWVkaWNhbENvbmRpdGlvbkl0ZW0uRGVzY3JpcHRpb247XG5cdFx0aWYgKHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLk1lZGljYWxDb25kaXRpb24gIT0gdW5kZWZpbmVkICYmIHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLkRlc2NyaXB0aW9uICE9IFwiXCIgJiYgdGhpcy51cGRhdGVNZWRDb25kaXRpb24uRGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkICYmIHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLlN0YXR1cyAhPSB1bmRlZmluZWQpIHtcblx0XHRcdGh0dHBfcmVxdWVzdC5yZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiBcImh0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9XZWJTZXJ2aWNlcy9BUElfRU1SLmFzbXhcIixcblx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQveG1sXCIgfSxcblx0XHRcdFx0Y29udGVudDogXCI8c29hcGVudjpFbnZlbG9wZSB4bWxuczpzb2FwZW52PSdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycgeG1sbnM6d2ViPSdodHRwczovL3d3dy4yNDdDYWxsQURvYy5jb20vV2ViU2VydmljZXMvJz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6SGVhZGVyLz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6Qm9keT5cIiArXG5cdFx0XHRcdFwiPHdlYjpFTVJfTWVkaWNhbENvbmRpdGlvbl9TYXZlPlwiICtcblx0XHRcdFx0XCI8d2ViOktleT5cIiArIHRoaXMudXNyZGF0YS5LZXkgKyBcIjwvd2ViOktleT5cIiArXG5cdFx0XHRcdFwiPHdlYjpHcm91cE51bWJlcj5cIiArIHRoaXMudXNyZGF0YS5Hcm91cE51bWJlciArIFwiPC93ZWI6R3JvdXBOdW1iZXI+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RXh0ZXJuYWxNZW1iZXJJZD5cIiArIHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkICsgXCI8L3dlYjpFeHRlcm5hbE1lbWJlcklkPlwiICtcblx0XHRcdFx0XCI8d2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6SXRlbUlkPlwiICsgdGhpcy51cGRhdGVNZWRDb25kaXRpb24uSXRlbUlkICsgXCI8L3dlYjpJdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6TWVkaWNhbENvbmRpdGlvbj5cIiArIHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLk1lZGljYWxDb25kaXRpb24gKyBcIjwvd2ViOk1lZGljYWxDb25kaXRpb24+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6TWVkaWNhbENvbmRpdGlvbkl0ZW1JZD5cIiArIHRoaXMudXBkYXRlTWVkQ29uZGl0aW9uLk1lZGljYWxDb25kaXRpb25JdGVtSWQgKyBcIjwvd2ViOk1lZGljYWxDb25kaXRpb25JdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RGVzY3JpcHRpb24+XCIgKyB0aGlzLnVwZGF0ZU1lZENvbmRpdGlvbi5EZXNjcmlwdGlvbiArIFwiPC93ZWI6RGVzY3JpcHRpb24+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6U3RhdHVzPlwiICsgdGhpcy51cGRhdGVNZWRDb25kaXRpb24uU3RhdHVzICsgXCI8L3dlYjpTdGF0dXM+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6QWN0aW9uPlwiICsgdGhpcy51cGRhdGVNZWRDb25kaXRpb24uQWN0aW9uICsgXCI8L3dlYjpBY3Rpb24+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RGVtbz48L3dlYjpEZW1vPlwiICtcblx0XHRcdFx0XCI8L3dlYjpFTVJfTWVkaWNhbENvbmRpdGlvbl9TYXZlPlwiICtcblx0XHRcdFx0XCI8L3NvYXBlbnY6Qm9keT5cIiArXG5cdFx0XHRcdFwiPC9zb2FwZW52OkVudmVsb3BlPlwiXG5cdFx0XHR9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhyZXNwb25zZS5jb250ZW50LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdGxldCByZXMgPSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRU1SX01lZGljYWxDb25kaXRpb25fU2F2ZVJlc3BvbnNlLkVNUl9NZWRpY2FsQ29uZGl0aW9uX1NhdmVSZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKHJlcy5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmVkaXRNb2RlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRzZWxmLmdldE1lZGljYWxDb25kaXRpb25zTGlzdCgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzLk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvZ291dCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhbGVydChcIkVycm9yIHdoaWxlIHVwZGF0aW5nIG1lZGljYWwgY29uZGl0aW9uLiAvIFNlc3Npb24gZXhwaXJlZC5UcnkgQWZ0ZXIgc29tZSB0aW1lIFwiKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSB1cGRhdGluZyBtZWRpY2FsIGNvbmRpdGlvbi5cIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvcjo+IFwiICsgZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRkZWxldGVNZWRpY2FsQ29uZGl0aW9ucygpIHtcblx0XHRpZiAodGhpcy5kZWxNZWRpY2FsQ29uZGl0aW9uLk1lZGljYWxDb25kaXRpb24gIT0gdW5kZWZpbmVkICYmIHRoaXMuZGVsTWVkaWNhbENvbmRpdGlvbi5EZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgdGhpcy5kZWxNZWRpY2FsQ29uZGl0aW9uLlN0YXR1cyAhPSB1bmRlZmluZWQpIHtcblx0XHRcdGh0dHBfcmVxdWVzdC5yZXF1ZXN0KHtcblx0XHRcdFx0dXJsOiBcImh0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9XZWJTZXJ2aWNlcy9BUElfRU1SLmFzbXhcIixcblx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQveG1sXCIgfSxcblx0XHRcdFx0Y29udGVudDogXCI8c29hcGVudjpFbnZlbG9wZSB4bWxuczpzb2FwZW52PSdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycgeG1sbnM6d2ViPSdodHRwczovL3d3dy4yNDdDYWxsQURvYy5jb20vV2ViU2VydmljZXMvJz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6SGVhZGVyLz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6Qm9keT5cIiArXG5cdFx0XHRcdFwiPHdlYjpFTVJfTWVkaWNhbENvbmRpdGlvbl9TYXZlPlwiICtcblx0XHRcdFx0XCI8d2ViOktleT5cIiArIHRoaXMudXNyZGF0YS5LZXkgKyBcIjwvd2ViOktleT5cIiArXG5cdFx0XHRcdFwiPHdlYjpHcm91cE51bWJlcj5cIiArIHRoaXMudXNyZGF0YS5Hcm91cE51bWJlciArIFwiPC93ZWI6R3JvdXBOdW1iZXI+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RXh0ZXJuYWxNZW1iZXJJZD5cIiArIHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkICsgXCI8L3dlYjpFeHRlcm5hbE1lbWJlcklkPlwiICtcblx0XHRcdFx0XCI8d2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6SXRlbUlkPlwiICsgdGhpcy5kZWxNZWRpY2FsQ29uZGl0aW9uLkl0ZW1JZCArIFwiPC93ZWI6SXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOk1lZGljYWxDb25kaXRpb24+XCIgKyB0aGlzLmRlbE1lZGljYWxDb25kaXRpb24uTWVkaWNhbENvbmRpdGlvbiArIFwiPC93ZWI6TWVkaWNhbENvbmRpdGlvbj5cIiArXG5cdFx0XHRcdFwiPHdlYjpNZWRpY2FsQ29uZGl0aW9uSXRlbUlkPlwiICsgdGhpcy5kZWxNZWRpY2FsQ29uZGl0aW9uLk1lZGljYWxDb25kaXRpb25JdGVtSWQgKyBcIjwvd2ViOk1lZGljYWxDb25kaXRpb25JdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RGVzY3JpcHRpb24+XCIgKyB0aGlzLmRlbE1lZGljYWxDb25kaXRpb24uRGVzY3JpcHRpb24gKyBcIjwvd2ViOkRlc2NyaXB0aW9uPlwiICtcblx0XHRcdFx0XCI8d2ViOlN0YXR1cz5cIiArIHRoaXMuZGVsTWVkaWNhbENvbmRpdGlvbi5TdGF0dXMgKyBcIjwvd2ViOlN0YXR1cz5cIiArXG5cdFx0XHRcdFwiPC93ZWI6Q29udGVudD5cIiArXG5cdFx0XHRcdFwiPHdlYjpBY3Rpb24+RGVsZXRlPC93ZWI6QWN0aW9uPlwiICtcblx0XHRcdFx0XCI8d2ViOkRlbW8+PC93ZWI6RGVtbz5cIiArXG5cdFx0XHRcdFwiPC93ZWI6RU1SX01lZGljYWxDb25kaXRpb25fU2F2ZT5cIiArXG5cdFx0XHRcdFwiPC9zb2FwZW52OkJvZHk+XCIgK1xuXHRcdFx0XHRcIjwvc29hcGVudjpFbnZlbG9wZT5cIlxuXHRcdFx0fSkudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcocmVzcG9uc2UuY29udGVudCwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRsZXQgcmVzID0gcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9NZWRpY2FsQ29uZGl0aW9uX1NhdmVSZXNwb25zZS5FTVJfTWVkaWNhbENvbmRpdGlvbl9TYXZlUmVzdWx0O1xuXHRcdFx0XHRcdGlmIChyZXMuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0c2VsZi5lZGl0TW9kZSA9IGZhbHNlOyBzZWxmLmRlbE1lZGljYWxDb25kaXRpb24uaW5kZXggPSAtMTtcblx0XHRcdFx0XHRcdHNlbGYuZ2V0TWVkaWNhbENvbmRpdGlvbnNMaXN0KCk7XG5cdFx0XHRcdFx0XHRzZWxmLmRlbE1lZGljYWxDb25kaXRpb24gPSB7fTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlcy5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBtZWRpY2FsIGNvbmRpdGlvbi4gLyBTZXNzaW9uIGV4cGlyZWQuVHJ5IEFmdGVyIHNvbWUgdGltZSBcIik7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgbWVkaWNhbCBjb25kaXRpb24uXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3I6PDwgXCIgKyBlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRhZGRNZWRpY2FsQ29uZGl0aW9uKCkge1xuXHRcdHRoaXMuZWRpdE1vZGUgPSB0cnVlO1xuXHRcdHRoaXMubWNTdWJtaXR0ZWQgPSBmYWxzZTtcblx0XHR0aGlzLm1lZGljYWxDb25kaXRpb25JdGVtID0ge307XG5cdFx0dGhpcy5tY1NlbGVjdGVkSW5kZXggPSBudWxsO1xuXHRcdHRoaXMubWNzU2VsZWN0ZWRJbmRleCA9IG51bGw7XG5cdFx0dGhpcy5nZXRFTVJNZWRpY2FsQ29uZGl0aW9uc0xpc3QoKTtcblx0fVxuXHRzdXJnZXJ5SGlzR2V0KCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRzZWxmLndlYmFwaS5ncmlkR2V0SW5IZWFsdGgoXCJFTVJfU3VyZ2VyeUhpc3RvcnlfR3JpZF9HZXRcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0VNUlN1cmdlcnlIaXN0b3J5X0dyaWQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X0VNUlN1cmdlcnlIaXN0b3J5X0dyaWQuU3VyZ2VyeUhpc3RvcnlDb3VudCAhPSAnMCcpIHtcblx0XHRcdFx0XHRzZWxmLnN1cmdIaXNMaXN0ID0gW107XG5cdFx0XHRcdFx0bGV0IHN1cmdlcnkgPSByZXN1bHQuQVBJUmVzdWx0X0VNUlN1cmdlcnlIaXN0b3J5X0dyaWQuU3VyZ2VyeUhpc3RvcnlMaXN0LkVNUl9TdXJnZXJ5SXRlbTtcblx0XHRcdFx0XHRpZiAoc3VyZ2VyeS5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHN1cmdlcnkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5zdXJnSGlzTGlzdC5wdXNoKHsgXCJJdGVtSWRcIjogc3VyZ2VyeVtpXS5JdGVtSWQsIFwiU3VyZ2VyeVwiOiBzdXJnZXJ5W2ldLlN1cmdlcnksIFwiV2hlblwiOiBzdXJnZXJ5W2ldLldoZW4sIFwiaW1nXCI6IFwicmVzOi8vcmVkZWRpdFwiIH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxmLnN1cmdIaXNMaXN0LnB1c2goeyBcIkl0ZW1JZFwiOiBzdXJnZXJ5Lkl0ZW1JZCwgXCJTdXJnZXJ5XCI6IHN1cmdlcnkuU3VyZ2VyeSwgXCJXaGVuXCI6IHN1cmdlcnkuV2hlbiwgXCJpbWdcIjogXCJyZXM6Ly9yZWRlZGl0XCIgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfRU1SU3VyZ2VyeUhpc3RvcnlfR3JpZC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImVycm9yIG9yIG5vIHN1Z2VyeSBoaXMtLT5cIiArIHJlc3VsdC5BUElSZXN1bHRfRU1SU3VyZ2VyeUhpc3RvcnlfR3JpZC5NZXNzYWdlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIFN1cmdlcnkgSGlzIFwiICsgZXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblx0aW1hZ2VWaWV3QXJyYXk6IGFueSA9IFtdO1xuXHRtZWRpY2FsSW1hZ0xpc3QoKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdHNlbGYud2ViYXBpLmdyaWRHZXRJbkhlYWx0aChcIkVNUl9NZWRpY2FsSW1hZ2VfR3JpZF9HZXRcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0VNUk1lZGljYWxJbWFnZV9HcmlkLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIgJiYgcmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2FsSW1hZ2VfR3JpZC5NZWRpY2FsSW1hZ2VDb3VudCAhPSAnMCcpIHtcblx0XHRcdFx0XHRzZWxmLm1lZGltZ2xpc3QgPSBbXTsgc2VsZi5pbWFnZVZpZXdBcnJheSA9IFtdO1xuXHRcdFx0XHRcdGxldCBpbWFnZXMgPSByZXN1bHQuQVBJUmVzdWx0X0VNUk1lZGljYWxJbWFnZV9HcmlkLk1lZGljYWxJbWFnZUxpc3QuRU1SX01lZGljYWxJbWFnZUl0ZW07XG5cdFx0XHRcdFx0aWYgKGltYWdlcy5sZW5ndGggIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRzZWxmLm1lZGltZ2xpc3QucHVzaChpbWFnZXNbaV0pO1xuXHRcdFx0XHRcdFx0XHRzZWxmLmltYWdlVmlld0FycmF5LnB1c2goJ2h0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9tZW1iZXIvJyArIHNlbGYubWVkaW1nbGlzdFtpXS5JbWFnZVNvdXJjZVNtYWxsVVJMKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5tZWRpbWdsaXN0LnB1c2goaW1hZ2VzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2VsZi5jcmVhdGVJdGVtU3BlYyhzZWxmLm1lZGltZ2xpc3QubGVuZ3RoIC8gMyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdF9FTVJNZWRpY2FsSW1hZ2VfR3JpZC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImVycm9yIC8gbm8gaW1hZ2VzLS0+XCIgKyByZXN1bHQuQVBJUmVzdWx0X0VNUk1lZGljYWxJbWFnZV9HcmlkLk1lc3NhZ2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3IgaW4gTWVkaWNhbCBJbWFnZXMgSGlzIFwiICsgZXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblx0aXRlbVNwZWM6IGFueSA9IFtdO1xuXHRjcmVhdGVJdGVtU3BlYyhsZW5ndGgpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLml0ZW1TcGVjLnB1c2goXCJhdXRvXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5pdGVtU3BlYy5qb2luKFwiLFwiKTtcblx0fVxuXHRpc1ZhbGlkRGF0ZSgpIHtcblx0XHRsZXQgZGF0ZSA9IHRoaXMuaW1nZGF0ZTtcblx0XHRsZXQgbWF0Y2hlcyA9IC9eKFxcZHsxLDJ9KVstXFwvXShcXGR7MSwyfSlbLVxcL10oXFxkezR9KSQvLmV4ZWMoZGF0ZSk7XG5cdFx0aWYgKG1hdGNoZXMgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRcdGxldCBkOiBhbnkgPSBtYXRjaGVzWzJdOyBsZXQgbTogYW55O1xuXHRcdG0gPSBwYXJzZUludChtYXRjaGVzWzFdKSAtIDE7XG5cdFx0bGV0IHk6IGFueSA9IG1hdGNoZXNbM107XG5cdFx0bGV0IGNvbXBvc2VkRGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQpO1xuXHRcdHJldHVybiBjb21wb3NlZERhdGUuZ2V0RGF0ZSgpID09IGQgJiZcblx0XHRcdGNvbXBvc2VkRGF0ZS5nZXRNb250aCgpID09IG0gJiZcblx0XHRcdGNvbXBvc2VkRGF0ZS5nZXRGdWxsWWVhcigpID09IHkgJiYgY29tcG9zZWREYXRlLmdldFRpbWUoKSA8IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHR9XG5cdGVkaXREcnVnKGl0ZW06IGFueSwgaSkge1xuXHRcdGlmICh0aGlzLmRlbGV0ZURydWdPYmouc2VsZWN0ZWQgIT0gdHJ1ZSkge1xuXHRcdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlOyB0aGlzLmRlbGV0ZURydWdPYmogPSB7fTtcblx0XHRcdHRoaXMuZHJ1Z25hbWUgPSBpdGVtLkRydWc7IHRoaXMuZWRpdG9ydXBkYXRlLmFkZCA9IDA7IHRoaXMuZHJ1Z2Zvcm0gPSBmYWxzZTsgdGhpcy5yZWFjdGlvbiA9IGl0ZW0uUmVhY3Rpb247XG5cdFx0XHR0aGlzLmRlbGV0ZURydWdPYmouSXRlbUlkID0gaXRlbS5JdGVtSWQ7IHRoaXMuZGVsZXRlRHJ1Z09iai5pbmRleCA9IGk7IHRoaXMuZGVsZXRlRHJ1Z09iai5pbWcgPSBcInJlczovL3JlZGVkaXRcIjtcblx0XHR9XG5cdH1cblx0ZWRpdFN1cmdlcnlIaXMoaXRlbTogYW55LCBpKSB7XG5cdFx0aWYgKHRoaXMuZGVsU3VyZ2VyeS5zZWxlY3RlZCAhPSB0cnVlKSB7XG5cdFx0XHR0aGlzLmVkaXRTdXJnZXJ5ID0gdHJ1ZTsgdGhpcy5kZWxTdXJnZXJ5ID0ge307XG5cdFx0XHR0aGlzLnN1cmdlcnkgPSBpdGVtLlN1cmdlcnk7IHRoaXMuZWRpdG9ydXBkYXRlLmFkZCA9IDA7IHRoaXMuc3VyZ2Zvcm0gPSBmYWxzZTsgdGhpcy5zdXJnd2hlbiA9IGl0ZW0uV2hlbjtcblx0XHRcdHRoaXMuZGVsU3VyZ2VyeS5JdGVtSWQgPSBpdGVtLkl0ZW1JZDsgdGhpcy5kZWxTdXJnZXJ5LmluZGV4ID0gaTsgdGhpcy5kZWxTdXJnZXJ5LmltZyA9IFwicmVzOi8vcmVkZWRpdFwiO1xuXHRcdH1cblx0fVxuXHRhZGREcnVnKCkge1xuXHRcdHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTsgdGhpcy5kcnVnbmFtZSA9IFwiXCI7IHRoaXMucmVhY3Rpb24gPSBcIlwiO1xuXHRcdHRoaXMuZGVsZXRlRHJ1Z09iaiA9IHt9OyB0aGlzLmVkaXRvcnVwZGF0ZS5hZGQgPSAxOyB0aGlzLmRydWdmb3JtID0gZmFsc2U7XG5cdH1cblx0YWRkU3VyZ2VyeSgpIHtcblx0XHR0aGlzLmVkaXRTdXJnZXJ5ID0gdHJ1ZTsgdGhpcy5zdXJnZXJ5ID0gXCJcIjsgdGhpcy5zdXJnd2hlbiA9IFwiXCI7XG5cdFx0dGhpcy5kZWxTdXJnZXJ5ID0ge307IHRoaXMuZWRpdG9ydXBkYXRlLmFkZCA9IDE7IHRoaXMuc3VyZ2Zvcm0gPSBmYWxzZTtcblx0fVxuXG5cdGVkaXRNZWRpY2FsSW1hZ2VzKCkge1xuXHRcdHRoaXMuZWRpdE1lZEltZyA9IHRydWU7IHRoaXMubWVkaW1nZm9ybSA9IGZhbHNlOyB0aGlzLmltZ2RhdGUgPSBcIlwiOyB0aGlzLnBpYzEgPSBudWxsO1xuXHR9XG5cdHBvcHVwY2xvc2UoKSB7XG5cdFx0dGhpcy5pc1Zpc2libGUgPSBmYWxzZTsgdGhpcy5lZGl0U3VyZ2VyeSA9IGZhbHNlOyB0aGlzLmVkaXRNZWRJbWcgPSBmYWxzZTtcblx0fVxuXHRvblNlbGVjdERydWcoaSwgaXRlbSkge1xuXHRcdGZvciAobGV0IGluZGV4IGluIHRoaXMuZHJ1Z0xpc3QpIHtcblx0XHRcdHRoaXMuZHJ1Z0xpc3RbaW5kZXhdLmltZyA9IFwicmVzOi8vcmVkZWRpdFwiO1xuXHRcdH1cblx0XHR0aGlzLmRydWdMaXN0W2ldLmltZyA9IFwicmVzOi8vY2hlY2tlZGljb25cIjtcblx0XHR0aGlzLmRlbGV0ZURydWdPYmogPSBpdGVtO1xuXHRcdHRoaXMuZGVsZXRlRHJ1Z09iai5zZWxlY3RlZCA9IHRydWU7XG5cdFx0dGhpcy5kZWxldGVEcnVnT2JqLmluZHggPSBpO1xuXHR9XG5cdGNhbmNlbFNlbGVjdCgpIHtcblx0XHR0aGlzLmRlbGV0ZURydWdPYmouc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHR0aGlzLmRlbFN1cmdlcnkuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHR0aGlzLmRlbE1lZGljYXRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHR0aGlzLmRlbE1lZGljYWxDb25kaXRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRmb3IgKGxldCBpIGluIHRoaXMuZHJ1Z0xpc3QpIHtcblx0XHRcdHRoaXMuZHJ1Z0xpc3RbaV0uaW1nID0gXCJyZXM6Ly9yZWRlZGl0XCI7XG5cdFx0XHR0aGlzLmRlbGV0ZURydWdPYmouaW5keCA9IC0xO1xuXHRcdH1cblx0XHRmb3IgKGxldCBqIGluIHRoaXMuc3VyZ0hpc0xpc3QpIHtcblx0XHRcdHRoaXMuc3VyZ0hpc0xpc3Rbal0uaW1nID0gXCJyZXM6Ly9yZWRlZGl0XCI7XG5cdFx0XHR0aGlzLmRlbFN1cmdlcnkuaW5keCA9IC0xO1xuXHRcdH1cblx0XHRmb3IgKGxldCBrIGluIHRoaXMubWVkaWNhdGlvbnNMaXN0KSB7XG5cdFx0XHR0aGlzLm1lZGljYXRpb25zTGlzdFtrXS5pbWcgPSBcInJlczovL3JlZGVkaXRcIjtcblx0XHRcdHRoaXMuZGVsTWVkaWNhdGlvbi5pbmRleCA9IC0xXG5cdFx0fVxuXHRcdGZvciAobGV0IGwgaW4gdGhpcy5tZWRpY2FsQ29uZGl0aW9uc0xpc3QpIHtcblx0XHRcdHRoaXMubWVkaWNhbENvbmRpdGlvbnNMaXN0W2xdLmltZyA9IFwicmVzOi8vcmVkZWRpdFwiO1xuXHRcdFx0dGhpcy5kZWxNZWRpY2FsQ29uZGl0aW9uLmluZGV4ID0gLTE7XG5cdFx0fVxuXHR9XG5cdG9uU2VsZWN0U3VyZ2VyeShpLCBpdGVtKSB7XG5cdFx0Zm9yIChsZXQgaW5kZXggaW4gdGhpcy5zdXJnSGlzTGlzdCkge1xuXHRcdFx0dGhpcy5zdXJnSGlzTGlzdFtpbmRleF0uaW1nID0gXCJyZXM6Ly9yZWRlZGl0XCI7XG5cdFx0fVxuXHRcdHRoaXMuc3VyZ0hpc0xpc3RbaV0uaW1nID0gXCJyZXM6Ly9jaGVja2VkaWNvblwiO1xuXHRcdHRoaXMuZGVsU3VyZ2VyeSA9IGl0ZW07XG5cdFx0dGhpcy5kZWxTdXJnZXJ5LnNlbGVjdGVkID0gdHJ1ZTtcblx0XHR0aGlzLmRlbFN1cmdlcnkuaW5keCA9IGk7XG5cdH1cblx0dXBkYXRlT3JBZGREcnVnKG9wZXJhdGlvbiwgZHJ1ZywgcmVhY3QpIHtcblx0XHR0aGlzLmRydWdmb3JtID0gdHJ1ZTtcblxuXHRcdGlmIChvcGVyYXRpb24gPT0gJ0FkZCcpIHtcblx0XHRcdG9wZXJhdGlvbiA9IChvcGVyYXRpb24gPT0gJ0FkZCcgJiYgdGhpcy5lZGl0b3J1cGRhdGUuYWRkID09IDEpID8gXCJBZGRcIiA6IFwiVXBkYXRlXCI7XG5cdFx0XHRpZiAodGhpcy5lZGl0b3J1cGRhdGUuYWRkID09IDEpIHtcblx0XHRcdFx0dGhpcy5kZWxldGVEcnVnT2JqLkl0ZW1JZCA9IDA7IHRoaXMuZGVsZXRlRHJ1Z09iai5EcnVnID0gdGhpcy5kcnVnbmFtZTsgdGhpcy5kZWxldGVEcnVnT2JqLlJlYWN0aW9uID0gdGhpcy5yZWFjdGlvbjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuZGVsZXRlRHJ1Z09iai5EcnVnID0gdGhpcy5kcnVnbmFtZTsgdGhpcy5kZWxldGVEcnVnT2JqLlJlYWN0aW9uID0gdGhpcy5yZWFjdGlvbjtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKChvcGVyYXRpb24gPT0gJ0RlbGV0ZScgfHwgKGRydWcgJiYgcmVhY3QgJiYgdGhpcy5kcnVnbmFtZS50cmltKCkgIT0gJycgJiYgdGhpcy5yZWFjdGlvbi50cmltKCkgIT0gJycpKSAmJiB0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG5cdFx0XHRodHRwX3JlcXVlc3QucmVxdWVzdCh7XG5cdFx0XHRcdHVybDogXCJodHRwczovL3d3dy4yNDdjYWxsYWRvYy5jb20vV2ViU2VydmljZXMvQVBJX0VNUi5hc214XCIsXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3htbFwiIH0sXG5cdFx0XHRcdGNvbnRlbnQ6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz5cIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLycgPlwiICtcblx0XHRcdFx0XCI8c29hcGVudjpCb2R5Pjx3ZWI6RU1SX0RydWdBbGxlcmd5X1NhdmU+PHdlYjpLZXk+XCIgKyB0aGlzLnVzcmRhdGEuS2V5ICsgXCI8L3dlYjpLZXk+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6R3JvdXBOdW1iZXI+XCIgKyB0aGlzLnVzcmRhdGEuR3JvdXBOdW1iZXIgKyBcIjwvd2ViOkdyb3VwTnVtYmVyPlwiICtcblx0XHRcdFx0XCI8d2ViOkV4dGVybmFsTWVtYmVySWQ+XCIgKyB0aGlzLnVzcmRhdGEuRXh0ZXJuYWxNZW1iZXJJZCArIFwiPC93ZWI6RXh0ZXJuYWxNZW1iZXJJZD48d2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6SXRlbUlkPlwiICsgdGhpcy5kZWxldGVEcnVnT2JqLkl0ZW1JZCArIFwiPC93ZWI6SXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOkRydWc+XCIgKyB0aGlzLmRlbGV0ZURydWdPYmouRHJ1ZyArIFwiPC93ZWI6RHJ1Zz5cIiArXG5cdFx0XHRcdFwiPHdlYjpSZWFjdGlvbj5cIiArIHRoaXMuZGVsZXRlRHJ1Z09iai5SZWFjdGlvbiArIFwiPC93ZWI6UmVhY3Rpb24+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOkNvbnRlbnQ+PHdlYjpBY3Rpb24+XCIgKyBvcGVyYXRpb24gKyBcIjwvd2ViOkFjdGlvbj48d2ViOkRlbW8vPlwiICtcblx0XHRcdFx0XCI8L3dlYjpFTVJfRHJ1Z0FsbGVyZ3lfU2F2ZT48L3NvYXBlbnY6Qm9keT48L3NvYXBlbnY6RW52ZWxvcGU+XCJcblx0XHRcdH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKHJlc3BvbnNlLmNvbnRlbnQsIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0c2VsZi5kZWxldGVEcnVnT2JqLnNlbGVjdGVkID0gZmFsc2U7IHNlbGYuZGVsZXRlRHJ1Z09iai5pbmR4ID0gLTE7XG5cdFx0XHRcdFx0bGV0IHJlc3AgPSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRU1SX0RydWdBbGxlcmd5X1NhdmVSZXNwb25zZS5FTVJfRHJ1Z0FsbGVyZ3lfU2F2ZVJlc3VsdDtcblx0XHRcdFx0XHRpZiAocmVzcC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIG9wZXJhdGlvbiA9PSAnRGVsZXRlJykge1xuXHRcdFx0XHRcdFx0c2VsZi5kcnVnTGlzdC5zcGxpY2Uoc2VsZi5kcnVnTGlzdC5pbmRleE9mKHNlbGYuZGVsZXRlRHJ1Z09iaiksIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzcC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIG9wZXJhdGlvbiA9PSAnQWRkJykge1xuXHRcdFx0XHRcdFx0c2VsZi5pc1Zpc2libGUgPSBmYWxzZTsgbGV0IGFkZGl0ZW0gPSByZXNwLkRydWdBbGxlcmd5TGlzdC5FTVJfRHJ1Z0FsbGVyZ3lJdGVtO1xuXHRcdFx0XHRcdFx0aWYgKGFkZGl0ZW0ubGVuZ3RoICE9IHVuZGVmaW5lZClcblx0XHRcdFx0XHRcdFx0c2VsZi5kcnVnTGlzdC5wdXNoKHsgXCJJdGVtSWRcIjogYWRkaXRlbVthZGRpdGVtLmxlbmd0aCAtIDFdLkl0ZW1JZCwgXCJEcnVnXCI6IGFkZGl0ZW1bYWRkaXRlbS5sZW5ndGggLSAxXS5EcnVnLCBcIlJlYWN0aW9uXCI6IGFkZGl0ZW1bYWRkaXRlbS5sZW5ndGggLSAxXS5SZWFjdGlvbiwgXCJpbWdcIjogXCJyZXM6Ly9yZWRlZGl0XCIgfSk7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHNlbGYuZHJ1Z0xpc3QucHVzaCh7IFwiSXRlbUlkXCI6IGFkZGl0ZW0uSXRlbUlkLCBcIkRydWdcIjogYWRkaXRlbS5EcnVnLCBcIlJlYWN0aW9uXCI6IGFkZGl0ZW0uUmVhY3Rpb24sIFwiaW1nXCI6IFwicmVzOi8vcmVkZWRpdFwiIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzcC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIG9wZXJhdGlvbiA9PSAnVXBkYXRlJykge1xuXHRcdFx0XHRcdFx0c2VsZi5pc1Zpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHNlbGYuZHJ1Z0xpc3Rbc2VsZi5kZWxldGVEcnVnT2JqLmluZGV4XSA9IHNlbGYuZGVsZXRlRHJ1Z09iajtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlc3AuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgb3IgRXJyb3IgaW4gZGVsZXRlIGRydWcgXCIgKyByZXN1bHQuTWVzc2FnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvcjovLyBcIiArIGUpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdG9uU2VsZWN0U2luZ2xlVGFwKCkge1xuXHRcdGlmICh0aGlzLnBpYzEgPT0gbnVsbCkge1xuXHRcdFx0bGV0IGNvbnRleHQgPSBpbWFnZXBpY2tlci5jcmVhdGUoe1xuXHRcdFx0XHRtb2RlOiBcInNpbmdsZVwiXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc3RhcnRTZWxlY3Rpb24oY29udGV4dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFsZXJ0KFwiVXNlciBjYW4gdXBsb2FkIG9ubHkgMSBpbWFnZXNcIik7XG5cdFx0fVxuXHR9XG5cdGltZ2R0bHM6IGFueSA9IHt9O1xuXHRzdGFydFNlbGVjdGlvbihjb250ZXh0KSB7XG5cdFx0bGV0IF90aGF0ID0gdGhpcztcblx0XHRjb250ZXh0XG5cdFx0XHQuYXV0aG9yaXplKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQucHJlc2VudCgpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKChzZWxlY3Rpb24pID0+IHtcblx0XHRcdFx0c2VsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWQuZ2V0SW1hZ2UoKS50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHQvL1x0aWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcblx0XHRcdFx0XHRcdF90aGF0LmltZ2R0bHMuaW1hZ2VOYW1lID0gXCJ0ZXN0LmpwZ1wiO1xuXHRcdFx0XHRcdFx0X3RoYXQuaW1nZHRscy5iYXNlNjR0ZXh0U3RyaW5nID0gcmVzLnRvQmFzZTY0U3RyaW5nKFwianBnXCIsIDEwKTtcblx0XHRcdFx0XHRcdF90aGF0LmltZ2R0bHMuaW1hZ2VTaXplID0gTWF0aC5yb3VuZChfdGhhdC5pbWdkdGxzLmJhc2U2NHRleHRTdHJpbmcucmVwbGFjZSgvXFw9L2csIFwiXCIpLmxlbmd0aCAqIDAuNzUpIC0gMjAwO1xuXG5cdFx0XHRcdFx0XHQvKlx0fSBlbHNlIGlmIChhcHBsaWNhdGlvbi5pb3MpIHtcblx0XHRcdFx0XHRcdFx0XHRsZXQgZGVmTWFuYWdlciA9IE5TRmlsZU1hbmFnZXIuZGVmYXVsdE1hbmFnZXI7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGZpbGVBdHRyaWJ1dGVzID0gZGVmTWFuYWdlci5hdHRyaWJ1dGVzT2ZJdGVtQXRQYXRoRXJyb3Ioc2VsZWN0ZWQuZmlsZVVyaSk7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJpb3NcIik7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZGVmTWFuYWdlcik7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGZpbGVTaXplTnVtYmVyID0gZmlsZUF0dHJpYnV0ZXMub2JqZWN0Rm9yS2V5KE5TRmlsZVNpemUpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGZpbGVTaXplTnVtYmVyKTtcblx0XHRcdFx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmltYWdlU2l6ZSA9IGZpbGVTaXplTnVtYmVyIC8gMTAwMDtcblx0XHRcdFx0XHRcdFx0XHQvLyAgIGZpbGVfc2l6ZSA9IGZpbGVTaXplTnVtYmVyIC8gMTAwMDtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImZpbGUgc2l6ZSBpbiBieXRlc1wiKTtcblx0XHRcdFx0XHRcdH0qL1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGlmIChfdGhhdC5waWMxID09IG51bGwpIHtcblx0XHRcdFx0XHRcdF90aGF0LnBpYzEgPSBzZWxlY3RlZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRfdGhhdC5fY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0fSk7XG5cdH1cblx0b25SZXF1ZXN0UGVybWlzc2lvbnNUYXAoKSB7XG5cdFx0aWYgKHBsYXRmb3JtTW9kdWxlLmRldmljZS5vcyA9PT0gXCJBbmRyb2lkXCIgJiYgcGxhdGZvcm1Nb2R1bGUuZGV2aWNlLnNka1ZlcnNpb24gPj0gMjMpIHtcblx0XHRcdHBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9uKGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5DQU1FUkEsIFwiSSBuZWVkIHRoZXNlIHBlcm1pc3Npb25zIHRvIHJlYWQgZnJvbSBzdG9yYWdlXCIpXG5cdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiUGVybWlzc2lvbnMgZ3JhbnRlZCFcIik7XG5cdFx0XHRcdFx0dGhpcy5vblRha2VQaWN0dXJlVGFwKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaCgoKSA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlVoIG9oLCBubyBwZXJtaXNzaW9ucyAtIHBsYW4gQiB0aW1lIVwiKTtcblx0XHRcdFx0XHRhbGVydChcIllvdSBkb24ndCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZSBjYW1lcmFcIik7XG5cdFx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9uVGFrZVBpY3R1cmVUYXAoKTtcblx0XHR9XG5cdH1cblx0Ly9jYW1lcmFJbWFnZTogSW1hZ2VBc3NldDtcblx0b25UYWtlUGljdHVyZVRhcCgpIHtcblx0XHRsZXQgX3RoYXQgPSB0aGlzO1xuXHRcdHRha2VQaWN0dXJlKHsgd2lkdGg6IDE4MCwgaGVpZ2h0OiAxODAsIGtlZXBBc3BlY3RSYXRpbzogZmFsc2UsIHNhdmVUb0dhbGxlcnk6IHRydWUgfSlcblx0XHRcdC50aGVuKChpbWFnZUFzc2V0KSA9PiB7XG5cdFx0XHRcdGxldCBzb3VyY2UgPSBuZXcgSW1hZ2VTb3VyY2UoKTtcblx0XHRcdFx0c291cmNlLmZyb21Bc3NldChpbWFnZUFzc2V0KS50aGVuKChzb3VyY2UpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGBTaXplOiAke3NvdXJjZS53aWR0aH14JHtzb3VyY2UuaGVpZ2h0fWApO1xuXHRcdFx0XHRcdF90aGF0LmltZ2R0bHMuaW1hZ2VOYW1lID0gXCJzYW1wbGUuanBnXCI7XG5cdFx0XHRcdFx0X3RoYXQuaW1nZHRscy5iYXNlNjR0ZXh0U3RyaW5nID0gc291cmNlLnRvQmFzZTY0U3RyaW5nKFwianBnXCIsIDEwKTtcblx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmltYWdlU2l6ZSA9IE1hdGgucm91bmQoX3RoYXQuaW1nZHRscy5iYXNlNjR0ZXh0U3RyaW5nLnJlcGxhY2UoL1xcPS9nLCBcIlwiKS5sZW5ndGggKiAwLjc1KSAtIDIwMDtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vXHRfdGhhdC5jYW1lcmFJbWFnZSA9IGltYWdlQXNzZXQ7XG5cdFx0XHRcdGlmIChfdGhhdC5waWMxID09IG51bGwpIHtcblx0XHRcdFx0XHRfdGhhdC5waWMxID0gaW1hZ2VBc3NldDtcblx0XHRcdFx0fVxuXHRcdFx0fSwgKGVycm9yKSA9PiB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGRlbGV0ZUltYWdlKGlkKSB7XG5cdFx0aWYgKGlkID09IFwicGljMVwiKSB7XG5cdFx0XHR0aGlzLnBpYzEgPSBudWxsO1xuXHRcdH1cblx0fVxuXHRkZWxldGVJbWFnZVdpdGhDb25maXJtKGRhdGUsIG9wZXJhdGlvbiwgZGF0YTogYW55KSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdGRpYWxvZ3MuY29uZmlybSh7XG5cdFx0XHRtZXNzYWdlOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgaW1hZ2U/XCIsXG5cdFx0XHRva0J1dHRvblRleHQ6IFwiWWVzXCIsXG5cdFx0XHRjYW5jZWxCdXR0b25UZXh0OiBcIk5vXCIsXG5cdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0XHRpZihyZXN1bHQpXG5cdFx0XHRcdHNlbGYuZGVsT3JVcGxvYWRNZWRJbWFnZShkYXRlLCBvcGVyYXRpb24sIGRhdGEpO1xuXHRcdH0pO1xuXHR9XG5cdGRlbE9yVXBsb2FkTWVkSW1hZ2UoZGF0ZSwgb3BlcmF0aW9uLCBkYXRhOiBhbnkpIHtcblx0XHRsZXQgaXRlbTogYW55ID0ge307IHRoaXMubWVkaW1nZm9ybSA9IHRydWU7XG5cdFx0aWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcblx0XHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRcdHNlbGYud2ViYXBpLmxvYWRlci5zaG93KHNlbGYud2ViYXBpLm9wdGlvbnMpO1xuXHRcdFx0aWYgKG9wZXJhdGlvbiA9PSBcIkFkZFwiKSB7XG5cdFx0XHRcdGl0ZW0uSXRlbUlkID0gMDsgaXRlbS5JbWFnZVRha2VUaW1lID0gdGhpcy5pbWdkYXRlO1xuXHRcdFx0XHRpdGVtLlRoZURvY3VtZW50ID0ge307XG5cdFx0XHRcdGl0ZW0uSW1hZ2VTb3VyY2VTbWFsbFVSTCA9IFwidGVzdFwiOyBpdGVtLkltYWdlU291cmNlTm9ybWFsVVJMID0gXCJ0ZXN0XCI7XG5cdFx0XHRcdGl0ZW0uVGhlRG9jdW1lbnQuRmlsZU5hbWUgPSB0aGlzLmltZ2R0bHMuaW1hZ2VOYW1lOyBpdGVtLlRoZURvY3VtZW50LkRvY3VtZW50VHlwZSA9IFwiTWVkaWNhbEltYWdlXCI7IGl0ZW0uVGhlRG9jdW1lbnQuRmlsZVNpemUgPSB0aGlzLmltZ2R0bHMuaW1hZ2VTaXplO1xuXHRcdFx0XHRpdGVtLlRoZURvY3VtZW50LkZpbGVEYXRhID0gdGhpcy5pbWdkdGxzLmJhc2U2NHRleHRTdHJpbmc7IGl0ZW0uVGhlRG9jdW1lbnQuSXRlbUlkID0gXCIwXCI7XG5cdFx0XHR9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PSBcIkRlbGV0ZVwiKSB7XG5cdFx0XHRcdGl0ZW0uVGhlRG9jdW1lbnQgPSB7fTtcblx0XHRcdFx0aXRlbS5JdGVtSWQgPSBkYXRhLkl0ZW1JZDsgaXRlbS5UaGVEb2N1bWVudCA9IGRhdGEuVGhlRG9jdW1lbnQ7IGl0ZW0uVGhlRG9jdW1lbnQuRmlsZURhdGEgPSBcIlwiO1xuXHRcdFx0XHRpdGVtLkltYWdlVGFrZVRpbWUgPSBcIlwiOyBpdGVtLkltYWdlU291cmNlU21hbGxVUkwgPSBcIlwiOyBpdGVtLkltYWdlU291cmNlTm9ybWFsVVJMID0gXCJcIjtcblx0XHRcdFx0aXRlbS5UaGVEb2N1bWVudC5JdGVtSWQgPSBcIlwiOyBpdGVtLlRoZURvY3VtZW50LkZpbGVOYW1lID0gXCJcIjtcblx0XHRcdFx0aXRlbS5UaGVEb2N1bWVudC5GaWxlU2l6ZSA9IDA7IGl0ZW0uVGhlRG9jdW1lbnQuRmlsZURhdGEgPSBcIlwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCgoZGF0ZSAmJiB0aGlzLmlzVmFsaWREYXRlKCkgJiYgdGhpcy5waWMxICE9IG51bGwpIHx8IChvcGVyYXRpb24gPT0gJ0RlbGV0ZScpKSAmJiB0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG5cdFx0XHRcdGh0dHBfcmVxdWVzdC5yZXF1ZXN0KHtcblx0XHRcdFx0XHR1cmw6IFwiaHR0cHM6Ly93d3cuMjQ3Y2FsbGFkb2MuY29tL1dlYlNlcnZpY2VzL0FQSV9FTVIuYXNteFwiLFxuXHRcdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQveG1sXCIgfSxcblx0XHRcdFx0XHRjb250ZW50OiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J3V0Zi04Jz8+XCIgK1xuXHRcdFx0XHRcdFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLycgPlwiICtcblx0XHRcdFx0XHRcIjxzb2FwZW52OkJvZHk+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpFTVJfTWVkaWNhbEltYWdlX1NhdmUgeG1sbnM9J2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nPlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6S2V5PlwiICsgdGhpcy51c3JkYXRhLktleSArIFwiPC93ZWI6S2V5PlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6R3JvdXBOdW1iZXI+XCIgKyB0aGlzLnVzcmRhdGEuR3JvdXBOdW1iZXIgKyBcIjwvd2ViOkdyb3VwTnVtYmVyPlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6RXh0ZXJuYWxNZW1iZXJJZD5cIiArIHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkICsgXCI8L3dlYjpFeHRlcm5hbE1lbWJlcklkPlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6QWN0aW9uPlwiICsgb3BlcmF0aW9uICsgXCI8L3dlYjpBY3Rpb24+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpDb250ZW50PlwiICsgXCI8d2ViOkl0ZW1JZD5cIiArIGl0ZW0uSXRlbUlkICsgXCI8L3dlYjpJdGVtSWQ+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpJbWFnZVRha2VUaW1lPlwiICsgaXRlbS5JbWFnZVRha2VUaW1lICsgXCI8L3dlYjpJbWFnZVRha2VUaW1lPlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6SW1hZ2VTb3VyY2VTbWFsbFVSTD5cIiArIGl0ZW0uSW1hZ2VTb3VyY2VTbWFsbFVSTCArIFwiPC93ZWI6SW1hZ2VTb3VyY2VTbWFsbFVSTD5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOkltYWdlU291cmNlTm9ybWFsVVJMPlwiICsgaXRlbS5JbWFnZVNvdXJjZU5vcm1hbFVSTCArIFwiPC93ZWI6SW1hZ2VTb3VyY2VOb3JtYWxVUkw+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpUaGVEb2N1bWVudD5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOkRvY3VtZW50VHlwZT5cIiArIGl0ZW0uVGhlRG9jdW1lbnQuRG9jdW1lbnRUeXBlICsgXCI8L3dlYjpEb2N1bWVudFR5cGU+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpJdGVtSWQ+XCIgKyBpdGVtLlRoZURvY3VtZW50Lkl0ZW1JZCArIFwiPC93ZWI6SXRlbUlkPlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6RmlsZU5hbWU+XCIgKyBpdGVtLlRoZURvY3VtZW50LkZpbGVOYW1lICsgXCI8L3dlYjpGaWxlTmFtZT5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOkZpbGVTaXplPlwiICsgaXRlbS5UaGVEb2N1bWVudC5GaWxlU2l6ZSArIFwiPC93ZWI6RmlsZVNpemU+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpGaWxlRGF0YT5cIiArIGl0ZW0uVGhlRG9jdW1lbnQuRmlsZURhdGEgKyBcIjwvd2ViOkZpbGVEYXRhPlwiICtcblx0XHRcdFx0XHRcIjwvd2ViOlRoZURvY3VtZW50Pjwvd2ViOkNvbnRlbnQ+PHdlYjpEZW1vLz48L3dlYjpFTVJfTWVkaWNhbEltYWdlX1NhdmU+PC9zb2FwZW52OkJvZHk+XCIgK1xuXHRcdFx0XHRcdFwiPC9zb2FwZW52OkVudmVsb3BlPlwiXG5cdFx0XHRcdH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKHJlc3BvbnNlLmNvbnRlbnQsIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHJlc3BvbnNlLmNvbnRlbnQpO1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHJlc3AgPSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRU1SX01lZGljYWxJbWFnZV9TYXZlUmVzcG9uc2UuRU1SX01lZGljYWxJbWFnZV9TYXZlUmVzdWx0O1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzcC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIG9wZXJhdGlvbiA9PSBcIkFkZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5tZWRpY2FsSW1hZ0xpc3QoKTtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpTVUNDRVNTOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlwiKTtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmVkaXRNZWRJbWcgPSBmYWxzZTsgc2VsZi5waWMxID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChyZXNwLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIgJiYgb3BlcmF0aW9uID09IFwiRGVsZXRlXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRsZXQgaW5keCA9IHNlbGYubWVkaW1nbGlzdC5pbmRleE9mKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYubWVkaW1nbGlzdC5zcGxpY2UoaW5keCwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5pbWFnZVZpZXdBcnJheS5zcGxpY2UoaW5keCwgMSk7XG5cblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChyZXNwLk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmVkaXRNZWRJbWcgPSBmYWxzZTsgc2VsZi5waWMxID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0XHRhbGVydChcIkltYWdlIGZvcm1hdCBvciBzaXplIGlzIG5vdCBzdXBwb3J0ZWQuIFBsZWFzZSB0cnkgd2l0aCBhbm90aGVyIGltYWdlLlwiKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvYWRlci5oaWRlKCk7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yOi4uLiBcIiArIGUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRWaWV3RmFtaWx5SGlzdG9yeShmSXRlbUlkKSB7XG5cdFx0dGhpcy52aWV3RmFtaWx5ID0gdHJ1ZTtcblx0XHR0aGlzLmZhbWlseUhpc3RvcnlJdGVtID0gW107IHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0gPSB7fTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmFtaWx5SGlzdG9yeS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGZJdGVtSWQgPT0gdGhpcy5mYW1pbHlIaXN0b3J5W2ldLkNvbmRpdGlvbkl0ZW1JZCkge1xuXHRcdFx0XHR0aGlzLmZhbWlseUhpc3RvcnlJdGVtLnB1c2godGhpcy5mYW1pbHlIaXN0b3J5W2ldKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5BbnN3ZXIgPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtWzBdLkFuc3dlcjtcblx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkNvbmRpdGlvbiA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1bMF0uQ29uZGl0aW9uO1xuXHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uQ29uZGl0aW9uSXRlbUlkID0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVswXS5Db25kaXRpb25JdGVtSWQ7XG5cdH1cblxuXHRjbG9zZVZpZXdGYW1pbHlIaXN0b3J5KCkge1xuXHRcdHRoaXMudmlld0ZhbWlseSA9IGZhbHNlO1xuXHR9XG5cblx0ZWRpdEZhbWlseUhpc3RvcnkoZkl0ZW1JZCkge1xuXHRcdHRoaXMuZWRpdEZhbWlseSA9IHRydWU7XG5cdFx0dGhpcy5hZGROZXdNZW1iZXIgPSBmYWxzZTtcblx0XHR0aGlzLmZhbWlseUhpc3RvcnlJdGVtID0gW107IHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0gPSB7fTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmFtaWx5SGlzdG9yeS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGZJdGVtSWQgPT0gdGhpcy5mYW1pbHlIaXN0b3J5W2ldLkNvbmRpdGlvbkl0ZW1JZCkge1xuXHRcdFx0XHR0aGlzLmZhbWlseUhpc3RvcnlJdGVtLnB1c2godGhpcy5mYW1pbHlIaXN0b3J5W2ldKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5BbnN3ZXIgPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtWzBdLkFuc3dlcjtcblx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkNvbmRpdGlvbiA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1bMF0uQ29uZGl0aW9uO1xuXHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uQ29uZGl0aW9uSXRlbUlkID0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVswXS5Db25kaXRpb25JdGVtSWQ7XG5cblx0XHR0aGlzLmZTZWxlY3RlZEluZGV4ID0gbnVsbDtcblx0XHR0aGlzLmdldEZhbWlseUhpc3RvcnlXaG8oKTtcblx0fVxuXG5cdGVkaXRGYW1pbHlIaXN0b3J5SXRlbShpdGVtSWQpIHtcblx0XHR0aGlzLmFkZE5ld01lbWJlciA9IHRydWU7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZhbWlseUhpc3RvcnlJdGVtLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoaXRlbUlkID09IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1baV0uSXRlbUlkKSB7XG5cdFx0XHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uV2hvSXRlbUlkID0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVtpXS5XaG9JdGVtSWQ7XG5cdFx0XHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uV2hhdEFnZSA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1baV0uV2hhdEFnZTtcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5EZXNjcmlwdGlvbiA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1baV0uRGVzY3JpcHRpb247XG5cdFx0XHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uSXRlbUlkID0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVtpXS5JdGVtSWRcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5BbnN3ZXIgPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtW2ldLkFuc3dlcjtcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5Db25kaXRpb24gPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtW2ldLkNvbmRpdGlvbjtcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5Db25kaXRpb25JdGVtSWQgPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtW2ldLkNvbmRpdGlvbkl0ZW1JZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yIChsZXQgbG9vcCA9IDA7IGxvb3AgPCB0aGlzLmZhbWlseUhpc3RvcnlXaG8ubGVuZ3RoOyBsb29wKyspIHtcblx0XHRcdGlmICh0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLldob0l0ZW1JZCA9PSB0aGlzLmZhbWlseUhpc3RvcnlXaG8uZ2V0VmFsdWUobG9vcCkpIHtcblx0XHRcdFx0dGhpcy5mU2VsZWN0ZWRJbmRleCA9IGxvb3A7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y2xvc2VGYW1pbHlIaXN0b3J5KCkge1xuXHRcdHRoaXMuZWRpdEZhbWlseSA9IGZhbHNlO1xuXHRcdHRoaXMuZlNlbGVjdGVkSW5kZXggPSBudWxsO1xuXHRcdHRoaXMuZ2V0RmFtaWx5SGlzdG9yeUxpc3QoKTtcblx0fVxuXG5cdG9uQW5zd2VyQ2hhbmdlKGFucykge1xuXHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uQW5zd2VyID0gYW5zO1xuXHRcdHRoaXMuYWRkTmV3TWVtYmVyID0gZmFsc2U7XG5cdFx0aWYgKGFucyA9PSAnWScpXG5cdFx0XHR0aGlzLmZhbWlseUhpc3RvcnlJdGVtWzBdLkFuc3dlciA9IGFucztcblx0fVxuXG5cdGdldEZhbWlseUhpc3RvcnlMaXN0KCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRzZWxmLndlYmFwaS5nZXRGYW1pbHlIaXN0b3J5X2h0dHAoKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0bGV0IGwgPSBwYXJzZUludChyZXN1bHQuQVBJUmVzdWx0X0VNUkZhbWlseUhpc3RvcnlfR3JpZC5GYW1pbHlIaXN0b3J5Q291bnQpO1xuXHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9FTVJGYW1pbHlIaXN0b3J5X0dyaWQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiBsID4gMCkge1xuXHRcdFx0XHRcdHNlbGYuZmFtaWx5SGlzdG9yeSA9IFtdO1xuXHRcdFx0XHRcdGlmIChsID4gMSkge1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5mYW1pbHlIaXN0b3J5LnB1c2gocmVzdWx0LkFQSVJlc3VsdF9FTVJGYW1pbHlIaXN0b3J5X0dyaWQuRmFtaWx5SGlzdG9yeUxpc3QuRU1SX0ZhbWlseUhpc3RvcnlJdGVtW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5mYW1pbHlIaXN0b3J5LnB1c2gocmVzdWx0LkFQSVJlc3VsdF9FTVJGYW1pbHlIaXN0b3J5X0dyaWQuRmFtaWx5SGlzdG9yeUxpc3QuRU1SX0ZhbWlseUhpc3RvcnlJdGVtKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9yIChsZXQgbCA9IDA7IGwgPCBzZWxmLmZhbWlseUhpc3RvcnkubGVuZ3RoOyBsKyspIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IG0gPSAwOyBtIDwgc2VsZi5mYW1pbHlIaXN0b3J5Q29uZGl0aW9uLmxlbmd0aDsgbSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzZWxmLmZhbWlseUhpc3RvcnlbbF0uQ29uZGl0aW9uSXRlbUlkID09IHNlbGYuZmFtaWx5SGlzdG9yeUNvbmRpdGlvblttXS5JdGVtSWQpIHtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmZhbWlseUhpc3RvcnlDb25kaXRpb25bbV0uQW5zd2VyID0gc2VsZi5mYW1pbHlIaXN0b3J5W2xdLkFuc3dlcjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0X0VNUkZhbWlseUhpc3RvcnlfR3JpZC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIG9yIE5vIGZhbWlseSBIaXN0b3J5XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH0sXG5cdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBGYW1pbHkgSGlzdG9yeS4uLi4gXCIgKyBlcnJvcik7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGdldEZhbWlseUhpc3RvcnlXaG8oKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdGlmIChzZWxmLmZhbWlseUhpc3RvcnlXaG8ubGVuZ3RoID09IDApIHtcblx0XHRcdHNlbGYud2ViYXBpLmdldENvZGVMaXN0KFwiRU1SX0ZhbWlseUhpc3RvcnlXaG9cIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBsb29wID0gMDsgbG9vcCA8IHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuTGlzdC5JdGVtQ291bnQ7IGxvb3ArKykge1xuXHRcdFx0XHRcdFx0XHRzZWxmLmZhbWlseUhpc3RvcnlXaG8uc2V0SXRlbShsb29wLCB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuTGlzdC5MaXN0LkNvZGVMaXN0SXRlbVtsb29wXS5JdGVtSWQsXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogcmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5MaXN0Lkxpc3QuQ29kZUxpc3RJdGVtW2xvb3BdLlZhbHVlLFxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5MaXN0Lkxpc3QuQ29kZUxpc3RJdGVtW2xvb3BdLlZhbHVlID09IHNlbGYuZmFtaWx5SGlzdG9yeUl0ZW0uV2hvKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5mU2VsZWN0ZWRJbmRleCA9IGxvb3A7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yL05vIE1lZGljYXRpb25zXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIE1lZGljYXRpb25zLi4uLiBcIiArIGVycm9yKTtcblx0XHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAobGV0IGxvb3AgPSAwOyBsb29wIDwgc2VsZi5mYW1pbHlIaXN0b3J5V2hvLmxlbmd0aDsgbG9vcCsrKSB7XG5cdFx0XHRcdGlmIChzZWxmLmZhbWlseUhpc3RvcnlJdGVtLldobyA9PSBzZWxmLmZhbWlseUhpc3RvcnlXaG8uZ2V0RGlzcGxheShsb29wKSkge1xuXHRcdFx0XHRcdHNlbGYuZlNlbGVjdGVkSW5kZXggPSBsb29wO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0c2hvd0Zvcm0oKSB7XG5cdFx0dGhpcy5hZGROZXdNZW1iZXIgPSB0cnVlO1xuXHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0gPSB7fTtcblx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkFuc3dlciA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1bMF0uQW5zd2VyO1xuXHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uQ29uZGl0aW9uID0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVswXS5Db25kaXRpb247XG5cdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5Db25kaXRpb25JdGVtSWQgPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtWzBdLkNvbmRpdGlvbkl0ZW1JZDtcblx0XHR0aGlzLmZTZWxlY3RlZEluZGV4ID0gbnVsbDtcblx0fVxuXG5cdGhpZGVGb3JtKCkge1xuXHRcdHRoaXMuYWRkTmV3TWVtYmVyID0gZmFsc2U7XG5cdH1cblxuXHRhZGROZXdGYW1pbHlIaXN0b3J5SXRlbSgpIHtcblx0XHR0aGlzLmFkZEZIRm9ybSA9IHRydWU7XG5cblx0XHRpZiAodGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5JdGVtSWQgIT0gdW5kZWZpbmVkICYmIHBhcnNlSW50KHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uSXRlbUlkKSAhPSAwKSB7XG5cblx0XHRcdHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uQWN0aW9uID0gXCJVcGRhdGVcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5JdGVtSWQgPSAwO1xuXHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5BY3Rpb24gPSBcIkFkZFwiO1xuXHRcdH1cblx0XHRpZiAodGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5EZXNjcmlwdGlvbiA9PSB1bmRlZmluZWQgfHwgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5EZXNjcmlwdGlvbiA9PSBudWxsKSB7XG5cdFx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkRlc2NyaXB0aW9uID0gXCJcIlxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLldobyAhPSB1bmRlZmluZWQgJiYgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaG8gIT0gXCJcIiAmJiB0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLldoYXRBZ2UgIT0gdW5kZWZpbmVkICYmIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uV2hhdEFnZSAhPSBcIlwiKSB7XG5cdFx0XHRodHRwX3JlcXVlc3QucmVxdWVzdCh7XG5cdFx0XHRcdHVybDogXCJodHRwczovL3d3dy4yNDdjYWxsYWRvYy5jb20vV2ViU2VydmljZXMvQVBJX0VNUi5hc214XCIsXG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3htbFwiIH0sXG5cdFx0XHRcdGNvbnRlbnQ6IFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLyc+XCIgK1xuXHRcdFx0XHRcIjxzb2FwZW52OkhlYWRlci8+XCIgK1xuXHRcdFx0XHRcIjxzb2FwZW52OkJvZHk+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RU1SX0ZhbWlseUhpc3RvcnlfU2F2ZSB4bWxucz0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLyc+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6S2V5PlwiICsgdGhpcy51c3JkYXRhLktleSArIFwiPC93ZWI6S2V5PlwiICtcblx0XHRcdFx0XCI8d2ViOkdyb3VwTnVtYmVyPlwiICsgdGhpcy51c3JkYXRhLkdyb3VwTnVtYmVyICsgXCI8L3dlYjpHcm91cE51bWJlcj5cIiArXG5cdFx0XHRcdFwiPHdlYjpFeHRlcm5hbE1lbWJlcklkPlwiICsgdGhpcy51c3JkYXRhLkV4dGVybmFsTWVtYmVySWQgKyBcIjwvd2ViOkV4dGVybmFsTWVtYmVySWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6Q29udGVudD5cIiArXG5cdFx0XHRcdFwiPHdlYjpBbnN3ZXI+XCIgKyB0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkFuc3dlciArIFwiPC93ZWI6QW5zd2VyPlwiICtcblx0XHRcdFx0XCI8d2ViOkl0ZW1JZD5cIiArIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uSXRlbUlkICsgXCI8L3dlYjpJdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6Q29uZGl0aW9uPlwiICsgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5Db25kaXRpb24gKyBcIjwvd2ViOkNvbmRpdGlvbj5cIiArXG5cdFx0XHRcdFwiPHdlYjpDb25kaXRpb25JdGVtSWQ+XCIgKyB0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkNvbmRpdGlvbkl0ZW1JZCArIFwiPC93ZWI6Q29uZGl0aW9uSXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOldobz5cIiArIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uV2hvICsgXCI8L3dlYjpXaG8+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6V2hvSXRlbUlkPlwiICsgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaG9JdGVtSWQgKyBcIjwvd2ViOldob0l0ZW1JZD5cIiArXG5cdFx0XHRcdFwiPHdlYjpXaGF0QWdlPlwiICsgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaGF0QWdlICsgXCI8L3dlYjpXaGF0QWdlPlwiICtcblx0XHRcdFx0XCI8d2ViOkRlc2NyaXB0aW9uPlwiICsgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5EZXNjcmlwdGlvbiArIFwiPC93ZWI6RGVzY3JpcHRpb24+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6QWN0aW9uPlwiICsgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5BY3Rpb24gKyBcIjwvd2ViOkFjdGlvbj5cIiArXG5cdFx0XHRcdFwiPHdlYjpEZW1vPjwvd2ViOkRlbW8+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOkVNUl9GYW1pbHlIaXN0b3J5X1NhdmU+XCIgK1xuXHRcdFx0XHRcIjwvc29hcGVudjpCb2R5PlwiICtcblx0XHRcdFx0XCI8L3NvYXBlbnY6RW52ZWxvcGU+XCJcblx0XHRcdH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKHJlc3BvbnNlLmNvbnRlbnQsIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cblx0XHRcdFx0XHRsZXQgcmVzID0gcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXNwb25zZS5FTVJfRmFtaWx5SGlzdG9yeV9TYXZlUmVzdWx0O1xuXHRcdFx0XHRcdGlmIChyZXMuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0c2VsZi5mYW1pbHlIaXN0b3J5SXRlbSA9IFtdOy8vdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbT17fTtcblx0XHRcdFx0XHRcdGxldCBsID0gcGFyc2VJbnQocmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXNwb25zZS5FTVJfRmFtaWx5SGlzdG9yeV9TYXZlUmVzdWx0LkZhbWlseUhpc3RvcnlDb3VudCk7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2VsZi51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5Db25kaXRpb25JdGVtSWQgPT0gcmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXNwb25zZS5FTVJfRmFtaWx5SGlzdG9yeV9TYXZlUmVzdWx0LkZhbWlseUhpc3RvcnlMaXN0LkVNUl9GYW1pbHlIaXN0b3J5SXRlbVtpXS5Db25kaXRpb25JdGVtSWQpIHtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmZhbWlseUhpc3RvcnlJdGVtLnB1c2gocmVzdWx0Wydzb2FwOkVudmVsb3BlJ11bJ3NvYXA6Qm9keSddLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXNwb25zZS5FTVJfRmFtaWx5SGlzdG9yeV9TYXZlUmVzdWx0LkZhbWlseUhpc3RvcnlMaXN0LkVNUl9GYW1pbHlIaXN0b3J5SXRlbVtpXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNlbGYuYWRkRkhGb3JtID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRzZWxmLmFkZE5ld01lbWJlciA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0c2VsZi5mU2VsZWN0ZWRJbmRleCA9IG51bGw7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXMuTWVzc2FnZSA9PT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgZmFtaWx5IEhpc3RvcnkgaXRlbS4gLyBTZXNzaW9uIGV4cGlyZWQuVHJ5IEFmdGVyIHNvbWUgdGltZSBcIik7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgbWVkaWNhbCBjb25kaXRpb24uXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3I6PyBcIiArIGUuTWVzc2FnZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRkZWxldGVGYW1pbHlIaXN0b3J5SXRlbShpdGVtSWQpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW0ubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChpdGVtSWQgPT0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVtpXS5JdGVtSWQpIHtcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaG8gPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtW2ldLldobztcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaG9JdGVtSWQgPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtW2ldLldob0l0ZW1JZDtcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaGF0QWdlID0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVtpXS5XaGF0QWdlO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkRlc2NyaXB0aW9uID0gdGhpcy5mYW1pbHlIaXN0b3J5SXRlbVtpXS5EZXNjcmlwdGlvbjtcblx0XHRcdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5JdGVtSWQgPSB0aGlzLmZhbWlseUhpc3RvcnlJdGVtW2ldLkl0ZW1JZFxuXHRcdFx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkFuc3dlciA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1baV0uQW5zd2VyO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkNvbmRpdGlvbiA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1baV0uQ29uZGl0aW9uO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkNvbmRpdGlvbkl0ZW1JZCA9IHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1baV0uQ29uZGl0aW9uSXRlbUlkO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaG8gIT0gdW5kZWZpbmVkICYmIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uV2hvICE9IFwiXCIgJiYgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaGF0QWdlICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLldoYXRBZ2UgIT0gXCJcIikge1xuXHRcdFx0aHR0cF9yZXF1ZXN0LnJlcXVlc3Qoe1xuXHRcdFx0XHR1cmw6IFwiaHR0cHM6Ly93d3cuMjQ3Y2FsbGFkb2MuY29tL1dlYlNlcnZpY2VzL0FQSV9FTVIuYXNteFwiLFxuXHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdFx0XHRoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC94bWxcIiB9LFxuXHRcdFx0XHRjb250ZW50OiBcIjxzb2FwZW52OkVudmVsb3BlIHhtbG5zOnNvYXBlbnY9J2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyB4bWxuczp3ZWI9J2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nPlwiICtcblx0XHRcdFx0XCI8c29hcGVudjpIZWFkZXIvPlwiICtcblx0XHRcdFx0XCI8c29hcGVudjpCb2R5PlwiICtcblx0XHRcdFx0XCI8d2ViOkVNUl9GYW1pbHlIaXN0b3J5X1NhdmUgeG1sbnM9J2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nPlwiICtcblx0XHRcdFx0XCI8d2ViOktleT5cIiArIHRoaXMudXNyZGF0YS5LZXkgKyBcIjwvd2ViOktleT5cIiArXG5cdFx0XHRcdFwiPHdlYjpHcm91cE51bWJlcj5cIiArIHRoaXMudXNyZGF0YS5Hcm91cE51bWJlciArIFwiPC93ZWI6R3JvdXBOdW1iZXI+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RXh0ZXJuYWxNZW1iZXJJZD5cIiArIHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkICsgXCI8L3dlYjpFeHRlcm5hbE1lbWJlcklkPlwiICtcblx0XHRcdFx0XCI8d2ViOkNvbnRlbnQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6QW5zd2VyPlwiICsgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5BbnN3ZXIgKyBcIjwvd2ViOkFuc3dlcj5cIiArXG5cdFx0XHRcdFwiPHdlYjpJdGVtSWQ+XCIgKyB0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkl0ZW1JZCArIFwiPC93ZWI6SXRlbUlkPlwiICtcblx0XHRcdFx0XCI8d2ViOkNvbmRpdGlvbj5cIiArIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uQ29uZGl0aW9uICsgXCI8L3dlYjpDb25kaXRpb24+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6Q29uZGl0aW9uSXRlbUlkPlwiICsgdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5Db25kaXRpb25JdGVtSWQgKyBcIjwvd2ViOkNvbmRpdGlvbkl0ZW1JZD5cIiArXG5cdFx0XHRcdFwiPHdlYjpXaG8+XCIgKyB0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLldobyArIFwiPC93ZWI6V2hvPlwiICtcblx0XHRcdFx0XCI8d2ViOldob0l0ZW1JZD5cIiArIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uV2hvSXRlbUlkICsgXCI8L3dlYjpXaG9JdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6V2hhdEFnZT5cIiArIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uV2hhdEFnZSArIFwiPC93ZWI6V2hhdEFnZT5cIiArXG5cdFx0XHRcdFwiPHdlYjpEZXNjcmlwdGlvbj5cIiArIHRoaXMudXBkYXRlRmFtaWx5SGlzdG9yeUl0ZW0uRGVzY3JpcHRpb24gKyBcIjwvd2ViOkRlc2NyaXB0aW9uPlwiICtcblx0XHRcdFx0XCI8L3dlYjpDb250ZW50PlwiICtcblx0XHRcdFx0XCI8d2ViOkFjdGlvbj5EZWxldGU8L3dlYjpBY3Rpb24+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RGVtbz48L3dlYjpEZW1vPlwiICtcblx0XHRcdFx0XCI8L3dlYjpFTVJfRmFtaWx5SGlzdG9yeV9TYXZlPlwiICtcblx0XHRcdFx0XCI8L3NvYXBlbnY6Qm9keT5cIiArXG5cdFx0XHRcdFwiPC9zb2FwZW52OkVudmVsb3BlPlwiXG5cdFx0XHR9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhyZXNwb25zZS5jb250ZW50LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdGxldCByZXMgPSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRU1SX0ZhbWlseUhpc3RvcnlfU2F2ZVJlc3BvbnNlLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKHJlcy5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmZhbWlseUhpc3RvcnlJdGVtID0gW107Ly90aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtPXt9O1xuXHRcdFx0XHRcdFx0bGV0IGwgPSBwYXJzZUludChyZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRU1SX0ZhbWlseUhpc3RvcnlfU2F2ZVJlc3BvbnNlLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXN1bHQuRmFtaWx5SGlzdG9yeUNvdW50KTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzZWxmLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkNvbmRpdGlvbkl0ZW1JZCA9PSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRU1SX0ZhbWlseUhpc3RvcnlfU2F2ZVJlc3BvbnNlLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXN1bHQuRmFtaWx5SGlzdG9yeUxpc3QuRU1SX0ZhbWlseUhpc3RvcnlJdGVtW2ldLkNvbmRpdGlvbkl0ZW1JZCkge1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuZmFtaWx5SGlzdG9yeUl0ZW0ucHVzaChyZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uRU1SX0ZhbWlseUhpc3RvcnlfU2F2ZVJlc3BvbnNlLkVNUl9GYW1pbHlIaXN0b3J5X1NhdmVSZXN1bHQuRmFtaWx5SGlzdG9yeUxpc3QuRU1SX0ZhbWlseUhpc3RvcnlJdGVtW2ldKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c2VsZi5hZGRGSEZvcm0gPSBmYWxzZTtcblx0XHRcdFx0XHRcdHNlbGYuYWRkTmV3TWVtYmVyID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRzZWxmLmZTZWxlY3RlZEluZGV4ID0gbnVsbDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlcy5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBmYW1pbHkgSGlzdG9yeSBpdGVtLiAvIFNlc3Npb24gZXhwaXJlZC5UcnkgQWZ0ZXIgc29tZSB0aW1lIFwiKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSB1cGRhdGluZyBtZWRpY2FsIGNvbmRpdGlvbi5cIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvcjo+Pj4+IFwiICsgZS5NZXNzYWdlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdG9uRmFtaWx5SGlzdG9yeVdob0NoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5mU2VsZWN0ZWRJbmRleCA9IGFyZ3Muc2VsZWN0ZWRJbmRleDtcblx0XHR0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLldobyA9IHRoaXMuZmFtaWx5SGlzdG9yeVdoby5nZXREaXNwbGF5KGFyZ3Muc2VsZWN0ZWRJbmRleCk7XG5cdFx0dGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5XaG9JdGVtSWQgPSB0aGlzLmZhbWlseUhpc3RvcnlXaG8uZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcblx0fVxuXG5cdHVwZGF0ZUZhbWlseUNvbmRpdGlvbigpIHtcblx0Ly9cdGNvbnNvbGUubG9nKHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1bMF0uSXRlbUlkICsgXCIgICsrKyAgXCIgKyB0aGlzLmZhbWlseUhpc3RvcnlJdGVtLmxlbmd0aCk7XG5cdFx0aWYgKHRoaXMuZmFtaWx5SGlzdG9yeUl0ZW1bMF0uSXRlbUlkID09IDAgJiYgIXRoaXMuYWRkTmV3TWVtYmVyKSB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRsZXQgY29uZGl0aW9uSWQgPSB0aGlzLnVwZGF0ZUZhbWlseUhpc3RvcnlJdGVtLkNvbmRpdGlvbkl0ZW1JZDtcblx0XHRcdGxldCB0eXBlID0gdGhpcy51cGRhdGVGYW1pbHlIaXN0b3J5SXRlbS5BbnN3ZXI7XG5cdFx0XHRpZiAodHlwZSA9PSBcIllcIikge1xuXHRcdFx0XHR0eXBlID0gXCJZZXNcIjtcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PSBcIk5cIikge1xuXHRcdFx0XHR0eXBlID0gXCJOb25lXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJVXCIpIHtcblx0XHRcdFx0dHlwZSA9IFwiVW5rbm93blwiO1xuXHRcdFx0fVxuXHRcdFx0c2VsZi53ZWJhcGkuc2V0RmFtaWx5SGlzdG9yeUNvbmRpdGlvbl9odHRwKGNvbmRpdGlvbklkLCB0eXBlKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cdFx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYuY2xvc2VGYW1pbHlIaXN0b3J5KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBVcGRhdGluZyBGYW1pbHkgSGlzdG9yeSBDb25kaXRpb25zXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIFVwZGF0aW5nIEZhbWlseSBIaXN0b3J5IENvbmRpdGlvbi4uLi4gXCIgKyBlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGdvYmFjaygpIHtcblx0XHRpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlTmFtZSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdGlmICh0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG5cdFx0XHRcdC8vdGhpcy5jb25zdWx0YXRpb25GZWVEZXRhaWxzKCk7XG5cdFx0XHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHRoaXMucmVxdWVzdGNvbnN1bHQpIH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2hlYWx0aHJlY29yZHNcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJzLm5hdmlnYXRlKFtcIi9ob21lXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcblx0XHR9XG5cdH1cblxuXHRjb25zdWx0YXRpb25GZWVEZXRhaWxzKCkge1xuXHRcdGxldCBzZWxmID0gdGhpczsgc2VsZi53ZWJhcGkubG9hZGVyLnNob3coc2VsZi53ZWJhcGkub3B0aW9ucyk7XG5cdFx0c2VsZi53ZWJhcGkuY29uc3VsdGF0aW9uRmVlRGV0YWlscyh0aGlzLnJlcXVlc3Rjb25zdWx0LlNlcnZpY2VUeXBlKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0aWYgKHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdEZlZS5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0c2VsZi5yZXF1ZXN0Y29uc3VsdC5Db25zdWx0QXZhaWxhYmxlID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0RmVlLkNvbnN1bHRBdmFpbGFibGU7XG5cdFx0XHRcdFx0c2VsZi5yZXF1ZXN0Y29uc3VsdC5Db25zdWx0RmVlID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0RmVlLkNvbnN1bHRGZWU7XG5cdFx0XHRcdFx0c2VsZi5yZXF1ZXN0Y29uc3VsdC5GZWVEZXNjcmlwdGlvbiA9IHJlc3VsdC5BUElSZXN1bHRfQ29uc3VsdEZlZS5GZWVEZXNjcmlwdGlvbjtcblxuXHRcdFx0XHRcdGlmIChzZWxmLnJlcXVlc3Rjb25zdWx0LkZlZURlc2NyaXB0aW9uICE9IFwiRnJlZVwiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnNob3dpbmdQYXltZW50KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGYuZnJlZUNoZWNrVXAoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkL0FjY2Nlc3MgZGVuaWVkIC5UcnkgYWZ0ZXIgc29tZSB0aW1lIC4uLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIENvbnN1bHRhdGlvbiBmZWVkZXRhaWxzLi4uIFwiICsgZXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHRzaG93aW5nUGF5bWVudCgpIHtcblx0XHRsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcblx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHRoaXMucmVxdWVzdGNvbnN1bHQpIH1cblx0XHR9OyB0aGlzLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LlNlcnZpY2VUeXBlID09IDMgJiYgdGhpcy5yZXF1ZXN0Y29uc3VsdC5Vc2VyUHJlZmVycmVkUGhhcm1hY3kgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3BoYXJtYWN5XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gMykge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlYXJjaHBoYXJtYWN5XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gNCkge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWRpdGNhcmRcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHRcdH1cblx0fVxuXG5cdGZyZWVDaGVja1VwKCkge1xuXHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuXHRcdH07IHRoaXMud2ViYXBpLmxvYWRlci5oaWRlKCk7XG5cblx0XHRpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSA9PSAzICYmIHRoaXMucmVxdWVzdGNvbnN1bHQuVXNlclByZWZlcnJlZFBoYXJtYWN5ICE9IG51bGwpIHtcblx0XHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9waGFybWFjeVwiXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LlNlcnZpY2VUeXBlID09IDMgJiYgdGhpcy5yZXF1ZXN0Y29uc3VsdC5Vc2VyUHJlZmVycmVkUGhhcm1hY3kgPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlYXJjaHBoYXJtYWN5XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gNCkge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlY3VyZWVtYWlsXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9XG5cdH1cblx0c2hvd0ltYWdlSW5QaG90b1ZpZXdlcihpKSB7XG5cdFx0dGhpcy5waG90b1ZpZXdlci5zaG93Vmlld2VyKHRoaXMuaW1hZ2VWaWV3QXJyYXkpO1xuXHR9XG5cbn07Il19