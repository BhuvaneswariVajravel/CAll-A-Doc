import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";
let xml2js = require('nativescript-xml2js');
import { ValueList } from "nativescript-drop-down";
import * as ApplicationSettings from "application-settings";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { ScrollView } from "ui/scroll-view";


@Component({
	moduleId: module.id,
	templateUrl: "./searchpharmacy.component.html",
	providers: [WebAPIService, Configuration, RadSideComponent]
})
export class SearchPharmacyComponent {
	requestconsult = new RequestConsultModel();
	zipcode: string; city: string;
	pharSearchTab: boolean = false; pharname: string;
	formSubmitted = false; pharmacyList: any = []; mapView: any = null;
	pharmaciesAddr: any = []; placeG: any = []; centeredOnLocation: boolean = false;
	statesInfo: any = []; sSelectedIndex: number = null; state: string;
	update: boolean = false; selectedPharmacy: any = {};
	@ViewChild(RadSideComponent) radSideComponent: RadSideComponent;

	constructor(private page: Page, private webapi: WebAPIService, private router: Router, private activatedRoutes: ActivatedRoute) { }
	ngOnInit() {
		let user = JSON.parse(ApplicationSettings.getString("USER"));
		this.zipcode = user.Zip; this.page.actionBarHidden = true;
		this.radSideComponent.rcClass = true;
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined) {
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
				if (this.requestconsult.SearchPharmacyResults != null) {
					this.update = true;
					this.selectedPharmacy.PharmacyId = this.requestconsult.PharmacyId;
					this.selectedPharmacy.PharmacyName = this.requestconsult.PharmacyName;
					this.selectedPharmacy.PharmacyAddress1 = this.requestconsult.PharmacyAddress1;
					this.selectedPharmacy.PharmacyCity = this.requestconsult.PharmacyCity;
					this.selectedPharmacy.PharmacyState = this.requestconsult.PharmacyState;
					this.selectedPharmacy.PharmacyZip = this.requestconsult.PharmacyZip;
					this.selectedPharmacy.PharmacyPhone = this.requestconsult.PharmacyPhone;
					this.pharmacyList = this.requestconsult.SearchPharmacyResults;
				} else {
					this.searchPharmacy(true, true);
				}
			}
		});
		if (this.webapi.netConnectivityCheck()) {
			this.webapi.getCodeList("USStates").subscribe(data => {
				let self = this;
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult_CodeList.Successful == "true") {
						for (let loop = 0; loop < result.APIResult_CodeList.List.ItemCount; loop++) {
							self.statesInfo.push(result.APIResult_CodeList.List.List.CodeListItem[loop].Value);
						}
					} else {
					//	console.log("Error in getting the states. ");
					}
				});
			},
				error => {
					//console.log("Error in getting the states service type.. " + error);
				});
		}
	}
	searchPharmacy(pvalue, zvalue) {
		//console.log("search pharmacy called" + pvalue + " " + zvalue);
		this.formSubmitted = true; let self = this;
		//console.log(this.state + "    " + this.city + "    " + this.zipcode);
		if (pvalue && self.webapi.netConnectivityCheck()) {
			self.pharSearchTab = false;
			self.webapi.loader.show(self.webapi.options); self.pharmacyList = [];
			this.webapi.pharmacySearch(this.pharname != undefined ? this.pharname : "", this.zipcode != undefined ? this.zipcode : "", this.state != undefined ? this.state : "", this.city != undefined ? this.city : "").subscribe(data => {
				xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
					if (result.APIResult_PharmacyList.Successful == "true" && result.APIResult_PharmacyList.PharmacyListCount != "0") {
						let list = result.APIResult_PharmacyList.PharmacyList.PharmacyItem;
						if (list.length != undefined) {
							for (let i = 0; i < list.length; i++) {
								list[i].MemberDefaultPharmacy = false;
								self.pharmacyList.push(list[i]);
								self.pharmaciesAddr.push(list[i].PharmacyAddress1 + " " + list[i].PharmacyCity + ", " + list[i].PharmacyState + " " + list[i].PharmacyZip);
							}
						} else {
							self.pharmacyList.push(list);
							self.pharmaciesAddr.push(list.PharmacyAddress1 + " " + list.PharmacyCity + ", " + list.PharmacyState + " " + list.PharmacyZip);
						}
						self.searchPharmacyToPlaceMarkers(self.pharmaciesAddr);
						self.webapi.loader.hide();
					} else if (result.APIResult_PharmacyList.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
						self.webapi.loader.hide();
					//	console.log("LOGOUT DUE SESSION TIME OUT IN SEARCH PHARMACY --->" + result.APIResult_PharmacyList.Message);
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
	onStateChange(args) {
		this.state = this.statesInfo[args.selectedIndex];
	}
	onMapReady(event) {
		if (this.mapView || !event.object) return;
		this.mapView = event.object;
		this.mapView.latitude = 36.778259;
		this.mapView.longitude = -119.417931;
		this.mapView.zoom = 2;
	};
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
					console.log(error);
				}
			);
		}
	}
	removeMarker(marker: Marker) {
		if (this.mapView && marker) {
			this.mapView.removeMarker(marker);
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
	onMarkerSelect(event) {
		for (let i = 0; i < this.pharmacyList.length; i++) {
			if (this.pharmacyList[i].PharmacyAddress1.toUpperCase() == event.marker.title.toUpperCase()) {
				this.setAsPreferredPharmacy(i);
				this.pharmacyList.splice(0, 0, this.pharmacyList.splice(i, 1)[0]);
			}
		}
	}
	mapInGoogle(item) {
		(<ScrollView>this.page.getViewById("scrollidd")).scrollToVerticalOffset(0, false);
		let markPhar: any = [];
		markPhar.push(item.PharmacyAddress1 + " " + item.PharmacyCity + ", " + item.PharmacyState + " " + item.PharmacyZip)
		let self = this; let searchField = "";
		for (let i = 0; i < markPhar.length; i++) {
			searchField = "";
			searchField = markPhar[i].split(' ').join('%20');
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
				//	console.log("Marker added. and Zoomed.......");
				},
				error => {
					console.log(error);
				}
			);
		}
		//this.searchPharmacyToPlaceMarkers(markPhar.push(item.PharmacyAddress1 + " " + item.PharmacyCity + ", " + item.PharmacyState + " " +item.PharmacyZip));
	}
	showNextPage() {
		this.update = true;
		(<ScrollView>this.page.getViewById("scrollidd")).scrollToVerticalOffset(0, false);
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
			let navigationExtras: NavigationExtras = {
				queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
			};
			if (this.requestconsult.FeeDescription == "Free") {
				this.router.navigate(["/billing"], navigationExtras);
			} else {
				this.router.navigate(["/creditcard"], navigationExtras);
			}
		}
	}
	goback() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};

		if (!this.requestconsult.SetPreferredPharmacy && this.requestconsult.UserPreferredPharmacy == null) {
			this.router.navigate(["/healthrecords"], navigationExtras);
		} else {
			this.router.navigate(["/pharmacy"], navigationExtras);
		}
	}
	toggle() {
		if (this.pharSearchTab)
			this.pharSearchTab = false;
		else
			this.pharSearchTab = true;
	}

};
export class AddMarkerArgs {
	public location: Position;
	public title: string;
}  