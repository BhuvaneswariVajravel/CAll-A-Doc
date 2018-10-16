"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var forgotpassword_routing_1 = require("./forgotpassword.routing");
var forgotpassword_component_1 = require("./forgotpassword.component");
var forgotpasswordconfirm_component_1 = require("./forgotpasswordconfirm.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var ForgotPasswordModule = (function () {
    function ForgotPasswordModule() {
    }
    return ForgotPasswordModule;
}());
ForgotPasswordModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(forgotpassword_routing_1.forgotpasswordRoutes),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule
        ],
        declarations: [forgotpassword_component_1.ForgotPasswordComponent, forgotpasswordconfirm_component_1.ForgotPasswordConfirmComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [forgotpassword_component_1.ForgotPasswordComponent],
    })
], ForgotPasswordModule);
exports.ForgotPasswordModule = ForgotPasswordModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290cGFzc3dvcmQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZm9yZ290cGFzc3dvcmQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQThFO0FBRTlFLHNDQUEyRDtBQUMzRCxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLG9EQUFxRTtBQUNyRSxtRUFBZ0U7QUFDaEUsdUVBQXFFO0FBQ3JFLHFGQUFrRjtBQUNsRix1RUFBcUU7QUFpQnJFLElBQWEsb0JBQW9CO0lBQWpDO0lBQW9DLENBQUM7SUFBRCwyQkFBQztBQUFELENBQUMsQUFBckMsSUFBcUM7QUFBeEIsb0JBQW9CO0lBZmhDLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRTtZQUNQLHdDQUFrQjtZQUNsQixpQ0FBd0I7WUFDeEIsK0JBQXVCO1lBQ3ZCLGlDQUF3QixDQUFDLE9BQU8sQ0FBQyw2Q0FBb0IsQ0FBQztZQUN0RCw2QkFBc0I7WUFDdEIsNEJBQVk7U0FDYjtRQUNELFlBQVksRUFBRSxDQUFDLGtEQUF1QixFQUFFLGdFQUE4QixDQUFDO1FBQ3ZFLE9BQU8sRUFBRTtZQUNQLHVCQUFnQjtTQUNqQjtRQUNELFNBQVMsRUFBRSxDQUFDLGtEQUF1QixDQUFDO0tBQ3JDLENBQUM7R0FDVyxvQkFBb0IsQ0FBSTtBQUF4QixvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25FbmQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgZm9yZ290cGFzc3dvcmRSb3V0ZXMgfSBmcm9tIFwiLi9mb3Jnb3RwYXNzd29yZC5yb3V0aW5nXCI7XG5pbXBvcnQgeyBGb3Jnb3RQYXNzd29yZENvbXBvbmVudCB9IGZyb20gXCIuL2ZvcmdvdHBhc3N3b3JkLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRm9yZ290UGFzc3dvcmRDb25maXJtQ29tcG9uZW50IH0gZnJvbSAnLi9mb3Jnb3RwYXNzd29yZGNvbmZpcm0uY29tcG9uZW50J1xuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9kaXJlY3RpdmVzL3NoYXJlZC5tb2R1bGVcIjtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3QoZm9yZ290cGFzc3dvcmRSb3V0ZXMpLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgU2hhcmVkTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0ZvcmdvdFBhc3N3b3JkQ29tcG9uZW50LCBGb3Jnb3RQYXNzd29yZENvbmZpcm1Db21wb25lbnRdLFxuICBzY2hlbWFzOiBbXG4gICAgTk9fRVJST1JTX1NDSEVNQVxuICBdLFxuICBib290c3RyYXA6IFtGb3Jnb3RQYXNzd29yZENvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIEZvcmdvdFBhc3N3b3JkTW9kdWxlIHsgfVxuIl19