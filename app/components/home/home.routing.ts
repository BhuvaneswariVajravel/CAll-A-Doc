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
export const homeRoutes = [
  { path: 'home', component: HomeComponent },
  { path: 'home1', component: HomeComponent },
  { path: 'servicetype', component: ServiceTypeComponent },
  { path: 'medicalemergency', component: MedicalEmergencyComponent },
  { path: 'emergencycall', component: EmergencyCallComponent },
  { path: 'memberdetails', component: MemberDetailsComponent },
  { path: 'consultationdetails', component: ConsultationDetailsComponent },
  { path: 'scheduletype', component: ScheduleTypeComponent },
  { path: 'healthrecords', component: HealthRecordsComponent },
  { path: 'pharmacy', component: PharmacyComponent },
  { path: 'searchpharmacy', component: SearchPharmacyComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'creditcard', component: CreditCardComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'additionalquestions', component: AdditionalQuestionsComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'secureemail', component: SecureEmailComponent }
];

