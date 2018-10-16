"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var router_2 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var xml2js = require("nativescript-xml2js");
var PasswordTermsConditionsComponent = (function () {
    function PasswordTermsConditionsComponent(page, rs, webapi, actRoute) {
        this.page = page;
        this.rs = rs;
        this.webapi = webapi;
        this.actRoute = actRoute;
        this.changePwd = {};
        this.isVisible = false;
        this.authorize = false;
        this.formSubmitted = false;
    }
    PasswordTermsConditionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.actRoute.queryParams.subscribe(function (params) {
            if (params["CHANGE_PWD"] != undefined) {
                _this.changePwd = JSON.parse(params["CHANGE_PWD"]);
            }
        });
    };
    PasswordTermsConditionsComponent.prototype.changePassword = function () {
        var self = this;
        self.webapi.loader.show(self.webapi.options);
        this.webapi.changepassword(this.changePwd).subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult.Successful == "true") {
                    self.webapi.loader.hide();
                    self.isVisible = true;
                }
                else if (result.APIResult.Message == "Password should have at least 6 characters, and at least one digit.") {
                    self.webapi.loader.hide();
                    //console.log("Password not match with requirement");
                }
                else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                    self.webapi.loader.hide();
                    self.webapi.logout();
                }
                else {
                    self.webapi.loader.hide();
                    //	console.log("Session Expired or Something went wrong in changepassword ");
                }
            });
        }, function (error) {
            self.webapi.loader.hide();
            //console.log("Error in ChangePwd.. " + error);
        });
    };
    PasswordTermsConditionsComponent.prototype.popupbtn = function () {
        this.formSubmitted = true;
        if (this.authorize && this.webapi.netConnectivityCheck()) {
            this.changePassword();
        }
    };
    PasswordTermsConditionsComponent.prototype.popupclose = function () {
        this.isVisible = false;
        this.rs.navigate(["/home"], { clearHistory: true });
    };
    PasswordTermsConditionsComponent.prototype.onAccepting = function () {
        this.authorize = !this.authorize;
    };
    return PasswordTermsConditionsComponent;
}());
PasswordTermsConditionsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./passwordtermsconditions.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.RouterExtensions, web_api_service_1.WebAPIService, router_2.ActivatedRoute])
], PasswordTermsConditionsComponent);
exports.PasswordTermsConditionsComponent = PasswordTermsConditionsComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3dvcmR0ZXJtc2NvbmRpdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFzc3dvcmR0ZXJtc2NvbmRpdGlvbnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHNEQUErRDtBQUMvRCwwQ0FBaUQ7QUFDakQsZ0NBQStCO0FBQy9CLDBFQUF5RTtBQUN6RSx5RUFBc0U7QUFDdEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFPNUMsSUFBYSxnQ0FBZ0M7SUFJNUMsMENBQW9CLElBQVUsRUFBVSxFQUFvQixFQUFVLE1BQXFCLEVBQVUsUUFBd0I7UUFBekcsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQWtCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBSDdILGNBQVMsR0FBUSxFQUFFLENBQUM7UUFFcEIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUFDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFBQyxrQkFBYSxHQUFZLEtBQUssQ0FBQztJQUMwQyxDQUFDO0lBQ2xJLG1EQUFRLEdBQVI7UUFBQSxpQkFPQztRQU5BLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxLQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbkQsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELHlEQUFjLEdBQWQ7UUFDQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUk7WUFDeEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLE1BQU07Z0JBQzdFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdkIsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLElBQUkscUVBQXFFLENBQUMsQ0FBQyxDQUFDO29CQUM5RyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDMUIscURBQXFEO2dCQUN0RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSwrRkFBK0YsQ0FBQyxDQUFDLENBQUM7b0JBQ3hJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUMzQiw2RUFBNkU7Z0JBQzdFLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsRUFDQSxVQUFBLEtBQUs7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMxQiwrQ0FBK0M7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsbURBQVEsR0FBUjtRQUNDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsQ0FBQztJQUNGLENBQUM7SUFDRCxxREFBVSxHQUFWO1FBQ0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRCxzREFBVyxHQUFYO1FBQ0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDbEMsQ0FBQztJQUVGLHVDQUFDO0FBQUQsQ0FBQyxBQXBERCxJQW9EQztBQXBEWSxnQ0FBZ0M7SUFMNUMsZ0JBQVMsQ0FBQztRQUNWLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsMENBQTBDO1FBQ3ZELFNBQVMsRUFBRSxDQUFDLCtCQUFhLEVBQUUsNkJBQWEsQ0FBQztLQUN6QyxDQUFDO3FDQUt5QixXQUFJLEVBQWMseUJBQWdCLEVBQWtCLCtCQUFhLEVBQW9CLHVCQUFjO0dBSmpILGdDQUFnQyxDQW9ENUM7QUFwRFksNEVBQWdDO0FBb0Q1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmxldCB4bWwyanMgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXhtbDJqc1wiKTtcblxuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vcGFzc3dvcmR0ZXJtc2NvbmRpdGlvbnMuY29tcG9uZW50Lmh0bWxcIixcblx0cHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgUGFzc3dvcmRUZXJtc0NvbmRpdGlvbnNDb21wb25lbnQge1xuXHRjaGFuZ2VQd2Q6IGFueSA9IHt9O1xuXG5cdGlzVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlOyBhdXRob3JpemU6IGJvb2xlYW4gPSBmYWxzZTsgZm9ybVN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgcnM6IFJvdXRlckV4dGVuc2lvbnMsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkgeyB9XG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xuXHRcdHRoaXMuYWN0Um91dGUucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiQ0hBTkdFX1BXRFwiXSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5jaGFuZ2VQd2QgPSBKU09OLnBhcnNlKHBhcmFtc1tcIkNIQU5HRV9QV0RcIl0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGNoYW5nZVBhc3N3b3JkKCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcblx0XHR0aGlzLndlYmFwaS5jaGFuZ2VwYXNzd29yZCh0aGlzLmNoYW5nZVB3ZCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdGlmIChyZXN1bHQuQVBJUmVzdWx0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdHNlbGYuaXNWaXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0Lk1lc3NhZ2UgPT0gXCJQYXNzd29yZCBzaG91bGQgaGF2ZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMsIGFuZCBhdCBsZWFzdCBvbmUgZGlnaXQuXCIpIHtcblx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJQYXNzd29yZCBub3QgbWF0Y2ggd2l0aCByZXF1aXJlbWVudFwiKTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0Lk1lc3NhZ2UgPT0gXCJTZXNzaW9uIGV4cGlyZWQsIHBsZWFzZSBsb2dpbiB1c2luZyBNZW1iZXJMb2dpbiBzY3JlZW4gdG8gZ2V0IGEgbmV3IGtleSBmb3IgZnVydGhlciBBUEkgY2FsbHNcIikge1xuXHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvYWRlci5oaWRlKCk7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9nb3V0KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0Ly9cdGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBFeHBpcmVkIG9yIFNvbWV0aGluZyB3ZW50IHdyb25nIGluIGNoYW5nZXBhc3N3b3JkIFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVycm9yIGluIENoYW5nZVB3ZC4uIFwiICsgZXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblx0cG9wdXBidG4oKSB7XG5cdFx0dGhpcy5mb3JtU3VibWl0dGVkID0gdHJ1ZTtcblx0XHRpZiAodGhpcy5hdXRob3JpemUgJiYgdGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuXHRcdFx0dGhpcy5jaGFuZ2VQYXNzd29yZCgpO1xuXHRcdH1cblx0fVxuXHRwb3B1cGNsb3NlKCkge1xuXHRcdHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cdFx0dGhpcy5ycy5uYXZpZ2F0ZShbXCIvaG9tZVwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG5cdH1cblx0b25BY2NlcHRpbmcoKSB7XG5cdFx0dGhpcy5hdXRob3JpemUgPSAhdGhpcy5hdXRob3JpemU7XG5cdH1cblxufTtcblxuXG4iXX0=