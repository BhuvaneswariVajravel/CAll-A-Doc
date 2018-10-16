"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var ApplicationSettings = require("application-settings");
var requestconsult_model_1 = require("./requestconsult.model");
var radside_component_1 = require("../radside/radside.component");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
// SUMMARY
var SummaryComponent = (function () {
    function SummaryComponent(page, router, activatedRoutes, webapi) {
        this.page = page;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.webapi = webapi;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.user = {};
        this.consultList = [];
    }
    SummaryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
        }
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined)
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
        });
        //	console.log(JSON.stringify(this.requestconsult));
        if (this.requestconsult.ScheduleTimeNow) {
            var date = new Date();
            this.scheduledTime = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
        else {
            this.scheduledTime = this.requestconsult.ScheduleTimeFuture;
        }
        if (this.requestconsult.ShortTermConditionChecked) {
            var input = {};
            input.conditionType = "Short Term Medical Condition";
            input.conditionDescription = this.requestconsult.ShortTermConditionDescription;
            this.consultList.push(input);
        }
        if (this.requestconsult.LongTermConditionChecked) {
            var input = {};
            input.conditionType = "Long Term Medical Condition";
            input.conditionDescription = this.requestconsult.LongTermConditionDescription;
            this.consultList.push(input);
        }
        if (this.requestconsult.MedicationRefillChecked) {
            var input = {};
            input.conditionType = "Medication Refill";
            input.conditionDescription = this.requestconsult.MedicationRefillDescription1 + "," + this.requestconsult.MedicationRefillDescription2;
            ;
            this.consultList.push(input);
        }
        if (this.requestconsult.OtherHealthIssuesChecked) {
            var input = {};
            input.conditionType = "Other Health Issues";
            input.conditionDescription = this.requestconsult.OtherHealthIssuesDescription;
            this.consultList.push(input);
        }
    };
    SummaryComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/billing"], navigationExtras);
    };
    SummaryComponent.prototype.showNextPage = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/additionalquestions"], navigationExtras);
    };
    SummaryComponent.prototype.convertTime = function (time24) {
        return this.webapi.convertTime24to12(time24);
    };
    return SummaryComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], SummaryComponent.prototype, "radSideComponent", void 0);
SummaryComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./summary.component.html",
        providers: [radside_component_1.RadSideComponent, web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, router_1.ActivatedRoute, web_api_service_1.WebAPIService])
], SummaryComponent);
exports.SummaryComponent = SummaryComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdW1tYXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLDBEQUE0RDtBQUM1RCwrREFBNkQ7QUFDN0Qsa0VBQWdFO0FBQ2hFLHlFQUFzRTtBQUN0RSwwRUFBeUU7QUFFekUsVUFBVTtBQU9WLElBQWEsZ0JBQWdCO0lBTTVCLDBCQUFvQixJQUFVLEVBQVUsTUFBYyxFQUFVLGVBQStCLEVBQVUsTUFBb0I7UUFBekcsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFjO1FBTDdILG1CQUFjLEdBQUcsSUFBSSwwQ0FBbUIsRUFBRSxDQUFDO1FBRTNDLFNBQUksR0FBUSxFQUFFLENBQUM7UUFDZixnQkFBVyxHQUFRLEVBQUUsQ0FBQztJQUUyRyxDQUFDO0lBQ2xJLG1DQUFRLEdBQVI7UUFBQSxpQkE0Q0M7UUEzQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdkUsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUNELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksU0FBUyxDQUFDO2dCQUMxQyxLQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztRQUNILG9EQUFvRDtRQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN4SyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7UUFDN0QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksS0FBSyxHQUFRLEVBQUUsQ0FBQztZQUNwQixLQUFLLENBQUMsYUFBYSxHQUFHLDhCQUE4QixDQUFDO1lBQ3JELEtBQUssQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLDZCQUE2QixDQUFDO1lBQy9FLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLEtBQUssR0FBUSxFQUFFLENBQUM7WUFDcEIsS0FBSyxDQUFDLGFBQWEsR0FBRyw2QkFBNkIsQ0FBQztZQUNwRCxLQUFLLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBQztZQUM5RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxLQUFLLEdBQVEsRUFBRSxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxhQUFhLEdBQUcsbUJBQW1CLENBQUM7WUFDMUMsS0FBSyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsNEJBQTRCLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsNEJBQTRCLENBQUM7WUFBQSxDQUFDO1lBQ3hJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLEtBQUssR0FBUSxFQUFFLENBQUM7WUFDcEIsS0FBSyxDQUFDLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQztZQUM1QyxLQUFLLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBQztZQUM5RSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0YsQ0FBQztJQUVELGlDQUFNLEdBQU47UUFDQyxJQUFJLGdCQUFnQixHQUFxQjtZQUN4QyxXQUFXLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtTQUN2RSxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCx1Q0FBWSxHQUFaO1FBQ0MsSUFBSSxnQkFBZ0IsR0FBcUI7WUFDeEMsV0FBVyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7U0FDdkUsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDQyxzQ0FBVyxHQUFYLFVBQVksTUFBTTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFyRUQsSUFxRUM7QUFoRTZCO0lBQTVCLGdCQUFTLENBQUMsb0NBQWdCLENBQUM7OEJBQW1CLG9DQUFnQjswREFBQztBQUxwRCxnQkFBZ0I7SUFMNUIsZ0JBQVMsQ0FBQztRQUNWLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsMEJBQTBCO1FBQ3ZDLFNBQVMsRUFBRSxDQUFDLG9DQUFnQixFQUFFLCtCQUFhLEVBQUUsNkJBQWEsQ0FBQztLQUMzRCxDQUFDO3FDQU95QixXQUFJLEVBQWtCLGVBQU0sRUFBMkIsdUJBQWMsRUFBaUIsK0JBQWE7R0FOakgsZ0JBQWdCLENBcUU1QjtBQXJFWSw0Q0FBZ0I7QUFxRTVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgUmVxdWVzdENvbnN1bHRNb2RlbCB9IGZyb20gXCIuL3JlcXVlc3Rjb25zdWx0Lm1vZGVsXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5cbi8vIFNVTU1BUllcblxuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vc3VtbWFyeS5jb21wb25lbnQuaHRtbFwiLFxuXHRwcm92aWRlcnM6IFtSYWRTaWRlQ29tcG9uZW50LCBXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uXVxufSlcbmV4cG9ydCBjbGFzcyBTdW1tYXJ5Q29tcG9uZW50IHtcblx0cmVxdWVzdGNvbnN1bHQgPSBuZXcgUmVxdWVzdENvbnN1bHRNb2RlbCgpO1xuXHRzY2hlZHVsZWRUaW1lOiBhbnk7XG5cdHVzZXI6IGFueSA9IHt9O1xuXHRjb25zdWx0TGlzdDogYW55ID0gW107XG5cdEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlczogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgd2ViYXBpOldlYkFQSVNlcnZpY2UpIHsgfVxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTsgdGhpcy5yYWRTaWRlQ29tcG9uZW50LnJjQ2xhc3MgPSB0cnVlO1xuXHRcdGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcIlVTRVJcIikpIHtcblx0XHRcdHRoaXMudXNlciA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJVU0VSXCIpKTtcblx0XHR9XG5cdFx0dGhpcy5hY3RpdmF0ZWRSb3V0ZXMucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdICE9IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy5yZXF1ZXN0Y29uc3VsdCA9IEpTT04ucGFyc2UocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdKTtcblx0XHR9KTtcblx0XHQvL1x0Y29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkpO1xuXHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LlNjaGVkdWxlVGltZU5vdykge1xuXHRcdFx0bGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0dGhpcy5zY2hlZHVsZWRUaW1lID0gKGRhdGUuZ2V0TW9udGgoKSsxKSArIFwiL1wiICsgZGF0ZS5nZXREYXRlKCkgKyBcIi9cIiArIGRhdGUuZ2V0RnVsbFllYXIoKSArIFwiIFwiICsgZGF0ZS5nZXRIb3VycygpICsgXCI6XCIgKyBkYXRlLmdldE1pbnV0ZXMoKSArIFwiOlwiICsgZGF0ZS5nZXRTZWNvbmRzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2NoZWR1bGVkVGltZSA9IHRoaXMucmVxdWVzdGNvbnN1bHQuU2NoZWR1bGVUaW1lRnV0dXJlO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LlNob3J0VGVybUNvbmRpdGlvbkNoZWNrZWQpIHtcblx0XHRcdGxldCBpbnB1dDogYW55ID0ge307XG5cdFx0XHRpbnB1dC5jb25kaXRpb25UeXBlID0gXCJTaG9ydCBUZXJtIE1lZGljYWwgQ29uZGl0aW9uXCI7XG5cdFx0XHRpbnB1dC5jb25kaXRpb25EZXNjcmlwdGlvbiA9IHRoaXMucmVxdWVzdGNvbnN1bHQuU2hvcnRUZXJtQ29uZGl0aW9uRGVzY3JpcHRpb247XG5cdFx0XHR0aGlzLmNvbnN1bHRMaXN0LnB1c2goaW5wdXQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LkxvbmdUZXJtQ29uZGl0aW9uQ2hlY2tlZCkge1xuXHRcdFx0bGV0IGlucHV0OiBhbnkgPSB7fTtcblx0XHRcdGlucHV0LmNvbmRpdGlvblR5cGUgPSBcIkxvbmcgVGVybSBNZWRpY2FsIENvbmRpdGlvblwiO1xuXHRcdFx0aW5wdXQuY29uZGl0aW9uRGVzY3JpcHRpb24gPSB0aGlzLnJlcXVlc3Rjb25zdWx0LkxvbmdUZXJtQ29uZGl0aW9uRGVzY3JpcHRpb247XG5cdFx0XHR0aGlzLmNvbnN1bHRMaXN0LnB1c2goaW5wdXQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYXRpb25SZWZpbGxDaGVja2VkKSB7XG5cdFx0XHRsZXQgaW5wdXQ6IGFueSA9IHt9O1xuXHRcdFx0aW5wdXQuY29uZGl0aW9uVHlwZSA9IFwiTWVkaWNhdGlvbiBSZWZpbGxcIjtcblx0XHRcdGlucHV0LmNvbmRpdGlvbkRlc2NyaXB0aW9uID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5NZWRpY2F0aW9uUmVmaWxsRGVzY3JpcHRpb24xICsgXCIsXCIgKyB0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYXRpb25SZWZpbGxEZXNjcmlwdGlvbjI7O1xuXHRcdFx0dGhpcy5jb25zdWx0TGlzdC5wdXNoKGlucHV0KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5PdGhlckhlYWx0aElzc3Vlc0NoZWNrZWQpIHtcblx0XHRcdGxldCBpbnB1dDogYW55ID0ge307XG5cdFx0XHRpbnB1dC5jb25kaXRpb25UeXBlID0gXCJPdGhlciBIZWFsdGggSXNzdWVzXCI7XG5cdFx0XHRpbnB1dC5jb25kaXRpb25EZXNjcmlwdGlvbiA9IHRoaXMucmVxdWVzdGNvbnN1bHQuT3RoZXJIZWFsdGhJc3N1ZXNEZXNjcmlwdGlvbjtcblx0XHRcdHRoaXMuY29uc3VsdExpc3QucHVzaChpbnB1dCk7XG5cdFx0fVxuXHR9XG5cblx0Z29iYWNrKCkge1xuXHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuXHRcdH07XG5cdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2JpbGxpbmdcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHR9XG5cblx0c2hvd05leHRQYWdlKCkge1xuXHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuXHRcdH07XG5cdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2FkZGl0aW9uYWxxdWVzdGlvbnNcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHR9XG5cdCAgY29udmVydFRpbWUodGltZTI0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYmFwaS5jb252ZXJ0VGltZTI0dG8xMih0aW1lMjQpO1xuICAgIH1cbn07XG5cblxuIl19