import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { videoChatRoutes } from "./videochat.routing";
import { VideoChatComponent } from "./videochat.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forRoot(videoChatRoutes),
    NativeScriptHttpModule
  ],
  declarations: [VideoChatComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [VideoChatComponent],
})
export class VideoChatModule { }
