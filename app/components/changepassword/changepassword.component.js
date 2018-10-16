"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var router_2 = require("nativescript-angular/router");
var ApplicationSettings = require("application-settings");
var ChangePasswordComponent = (function () {
    function ChangePasswordComponent(page, webapi, router, rs) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.rs = rs;
        this.matchFlag = false;
        this.formSubmitted = false;
        this.validPwd = false;
    }
    ChangePasswordComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        if (ApplicationSettings.hasKey("USER_DEFAULTS"))
            this.memberid = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS")).ExternalMemberId;
        if (ApplicationSettings.hasKey("LOGIN_CRD"))
            this.username = JSON.parse(ApplicationSettings.getString("LOGIN_CRD")).username;
        //console.log(this.memberid+"====="+this.username);
    };
    ChangePasswordComponent.prototype.changePwd = function (newpwd) {
        this.formSubmitted = true;
        var self = this;
        if (this.cnfmpassword != this.password) {
            self.matchFlag = true;
            return;
        }
        self.matchFlag = false;
        self.validPwd = false;
        if (newpwd && !this.matchFlag && this.isAlphaNum()) {
            var changePassword = {};
            changePassword.Password = this.password;
            changePassword.ConfirmPassword = this.cnfmpassword;
            var navigationExtras = {
                queryParams: { "CHANGE_PWD": JSON.stringify(changePassword) }
            };
            this.router.navigate(["/passwordtermsconditions"], navigationExtras);
        }
    };
    ChangePasswordComponent.prototype.isAlphaNum = function () {
        //return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9$@$!%*#?&-₹+;:"]+)$/.test(this.password);
        return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9$@$!%*#?&-₹_+]+)$/.test(this.password);
    };
    ChangePasswordComponent.prototype.loadedField = function (args) {
        var textfield = args.object;
        textfield.dismissSoftInput();
        textfield.android.setFocusable(false);
        setTimeout(function () {
            textfield.android.setFocusableInTouchMode(true);
        }, 300);
    };
    ChangePasswordComponent.prototype.pwdChecker = function (args) {
        var textField = args.object;
        if (textField.text != this.password)
            this.matchFlag = true;
        else
            this.matchFlag = false;
    };
    ChangePasswordComponent.prototype.logOut = function () {
        this.webapi.clearCache();
        this.rs.navigate(["/login"], { clearHistory: true });
    };
    return ChangePasswordComponent;
}());
ChangePasswordComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./changepassword.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_2.RouterExtensions])
], ChangePasswordComponent);
exports.ChangePasswordComponent = ChangePasswordComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlcGFzc3dvcmQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hhbmdlcGFzc3dvcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUEyRDtBQUMzRCxnQ0FBK0I7QUFFL0IseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSxzREFBK0Q7QUFDL0QsMERBQTREO0FBTzVELElBQWEsdUJBQXVCO0lBR25DLGlDQUFvQixJQUFVLEVBQVUsTUFBcUIsRUFBVSxNQUFjLEVBQVUsRUFBb0I7UUFBL0YsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7UUFGZCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ2hJLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQUMsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUM2RCxDQUFDO0lBQ3hILDBDQUFRLEdBQVI7UUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3RixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUVqRixtREFBbUQ7SUFDcEQsQ0FBQztJQUNELDJDQUFTLEdBQVQsVUFBVSxNQUFNO1FBQ2YsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixNQUFNLENBQUE7UUFDUCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUM5QyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxjQUFjLEdBQVEsRUFBRSxDQUFDO1lBQzdCLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN4QyxjQUFjLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDbkQsSUFBSSxnQkFBZ0IsR0FBcUI7Z0JBQ3hDLFdBQVcsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFFO2FBQzdELENBQUM7WUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxDQUFDO0lBQ0YsQ0FBQztJQUNELDRDQUFVLEdBQVY7UUFDQyx3RkFBd0Y7UUFDeEYsTUFBTSxDQUFDLHdEQUF3RCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUNELDZDQUFXLEdBQVgsVUFBWSxJQUFJO1FBQ2YsSUFBSSxTQUFTLEdBQXlCLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDbEQsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDN0IsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsVUFBVSxDQUFDO1lBQ1YsU0FBUyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBQ0QsNENBQVUsR0FBVixVQUFXLElBQUk7UUFDZCxJQUFJLFNBQVMsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJO1lBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUNELHdDQUFNLEdBQU47UUFDQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0YsOEJBQUM7QUFBRCxDQUFDLEFBckRELElBcURDO0FBckRZLHVCQUF1QjtJQUxuQyxnQkFBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSxpQ0FBaUM7UUFDOUMsU0FBUyxFQUFFLENBQUMsK0JBQWEsRUFBRSw2QkFBYSxDQUFDO0tBQ3pDLENBQUM7cUNBSXlCLFdBQUksRUFBa0IsK0JBQWEsRUFBa0IsZUFBTSxFQUFjLHlCQUFnQjtHQUh2Ryx1QkFBdUIsQ0FxRG5DO0FBckRZLDBEQUF1QjtBQXFEbkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gXCJ1aS90ZXh0LWZpZWxkXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5cbkBDb21wb25lbnQoe1xuXHRtb2R1bGVJZDogbW9kdWxlLmlkLFxuXHR0ZW1wbGF0ZVVybDogXCIuL2NoYW5nZXBhc3N3b3JkLmNvbXBvbmVudC5odG1sXCIsXG5cdHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb25dXG59KVxuZXhwb3J0IGNsYXNzIENoYW5nZVBhc3N3b3JkQ29tcG9uZW50IHtcblx0cHVibGljIHVzZXJuYW1lOiBzdHJpbmc7IHB1YmxpYyBtZW1iZXJpZDogYW55OyBwdWJsaWMgcGFzc3dvcmQ6IHN0cmluZzsgcHVibGljIGNuZm1wYXNzd29yZDogc3RyaW5nOyBtYXRjaEZsYWc6IGJvb2xlYW4gPSBmYWxzZTtcblx0Zm9ybVN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlOyB2YWxpZFB3ZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIHJzOiBSb3V0ZXJFeHRlbnNpb25zKSB7IH1cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG5cdFx0aWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUl9ERUZBVUxUU1wiKSlcblx0XHRcdHRoaXMubWVtYmVyaWQgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUl9ERUZBVUxUU1wiKSkuRXh0ZXJuYWxNZW1iZXJJZDtcblx0XHRpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJMT0dJTl9DUkRcIikpXG5cdFx0XHR0aGlzLnVzZXJuYW1lID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIkxPR0lOX0NSRFwiKSkudXNlcm5hbWU7XG5cblx0XHQvL2NvbnNvbGUubG9nKHRoaXMubWVtYmVyaWQrXCI9PT09PVwiK3RoaXMudXNlcm5hbWUpO1xuXHR9XG5cdGNoYW5nZVB3ZChuZXdwd2QpIHtcblx0XHR0aGlzLmZvcm1TdWJtaXR0ZWQgPSB0cnVlOyBsZXQgc2VsZiA9IHRoaXM7XG5cdFx0aWYgKHRoaXMuY25mbXBhc3N3b3JkICE9IHRoaXMucGFzc3dvcmQpIHtcblx0XHRcdHNlbGYubWF0Y2hGbGFnID0gdHJ1ZTtcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRzZWxmLm1hdGNoRmxhZyA9IGZhbHNlOyBzZWxmLnZhbGlkUHdkID0gZmFsc2U7XG5cdFx0aWYgKG5ld3B3ZCAmJiAhdGhpcy5tYXRjaEZsYWcgJiYgdGhpcy5pc0FscGhhTnVtKCkpIHtcblx0XHRcdGxldCBjaGFuZ2VQYXNzd29yZDogYW55ID0ge307XG5cdFx0XHRjaGFuZ2VQYXNzd29yZC5QYXNzd29yZCA9IHRoaXMucGFzc3dvcmQ7XG5cdFx0XHRjaGFuZ2VQYXNzd29yZC5Db25maXJtUGFzc3dvcmQgPSB0aGlzLmNuZm1wYXNzd29yZDtcblx0XHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0XHRxdWVyeVBhcmFtczogeyBcIkNIQU5HRV9QV0RcIjogSlNPTi5zdHJpbmdpZnkoY2hhbmdlUGFzc3dvcmQpIH1cblx0XHRcdH07XG5cdFx0XHR0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvcGFzc3dvcmR0ZXJtc2NvbmRpdGlvbnNcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHRcdH1cblx0fVxuXHRpc0FscGhhTnVtKCkge1xuXHRcdC8vcmV0dXJuIC9eKD89LipbMC05XSkoPz0uKlthLXpBLVpdKShbYS16QS1aMC05JEAkISUqIz8mLeKCuSs7OlwiXSspJC8udGVzdCh0aGlzLnBhc3N3b3JkKTtcblx0XHRyZXR1cm4gL14oPz0uKlswLTldKSg/PS4qW2EtekEtWl0pKFthLXpBLVowLTkkQCQhJSojPyYt4oK5XytdKykkLy50ZXN0KHRoaXMucGFzc3dvcmQpO1xuXHR9XG5cdGxvYWRlZEZpZWxkKGFyZ3MpIHtcblx0XHRsZXQgdGV4dGZpZWxkOiBUZXh0RmllbGQgPSA8VGV4dEZpZWxkPmFyZ3Mub2JqZWN0O1xuXHRcdHRleHRmaWVsZC5kaXNtaXNzU29mdElucHV0KCk7XG5cdFx0dGV4dGZpZWxkLmFuZHJvaWQuc2V0Rm9jdXNhYmxlKGZhbHNlKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRleHRmaWVsZC5hbmRyb2lkLnNldEZvY3VzYWJsZUluVG91Y2hNb2RlKHRydWUpO1xuXHRcdH0sIDMwMCk7XG5cdH1cblx0cHdkQ2hlY2tlcihhcmdzKSB7XG5cdFx0bGV0IHRleHRGaWVsZCA9IDxUZXh0RmllbGQ+YXJncy5vYmplY3Q7XG5cdFx0aWYgKHRleHRGaWVsZC50ZXh0ICE9IHRoaXMucGFzc3dvcmQpXG5cdFx0XHR0aGlzLm1hdGNoRmxhZyA9IHRydWU7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5tYXRjaEZsYWcgPSBmYWxzZTtcblx0fVxuXHRsb2dPdXQoKSB7XG5cdFx0dGhpcy53ZWJhcGkuY2xlYXJDYWNoZSgpO1xuXHRcdHRoaXMucnMubmF2aWdhdGUoW1wiL2xvZ2luXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcblx0fVxufTtcblxuXG4iXX0=