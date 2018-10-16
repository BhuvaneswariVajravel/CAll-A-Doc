"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var profile_routing_1 = require("./profile.routing");
var profile_component_1 = require("./profile.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var ProfileModule = (function () {
    function ProfileModule() {
    }
    return ProfileModule;
}());
ProfileModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(profile_routing_1.profileRoutes),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule,
            dependent_module_1.DependentModule
        ],
        declarations: [profile_component_1.ProfileComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [profile_component_1.ProfileComponent],
    })
], ProfileModule);
exports.ProfileModule = ProfileModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9maWxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdGQUE4RTtBQUU5RSxzQ0FBMkQ7QUFDM0Qsa0RBQW1FO0FBQ25FLHNEQUF1RTtBQUN2RSxvREFBcUU7QUFDckUscURBQWtEO0FBQ2xELHlEQUF1RDtBQUN2RCx1RUFBcUU7QUFDckUsNERBQTBEO0FBQzFELGtFQUFnRTtBQWtCaEUsSUFBYSxhQUFhO0lBQTFCO0lBQTZCLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFBOUIsSUFBOEI7QUFBakIsYUFBYTtJQWpCekIsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLCtCQUFhLENBQUM7WUFDL0MsNkJBQXNCO1lBQ3RCLDRCQUFZO1lBQ1osOEJBQWE7WUFDYixrQ0FBZTtTQUNoQjtRQUNELFlBQVksRUFBRSxDQUFDLG9DQUFnQixDQUFDO1FBQ2hDLE9BQU8sRUFBRTtZQUNQLHVCQUFnQjtTQUNqQjtRQUNELFNBQVMsRUFBRSxDQUFDLG9DQUFnQixDQUFDO0tBQzlCLENBQUM7R0FDVyxhQUFhLENBQUk7QUFBakIsc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25FbmQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgcHJvZmlsZVJvdXRlcyB9IGZyb20gXCIuL3Byb2ZpbGUucm91dGluZ1wiO1xuaW1wb3J0IHsgUHJvZmlsZUNvbXBvbmVudCB9IGZyb20gXCIuL3Byb2ZpbGUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2RpcmVjdGl2ZXMvc2hhcmVkLm1vZHVsZVwiO1xuaW1wb3J0IHsgUmFkU2lkZU1vZHVsZSB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUubW9kdWxlXCI7XG5pbXBvcnQgeyBEZXBlbmRlbnRNb2R1bGUgfSBmcm9tIFwiLi4vZGVwZW5kZW50L2RlcGVuZGVudC5tb2R1bGVcIjtcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KHByb2ZpbGVSb3V0ZXMpLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgU2hhcmVkTW9kdWxlLFxuICAgIFJhZFNpZGVNb2R1bGUsXG4gICAgRGVwZW5kZW50TW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1Byb2ZpbGVDb21wb25lbnRdLFxuICBzY2hlbWFzOiBbXG4gICAgTk9fRVJST1JTX1NDSEVNQVxuICBdLFxuICBib290c3RyYXA6IFtQcm9maWxlQ29tcG9uZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgUHJvZmlsZU1vZHVsZSB7IH1cbiJdfQ==