import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { loginRoutes } from "./login.routing";
import { LoginComponent } from "./login.component";
import { SharedModule } from "../../shared/directives/shared.module";
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(loginRoutes),
    NativeScriptHttpModule,
    SharedModule
  ],
  declarations: [LoginComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [LoginComponent],
})
export class LoginModule { }
