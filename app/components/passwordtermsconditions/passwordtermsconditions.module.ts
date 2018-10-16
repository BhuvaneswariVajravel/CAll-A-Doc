import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { passwordtermsconditionsRoutes } from "./passwordtermsconditions.routing";
import { PasswordTermsConditionsComponent } from "./passwordtermsconditions.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(passwordtermsconditionsRoutes),
    NativeScriptHttpModule
  ],
  declarations: [PasswordTermsConditionsComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [PasswordTermsConditionsComponent],
})
export class PasswordTermsConditionsModule { }
