import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";

let xml2js = require('nativescript-xml2js');

// HEALTH RECORDS
@Component({
  moduleId: module.id,
  templateUrl: "./healthrecords.component.html",
  providers: [Configuration, WebAPIService, RadSideComponent]
})
export class HealthRecordsComponent {
  public isUptoDate: boolean = true;
  public lastUpdate: string;
  isPreferredPharmacyAvailable: boolean = false;
  requestconsult = new RequestConsultModel();
  @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
  constructor(private page: Page, private webapi: WebAPIService, private router: Router, private activatedRoutes: ActivatedRoute) { }
  ngOnInit() {
    this.page.actionBarHidden = true;
    this.radSideComponent.rcClass = true;
    this.activatedRoutes.queryParams.subscribe(params => {
      if (params["REQUEST_CONSULT"] != undefined) {
        this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
        this.isUptoDate = this.requestconsult.MedicalRecordsUptoDate;
      }
    });
    if (this.webapi.netConnectivityCheck()) {
      this.webapi.getEMRComplete_http().subscribe(data => {
        let self = this;
        xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
          if (result.APIResult_EMRComplete.Successful == "true") {
            self.lastUpdate = result.APIResult_EMRComplete.LastUpdate;
          } else if (result.APIResult_EMRComplete.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
            //console.log("LOGOUT DUE SESSION TIME OUT --->" + result.APIResult_EMRComplete.Message);
            self.webapi.logout();
          }
        });
      },
        error => {
          //console.log("Error in getting the service type.. " + error);
        });
      this.webapi.getMembersPreferredPharmacy_http().subscribe(data => {
        let self = this;
        xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
          if (result.APIResult_PreferredPharmacy.Successful == "true" && result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId != "0") {
            //console.log("PN     " + result.APIResult_PreferredPharmacy.PreferredPharmacy.PharmacyId);
            self.requestconsult.UserPreferredPharmacy = result.APIResult_PreferredPharmacy.PreferredPharmacy;
          } else {
            //console.log("Error in getting preferred pharmacy ");
          }
        });
      },
        error => {
         // console.log("Error in getting preferred pharmacy.. " + error);
        });
    }
  }
  checkMedicalRecordStatus() {
    this.isUptoDate = !this.isUptoDate;
  }
  showNextPage() {
    if (this.webapi.netConnectivityCheck()) {
      this.consultationFeeDetails();
    }
  }
  consultationFeeDetails() {
    let self = this; self.webapi.loader.show(self.webapi.options);
    self.webapi.consultationFeeDetails(this.requestconsult.ServiceType).subscribe(data => {
      xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
        if (result.APIResult_ConsultFee.Successful == "true") {
          self.requestconsult.ConsultAvailable = result.APIResult_ConsultFee.ConsultAvailable;
          self.requestconsult.ConsultFee = result.APIResult_ConsultFee.ConsultFee;
          self.requestconsult.FeeDescription = result.APIResult_ConsultFee.FeeDescription;
          //console.log(self.requestconsult.FeeDescription + " " + self.requestconsult.ConsultFee + " " + self.requestconsult.ConsultAvailable);
          if (self.requestconsult.FeeDescription != "Free") {
            self.showingPayment();
          } else {
            self.freeCheckUp();
          }
        } else {
          self.webapi.loader.hide();
        //  console.log("Session expired/Acccess denied .Try after some time ...");
        }
      });
    },
      error => {
        self.webapi.loader.hide();
       // console.log("Error in Consultation feedetails... " + error);
      });

  }
  showingPayment() {
    this.requestconsult.MedicalRecordsUptoDate = this.isUptoDate;
    let navigationExtras: NavigationExtras = {
      queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
    }; this.webapi.loader.hide();
    if (this.requestconsult.ServiceType == 3 && this.isUptoDate && this.requestconsult.UserPreferredPharmacy != null) {
      this.router.navigate(["/pharmacy"], navigationExtras);
    } else if (!this.isUptoDate) {
      this.router.navigate(["/userhealthrecords"], navigationExtras);
    } else if (this.requestconsult.ServiceType == 3) {
      this.router.navigate(["/searchpharmacy"], navigationExtras);
    } else if (this.requestconsult.ServiceType == 4) {
      this.router.navigate(["/creditcard"], navigationExtras);
    }
  }
  freeCheckUp() {
    this.requestconsult.MedicalRecordsUptoDate = this.isUptoDate;
    let navigationExtras: NavigationExtras = {
      queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
    }; this.webapi.loader.hide();
    if (this.requestconsult.ServiceType == 3 && this.isUptoDate && this.requestconsult.UserPreferredPharmacy != null) {
      this.router.navigate(["/pharmacy"], navigationExtras);
    } else if (!this.isUptoDate) {
      this.router.navigate(["/userhealthrecords"], navigationExtras);
    } else if (this.requestconsult.ServiceType == 3 && this.requestconsult.UserPreferredPharmacy == null) {
      this.router.navigate(["/searchpharmacy"], navigationExtras);
    } else if (this.requestconsult.ServiceType == 4) {
      this.router.navigate(["/secureemail"], navigationExtras);
    }
  }
  goback() {
    let navigationExtras: NavigationExtras = {
      queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
    };
    if (this.requestconsult.ServiceType == 3) {
      this.router.navigate(["/scheduletype"], navigationExtras);
    } else if (this.requestconsult.ServiceType == 4) {
      this.router.navigate(["/memberdetails"], navigationExtras);
    }

  }
  convertTime(time24) {
    return this.webapi.convertTime24to12(time24);
  }
};
