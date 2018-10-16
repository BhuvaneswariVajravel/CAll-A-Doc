"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var requestconsult_model_1 = require("./requestconsult.model");
var radside_component_1 = require("../radside/radside.component");
var xml2js = require('nativescript-xml2js');
// SERVICE TYPE
var SecureEmailComponent = (function () {
    function SecureEmailComponent(page, webapi, router, activatedRoutes) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.formSubmitted = false;
    }
    SecureEmailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
            }
        });
    };
    SecureEmailComponent.prototype.showNextPage = function (sub, desc) {
        this.formSubmitted = true;
        var self = this;
        if (sub && desc && self.subject.trim() != '' && self.description.trim() != '' && self.webapi.netConnectivityCheck()) {
            this.webapi.consultationScheduleEmail_http(this.subject, this.description).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        var navigationExtras = {
                            queryParams: { "REQUEST_CONSULT": JSON.stringify(self.requestconsult) }
                        };
                        self.router.navigate(["/confirmation"], navigationExtras);
                    }
                    else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        // console.log("LOGOUT DUE SESSION TIME OUT IN SECURE EMAIL --->" + result.APIResult.Message);
                        self.webapi.logout();
                    }
                    else {
                        // console.log("Session expired/Error in email consult in secure email");
                    }
                });
            }, function (error) {
                // console.log("Error in email consult " + error);
            });
        }
    };
    SecureEmailComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/healthrecords"], navigationExtras);
    };
    return SecureEmailComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], SecureEmailComponent.prototype, "radSideComponent", void 0);
SecureEmailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./secureemail.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute])
], SecureEmailComponent);
exports.SecureEmailComponent = SecureEmailComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJlZW1haWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjdXJlZW1haWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTZEO0FBQzdELDBDQUEyRTtBQUMzRSxnQ0FBK0I7QUFDL0IsMEVBQXlFO0FBRXpFLHlFQUFzRTtBQUN0RSwrREFBNkQ7QUFDN0Qsa0VBQWdFO0FBRWhFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRTVDLGVBQWU7QUFNZixJQUFhLG9CQUFvQjtJQUk3Qiw4QkFBb0IsSUFBVSxFQUFVLE1BQXFCLEVBQVUsTUFBYyxFQUFVLGVBQStCO1FBQTFHLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUg5SCxtQkFBYyxHQUFHLElBQUksMENBQW1CLEVBQUUsQ0FBQztRQUNMLGtCQUFhLEdBQVksS0FBSyxDQUFDO0lBRTZELENBQUM7SUFFbkksdUNBQVEsR0FBUjtRQUFBLGlCQU9DO1FBTkcsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdkUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxLQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUNoRSxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsMkNBQVksR0FBWixVQUFhLEdBQUcsRUFBRSxJQUFJO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsSCxJQUFJLENBQUMsTUFBTSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUk7Z0JBQ3JGLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxNQUFNO29CQUMxRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN4QyxJQUFJLGdCQUFnQixHQUFxQjs0QkFDckMsV0FBVyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7eUJBQzFFLENBQUM7d0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUM5RCxDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSwrRkFBK0YsQ0FBQyxDQUFDLENBQUM7d0JBQ3RJLDhGQUE4Rjt3QkFDN0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDekIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTCx5RUFBeUU7b0JBQzVFLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLEVBQ0csVUFBQSxLQUFLO2dCQUNGLGtEQUFrRDtZQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7SUFDTCxDQUFDO0lBQ0QscUNBQU0sR0FBTjtRQUNJLElBQUksZ0JBQWdCLEdBQXFCO1lBQ3JDLFdBQVcsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1NBQzFFLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0wsMkJBQUM7QUFBRCxDQUFDLEFBM0NELElBMkNDO0FBeENnQztJQUE1QixnQkFBUyxDQUFDLG9DQUFnQixDQUFDOzhCQUFtQixvQ0FBZ0I7OERBQUM7QUFIdkQsb0JBQW9CO0lBTGhDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLDhCQUE4QjtRQUMzQyxTQUFTLEVBQUUsQ0FBQywrQkFBYSxFQUFFLDZCQUFhLEVBQUUsb0NBQWdCLENBQUM7S0FDOUQsQ0FBQztxQ0FLNEIsV0FBSSxFQUFrQiwrQkFBYSxFQUFrQixlQUFNLEVBQTJCLHVCQUFjO0dBSnJILG9CQUFvQixDQTJDaEM7QUEzQ1ksb0RBQW9CO0FBMkNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgV2ViQVBJU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvd2ViLWFwaS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSZXF1ZXN0Q29uc3VsdE1vZGVsIH0gZnJvbSBcIi4vcmVxdWVzdGNvbnN1bHQubW9kZWxcIjtcbmltcG9ydCB7IFJhZFNpZGVDb21wb25lbnQgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLmNvbXBvbmVudFwiO1xuXG5sZXQgeG1sMmpzID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXhtbDJqcycpO1xuXG4vLyBTRVJWSUNFIFRZUEVcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9zZWN1cmVlbWFpbC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFJhZFNpZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFNlY3VyZUVtYWlsQ29tcG9uZW50IHtcbiAgICByZXF1ZXN0Y29uc3VsdCA9IG5ldyBSZXF1ZXN0Q29uc3VsdE1vZGVsKCk7XG4gICAgc3ViamVjdDogc3RyaW5nOyBkZXNjcmlwdGlvbjogc3RyaW5nOyBmb3JtU3VibWl0dGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgQFZpZXdDaGlsZChSYWRTaWRlQ29tcG9uZW50KSByYWRTaWRlQ29tcG9uZW50OiBSYWRTaWRlQ29tcG9uZW50O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVzOiBBY3RpdmF0ZWRSb3V0ZSkgeyB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7IHRoaXMucmFkU2lkZUNvbXBvbmVudC5yY0NsYXNzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZXMucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdGNvbnN1bHQgPSBKU09OLnBhcnNlKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93TmV4dFBhZ2Uoc3ViLCBkZXNjKSB7XG4gICAgICAgIHRoaXMuZm9ybVN1Ym1pdHRlZCA9IHRydWU7IGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHN1YiAmJiBkZXNjICYmIHNlbGYuc3ViamVjdC50cmltKCkgIT0gJycgJiYgc2VsZi5kZXNjcmlwdGlvbi50cmltKCkgIT0gJycgJiYgc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgdGhpcy53ZWJhcGkuY29uc3VsdGF0aW9uU2NoZWR1bGVFbWFpbF9odHRwKHRoaXMuc3ViamVjdCwgdGhpcy5kZXNjcmlwdGlvbikuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeShzZWxmLnJlcXVlc3Rjb25zdWx0KSB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yb3V0ZXIubmF2aWdhdGUoW1wiL2NvbmZpcm1hdGlvblwiXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdC5NZXNzYWdlID09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJMT0dPVVQgRFVFIFNFU1NJT04gVElNRSBPVVQgSU4gU0VDVVJFIEVNQUlMIC0tLT5cIiArIHJlc3VsdC5BUElSZXN1bHQuTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQvRXJyb3IgaW4gZW1haWwgY29uc3VsdCBpbiBzZWN1cmUgZW1haWxcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZW1haWwgY29uc3VsdCBcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnb2JhY2soKSB7XG4gICAgICAgIGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvaGVhbHRocmVjb3Jkc1wiXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG4gICAgfVxufTsgXG4iXX0=