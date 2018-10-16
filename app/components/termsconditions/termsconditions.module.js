"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var termsconditions_routing_1 = require("./termsconditions.routing");
var termsconditions_component_1 = require("./termsconditions.component");
var TermsConditionsModule = (function () {
    function TermsConditionsModule() {
    }
    return TermsConditionsModule;
}());
TermsConditionsModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(termsconditions_routing_1.termsconditionsRoutes),
            http_1.NativeScriptHttpModule
        ],
        declarations: [termsconditions_component_1.TermsConditionsComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [termsconditions_component_1.TermsConditionsComponent],
    })
], TermsConditionsModule);
exports.TermsConditionsModule = TermsConditionsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybXNjb25kaXRpb25zLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlcm1zY29uZGl0aW9ucy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnRkFBOEU7QUFFOUUsc0NBQTJEO0FBQzNELGtEQUFtRTtBQUNuRSxzREFBdUU7QUFDdkUsb0RBQXFFO0FBQ3JFLHFFQUFrRTtBQUNsRSx5RUFBdUU7QUFnQnZFLElBQWEscUJBQXFCO0lBQWxDO0lBQXFDLENBQUM7SUFBRCw0QkFBQztBQUFELENBQUMsQUFBdEMsSUFBc0M7QUFBekIscUJBQXFCO0lBZGpDLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRTtZQUNQLHdDQUFrQjtZQUNsQixpQ0FBd0I7WUFDeEIsK0JBQXVCO1lBQ3ZCLGlDQUF3QixDQUFDLE9BQU8sQ0FBQywrQ0FBcUIsQ0FBQztZQUN2RCw2QkFBc0I7U0FDdkI7UUFDRCxZQUFZLEVBQUUsQ0FBQyxvREFBd0IsQ0FBQztRQUN4QyxPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyxvREFBd0IsQ0FBQztLQUN0QyxDQUFDO0dBQ1cscUJBQXFCLENBQUk7QUFBekIsc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IHRlcm1zY29uZGl0aW9uc1JvdXRlcyB9IGZyb20gXCIuL3Rlcm1zY29uZGl0aW9ucy5yb3V0aW5nXCI7XG5pbXBvcnQgeyBUZXJtc0NvbmRpdGlvbnNDb21wb25lbnQgfSBmcm9tIFwiLi90ZXJtc2NvbmRpdGlvbnMuY29tcG9uZW50XCI7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KHRlcm1zY29uZGl0aW9uc1JvdXRlcyksXG4gICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtUZXJtc0NvbmRpdGlvbnNDb21wb25lbnRdLFxuICBzY2hlbWFzOiBbXG4gICAgTk9fRVJST1JTX1NDSEVNQVxuICBdLFxuICBib290c3RyYXA6IFtUZXJtc0NvbmRpdGlvbnNDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBUZXJtc0NvbmRpdGlvbnNNb2R1bGUgeyB9XG4iXX0=