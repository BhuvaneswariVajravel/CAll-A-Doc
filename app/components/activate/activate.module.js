"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var activate_routing_1 = require("./activate.routing");
var activate_component_1 = require("./activate.component");
var orderconfirmation_component_1 = require("./orderconfirmation.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var ActivateModule = (function () {
    function ActivateModule() {
    }
    return ActivateModule;
}());
ActivateModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(activate_routing_1.activateRoutes),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule
        ],
        declarations: [activate_component_1.ActivateComponent, orderconfirmation_component_1.OrderconfirmationComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [activate_component_1.ActivateComponent],
    })
], ActivateModule);
exports.ActivateModule = ActivateModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aXZhdGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQThFO0FBRTlFLHNDQUEyRDtBQUMzRCxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLG9EQUFxRTtBQUNyRSx1REFBb0Q7QUFDcEQsMkRBQXlEO0FBQ3pELDZFQUEyRTtBQUMzRSx1RUFBcUU7QUFnQnJFLElBQWEsY0FBYztJQUEzQjtJQUE4QixDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUFDLEFBQS9CLElBQStCO0FBQWxCLGNBQWM7SUFmMUIsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLGlDQUFjLENBQUM7WUFDaEQsNkJBQXNCO1lBQ3RCLDRCQUFZO1NBQ2I7UUFDRCxZQUFZLEVBQUUsQ0FBQyxzQ0FBaUIsRUFBRSx3REFBMEIsQ0FBQztRQUM3RCxPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQztLQUMvQixDQUFDO0dBQ1csY0FBYyxDQUFJO0FBQWxCLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IGFjdGl2YXRlUm91dGVzIH0gZnJvbSBcIi4vYWN0aXZhdGUucm91dGluZ1wiO1xuaW1wb3J0IHsgQWN0aXZhdGVDb21wb25lbnQgfSBmcm9tIFwiLi9hY3RpdmF0ZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IE9yZGVyY29uZmlybWF0aW9uQ29tcG9uZW50IH0gZnJvbSBcIi4vb3JkZXJjb25maXJtYXRpb24uY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2RpcmVjdGl2ZXMvc2hhcmVkLm1vZHVsZVwiO1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3QoYWN0aXZhdGVSb3V0ZXMpLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgU2hhcmVkTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0FjdGl2YXRlQ29tcG9uZW50LCBPcmRlcmNvbmZpcm1hdGlvbkNvbXBvbmVudF0sXG4gIHNjaGVtYXM6IFtcbiAgICBOT19FUlJPUlNfU0NIRU1BXG4gIF0sXG4gIGJvb3RzdHJhcDogW0FjdGl2YXRlQ29tcG9uZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgQWN0aXZhdGVNb2R1bGUgeyB9XG4iXX0=