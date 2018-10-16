"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var healthrecords_routing_1 = require("./healthrecords.routing");
var healthrecords_component_1 = require("./healthrecords.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var HealthRecordsModule = (function () {
    function HealthRecordsModule() {
    }
    return HealthRecordsModule;
}());
HealthRecordsModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(healthrecords_routing_1.healthrecordsRoutes),
            http_1.NativeScriptHttpModule,
            radside_module_1.RadSideModule,
            shared_module_1.SharedModule,
            dependent_module_1.DependentModule
        ],
        declarations: [healthrecords_component_1.HealthRecordsComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [healthrecords_component_1.HealthRecordsComponent],
    })
], HealthRecordsModule);
exports.HealthRecordsModule = HealthRecordsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRocmVjb3Jkcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoZWFsdGhyZWNvcmRzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdGQUE4RTtBQUU5RSxzQ0FBMkQ7QUFDM0Qsa0RBQW1FO0FBQ25FLHNEQUF1RTtBQUN2RSxvREFBcUU7QUFDckUsaUVBQThEO0FBQzlELHFFQUFtRTtBQUNuRSx1RUFBcUU7QUFDckUsNERBQTBEO0FBQzFELGtFQUFnRTtBQWtCaEUsSUFBYSxtQkFBbUI7SUFBaEM7SUFBbUMsQ0FBQztJQUFELDBCQUFDO0FBQUQsQ0FBQyxBQUFwQyxJQUFvQztBQUF2QixtQkFBbUI7SUFqQi9CLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRTtZQUNQLHdDQUFrQjtZQUNsQixpQ0FBd0I7WUFDeEIsK0JBQXVCO1lBQ3ZCLGlDQUF3QixDQUFDLE9BQU8sQ0FBQywyQ0FBbUIsQ0FBQztZQUNyRCw2QkFBc0I7WUFDdEIsOEJBQWE7WUFDYiw0QkFBWTtZQUNaLGtDQUFlO1NBQ2hCO1FBQ0QsWUFBWSxFQUFFLENBQUMsZ0RBQXNCLENBQUM7UUFDdEMsT0FBTyxFQUFFO1lBQ1AsdUJBQWdCO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFLENBQUMsZ0RBQXNCLENBQUM7S0FDcEMsQ0FBQztHQUNXLG1CQUFtQixDQUFJO0FBQXZCLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvbkVuZCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBoZWFsdGhyZWNvcmRzUm91dGVzIH0gZnJvbSBcIi4vaGVhbHRocmVjb3Jkcy5yb3V0aW5nXCI7XG5pbXBvcnQgeyBIZWFsdGhSZWNvcmRzQ29tcG9uZW50IH0gZnJvbSBcIi4vaGVhbHRocmVjb3Jkcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNoYXJlZE1vZHVsZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvZGlyZWN0aXZlcy9zaGFyZWQubW9kdWxlXCI7XG5pbXBvcnQgeyBSYWRTaWRlTW9kdWxlIH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5tb2R1bGVcIjtcbmltcG9ydCB7IERlcGVuZGVudE1vZHVsZSB9IGZyb20gXCIuLi9kZXBlbmRlbnQvZGVwZW5kZW50Lm1vZHVsZVwiO1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3QoaGVhbHRocmVjb3Jkc1JvdXRlcyksXG4gICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcbiAgICBSYWRTaWRlTW9kdWxlLFxuICAgIFNoYXJlZE1vZHVsZSxcbiAgICBEZXBlbmRlbnRNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbSGVhbHRoUmVjb3Jkc0NvbXBvbmVudF0sXG4gIHNjaGVtYXM6IFtcbiAgICBOT19FUlJPUlNfU0NIRU1BXG4gIF0sXG4gIGJvb3RzdHJhcDogW0hlYWx0aFJlY29yZHNDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBIZWFsdGhSZWNvcmRzTW9kdWxlIHsgfVxuIl19