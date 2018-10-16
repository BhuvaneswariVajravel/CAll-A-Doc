"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var app_routing_1 = require("./app.routing");
var shared_module_1 = require("./shared/directives/shared.module");
var app_component_1 = require("./app.component");
var login_module_1 = require("./components/login/login.module");
var home_module_1 = require("./components/home/home.module");
var forgotpassword_module_1 = require("./components/forgotpassword/forgotpassword.module");
var activate_module_1 = require("./components/activate/activate.module");
var termsconditions_module_1 = require("./components/termsconditions/termsconditions.module");
var changepassword_module_1 = require("./components/changepassword/changepassword.module");
var passwordtermsconditions_module_1 = require("./components/passwordtermsconditions/passwordtermsconditions.module");
var consulthistory_module_1 = require("./components/consulthistory/consulthistory.module");
var scheduledconsults_module_1 = require("./components/scheduledconsults/scheduledconsults.module");
var healthtools_module_1 = require("./components/healthtools/healthtools.module");
var inbox_module_1 = require("./components/inbox/inbox.module");
var followups_module_1 = require("./components/followups/followups.module");
var profile_module_1 = require("./components/profile/profile.module");
var healthrecords_module_1 = require("./components/healthrecords/healthrecords.module");
var familymembers_module_1 = require("./components/familymembers/familymembers.module");
var videochat_module_1 = require("./components/videochat/videochat.module");
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";
// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";
var AppModule = (function () {
    /*
    Pass your application module to the bootstrapModule function located in main.ts to start your app
    */
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        bootstrap: [
            app_component_1.AppComponent
        ],
        imports: [
            nativescript_module_1.NativeScriptModule,
            app_routing_1.AppRoutingModule,
            shared_module_1.SharedModule,
            login_module_1.LoginModule,
            home_module_1.HomeModule,
            forgotpassword_module_1.ForgotPasswordModule,
            activate_module_1.ActivateModule,
            termsconditions_module_1.TermsConditionsModule,
            changepassword_module_1.ChangePasswordModule,
            passwordtermsconditions_module_1.PasswordTermsConditionsModule,
            consulthistory_module_1.ConsultHistoryModule,
            scheduledconsults_module_1.ScheduledConsultsModule,
            healthtools_module_1.HealthToolsModule,
            inbox_module_1.InboxModule,
            followups_module_1.FollowUpsModule,
            profile_module_1.ProfileModule,
            healthrecords_module_1.HealthRecordsModule,
            familymembers_module_1.FamilyMembersModule,
            videochat_module_1.VideoChatModule
        ],
        declarations: [
            app_component_1.AppComponent
        ],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ]
    })
    /*
    Pass your application module to the bootstrapModule function located in main.ts to start your app
    */
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLDZDQUFpRDtBQUNqRCxtRUFBaUU7QUFDakUsaURBQStDO0FBQy9DLGdFQUE4RDtBQUM5RCw2REFBMkQ7QUFDM0QsMkZBQXlGO0FBQ3pGLHlFQUF1RTtBQUN2RSw4RkFBNEY7QUFDNUYsMkZBQXlGO0FBQ3pGLHNIQUFvSDtBQUNwSCwyRkFBeUY7QUFDekYsb0dBQWtHO0FBQ2xHLGtGQUFnRjtBQUNoRixnRUFBOEQ7QUFDOUQsNEVBQTBFO0FBQzFFLHNFQUFvRTtBQUNwRSx3RkFBc0Y7QUFDdEYsd0ZBQXNGO0FBQ3RGLDRFQUEwRTtBQUcxRSwyRUFBMkU7QUFDM0Usd0VBQXdFO0FBRXhFLDZFQUE2RTtBQUM3RSxzRUFBc0U7QUFxQ3RFLElBQWEsU0FBUztJQUh0Qjs7TUFFRTtJQUNGO0lBT0EsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFQWSxTQUFTO0lBbkNyQixlQUFRLENBQUM7UUFDTixTQUFTLEVBQUU7WUFDUCw0QkFBWTtTQUNmO1FBQ0QsT0FBTyxFQUFFO1lBQ0wsd0NBQWtCO1lBQ2xCLDhCQUFnQjtZQUNoQiw0QkFBWTtZQUNaLDBCQUFXO1lBQ1gsd0JBQVU7WUFDViw0Q0FBb0I7WUFDcEIsZ0NBQWM7WUFDZCw4Q0FBcUI7WUFDckIsNENBQW9CO1lBQ3BCLDhEQUE2QjtZQUM3Qiw0Q0FBb0I7WUFDcEIsa0RBQXVCO1lBQ3ZCLHNDQUFpQjtZQUNqQiwwQkFBVztZQUNYLGtDQUFlO1lBQ2YsOEJBQWE7WUFDYiwwQ0FBbUI7WUFDbkIsMENBQW1CO1lBQ3pCLGtDQUFlO1NBQ1o7UUFDRCxZQUFZLEVBQUU7WUFDViw0QkFBWTtTQUNmO1FBQ0QsT0FBTyxFQUFFO1lBQ0wsdUJBQWdCO1NBQ25CO0tBQ0osQ0FBQztJQUNGOztNQUVFO0dBQ1csU0FBUyxDQU9yQjtBQVBZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSBcIi4vc2hhcmVkL2RpcmVjdGl2ZXMvc2hhcmVkLm1vZHVsZVwiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTG9naW5Nb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2xvZ2luL2xvZ2luLm1vZHVsZVwiO1xuaW1wb3J0IHsgSG9tZU1vZHVsZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvaG9tZS9ob21lLm1vZHVsZVwiO1xuaW1wb3J0IHsgRm9yZ290UGFzc3dvcmRNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2ZvcmdvdHBhc3N3b3JkL2ZvcmdvdHBhc3N3b3JkLm1vZHVsZVwiO1xuaW1wb3J0IHsgQWN0aXZhdGVNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2FjdGl2YXRlL2FjdGl2YXRlLm1vZHVsZVwiO1xuaW1wb3J0IHsgVGVybXNDb25kaXRpb25zTW9kdWxlIH0gZnJvbSBcIi4vY29tcG9uZW50cy90ZXJtc2NvbmRpdGlvbnMvdGVybXNjb25kaXRpb25zLm1vZHVsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUGFzc3dvcmRNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2NoYW5nZXBhc3N3b3JkL2NoYW5nZXBhc3N3b3JkLm1vZHVsZVwiO1xuaW1wb3J0IHsgUGFzc3dvcmRUZXJtc0NvbmRpdGlvbnNNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL3Bhc3N3b3JkdGVybXNjb25kaXRpb25zL3Bhc3N3b3JkdGVybXNjb25kaXRpb25zLm1vZHVsZVwiO1xuaW1wb3J0IHsgQ29uc3VsdEhpc3RvcnlNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnN1bHRoaXN0b3J5L2NvbnN1bHRoaXN0b3J5Lm1vZHVsZVwiO1xuaW1wb3J0IHsgU2NoZWR1bGVkQ29uc3VsdHNNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL3NjaGVkdWxlZGNvbnN1bHRzL3NjaGVkdWxlZGNvbnN1bHRzLm1vZHVsZVwiO1xuaW1wb3J0IHsgSGVhbHRoVG9vbHNNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2hlYWx0aHRvb2xzL2hlYWx0aHRvb2xzLm1vZHVsZVwiO1xuaW1wb3J0IHsgSW5ib3hNb2R1bGUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2luYm94L2luYm94Lm1vZHVsZVwiO1xuaW1wb3J0IHsgRm9sbG93VXBzTW9kdWxlIH0gZnJvbSBcIi4vY29tcG9uZW50cy9mb2xsb3d1cHMvZm9sbG93dXBzLm1vZHVsZVwiO1xuaW1wb3J0IHsgUHJvZmlsZU1vZHVsZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvcHJvZmlsZS9wcm9maWxlLm1vZHVsZVwiO1xuaW1wb3J0IHsgSGVhbHRoUmVjb3Jkc01vZHVsZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvaGVhbHRocmVjb3Jkcy9oZWFsdGhyZWNvcmRzLm1vZHVsZVwiO1xuaW1wb3J0IHsgRmFtaWx5TWVtYmVyc01vZHVsZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvZmFtaWx5bWVtYmVycy9mYW1pbHltZW1iZXJzLm1vZHVsZVwiO1xuaW1wb3J0IHsgVmlkZW9DaGF0TW9kdWxlIH0gZnJvbSBcIi4vY29tcG9uZW50cy92aWRlb2NoYXQvdmlkZW9jaGF0Lm1vZHVsZVwiO1xuXG5cbi8vIFVuY29tbWVudCBhbmQgYWRkIHRvIE5nTW9kdWxlIGltcG9ydHMgaWYgeW91IG5lZWQgdG8gdXNlIHR3by13YXkgYmluZGluZ1xuLy8gaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcblxuLy8gVW5jb21tZW50IGFuZCBhZGQgdG8gTmdNb2R1bGUgaW1wb3J0cyAgaWYgeW91IG5lZWQgdG8gdXNlIHRoZSBIVFRQIHdyYXBwZXJcbi8vIGltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGJvb3RzdHJhcDogW1xuICAgICAgICBBcHBDb21wb25lbnRcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgICAgICBBcHBSb3V0aW5nTW9kdWxlLFxuICAgICAgICBTaGFyZWRNb2R1bGUsXG4gICAgICAgIExvZ2luTW9kdWxlLFxuICAgICAgICBIb21lTW9kdWxlLFxuICAgICAgICBGb3Jnb3RQYXNzd29yZE1vZHVsZSxcbiAgICAgICAgQWN0aXZhdGVNb2R1bGUsXG4gICAgICAgIFRlcm1zQ29uZGl0aW9uc01vZHVsZSxcbiAgICAgICAgQ2hhbmdlUGFzc3dvcmRNb2R1bGUsXG4gICAgICAgIFBhc3N3b3JkVGVybXNDb25kaXRpb25zTW9kdWxlLFxuICAgICAgICBDb25zdWx0SGlzdG9yeU1vZHVsZSxcbiAgICAgICAgU2NoZWR1bGVkQ29uc3VsdHNNb2R1bGUsXG4gICAgICAgIEhlYWx0aFRvb2xzTW9kdWxlLFxuICAgICAgICBJbmJveE1vZHVsZSxcbiAgICAgICAgRm9sbG93VXBzTW9kdWxlLFxuICAgICAgICBQcm9maWxlTW9kdWxlLFxuICAgICAgICBIZWFsdGhSZWNvcmRzTW9kdWxlLFxuICAgICAgICBGYW1pbHlNZW1iZXJzTW9kdWxlLFxuXHRcdFZpZGVvQ2hhdE1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEFwcENvbXBvbmVudFxuICAgIF0sXG4gICAgc2NoZW1hczogW1xuICAgICAgICBOT19FUlJPUlNfU0NIRU1BXG4gICAgXVxufSlcbi8qXG5QYXNzIHlvdXIgYXBwbGljYXRpb24gbW9kdWxlIHRvIHRoZSBib290c3RyYXBNb2R1bGUgZnVuY3Rpb24gbG9jYXRlZCBpbiBtYWluLnRzIHRvIHN0YXJ0IHlvdXIgYXBwXG4qL1xuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IFxuICAgIC8qY29uc3RydWN0b3IoKVxue1xuICAgIHZhciBoZWxwZXIgPSByZXF1aXJlKFwiLi9zZXJ2aWNlLWhlbHBlclwiKTtcbiAgICAgICAgdmFyIHV0aWxzID0gcmVxdWlyZShcInV0aWxzL3V0aWxzXCIpO1xuICAgICAgICBoZWxwZXIuc2V0dXBBbGFybSh1dGlscy5hZC5nZXRBcHBsaWNhdGlvbkNvbnRleHQoKSk7XG59Ki9cbn1cbiJdfQ==