"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var requestconsult_model_1 = require("./requestconsult.model");
// CONFIRMATION
var ConfirmationComponent = (function () {
    function ConfirmationComponent(page, activatedRoutes) {
        this.page = page;
        this.activatedRoutes = activatedRoutes;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.diagnosticconsult = false;
        this.emailconsult = false;
    }
    ConfirmationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                if (_this.requestconsult.ServiceType == 3) {
                    _this.diagnosticconsult = true;
                }
                else if (_this.requestconsult.ServiceType == 4) {
                    _this.emailconsult = true;
                }
            }
        });
    };
    return ConfirmationComponent;
}());
ConfirmationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./confirmation.component.html"
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.ActivatedRoute])
], ConfirmationComponent);
exports.ConfirmationComponent = ConfirmationComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybWF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpcm1hdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQWlEO0FBQ2pELGdDQUErQjtBQUMvQiwrREFBNkQ7QUFDN0QsZUFBZTtBQUtmLElBQWEscUJBQXFCO0lBR2pDLCtCQUFvQixJQUFVLEVBQVUsZUFBK0I7UUFBbkQsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUZ2RSxtQkFBYyxHQUFHLElBQUksMENBQW1CLEVBQUUsQ0FBQztRQUMzQyxzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFBQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztJQUNTLENBQUM7SUFDNUUsd0NBQVEsR0FBUjtRQUFBLGlCQVlDO1FBWEEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7Z0JBQy9CLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNGLDRCQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQztBQWpCWSxxQkFBcUI7SUFKakMsZ0JBQVMsQ0FBQztRQUNWLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsK0JBQStCO0tBQzVDLENBQUM7cUNBSXlCLFdBQUksRUFBMkIsdUJBQWM7R0FIM0QscUJBQXFCLENBaUJqQztBQWpCWSxzREFBcUI7QUFpQmpDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IFJlcXVlc3RDb25zdWx0TW9kZWwgfSBmcm9tIFwiLi9yZXF1ZXN0Y29uc3VsdC5tb2RlbFwiO1xuLy8gQ09ORklSTUFUSU9OXG5AQ29tcG9uZW50KHtcblx0bW9kdWxlSWQ6IG1vZHVsZS5pZCxcblx0dGVtcGxhdGVVcmw6IFwiLi9jb25maXJtYXRpb24uY29tcG9uZW50Lmh0bWxcIlxufSlcbmV4cG9ydCBjbGFzcyBDb25maXJtYXRpb25Db21wb25lbnQge1xuXHRyZXF1ZXN0Y29uc3VsdCA9IG5ldyBSZXF1ZXN0Q29uc3VsdE1vZGVsKCk7XG5cdGRpYWdub3N0aWNjb25zdWx0OiBib29sZWFuID0gZmFsc2U7IGVtYWlsY29uc3VsdDogYm9vbGVhbiA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVzOiBBY3RpdmF0ZWRSb3V0ZSkgeyB9XG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xuXHRcdHRoaXMuYWN0aXZhdGVkUm91dGVzLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuXHRcdFx0aWYgKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5yZXF1ZXN0Y29uc3VsdCA9IEpTT04ucGFyc2UocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdKTtcblx0XHRcdFx0aWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gMykge1xuXHRcdFx0XHRcdHRoaXMuZGlhZ25vc3RpY2NvbnN1bHQgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gNCkge1xuXHRcdFx0XHRcdHRoaXMuZW1haWxjb25zdWx0ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59O1xuIl19