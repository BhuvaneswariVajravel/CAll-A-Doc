"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var changepassword_routing_1 = require("./changepassword.routing");
var changepassword_component_1 = require("./changepassword.component");
var ChangePasswordModule = (function () {
    function ChangePasswordModule() {
    }
    return ChangePasswordModule;
}());
ChangePasswordModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(changepassword_routing_1.changepasswordRoutes),
            http_1.NativeScriptHttpModule
        ],
        declarations: [changepassword_component_1.ChangePasswordComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [changepassword_component_1.ChangePasswordComponent],
    })
], ChangePasswordModule);
exports.ChangePasswordModule = ChangePasswordModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlcGFzc3dvcmQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hhbmdlcGFzc3dvcmQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQThFO0FBRTlFLHNDQUEyRDtBQUMzRCxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLG9EQUFxRTtBQUNyRSxtRUFBZ0U7QUFDaEUsdUVBQXFFO0FBZ0JyRSxJQUFhLG9CQUFvQjtJQUFqQztJQUFvQyxDQUFDO0lBQUQsMkJBQUM7QUFBRCxDQUFDLEFBQXJDLElBQXFDO0FBQXhCLG9CQUFvQjtJQWRoQyxlQUFRLENBQUM7UUFDUixPQUFPLEVBQUU7WUFDUCx3Q0FBa0I7WUFDbEIsaUNBQXdCO1lBQ3hCLCtCQUF1QjtZQUN2QixpQ0FBd0IsQ0FBQyxPQUFPLENBQUMsNkNBQW9CLENBQUM7WUFDdEQsNkJBQXNCO1NBQ3ZCO1FBQ0QsWUFBWSxFQUFFLENBQUMsa0RBQXVCLENBQUM7UUFDdkMsT0FBTyxFQUFFO1lBQ1AsdUJBQWdCO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFLENBQUMsa0RBQXVCLENBQUM7S0FDckMsQ0FBQztHQUNXLG9CQUFvQixDQUFJO0FBQXhCLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvbkVuZCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBjaGFuZ2VwYXNzd29yZFJvdXRlcyB9IGZyb20gXCIuL2NoYW5nZXBhc3N3b3JkLnJvdXRpbmdcIjtcbmltcG9ydCB7IENoYW5nZVBhc3N3b3JkQ29tcG9uZW50IH0gZnJvbSBcIi4vY2hhbmdlcGFzc3dvcmQuY29tcG9uZW50XCI7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KGNoYW5nZXBhc3N3b3JkUm91dGVzKSxcbiAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0NoYW5nZVBhc3N3b3JkQ29tcG9uZW50XSxcbiAgc2NoZW1hczogW1xuICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgXSxcbiAgYm9vdHN0cmFwOiBbQ2hhbmdlUGFzc3dvcmRDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBDaGFuZ2VQYXNzd29yZE1vZHVsZSB7IH1cbiJdfQ==