// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppModule } from "./app.module";
import * as ApplicationSettings from "application-settings";
import { WebAPIService } from "./shared/services/web-api.service";
import * as connectivity from "tns-core-modules/connectivity";

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
    } else if (args.ios) {
        // For iOS applications, args.ios is NativeScriptError.
        console.log("NativeScriptError: " + args.ios);
    }
});
application.on(application.suspendEvent, function (args) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
        console.log("Activity: suspendEvent" + args.android);

    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: suspendEvent" + args.ios);
    }
});

application.on(application.resumeEvent, function (args) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        console.log("Activity: resumeEvent" + args.android);
        refreshAgain();
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: resumeEvent" + args.ios);
        refreshAgain();
    }
});

application.on(application.exitEvent, function (args) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        console.log("Activity: exitEvent" + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: exitEvent" + args.ios);
    }
});
let usr: any, key: string;
let http_request = require("http");
let xml2js = require('nativescript-xml2js');
let expiresAt: any
connectivity.startMonitoring(function onConnectionTypeChanged(newConnectionType: number) {
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
setInterval(() => {
    ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
    refreshAgain();
}, 36000000);
setInterval(() => {
    ApplicationSettings.remove("FAMILY_MEMBER_DETAILS");
    refreshAgain();
}, 3.96e+7);//
// For Http POST method - To convert application/json to application/x-www-form-urlencoded format
function refreshAgain() {
    console.log("New Key........");
    if (ApplicationSettings.hasKey("LOGIN_CRD")) {
        usr = JSON.parse(ApplicationSettings.getString("LOGIN_CRD"));
        key = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).Key;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        let input = { Key: key, UserType: "Member", LoginName: usr.username, Password: usr.password };
        let body = JsonToFormEncoded(input)
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
                    let k = result.APIResult_KeyRefresh.Key;
                    let s = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
                    s.Key = k;
                    ApplicationSettings.setString("USER_DEFAULTS", JSON.stringify(s));
                } else {
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
    let formBody: any = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
}
platformNativeScriptDynamic().bootstrapModule(AppModule);

