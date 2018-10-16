"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var followups_routing_1 = require("./followups.routing");
var followups_component_1 = require("./followups.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var FollowUpsModule = (function () {
    function FollowUpsModule() {
    }
    return FollowUpsModule;
}());
FollowUpsModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(followups_routing_1.followUpRoutes),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule,
            dependent_module_1.DependentModule
        ],
        declarations: [followups_component_1.FollowUpComponent, followups_component_1.FollowUpViewComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [followups_component_1.FollowUpComponent],
    })
], FollowUpsModule);
exports.FollowUpsModule = FollowUpsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9sbG93dXBzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvbGxvd3Vwcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnRkFBOEU7QUFFOUUsc0NBQTJEO0FBQzNELGtEQUFtRTtBQUNuRSxzREFBdUU7QUFDdkUsb0RBQXFFO0FBQ3JFLHlEQUFxRDtBQUNyRCw2REFBaUY7QUFDakYsdUVBQXFFO0FBQ3JFLDREQUEwRDtBQUMxRCxrRUFBZ0U7QUFrQmhFLElBQWEsZUFBZTtJQUE1QjtJQUErQixDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBQWhDLElBQWdDO0FBQW5CLGVBQWU7SUFqQjNCLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRTtZQUNQLHdDQUFrQjtZQUNsQixpQ0FBd0I7WUFDeEIsK0JBQXVCO1lBQ3ZCLGlDQUF3QixDQUFDLE9BQU8sQ0FBQyxrQ0FBYyxDQUFDO1lBQ2hELDZCQUFzQjtZQUN0Qiw0QkFBWTtZQUNaLDhCQUFhO1lBQ2Isa0NBQWU7U0FDaEI7UUFDRCxZQUFZLEVBQUUsQ0FBQyx1Q0FBaUIsRUFBRSwyQ0FBcUIsQ0FBQztRQUN4RCxPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyx1Q0FBaUIsQ0FBQztLQUMvQixDQUFDO0dBQ1csZUFBZSxDQUFJO0FBQW5CLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IGZvbGxvd1VwUm91dGVzIH0gZnJvbSBcIi4vZm9sbG93dXBzLnJvdXRpbmdcIjtcbmltcG9ydCB7IEZvbGxvd1VwQ29tcG9uZW50LCBGb2xsb3dVcFZpZXdDb21wb25lbnQgfSBmcm9tIFwiLi9mb2xsb3d1cHMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2RpcmVjdGl2ZXMvc2hhcmVkLm1vZHVsZVwiO1xuaW1wb3J0IHsgUmFkU2lkZU1vZHVsZSB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUubW9kdWxlXCI7XG5pbXBvcnQgeyBEZXBlbmRlbnRNb2R1bGUgfSBmcm9tIFwiLi4vZGVwZW5kZW50L2RlcGVuZGVudC5tb2R1bGVcIjtcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KGZvbGxvd1VwUm91dGVzKSxcbiAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlLFxuICAgIFNoYXJlZE1vZHVsZSxcbiAgICBSYWRTaWRlTW9kdWxlLFxuICAgIERlcGVuZGVudE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtGb2xsb3dVcENvbXBvbmVudCwgRm9sbG93VXBWaWV3Q29tcG9uZW50XSxcbiAgc2NoZW1hczogW1xuICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgXSxcbiAgYm9vdHN0cmFwOiBbRm9sbG93VXBDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBGb2xsb3dVcHNNb2R1bGUgeyB9XG4iXX0=