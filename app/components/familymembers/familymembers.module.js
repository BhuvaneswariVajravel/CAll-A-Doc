"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var familymembers_routing_1 = require("./familymembers.routing");
var familymembers_component_1 = require("./familymembers.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var FamilyMembersModule = (function () {
    function FamilyMembersModule() {
    }
    return FamilyMembersModule;
}());
FamilyMembersModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(familymembers_routing_1.familymembersRoutes),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule
        ],
        declarations: [familymembers_component_1.FamilyMembersComponent, familymembers_component_1.AddmembersComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [familymembers_component_1.FamilyMembersComponent],
    })
], FamilyMembersModule);
exports.FamilyMembersModule = FamilyMembersModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFtaWx5bWVtYmVycy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmYW1pbHltZW1iZXJzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdGQUE4RTtBQUU5RSxzQ0FBMkQ7QUFDM0Qsa0RBQW1FO0FBQ25FLHNEQUF1RTtBQUN2RSxvREFBcUU7QUFDckUsaUVBQThEO0FBQzlELHFFQUF3RjtBQUN4Rix1RUFBcUU7QUFDckUsNERBQTBEO0FBaUIxRCxJQUFhLG1CQUFtQjtJQUFoQztJQUFtQyxDQUFDO0lBQUQsMEJBQUM7QUFBRCxDQUFDLEFBQXBDLElBQW9DO0FBQXZCLG1CQUFtQjtJQWhCL0IsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLDJDQUFtQixDQUFDO1lBQ3JELDZCQUFzQjtZQUN0Qiw0QkFBWTtZQUNaLDhCQUFhO1NBQ2Q7UUFDRCxZQUFZLEVBQUUsQ0FBQyxnREFBc0IsRUFBRSw2Q0FBbUIsQ0FBQztRQUMzRCxPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyxnREFBc0IsQ0FBQztLQUNwQyxDQUFDO0dBQ1csbUJBQW1CLENBQUk7QUFBdkIsa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IGZhbWlseW1lbWJlcnNSb3V0ZXMgfSBmcm9tIFwiLi9mYW1pbHltZW1iZXJzLnJvdXRpbmdcIjtcbmltcG9ydCB7IEZhbWlseU1lbWJlcnNDb21wb25lbnQsIEFkZG1lbWJlcnNDb21wb25lbnQgfSBmcm9tIFwiLi9mYW1pbHltZW1iZXJzLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9kaXJlY3RpdmVzL3NoYXJlZC5tb2R1bGVcIjtcbmltcG9ydCB7IFJhZFNpZGVNb2R1bGUgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLm1vZHVsZVwiO1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3QoZmFtaWx5bWVtYmVyc1JvdXRlcyksXG4gICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcbiAgICBTaGFyZWRNb2R1bGUsXG4gICAgUmFkU2lkZU1vZHVsZSAgICBcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbRmFtaWx5TWVtYmVyc0NvbXBvbmVudCwgQWRkbWVtYmVyc0NvbXBvbmVudF0sXG4gIHNjaGVtYXM6IFtcbiAgICBOT19FUlJPUlNfU0NIRU1BXG4gIF0sXG4gIGJvb3RzdHJhcDogW0ZhbWlseU1lbWJlcnNDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBGYW1pbHlNZW1iZXJzTW9kdWxlIHsgfVxuIl19