import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { familymembersRoutes } from "./familymembers.routing";
import { FamilyMembersComponent, AddmembersComponent } from "./familymembers.component";
import { SharedModule } from "../../shared/directives/shared.module";
import { RadSideModule } from "../radside/radside.module";
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(familymembersRoutes),
    NativeScriptHttpModule,
    SharedModule,
    RadSideModule    
  ],
  declarations: [FamilyMembersComponent, AddmembersComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [FamilyMembersComponent],
})
export class FamilyMembersModule { }
