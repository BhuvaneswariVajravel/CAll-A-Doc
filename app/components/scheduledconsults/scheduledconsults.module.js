"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var scheduledconsults_routing_1 = require("./scheduledconsults.routing");
var scheduledconsults_component_1 = require("./scheduledconsults.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var ScheduledConsultsModule = (function () {
    function ScheduledConsultsModule() {
    }
    return ScheduledConsultsModule;
}());
ScheduledConsultsModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(scheduledconsults_routing_1.scheduledconsultsRoute),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule,
            dependent_module_1.DependentModule
        ],
        declarations: [scheduledconsults_component_1.ScheduledConsultsComponent, scheduledconsults_component_1.ScheduledConsultsViewComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [scheduledconsults_component_1.ScheduledConsultsComponent],
    })
], ScheduledConsultsModule);
exports.ScheduledConsultsModule = ScheduledConsultsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVkY29uc3VsdHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZWR1bGVkY29uc3VsdHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQThFO0FBRTlFLHNDQUEyRDtBQUMzRCxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLG9EQUFxRTtBQUNyRSx5RUFBcUU7QUFDckUsNkVBQTJHO0FBQzNHLHVFQUFxRTtBQUNyRSw0REFBMEQ7QUFDMUQsa0VBQWdFO0FBa0JoRSxJQUFhLHVCQUF1QjtJQUFwQztJQUF1QyxDQUFDO0lBQUQsOEJBQUM7QUFBRCxDQUFDLEFBQXhDLElBQXdDO0FBQTNCLHVCQUF1QjtJQWpCbkMsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLGtEQUFzQixDQUFDO1lBQ3hELDZCQUFzQjtZQUN0Qiw0QkFBWTtZQUNaLDhCQUFhO1lBQ2Isa0NBQWU7U0FDaEI7UUFDRCxZQUFZLEVBQUUsQ0FBQyx3REFBMEIsRUFBRSw0REFBOEIsQ0FBQztRQUMxRSxPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyx3REFBMEIsQ0FBQztLQUN4QyxDQUFDO0dBQ1csdUJBQXVCLENBQUk7QUFBM0IsMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IHNjaGVkdWxlZGNvbnN1bHRzUm91dGUgfSBmcm9tIFwiLi9zY2hlZHVsZWRjb25zdWx0cy5yb3V0aW5nXCI7XG5pbXBvcnQgeyBTY2hlZHVsZWRDb25zdWx0c0NvbXBvbmVudCwgU2NoZWR1bGVkQ29uc3VsdHNWaWV3Q29tcG9uZW50IH0gZnJvbSBcIi4vc2NoZWR1bGVkY29uc3VsdHMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2RpcmVjdGl2ZXMvc2hhcmVkLm1vZHVsZVwiO1xuaW1wb3J0IHsgUmFkU2lkZU1vZHVsZSB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUubW9kdWxlXCI7XG5pbXBvcnQgeyBEZXBlbmRlbnRNb2R1bGUgfSBmcm9tIFwiLi4vZGVwZW5kZW50L2RlcGVuZGVudC5tb2R1bGVcIjtcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KHNjaGVkdWxlZGNvbnN1bHRzUm91dGUpLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgU2hhcmVkTW9kdWxlLFxuICAgIFJhZFNpZGVNb2R1bGUsXG4gICAgRGVwZW5kZW50TW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1NjaGVkdWxlZENvbnN1bHRzQ29tcG9uZW50LCBTY2hlZHVsZWRDb25zdWx0c1ZpZXdDb21wb25lbnRdLFxuICBzY2hlbWFzOiBbXG4gICAgTk9fRVJST1JTX1NDSEVNQVxuICBdLFxuICBib290c3RyYXA6IFtTY2hlZHVsZWRDb25zdWx0c0NvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlZENvbnN1bHRzTW9kdWxlIHsgfVxuIl19