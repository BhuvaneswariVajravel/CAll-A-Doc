import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { healthrecordsRoutes } from "./healthrecords.routing";
import { HealthRecordsComponent } from "./healthrecords.component";
import { SharedModule } from "../../shared/directives/shared.module";
import { RadSideModule } from "../radside/radside.module";
import { DependentModule } from "../dependent/dependent.module";
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(healthrecordsRoutes),
    NativeScriptHttpModule,
    RadSideModule,
    SharedModule,
    DependentModule
  ],
  declarations: [HealthRecordsComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [HealthRecordsComponent],
})
export class HealthRecordsModule { }
