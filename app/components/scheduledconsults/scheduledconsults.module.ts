import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { scheduledconsultsRoute } from "./scheduledconsults.routing";
import { ScheduledConsultsComponent, ScheduledConsultsViewComponent } from "./scheduledconsults.component";
import { SharedModule } from "../../shared/directives/shared.module";
import { RadSideModule } from "../radside/radside.module";
import { DependentModule } from "../dependent/dependent.module";
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(scheduledconsultsRoute),
    NativeScriptHttpModule,
    SharedModule,
    RadSideModule,
    DependentModule
  ],
  declarations: [ScheduledConsultsComponent, ScheduledConsultsViewComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [ScheduledConsultsComponent],
})
export class ScheduledConsultsModule { }
