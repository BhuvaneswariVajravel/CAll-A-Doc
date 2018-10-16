import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { inboxRoutes } from "./inbox.routing";
import { InboxComponent } from "./inbox.component";
import { InboxviewComponent } from "./inboxview.component";
import { SharedModule } from "../../shared/directives/shared.module";
import { RadSideModule } from "../radside/radside.module";
import { DependentModule } from "../dependent/dependent.module";
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(inboxRoutes),
    NativeScriptHttpModule,
    SharedModule,
    RadSideModule,
    DependentModule
  ],
  declarations: [InboxComponent, InboxviewComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [InboxComponent],
})
export class InboxModule { }
