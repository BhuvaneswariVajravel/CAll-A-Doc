"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var requestconsult_model_1 = require("./requestconsult.model");
var radside_component_1 = require("../radside/radside.component");
var xml2js = require('nativescript-xml2js');
// HEALTH RECORDS
var HealthRecordsComponent = (function () {
    function HealthRecordsComponent(page, webapi, router, activatedRoutes) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.isUptoDate = true;
        this.isPreferredPharmacyAvailable = false;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
    }
    HealthRecordsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                _this.isUptoDate = _this.requestconsult.MedicalRecordsUptoDate;
            }
        });
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.getEMRComplete_http().subscribe(function (data) {
                var self = _this;
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_EMRComplete.Successful == "true") {
                        self.lastUpdate = result.APIResult_EMRComplete.LastUpdate;
                    }
                    else if (result.APIResult_EMRComplete.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        //console.log("LOGOUT DUE SESSION TIME OUT --->" + result.APIResult_EMRComplete.Message);
                        self.webapi.logout();
                    }
                });
            }, function (error) {
                //console.log("Error in getting the service type.. " + error);
            });
            this.webapi.getMembersPreferredPharmacy_http().subscribe(function (data) {
                var self = _this;
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PreferredPharmacy.Successful == "true" && result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId != "0") {
                        //console.log("PN     " + result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId);
                        self.requestconsult.UserPreferredPharmacy = result.APIResult_PreferredPharmacy.PreferredPharmacy;
                    }
                    else {
                        //console.log("Error in getting preferred pharmacy ");
                    }
                });
            }, function (error) {
                // console.log("Error in getting preferred pharmacy.. " + error);
            });
        }
    };
    HealthRecordsComponent.prototype.checkMedicalRecordStatus = function () {
        this.isUptoDate = !this.isUptoDate;
    };
    HealthRecordsComponent.prototype.showNextPage = function () {
        if (this.webapi.netConnectivityCheck()) {
            this.consultationFeeDetails();
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
                    //console.log(self.requestconsult.FeeDescription + " " + self.requestconsult.ConsultFee + " " + self.requestconsult.ConsultAvailable);
                    if (self.requestconsult.FeeDescription != "Free") {
                        self.showingPayment();
                    }
                    else {
                        self.freeCheckUp();
                    }
                }
                else {
                    self.webapi.loader.hide();
                    //  console.log("Session expired/Acccess denied .Try after some time ...");
                }
            });
        }, function (error) {
            self.webapi.loader.hide();
            // console.log("Error in Consultation feedetails... " + error);
        });
    };
    HealthRecordsComponent.prototype.showingPayment = function () {
        this.requestconsult.MedicalRecordsUptoDate = this.isUptoDate;
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.webapi.loader.hide();
        if (this.requestconsult.ServiceType == 3 && this.isUptoDate && this.requestconsult.UserPreferredPharmacy != null) {
            this.router.navigate(["/pharmacy"], navigationExtras);
        }
        else if (!this.isUptoDate) {
            this.router.navigate(["/userhealthrecords"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 3) {
            this.router.navigate(["/searchpharmacy"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 4) {
            this.router.navigate(["/creditcard"], navigationExtras);
        }
    };
    HealthRecordsComponent.prototype.freeCheckUp = function () {
        this.requestconsult.MedicalRecordsUptoDate = this.isUptoDate;
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.webapi.loader.hide();
        if (this.requestconsult.ServiceType == 3 && this.isUptoDate && this.requestconsult.UserPreferredPharmacy != null) {
            this.router.navigate(["/pharmacy"], navigationExtras);
        }
        else if (!this.isUptoDate) {
            this.router.navigate(["/userhealthrecords"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 3 && this.requestconsult.UserPreferredPharmacy == null) {
            this.router.navigate(["/searchpharmacy"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 4) {
            this.router.navigate(["/secureemail"], navigationExtras);
        }
    };
    HealthRecordsComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        if (this.requestconsult.ServiceType == 3) {
            this.router.navigate(["/scheduletype"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 4) {
            this.router.navigate(["/memberdetails"], navigationExtras);
        }
    };
    HealthRecordsComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return HealthRecordsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], HealthRecordsComponent.prototype, "radSideComponent", void 0);
HealthRecordsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./healthrecords.component.html",
        providers: [configuration_1.Configuration, web_api_service_1.WebAPIService, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute])
], HealthRecordsComponent);
exports.HealthRecordsComponent = HealthRecordsComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRocmVjb3Jkcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoZWFsdGhyZWNvcmRzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLDBFQUF5RTtBQUN6RSx5RUFBc0U7QUFDdEUsK0RBQTZEO0FBQzdELGtFQUFnRTtBQUVoRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUU1QyxpQkFBaUI7QUFNakIsSUFBYSxzQkFBc0I7SUFNakMsZ0NBQW9CLElBQVUsRUFBVSxNQUFxQixFQUFVLE1BQWMsRUFBVSxlQUErQjtRQUExRyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFMdkgsZUFBVSxHQUFZLElBQUksQ0FBQztRQUVsQyxpQ0FBNEIsR0FBWSxLQUFLLENBQUM7UUFDOUMsbUJBQWMsR0FBRyxJQUFJLDBDQUFtQixFQUFFLENBQUM7SUFFdUYsQ0FBQztJQUNuSSx5Q0FBUSxHQUFSO1FBQUEsaUJBdUNDO1FBdENDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNyQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLEtBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxLQUFJLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUM7WUFDL0QsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSTtnQkFDOUMsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEVBQUUsVUFBVSxHQUFHLEVBQUUsTUFBTTtvQkFDNUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUM7b0JBQzVELENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLElBQUksK0ZBQStGLENBQUMsQ0FBQyxDQUFDO3dCQUNuSix5RkFBeUY7d0JBQ3pGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ3ZCLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQ0MsVUFBQSxLQUFLO2dCQUNILDhEQUE4RDtZQUNoRSxDQUFDLENBQUMsQ0FBQztZQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsZ0NBQWdDLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUMzRCxJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxNQUFNO29CQUM1RSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsVUFBVSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsMkJBQTJCLENBQUMsaUJBQWlCLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3RJLDJGQUEyRjt3QkFDM0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsMkJBQTJCLENBQUMsaUJBQWlCLENBQUM7b0JBQ25HLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sc0RBQXNEO29CQUN4RCxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUNDLFVBQUEsS0FBSztnQkFDSixpRUFBaUU7WUFDbEUsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0gsQ0FBQztJQUNELHlEQUF3QixHQUF4QjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3JDLENBQUM7SUFDRCw2Q0FBWSxHQUFaO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0lBQ0gsQ0FBQztJQUNELHVEQUFzQixHQUF0QjtRQUNFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO1lBQ2hGLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxNQUFNO2dCQUM1RSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3JELElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDO29CQUNwRixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDO29CQUN4RSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDO29CQUNoRixzSUFBc0k7b0JBQ3RJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2pELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDeEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3JCLENBQUM7Z0JBQ0gsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDNUIsMkVBQTJFO2dCQUMzRSxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLEVBQ0MsVUFBQSxLQUFLO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0IsK0RBQStEO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUNELCtDQUFjLEdBQWQ7UUFDRSxJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDN0QsSUFBSSxnQkFBZ0IsR0FBcUI7WUFDdkMsV0FBVyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7U0FDeEUsQ0FBQztRQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqSCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDSCxDQUFDO0lBQ0QsNENBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM3RCxJQUFJLGdCQUFnQixHQUFxQjtZQUN2QyxXQUFXLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtTQUN4RSxDQUFDO1FBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pILElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDakUsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDM0QsQ0FBQztJQUNILENBQUM7SUFDRCx1Q0FBTSxHQUFOO1FBQ0UsSUFBSSxnQkFBZ0IsR0FBcUI7WUFDdkMsV0FBVyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7U0FDeEUsQ0FBQztRQUNGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxDQUFDO0lBRUgsQ0FBQztJQUNELDRDQUFXLEdBQVgsVUFBWSxNQUFNO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFDSCw2QkFBQztBQUFELENBQUMsQUE3SEQsSUE2SEM7QUF4SDhCO0lBQTVCLGdCQUFTLENBQUMsb0NBQWdCLENBQUM7OEJBQW1CLG9DQUFnQjtnRUFBQztBQUxyRCxzQkFBc0I7SUFMbEMsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsZ0NBQWdDO1FBQzdDLFNBQVMsRUFBRSxDQUFDLDZCQUFhLEVBQUUsK0JBQWEsRUFBRSxvQ0FBZ0IsQ0FBQztLQUM1RCxDQUFDO3FDQU8wQixXQUFJLEVBQWtCLCtCQUFhLEVBQWtCLGVBQU0sRUFBMkIsdUJBQWM7R0FObkgsc0JBQXNCLENBNkhsQztBQTdIWSx3REFBc0I7QUE2SGxDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUsIE5hdmlnYXRpb25FeHRyYXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgUmVxdWVzdENvbnN1bHRNb2RlbCB9IGZyb20gXCIuL3JlcXVlc3Rjb25zdWx0Lm1vZGVsXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcblxubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcblxuLy8gSEVBTFRIIFJFQ09SRFNcbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICB0ZW1wbGF0ZVVybDogXCIuL2hlYWx0aHJlY29yZHMuY29tcG9uZW50Lmh0bWxcIixcbiAgcHJvdmlkZXJzOiBbQ29uZmlndXJhdGlvbiwgV2ViQVBJU2VydmljZSwgUmFkU2lkZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgSGVhbHRoUmVjb3Jkc0NvbXBvbmVudCB7XG4gIHB1YmxpYyBpc1VwdG9EYXRlOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIGxhc3RVcGRhdGU6IHN0cmluZztcbiAgaXNQcmVmZXJyZWRQaGFybWFjeUF2YWlsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICByZXF1ZXN0Y29uc3VsdCA9IG5ldyBSZXF1ZXN0Q29uc3VsdE1vZGVsKCk7XG4gIEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXM6IEFjdGl2YXRlZFJvdXRlKSB7IH1cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG4gICAgdGhpcy5yYWRTaWRlQ29tcG9uZW50LnJjQ2xhc3MgPSB0cnVlO1xuICAgIHRoaXMuYWN0aXZhdGVkUm91dGVzLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgaWYgKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0Y29uc3VsdCA9IEpTT04ucGFyc2UocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdKTtcbiAgICAgICAgdGhpcy5pc1VwdG9EYXRlID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5NZWRpY2FsUmVjb3Jkc1VwdG9EYXRlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICB0aGlzLndlYmFwaS5nZXRFTVJDb21wbGV0ZV9odHRwKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0VNUkNvbXBsZXRlLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIHNlbGYubGFzdFVwZGF0ZSA9IHJlc3VsdC5BUElSZXN1bHRfRU1SQ29tcGxldGUuTGFzdFVwZGF0ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfRU1SQ29tcGxldGUuTWVzc2FnZSA9PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiTE9HT1VUIERVRSBTRVNTSU9OIFRJTUUgT1VUIC0tLT5cIiArIHJlc3VsdC5BUElSZXN1bHRfRU1SQ29tcGxldGUuTWVzc2FnZSk7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBnZXR0aW5nIHRoZSBzZXJ2aWNlIHR5cGUuLiBcIiArIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB0aGlzLndlYmFwaS5nZXRNZW1iZXJzUHJlZmVycmVkUGhhcm1hY3lfaHR0cCgpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9QcmVmZXJyZWRQaGFybWFjeS5TdWNjZXNzZnVsID09IFwidHJ1ZVwiICYmIHJlc3VsdC5BUElSZXN1bHRfUHJlZmVycmVkUGhhcm1hY3kuUHJlZmVycmVkUGhhcm1hY3kuUGhhcm1hY3lJZCAhPSBcIjBcIikge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlBOICAgICBcIiArIHJlc3VsdC5BUElSZXN1bHRfUHJlZmVycmVkUGhhcm1hY3kuUHJlZmVycmVkUGhhcm1hY3kuUGhhcm1hY3lJZCk7XG4gICAgICAgICAgICBzZWxmLnJlcXVlc3Rjb25zdWx0LlVzZXJQcmVmZXJyZWRQaGFybWFjeSA9IHJlc3VsdC5BUElSZXN1bHRfUHJlZmVycmVkUGhhcm1hY3kuUHJlZmVycmVkUGhhcm1hY3k7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBnZXR0aW5nIHByZWZlcnJlZCBwaGFybWFjeSBcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZ2V0dGluZyBwcmVmZXJyZWQgcGhhcm1hY3kuLiBcIiArIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGNoZWNrTWVkaWNhbFJlY29yZFN0YXR1cygpIHtcbiAgICB0aGlzLmlzVXB0b0RhdGUgPSAhdGhpcy5pc1VwdG9EYXRlO1xuICB9XG4gIHNob3dOZXh0UGFnZSgpIHtcbiAgICBpZiAodGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgdGhpcy5jb25zdWx0YXRpb25GZWVEZXRhaWxzKCk7XG4gICAgfVxuICB9XG4gIGNvbnN1bHRhdGlvbkZlZURldGFpbHMoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzOyBzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcbiAgICBzZWxmLndlYmFwaS5jb25zdWx0YXRpb25GZWVEZXRhaWxzKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0RmVlLlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICBzZWxmLnJlcXVlc3Rjb25zdWx0LkNvbnN1bHRBdmFpbGFibGUgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRGZWUuQ29uc3VsdEF2YWlsYWJsZTtcbiAgICAgICAgICBzZWxmLnJlcXVlc3Rjb25zdWx0LkNvbnN1bHRGZWUgPSByZXN1bHQuQVBJUmVzdWx0X0NvbnN1bHRGZWUuQ29uc3VsdEZlZTtcbiAgICAgICAgICBzZWxmLnJlcXVlc3Rjb25zdWx0LkZlZURlc2NyaXB0aW9uID0gcmVzdWx0LkFQSVJlc3VsdF9Db25zdWx0RmVlLkZlZURlc2NyaXB0aW9uO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5yZXF1ZXN0Y29uc3VsdC5GZWVEZXNjcmlwdGlvbiArIFwiIFwiICsgc2VsZi5yZXF1ZXN0Y29uc3VsdC5Db25zdWx0RmVlICsgXCIgXCIgKyBzZWxmLnJlcXVlc3Rjb25zdWx0LkNvbnN1bHRBdmFpbGFibGUpO1xuICAgICAgICAgIGlmIChzZWxmLnJlcXVlc3Rjb25zdWx0LkZlZURlc2NyaXB0aW9uICE9IFwiRnJlZVwiKSB7XG4gICAgICAgICAgICBzZWxmLnNob3dpbmdQYXltZW50KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuZnJlZUNoZWNrVXAoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkL0FjY2Nlc3MgZGVuaWVkIC5UcnkgYWZ0ZXIgc29tZSB0aW1lIC4uLlwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICAgIGVycm9yID0+IHtcbiAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIGluIENvbnN1bHRhdGlvbiBmZWVkZXRhaWxzLi4uIFwiICsgZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgfVxuICBzaG93aW5nUGF5bWVudCgpIHtcbiAgICB0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYWxSZWNvcmRzVXB0b0RhdGUgPSB0aGlzLmlzVXB0b0RhdGU7XG4gICAgbGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICBxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlcXVlc3Rjb25zdWx0KSB9XG4gICAgfTsgdGhpcy53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICBpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSA9PSAzICYmIHRoaXMuaXNVcHRvRGF0ZSAmJiB0aGlzLnJlcXVlc3Rjb25zdWx0LlVzZXJQcmVmZXJyZWRQaGFybWFjeSAhPSBudWxsKSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvcGhhcm1hY3lcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNVcHRvRGF0ZSkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3VzZXJoZWFsdGhyZWNvcmRzXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gMykge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlYXJjaHBoYXJtYWN5XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gNCkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NyZWRpdGNhcmRcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cbiAgfVxuICBmcmVlQ2hlY2tVcCgpIHtcbiAgICB0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYWxSZWNvcmRzVXB0b0RhdGUgPSB0aGlzLmlzVXB0b0RhdGU7XG4gICAgbGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICBxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlcXVlc3Rjb25zdWx0KSB9XG4gICAgfTsgdGhpcy53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICBpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSA9PSAzICYmIHRoaXMuaXNVcHRvRGF0ZSAmJiB0aGlzLnJlcXVlc3Rjb25zdWx0LlVzZXJQcmVmZXJyZWRQaGFybWFjeSAhPSBudWxsKSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvcGhhcm1hY3lcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNVcHRvRGF0ZSkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3VzZXJoZWFsdGhyZWNvcmRzXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gMyAmJiB0aGlzLnJlcXVlc3Rjb25zdWx0LlVzZXJQcmVmZXJyZWRQaGFybWFjeSA9PSBudWxsKSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VhcmNocGhhcm1hY3lcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSA9PSA0KSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VjdXJlZW1haWxcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cbiAgfVxuICBnb2JhY2soKSB7XG4gICAgbGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICBxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlcXVlc3Rjb25zdWx0KSB9XG4gICAgfTtcbiAgICBpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSA9PSAzKSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2NoZWR1bGV0eXBlXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gNCkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21lbWJlcmRldGFpbHNcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICB9XG4gIGNvbnZlcnRUaW1lKHRpbWUyNCkge1xuICAgIHJldHVybiB0aGlzLndlYmFwaS5jb252ZXJ0VGltZTI0dG8xMih0aW1lMjQpO1xuICB9XG59O1xuIl19