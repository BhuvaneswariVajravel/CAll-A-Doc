"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var user_model_1 = require("../../shared/model/user.model");
var ApplicationSettings = require("application-settings");
var radside_component_1 = require("../radside/radside.component");
var xml2js = require('nativescript-xml2js');
var router_1 = require("nativescript-angular/router");
var HomeComponent = (function () {
    function HomeComponent(page, webapi, rs) {
        this.page = page;
        this.webapi = webapi;
        this.rs = rs;
        this.user = new user_model_1.User();
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.radSideComponent.homeClass = true;
        this.radSideComponent.navIcon = true;
        this.getMemberInfoService();
    };
    HomeComponent.prototype.getMemberInfoService = function () {
        var self = this;
        self.webapi.loader.show(self.webapi.options);
        this.webapi.getMemberInfo().subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.ServiceCallResult_MemberInfo.Successful == "true") {
                    self.user.FirstName = result.ServiceCallResult_MemberInfo.FirstName.charAt(0).toUpperCase() + result.ServiceCallResult_MemberInfo.FirstName.substr(1).toLowerCase();
                    self.user.LastName = result.ServiceCallResult_MemberInfo.LastName.charAt(0).toUpperCase() + result.ServiceCallResult_MemberInfo.LastName.substr(1).toLowerCase();
                    self.user.DOB = result.ServiceCallResult_MemberInfo.DOB;
                    self.user.Address1 = result.ServiceCallResult_MemberInfo.Address1;
                    self.user.State = result.ServiceCallResult_MemberInfo.State;
                    self.user.Zip = result.ServiceCallResult_MemberInfo.Zip;
                    self.user.Phone = result.ServiceCallResult_MemberInfo.Phone.match(new RegExp('.{1,4}$|.{1,3}', 'g')).join("-");
                    self.user.Email = result.ServiceCallResult_MemberInfo.Email;
                    self.user.PlanId = result.ServiceCallResult_MemberInfo.PlanId;
                    self.user.PlanOption = result.ServiceCallResult_MemberInfo.PlanOption;
                    self.user.Relationship = result.ServiceCallResult_MemberInfo.Relationship;
                    self.user.ExternalMemberId = result.ServiceCallResult_MemberInfo.ExternalMemberId;
                    self.user.PictureData = result.ServiceCallResult_MemberInfo.Picture.FileData;
                    ApplicationSettings.setString("USER", JSON.stringify(self.user));
                    self.webapi.loader.hide();
                }
                else {
                    self.webapi.loader.hide();
                    // console.log("Error in getting thegetMember Info / Session expired " + result.ServiceCallResult_MemberInfo.Message);
                }
            });
        }, function (error) {
            self.webapi.loader.hide();
            // console.log("Error in getting thegetMember Info / Session expired..... " + error);
        });
    };
    HomeComponent.prototype.openProfile = function (data) {
        var self = this;
        self.webapi.loader.show(self.webapi.options);
        setTimeout(function () {
            self.rs.navigate([data]).then(function () {
                setTimeout(function () {
                    self.webapi.loader.hide();
                }, 1000);
            });
        }, 500);
    };
    return HomeComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], HomeComponent.prototype, "radSideComponent", void 0);
HomeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./home.component.html",
        providers: [configuration_1.Configuration, web_api_service_1.WebAPIService]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.RouterExtensions])
], HomeComponent);
exports.HomeComponent = HomeComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUU3RCxnQ0FBK0I7QUFDL0IsMEVBQXlFO0FBQ3pFLHlFQUFzRTtBQUN0RSw0REFBcUQ7QUFDckQsMERBQTREO0FBQzVELGtFQUFnRTtBQUNoRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM1QyxzREFBK0Q7QUFNL0QsSUFBYSxhQUFhO0lBSXRCLHVCQUFvQixJQUFVLEVBQVUsTUFBcUIsRUFBVSxFQUFvQjtRQUF2RSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQWtCO1FBSDNGLFNBQUksR0FBRyxJQUFJLGlCQUFJLEVBQUUsQ0FBQztJQUc0RSxDQUFDO0lBQy9GLGdDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQy9HLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFDRCw0Q0FBb0IsR0FBcEI7UUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO1lBQ3RDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxLQUFL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Q0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxVQUFVLENBQUM7WUFDUCxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixVQUFVLENBQUM7b0JBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzlCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQyxBQXBERCxJQW9EQztBQWxEZ0M7SUFBNUIsZ0JBQVMsQ0FBQyxvQ0FBZ0IsQ0FBQzs4QkFBbUIsb0NBQWdCO3VEQUFDO0FBRnZELGFBQWE7SUFMekIsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLFNBQVMsRUFBRSxDQUFDLDZCQUFhLEVBQUUsK0JBQWEsQ0FBQztLQUM1QyxDQUFDO3FDQUs0QixXQUFJLEVBQWtCLCtCQUFhLEVBQWMseUJBQWdCO0dBSmxGLGFBQWEsQ0FvRHpCO0FBcERZLHNDQUFhO0FBb0R6QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvdXNlci5tb2RlbFwiO1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCB7IFJhZFNpZGVDb21wb25lbnQgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLmNvbXBvbmVudFwiO1xubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vaG9tZS5jb21wb25lbnQuaHRtbFwiLFxuICAgIHByb3ZpZGVyczogW0NvbmZpZ3VyYXRpb24sIFdlYkFQSVNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQge1xuICAgIHVzZXIgPSBuZXcgVXNlcigpO1xuICAgIEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgcnM6IFJvdXRlckV4dGVuc2lvbnMpIHt9XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlOyB0aGlzLnJhZFNpZGVDb21wb25lbnQuaG9tZUNsYXNzID0gdHJ1ZTsgdGhpcy5yYWRTaWRlQ29tcG9uZW50Lm5hdkljb24gPSB0cnVlO1xuICAgICAgICB0aGlzLmdldE1lbWJlckluZm9TZXJ2aWNlKCk7XG4gICAgfVxuICAgIGdldE1lbWJlckluZm9TZXJ2aWNlKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYud2ViYXBpLmxvYWRlci5zaG93KHNlbGYud2ViYXBpLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLndlYmFwaS5nZXRNZW1iZXJJbmZvKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5GaXJzdE5hbWUgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5GaXJzdE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5GaXJzdE5hbWUuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5MYXN0TmFtZSA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLkxhc3ROYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uTGFzdE5hbWUuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5ET0IgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5ET0I7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5BZGRyZXNzMSA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLkFkZHJlc3MxO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuU3RhdGUgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5TdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLlppcCA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLlppcDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLlBob25lID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uUGhvbmUubWF0Y2gobmV3IFJlZ0V4cCgnLnsxLDR9JHwuezEsM30nLCAnZycpKS5qb2luKFwiLVwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLkVtYWlsID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uRW1haWw7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5QbGFuSWQgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5QbGFuSWQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlci5QbGFuT3B0aW9uID0gcmVzdWx0LlNlcnZpY2VDYWxsUmVzdWx0X01lbWJlckluZm8uUGxhbk9wdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLlJlbGF0aW9uc2hpcCA9IHJlc3VsdC5TZXJ2aWNlQ2FsbFJlc3VsdF9NZW1iZXJJbmZvLlJlbGF0aW9uc2hpcDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyLkV4dGVybmFsTWVtYmVySWQgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5FeHRlcm5hbE1lbWJlcklkO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVzZXIuUGljdHVyZURhdGEgPSByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5QaWN0dXJlLkZpbGVEYXRhO1xuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcIlVTRVJcIiwgSlNPTi5zdHJpbmdpZnkoc2VsZi51c2VyKSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgdGhlZ2V0TWVtYmVyIEluZm8gLyBTZXNzaW9uIGV4cGlyZWQgXCIgKyByZXN1bHQuU2VydmljZUNhbGxSZXN1bHRfTWVtYmVySW5mby5NZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnJvciBpbiBnZXR0aW5nIHRoZWdldE1lbWJlciBJbmZvIC8gU2Vzc2lvbiBleHBpcmVkLi4uLi4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgb3BlblByb2ZpbGUoZGF0YTogYW55KSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi53ZWJhcGkubG9hZGVyLnNob3coc2VsZi53ZWJhcGkub3B0aW9ucyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5ycy5uYXZpZ2F0ZShbZGF0YV0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxufTtcblxuXG5cblxuIl19