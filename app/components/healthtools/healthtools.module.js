"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var healthtools_routing_1 = require("./healthtools.routing");
var healthtools_component_1 = require("./healthtools.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var HealthToolsModule = (function () {
    function HealthToolsModule() {
    }
    return HealthToolsModule;
}());
HealthToolsModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(healthtools_routing_1.healthtoolsRoutes),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule,
            dependent_module_1.DependentModule
        ],
        declarations: [healthtools_component_1.HealthToolsComponent, healthtools_component_1.FitnessToolsComponent, healthtools_component_1.PregnancyToolsComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [healthtools_component_1.HealthToolsComponent],
    })
], HealthToolsModule);
exports.HealthToolsModule = HealthToolsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRodG9vbHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVhbHRodG9vbHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQThFO0FBRTlFLHNDQUEyRDtBQUMzRCxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLG9EQUFxRTtBQUNyRSw2REFBMEQ7QUFDMUQsaUVBQStHO0FBQy9HLHVFQUFxRTtBQUNyRSw0REFBMEQ7QUFDMUQsa0VBQWdFO0FBa0JoRSxJQUFhLGlCQUFpQjtJQUE5QjtJQUFpQyxDQUFDO0lBQUQsd0JBQUM7QUFBRCxDQUFDLEFBQWxDLElBQWtDO0FBQXJCLGlCQUFpQjtJQWpCN0IsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLHVDQUFpQixDQUFDO1lBQ25ELDZCQUFzQjtZQUN0Qiw0QkFBWTtZQUNaLDhCQUFhO1lBQ2Isa0NBQWU7U0FDaEI7UUFDRCxZQUFZLEVBQUUsQ0FBQyw0Q0FBb0IsRUFBRSw2Q0FBcUIsRUFBRSwrQ0FBdUIsQ0FBQztRQUNwRixPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyw0Q0FBb0IsQ0FBQztLQUNsQyxDQUFDO0dBQ1csaUJBQWlCLENBQUk7QUFBckIsOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IGhlYWx0aHRvb2xzUm91dGVzIH0gZnJvbSBcIi4vaGVhbHRodG9vbHMucm91dGluZ1wiO1xuaW1wb3J0IHsgSGVhbHRoVG9vbHNDb21wb25lbnQsIEZpdG5lc3NUb29sc0NvbXBvbmVudCwgUHJlZ25hbmN5VG9vbHNDb21wb25lbnQgfSBmcm9tIFwiLi9oZWFsdGh0b29scy5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNoYXJlZE1vZHVsZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvZGlyZWN0aXZlcy9zaGFyZWQubW9kdWxlXCI7XG5pbXBvcnQgeyBSYWRTaWRlTW9kdWxlIH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5tb2R1bGVcIjtcbmltcG9ydCB7IERlcGVuZGVudE1vZHVsZSB9IGZyb20gXCIuLi9kZXBlbmRlbnQvZGVwZW5kZW50Lm1vZHVsZVwiO1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3QoaGVhbHRodG9vbHNSb3V0ZXMpLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgU2hhcmVkTW9kdWxlLFxuICAgIFJhZFNpZGVNb2R1bGUsXG4gICAgRGVwZW5kZW50TW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0hlYWx0aFRvb2xzQ29tcG9uZW50LCBGaXRuZXNzVG9vbHNDb21wb25lbnQsIFByZWduYW5jeVRvb2xzQ29tcG9uZW50XSxcbiAgc2NoZW1hczogW1xuICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgXSxcbiAgYm9vdHN0cmFwOiBbSGVhbHRoVG9vbHNDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBIZWFsdGhUb29sc01vZHVsZSB7IH1cbiJdfQ==