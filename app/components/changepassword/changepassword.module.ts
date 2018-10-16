import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { changepasswordRoutes } from "./changepassword.routing";
import { ChangePasswordComponent } from "./changepassword.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(changepasswordRoutes),
    NativeScriptHttpModule
  ],
  declarations: [ChangePasswordComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [ChangePasswordComponent],
})
export class ChangePasswordModule { }
