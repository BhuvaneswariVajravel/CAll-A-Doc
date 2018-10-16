"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var radside_component_1 = require("../radside/radside.component");
var common_1 = require("@angular/common");
var utilityModule = require("utils/utils");
var HealthToolsComponent = (function () {
    function HealthToolsComponent(page, webapi) {
        this.page = page;
        this.webapi = webapi;
        this.isVisible = false;
    }
    HealthToolsComponent.prototype.popupbtn = function () {
        this.isVisible = !this.isVisible;
    };
    HealthToolsComponent.prototype.popupclose = function () {
        this.isVisible = false;
    };
    HealthToolsComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.htClass = true;
    };
    HealthToolsComponent.prototype.launchBrowser = function (url) {
        utilityModule.openUrl(url);
    };
    return HealthToolsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], HealthToolsComponent.prototype, "radSideComponent", void 0);
HealthToolsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./healthtools.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService])
], HealthToolsComponent);
exports.HealthToolsComponent = HealthToolsComponent;
;
var FitnessToolsComponent = (function () {
    function FitnessToolsComponent(page, webapi, location) {
        this.page = page;
        this.webapi = webapi;
        this.location = location;
        this.isVisible = false;
    }
    FitnessToolsComponent.prototype.popupbtn = function () {
        this.isVisible = !this.isVisible;
        ;
    };
    FitnessToolsComponent.prototype.popupclose = function () {
        this.isVisible = false;
    };
    FitnessToolsComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.htClass = true;
    };
    FitnessToolsComponent.prototype.launchBrowser = function (url) {
        utilityModule.openUrl(url);
    };
    FitnessToolsComponent.prototype.goback = function () {
        this.location.back();
    };
    return FitnessToolsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], FitnessToolsComponent.prototype, "radSideComponent", void 0);
FitnessToolsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./fitnesstools.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, common_1.Location])
], FitnessToolsComponent);
exports.FitnessToolsComponent = FitnessToolsComponent;
;
var PregnancyToolsComponent = (function () {
    function PregnancyToolsComponent(page, webapi, location) {
        this.page = page;
        this.webapi = webapi;
        this.location = location;
        this.isVisible = false;
    }
    PregnancyToolsComponent.prototype.popupbtn = function () {
        this.isVisible = !this.isVisible;
    };
    PregnancyToolsComponent.prototype.popupclose = function () {
        this.isVisible = false;
    };
    PregnancyToolsComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.htClass = true;
    };
    PregnancyToolsComponent.prototype.launchBrowser = function (url) {
        utilityModule.openUrl(url);
    };
    PregnancyToolsComponent.prototype.goback = function () {
        this.location.back();
    };
    return PregnancyToolsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], PregnancyToolsComponent.prototype, "radSideComponent", void 0);
PregnancyToolsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./pregnancytools.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, common_1.Location])
], PregnancyToolsComponent);
exports.PregnancyToolsComponent = PregnancyToolsComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRodG9vbHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVhbHRodG9vbHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTZEO0FBQzdELGdDQUErQjtBQUMvQix5RUFBc0U7QUFDdEUsMEVBQXlFO0FBQ3pFLGtFQUFnRTtBQUNoRSwwQ0FBMkM7QUFDM0MsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBTTNDLElBQWEsb0JBQW9CO0lBRzdCLDhCQUFvQixJQUFVLEVBQVUsTUFBcUI7UUFBekMsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFGN0QsY0FBUyxHQUFZLEtBQUssQ0FBQztJQUVzQyxDQUFDO0lBQ2xFLHVDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QseUNBQVUsR0FBVjtRQUNJLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCx1Q0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsQ0FBQztJQUNELDRDQUFhLEdBQWIsVUFBYyxHQUFHO1FBQ2IsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0wsMkJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBZGdDO0lBQTVCLGdCQUFTLENBQUMsb0NBQWdCLENBQUM7OEJBQW1CLG9DQUFnQjs4REFBQztBQUZ2RCxvQkFBb0I7SUFMaEMsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsOEJBQThCO1FBQzNDLFNB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YSxFQUFFLDZCQUFhLEVBQUUsb0NBQWdCLENBQUM7S0FDOUQsQ0FBQztxQ0FJNEIsV0FBSSxFQUFrQiwrQkFBYSxFQUFvQixpQkFBUTtHQUhoRix1QkFBdUIsQ0FxQm5DO0FBckJZLDBEQUF1QjtBQXFCbkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUmFkU2lkZUNvbXBvbmVudCB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5sZXQgdXRpbGl0eU1vZHVsZSA9IHJlcXVpcmUoXCJ1dGlscy91dGlsc1wiKTtcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9oZWFsdGh0b29scy5jb21wb25lbnQuaHRtbFwiLFxuICAgIHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFJhZFNpZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEhlYWx0aFRvb2xzQ29tcG9uZW50IHtcbiAgICBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSkgeyB9XG4gICAgcG9wdXBidG4oKSB7XG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gIXRoaXMuaXNWaXNpYmxlO1xuICAgIH1cbiAgICBwb3B1cGNsb3NlKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7IHRoaXMucmFkU2lkZUNvbXBvbmVudC5odENsYXNzID0gdHJ1ZTtcbiAgICB9XG4gICAgbGF1bmNoQnJvd3Nlcih1cmwpIHtcbiAgICAgICAgdXRpbGl0eU1vZHVsZS5vcGVuVXJsKHVybCk7XG4gICAgfVxufTtcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9maXRuZXNzdG9vbHMuY29tcG9uZW50Lmh0bWxcIixcbiAgICBwcm92aWRlcnM6IFtXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBSYWRTaWRlQ29tcG9uZW50XVxuXG59KVxuZXhwb3J0IGNsYXNzIEZpdG5lc3NUb29sc0NvbXBvbmVudCB7XG4gICAgaXNWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgQFZpZXdDaGlsZChSYWRTaWRlQ29tcG9uZW50KSByYWRTaWRlQ29tcG9uZW50OiBSYWRTaWRlQ29tcG9uZW50O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uKSB7IH1cbiAgICBwb3B1cGJ0bigpIHtcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSAhdGhpcy5pc1Zpc2libGU7O1xuICAgIH1cbiAgICBwb3B1cGNsb3NlKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG4gICAgICAgIHRoaXMucmFkU2lkZUNvbXBvbmVudC5odENsYXNzID0gdHJ1ZTtcbiAgICB9XG4gICAgbGF1bmNoQnJvd3Nlcih1cmwpIHtcbiAgICAgICAgdXRpbGl0eU1vZHVsZS5vcGVuVXJsKHVybCk7XG4gICAgfVxuICAgIGdvYmFjaygpIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbi5iYWNrKCk7XG4gICAgfVxufTtcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9wcmVnbmFuY3l0b29scy5jb21wb25lbnQuaHRtbFwiLFxuICAgIHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFJhZFNpZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFByZWduYW5jeVRvb2xzQ29tcG9uZW50IHtcbiAgICBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24pIHtcbiAgICB9XG4gICAgcG9wdXBidG4oKSB7XG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gIXRoaXMuaXNWaXNpYmxlO1xuICAgIH1cbiAgICBwb3B1cGNsb3NlKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG4gICAgICAgIHRoaXMucmFkU2lkZUNvbXBvbmVudC5odENsYXNzID0gdHJ1ZTtcbiAgICB9XG4gICAgbGF1bmNoQnJvd3Nlcih1cmwpIHtcbiAgICAgICAgdXRpbGl0eU1vZHVsZS5vcGVuVXJsKHVybCk7XG4gICAgfVxuICAgIGdvYmFjaygpIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbi5iYWNrKCk7XG4gICAgfVxufTsiXX0=