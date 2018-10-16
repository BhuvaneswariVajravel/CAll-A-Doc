import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { DependentComponent } from "./dependent.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule
  ],
  declarations: [
    DependentComponent
  ],
  exports: [DependentComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [DependentComponent],
})
export class DependentModule { }
