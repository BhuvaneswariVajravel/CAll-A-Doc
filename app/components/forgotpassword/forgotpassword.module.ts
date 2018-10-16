import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { forgotpasswordRoutes } from "./forgotpassword.routing";
import { ForgotPasswordComponent } from "./forgotpassword.component";
import { ForgotPasswordConfirmComponent } from './forgotpasswordconfirm.component'
import { SharedModule } from "../../shared/directives/shared.module";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(forgotpasswordRoutes),
    NativeScriptHttpModule,
    SharedModule
  ],
  declarations: [ForgotPasswordComponent, ForgotPasswordConfirmComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [ForgotPasswordComponent],
})
export class ForgotPasswordModule { }
