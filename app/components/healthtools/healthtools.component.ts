import { Component, OnInit, ViewChild } from "@angular/core";
import { Page } from "ui/page";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import { RadSideComponent } from "../radside/radside.component";
import { Location } from '@angular/common';
let utilityModule = require("utils/utils");
@Component({
    moduleId: module.id,
    templateUrl: "./healthtools.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class HealthToolsComponent {
    isVisible: boolean = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService) { }
    popupbtn() {
        this.isVisible = !this.isVisible;
    }
    popupclose() {
        this.isVisible = false;
    }
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.htClass = true;
    }
    launchBrowser(url) {
        utilityModule.openUrl(url);
    }
};
@Component({
    moduleId: module.id,
    templateUrl: "./fitnesstools.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]

})
export class FitnessToolsComponent {
    isVisible: boolean = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private location: Location) { }
    popupbtn() {
        this.isVisible = !this.isVisible;;
    }
    popupclose() {
        this.isVisible = false;
    }
    ngOnInit() {
        this.page.actionBarHidden = true;
        this.radSideComponent.htClass = true;
    }
    launchBrowser(url) {
        utilityModule.openUrl(url);
    }
    goback() {
        this.location.back();
    }
};
@Component({
    moduleId: module.id,
    templateUrl: "./pregnancytools.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class PregnancyToolsComponent {
    isVisible: boolean = false;
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private location: Location) {
    }
    popupbtn() {
        this.isVisible = !this.isVisible;
    }
    popupclose() {
        this.isVisible = false;
    }
    ngOnInit() {
        this.page.actionBarHidden = true;
        this.radSideComponent.htClass = true;
    }
    launchBrowser(url) {
        utilityModule.openUrl(url);
    }
    goback() {
        this.location.back();
    }
};