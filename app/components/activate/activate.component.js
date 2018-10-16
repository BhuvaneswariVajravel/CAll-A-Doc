"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var ActivateComponent = (function () {
    function ActivateComponent(page, router, webapi) {
        this.page = page;
        this.router = router;
        this.webapi = webapi;
        this.authorize = false;
        this.formSubmitted = false;
    }
    ActivateComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
    };
    ActivateComponent.prototype.gotoTermsAndConditions = function (firstnameIsValid, lastnameIsValid, dobIsValid, memberIdIsValid) {
        this.formSubmitted = true;
        if (firstnameIsValid && lastnameIsValid && dobIsValid && memberIdIsValid && this.authorize && this.isValidDate() && this.firstName.trim() != '' && this.lastName.trim() != '' && this.webapi.netConnectivityCheck()) {
            var activateAccount = {};
            activateAccount.FirstName = this.firstName;
            activateAccount.LastName = this.lastName;
            activateAccount.DOB = this.dob;
            activateAccount.ExternalMemberId = this.externalMemberId;
            var navigationExtras = {
                queryParams: { "ACTIVATE_ACCOUNT": JSON.stringify(activateAccount) }
            };
            this.router.navigate(["/termsconditions"], navigationExtras);
        }
    };
    ActivateComponent.prototype.isValidDate = function () {
        var date = this.dob;
        var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
        if (matches == null)
            return false;
        var d = matches[2];
        var m;
        m = parseInt(matches[1]) - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y && composedDate.getTime() < new Date().getTime();
    };
    ActivateComponent.prototype.onAccepting = function () {
        this.authorize = !this.authorize;
    };
    return ActivateComponent;
}());
ActivateComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./activate.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, web_api_service_1.WebAPIService])
], ActivateComponent);
exports.ActivateComponent = ActivateComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aXZhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUEyRDtBQUMzRCxnQ0FBK0I7QUFDL0IsMEVBQXlFO0FBQ3pFLHlFQUFzRTtBQU90RSxJQUFhLGlCQUFpQjtJQUc3QiwyQkFBb0IsSUFBVSxFQUFVLE1BQWMsRUFBVSxNQUFxQjtRQUFqRSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFGVCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ3ZHLGtCQUFhLEdBQUcsS0FBSyxDQUFDO0lBQ21FLENBQUM7SUFDMUYsb0NBQVEsR0FBUjtRQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBQ0Qsa0RBQXNCLEdBQXRCLFVBQXVCLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsZUFBZTtRQUNwRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxlQUFlLElBQUksVUFBVSxJQUFJLGVBQWUsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JOLElBQUksZUFBZSxHQUFRLEVBQUUsQ0FBQztZQUM5QixlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDM0MsZUFBZSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3pDLGVBQWUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUMvQixlQUFlLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ3pELElBQUksZ0JBQWdCLEdBQXFCO2dCQUN4QyxXQUFXLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxFQUFFO2FBQ3BFLENBQUM7WUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RCxDQUFDO0lBQ0YsQ0FBQztJQUNELHVDQUFXLEdBQVg7UUFDQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3BCLElBQUksT0FBTyxHQUFHLHVDQUF1QyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBUSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFNLENBQUM7UUFDWCxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBUSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7WUFDakMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7WUFDNUIsWUFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuRixDQUFDO0lBQ0QsdUNBQVcsR0FBWDtRQUNDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFDRix3QkFBQztBQUFELENBQUMsQUFyQ0QsSUFxQ0M7QUFyQ1ksaUJBQWlCO0lBTDdCLGdCQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxTQUFTLEVBQUUsQ0FBQywrQkFBYSxFQUFFLDZCQUFhLENBQUM7S0FDekMsQ0FBQztxQ0FJeUIsV0FBSSxFQUFrQixlQUFNLEVBQWtCLCtCQUFhO0dBSHpFLGlCQUFpQixDQXFDN0I7QUFyQ1ksOENBQWlCO0FBcUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vYWN0aXZhdGUuY29tcG9uZW50Lmh0bWxcIixcblx0cHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgQWN0aXZhdGVDb21wb25lbnQge1xuXHRmaXJzdE5hbWU6IHN0cmluZzsgbGFzdE5hbWU6IHN0cmluZzsgZG9iOiBzdHJpbmc7IGV4dGVybmFsTWVtYmVySWQ6IHN0cmluZzsgYXV0aG9yaXplOiBib29sZWFuID0gZmFsc2U7XG5cdGZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSkgeyB9XG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xuXHR9XG5cdGdvdG9UZXJtc0FuZENvbmRpdGlvbnMoZmlyc3RuYW1lSXNWYWxpZCwgbGFzdG5hbWVJc1ZhbGlkLCBkb2JJc1ZhbGlkLCBtZW1iZXJJZElzVmFsaWQpIHtcblx0XHR0aGlzLmZvcm1TdWJtaXR0ZWQgPSB0cnVlO1xuXHRcdGlmIChmaXJzdG5hbWVJc1ZhbGlkICYmIGxhc3RuYW1lSXNWYWxpZCAmJiBkb2JJc1ZhbGlkICYmIG1lbWJlcklkSXNWYWxpZCAmJiB0aGlzLmF1dGhvcml6ZSAmJiB0aGlzLmlzVmFsaWREYXRlKCkgJiYgdGhpcy5maXJzdE5hbWUudHJpbSgpICE9ICcnICYmIHRoaXMubGFzdE5hbWUudHJpbSgpICE9ICcnICYmIHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcblx0XHRcdGxldCBhY3RpdmF0ZUFjY291bnQ6IGFueSA9IHt9O1xuXHRcdFx0YWN0aXZhdGVBY2NvdW50LkZpcnN0TmFtZSA9IHRoaXMuZmlyc3ROYW1lO1xuXHRcdFx0YWN0aXZhdGVBY2NvdW50Lkxhc3ROYW1lID0gdGhpcy5sYXN0TmFtZTtcblx0XHRcdGFjdGl2YXRlQWNjb3VudC5ET0IgPSB0aGlzLmRvYjtcblx0XHRcdGFjdGl2YXRlQWNjb3VudC5FeHRlcm5hbE1lbWJlcklkID0gdGhpcy5leHRlcm5hbE1lbWJlcklkO1xuXHRcdFx0bGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG5cdFx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiQUNUSVZBVEVfQUNDT1VOVFwiOiBKU09OLnN0cmluZ2lmeShhY3RpdmF0ZUFjY291bnQpIH1cblx0XHRcdH07XG5cdFx0XHR0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvdGVybXNjb25kaXRpb25zXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9XG5cdH1cblx0aXNWYWxpZERhdGUoKSB7XG5cdFx0bGV0IGRhdGUgPSB0aGlzLmRvYjtcblx0XHRsZXQgbWF0Y2hlcyA9IC9eKFxcZHsxLDJ9KVstXFwvXShcXGR7MSwyfSlbLVxcL10oXFxkezR9KSQvLmV4ZWMoZGF0ZSk7XG5cdFx0aWYgKG1hdGNoZXMgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRcdGxldCBkOiBhbnkgPSBtYXRjaGVzWzJdO1xuXHRcdGxldCBtOiBhbnk7XG5cdFx0bSA9IHBhcnNlSW50KG1hdGNoZXNbMV0pIC0gMTtcblx0XHRsZXQgeTogYW55ID0gbWF0Y2hlc1szXTtcblx0XHRsZXQgY29tcG9zZWREYXRlID0gbmV3IERhdGUoeSwgbSwgZCk7XG5cdFx0cmV0dXJuIGNvbXBvc2VkRGF0ZS5nZXREYXRlKCkgPT0gZCAmJlxuXHRcdFx0Y29tcG9zZWREYXRlLmdldE1vbnRoKCkgPT0gbSAmJlxuXHRcdFx0Y29tcG9zZWREYXRlLmdldEZ1bGxZZWFyKCkgPT0geSAmJiBjb21wb3NlZERhdGUuZ2V0VGltZSgpIDwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdH1cblx0b25BY2NlcHRpbmcoKSB7XG5cdFx0dGhpcy5hdXRob3JpemUgPSAhdGhpcy5hdXRob3JpemU7XG5cdH1cbn07Il19