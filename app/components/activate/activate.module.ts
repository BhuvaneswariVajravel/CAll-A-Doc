import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { activateRoutes } from "./activate.routing";
import { ActivateComponent } from "./activate.component";
import { OrderconfirmationComponent } from "./orderconfirmation.component";
import { SharedModule } from "../../shared/directives/shared.module";
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(activateRoutes),
    NativeScriptHttpModule,
    SharedModule
  ],
  declarations: [ActivateComponent, OrderconfirmationComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [ActivateComponent],
})
export class ActivateModule { }
