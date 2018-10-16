import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { termsconditionsRoutes } from "./termsconditions.routing";
import { TermsConditionsComponent } from "./termsconditions.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(termsconditionsRoutes),
    NativeScriptHttpModule
  ],
  declarations: [TermsConditionsComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [TermsConditionsComponent],
})
export class TermsConditionsModule { }
