"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var ApplicationSettings = require("application-settings");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var xml2js = require('nativescript-xml2js');
var LoginComponent = (function () {
    function LoginComponent(page, webapi, rs) {
        this.page = page;
        this.webapi = webapi;
        this.rs = rs;
        this.formSubmitted = false;
        this.errorMsg = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
            if (JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).NeedPasswordChange != "true")
                this.rs.navigate(["/home"], { clearHistory: true });
            else
                this.webapi.logout(); //this.rs.navigate(["/changepassword"], { clearHistory: true });
        }
    };
    LoginComponent.prototype.loadedField = function (args) {
        var textfield = args.object;
        textfield.dismissSoftInput();
        textfield.android.setFocusable(false);
        setTimeout(function () {
            textfield.android.setFocusableInTouchMode(true);
        }, 300);
    };
    LoginComponent.prototype.doLogin = function (validUsername, validPassword) {
        this.formSubmitted = true;
        var self = this;
        if (validUsername && validPassword && self.webapi.netConnectivityCheck() && self.username.trim() != '') {
            self.webapi.loader.show(self.webapi.options);
            this.webapi.authenticate_http(this.username, this.password).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    ApplicationSettings.setString("USER_DEFAULTS", JSON.stringify(result.APIResult_Login));
                    ApplicationSettings.setString("MEMBER_ACCESS", result.APIResult_Login.ExternalMemberId);
                    ApplicationSettings.setString("LOGIN_CRD", JSON.stringify({ username: self.username, password: self.password }));
                    if (result.APIResult_Login.Successful == "true" && result.APIResult_Login.NeedPasswordChange == "false") {
                        self.webapi.loader.hide();
                        self.rs.navigate(["/home"], { clearHistory: true });
                    }
                    else if (result.APIResult_Login.Successful == "true" && result.APIResult_Login.NeedPasswordChange == "true") {
                        self.webapi.loader.hide();
                        self.rs.navigate(["/changepassword"], { clearHistory: true });
                    }
                    else {
                        //console.log("error");
                        self.webapi.loader.hide();
                        self.errorMsg = true;
                        setTimeout(function () {
                            self.errorMsg = false;
                        }, 6000);
                    }
                });
            }, function (error) {
                self.webapi.loader.hide();
                //	console.log("Error while authenticating. " + error);
            });
        }
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./login.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.RouterExtensions])
], LoginComponent);
exports.LoginComponent = LoginComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCxnQ0FBK0I7QUFDL0IsMERBQTREO0FBQzVELDBFQUF5RTtBQUN6RSx5RUFBc0U7QUFFdEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFNNUMsSUFBYSxjQUFjO0lBRzFCLHdCQUFvQixJQUFVLEVBQVUsTUFBcUIsRUFBVSxFQUFvQjtRQUF2RSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQWtCO1FBRDNGLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQUMsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUNxQyxDQUFDO0lBQ2hHLGlDQUFRLEdBQVI7UUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixJQUFJLE1BQU0sQ0FBQztnQkFDM0YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUk7Z0JBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBLGdFQUFnRTtRQUN2RixDQUFDO0lBQ0YsQ0FBQztJQUNELG9DQUFXLEdBQVgsVUFBWSxJQUFJO1FBQ2YsSUFBSSxTQUFTLEdBQXlCLElBQUks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QUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxFQUNBLFVBQUEsS0FBSztnQkFDSixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDM0IsdURBQXVEO1lBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNGLENBQUM7SUFDRixxQkFBQztBQUFELENBQUMsQUFwREQsSUFvREM7QUFwRFksY0FBYztJQUwxQixnQkFBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSx3QkFBd0I7UUFDckMsU0FBUyxFQUFFLENBQUMsK0JBQWEsRUFBRSw2QkFBYSxDQUFDO0tBQ3pDLENBQUM7cUNBSXlCLFdBQUksRUFBa0IsK0JBQWEsRUFBYyx5QkFBZ0I7R0FIL0UsY0FBYyxDQW9EMUI7QUFwRFksd0NBQWM7QUFvRDFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gXCJ1aS90ZXh0LWZpZWxkXCI7XG5sZXQgeG1sMmpzID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXhtbDJqcycpO1xuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vbG9naW4uY29tcG9uZW50Lmh0bWxcIixcblx0cHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQge1xuXHRwdWJsaWMgdXNlcm5hbWU6IHN0cmluZzsgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XG5cdGZvcm1TdWJtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTsgZXJyb3JNc2c6IGJvb2xlYW4gPSBmYWxzZTtcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSByczogUm91dGVyRXh0ZW5zaW9ucykgeyB9XG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xuXHRcdGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJfREVGQVVMVFNcIikpIHtcblx0XHRcdGlmIChKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUl9ERUZBVUxUU1wiKSkuTmVlZFBhc3N3b3JkQ2hhbmdlICE9IFwidHJ1ZVwiKVxuXHRcdFx0XHR0aGlzLnJzLm5hdmlnYXRlKFtcIi9ob21lXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcblx0XHRcdGVsc2VcdFx0XHRcdFxuXHRcdFx0XHR0aGlzLndlYmFwaS5sb2dvdXQoKTsvL3RoaXMucnMubmF2aWdhdGUoW1wiL2NoYW5nZXBhc3N3b3JkXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcblx0XHR9XG5cdH1cblx0bG9hZGVkRmllbGQoYXJncykge1xuXHRcdGxldCB0ZXh0ZmllbGQ6IFRleHRGaWVsZCA9IDxUZXh0RmllbGQ+YXJncy5vYmplY3Q7XG5cdFx0dGV4dGZpZWxkLmRpc21pc3NTb2Z0SW5wdXQoKTtcblx0XHR0ZXh0ZmllbGQuYW5kcm9pZC5zZXRGb2N1c2FibGUoZmFsc2UpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGV4dGZpZWxkLmFuZHJvaWQuc2V0Rm9jdXNhYmxlSW5Ub3VjaE1vZGUodHJ1ZSk7XG5cdFx0fSwgMzAwKTtcblx0fVxuXHRkb0xvZ2luKHZhbGlkVXNlcm5hbWUsIHZhbGlkUGFzc3dvcmQpIHtcblx0XHR0aGlzLmZvcm1TdWJtaXR0ZWQgPSB0cnVlOyBsZXQgc2VsZiA9IHRoaXM7XG5cdFx0aWYgKHZhbGlkVXNlcm5hbWUgJiYgdmFsaWRQYXNzd29yZCAmJiBzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpICYmIHNlbGYudXNlcm5hbWUudHJpbSgpICE9ICcnKSB7XG5cdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcblx0XHRcdHRoaXMud2ViYXBpLmF1dGhlbnRpY2F0ZV9odHRwKHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQpLnN1YnNjcmliZShkYXRhID0+IHtcblx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0QXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJVU0VSX0RFRkFVTFRTXCIsIEpTT04uc3RyaW5naWZ5KHJlc3VsdC5BUElSZXN1bHRfTG9naW4pKTtcblx0XHRcdFx0XHRBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcIk1FTUJFUl9BQ0NFU1NcIiwgcmVzdWx0LkFQSVJlc3VsdF9Mb2dpbi5FeHRlcm5hbE1lbWJlcklkKTtcblx0XHRcdFx0XHRBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcIkxPR0lOX0NSRFwiLCBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lOiBzZWxmLnVzZXJuYW1lLCBwYXNzd29yZDogc2VsZi5wYXNzd29yZCB9KSk7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5BUElSZXN1bHRfTG9naW4uU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiByZXN1bHQuQVBJUmVzdWx0X0xvZ2luLk5lZWRQYXNzd29yZENoYW5nZSA9PSBcImZhbHNlXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvYWRlci5oaWRlKCk7XG5cdFx0XHRcdFx0XHRzZWxmLnJzLm5hdmlnYXRlKFtcIi9ob21lXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdC5BUElSZXN1bHRfTG9naW4uU3VjY2Vzc2Z1bCA9PSBcInRydWVcIiAmJiAgIHJlc3VsdC5BUElSZXN1bHRfTG9naW4uTmVlZFBhc3N3b3JkQ2hhbmdlID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdFx0c2VsZi5ycy5uYXZpZ2F0ZShbXCIvY2hhbmdlcGFzc3dvcmRcIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiZXJyb3JcIik7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdFx0c2VsZi5lcnJvck1zZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5lcnJvck1zZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSwgNjAwMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHQvL1x0Y29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBhdXRoZW50aWNhdGluZy4gXCIgKyBlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTtcblxuXG4iXX0=