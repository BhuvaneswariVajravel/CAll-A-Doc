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
var ApplicationSettings = require("application-settings");
var nativescript_google_maps_sdk_1 = require("nativescript-google-maps-sdk");
var SearchPharmacyComponent = (function () {
    function SearchPharmacyComponent(page, webapi, router, activatedRoutes) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.pharSearchTab = false;
        this.formSubmitted = false;
        this.pharmacyList = [];
        this.mapView = null;
        this.pharmaciesAddr = [];
        this.placeG = [];
        this.centeredOnLocation = false;
        this.statesInfo = [];
        this.sSelectedIndex = null;
        this.update = false;
        this.selectedPharmacy = {};
    }
    SearchPharmacyComponent.prototype.ngOnInit = function () {
        var _this = this;
        var user = JSON.parse(ApplicationSettings.getString("USER"));
        this.zipcode = user.Zip;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                if (_this.requestconsult.SearchPharmacyResults != null) {
                    _this.update = true;
                    _this.selectedPharmacy.PharmacyId = _this.requestconsult.PharmacyId;
                    _this.selectedPharmacy.PharmacyName = _this.requestconsult.PharmacyName;
                    _this.selectedPharmacy.PharmacyAddress1 = _this.requestconsult.PharmacyAddress1;
                    _this.selectedPharmacy.PharmacyCity = _this.requestconsult.PharmacyCity;
                    _this.selectedPharmacy.PharmacyState = _this.requestconsult.PharmacyState;
                    _this.selectedPharmacy.PharmacyZip = _this.requestconsult.PharmacyZip;
                    _this.selectedPharmacy.PharmacyPhone = _this.requestconsult.PharmacyPhone;
                    _this.pharmacyList = _this.requestconsult.SearchPharmacyResults;
                }
                else {
                    _this.searchPharmacy(true, true);
                }
            }
        });
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.getCodeList("USStates").subscribe(function (data) {
                var self = _this;
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CodeList.Successful == "true") {
                        for (var loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
                            self.statesInfo.push(result.APIResult_CodeList.List.List.CodeListItem[loop].Value);
                        }
                    }
                    else {
                        //	console.log("Error in getting the states. ");
                    }
                });
            }, function (error) {
                //console.log("Error in getting the states service type.. " + error);
            });
        }
    };
    SearchPharmacyComponent.prototype.searchPharmacy = function (pvalue, zvalue) {
        //console.log("search pharmacy called" + pvalue + " " + zvalue);
        this.formSubmitted = true;
        var self = this;
        //console.log(this.state + "    " + this.city + "    " + this.zipcode);
        if (pvalue && self.webapi.netConnectivityCheck()) {
            self.pharSearchTab = false;
            self.webapi.loader.show(self.webapi.options);
            self.pharmacyList = [];
            this.webapi.pharmacySearch(this.pharname != undefined ? this.pharname : "", this.zipcode != undefined ? this.zipcode : "", this.state != undefined ? this.state : "", this.city != undefined ? this.city : "").subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PharmacyList.Successful == "true" && result.APIResult_PharmacyList.PharmacyListCount != "0") {
                        var list = result.APIResult_PharmacyList.PharmacyList.PharmacyItem;
                        if (list.length != undefined) {
                            for (var i = 0; i < list.length; i++) {
                                list[i].MemberDefaultPharmacy = false;
                                self.pharmacyList.push(list[i]);
                                self.pharmaciesAddr.push(list[i].PharmacyAddress1 + " " + list[i].PharmacyCity + ", " + list[i].PharmacyState + " " + list[i].PharmacyZip);
                            }
                        }
                        else {
                            self.pharmacyList.push(list);
                            self.pharmaciesAddr.push(list.PharmacyAddress1 + " " + list.PharmacyCity + ", " + list.PharmacyState + " " + list.PharmacyZip);
                        }
                        self.searchPharmacyToPlaceMarkers(self.pharmaciesAddr);
                        self.webapi.loader.hide();
                    }
                    else if (result.APIResult_PharmacyList.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.loader.hide();
                        //	console.log("LOGOUT DUE SESSION TIME OUT IN SEARCH PHARMACY --->" + result.APIResult_PharmacyList.Message);
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
    SearchPharmacyComponent.prototype.onStateChange = function (args) {
        this.state = this.statesInfo[args.selectedIndex];
    };
    SearchPharmacyComponent.prototype.onMapReady = function (event) {
        if (this.mapView || !event.object)
            return;
        this.mapView = event.object;
        this.mapView.latitude = 36.778259;
        this.mapView.longitude = -119.417931;
        this.mapView.zoom = 2;
    };
    ;
    SearchPharmacyComponent.prototype.searchPharmacyToPlaceMarkers = function (pharAddrs) {
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
                console.log(error);
            });
        }
    };
    SearchPharmacyComponent.prototype.removeMarker = function (marker) {
        if (this.mapView && marker) {
            this.mapView.removeMarker(marker);
        }
    };
    SearchPharmacyComponent.prototype.setAsPreferredPharmacy = function (index) {
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
    SearchPharmacyComponent.prototype.onMarkerSelect = function (event) {
        for (var i = 0; i < this.pharmacyList.length; i++) {
            if (this.pharmacyList[i].PharmacyAddress1.toUpperCase() == event.marker.title.toUpperCase()) {
                this.setAsPreferredPharmacy(i);
                this.pharmacyList.splice(0, 0, this.pharmacyList.splice(i, 1)[0]);
            }
        }
    };
    SearchPharmacyComponent.prototype.mapInGoogle = function (item) {
        this.page.getViewById("scrollidd").scrollToVerticalOffset(0, false);
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
                //	console.log("Marker added. and Zoomed.......");
            }, function (error) {
                console.log(error);
            });
        }
        //this.searchPharmacyToPlaceMarkers(markPhar.push(item.PharmacyAddress1 + " " + item.PharmacyCity + ", " + item.PharmacyState + " " +item.PharmacyZip));
    };
    SearchPharmacyComponent.prototype.showNextPage = function () {
        this.update = true;
        this.page.getViewById("scrollidd").scrollToVerticalOffset(0, false);
        //console.log("selected     " + this.selectedPharmacy)
        if (this.update && this.selectedPharmacy.PharmacyId != null && this.selectedPharmacy.PharmacyId != undefined) {
            this.requestconsult.SearchPharmacyResults = this.pharmacyList;
            this.requestconsult.PharmacyId = this.selectedPharmacy.PharmacyId;
            this.requestconsult.PharmacyName = this.selectedPharmacy.PharmacyName;
            this.requestconsult.PharmacyAddress1 = this.selectedPharmacy.PharmacyAddress1;
            this.requestconsult.PharmacyCity = this.selectedPharmacy.PharmacyCity;
            this.requestconsult.PharmacyState = this.selectedPharmacy.PharmacyState;
            this.requestconsult.PharmacyZip = this.selectedPharmacy.PharmacyZip;
            this.requestconsult.PharmacyPhone = this.selectedPharmacy.PharmacyPhone;
            var navigationExtras = {
                queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
            };
            if (this.requestconsult.FeeDescription == "Free") {
                this.router.navigate(["/billing"], navigationExtras);
            }
            else {
                this.router.navigate(["/creditcard"], navigationExtras);
            }
        }
    };
    SearchPharmacyComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        if (!this.requestconsult.SetPreferredPharmacy && this.requestconsult.UserPreferredPharmacy == null) {
            this.router.navigate(["/healthrecords"], navigationExtras);
        }
        else {
            this.router.navigate(["/pharmacy"], navigationExtras);
        }
    };
    SearchPharmacyComponent.prototype.toggle = function () {
        if (this.pharSearchTab)
            this.pharSearchTab = false;
        else
            this.pharSearchTab = true;
    };
    return SearchPharmacyComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], SearchPharmacyComponent.prototype, "radSideComponent", void 0);
SearchPharmacyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./searchpharmacy.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute])
], SearchPharmacyComponent);
exports.SearchPharmacyComponent = SearchPharmacyComponent;
;
var AddMarkerArgs = (function () {
    function AddMarkerArgs() {
    }
    return AddMarkerArgs;
}());
exports.AddMarkerArgs = AddMarkerArgs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNocGhhcm1hY3kuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VhcmNocGhhcm1hY3kuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTZEO0FBQzdELDBDQUEyRTtBQUMzRSxnQ0FBK0I7QUFDL0IsMEVBQXlFO0FBQ3pFLHlFQUFzRTtBQUN0RSwrREFBNkQ7QUFDN0Qsa0VBQWdFO0FBQ2hFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRTVDLDBEQUE0RDtBQUM1RCw2RUFBeUU7QUFTekUsSUFBYSx1QkFBdUI7SUFVbkMsaUNBQW9CLElBQVUsRUFBVSxNQUFxQixFQUFVLE1BQWMsRUFBVSxlQUErQjtRQUExRyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFUOUgsbUJBQWMsR0FBRyxJQUFJLDBDQUFtQixFQUFFLENBQUM7UUFFM0Msa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFDL0Isa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFBQyxpQkFBWSxHQUFRLEVBQUUsQ0FBQztRQUFDLFlBQU8sR0FBUSxJQUFJLENBQUM7UUFDbkUsbUJBQWMsR0FBUSxFQUFFLENBQUM7UUFBQyxXQUFNLEdBQVEsRUFBRSxDQUFDO1FBQUMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBQ2hGLGVBQVUsR0FBUSxFQUFFLENBQUM7UUFBQyxtQkFBYyxHQUFXLElBQUksQ0FBQztRQUNwRCxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQUMscUJBQWdCLEdBQVEsRUFBRSxDQUFDO0lBRzhFLENBQUM7SUFDbkksMENBQVEsR0FBUjtRQUFBLGlCQXVDQztRQXRDQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxN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Q0FBQyxjQUFjLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0YsQ0FBQztJQUNELHdDQUFNLEdBQU47UUFDQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUk7WUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0lBRUYsOEJBQUM7QUFBRCxDQUFDLEFBNU5ELElBNE5DO0FBcE42QjtJQUE1QixnQkFBUyxDQUFDLG9DQUFnQixDQUFDOzhCQUFtQixvQ0FBZ0I7aUVBQUM7QUFScEQsdUJBQXVCO0lBTG5DLGdCQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLGlDQUFpQztRQUM5QyxTQUFTLEVBQUUsQ0FBQywrQkFBYSxFQUFFLDZCQUFhLEVBQUUsb0NBQWdCLENBQUM7S0FDM0QsQ0FBQztxQ0FXeUIsV0FBSSxFQUFrQiwrQkFBYSxFQUFrQixlQUFNLEVBQTJCLHVCQUFjO0dBVmxILHVCQUF1QixDQTRObkM7QUE1TlksMERBQXVCO0FBNE5uQyxDQUFDO0FBQ0Y7SUFBQTtJQUdBLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgUmVxdWVzdENvbnN1bHRNb2RlbCB9IGZyb20gXCIuL3JlcXVlc3Rjb25zdWx0Lm1vZGVsXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmxldCB4bWwyanMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQteG1sMmpzJyk7XG5pbXBvcnQgeyBWYWx1ZUxpc3QgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93blwiO1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCB7IE1hcFZpZXcsIE1hcmtlciwgUG9zaXRpb24gfSBmcm9tICduYXRpdmVzY3JpcHQtZ29vZ2xlLW1hcHMtc2RrJztcbmltcG9ydCB7IFNjcm9sbFZpZXcgfSBmcm9tIFwidWkvc2Nyb2xsLXZpZXdcIjtcblxuXG5AQ29tcG9uZW50KHtcblx0bW9kdWxlSWQ6IG1vZHVsZS5pZCxcblx0dGVtcGxhdGVVcmw6IFwiLi9zZWFyY2hwaGFybWFjeS5jb21wb25lbnQuaHRtbFwiLFxuXHRwcm92aWRlcnM6IFtXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBSYWRTaWRlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBTZWFyY2hQaGFybWFjeUNvbXBvbmVudCB7XG5cdHJlcXVlc3Rjb25zdWx0ID0gbmV3IFJlcXVlc3RDb25zdWx0TW9kZWwoKTtcblx0emlwY29kZTogc3RyaW5nOyBjaXR5OiBzdHJpbmc7XG5cdHBoYXJTZWFyY2hUYWI6IGJvb2xlYW4gPSBmYWxzZTsgcGhhcm5hbWU6IHN0cmluZztcblx0Zm9ybVN1Ym1pdHRlZCA9IGZhbHNlOyBwaGFybWFjeUxpc3Q6IGFueSA9IFtdOyBtYXBWaWV3OiBhbnkgPSBudWxsO1xuXHRwaGFybWFjaWVzQWRkcjogYW55ID0gW107IHBsYWNlRzogYW55ID0gW107IGNlbnRlcmVkT25Mb2NhdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXHRzdGF0ZXNJbmZvOiBhbnkgPSBbXTsgc1NlbGVjdGVkSW5kZXg6IG51bWJlciA9IG51bGw7IHN0YXRlOiBzdHJpbmc7XG5cdHVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlOyBzZWxlY3RlZFBoYXJtYWN5OiBhbnkgPSB7fTtcblx0QFZpZXdDaGlsZChSYWRTaWRlQ29tcG9uZW50KSByYWRTaWRlQ29tcG9uZW50OiBSYWRTaWRlQ29tcG9uZW50O1xuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVzOiBBY3RpdmF0ZWRSb3V0ZSkgeyB9XG5cdG5nT25Jbml0KCkge1xuXHRcdGxldCB1c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpO1xuXHRcdHRoaXMuemlwY29kZSA9IHVzZXIuWmlwOyB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcblx0XHR0aGlzLnJhZFNpZGVDb21wb25lbnQucmNDbGFzcyA9IHRydWU7XG5cdFx0dGhpcy5hY3RpdmF0ZWRSb3V0ZXMucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLnJlcXVlc3Rjb25zdWx0ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJSRVFVRVNUX0NPTlNVTFRcIl0pO1xuXHRcdFx0XHRpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZWFyY2hQaGFybWFjeVJlc3VsdHMgIT0gbnVsbCkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkUGhhcm1hY3kuUGhhcm1hY3lJZCA9IHRoaXMucmVxdWVzdGNvbnN1bHQuUGhhcm1hY3lJZDtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkUGhhcm1hY3kuUGhhcm1hY3lOYW1lID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5QaGFybWFjeU5hbWU7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5QWRkcmVzczEgPSB0aGlzLnJlcXVlc3Rjb25zdWx0LlBoYXJtYWN5QWRkcmVzczE7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5Q2l0eSA9IHRoaXMucmVxdWVzdGNvbnN1bHQuUGhhcm1hY3lDaXR5O1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0ZWRQaGFybWFjeS5QaGFybWFjeVN0YXRlID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5QaGFybWFjeVN0YXRlO1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0ZWRQaGFybWFjeS5QaGFybWFjeVppcCA9IHRoaXMucmVxdWVzdGNvbnN1bHQuUGhhcm1hY3laaXA7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5UGhvbmUgPSB0aGlzLnJlcXVlc3Rjb25zdWx0LlBoYXJtYWN5UGhvbmU7XG5cdFx0XHRcdFx0dGhpcy5waGFybWFjeUxpc3QgPSB0aGlzLnJlcXVlc3Rjb25zdWx0LlNlYXJjaFBoYXJtYWN5UmVzdWx0cztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnNlYXJjaFBoYXJtYWN5KHRydWUsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0aWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcblx0XHRcdHRoaXMud2ViYXBpLmdldENvZGVMaXN0KFwiVVNTdGF0ZXNcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0X0NvZGVMaXN0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGxvb3AgPSAwOyBsb29wIDwgcmVzdWx0LkFQSVJlc3VsdF9Db2RlTGlzdC5MaXN0Lkl0ZW1Db3VudDsgbG9vcCsrKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuc3RhdGVzSW5mby5wdXNoKHJlc3VsdC5BUElSZXN1bHRfQ29kZUxpc3QuTGlzdC5MaXN0LkNvZGVMaXN0SXRlbVtsb29wXS5WYWx1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL1x0Y29uc29sZS5sb2coXCJFcnJvciBpbiBnZXR0aW5nIHRoZSBzdGF0ZXMuIFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJFcnJvciBpbiBnZXR0aW5nIHRoZSBzdGF0ZXMgc2VydmljZSB0eXBlLi4gXCIgKyBlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRzZWFyY2hQaGFybWFjeShwdmFsdWUsIHp2YWx1ZSkge1xuXHRcdC8vY29uc29sZS5sb2coXCJzZWFyY2ggcGhhcm1hY3kgY2FsbGVkXCIgKyBwdmFsdWUgKyBcIiBcIiArIHp2YWx1ZSk7XG5cdFx0dGhpcy5mb3JtU3VibWl0dGVkID0gdHJ1ZTsgbGV0IHNlbGYgPSB0aGlzO1xuXHRcdC8vY29uc29sZS5sb2codGhpcy5zdGF0ZSArIFwiICAgIFwiICsgdGhpcy5jaXR5ICsgXCIgICAgXCIgKyB0aGlzLnppcGNvZGUpO1xuXHRcdGlmIChwdmFsdWUgJiYgc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuXHRcdFx0c2VsZi5waGFyU2VhcmNoVGFiID0gZmFsc2U7XG5cdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTsgc2VsZi5waGFybWFjeUxpc3QgPSBbXTtcblx0XHRcdHRoaXMud2ViYXBpLnBoYXJtYWN5U2VhcmNoKHRoaXMucGhhcm5hbWUgIT0gdW5kZWZpbmVkID8gdGhpcy5waGFybmFtZSA6IFwiXCIsIHRoaXMuemlwY29kZSAhPSB1bmRlZmluZWQgPyB0aGlzLnppcGNvZGUgOiBcIlwiLCB0aGlzLnN0YXRlICE9IHVuZGVmaW5lZCA/IHRoaXMuc3RhdGUgOiBcIlwiLCB0aGlzLmNpdHkgIT0gdW5kZWZpbmVkID8gdGhpcy5jaXR5IDogXCJcIikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9QaGFybWFjeUxpc3QuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X1BoYXJtYWN5TGlzdC5QaGFybWFjeUxpc3RDb3VudCAhPSBcIjBcIikge1xuXHRcdFx0XHRcdFx0bGV0IGxpc3QgPSByZXN1bHQuQVBJUmVzdWx0X1BoYXJtYWN5TGlzdC5QaGFybWFjeUxpc3QuUGhhcm1hY3lJdGVtO1xuXHRcdFx0XHRcdFx0aWYgKGxpc3QubGVuZ3RoICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRsaXN0W2ldLk1lbWJlckRlZmF1bHRQaGFybWFjeSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYucGhhcm1hY3lMaXN0LnB1c2gobGlzdFtpXSk7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5waGFybWFjaWVzQWRkci5wdXNoKGxpc3RbaV0uUGhhcm1hY3lBZGRyZXNzMSArIFwiIFwiICsgbGlzdFtpXS5QaGFybWFjeUNpdHkgKyBcIiwgXCIgKyBsaXN0W2ldLlBoYXJtYWN5U3RhdGUgKyBcIiBcIiArIGxpc3RbaV0uUGhhcm1hY3laaXApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzZWxmLnBoYXJtYWN5TGlzdC5wdXNoKGxpc3QpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnBoYXJtYWNpZXNBZGRyLnB1c2gobGlzdC5QaGFybWFjeUFkZHJlc3MxICsgXCIgXCIgKyBsaXN0LlBoYXJtYWN5Q2l0eSArIFwiLCBcIiArIGxpc3QuUGhhcm1hY3lTdGF0ZSArIFwiIFwiICsgbGlzdC5QaGFybWFjeVppcCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLnNlYXJjaFBoYXJtYWN5VG9QbGFjZU1hcmtlcnMoc2VsZi5waGFybWFjaWVzQWRkcik7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdF9QaGFybWFjeUxpc3QuTWVzc2FnZSA9PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhcIkxPR09VVCBEVUUgU0VTU0lPTiBUSU1FIE9VVCBJTiBTRUFSQ0ggUEhBUk1BQ1kgLS0tPlwiICsgcmVzdWx0LkFQSVJlc3VsdF9QaGFybWFjeUxpc3QuTWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJObyBwaGFybWFjaWVzIGZvdW5kIC8gU2Vzc2lvbiBleHBpcmVkIC8gZXJyb3IgaW4gc2VhcmNoIHBoYXJtYWN5XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3IgaW4gUGhhcm1hY3kgU2VhcmNoLi4gXCIgKyBlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRvblN0YXRlQ2hhbmdlKGFyZ3MpIHtcblx0XHR0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZXNJbmZvW2FyZ3Muc2VsZWN0ZWRJbmRleF07XG5cdH1cblx0b25NYXBSZWFkeShldmVudCkge1xuXHRcdGlmICh0aGlzLm1hcFZpZXcgfHwgIWV2ZW50Lm9iamVjdCkgcmV0dXJuO1xuXHRcdHRoaXMubWFwVmlldyA9IGV2ZW50Lm9iamVjdDtcblx0XHR0aGlzLm1hcFZpZXcubGF0aXR1ZGUgPSAzNi43NzgyNTk7XG5cdFx0dGhpcy5tYXBWaWV3LmxvbmdpdHVkZSA9IC0xMTkuNDE3OTMxO1xuXHRcdHRoaXMubWFwVmlldy56b29tID0gMjtcblx0fTtcblx0c2VhcmNoUGhhcm1hY3lUb1BsYWNlTWFya2VycyhwaGFyQWRkcnM6IGFueVtdKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzOyBsZXQgc2VhcmNoRmllbGQgPSBcIlwiO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGhhckFkZHJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzZWFyY2hGaWVsZCA9IFwiXCI7IHNlYXJjaEZpZWxkID0gcGhhckFkZHJzW2ldLnNwbGl0KCcgJykuam9pbignJTIwJyk7XG5cdFx0XHR0aGlzLndlYmFwaS5nZXRQbGFjZXMoc2VhcmNoRmllbGQpLnN1YnNjcmliZShcblx0XHRcdFx0ZGF0YSA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cdFx0XHRcdFx0c2VsZi5wbGFjZUcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKS5yZXN1bHRzO1xuXHRcdFx0XHRcdGxldCBtYXJrZXIgPSBuZXcgTWFya2VyKCk7XG5cdFx0XHRcdFx0bWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHNlbGYucGxhY2VHWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdCwgc2VsZi5wbGFjZUdbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKTtcblx0XHRcdFx0XHRtYXJrZXIudGl0bGUgPSBzZWxmLnBsYWNlR1swXS5uYW1lO1xuXHRcdFx0XHRcdG1hcmtlci5zbmlwcGV0ID0gc2VsZi5wbGFjZUdbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG5cdFx0XHRcdFx0c2VsZi5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuXHRcdFx0XHRcdC8vc2VsZi5tYXBWaWV3Lnpvb20gPSAxMDA7XG5cdFx0XHRcdFx0c2VsZi5jZW50ZXJlZE9uTG9jYXRpb24gPSB0cnVlO1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJNYXJrZXIgYWRkZWQuLi4uLi4uLlwiKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblx0cmVtb3ZlTWFya2VyKG1hcmtlcjogTWFya2VyKSB7XG5cdFx0aWYgKHRoaXMubWFwVmlldyAmJiBtYXJrZXIpIHtcblx0XHRcdHRoaXMubWFwVmlldy5yZW1vdmVNYXJrZXIobWFya2VyKTtcblx0XHR9XG5cdH1cblx0c2V0QXNQcmVmZXJyZWRQaGFybWFjeShpbmRleCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5waGFybWFjeUxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChpID09IGluZGV4KSB7XG5cdFx0XHRcdHRoaXMucGhhcm1hY3lMaXN0W2luZGV4XS5NZW1iZXJEZWZhdWx0UGhhcm1hY3kgPSAhdGhpcy5waGFybWFjeUxpc3RbaW5kZXhdLk1lbWJlckRlZmF1bHRQaGFybWFjeTtcblx0XHRcdFx0aWYgKHRoaXMucGhhcm1hY3lMaXN0W2luZGV4XS5NZW1iZXJEZWZhdWx0UGhhcm1hY3kpIHtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkUGhhcm1hY3kgPSB0aGlzLnBoYXJtYWN5TGlzdFtpbmRleF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RlZFBoYXJtYWN5ID0ge307XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGhhcm1hY3lMaXN0W2ldLk1lbWJlckRlZmF1bHRQaGFybWFjeSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRvbk1hcmtlclNlbGVjdChldmVudCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5waGFybWFjeUxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0aGlzLnBoYXJtYWN5TGlzdFtpXS5QaGFybWFjeUFkZHJlc3MxLnRvVXBwZXJDYXNlKCkgPT0gZXZlbnQubWFya2VyLnRpdGxlLnRvVXBwZXJDYXNlKCkpIHtcblx0XHRcdFx0dGhpcy5zZXRBc1ByZWZlcnJlZFBoYXJtYWN5KGkpO1xuXHRcdFx0XHR0aGlzLnBoYXJtYWN5TGlzdC5zcGxpY2UoMCwgMCwgdGhpcy5waGFybWFjeUxpc3Quc3BsaWNlKGksIDEpWzBdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0bWFwSW5Hb29nbGUoaXRlbSkge1xuXHRcdCg8U2Nyb2xsVmlldz50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzY3JvbGxpZGRcIikpLnNjcm9sbFRvVmVydGljYWxPZmZzZXQoMCwgZmFsc2UpO1xuXHRcdGxldCBtYXJrUGhhcjogYW55ID0gW107XG5cdFx0bWFya1BoYXIucHVzaChpdGVtLlBoYXJtYWN5QWRkcmVzczEgKyBcIiBcIiArIGl0ZW0uUGhhcm1hY3lDaXR5ICsgXCIsIFwiICsgaXRlbS5QaGFybWFjeVN0YXRlICsgXCIgXCIgKyBpdGVtLlBoYXJtYWN5WmlwKVxuXHRcdGxldCBzZWxmID0gdGhpczsgbGV0IHNlYXJjaEZpZWxkID0gXCJcIjtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtQaGFyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzZWFyY2hGaWVsZCA9IFwiXCI7XG5cdFx0XHRzZWFyY2hGaWVsZCA9IG1hcmtQaGFyW2ldLnNwbGl0KCcgJykuam9pbignJTIwJyk7XG5cdFx0XHR0aGlzLndlYmFwaS5nZXRQbGFjZXMoc2VhcmNoRmllbGQpLnN1YnNjcmliZShcblx0XHRcdFx0ZGF0YSA9PiB7XG5cdFx0XHRcdFx0c2VsZi5wbGFjZUcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKS5yZXN1bHRzO1xuXHRcdFx0XHRcdGxldCBtYXJrZXIgPSBuZXcgTWFya2VyKCk7XG5cdFx0XHRcdFx0bWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHNlbGYucGxhY2VHWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdCwgc2VsZi5wbGFjZUdbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKTtcblx0XHRcdFx0XHRtYXJrZXIudGl0bGUgPSBzZWxmLnBsYWNlR1swXS5uYW1lO1xuXHRcdFx0XHRcdG1hcmtlci5zbmlwcGV0ID0gc2VsZi5wbGFjZUdbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG5cdFx0XHRcdFx0c2VsZi5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuXHRcdFx0XHRcdHNlbGYubWFwVmlldy5sYXRpdHVkZSA9IHNlbGYucGxhY2VHWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdDtcblx0XHRcdFx0XHRzZWxmLm1hcFZpZXcubG9uZ2l0dWRlID0gc2VsZi5wbGFjZUdbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xuXHRcdFx0XHRcdHNlbGYubWFwVmlldy56b29tID0gMTY7XG5cdFx0XHRcdFx0c2VsZi5jZW50ZXJlZE9uTG9jYXRpb24gPSB0cnVlO1xuXHRcdFx0XHQvL1x0Y29uc29sZS5sb2coXCJNYXJrZXIgYWRkZWQuIGFuZCBab29tZWQuLi4uLi4uXCIpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0XHQvL3RoaXMuc2VhcmNoUGhhcm1hY3lUb1BsYWNlTWFya2VycyhtYXJrUGhhci5wdXNoKGl0ZW0uUGhhcm1hY3lBZGRyZXNzMSArIFwiIFwiICsgaXRlbS5QaGFybWFjeUNpdHkgKyBcIiwgXCIgKyBpdGVtLlBoYXJtYWN5U3RhdGUgKyBcIiBcIiAraXRlbS5QaGFybWFjeVppcCkpO1xuXHR9XG5cdHNob3dOZXh0UGFnZSgpIHtcblx0XHR0aGlzLnVwZGF0ZSA9IHRydWU7XG5cdFx0KDxTY3JvbGxWaWV3PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNjcm9sbGlkZFwiKSkuc2Nyb2xsVG9WZXJ0aWNhbE9mZnNldCgwLCBmYWxzZSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcInNlbGVjdGVkICAgICBcIiArIHRoaXMuc2VsZWN0ZWRQaGFybWFjeSlcblx0XHRpZiAodGhpcy51cGRhdGUgJiYgdGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5SWQgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGVkUGhhcm1hY3kuUGhhcm1hY3lJZCAhPSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMucmVxdWVzdGNvbnN1bHQuU2VhcmNoUGhhcm1hY3lSZXN1bHRzID0gdGhpcy5waGFybWFjeUxpc3Q7XG5cdFx0XHR0aGlzLnJlcXVlc3Rjb25zdWx0LlBoYXJtYWN5SWQgPSB0aGlzLnNlbGVjdGVkUGhhcm1hY3kuUGhhcm1hY3lJZDtcblx0XHRcdHRoaXMucmVxdWVzdGNvbnN1bHQuUGhhcm1hY3lOYW1lID0gdGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5TmFtZTtcblx0XHRcdHRoaXMucmVxdWVzdGNvbnN1bHQuUGhhcm1hY3lBZGRyZXNzMSA9IHRoaXMuc2VsZWN0ZWRQaGFybWFjeS5QaGFybWFjeUFkZHJlc3MxO1xuXHRcdFx0dGhpcy5yZXF1ZXN0Y29uc3VsdC5QaGFybWFjeUNpdHkgPSB0aGlzLnNlbGVjdGVkUGhhcm1hY3kuUGhhcm1hY3lDaXR5O1xuXHRcdFx0dGhpcy5yZXF1ZXN0Y29uc3VsdC5QaGFybWFjeVN0YXRlID0gdGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5U3RhdGU7XG5cdFx0XHR0aGlzLnJlcXVlc3Rjb25zdWx0LlBoYXJtYWN5WmlwID0gdGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5WmlwO1xuXHRcdFx0dGhpcy5yZXF1ZXN0Y29uc3VsdC5QaGFybWFjeVBob25lID0gdGhpcy5zZWxlY3RlZFBoYXJtYWN5LlBoYXJtYWN5UGhvbmU7XG5cdFx0XHRsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcblx0XHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuXHRcdFx0fTtcblx0XHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LkZlZURlc2NyaXB0aW9uID09IFwiRnJlZVwiKSB7XG5cdFx0XHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9iaWxsaW5nXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jcmVkaXRjYXJkXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Z29iYWNrKCkge1xuXHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuXHRcdH07XG5cblx0XHRpZiAoIXRoaXMucmVxdWVzdGNvbnN1bHQuU2V0UHJlZmVycmVkUGhhcm1hY3kgJiYgdGhpcy5yZXF1ZXN0Y29uc3VsdC5Vc2VyUHJlZmVycmVkUGhhcm1hY3kgPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2hlYWx0aHJlY29yZHNcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvcGhhcm1hY3lcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHRcdH1cblx0fVxuXHR0b2dnbGUoKSB7XG5cdFx0aWYgKHRoaXMucGhhclNlYXJjaFRhYilcblx0XHRcdHRoaXMucGhhclNlYXJjaFRhYiA9IGZhbHNlO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMucGhhclNlYXJjaFRhYiA9IHRydWU7XG5cdH1cblxufTtcbmV4cG9ydCBjbGFzcyBBZGRNYXJrZXJBcmdzIHtcblx0cHVibGljIGxvY2F0aW9uOiBQb3NpdGlvbjtcblx0cHVibGljIHRpdGxlOiBzdHJpbmc7XG59ICAiXX0=