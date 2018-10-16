import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { SharedModule } from "./shared/directives/shared.module";
import { AppComponent } from "./app.component";
import { LoginModule } from "./components/login/login.module";
import { HomeModule } from "./components/home/home.module";
import { ForgotPasswordModule } from "./components/forgotpassword/forgotpassword.module";
import { ActivateModule } from "./components/activate/activate.module";
import { TermsConditionsModule } from "./components/termsconditions/termsconditions.module";
import { ChangePasswordModule } from "./components/changepassword/changepassword.module";
import { PasswordTermsConditionsModule } from "./components/passwordtermsconditions/passwordtermsconditions.module";
import { ConsultHistoryModule } from "./components/consulthistory/consulthistory.module";
import { ScheduledConsultsModule } from "./components/scheduledconsults/scheduledconsults.module";
import { HealthToolsModule } from "./components/healthtools/healthtools.module";
import { InboxModule } from "./components/inbox/inbox.module";
import { FollowUpsModule } from "./components/followups/followups.module";
import { ProfileModule } from "./components/profile/profile.module";
import { HealthRecordsModule } from "./components/healthrecords/healthrecords.module";
import { FamilyMembersModule } from "./components/familymembers/familymembers.module";
import { VideoChatModule } from "./components/videochat/videochat.module";


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        SharedModule,
        LoginModule,
        HomeModule,
        ForgotPasswordModule,
        ActivateModule,
        TermsConditionsModule,
        ChangePasswordModule,
        PasswordTermsConditionsModule,
        ConsultHistoryModule,
        ScheduledConsultsModule,
        HealthToolsModule,
        InboxModule,
        FollowUpsModule,
        ProfileModule,
        HealthRecordsModule,
        FamilyMembersModule,
		VideoChatModule
    ],
    declarations: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { 
    /*constructor()
{
    var helper = require("./service-helper");
        var utils = require("utils/utils");
        helper.setupAlarm(utils.ad.getApplicationContext());
}*/
}
