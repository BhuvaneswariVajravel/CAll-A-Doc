"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.homeRoutes = [
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'home1', component: home_component_1.HomeComponent },
    { path: 'servicetype', component: servicetype_component_1.ServiceTypeComponent },
    { path: 'medicalemergency', component: medicalemergency_component_1.MedicalEmergencyComponent },
    { path: 'emergencycall', component: emergencycall_component_1.EmergencyCallComponent },
    { path: 'memberdetails', component: memberdetails_component_1.MemberDetailsComponent },
    { path: 'consultationdetails', component: consultationdetails_component_1.ConsultationDetailsComponent },
    { path: 'scheduletype', component: scheduletype_component_1.ScheduleTypeComponent },
    { path: 'healthrecords', component: healthrecords_component_1.HealthRecordsComponent },
    { path: 'pharmacy', component: pharmacy_component_1.PharmacyComponent },
    { path: 'searchpharmacy', component: searchpharmacy_component_1.SearchPharmacyComponent },
    { path: 'billing', component: billing_component_1.BillingComponent },
    { path: 'creditcard', component: creditcard_component_1.CreditCardComponent },
    { path: 'summary', component: summary_component_1.SummaryComponent },
    { path: 'additionalquestions', component: additionalquestions_component_1.AdditionalQuestionsComponent },
    { path: 'confirmation', component: confirmation_component_1.ConfirmationComponent },
    { path: 'secureemail', component: secureemail_component_1.SecureEmailComponent }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5yb3V0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaG9tZS5yb3V0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQWlEO0FBQ2pELGlFQUErRDtBQUMvRCwyRUFBeUU7QUFDekUscUVBQW1FO0FBQ25FLHFFQUFtRTtBQUNuRSxpRkFBK0U7QUFDL0UsbUVBQWlFO0FBQ2pFLHFFQUFtRTtBQUNuRSwyREFBeUQ7QUFDekQsdUVBQXFFO0FBQ3JFLHlEQUF1RDtBQUN2RCwrREFBNkQ7QUFDN0QseURBQXVEO0FBQ3ZELGlGQUErRTtBQUMvRSxtRUFBaUU7QUFDakUsaUVBQStEO0FBQ2xELFFBQUEsVUFBVSxHQUFHO0lBQ3hCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsOEJBQWEsRUFBRTtJQUMxQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLDhCQUFhLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSw0Q0FBb0IsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsc0RBQXlCLEVBQUU7SUFDbEUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxnREFBc0IsRUFBRTtJQUM1RCxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLGdEQUFzQixFQUFFO0lBQzVELEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLFNBQVMsRUFBRSw0REFBNEIsRUFBRTtJQUN4RSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLDhDQUFxQixFQUFFO0lBQzFELEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsZ0RBQXNCLEVBQUU7SUFDNUQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxzQ0FBaUIsRUFBRTtJQUNsRCxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsa0RBQXVCLEVBQUU7SUFDOUQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxvQ0FBZ0IsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLDBDQUFtQixFQUFFO0lBQ3RELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsb0NBQWdCLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsU0FBUyxFQUFFLDREQUE0QixFQUFFO0lBQ3hFLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsOENBQXFCLEVBQUU7SUFDMUQsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSw0Q0FBb0IsRUFBRTtDQUN6RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gXCIuL2hvbWUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZXJ2aWNlVHlwZUNvbXBvbmVudCB9IGZyb20gXCIuL3NlcnZpY2V0eXBlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTWVkaWNhbEVtZXJnZW5jeUNvbXBvbmVudCB9IGZyb20gXCIuL21lZGljYWxlbWVyZ2VuY3kuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFbWVyZ2VuY3lDYWxsQ29tcG9uZW50IH0gZnJvbSBcIi4vZW1lcmdlbmN5Y2FsbC5jb21wb25lbnRcIjtcbmltcG9ydCB7IE1lbWJlckRldGFpbHNDb21wb25lbnQgfSBmcm9tIFwiLi9tZW1iZXJkZXRhaWxzLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29uc3VsdGF0aW9uRGV0YWlsc0NvbXBvbmVudCB9IGZyb20gXCIuL2NvbnN1bHRhdGlvbmRldGFpbHMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTY2hlZHVsZVR5cGVDb21wb25lbnQgfSBmcm9tIFwiLi9zY2hlZHVsZXR5cGUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBIZWFsdGhSZWNvcmRzQ29tcG9uZW50IH0gZnJvbSBcIi4vaGVhbHRocmVjb3Jkcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IFBoYXJtYWN5Q29tcG9uZW50IH0gZnJvbSBcIi4vcGhhcm1hY3kuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZWFyY2hQaGFybWFjeUNvbXBvbmVudCB9IGZyb20gXCIuL3NlYXJjaHBoYXJtYWN5LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQmlsbGluZ0NvbXBvbmVudCB9IGZyb20gXCIuL2JpbGxpbmcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDcmVkaXRDYXJkQ29tcG9uZW50IH0gZnJvbSBcIi4vY3JlZGl0Y2FyZC5jb21wb25lbnRcIjtcbmltcG9ydCB7IFN1bW1hcnlDb21wb25lbnQgfSBmcm9tIFwiLi9zdW1tYXJ5LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQWRkaXRpb25hbFF1ZXN0aW9uc0NvbXBvbmVudCB9IGZyb20gXCIuL2FkZGl0aW9uYWxxdWVzdGlvbnMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb25maXJtYXRpb25Db21wb25lbnQgfSBmcm9tIFwiLi9jb25maXJtYXRpb24uY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZWN1cmVFbWFpbENvbXBvbmVudCB9IGZyb20gXCIuL3NlY3VyZWVtYWlsLmNvbXBvbmVudFwiO1xuZXhwb3J0IGNvbnN0IGhvbWVSb3V0ZXMgPSBbXG4gIHsgcGF0aDogJ2hvbWUnLCBjb21wb25lbnQ6IEhvbWVDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnaG9tZTEnLCBjb21wb25lbnQ6IEhvbWVDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnc2VydmljZXR5cGUnLCBjb21wb25lbnQ6IFNlcnZpY2VUeXBlQ29tcG9uZW50IH0sXG4gIHsgcGF0aDogJ21lZGljYWxlbWVyZ2VuY3knLCBjb21wb25lbnQ6IE1lZGljYWxFbWVyZ2VuY3lDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnZW1lcmdlbmN5Y2FsbCcsIGNvbXBvbmVudDogRW1lcmdlbmN5Q2FsbENvbXBvbmVudCB9LFxuICB7IHBhdGg6ICdtZW1iZXJkZXRhaWxzJywgY29tcG9uZW50OiBNZW1iZXJEZXRhaWxzQ29tcG9uZW50IH0sXG4gIHsgcGF0aDogJ2NvbnN1bHRhdGlvbmRldGFpbHMnLCBjb21wb25lbnQ6IENvbnN1bHRhdGlvbkRldGFpbHNDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnc2NoZWR1bGV0eXBlJywgY29tcG9uZW50OiBTY2hlZHVsZVR5cGVDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnaGVhbHRocmVjb3JkcycsIGNvbXBvbmVudDogSGVhbHRoUmVjb3Jkc0NvbXBvbmVudCB9LFxuICB7IHBhdGg6ICdwaGFybWFjeScsIGNvbXBvbmVudDogUGhhcm1hY3lDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnc2VhcmNocGhhcm1hY3knLCBjb21wb25lbnQ6IFNlYXJjaFBoYXJtYWN5Q29tcG9uZW50IH0sXG4gIHsgcGF0aDogJ2JpbGxpbmcnLCBjb21wb25lbnQ6IEJpbGxpbmdDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnY3JlZGl0Y2FyZCcsIGNvbXBvbmVudDogQ3JlZGl0Q2FyZENvbXBvbmVudCB9LFxuICB7IHBhdGg6ICdzdW1tYXJ5JywgY29tcG9uZW50OiBTdW1tYXJ5Q29tcG9uZW50IH0sXG4gIHsgcGF0aDogJ2FkZGl0aW9uYWxxdWVzdGlvbnMnLCBjb21wb25lbnQ6IEFkZGl0aW9uYWxRdWVzdGlvbnNDb21wb25lbnQgfSxcbiAgeyBwYXRoOiAnY29uZmlybWF0aW9uJywgY29tcG9uZW50OiBDb25maXJtYXRpb25Db21wb25lbnQgfSxcbiAgeyBwYXRoOiAnc2VjdXJlZW1haWwnLCBjb21wb25lbnQ6IFNlY3VyZUVtYWlsQ29tcG9uZW50IH1cbl07XG5cbiJdfQ==