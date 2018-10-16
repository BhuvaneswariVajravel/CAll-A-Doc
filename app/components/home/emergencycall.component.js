"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var requestconsult_model_1 = require("./requestconsult.model");
//import { User } from "../../shared/model/user.model";
var radside_component_1 = require("../radside/radside.component");
var phone = require("nativescript-phone");
var application = require('application');
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
// EMERGENCY CALL
var EmergencyCallComponent = (function () {
    function EmergencyCallComponent(page, router, activatedRoutes) {
        this.page = page;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        //user = new User();
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
    }
    EmergencyCallComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        //	this.user = JSON.parse(ApplicationSettings.getString("USER"));
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
            }
        });
    };
    EmergencyCallComponent.prototype.callNumber = function () {
        var number = "911";
        var dialResult = phone.dial(number, true);
    };
    EmergencyCallComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/medicalemergency"], navigationExtras);
    };
    return EmergencyCallComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], EmergencyCallComponent.prototype, "radSideComponent", void 0);
EmergencyCallComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./emergencycall.component.html",
        providers: [radside_component_1.RadSideComponent, web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, router_1.ActivatedRoute])
], EmergencyCallComponent);
exports.EmergencyCallComponent = EmergencyCallComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1lcmdlbmN5Y2FsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbWVyZ2VuY3ljYWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLCtEQUE0RDtBQUM1RCx1REFBdUQ7QUFDdkQsa0VBQWdFO0FBQ2hFLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN6Qyx5RUFBc0U7QUFDdEUsMEVBQXlFO0FBQ3pFLGlCQUFpQjtBQU9qQixJQUFhLHNCQUFzQjtJQUlsQyxnQ0FBb0IsSUFBVSxFQUFVLE1BQWMsRUFBVSxlQUErQjtRQUEzRSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUgvRixvQkFBb0I7UUFDcEIsbUJBQWMsR0FBRyxJQUFJLDBDQUFtQixFQUFFLENBQUM7SUFFd0QsQ0FBQztJQUVwRyx5Q0FBUSxHQUFSO1FBQUEsaUJBU0M7UUFSQSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDckMsaUVBQWlFO1FBQ2pFLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDN0QsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELDJDQUFVLEdBQVY7UUFDQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELHVDQUFNLEdBQU47UUFDQyxJQUFJLGdCQUFnQixHQUFxQjtZQUN4QyxXQUFXLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtTQUN2RSxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVGLDZCQUFDO0FBQUQsQ0FBQyxBQTdCRCxJQTZCQztBQTFCNkI7SUFBNUIsZ0JBQVMsQ0FBQyxvQ0FBZ0IsQ0FBQzs4QkFBbUIsb0NBQWdCO2dFQUFDO0FBSHBELHNCQUFzQjtJQUxsQyxnQkFBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSxnQ0FBZ0M7UUFDN0MsU0FBUyxFQUFFLENBQUMsb0NBQWdCLEVBQUUsK0JBQWEsRUFBRSw2QkFBYSxDQUFDO0tBQzNELENBQUM7cUNBS3lCLFdBQUksRUFBa0IsZUFBTSxFQUEyQix1QkFBYztHQUpuRixzQkFBc0IsQ0E2QmxDO0FBN0JZLHdEQUFzQjtBQTZCbEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSwgTmF2aWdhdGlvbkV4dHJhcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IFJlcXVlc3RDb25zdWx0TW9kZWwgfSBmcm9tIFwiLi9yZXF1ZXN0Y29uc3VsdC5tb2RlbFwiXG4vL2ltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL3VzZXIubW9kZWxcIjtcbmltcG9ydCB7IFJhZFNpZGVDb21wb25lbnQgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLmNvbXBvbmVudFwiO1xubGV0IHBob25lID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1waG9uZVwiKTtcbmxldCBhcHBsaWNhdGlvbiA9IHJlcXVpcmUoJ2FwcGxpY2F0aW9uJyk7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvblwiO1xuLy8gRU1FUkdFTkNZIENBTExcblxuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vZW1lcmdlbmN5Y2FsbC5jb21wb25lbnQuaHRtbFwiLFxuXHRwcm92aWRlcnM6IFtSYWRTaWRlQ29tcG9uZW50LCBXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uXVxufSlcbmV4cG9ydCBjbGFzcyBFbWVyZ2VuY3lDYWxsQ29tcG9uZW50IHtcblx0Ly91c2VyID0gbmV3IFVzZXIoKTtcblx0cmVxdWVzdGNvbnN1bHQgPSBuZXcgUmVxdWVzdENvbnN1bHRNb2RlbCgpO1xuXHRAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXM6IEFjdGl2YXRlZFJvdXRlKSB7IH1cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcblx0XHR0aGlzLnJhZFNpZGVDb21wb25lbnQucmNDbGFzcyA9IHRydWU7XG5cdFx0Ly9cdHRoaXMudXNlciA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSXCIpKTtcblx0XHR0aGlzLmFjdGl2YXRlZFJvdXRlcy5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcblx0XHRcdGlmIChwYXJhbXNbXCJSRVFVRVNUX0NPTlNVTFRcIl0gIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMucmVxdWVzdGNvbnN1bHQgPSBKU09OLnBhcnNlKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRjYWxsTnVtYmVyKCkge1xuXHRcdGxldCBudW1iZXIgPSBcIjkxMVwiO1xuXHRcdGxldCBkaWFsUmVzdWx0ID0gcGhvbmUuZGlhbChudW1iZXIsIHRydWUpO1xuXHR9XG5cblx0Z29iYWNrKCkge1xuXHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuXHRcdH07XG5cdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21lZGljYWxlbWVyZ2VuY3lcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHR9XG5cbn07IFxuIl19