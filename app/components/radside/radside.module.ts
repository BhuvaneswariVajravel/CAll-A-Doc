import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
import { RadSideComponent } from "./radside.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptUISideDrawerModule
  ],
  declarations: [
    RadSideComponent
  ],
  exports: [RadSideComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [RadSideComponent],
})
export class RadSideModule { }
