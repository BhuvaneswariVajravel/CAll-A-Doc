"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var inbox_routing_1 = require("./inbox.routing");
var inbox_component_1 = require("./inbox.component");
var inboxview_component_1 = require("./inboxview.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var InboxModule = (function () {
    function InboxModule() {
    }
    return InboxModule;
}());
InboxModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(inbox_routing_1.inboxRoutes),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule,
            dependent_module_1.DependentModule
        ],
        declarations: [inbox_component_1.InboxComponent, inboxview_component_1.InboxviewComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [inbox_component_1.InboxComponent],
    })
], InboxModule);
exports.InboxModule = InboxModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5ib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQThFO0FBRTlFLHNDQUEyRDtBQUMzRCxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLG9EQUFxRTtBQUNyRSxpREFBOEM7QUFDOUMscURBQW1EO0FBQ25ELDZEQUEyRDtBQUMzRCx1RUFBcUU7QUFDckUsNERBQTBEO0FBQzFELGtFQUFnRTtBQWtCaEUsSUFBYSxXQUFXO0lBQXhCO0lBQTJCLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFBNUIsSUFBNEI7QUFBZixXQUFXO0lBakJ2QixlQUFRLENBQUM7UUFDUixPQUFPLEVBQUU7WUFDUCx3Q0FBa0I7WUFDbEIsaUNBQXdCO1lBQ3hCLCtCQUF1QjtZQUN2QixpQ0FBd0IsQ0FBQyxPQUFPLENBQUMsMkJBQVcsQ0FBQztZQUM3Qyw2QkFBc0I7WUFDdEIsNEJBQVk7WUFDWiw4QkFBYTtZQUNiLGtDQUFlO1NBQ2hCO1FBQ0QsWUFBWSxFQUFFLENBQUMsZ0NBQWMsRUFBRSx3Q0FBa0IsQ0FBQztRQUNsRCxPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyxnQ0FBYyxDQUFDO0tBQzVCLENBQUM7R0FDVyxXQUFXLENBQUk7QUFBZixrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvbkVuZCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBpbmJveFJvdXRlcyB9IGZyb20gXCIuL2luYm94LnJvdXRpbmdcIjtcbmltcG9ydCB7IEluYm94Q29tcG9uZW50IH0gZnJvbSBcIi4vaW5ib3guY29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbmJveHZpZXdDb21wb25lbnQgfSBmcm9tIFwiLi9pbmJveHZpZXcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2RpcmVjdGl2ZXMvc2hhcmVkLm1vZHVsZVwiO1xuaW1wb3J0IHsgUmFkU2lkZU1vZHVsZSB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUubW9kdWxlXCI7XG5pbXBvcnQgeyBEZXBlbmRlbnRNb2R1bGUgfSBmcm9tIFwiLi4vZGVwZW5kZW50L2RlcGVuZGVudC5tb2R1bGVcIjtcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KGluYm94Um91dGVzKSxcbiAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlLFxuICAgIFNoYXJlZE1vZHVsZSxcbiAgICBSYWRTaWRlTW9kdWxlLFxuICAgIERlcGVuZGVudE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtJbmJveENvbXBvbmVudCwgSW5ib3h2aWV3Q29tcG9uZW50XSxcbiAgc2NoZW1hczogW1xuICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgXSxcbiAgYm9vdHN0cmFwOiBbSW5ib3hDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBJbmJveE1vZHVsZSB7IH1cbiJdfQ==