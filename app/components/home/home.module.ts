import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { DropDownModule } from "nativescript-drop-down/angular";
import { homeRoutes } from "./home.routing";
import { HomeComponent } from "./home.component";
import { ServiceTypeComponent } from "./servicetype.component";
import { MedicalEmergencyComponent } from "./medicalemergency.component";
import { EmergencyCallComponent } from "./emergencycall.component";
import { MemberDetailsComponent } from "./memberdetails.component";
import { ConsultationDetailsComponent } from "./consultationdetails.component";
import { ScheduleTypeComponent } from "./scheduletype.component";
import { HealthRecordsComponent } from "./healthrecords.component";
import { PharmacyComponent } from "./pharmacy.component";
import { SearchPharmacyComponent } from "./searchpharmacy.component";
import { BillingComponent } from "./billing.component";
import { CreditCardComponent } from "./creditcard.component";
import { SummaryComponent } from "./summary.component";
import { AdditionalQuestionsComponent } from "./additionalquestions.component";
import { ConfirmationComponent } from "./confirmation.component";
import { SecureEmailComponent } from "./secureemail.component";
import { SharedModule } from "../../shared/directives/shared.module";
import { RadSideModule } from "../radside/radside.module";
import { DependentModule } from "../dependent/dependent.module";
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(homeRoutes),
    NativeScriptHttpModule,
    DropDownModule,
    SharedModule,
    RadSideModule,
    DependentModule
  ],
  declarations: [
    HomeComponent,
    ServiceTypeComponent,
    MedicalEmergencyComponent,
    EmergencyCallComponent,
    MemberDetailsComponent,
    ConsultationDetailsComponent,
    ScheduleTypeComponent,
    HealthRecordsComponent,
    PharmacyComponent,
    SearchPharmacyComponent,
    BillingComponent,
    CreditCardComponent,
    SummaryComponent,
    AdditionalQuestionsComponent,
    ConfirmationComponent,
    SecureEmailComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [HomeComponent],
})
export class HomeModule { }
