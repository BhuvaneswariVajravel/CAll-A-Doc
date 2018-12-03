import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { ValueList } from "nativescript-drop-down";
import { WebAPIService } from "../../shared/services/web-api.service";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";
let xml2js = require('nativescript-xml2js');
// PHARMACY

@Component({
    moduleId: module.id,
    templateUrl: "./pharmacy.component.html",
    providers: [Configuration, WebAPIService, RadSideComponent]
})
export class PharmacyComponent {
    preferredPharmacy: any = {};
    requestconsult = new RequestConsultModel();
    mapView: any = null;
    usePreferredPharmacy: boolean = true;
    placeG: any = []; centeredOnLocation: boolean = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private activatedRoutes: ActivatedRoute) { }
    ngOnInit() {
        this.page.actionBarHidden = true; let self = this;
        this.radSideComponent.rcClass = true;
        /* To show Preferred pharmacy */
        if (this.webapi.netConnectivityCheck()) {
            this.webapi.getMembersPreferredPharmacy_http().subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_PreferredPharmacy.Successful == "true") {
                        self.preferredPharmacy = result.APIResult_PreferredPharmacy.PreferredPharmacy
                        let pharmacyAddr: any = [];
                        pharmacyAddr.push(self.preferredPharmacy.PharmacyAddress1 + " " + self.preferredPharmacy.PharmacyCity + ", " + self.preferredPharmacy.PharmacyState + " " + self.preferredPharmacy.PharmacyZip);
                        self.searchPharmacyToPlaceMarkers(pharmacyAddr);
                    } else if (result.APIResult_PreferredPharmacy.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        //console.log("LOGOUT DUE SESSION TIME OUT IN PREFFRED PHARMACY --->" + result.APIResult_PreferredPharmacy.Message);
                        self.webapi.logout();
                    } else {
                        console.log("Error in getting preferred pharmacy ");
                    }
                });
            },
                error => {
                    console.log("Error in getting preferred pharmacy.. " + error);
                });
        }
        this.activatedRoutes.queryParams.subscribe(params => {
            if (params["REQUEST_CONSULT"] != undefined) {
                this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                this.usePreferredPharmacy = this.requestconsult.SetPreferredPharmacy;
            }
        });

    }
    //Map events
    onMapReady(event) {
        // console.log('Map Ready');
        if (this.mapView || !event.object) return;
        this.mapView = event.object;
        this.mapView.latitude = 36.778259;
        this.mapView.longitude = -119.417931;
    };
    getPharmacyType() {
        this.usePreferredPharmacy = !this.usePreferredPharmacy;
    }
    showNextPage() {
        this.requestconsult.SetPreferredPharmacy = this.usePreferredPharmacy;
        if (this.usePreferredPharmacy) {
            this.requestconsult.PharmacyId = this.preferredPharmacy.PharmacyId;
            this.requestconsult.PharmacyName = this.preferredPharmacy.PharmacyName;
            this.requestconsult.PharmacyAddress1 = this.preferredPharmacy.PharmacyAddress1;
            this.requestconsult.PharmacyCity = this.preferredPharmacy.PharmacyCity;
            this.requestconsult.PharmacyState = this.preferredPharmacy.PharmacyState;
            this.requestconsult.PharmacyZip = this.preferredPharmacy.PharmacyZip;
            this.requestconsult.PharmacyPhone = this.preferredPharmacy.PharmacyPhone;
        }
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "REQUEST_CONSULT": JSON.stringify(this.requestconsult),
            }
        };
        if (this.usePreferredPharmacy && this.requestconsult.FeeDescription == "Free") {
            this.router.navigate(["/billing"], navigationExtras);
        } else if (this.usePreferredPharmacy && this.requestconsult.FeeDescription != "Free") {
            this.router.navigate(["/creditcard"], navigationExtras);
        } else {
            this.router.navigate(["/searchpharmacy"], navigationExtras);
        }
    }
    goback() {
        let navigationExtras: NavigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/healthrecords"], navigationExtras);
    }
    searchPharmacyToPlaceMarkers(pharAddrs: any[]) {
        let self = this;
        //console.log("Search place in map " + pharAddrs.length);
        let searchField = "";
        for (let i = 0; i < pharAddrs.length; i++) {
            searchField = "";
            searchField = pharAddrs[i].split(' ').join('%20');
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
                    self.centeredOnLocation = true;
                },
                error => {
                    console.log(error);
                }
            );
        }
    }
};