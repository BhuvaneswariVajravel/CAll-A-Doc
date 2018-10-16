"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var consulthistory_routing_1 = require("./consulthistory.routing");
var consulthistory_component_1 = require("./consulthistory.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var ConsultHistoryModule = (function () {
    function ConsultHistoryModule() {
    }
    return ConsultHistoryModule;
}());
ConsultHistoryModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(consulthistory_routing_1.consulthistoryRoute),
            http_1.NativeScriptHttpModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule,
            dependent_module_1.DependentModule
        ],
        declarations: [consulthistory_component_1.ConsultHistoryComponent, consulthistory_component_1.ConsultHistoryViewComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [consulthistory_component_1.ConsultHistoryComponent],
    })
], ConsultHistoryModule);
exports.ConsultHistoryModule = ConsultHistoryModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VsdGhpc3RvcnkubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3VsdGhpc3RvcnkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQThFO0FBRTlFLHNDQUEyRDtBQUMzRCxrREFBbUU7QUFDbkUsc0RBQXVFO0FBQ3ZFLG9EQUFxRTtBQUNyRSxtRUFBK0Q7QUFDL0QsdUVBQWtHO0FBQ2xHLHVFQUFxRTtBQUNyRSw0REFBMEQ7QUFDMUQsa0VBQWdFO0FBa0JoRSxJQUFhLG9CQUFvQjtJQUFqQztJQUFvQyxDQUFDO0lBQUQsMkJBQUM7QUFBRCxDQUFDLEFBQXJDLElBQXFDO0FBQXhCLG9CQUFvQjtJQWpCaEMsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLDRDQUFtQixDQUFDO1lBQ3JELDZCQUFzQjtZQUN0Qiw0QkFBWTtZQUNaLDhCQUFhO1lBQ2Isa0NBQWU7U0FDaEI7UUFDRCxZQUFZLEVBQUUsQ0FBQyxrREFBdUIsRUFBRSxzREFBMkIsQ0FBQztRQUNwRSxPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyxrREFBdUIsQ0FBQztLQUNyQyxDQUFDO0dBQ1csb0JBQW9CLENBQUk7QUFBeEIsb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IGNvbnN1bHRoaXN0b3J5Um91dGUgfSBmcm9tIFwiLi9jb25zdWx0aGlzdG9yeS5yb3V0aW5nXCI7XG5pbXBvcnQgeyBDb25zdWx0SGlzdG9yeUNvbXBvbmVudCwgQ29uc3VsdEhpc3RvcnlWaWV3Q29tcG9uZW50IH0gZnJvbSBcIi4vY29uc3VsdGhpc3RvcnkuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2RpcmVjdGl2ZXMvc2hhcmVkLm1vZHVsZVwiO1xuaW1wb3J0IHsgUmFkU2lkZU1vZHVsZSB9IGZyb20gXCIuLi9yYWRzaWRlL3JhZHNpZGUubW9kdWxlXCI7XG5pbXBvcnQgeyBEZXBlbmRlbnRNb2R1bGUgfSBmcm9tIFwiLi4vZGVwZW5kZW50L2RlcGVuZGVudC5tb2R1bGVcIjtcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KGNvbnN1bHRoaXN0b3J5Um91dGUpLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgU2hhcmVkTW9kdWxlLFxuICAgIFJhZFNpZGVNb2R1bGUsXG4gICAgRGVwZW5kZW50TW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0NvbnN1bHRIaXN0b3J5Q29tcG9uZW50LCBDb25zdWx0SGlzdG9yeVZpZXdDb21wb25lbnRdLFxuICBzY2hlbWFzOiBbXG4gICAgTk9fRVJST1JTX1NDSEVNQVxuICBdLFxuICBib290c3RyYXA6IFtDb25zdWx0SGlzdG9yeUNvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIENvbnN1bHRIaXN0b3J5TW9kdWxlIHsgfVxuIl19