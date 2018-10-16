"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var angular_1 = require("nativescript-drop-down/angular");
var home_routing_1 = require("./home.routing");
var home_component_1 = require("./home.component");
var servicetype_component_1 = require("./servicetype.component");
var medicalemergency_component_1 = require("./medicalemergency.component");
var emergencycall_component_1 = require("./emergencycall.component");
var memberdetails_component_1 = require("./memberdetails.component");
var consultationdetails_component_1 = require("./consultationdetails.component");
var scheduletype_component_1 = require("./scheduletype.component");
var healthrecords_component_1 = require("./healthrecords.component");
var pharmacy_component_1 = require("./pharmacy.component");
var searchpharmacy_component_1 = require("./searchpharmacy.component");
var billing_component_1 = require("./billing.component");
var creditcard_component_1 = require("./creditcard.component");
var summary_component_1 = require("./summary.component");
var additionalquestions_component_1 = require("./additionalquestions.component");
var confirmation_component_1 = require("./confirmation.component");
var secureemail_component_1 = require("./secureemail.component");
var shared_module_1 = require("../../shared/directives/shared.module");
var radside_module_1 = require("../radside/radside.module");
var dependent_module_1 = require("../dependent/dependent.module");
var HomeModule = (function () {
    function HomeModule() {
    }
    return HomeModule;
}());
HomeModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(home_routing_1.homeRoutes),
            http_1.NativeScriptHttpModule,
            angular_1.DropDownModule,
            shared_module_1.SharedModule,
            radside_module_1.RadSideModule,
            dependent_module_1.DependentModule
        ],
        declarations: [
            home_component_1.HomeComponent,
            servicetype_component_1.ServiceTypeComponent,
            medicalemergency_component_1.MedicalEmergencyComponent,
            emergencycall_component_1.EmergencyCallComponent,
            memberdetails_component_1.MemberDetailsComponent,
            consultationdetails_component_1.ConsultationDetailsComponent,
            scheduletype_component_1.ScheduleTypeComponent,
            healthrecords_component_1.HealthRecordsComponent,
            pharmacy_component_1.PharmacyComponent,
            searchpharmacy_component_1.SearchPharmacyComponent,
            billing_component_1.BillingComponent,
            creditcard_component_1.CreditCardComponent,
            summary_component_1.SummaryComponent,
            additionalquestions_component_1.AdditionalQuestionsComponent,
            confirmation_component_1.ConfirmationComponent,
            secureemail_component_1.SecureEmailComponent
        ],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [home_component_1.HomeComponent],
    })
], HomeModule);
exports.HomeModule = HomeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdGQUE4RTtBQUU5RSxzQ0FBMkQ7QUFDM0Qsa0RBQW1FO0FBQ25FLHNEQUF1RTtBQUN2RSxvREFBcUU7QUFDckUsMERBQWdFO0FBQ2hFLCtDQUE0QztBQUM1QyxtREFBaUQ7QUFDakQsaUVBQStEO0FBQy9ELDJFQUF5RTtBQUN6RSxxRUFBbUU7QUFDbkUscUVBQW1FO0FBQ25FLGlGQUErRTtBQUMvRSxtRUFBaUU7QUFDakUscUVBQW1FO0FBQ25FLDJEQUF5RDtBQUN6RCx1RUFBcUU7QUFDckUseURBQXVEO0FBQ3ZELCtEQUE2RDtBQUM3RCx5REFBdUQ7QUFDdkQsaUZBQStFO0FBQy9FLG1FQUFpRTtBQUNqRSxpRUFBK0Q7QUFDL0QsdUVBQXFFO0FBQ3JFLDREQUEwRDtBQUMxRCxrRUFBZ0U7QUFvQ2hFLElBQWEsVUFBVTtJQUF2QjtJQUEwQixDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBQTNCLElBQTJCO0FBQWQsVUFBVTtJQW5DdEIsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLHlCQUFVLENBQUM7WUFDNUMsNkJBQXNCO1lBQ3RCLHdCQUFjO1lBQ2QsNEJBQVk7WUFDWiw4QkFBYTtZQUNiLGtDQUFlO1NBQ2hCO1FBQ0QsWUFBWSxFQUFFO1lBQ1osOEJBQWE7WUFDYiw0Q0FBb0I7WUFDcEIsc0RBQXlCO1lBQ3pCLGdEQUFzQjtZQUN0QixnREFBc0I7WUFDdEIsNERBQTRCO1lBQzVCLDhDQUFxQjtZQUNyQixnREFBc0I7WUFDdEIsc0NBQWlCO1lBQ2pCLGtEQUF1QjtZQUN2QixvQ0FBZ0I7WUFDaEIsMENBQW1CO1lBQ25CLG9DQUFnQjtZQUNoQiw0REFBNEI7WUFDNUIsOENBQXFCO1lBQ3JCLDRDQUFvQjtTQUNyQjtRQUNELE9BQU8sRUFBRTtZQUNQLHVCQUFnQjtTQUNqQjtRQUNELFNBQVMsRUFBRSxDQUFDLDhCQUFhLENBQUM7S0FDM0IsQ0FBQztHQUNXLFVBQVUsQ0FBSTtBQUFkLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IERyb3BEb3duTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd24vYW5ndWxhclwiO1xuaW1wb3J0IHsgaG9tZVJvdXRlcyB9IGZyb20gXCIuL2hvbWUucm91dGluZ1wiO1xuaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gXCIuL2hvbWUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZXJ2aWNlVHlwZUNvbXBvbmVudCB9IGZyb20gXCIuL3NlcnZpY2V0eXBlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTWVkaWNhbEVtZXJnZW5jeUNvbXBvbmVudCB9IGZyb20gXCIuL21lZGljYWxlbWVyZ2VuY3kuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFbWVyZ2VuY3lDYWxsQ29tcG9uZW50IH0gZnJvbSBcIi4vZW1lcmdlbmN5Y2FsbC5jb21wb25lbnRcIjtcbmltcG9ydCB7IE1lbWJlckRldGFpbHNDb21wb25lbnQgfSBmcm9tIFwiLi9tZW1iZXJkZXRhaWxzLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29uc3VsdGF0aW9uRGV0YWlsc0NvbXBvbmVudCB9IGZyb20gXCIuL2NvbnN1bHRhdGlvbmRldGFpbHMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTY2hlZHVsZVR5cGVDb21wb25lbnQgfSBmcm9tIFwiLi9zY2hlZHVsZXR5cGUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBIZWFsdGhSZWNvcmRzQ29tcG9uZW50IH0gZnJvbSBcIi4vaGVhbHRocmVjb3Jkcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IFBoYXJtYWN5Q29tcG9uZW50IH0gZnJvbSBcIi4vcGhhcm1hY3kuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZWFyY2hQaGFybWFjeUNvbXBvbmVudCB9IGZyb20gXCIuL3NlYXJjaHBoYXJtYWN5LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQmlsbGluZ0NvbXBvbmVudCB9IGZyb20gXCIuL2JpbGxpbmcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDcmVkaXRDYXJkQ29tcG9uZW50IH0gZnJvbSBcIi4vY3JlZGl0Y2FyZC5jb21wb25lbnRcIjtcbmltcG9ydCB7IFN1bW1hcnlDb21wb25lbnQgfSBmcm9tIFwiLi9zdW1tYXJ5LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQWRkaXRpb25hbFF1ZXN0aW9uc0NvbXBvbmVudCB9IGZyb20gXCIuL2FkZGl0aW9uYWxxdWVzdGlvbnMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb25maXJtYXRpb25Db21wb25lbnQgfSBmcm9tIFwiLi9jb25maXJtYXRpb24uY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZWN1cmVFbWFpbENvbXBvbmVudCB9IGZyb20gXCIuL3NlY3VyZWVtYWlsLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9kaXJlY3RpdmVzL3NoYXJlZC5tb2R1bGVcIjtcbmltcG9ydCB7IFJhZFNpZGVNb2R1bGUgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLm1vZHVsZVwiO1xuaW1wb3J0IHsgRGVwZW5kZW50TW9kdWxlIH0gZnJvbSBcIi4uL2RlcGVuZGVudC9kZXBlbmRlbnQubW9kdWxlXCI7XG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUuZm9yUm9vdChob21lUm91dGVzKSxcbiAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlLFxuICAgIERyb3BEb3duTW9kdWxlLFxuICAgIFNoYXJlZE1vZHVsZSxcbiAgICBSYWRTaWRlTW9kdWxlLFxuICAgIERlcGVuZGVudE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBIb21lQ29tcG9uZW50LFxuICAgIFNlcnZpY2VUeXBlQ29tcG9uZW50LFxuICAgIE1lZGljYWxFbWVyZ2VuY3lDb21wb25lbnQsXG4gICAgRW1lcmdlbmN5Q2FsbENvbXBvbmVudCxcbiAgICBNZW1iZXJEZXRhaWxzQ29tcG9uZW50LFxuICAgIENvbnN1bHRhdGlvbkRldGFpbHNDb21wb25lbnQsXG4gICAgU2NoZWR1bGVUeXBlQ29tcG9uZW50LFxuICAgIEhlYWx0aFJlY29yZHNDb21wb25lbnQsXG4gICAgUGhhcm1hY3lDb21wb25lbnQsXG4gICAgU2VhcmNoUGhhcm1hY3lDb21wb25lbnQsXG4gICAgQmlsbGluZ0NvbXBvbmVudCxcbiAgICBDcmVkaXRDYXJkQ29tcG9uZW50LFxuICAgIFN1bW1hcnlDb21wb25lbnQsXG4gICAgQWRkaXRpb25hbFF1ZXN0aW9uc0NvbXBvbmVudCxcbiAgICBDb25maXJtYXRpb25Db21wb25lbnQsXG4gICAgU2VjdXJlRW1haWxDb21wb25lbnRcbiAgXSxcbiAgc2NoZW1hczogW1xuICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgXSxcbiAgYm9vdHN0cmFwOiBbSG9tZUNvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVNb2R1bGUgeyB9XG4iXX0=