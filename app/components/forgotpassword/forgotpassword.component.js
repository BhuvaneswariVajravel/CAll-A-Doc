"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var xml2js = require('nativescript-xml2js');
var ForgotPasswordComponent = (function () {
    function ForgotPasswordComponent(page, router, webapi) {
        this.page = page;
        this.router = router;
        this.webapi = webapi;
        this.errorMsg = false;
        this.formSubmitted = false;
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
    };
    ForgotPasswordComponent.prototype.submit = function (usernameIsValid, emailIsValid) {
        this.formSubmitted = true;
        if (usernameIsValid && emailIsValid && this.webapi.netConnectivityCheck() && this.username.trim() != '') {
            this.forgotPassword();
        }
    };
    ForgotPasswordComponent.prototype.forgotPassword = function () {
        var self = this;
        self.webapi.loader.show(self.webapi.options);
        self.webapi.forgotPassword(this.username, this.email).subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult.Successful == "true") {
                    self.webapi.loader.hide();
                    self.router.navigate(["/forgotpasswordconfirm"]);
                }
                else if (result.APIResult.Message == "We could not find a member with that Login Name and Email.") {
                    self.webapi.loader.hide();
                    self.errorMsg = true;
                    setTimeout(function () {
                        self.errorMsg = false;
                    }, 5000);
                }
                else {
                    self.webapi.loader.hide();
                    //console.log("Session expired or error in forgotpassword...");
                }
            });
        }, function (error) {
            self.webapi.loader.hide();
            //	console.log("Error in Forgot password.... " + error);
        });
    };
    return ForgotPasswordComponent;
}());
ForgotPasswordComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./forgotpassword.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, web_api_service_1.WebAPIService])
], ForgotPasswordComponent);
exports.ForgotPasswordComponent = ForgotPasswordComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290cGFzc3dvcmQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZm9yZ290cGFzc3dvcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUF5QztBQUN6QyxnQ0FBK0I7QUFDL0IsMEVBQXlFO0FBQ3pFLHlFQUFzRTtBQUN0RSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQU01QyxJQUFhLHVCQUF1QjtJQUduQyxpQ0FBb0IsSUFBVSxFQUFVLE1BQWMsRUFBVSxNQUFxQjtRQUFqRSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFGdEMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUN6RSxrQkFBYSxHQUFHLEtBQUssQ0FBQztJQUNtRSxDQUFDO0lBQzFGLDBDQUFRLEdBQVI7UUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDbEMsQ0FBQztJQUNELHdDQUFNLEdBQU4sVUFBTyxlQUFlLEVBQUUsWUFBWTtRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7SUFDRixDQUFDO0lBQ0QsZ0RBQWMsR0FBZDtRQUNDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUk7WUFDbkUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLE1BQU07Z0JBQzdFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLElBQUksNERBQTRELENBQUMsQ0FBQyxDQUFDO29CQUNyRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDaEQsVUFBVSxDQUFDO3dCQUNWLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUN2QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ1YsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDMUIsK0RBQStEO2dCQUNoRSxDQUFDO1lBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLEVBQ0EsVUFBQSxLQUFLO1lBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0Isd0RBQXdEO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNGLDhCQUFDO0FBQUQsQ0FBQyxBQXBDRCxJQW9DQztBQXBDWSx1QkFBdUI7SUFMbkMsZ0JBQVMsQ0FBQztRQUNWLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsaUNBQWlDO1FBQzlDLFNBQVMsRUFBRSxDQUFDLCtCQUFhLEVBQUUsNkJBQWEsQ0FBQztLQUN6QyxDQUFDO3FDQUl5QixXQUFJLEVBQWtCLGVBQU0sRUFBa0IsK0JBQWE7R0FIekUsdUJBQXVCLENBb0NuQztBQXBDWSwwREFBdUI7QUFvQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcbkBDb21wb25lbnQoe1xuXHRtb2R1bGVJZDogbW9kdWxlLmlkLFxuXHR0ZW1wbGF0ZVVybDogXCIuL2ZvcmdvdHBhc3N3b3JkLmNvbXBvbmVudC5odG1sXCIsXG5cdHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb25dXG59KVxuZXhwb3J0IGNsYXNzIEZvcmdvdFBhc3N3b3JkQ29tcG9uZW50IHtcblx0cHVibGljIHVzZXJuYW1lOiBzdHJpbmc7IHB1YmxpYyBlbWFpbDogc3RyaW5nOyBlcnJvck1zZzogYm9vbGVhbiA9IGZhbHNlO1xuXHRmb3JtU3VibWl0dGVkID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UpIHsgfVxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcblx0fVxuXHRzdWJtaXQodXNlcm5hbWVJc1ZhbGlkLCBlbWFpbElzVmFsaWQpIHtcblx0XHR0aGlzLmZvcm1TdWJtaXR0ZWQgPSB0cnVlO1xuXHRcdGlmICh1c2VybmFtZUlzVmFsaWQgJiYgZW1haWxJc1ZhbGlkICYmIHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkgJiYgdGhpcy51c2VybmFtZS50cmltKCkgIT0gJycpIHtcblx0XHRcdHRoaXMuZm9yZ290UGFzc3dvcmQoKTtcblx0XHR9XG5cdH1cblx0Zm9yZ290UGFzc3dvcmQoKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzOyBzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcblx0XHRzZWxmLndlYmFwaS5mb3Jnb3RQYXNzd29yZCh0aGlzLnVzZXJuYW1lLCB0aGlzLmVtYWlsKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0aWYgKHJlc3VsdC5BUElSZXN1bHQuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvYWRlci5oaWRlKCk7XG5cdFx0XHRcdFx0c2VsZi5yb3V0ZXIubmF2aWdhdGUoW1wiL2ZvcmdvdHBhc3N3b3JkY29uZmlybVwiXSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdC5NZXNzYWdlID09IFwiV2UgY291bGQgbm90IGZpbmQgYSBtZW1iZXIgd2l0aCB0aGF0IExvZ2luIE5hbWUgYW5kIEVtYWlsLlwiKSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTsgc2VsZi5lcnJvck1zZyA9IHRydWU7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmVycm9yTXNnID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgNTAwMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIGVycm9yIGluIGZvcmdvdHBhc3N3b3JkLi4uXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0Ly9cdGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gRm9yZ290IHBhc3N3b3JkLi4uLiBcIiArIGVycm9yKTtcblx0XHRcdH0pO1xuXHR9XG59O1xuXG5cbiJdfQ==