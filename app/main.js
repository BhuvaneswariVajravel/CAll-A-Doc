"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this import should be first in order to load some required settings (like globals and reflect-metadata)
var platform_1 = require("nativescript-angular/platform");
var http_1 = require("@angular/http");
var app_module_1 = require("./app.module");
var ApplicationSettings = require("application-settings");
var connectivity = require("tns-core-modules/connectivity");
//import { Frame } from "ui/frame";
//import * as frameModule from "tns-core-modules/ui/frame";
// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page. 
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers. 
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object, platformNativeScriptDynamic, 
// that sets up a NativeScript application and can bootstrap the Angular framework.
/*Frame.defaultAnimatedNavigation = {
  name: "slide",
  duration: 500,
  curve: "linear"
};*/
/*frameModule.Frame.defaultTransition = {
  name: "slide",
  duration: 300,
  curve: "easeIn"
};
console.log("testtttttttttttttttt");*/
ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
var application = require("application");
application.on(application.uncaughtErrorEvent, function (args) {
    console.log("---------------CRASH-----------------------------------------");
    if (args.android) {
        // For Android applications, args.android is an NativeScriptError.
        console.log("NativeScriptError: " + args.android);
    }
    else if (args.ios) {
        // For iOS applications, args.ios is NativeScriptError.
        console.log("NativeScriptError: " + args.ios);
    }
});
application.on(application.suspendEvent, function (args) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
        console.log("Activity: suspendEvent" + args.android);
    }
    else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: suspendEvent" + args.ios);
    }
});
application.on(application.resumeEvent, function (args) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        console.log("Activity: resumeEvent" + args.android);
        refreshAgain();
    }
    else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: resumeEvent" + args.ios);
        refreshAgain();
    }
});
application.on(application.exitEvent, function (args) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        console.log("Activity: exitEvent" + args.android);
    }
    else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: exitEvent" + args.ios);
    }
});
var usr, key;
var http_request = require("http");
var xml2js = require('nativescript-xml2js');
var expiresAt;
connectivity.startMonitoring(function onConnectionTypeChanged(newConnectionType) {
    switch (newConnectionType) {
        case connectivity.connectionType.none:
            //console.log("Connection type changed to none.");
            break;
        case connectivity.connectionType.wifi:
            //console.log("Connection type changed to WiFi.");
            refreshAgain();
            break;
        case connectivity.connectionType.mobile:
            refreshAgain();
            //console.log("Connection type changed to mobile.");
            break;
    }
});
setInterval(function () {
    ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
    refreshAgain();
}, 36000000);
setInterval(function () {
    ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
    refreshAgain();
}, 3.96e+7); //
// For Http POST method - To convert application/json to application/x-www-form-urlencoded format
function refreshAgain() {
    console.log("New Key........");
    if (ApplicationSettings.hasKey("LOGIN_CRD")) {
        usr = JSON.parse(ApplicationSettings.getString("LOGIN_CRD"));
        key = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).Key;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        var input = { Key: key, UserType: "Member", LoginName: usr.username, Password: usr.password };
        var body = JsonToFormEncoded(input);
        http_request.request({
            url: "https://www.247calladoc.com/WebServices/API_Security.asmx/RefreshKey",
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            content: JsonToFormEncoded(input)
        }).then(function (response) {
            xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
                //console.log(JSON.stringify(result));
                if (result.APIResult_KeyRefresh.Successful == "true") {
                    console.log("success       " + result.APIResult_KeyRefresh.ExpiresAt);
                    var k = result.APIResult_KeyRefresh.Key;
                    var s = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
                    s.Key = k;
                    ApplicationSettings.setString("USER_DEFAULTS", JSON.stringify(s));
                }
                else {
                    console.log(JSON.stringify(result));
                    console.log("Error occurred in refresh key in main.ts");
                }
            });
        }, function (e) {
            console.log("Error occurred in refresh key" + e);
        });
    }
}
function JsonToFormEncoded(details) {
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
}
platform_1.platformNativeScriptDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwR0FBMEc7QUFDMUcsMERBQTRFO0FBQzVFLHNDQUF3RTtBQUN4RSwyQ0FBeUM7QUFDekMsMERBQTREO0FBRTVELDREQUE4RDtBQUU5RCxtQ0FBbUM7QUFDbkMsMkRBQTJEO0FBRTNELHlKQUF5SjtBQUN6Siw4SEFBOEg7QUFDOUgsZ0pBQWdKO0FBQ2hKLG1GQUFtRjtBQUNuRjs7OztJQUlJO0FBQ0o7Ozs7O3NDQUtzQztBQUN0QyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNwRCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDekMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxJQUFJO0lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0RBQStELENBQUMsQ0FBQztJQUM3RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNmLGtFQUFrRTtRQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLHVEQUF1RDtRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsRCxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDSCxXQUFXLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxJQUFJO0lBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2YsdUVBQXVFO1FBQ3ZFLG1C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QyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0QsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNwQixDQUFDO0FBQ0Qsc0NBQTJCLEVBQUUsQ0FBQyxlQUFlLENBQUMsc0JBQVMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdGhpcyBpbXBvcnQgc2hvdWxkIGJlIGZpcnN0IGluIG9yZGVyIHRvIGxvYWQgc29tZSByZXF1aXJlZCBzZXR0aW5ncyAobGlrZSBnbG9iYWxzIGFuZCByZWZsZWN0LW1ldGFkYXRhKVxuaW1wb3J0IHsgcGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3BsYXRmb3JtXCI7XG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9ucywgUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9odHRwJztcbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuL2FwcC5tb2R1bGVcIjtcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0ICogYXMgY29ubmVjdGl2aXR5IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2Nvbm5lY3Rpdml0eVwiO1xuXG4vL2ltcG9ydCB7IEZyYW1lIH0gZnJvbSBcInVpL2ZyYW1lXCI7XG4vL2ltcG9ydCAqIGFzIGZyYW1lTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lXCI7XG5cbi8vIEEgdHJhZGl0aW9uYWwgTmF0aXZlU2NyaXB0IGFwcGxpY2F0aW9uIHN0YXJ0cyBieSBpbml0aWFsaXppbmcgZ2xvYmFsIG9iamVjdHMsIHNldHRpbmcgdXAgZ2xvYmFsIENTUyBydWxlcywgY3JlYXRpbmcsIGFuZCBuYXZpZ2F0aW5nIHRvIHRoZSBtYWluIHBhZ2UuIFxuLy8gQW5ndWxhciBhcHBsaWNhdGlvbnMgbmVlZCB0byB0YWtlIGNhcmUgb2YgdGhlaXIgb3duIGluaXRpYWxpemF0aW9uOiBtb2R1bGVzLCBjb21wb25lbnRzLCBkaXJlY3RpdmVzLCByb3V0ZXMsIERJIHByb3ZpZGVycy4gXG4vLyBBIE5hdGl2ZVNjcmlwdCBBbmd1bGFyIGFwcCBuZWVkcyB0byBtYWtlIGJvdGggcGFyYWRpZ21zIHdvcmsgdG9nZXRoZXIsIHNvIHdlIHByb3ZpZGUgYSB3cmFwcGVyIHBsYXRmb3JtIG9iamVjdCwgcGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljLCBcbi8vIHRoYXQgc2V0cyB1cCBhIE5hdGl2ZVNjcmlwdCBhcHBsaWNhdGlvbiBhbmQgY2FuIGJvb3RzdHJhcCB0aGUgQW5ndWxhciBmcmFtZXdvcmsuXG4vKkZyYW1lLmRlZmF1bHRBbmltYXRlZE5hdmlnYXRpb24gPSB7XG4gIG5hbWU6IFwic2xpZGVcIixcbiAgZHVyYXRpb246IDUwMCxcbiAgY3VydmU6IFwibGluZWFyXCJcbn07Ki9cbi8qZnJhbWVNb2R1bGUuRnJhbWUuZGVmYXVsdFRyYW5zaXRpb24gPSB7XG4gIG5hbWU6IFwic2xpZGVcIixcbiAgZHVyYXRpb246IDMwMCxcbiAgY3VydmU6IFwiZWFzZUluXCJcbn07XG5jb25zb2xlLmxvZyhcInRlc3R0dHR0dHR0dHR0dHR0dHR0XCIpOyovXG5BcHBsaWNhdGlvblNldHRpbmdzLnJlbW92ZShcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKTtcbnZhciBhcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCJhcHBsaWNhdGlvblwiKTtcbmFwcGxpY2F0aW9uLm9uKGFwcGxpY2F0aW9uLnVuY2F1Z2h0RXJyb3JFdmVudCwgZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLUNSQVNILS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xuICAgICAgICAvLyBGb3IgQW5kcm9pZCBhcHBsaWNhdGlvbnMsIGFyZ3MuYW5kcm9pZCBpcyBhbiBOYXRpdmVTY3JpcHRFcnJvci5cbiAgICAgICAgY29uc29sZS5sb2coXCJOYXRpdmVTY3JpcHRFcnJvcjogXCIgKyBhcmdzLmFuZHJvaWQpO1xuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcbiAgICAgICAgLy8gRm9yIGlPUyBhcHBsaWNhdGlvbnMsIGFyZ3MuaW9zIGlzIE5hdGl2ZVNjcmlwdEVycm9yLlxuICAgICAgICBjb25zb2xlLmxvZyhcIk5hdGl2ZVNjcmlwdEVycm9yOiBcIiArIGFyZ3MuaW9zKTtcbiAgICB9XG59KTtcbmFwcGxpY2F0aW9uLm9uKGFwcGxpY2F0aW9uLnN1c3BlbmRFdmVudCwgZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQgYWN0aXZpdHkgY2xhc3MuXG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3MucmVtb3ZlKFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGl2aXR5OiBzdXNwZW5kRXZlbnRcIiArIGFyZ3MuYW5kcm9pZCk7XG5cbiAgICB9IGVsc2UgaWYgKGFyZ3MuaW9zKSB7XG4gICAgICAgIC8vIEZvciBpT1MgYXBwbGljYXRpb25zLCBhcmdzLmlvcyBpcyBVSUFwcGxpY2F0aW9uLlxuICAgICAgICBjb25zb2xlLmxvZyhcIlVJQXBwbGljYXRpb246IHN1c3BlbmRFdmVudFwiICsgYXJncy5pb3MpO1xuICAgIH1cbn0pO1xuXG5hcHBsaWNhdGlvbi5vbihhcHBsaWNhdGlvbi5yZXN1bWVFdmVudCwgZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQgYWN0aXZpdHkgY2xhc3MuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aXZpdHk6IHJlc3VtZUV2ZW50XCIgKyBhcmdzLmFuZHJvaWQpO1xuICAgICAgICByZWZyZXNoQWdhaW4oKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3MuaW9zKSB7XG4gICAgICAgIC8vIEZvciBpT1MgYXBwbGljYXRpb25zLCBhcmdzLmlvcyBpcyBVSUFwcGxpY2F0aW9uLlxuICAgICAgICBjb25zb2xlLmxvZyhcIlVJQXBwbGljYXRpb246IHJlc3VtZUV2ZW50XCIgKyBhcmdzLmlvcyk7XG4gICAgICAgIHJlZnJlc2hBZ2FpbigpO1xuICAgIH1cbn0pO1xuXG5hcHBsaWNhdGlvbi5vbihhcHBsaWNhdGlvbi5leGl0RXZlbnQsIGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xuICAgICAgICAvLyBGb3IgQW5kcm9pZCBhcHBsaWNhdGlvbnMsIGFyZ3MuYW5kcm9pZCBpcyBhbiBhbmRyb2lkIGFjdGl2aXR5IGNsYXNzLlxuICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGl2aXR5OiBleGl0RXZlbnRcIiArIGFyZ3MuYW5kcm9pZCk7XG4gICAgfSBlbHNlIGlmIChhcmdzLmlvcykge1xuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgVUlBcHBsaWNhdGlvbi5cbiAgICAgICAgY29uc29sZS5sb2coXCJVSUFwcGxpY2F0aW9uOiBleGl0RXZlbnRcIiArIGFyZ3MuaW9zKTtcbiAgICB9XG59KTtcbmxldCB1c3I6IGFueSwga2V5OiBzdHJpbmc7XG5sZXQgaHR0cF9yZXF1ZXN0ID0gcmVxdWlyZShcImh0dHBcIik7XG5sZXQgeG1sMmpzID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXhtbDJqcycpO1xubGV0IGV4cGlyZXNBdDogYW55XG5jb25uZWN0aXZpdHkuc3RhcnRNb25pdG9yaW5nKGZ1bmN0aW9uIG9uQ29ubmVjdGlvblR5cGVDaGFuZ2VkKG5ld0Nvbm5lY3Rpb25UeXBlOiBudW1iZXIpIHtcbiAgICBzd2l0Y2ggKG5ld0Nvbm5lY3Rpb25UeXBlKSB7XG4gICAgICAgIGNhc2UgY29ubmVjdGl2aXR5LmNvbm5lY3Rpb25UeXBlLm5vbmU6XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiB0eXBlIGNoYW5nZWQgdG8gbm9uZS5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBjb25uZWN0aXZpdHkuY29ubmVjdGlvblR5cGUud2lmaTpcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJDb25uZWN0aW9uIHR5cGUgY2hhbmdlZCB0byBXaUZpLlwiKTtcbiAgICAgICAgICAgIHJlZnJlc2hBZ2FpbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgY29ubmVjdGl2aXR5LmNvbm5lY3Rpb25UeXBlLm1vYmlsZTpcbiAgICAgICAgICAgIHJlZnJlc2hBZ2FpbigpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gdHlwZSBjaGFuZ2VkIHRvIG1vYmlsZS5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcbnNldEludGVydmFsKCgpID0+IHtcbiAgICBBcHBsaWNhdGlvblNldHRpbmdzLnJlbW92ZShcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKTtcbiAgICByZWZyZXNoQWdhaW4oKTtcbn0sIDM2MDAwMDAwKTtcbnNldEludGVydmFsKCgpID0+IHtcbiAgICBBcHBsaWNhdGlvblNldHRpbmdzLnJlbW92ZShcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKTtcbiAgICByZWZyZXNoQWdhaW4oKTtcbn0sIDMuOTZlKzcpOy8vXG4vLyBGb3IgSHR0cCBQT1NUIG1ldGhvZCAtIFRvIGNvbnZlcnQgYXBwbGljYXRpb24vanNvbiB0byBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQgZm9ybWF0XG5mdW5jdGlvbiByZWZyZXNoQWdhaW4oKSB7XG4gICAgY29uc29sZS5sb2coXCJOZXcgS2V5Li4uLi4uLi5cIik7XG4gICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiTE9HSU5fQ1JEXCIpKSB7XG4gICAgICAgIHVzciA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJMT0dJTl9DUkRcIikpO1xuICAgICAgICBrZXkgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUl9ERUZBVUxUU1wiKSkuS2V5O1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBsZXQgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgICAgIGxldCBpbnB1dCA9IHsgS2V5OiBrZXksIFVzZXJUeXBlOiBcIk1lbWJlclwiLCBMb2dpbk5hbWU6IHVzci51c2VybmFtZSwgUGFzc3dvcmQ6IHVzci5wYXNzd29yZCB9O1xuICAgICAgICBsZXQgYm9keSA9IEpzb25Ub0Zvcm1FbmNvZGVkKGlucHV0KVxuICAgICAgICBodHRwX3JlcXVlc3QucmVxdWVzdCh7XG4gICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly93d3cuMjQ3Y2FsbGFkb2MuY29tL1dlYlNlcnZpY2VzL0FQSV9TZWN1cml0eS5hc214L1JlZnJlc2hLZXlcIixcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAgICAgY29udGVudDogSnNvblRvRm9ybUVuY29kZWQoaW5wdXQpXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcocmVzcG9uc2UuY29udGVudCwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0tleVJlZnJlc2guU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgICAgICAgXCIgKyByZXN1bHQuQVBJUmVzdWx0X0tleVJlZnJlc2guRXhwaXJlc0F0KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSByZXN1bHQuQVBJUmVzdWx0X0tleVJlZnJlc2guS2V5O1xuICAgICAgICAgICAgICAgICAgICBsZXQgcyA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSX0RFRkFVTFRTXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgcy5LZXkgPSBrO1xuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcIlVTRVJfREVGQVVMVFNcIiwgSlNPTi5zdHJpbmdpZnkocykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VycmVkIGluIHJlZnJlc2gga2V5IGluIG1haW4udHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VycmVkIGluIHJlZnJlc2gga2V5XCIgKyBlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gSnNvblRvRm9ybUVuY29kZWQoZGV0YWlscykge1xuICAgIGxldCBmb3JtQm9keTogYW55ID0gW107XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGV0YWlscykge1xuICAgICAgICB2YXIgZW5jb2RlZEtleSA9IGVuY29kZVVSSUNvbXBvbmVudChwcm9wZXJ0eSk7XG4gICAgICAgIHZhciBlbmNvZGVkVmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoZGV0YWlsc1twcm9wZXJ0eV0pO1xuICAgICAgICBmb3JtQm9keS5wdXNoKGVuY29kZWRLZXkgKyBcIj1cIiArIGVuY29kZWRWYWx1ZSk7XG4gICAgfVxuICAgIGZvcm1Cb2R5ID0gZm9ybUJvZHkuam9pbihcIiZcIik7XG4gICAgcmV0dXJuIGZvcm1Cb2R5O1xufVxucGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7XG5cbiJdfQ==