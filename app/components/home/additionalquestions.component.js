"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var requestconsult_model_1 = require("./requestconsult.model");
var ApplicationSettings = require("application-settings");
var imagepicker = require("nativescript-imagepicker");
var nativescript_camera_1 = require("nativescript-camera");
var image_source_1 = require("tns-core-modules/image-source");
var radside_component_1 = require("../radside/radside.component");
var ImageSourceModule = require("image-source");
// ADDITIONAL QUESTIONS
var http_request = require("http");
var xml2js = require('nativescript-xml2js');
var permissions = require("nativescript-permissions");
var platformModule = require("platform");
var AdditionalQuestionsComponent = (function () {
    function AdditionalQuestionsComponent(page, webapi, router, activatedRoutes, _changeDetectionRef) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this._changeDetectionRef = _changeDetectionRef;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.formSubmitted = false;
        this.emergencyRoomChecked = false;
        this.urgentCareChecked = false;
        this.primaryCareChecked = false;
        this.authorize = false;
        this.rDetails = {};
        this.usrdata = {};
        this.imgdtls = {};
        this.pic1 = null;
        this.pic2 = null;
        this.pic3 = null;
        this.saveToGallery = true;
    }
    AdditionalQuestionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (ApplicationSettings.hasKey("USER")) {
            this.userPhoneNumber = JSON.parse(ApplicationSettings.getString("USER")).Phone;
        }
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined)
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
        });
    };
    AdditionalQuestionsComponent.prototype.ngAfterViewInit = function () {
        if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
            var data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
            this.usrdata.GroupNumber = data.GroupNumber;
            this.usrdata.Key = data.Key;
            this.usrdata.ExternalMemberId = data.ExternalMemberId;
        }
    };
    AdditionalQuestionsComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/summary"], navigationExtras);
    };
    AdditionalQuestionsComponent.prototype.showNextPage = function () {
        var _this = this;
        this.formSubmitted = true;
        if (this.formSubmitted && this.userPhoneNumber != undefined && this.userPhoneNumber != "" && (this.emergencyRoomChecked || this.urgentCareChecked || this.primaryCareChecked) && this.authorize) {
            this.rDetails.MedicalRequestDetail = [];
            if (this.requestconsult.ShortTermConditionChecked) {
                var rDetail = {};
                rDetail.ItemId = 1;
                rDetail.ComplainType = "Short Term Medical Condition";
                rDetail.ComplainTypeItemId = 1;
                rDetail.ComplainDescription = this.requestconsult.ShortTermConditionDescription;
                this.rDetails.MedicalRequestDetail.push(rDetail);
            }
            if (this.requestconsult.LongTermConditionChecked) {
                var rDetail = {};
                rDetail.ItemId = 2;
                rDetail.ComplainType = "Long Term Medical Condition";
                rDetail.ComplainTypeItemId = 2;
                rDetail.ComplainDescription = this.requestconsult.LongTermConditionDescription;
                this.rDetails.MedicalRequestDetail.push(rDetail);
            }
            if (this.requestconsult.MedicationRefillChecked) {
                var rDetail = {};
                rDetail.ItemId = 3;
                rDetail.ComplainType = "Medication Refill";
                rDetail.ComplainTypeItemId = 3;
                rDetail.ComplainDescription = this.requestconsult.MedicationRefillDescription1 + " , " + this.requestconsult.MedicationRefillDescription2;
                this.rDetails.MedicalRequestDetail.push(rDetail);
            }
            if (this.requestconsult.OtherHealthIssuesChecked) {
                var rDetail = {};
                rDetail.ItemId = 4;
                rDetail.ComplainType = "Other Health Related Issues";
                rDetail.ComplainTypeItemId = 4;
                rDetail.ComplainDescription = this.requestconsult.OtherHealthIssuesDescription;
                this.rDetails.MedicalRequestDetail.push(rDetail);
            }
            var usrdata = {};
            if (ApplicationSettings.hasKey("USER")) {
                usrdata.ExternalMemberId = JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId;
            }
            if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
                var data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
                usrdata.Key = data.Key;
                usrdata.GroupNumber = data.GroupNumber;
            }
            var medDetail = this.createXMLDocument(this.rDetails.MedicalRequestDetail);
            //console.log("resuklt         " + medDetail);
            if (this.webapi.netConnectivityCheck()) {
                http_request.request({
                    url: "https://www.247calladoc.com/WebServices/API_Schedule.asmx",
                    method: "POST",
                    headers: { "Content-Type": "text/xml" },
                    content: "<?xml version='1.0' encoding='UTF-8'?>" +
                        "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
                        "<soapenv:Body>" +
                        "<web:Consultation_Schedule>" +
                        "<web:Key>" + usrdata.Key + "</web:Key>" +
                        "<web:GroupNumber>" + usrdata.GroupNumber + "</web:GroupNumber>" +
                        "<web:ExternalMemberId>" + usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                        "<web:Demo/>" +
                        "<web:Request>" +
                        "<web:ConsultationType>" + this.requestconsult.ServiceType + "</web:ConsultationType>" +
                        "<web:State>" + this.requestconsult.StateId + "</web:State>" +
                        "<web:MedicalRequestDetailCount>" + this.rDetails.MedicalRequestDetail.length + "</web:MedicalRequestDetailCount>" +
                        "<web:ScheduleTimeNow>" + this.requestconsult.ScheduleTimeNow + "</web:ScheduleTimeNow>" +
                        "<web:ScheduleTimeFuture>" + this.requestconsult.ScheduleTimeFuture + "</web:ScheduleTimeFuture>" +
                        "<web:PharmacyName>" + this.requestconsult.PharmacyName + "</web:PharmacyName>" +
                        "<web:PharmacyId>" + this.requestconsult.PharmacyId + "</web:PharmacyId>" +
                        "<web:SetPreferredPharmacy>" + this.requestconsult.SetPreferredPharmacy + "</web:SetPreferredPharmacy>" + medDetail +
                        /*"<web:MedicalRequestDetails>"+
                        "<web:MedicalRequestDetail>"+
                            "<web:ItemId>1</web:ItemId>"+
                            "<web:ComplainType>Short Term Medical Condition</web:ComplainType>"+
                            "<web:ComplainTypeItemId>1</web:ComplainTypeItemId>"+
                            "<web:ComplainDescription>Fever</web:ComplainDescription>"+
                        "</web:MedicalRequestDetail>"+
                        "</web:MedicalRequestDetails>"+*/
                        "</web:Request>" +
                        "</web:Consultation_Schedule>" +
                        "</soapenv:Body>" +
                        "</soapenv:Envelope>"
                }).then(function (response) {
                    //console.log("-----------------------------------------------------------------");
                    //console.log("response  " + response.content);
                    //console.log("----------------------------------------------------------------");
                    var self = _this;
                    //console.log(response.content);
                    xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                        //console.log(JSON.stringify(result));
                        //console.log(JSON.stringify(result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse));
                        //console.log(JSON.stringify(result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse.Consultation_ScheduleResult.Successful));
                        var res = result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse.Consultation_ScheduleResult.Successful;
                        if (res == "true") {
                            //console.log("success     ");
                            var navigationExtras = {
                                queryParams: { "REQUEST_CONSULT": JSON.stringify(self.requestconsult) }
                            };
                            self.router.navigate(["/confirmation"], navigationExtras);
                        }
                        else if (result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse.Consultation_ScheduleResult.Message == "Please login using MemberLogin screen to get the key before calling any API functions") {
                            self.webapi.logout();
                        }
                        else {
                            alert("Error in Consultation schedule. / Session expired.Try After some time ");
                            //console.log("Session expired or Error in Confirming consultation.");
                        }
                    });
                }, function (e) {
                    console.log("Error: " + e);
                });
            }
        }
    };
    AdditionalQuestionsComponent.prototype.createXMLDocument = function (arr) {
        var xmlDocument = "<web:MedicalRequestDetails>\n";
        for (var i = 0; i < arr.length; i++) {
            var xmlNode = "\t<web:MedicalRequestDetail>\n ";
            xmlNode += "\t<web:ItemId>" + arr[i].ItemId + "</web:ItemId>\n";
            xmlNode += "\t<web:ComplainType>" + arr[i].ComplainType + "</web:ComplainType>\n";
            xmlNode += "\t<web:ComplainTypeItemId>" + arr[i].ComplainTypeItemId + "</web:ComplainTypeItemId>\n";
            xmlNode += "\t<web:ComplainDescription>" + arr[i].ComplainDescription + "</web:ComplainDescription>\n";
            xmlNode += "</web:MedicalRequestDetail>";
            xmlDocument += "\n" + xmlNode;
        }
        return xmlDocument + "\n</web:MedicalRequestDetails>";
    };
    AdditionalQuestionsComponent.prototype.onConcernChange = function (value) {
        if (value == 1) {
            this.emergencyRoomChecked = true;
            this.urgentCareChecked = false;
            this.primaryCareChecked = false;
        }
        else if (value == 2) {
            this.emergencyRoomChecked = false;
            this.urgentCareChecked = true;
            this.primaryCareChecked = false;
        }
        else if (value == 3) {
            this.emergencyRoomChecked = false;
            this.urgentCareChecked = false;
            this.primaryCareChecked = true;
        }
    };
    AdditionalQuestionsComponent.prototype.onAuthorize = function () {
        this.authorize = !this.authorize;
    };
    AdditionalQuestionsComponent.prototype.onSelectMultipleTap = function () {
        var context = imagepicker.create({
            mode: "multiple"
        });
        this.startSelection(context);
    };
    AdditionalQuestionsComponent.prototype.onSelectSingleTap = function () {
        if (this.pic1 == null || this.pic2 == null || this.pic3 == null) {
            var context = imagepicker.create({
                mode: "single"
            });
            this.startSelection(context);
        }
        else {
            alert("User can upload only 3 images");
        }
    };
    AdditionalQuestionsComponent.prototype.startSelection = function (context) {
        var _that = this;
        context
            .authorize()
            .then(function () {
            return context.present();
        })
            .then(function (selection) {
            //console.log("Selection done:");
            selection.forEach(function (selected) {
                selected.getImage().then(function (res) {
                    _that.imgdtls = {};
                    //console.log("----------------");
                    //console.log("uri: " + selected.uri);
                    //console.log("fileUri: " + selected.fileUri);
                    var imgres = selected.fileUri.split("/");
                    var imageName = imgres[imgres.length - 1];
                    _that.imgdtls.imageName = imageName;
                    if (imageName.indexOf('.jpg') > -1 || imageName.indexOf('.png') > -1 || imageName.indexOf('.jpeg') > -1) {
                        //console.log("JPG OR JPEG OR PNG IMAGE SELECTED  " + imageName);
                        _that.imgdtls.base64textString = res.toBase64String(imageName.split(".")[1], 10);
                        _that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
                        //console.log(_that.imgdtls.imageSize);
                        _that.saveConsultationDocs(_that.imgdtls, "Add");
                    }
                    else {
                        //console.log("DOCUMENT NAME " + imageName);
                        _that.imgdtls.base64textString = res.toBase64String(imageName.split(".")[1], 10);
                        _that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
                        //console.log(_that.imgdtls.imageSize);
                        _that.saveConsultationDocs(_that.imgdtls, "Add");
                    }
                });
                if (_that.pic1 == null) {
                    _that.pic1 = selected;
                }
                else if (_that.pic1 != null && _that.pic2 == null) {
                    _that.pic2 = selected;
                }
                else if (_that.pic2 != null && _that.pic3 == null) {
                    _that.pic3 = selected;
                }
            });
            _that._changeDetectionRef.detectChanges();
        }).catch(function (e) {
            //console.log(e);
        });
    };
    AdditionalQuestionsComponent.prototype.deleteImage = function (id) {
        if (id == "pic1") {
            this.pic1 = null;
        }
        else if (id == "pic2") {
            this.pic2 = null;
        }
        else if (id == "pic3") {
            this.pic3 = null;
        }
    };
    AdditionalQuestionsComponent.prototype.onTakePictureTap = function () {
        var _that = this;
        this.imgdtls = {};
        nativescript_camera_1.takePicture({ width: 180, height: 180, keepAspectRatio: false, saveToGallery: this.saveToGallery })
            .then(function (imageAsset) {
            var source = new image_source_1.ImageSource();
            source.fromAsset(imageAsset).then(function (source) {
                //console.log(`Size: ${source.width}x${source.height}`);
                _that.imgdtls.imageName = "sample.jpg";
                _that.imgdtls.base64textString = source.toBase64String("jpg", 10);
                _that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
                _that.saveConsultationDocs(_that.imgdtls, "Add");
            });
            _that.cameraImage = imageAsset;
            if (_that.pic1 == null) {
                _that.pic1 = imageAsset;
            }
            else if (_that.pic1 != null && _that.pic2 == null) {
                _that.pic2 = imageAsset;
            }
            else if (_that.pic2 != null && _that.pic3 == null) {
                _that.pic3 = imageAsset;
            }
            //console.log("pic1 " + _that.pic1);
            //console.log("pic1 " + _that.pic2);
            //console.log("pic1 " + _that.pic3);
        }, function (error) {
            console.log("Error: " + error);
        });
    };
    AdditionalQuestionsComponent.prototype.onRequestPermissionsTap = function () {
        var _this = this;
        if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
            //console.log("hello 1");
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
    AdditionalQuestionsComponent.prototype.saveConsultationDocs = function (item, operation) {
        if (this.webapi.netConnectivityCheck()) {
            var self_1 = this;
            self_1.webapi.loader.show(self_1.webapi.options);
            if (operation == 'Add') {
                item.PersonServiceRequestId = this.requestconsult.ServiceType;
                item.Action = "Add";
                item.ItemId = 0;
                item.docItemId = 0;
                item.DocumentType = "Consultation Image";
                item.FileName = item.imageName;
                item.FileSize = item.imageSize;
                item.FileData = item.base64textString;
                //console.log(item.FileSize + " <<>> " + item.FileName + " <<>> " + item.PersonServiceRequestId);
            }
            http_request.request({
                url: "https://www.247calladoc.com/WebServices/API_Schedule.asmx",
                method: "POST",
                headers: { "Content-Type": "text/xml" },
                content: "<?xml version= '1.0' encoding='utf-8' ?>" +
                    "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'> " +
                    "<soapenv:Body>" +
                    "<web:ConsultationDocument_Save>" +
                    "<web:Key>" + this.usrdata.Key + "</web:Key>" +
                    "<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
                    "<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
                    "<web:PersonServiceRequestId>" + item.PersonServiceRequestId + "</web:PersonServiceRequestId>" +
                    "<web:Action>" + item.Action + "</web:Action>" +
                    "<web:Content><web:ItemId>" + item.ItemId + "</web:ItemId>" +
                    "<web:TheDocument>" +
                    "<web:DocumentType>" + item.DocumentType + "</web:DocumentType>" +
                    "<web:ItemId>" + item.docItemId + "</web:ItemId>" +
                    "<web:FileName>" + item.FileName + "</web:FileName>" +
                    "<web:FileSize>" + item.FileSize + "</web:FileSize>" +
                    "<web:FileData>" + item.FileData + "</web:FileData>" +
                    "</web:TheDocument></web:Content><web:Demo/>" +
                    "</web:ConsultationDocument_Save></soapenv:Body></soapenv:Envelope>"
            }).then(function (response) {
                xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                    //console.log("Convertionnnn ");
                    //console.log(result['soap:Envelope']['soap:Body']);
                    //console.log(response.content);
                    if (result) {
                        var resp = result['soap:Envelope']['soap:Body'].ConsultationDocument_SaveResponse.ConsultationDocument_SaveResult;
                    }
                    self_1.webapi.loader.hide();
                });
            }, function (e) {
                self_1.webapi.loader.hide();
                //console.log("Error in Consultation doc upload : ... " + e);
            });
        }
    };
    return AdditionalQuestionsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], AdditionalQuestionsComponent.prototype, "radSideComponent", void 0);
AdditionalQuestionsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./additionalquestions.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute, core_1.ChangeDetectorRef])
], AdditionalQuestionsComponent);
exports.AdditionalQuestionsComponent = AdditionalQuestionsComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkaXRpb25hbHF1ZXN0aW9ucy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZGRpdGlvbmFscXVlc3Rpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFnRjtBQUNoRiwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLDBFQUF5RTtBQUN6RSx5RUFBc0U7QUFDdEUsK0RBQTZEO0FBQzdELDBEQUE0RDtBQUM1RCxzREFBd0Q7QUFDeEQsMkRBQXNFO0FBQ3RFLDhEQUE0RDtBQUU1RCxrRUFBZ0U7QUFDaEUsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDaEQsdUJBQXVCO0FBQ3ZCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM1QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RCxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFPekMsSUFBYSw0QkFBNEI7SUFXeEMsc0NBQW9CLElBQVUsRUFBVSxNQUFxQixFQUFVLE1BQWMsRUFBVSxlQUErQixFQUFVLG1CQUFzQztRQUExSixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW1CO1FBVjlLLG1CQUFjLEdBQUcsSUFBSSwwQ0FBbUIsRUFBRSxDQUFDO1FBRTNDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLHlCQUFvQixHQUFZLEtBQUssQ0FBQztRQUN0QyxzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFDbkMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FB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QUFDO0FBQUQsQ0FBQyxBQTlWRCxJQThWQztBQXBWNkI7SUFBNUIsZ0JBQVMsQ0FBQyxvQ0FBZ0IsQ0FBQzs4QkFBbUIsb0NBQWdCO3NFQUFDO0FBVnBELDRCQUE0QjtJQUx4QyxnQkFBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSxzQ0FBc0M7UUFDbkQsU0FBUyxFQUFFLENBQUMsK0JBQWEsRUFBRSw2QkFBYSxFQUFFLG9DQUFnQixDQUFDO0tBQzNELENBQUM7cUNBWXlCLFdBQUksRUFBa0IsK0JBQWEsRUFBa0IsZUFBTSxFQUEyQix1QkFBYyxFQUErQix3QkFBaUI7R0FYbEssNEJBQTRCLENBOFZ4QztBQTlWWSxvRUFBNEI7QUE4VnhDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IFJlcXVlc3RDb25zdWx0TW9kZWwgfSBmcm9tIFwiLi9yZXF1ZXN0Y29uc3VsdC5tb2RlbFwiO1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIGltYWdlcGlja2VyIGZyb20gXCJuYXRpdmVzY3JpcHQtaW1hZ2VwaWNrZXJcIjtcbmltcG9ydCB7IHRha2VQaWN0dXJlLCByZXF1ZXN0UGVybWlzc2lvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtY2FtZXJhJztcbmltcG9ydCB7IEltYWdlU291cmNlIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9pbWFnZS1zb3VyY2UnO1xuaW1wb3J0IHsgSW1hZ2VBc3NldCB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvaW1hZ2UtYXNzZXQnO1xuaW1wb3J0IHsgUmFkU2lkZUNvbXBvbmVudCB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUuY29tcG9uZW50XCI7XG5sZXQgSW1hZ2VTb3VyY2VNb2R1bGUgPSByZXF1aXJlKFwiaW1hZ2Utc291cmNlXCIpO1xuLy8gQURESVRJT05BTCBRVUVTVElPTlNcbmxldCBodHRwX3JlcXVlc3QgPSByZXF1aXJlKFwiaHR0cFwiKTtcbmxldCB4bWwyanMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQteG1sMmpzJyk7XG5sZXQgcGVybWlzc2lvbnMgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXBlcm1pc3Npb25zXCIpO1xubGV0IHBsYXRmb3JtTW9kdWxlID0gcmVxdWlyZShcInBsYXRmb3JtXCIpO1xuZGVjbGFyZSBsZXQgYW5kcm9pZDogYW55O1xuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vYWRkaXRpb25hbHF1ZXN0aW9ucy5jb21wb25lbnQuaHRtbFwiLFxuXHRwcm92aWRlcnM6IFtXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBSYWRTaWRlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBBZGRpdGlvbmFsUXVlc3Rpb25zQ29tcG9uZW50IHtcblx0cmVxdWVzdGNvbnN1bHQgPSBuZXcgUmVxdWVzdENvbnN1bHRNb2RlbCgpO1xuXHR1c2VyUGhvbmVOdW1iZXI6IHN0cmluZztcblx0Zm9ybVN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRlbWVyZ2VuY3lSb29tQ2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHR1cmdlbnRDYXJlQ2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcmltYXJ5Q2FyZUNoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblx0YXV0aG9yaXplOiBib29sZWFuID0gZmFsc2U7XG5cdHJEZXRhaWxzOiBhbnkgPSB7fTsgdXNyZGF0YTogYW55ID0ge307IGltZ2R0bHM6IGFueSA9IHt9O1xuXHRwaWMxOiBhbnkgPSBudWxsOyBwaWMyOiBhbnkgPSBudWxsOyBwaWMzOiBhbnkgPSBudWxsO1xuXHRAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVzOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XG5cdG5nT25Jbml0KCkge1xuXHRcdGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJcIikpIHtcblx0XHRcdHRoaXMudXNlclBob25lTnVtYmVyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpLlBob25lO1xuXHRcdH1cblx0XHR0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcblx0XHR0aGlzLnJhZFNpZGVDb21wb25lbnQucmNDbGFzcyA9IHRydWU7XG5cdFx0dGhpcy5hY3RpdmF0ZWRSb3V0ZXMucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdICE9IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy5yZXF1ZXN0Y29uc3VsdCA9IEpTT04ucGFyc2UocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdKTtcblx0XHR9KTtcblx0fVxuXHRuZ0FmdGVyVmlld0luaXQoKSB7XG5cdFx0aWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUl9ERUZBVUxUU1wiKSkge1xuXHRcdFx0bGV0IGRhdGEgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUl9ERUZBVUxUU1wiKSk7XG5cdFx0XHR0aGlzLnVzcmRhdGEuR3JvdXBOdW1iZXIgPSBkYXRhLkdyb3VwTnVtYmVyO1xuXHRcdFx0dGhpcy51c3JkYXRhLktleSA9IGRhdGEuS2V5O1xuXHRcdFx0dGhpcy51c3JkYXRhLkV4dGVybmFsTWVtYmVySWQgPSBkYXRhLkV4dGVybmFsTWVtYmVySWQ7XG5cdFx0fVxuXHR9XG5cdGdvYmFjaygpIHtcblx0XHRsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcblx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHRoaXMucmVxdWVzdGNvbnN1bHQpIH1cblx0XHR9O1xuXHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9zdW1tYXJ5XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0fVxuXHRzaG93TmV4dFBhZ2UoKSB7XG5cdFx0dGhpcy5mb3JtU3VibWl0dGVkID0gdHJ1ZTtcblx0XHRpZiAodGhpcy5mb3JtU3VibWl0dGVkICYmIHRoaXMudXNlclBob25lTnVtYmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJQaG9uZU51bWJlciAhPSBcIlwiICYmICh0aGlzLmVtZXJnZW5jeVJvb21DaGVja2VkIHx8IHRoaXMudXJnZW50Q2FyZUNoZWNrZWQgfHwgdGhpcy5wcmltYXJ5Q2FyZUNoZWNrZWQpICYmIHRoaXMuYXV0aG9yaXplKSB7XG5cdFx0XHR0aGlzLnJEZXRhaWxzLk1lZGljYWxSZXF1ZXN0RGV0YWlsID0gW107XG5cdFx0XHRpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TaG9ydFRlcm1Db25kaXRpb25DaGVja2VkKSB7XG5cdFx0XHRcdGxldCByRGV0YWlsOiBhbnkgPSB7fTtcblx0XHRcdFx0ckRldGFpbC5JdGVtSWQgPSAxO1xuXHRcdFx0XHRyRGV0YWlsLkNvbXBsYWluVHlwZSA9IFwiU2hvcnQgVGVybSBNZWRpY2FsIENvbmRpdGlvblwiO1xuXHRcdFx0XHRyRGV0YWlsLkNvbXBsYWluVHlwZUl0ZW1JZCA9IDE7XG5cdFx0XHRcdHJEZXRhaWwuQ29tcGxhaW5EZXNjcmlwdGlvbiA9IHRoaXMucmVxdWVzdGNvbnN1bHQuU2hvcnRUZXJtQ29uZGl0aW9uRGVzY3JpcHRpb247XG5cdFx0XHRcdHRoaXMuckRldGFpbHMuTWVkaWNhbFJlcXVlc3REZXRhaWwucHVzaChyRGV0YWlsKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LkxvbmdUZXJtQ29uZGl0aW9uQ2hlY2tlZCkge1xuXHRcdFx0XHRsZXQgckRldGFpbDogYW55ID0ge307XG5cdFx0XHRcdHJEZXRhaWwuSXRlbUlkID0gMjtcblx0XHRcdFx0ckRldGFpbC5Db21wbGFpblR5cGUgPSBcIkxvbmcgVGVybSBNZWRpY2FsIENvbmRpdGlvblwiO1xuXHRcdFx0XHRyRGV0YWlsLkNvbXBsYWluVHlwZUl0ZW1JZCA9IDI7XG5cdFx0XHRcdHJEZXRhaWwuQ29tcGxhaW5EZXNjcmlwdGlvbiA9IHRoaXMucmVxdWVzdGNvbnN1bHQuTG9uZ1Rlcm1Db25kaXRpb25EZXNjcmlwdGlvbjtcblx0XHRcdFx0dGhpcy5yRGV0YWlscy5NZWRpY2FsUmVxdWVzdERldGFpbC5wdXNoKHJEZXRhaWwpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuTWVkaWNhdGlvblJlZmlsbENoZWNrZWQpIHtcblx0XHRcdFx0bGV0IHJEZXRhaWw6IGFueSA9IHt9O1xuXHRcdFx0XHRyRGV0YWlsLkl0ZW1JZCA9IDM7XG5cdFx0XHRcdHJEZXRhaWwuQ29tcGxhaW5UeXBlID0gXCJNZWRpY2F0aW9uIFJlZmlsbFwiO1xuXHRcdFx0XHRyRGV0YWlsLkNvbXBsYWluVHlwZUl0ZW1JZCA9IDM7XG5cdFx0XHRcdHJEZXRhaWwuQ29tcGxhaW5EZXNjcmlwdGlvbiA9IHRoaXMucmVxdWVzdGNvbnN1bHQuTWVkaWNhdGlvblJlZmlsbERlc2NyaXB0aW9uMSArIFwiICwgXCIgKyB0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYXRpb25SZWZpbGxEZXNjcmlwdGlvbjI7XG5cdFx0XHRcdHRoaXMuckRldGFpbHMuTWVkaWNhbFJlcXVlc3REZXRhaWwucHVzaChyRGV0YWlsKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0Lk90aGVySGVhbHRoSXNzdWVzQ2hlY2tlZCkge1xuXHRcdFx0XHRsZXQgckRldGFpbDogYW55ID0ge307XG5cdFx0XHRcdHJEZXRhaWwuSXRlbUlkID0gNDtcblx0XHRcdFx0ckRldGFpbC5Db21wbGFpblR5cGUgPSBcIk90aGVyIEhlYWx0aCBSZWxhdGVkIElzc3Vlc1wiO1xuXHRcdFx0XHRyRGV0YWlsLkNvbXBsYWluVHlwZUl0ZW1JZCA9IDQ7XG5cdFx0XHRcdHJEZXRhaWwuQ29tcGxhaW5EZXNjcmlwdGlvbiA9IHRoaXMucmVxdWVzdGNvbnN1bHQuT3RoZXJIZWFsdGhJc3N1ZXNEZXNjcmlwdGlvbjtcblx0XHRcdFx0dGhpcy5yRGV0YWlscy5NZWRpY2FsUmVxdWVzdERldGFpbC5wdXNoKHJEZXRhaWwpO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHVzcmRhdGE6IGFueSA9IHt9O1xuXHRcdFx0aWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuXHRcdFx0XHR1c3JkYXRhLkV4dGVybmFsTWVtYmVySWQgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSkuRXh0ZXJuYWxNZW1iZXJJZDtcblx0XHRcdH1cblx0XHRcdGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJfREVGQVVMVFNcIikpIHtcblx0XHRcdFx0bGV0IGRhdGEgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUl9ERUZBVUxUU1wiKSk7XG5cdFx0XHRcdHVzcmRhdGEuS2V5ID0gZGF0YS5LZXk7XG5cdFx0XHRcdHVzcmRhdGEuR3JvdXBOdW1iZXIgPSBkYXRhLkdyb3VwTnVtYmVyO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG1lZERldGFpbDogc3RyaW5nID0gdGhpcy5jcmVhdGVYTUxEb2N1bWVudCh0aGlzLnJEZXRhaWxzLk1lZGljYWxSZXF1ZXN0RGV0YWlsKTtcblx0XHRcdC8vY29uc29sZS5sb2coXCJyZXN1a2x0ICAgICAgICAgXCIgKyBtZWREZXRhaWwpO1xuXG5cdFx0XHRpZiAodGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuXHRcdFx0XHRodHRwX3JlcXVlc3QucmVxdWVzdCh7XG5cdFx0XHRcdFx0dXJsOiBcImh0dHBzOi8vd3d3LjI0N2NhbGxhZG9jLmNvbS9XZWJTZXJ2aWNlcy9BUElfU2NoZWR1bGUuYXNteFwiLFxuXHRcdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQveG1sXCIgfSxcblx0XHRcdFx0XHRjb250ZW50OiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04Jz8+XCIgK1xuXHRcdFx0XHRcdFwiPHNvYXBlbnY6RW52ZWxvcGUgeG1sbnM6c29hcGVudj0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nIHhtbG5zOndlYj0naHR0cHM6Ly93d3cuMjQ3Q2FsbEFEb2MuY29tL1dlYlNlcnZpY2VzLycgPlwiICtcblx0XHRcdFx0XHRcIjxzb2FwZW52OkJvZHk+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpDb25zdWx0YXRpb25fU2NoZWR1bGU+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpLZXk+XCIgKyB1c3JkYXRhLktleSArIFwiPC93ZWI6S2V5PlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6R3JvdXBOdW1iZXI+XCIgKyB1c3JkYXRhLkdyb3VwTnVtYmVyICsgXCI8L3dlYjpHcm91cE51bWJlcj5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOkV4dGVybmFsTWVtYmVySWQ+XCIgKyB1c3JkYXRhLkV4dGVybmFsTWVtYmVySWQgKyBcIjwvd2ViOkV4dGVybmFsTWVtYmVySWQ+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpEZW1vLz5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOlJlcXVlc3Q+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpDb25zdWx0YXRpb25UeXBlPlwiICsgdGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSArIFwiPC93ZWI6Q29uc3VsdGF0aW9uVHlwZT5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOlN0YXRlPlwiICsgdGhpcy5yZXF1ZXN0Y29uc3VsdC5TdGF0ZUlkICsgXCI8L3dlYjpTdGF0ZT5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOk1lZGljYWxSZXF1ZXN0RGV0YWlsQ291bnQ+XCIgKyB0aGlzLnJEZXRhaWxzLk1lZGljYWxSZXF1ZXN0RGV0YWlsLmxlbmd0aCArIFwiPC93ZWI6TWVkaWNhbFJlcXVlc3REZXRhaWxDb3VudD5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOlNjaGVkdWxlVGltZU5vdz5cIiArIHRoaXMucmVxdWVzdGNvbnN1bHQuU2NoZWR1bGVUaW1lTm93ICsgXCI8L3dlYjpTY2hlZHVsZVRpbWVOb3c+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpTY2hlZHVsZVRpbWVGdXR1cmU+XCIgKyB0aGlzLnJlcXVlc3Rjb25zdWx0LlNjaGVkdWxlVGltZUZ1dHVyZSArIFwiPC93ZWI6U2NoZWR1bGVUaW1lRnV0dXJlPlwiICtcblx0XHRcdFx0XHRcIjx3ZWI6UGhhcm1hY3lOYW1lPlwiICsgdGhpcy5yZXF1ZXN0Y29uc3VsdC5QaGFybWFjeU5hbWUgKyBcIjwvd2ViOlBoYXJtYWN5TmFtZT5cIiArXG5cdFx0XHRcdFx0XCI8d2ViOlBoYXJtYWN5SWQ+XCIgKyB0aGlzLnJlcXVlc3Rjb25zdWx0LlBoYXJtYWN5SWQgKyBcIjwvd2ViOlBoYXJtYWN5SWQ+XCIgK1xuXHRcdFx0XHRcdFwiPHdlYjpTZXRQcmVmZXJyZWRQaGFybWFjeT5cIiArIHRoaXMucmVxdWVzdGNvbnN1bHQuU2V0UHJlZmVycmVkUGhhcm1hY3kgKyBcIjwvd2ViOlNldFByZWZlcnJlZFBoYXJtYWN5PlwiICsgbWVkRGV0YWlsICtcblx0XHRcdFx0XHQvKlwiPHdlYjpNZWRpY2FsUmVxdWVzdERldGFpbHM+XCIrXG5cdFx0XHRcdFx0XCI8d2ViOk1lZGljYWxSZXF1ZXN0RGV0YWlsPlwiK1xuXHRcdFx0XHRcdFx0XCI8d2ViOkl0ZW1JZD4xPC93ZWI6SXRlbUlkPlwiK1xuXHRcdFx0XHRcdFx0XCI8d2ViOkNvbXBsYWluVHlwZT5TaG9ydCBUZXJtIE1lZGljYWwgQ29uZGl0aW9uPC93ZWI6Q29tcGxhaW5UeXBlPlwiK1xuXHRcdFx0XHRcdFx0XCI8d2ViOkNvbXBsYWluVHlwZUl0ZW1JZD4xPC93ZWI6Q29tcGxhaW5UeXBlSXRlbUlkPlwiK1xuXHRcdFx0XHRcdFx0XCI8d2ViOkNvbXBsYWluRGVzY3JpcHRpb24+RmV2ZXI8L3dlYjpDb21wbGFpbkRlc2NyaXB0aW9uPlwiK1xuXHRcdFx0XHRcdFwiPC93ZWI6TWVkaWNhbFJlcXVlc3REZXRhaWw+XCIrXG5cdFx0XHRcdFx0XCI8L3dlYjpNZWRpY2FsUmVxdWVzdERldGFpbHM+XCIrKi9cblx0XHRcdFx0XHRcIjwvd2ViOlJlcXVlc3Q+XCIgK1xuXHRcdFx0XHRcdFwiPC93ZWI6Q29uc3VsdGF0aW9uX1NjaGVkdWxlPlwiICtcblx0XHRcdFx0XHRcIjwvc29hcGVudjpCb2R5PlwiICtcblx0XHRcdFx0XHRcIjwvc29hcGVudjpFbnZlbG9wZT5cIlxuXHRcdFx0XHR9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwicmVzcG9uc2UgIFwiICsgcmVzcG9uc2UuY29udGVudCk7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cdFx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2cocmVzcG9uc2UuY29udGVudCk7XG5cdFx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKHJlc3BvbnNlLmNvbnRlbnQsIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Db25zdWx0YXRpb25fU2NoZWR1bGVSZXNwb25zZSkpO1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uQ29uc3VsdGF0aW9uX1NjaGVkdWxlUmVzcG9uc2UuQ29uc3VsdGF0aW9uX1NjaGVkdWxlUmVzdWx0LlN1Y2Nlc3NmdWwpKTtcblx0XHRcdFx0XHRcdGxldCByZXMgPSByZXN1bHRbJ3NvYXA6RW52ZWxvcGUnXVsnc29hcDpCb2R5J10uQ29uc3VsdGF0aW9uX1NjaGVkdWxlUmVzcG9uc2UuQ29uc3VsdGF0aW9uX1NjaGVkdWxlUmVzdWx0LlN1Y2Nlc3NmdWw7XG5cdFx0XHRcdFx0XHRpZiAocmVzID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJzdWNjZXNzICAgICBcIik7XG5cdFx0XHRcdFx0XHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHNlbGYucmVxdWVzdGNvbnN1bHQpIH1cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0c2VsZi5yb3V0ZXIubmF2aWdhdGUoW1wiL2NvbmZpcm1hdGlvblwiXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Db25zdWx0YXRpb25fU2NoZWR1bGVSZXNwb25zZS5Db25zdWx0YXRpb25fU2NoZWR1bGVSZXN1bHQuTWVzc2FnZSA9PSBcIlBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IHRoZSBrZXkgYmVmb3JlIGNhbGxpbmcgYW55IEFQSSBmdW5jdGlvbnNcIikge1xuXHRcdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGFsZXJ0KFwiRXJyb3IgaW4gQ29uc3VsdGF0aW9uIHNjaGVkdWxlLiAvIFNlc3Npb24gZXhwaXJlZC5UcnkgQWZ0ZXIgc29tZSB0aW1lIFwiKTtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlNlc3Npb24gZXhwaXJlZCBvciBFcnJvciBpbiBDb25maXJtaW5nIGNvbnN1bHRhdGlvbi5cIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y3JlYXRlWE1MRG9jdW1lbnQoYXJyKTogc3RyaW5nIHtcblx0XHRsZXQgeG1sRG9jdW1lbnQgPSBcIjx3ZWI6TWVkaWNhbFJlcXVlc3REZXRhaWxzPlxcblwiO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCB4bWxOb2RlID0gXCJcXHQ8d2ViOk1lZGljYWxSZXF1ZXN0RGV0YWlsPlxcbiBcIjtcblx0XHRcdHhtbE5vZGUgKz0gXCJcXHQ8d2ViOkl0ZW1JZD5cIiArIGFycltpXS5JdGVtSWQgKyBcIjwvd2ViOkl0ZW1JZD5cXG5cIjtcblx0XHRcdHhtbE5vZGUgKz0gXCJcXHQ8d2ViOkNvbXBsYWluVHlwZT5cIiArIGFycltpXS5Db21wbGFpblR5cGUgKyBcIjwvd2ViOkNvbXBsYWluVHlwZT5cXG5cIjtcblx0XHRcdHhtbE5vZGUgKz0gXCJcXHQ8d2ViOkNvbXBsYWluVHlwZUl0ZW1JZD5cIiArIGFycltpXS5Db21wbGFpblR5cGVJdGVtSWQgKyBcIjwvd2ViOkNvbXBsYWluVHlwZUl0ZW1JZD5cXG5cIjtcblx0XHRcdHhtbE5vZGUgKz0gXCJcXHQ8d2ViOkNvbXBsYWluRGVzY3JpcHRpb24+XCIgKyBhcnJbaV0uQ29tcGxhaW5EZXNjcmlwdGlvbiArIFwiPC93ZWI6Q29tcGxhaW5EZXNjcmlwdGlvbj5cXG5cIjtcblx0XHRcdHhtbE5vZGUgKz0gXCI8L3dlYjpNZWRpY2FsUmVxdWVzdERldGFpbD5cIjtcblx0XHRcdHhtbERvY3VtZW50ICs9IFwiXFxuXCIgKyB4bWxOb2RlO1xuXHRcdH1cblx0XHRyZXR1cm4geG1sRG9jdW1lbnQgKyBcIlxcbjwvd2ViOk1lZGljYWxSZXF1ZXN0RGV0YWlscz5cIjtcblx0fVxuXHRvbkNvbmNlcm5DaGFuZ2UodmFsdWU6IG51bWJlcikge1xuXHRcdGlmICh2YWx1ZSA9PSAxKSB7XG5cdFx0XHR0aGlzLmVtZXJnZW5jeVJvb21DaGVja2VkID0gdHJ1ZTtcblx0XHRcdHRoaXMudXJnZW50Q2FyZUNoZWNrZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMucHJpbWFyeUNhcmVDaGVja2VkID0gZmFsc2U7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PSAyKSB7XG5cdFx0XHR0aGlzLmVtZXJnZW5jeVJvb21DaGVja2VkID0gZmFsc2U7XG5cdFx0XHR0aGlzLnVyZ2VudENhcmVDaGVja2VkID0gdHJ1ZTtcblx0XHRcdHRoaXMucHJpbWFyeUNhcmVDaGVja2VkID0gZmFsc2U7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PSAzKSB7XG5cdFx0XHR0aGlzLmVtZXJnZW5jeVJvb21DaGVja2VkID0gZmFsc2U7XG5cdFx0XHR0aGlzLnVyZ2VudENhcmVDaGVja2VkID0gZmFsc2U7XG5cdFx0XHR0aGlzLnByaW1hcnlDYXJlQ2hlY2tlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdG9uQXV0aG9yaXplKCkge1xuXHRcdHRoaXMuYXV0aG9yaXplID0gIXRoaXMuYXV0aG9yaXplO1xuXHR9XG5cdG9uU2VsZWN0TXVsdGlwbGVUYXAoKSB7XG5cdFx0bGV0IGNvbnRleHQgPSBpbWFnZXBpY2tlci5jcmVhdGUoe1xuXHRcdFx0bW9kZTogXCJtdWx0aXBsZVwiXG5cdFx0fSk7XG5cdFx0dGhpcy5zdGFydFNlbGVjdGlvbihjb250ZXh0KTtcblx0fVxuXHRvblNlbGVjdFNpbmdsZVRhcCgpIHtcblx0XHRpZiAodGhpcy5waWMxID09IG51bGwgfHwgdGhpcy5waWMyID09IG51bGwgfHwgdGhpcy5waWMzID09IG51bGwpIHtcblx0XHRcdGxldCBjb250ZXh0ID0gaW1hZ2VwaWNrZXIuY3JlYXRlKHtcblx0XHRcdFx0bW9kZTogXCJzaW5nbGVcIlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnN0YXJ0U2VsZWN0aW9uKGNvbnRleHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhbGVydChcIlVzZXIgY2FuIHVwbG9hZCBvbmx5IDMgaW1hZ2VzXCIpO1xuXHRcdH1cblx0fVxuXHRzdGFydFNlbGVjdGlvbihjb250ZXh0KSB7XG5cdFx0bGV0IF90aGF0ID0gdGhpcztcblx0XHRjb250ZXh0XG5cdFx0XHQuYXV0aG9yaXplKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQucHJlc2VudCgpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKChzZWxlY3Rpb24pID0+IHtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlNlbGVjdGlvbiBkb25lOlwiKTtcblx0XHRcdFx0c2VsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWQuZ2V0SW1hZ2UoKS50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzID0ge307XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLVwiKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJ1cmk6IFwiICsgc2VsZWN0ZWQudXJpKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJmaWxlVXJpOiBcIiArIHNlbGVjdGVkLmZpbGVVcmkpO1xuXHRcdFx0XHRcdFx0bGV0IGltZ3JlcyA9IHNlbGVjdGVkLmZpbGVVcmkuc3BsaXQoXCIvXCIpO1xuXHRcdFx0XHRcdFx0bGV0IGltYWdlTmFtZSA9IGltZ3Jlc1tpbWdyZXMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmltYWdlTmFtZSA9IGltYWdlTmFtZTtcblx0XHRcdFx0XHRcdGlmIChpbWFnZU5hbWUuaW5kZXhPZignLmpwZycpID4gLTEgfHwgaW1hZ2VOYW1lLmluZGV4T2YoJy5wbmcnKSA+IC0xIHx8IGltYWdlTmFtZS5pbmRleE9mKCcuanBlZycpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkpQRyBPUiBKUEVHIE9SIFBORyBJTUFHRSBTRUxFQ1RFRCAgXCIgKyBpbWFnZU5hbWUpO1xuXHRcdFx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmJhc2U2NHRleHRTdHJpbmcgPSByZXMudG9CYXNlNjRTdHJpbmcoaW1hZ2VOYW1lLnNwbGl0KFwiLlwiKVsxXSwgMTApO1xuXHRcdFx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmltYWdlU2l6ZSA9IE1hdGgucm91bmQoX3RoYXQuaW1nZHRscy5iYXNlNjR0ZXh0U3RyaW5nLnJlcGxhY2UoL1xcPS9nLCBcIlwiKS5sZW5ndGggKiAwLjc1KSAtIDIwMDtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhfdGhhdC5pbWdkdGxzLmltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0XHRcdF90aGF0LnNhdmVDb25zdWx0YXRpb25Eb2NzKF90aGF0LmltZ2R0bHMsIFwiQWRkXCIpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkRPQ1VNRU5UIE5BTUUgXCIgKyBpbWFnZU5hbWUpO1xuXHRcdFx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmJhc2U2NHRleHRTdHJpbmcgPSByZXMudG9CYXNlNjRTdHJpbmcoaW1hZ2VOYW1lLnNwbGl0KFwiLlwiKVsxXSwgMTApO1xuXHRcdFx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmltYWdlU2l6ZSA9IE1hdGgucm91bmQoX3RoYXQuaW1nZHRscy5iYXNlNjR0ZXh0U3RyaW5nLnJlcGxhY2UoL1xcPS9nLCBcIlwiKS5sZW5ndGggKiAwLjc1KSAtIDIwMDtcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhfdGhhdC5pbWdkdGxzLmltYWdlU2l6ZSk7XG5cdFx0XHRcdFx0XHRcdF90aGF0LnNhdmVDb25zdWx0YXRpb25Eb2NzKF90aGF0LmltZ2R0bHMsIFwiQWRkXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGlmIChfdGhhdC5waWMxID09IG51bGwpIHtcblx0XHRcdFx0XHRcdF90aGF0LnBpYzEgPSBzZWxlY3RlZDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKF90aGF0LnBpYzEgIT0gbnVsbCAmJiBfdGhhdC5waWMyID09IG51bGwpIHtcblx0XHRcdFx0XHRcdF90aGF0LnBpYzIgPSBzZWxlY3RlZDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKF90aGF0LnBpYzIgIT0gbnVsbCAmJiBfdGhhdC5waWMzID09IG51bGwpIHtcblx0XHRcdFx0XHRcdF90aGF0LnBpYzMgPSBzZWxlY3RlZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRfdGhhdC5fY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coZSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdGRlbGV0ZUltYWdlKGlkKSB7XG5cdFx0aWYgKGlkID09IFwicGljMVwiKSB7XG5cdFx0XHR0aGlzLnBpYzEgPSBudWxsO1xuXHRcdH0gZWxzZSBpZiAoaWQgPT0gXCJwaWMyXCIpIHtcblx0XHRcdHRoaXMucGljMiA9IG51bGw7XG5cdFx0fSBlbHNlIGlmIChpZCA9PSBcInBpYzNcIikge1xuXHRcdFx0dGhpcy5waWMzID0gbnVsbDtcblx0XHR9XG5cdH1cblxuXHRzYXZlVG9HYWxsZXJ5OiBib29sZWFuID0gdHJ1ZTtcblx0Y2FtZXJhSW1hZ2U6IEltYWdlQXNzZXQ7XG5cdG9uVGFrZVBpY3R1cmVUYXAoKSB7XG5cdFx0bGV0IF90aGF0ID0gdGhpczsgdGhpcy5pbWdkdGxzID0ge307XG5cdFx0dGFrZVBpY3R1cmUoeyB3aWR0aDogMTgwLCBoZWlnaHQ6IDE4MCwga2VlcEFzcGVjdFJhdGlvOiBmYWxzZSwgc2F2ZVRvR2FsbGVyeTogdGhpcy5zYXZlVG9HYWxsZXJ5IH0pXG5cdFx0XHQudGhlbigoaW1hZ2VBc3NldCkgPT4ge1xuXHRcdFx0XHRsZXQgc291cmNlID0gbmV3IEltYWdlU291cmNlKCk7XG5cdFx0XHRcdHNvdXJjZS5mcm9tQXNzZXQoaW1hZ2VBc3NldCkudGhlbigoc291cmNlKSA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgU2l6ZTogJHtzb3VyY2Uud2lkdGh9eCR7c291cmNlLmhlaWdodH1gKTtcblx0XHRcdFx0XHRfdGhhdC5pbWdkdGxzLmltYWdlTmFtZSA9IFwic2FtcGxlLmpwZ1wiO1xuXHRcdFx0XHRcdF90aGF0LmltZ2R0bHMuYmFzZTY0dGV4dFN0cmluZyA9IHNvdXJjZS50b0Jhc2U2NFN0cmluZyhcImpwZ1wiLCAxMCk7XG5cdFx0XHRcdFx0X3RoYXQuaW1nZHRscy5pbWFnZVNpemUgPSBNYXRoLnJvdW5kKF90aGF0LmltZ2R0bHMuYmFzZTY0dGV4dFN0cmluZy5yZXBsYWNlKC9cXD0vZywgXCJcIikubGVuZ3RoICogMC43NSkgLSAyMDA7XG5cdFx0XHRcdFx0X3RoYXQuc2F2ZUNvbnN1bHRhdGlvbkRvY3MoX3RoYXQuaW1nZHRscywgXCJBZGRcIik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdF90aGF0LmNhbWVyYUltYWdlID0gaW1hZ2VBc3NldDtcblx0XHRcdFx0aWYgKF90aGF0LnBpYzEgPT0gbnVsbCkge1xuXHRcdFx0XHRcdF90aGF0LnBpYzEgPSBpbWFnZUFzc2V0O1xuXHRcdFx0XHR9IGVsc2UgaWYgKF90aGF0LnBpYzEgIT0gbnVsbCAmJiBfdGhhdC5waWMyID09IG51bGwpIHtcblx0XHRcdFx0XHRfdGhhdC5waWMyID0gaW1hZ2VBc3NldDtcblx0XHRcdFx0fSBlbHNlIGlmIChfdGhhdC5waWMyICE9IG51bGwgJiYgX3RoYXQucGljMyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0X3RoYXQucGljMyA9IGltYWdlQXNzZXQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcInBpYzEgXCIgKyBfdGhhdC5waWMxKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcInBpYzEgXCIgKyBfdGhhdC5waWMyKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcInBpYzEgXCIgKyBfdGhhdC5waWMzKTtcblx0XHRcdH0sIChlcnJvcikgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGVycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cdG9uUmVxdWVzdFBlcm1pc3Npb25zVGFwKCkge1xuXHRcdGlmIChwbGF0Zm9ybU1vZHVsZS5kZXZpY2Uub3MgPT09IFwiQW5kcm9pZFwiICYmIHBsYXRmb3JtTW9kdWxlLmRldmljZS5zZGtWZXJzaW9uID49IDIzKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiaGVsbG8gMVwiKTtcblx0XHRcdHBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9uKGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5DQU1FUkEsIFwiSSBuZWVkIHRoZXNlIHBlcm1pc3Npb25zIHRvIHJlYWQgZnJvbSBzdG9yYWdlXCIpXG5cdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiUGVybWlzc2lvbnMgZ3JhbnRlZCFcIik7XG5cdFx0XHRcdFx0dGhpcy5vblRha2VQaWN0dXJlVGFwKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaCgoKSA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlVoIG9oLCBubyBwZXJtaXNzaW9ucyAtIHBsYW4gQiB0aW1lIVwiKTtcblx0XHRcdFx0XHRhbGVydChcIllvdSBkb24ndCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZSBjYW1lcmFcIik7XG5cdFx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9uVGFrZVBpY3R1cmVUYXAoKTtcblx0XHR9XG5cdH1cblx0c2F2ZUNvbnN1bHRhdGlvbkRvY3MoaXRlbTogYW55LCBvcGVyYXRpb24pIHtcblx0XHRpZiAodGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLnNob3coc2VsZi53ZWJhcGkub3B0aW9ucyk7XG5cdFx0XHRpZiAob3BlcmF0aW9uID09ICdBZGQnKSB7XG5cdFx0XHRcdGl0ZW0uUGVyc29uU2VydmljZVJlcXVlc3RJZCA9IHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGU7XG5cdFx0XHRcdGl0ZW0uQWN0aW9uID0gXCJBZGRcIjsgaXRlbS5JdGVtSWQgPSAwOyBpdGVtLmRvY0l0ZW1JZCA9IDA7XG5cdFx0XHRcdGl0ZW0uRG9jdW1lbnRUeXBlID0gXCJDb25zdWx0YXRpb24gSW1hZ2VcIjsgaXRlbS5GaWxlTmFtZSA9IGl0ZW0uaW1hZ2VOYW1lO1xuXHRcdFx0XHRpdGVtLkZpbGVTaXplID0gaXRlbS5pbWFnZVNpemU7XG5cdFx0XHRcdGl0ZW0uRmlsZURhdGEgPSBpdGVtLmJhc2U2NHRleHRTdHJpbmc7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coaXRlbS5GaWxlU2l6ZSArIFwiIDw8Pj4gXCIgKyBpdGVtLkZpbGVOYW1lICsgXCIgPDw+PiBcIiArIGl0ZW0uUGVyc29uU2VydmljZVJlcXVlc3RJZCk7XG5cdFx0XHR9XG5cdFx0XHRodHRwX3JlcXVlc3QucmVxdWVzdCh7XG5cdFx0XHRcdHVybDogXCJodHRwczovL3d3dy4yNDdjYWxsYWRvYy5jb20vV2ViU2VydmljZXMvQVBJX1NjaGVkdWxlLmFzbXhcIixcblx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQveG1sXCIgfSxcblx0XHRcdFx0Y29udGVudDogXCI8P3htbCB2ZXJzaW9uPSAnMS4wJyBlbmNvZGluZz0ndXRmLTgnID8+XCIgK1xuXHRcdFx0XHRcIjxzb2FwZW52OkVudmVsb3BlIHhtbG5zOnNvYXBlbnY9J2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyB4bWxuczp3ZWI9J2h0dHBzOi8vd3d3LjI0N0NhbGxBRG9jLmNvbS9XZWJTZXJ2aWNlcy8nPiBcIiArXG5cdFx0XHRcdFwiPHNvYXBlbnY6Qm9keT5cIiArXG5cdFx0XHRcdFwiPHdlYjpDb25zdWx0YXRpb25Eb2N1bWVudF9TYXZlPlwiICtcblx0XHRcdFx0XCI8d2ViOktleT5cIiArIHRoaXMudXNyZGF0YS5LZXkgKyBcIjwvd2ViOktleT5cIiArXG5cdFx0XHRcdFwiPHdlYjpHcm91cE51bWJlcj5cIiArIHRoaXMudXNyZGF0YS5Hcm91cE51bWJlciArIFwiPC93ZWI6R3JvdXBOdW1iZXI+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RXh0ZXJuYWxNZW1iZXJJZD5cIiArIHRoaXMudXNyZGF0YS5FeHRlcm5hbE1lbWJlcklkICsgXCI8L3dlYjpFeHRlcm5hbE1lbWJlcklkPlwiICtcblx0XHRcdFx0XCI8d2ViOlBlcnNvblNlcnZpY2VSZXF1ZXN0SWQ+XCIgKyBpdGVtLlBlcnNvblNlcnZpY2VSZXF1ZXN0SWQgKyBcIjwvd2ViOlBlcnNvblNlcnZpY2VSZXF1ZXN0SWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6QWN0aW9uPlwiICsgaXRlbS5BY3Rpb24gKyBcIjwvd2ViOkFjdGlvbj5cIiArXG5cdFx0XHRcdFwiPHdlYjpDb250ZW50Pjx3ZWI6SXRlbUlkPlwiICsgaXRlbS5JdGVtSWQgKyBcIjwvd2ViOkl0ZW1JZD5cIiArXG5cdFx0XHRcdFwiPHdlYjpUaGVEb2N1bWVudD5cIiArXG5cdFx0XHRcdFwiPHdlYjpEb2N1bWVudFR5cGU+XCIgKyBpdGVtLkRvY3VtZW50VHlwZSArIFwiPC93ZWI6RG9jdW1lbnRUeXBlPlwiICtcblx0XHRcdFx0XCI8d2ViOkl0ZW1JZD5cIiArIGl0ZW0uZG9jSXRlbUlkICsgXCI8L3dlYjpJdGVtSWQ+XCIgK1xuXHRcdFx0XHRcIjx3ZWI6RmlsZU5hbWU+XCIgKyBpdGVtLkZpbGVOYW1lICsgXCI8L3dlYjpGaWxlTmFtZT5cIiArXG5cdFx0XHRcdFwiPHdlYjpGaWxlU2l6ZT5cIiArIGl0ZW0uRmlsZVNpemUgKyBcIjwvd2ViOkZpbGVTaXplPlwiICtcblx0XHRcdFx0XCI8d2ViOkZpbGVEYXRhPlwiICsgaXRlbS5GaWxlRGF0YSArIFwiPC93ZWI6RmlsZURhdGE+XCIgK1xuXHRcdFx0XHRcIjwvd2ViOlRoZURvY3VtZW50Pjwvd2ViOkNvbnRlbnQ+PHdlYjpEZW1vLz5cIiArXG5cdFx0XHRcdFwiPC93ZWI6Q29uc3VsdGF0aW9uRG9jdW1lbnRfU2F2ZT48L3NvYXBlbnY6Qm9keT48L3NvYXBlbnY6RW52ZWxvcGU+XCJcblx0XHRcdH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhyZXNwb25zZS5jb250ZW50LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJDb252ZXJ0aW9ubm5uIFwiKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXSk7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhyZXNwb25zZS5jb250ZW50KTtcblx0XHRcdFx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRsZXQgcmVzcCA9IHJlc3VsdFsnc29hcDpFbnZlbG9wZSddWydzb2FwOkJvZHknXS5Db25zdWx0YXRpb25Eb2N1bWVudF9TYXZlUmVzcG9uc2UuQ29uc3VsdGF0aW9uRG9jdW1lbnRfU2F2ZVJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3IgaW4gQ29uc3VsdGF0aW9uIGRvYyB1cGxvYWQgOiAuLi4gXCIgKyBlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTsiXX0=