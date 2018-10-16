"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var requestconsult_model_1 = require("./requestconsult.model");
var radside_component_1 = require("../radside/radside.component");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
// CONSULTATION DETAILS 
var ConsultationDetailsComponent = (function () {
    function ConsultationDetailsComponent(page, router, activatedRoutes) {
        this.page = page;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.isShortTermCondChecked = false;
        this.isLongTermCondChecked = false;
        this.isMedicationRefillChecked = false;
        this.isOtherHealthIssuesChecked = false;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.shortTermComplaint = {};
        this.longTermComplaint = {};
        this.formSubmitted = false;
        this.medRefill = {};
        this.medRefill1 = {};
        this.otherIssues = {};
    }
    ConsultationDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                _this.isShortTermCondChecked = _this.requestconsult.ShortTermConditionChecked;
                _this.isLongTermCondChecked = _this.requestconsult.LongTermConditionChecked;
                _this.isMedicationRefillChecked = _this.requestconsult.MedicationRefillChecked;
                _this.isOtherHealthIssuesChecked = _this.requestconsult.OtherHealthIssuesChecked;
                _this.shortTermComplaint.description = _this.requestconsult.ShortTermConditionDescription;
                _this.longTermComplaint.description = _this.requestconsult.LongTermConditionDescription;
                _this.medRefill.description = _this.requestconsult.MedicationRefillDescription1;
                _this.medRefill1.description = _this.requestconsult.MedicationRefillDescription2;
                _this.otherIssues.description = _this.requestconsult.OtherHealthIssuesDescription;
            }
        });
    };
    ConsultationDetailsComponent.prototype.OnCheckEvent = function (conditionType) {
        this.formSubmitted = false;
        //console.log("conditionType....   " + conditionType);
        if (conditionType == 'ShortTerm') {
            this.isShortTermCondChecked = !this.isShortTermCondChecked;
            this.isLongTermCondChecked = false; //this.longTermComplaint.description != undefined ? this.longTermComplaint.description = "" : "";
            this.isMedicationRefillChecked = false; // this.medRefill.description != undefined ? this.medRefill.description = "" : "";
            this.isOtherHealthIssuesChecked = false; // this.otherIssues.description != undefined ? this.otherIssues.description = "" : "";
        }
        if (conditionType == 'LongTerm') {
            this.isLongTermCondChecked = !this.isLongTermCondChecked;
            this.isShortTermCondChecked = false; //this.shortTermComplaint.description != undefined ? this.shortTermComplaint.description = "" : "";
            this.isMedicationRefillChecked = false; //this.medRefill.description != undefined ? this.medRefill.description = "" : "";
            this.isOtherHealthIssuesChecked = false; // this.otherIssues.description != undefined ? this.otherIssues.description = "" : "";
        }
        if (conditionType == 'MedicationRefill') {
            this.isMedicationRefillChecked = !this.isMedicationRefillChecked;
            this.isLongTermCondChecked = false; // this.longTermComplaint.description != undefined ? this.longTermComplaint.description = "" : "";
            this.isShortTermCondChecked = false; // this.shortTermComplaint.description != undefined ? this.shortTermComplaint.description = "" : "";
            this.isOtherHealthIssuesChecked = false; // this.otherIssues.description != undefined ? this.otherIssues.description = "" : "";
        }
        if (conditionType == 'OtherHealthIssues') {
            this.isOtherHealthIssuesChecked = !this.isOtherHealthIssuesChecked;
            this.isLongTermCondChecked = false; //this.longTermComplaint.description != undefined ? this.longTermComplaint.description = "" : "";
            this.isShortTermCondChecked = false; //this.shortTermComplaint.description != undefined ? this.shortTermComplaint.description = "" : "";
            this.isMedicationRefillChecked = false; // this.medRefill.description != undefined ? this.medRefill.description = "" : "";
        }
    };
    ConsultationDetailsComponent.prototype.getComplaintDetails = function () {
        this.formSubmitted = true;
        if (this.isShortTermCondChecked || this.isLongTermCondChecked || this.isMedicationRefillChecked || this.isOtherHealthIssuesChecked) {
            var isValid = this.validate();
            if (isValid) {
                this.requestconsult.ShortTermConditionChecked = this.isShortTermCondChecked;
                this.requestconsult.LongTermConditionChecked = this.isLongTermCondChecked;
                this.requestconsult.MedicationRefillChecked = this.isMedicationRefillChecked;
                this.requestconsult.OtherHealthIssuesChecked = this.isOtherHealthIssuesChecked;
                this.requestconsult.ShortTermConditionDescription = this.shortTermComplaint.description;
                this.requestconsult.LongTermConditionDescription = this.longTermComplaint.description;
                this.requestconsult.MedicationRefillDescription1 = this.medRefill.description;
                this.requestconsult.MedicationRefillDescription2 = this.medRefill1.description;
                this.requestconsult.OtherHealthIssuesDescription = this.otherIssues.description;
                var navigationExtras = {
                    queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
                };
                this.router.navigate(["/scheduletype"], navigationExtras);
            }
        }
    };
    ConsultationDetailsComponent.prototype.validate = function () {
        if (this.isShortTermCondChecked && this.shortTermComplaint.description == undefined) {
            return false;
        }
        if (this.isLongTermCondChecked && this.longTermComplaint.description == undefined) {
            return false;
        }
        if (this.isMedicationRefillChecked && this.medRefill.description == undefined && this.medRefill1.description == undefined) {
            return false;
        }
        if (this.isOtherHealthIssuesChecked && this.otherIssues.description == undefined) {
            return false;
        }
        return true;
    };
    ConsultationDetailsComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/memberdetails"], navigationExtras);
    };
    return ConsultationDetailsComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], ConsultationDetailsComponent.prototype, "radSideComponent", void 0);
ConsultationDetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./consultationdetails.component.html",
        providers: [radside_component_1.RadSideComponent, web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, router_1.ActivatedRoute])
], ConsultationDetailsComponent);
exports.ConsultationDetailsComponent = ConsultationDetailsComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VsdGF0aW9uZGV0YWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zdWx0YXRpb25kZXRhaWxzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLCtEQUE2RDtBQUM3RCxrRUFBZ0U7QUFDaEUseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSx3QkFBd0I7QUFNeEIsSUFBYSw0QkFBNEI7SUFTckMsc0NBQW9CLElBQVUsRUFBVSxNQUFjLEVBQVUsZUFBK0I7UUFBM0UsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFSeEYsMkJBQXNCLEdBQVksS0FBSyxDQUFDO1FBQ3hDLDBCQUFxQixHQUFZLEtBQUssQ0FBQztRQUN2Qyw4QkFBeUIsR0FBWSxLQUFLLENBQUM7UUFDM0MsK0JBQTBCLEdBQVksS0FBSyxDQUFDO1FBQ25ELG1CQUFjLEdBQUcsSUFBSSwwQ0FBbUIsRUFBRSxDQUFDO1FBQzNDLHVCQUFrQixHQUFRLEVBQUUsQ0FBQztRQUFDLHNCQUFpQixHQUFRLEVBQUUsQ0FBQztRQUFDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ2pGLGNBQVMsR0FBUSxFQUFFLENBQUM7UUFBQyxlQUFVLEdBQVEsRUFBRSxDQUFDO1FBQUMsZ0JBQVcsR0FBUSxFQUFFLENBQUM7SUFFa0MsQ0FBQztJQUVwRywrQ0FBUSxHQUFSO1FBQUEsaUJBaUJDO1FBaEJHLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNyQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQzdDLEVBQUUsQ0FBQyxDQUFD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RUQsNkNBQU0sR0FBTjtRQUNJLElBQUksZ0JBQWdCLEdBQXFCO1lBQ3JDLFdBQVcsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1NBQzFFLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0wsbUNBQUM7QUFBRCxDQUFDLEFBNUdELElBNEdDO0FBcEdnQztJQUE1QixnQkFBUyxDQUFDLG9DQUFnQixDQUFDOzhCQUFtQixvQ0FBZ0I7c0VBQUM7QUFSdkQsNEJBQTRCO0lBTHhDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLHNDQUFzQztRQUNuRCxTQUFTLEVBQUUsQ0FBQyxvQ0FBZ0IsRUFBRSwrQkFBYSxFQUFFLDZCQUFhLENBQUM7S0FDOUQsQ0FBQztxQ0FVNEIsV0FBSSxFQUFrQixlQUFNLEVBQTJCLHVCQUFjO0dBVHRGLDRCQUE0QixDQTRHeEM7QUE1R1ksb0VBQTRCO0FBNEd4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgUmVxdWVzdENvbnN1bHRNb2RlbCB9IGZyb20gXCIuL3JlcXVlc3Rjb25zdWx0Lm1vZGVsXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG4vLyBDT05TVUxUQVRJT04gREVUQUlMUyBcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb25zdWx0YXRpb25kZXRhaWxzLmNvbXBvbmVudC5odG1sXCIsXG4gICAgcHJvdmlkZXJzOiBbUmFkU2lkZUNvbXBvbmVudCwgV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgQ29uc3VsdGF0aW9uRGV0YWlsc0NvbXBvbmVudCB7XG4gICAgcHVibGljIGlzU2hvcnRUZXJtQ29uZENoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNMb25nVGVybUNvbmRDaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzTWVkaWNhdGlvblJlZmlsbENoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNPdGhlckhlYWx0aElzc3Vlc0NoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0Y29uc3VsdCA9IG5ldyBSZXF1ZXN0Q29uc3VsdE1vZGVsKCk7XG4gICAgc2hvcnRUZXJtQ29tcGxhaW50OiBhbnkgPSB7fTsgbG9uZ1Rlcm1Db21wbGFpbnQ6IGFueSA9IHt9OyBmb3JtU3VibWl0dGVkID0gZmFsc2U7XG4gICAgbWVkUmVmaWxsOiBhbnkgPSB7fTsgbWVkUmVmaWxsMTogYW55ID0ge307IG90aGVySXNzdWVzOiBhbnkgPSB7fTtcbiAgICBAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlczogQWN0aXZhdGVkUm91dGUpIHsgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xuICAgICAgICB0aGlzLnJhZFNpZGVDb21wb25lbnQucmNDbGFzcyA9IHRydWU7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkUm91dGVzLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgICAgICAgaWYgKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3Rjb25zdWx0ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJSRVFVRVNUX0NPTlNVTFRcIl0pO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTaG9ydFRlcm1Db25kQ2hlY2tlZCA9IHRoaXMucmVxdWVzdGNvbnN1bHQuU2hvcnRUZXJtQ29uZGl0aW9uQ2hlY2tlZDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTG9uZ1Rlcm1Db25kQ2hlY2tlZCA9IHRoaXMucmVxdWVzdGNvbnN1bHQuTG9uZ1Rlcm1Db25kaXRpb25DaGVja2VkO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNNZWRpY2F0aW9uUmVmaWxsQ2hlY2tlZCA9IHRoaXMucmVxdWVzdGNvbnN1bHQuTWVkaWNhdGlvblJlZmlsbENoZWNrZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5pc090aGVySGVhbHRoSXNzdWVzQ2hlY2tlZCA9IHRoaXMucmVxdWVzdGNvbnN1bHQuT3RoZXJIZWFsdGhJc3N1ZXNDaGVja2VkO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvcnRUZXJtQ29tcGxhaW50LmRlc2NyaXB0aW9uID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5TaG9ydFRlcm1Db25kaXRpb25EZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmxvbmdUZXJtQ29tcGxhaW50LmRlc2NyaXB0aW9uID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5Mb25nVGVybUNvbmRpdGlvbkRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMubWVkUmVmaWxsLmRlc2NyaXB0aW9uID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5NZWRpY2F0aW9uUmVmaWxsRGVzY3JpcHRpb24xO1xuICAgICAgICAgICAgICAgIHRoaXMubWVkUmVmaWxsMS5kZXNjcmlwdGlvbiA9IHRoaXMucmVxdWVzdGNvbnN1bHQuTWVkaWNhdGlvblJlZmlsbERlc2NyaXB0aW9uMjtcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVySXNzdWVzLmRlc2NyaXB0aW9uID0gdGhpcy5yZXF1ZXN0Y29uc3VsdC5PdGhlckhlYWx0aElzc3Vlc0Rlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBPbkNoZWNrRXZlbnQoY29uZGl0aW9uVHlwZSkge1xuICAgICAgICB0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbmRpdGlvblR5cGUuLi4uICAgXCIgKyBjb25kaXRpb25UeXBlKTtcbiAgICAgICAgaWYgKGNvbmRpdGlvblR5cGUgPT0gJ1Nob3J0VGVybScpIHtcbiAgICAgICAgICAgIHRoaXMuaXNTaG9ydFRlcm1Db25kQ2hlY2tlZCA9ICF0aGlzLmlzU2hvcnRUZXJtQ29uZENoZWNrZWQ7XG4gICAgICAgICAgICB0aGlzLmlzTG9uZ1Rlcm1Db25kQ2hlY2tlZCA9IGZhbHNlOyAvL3RoaXMubG9uZ1Rlcm1Db21wbGFpbnQuZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkID8gdGhpcy5sb25nVGVybUNvbXBsYWludC5kZXNjcmlwdGlvbiA9IFwiXCIgOiBcIlwiO1xuICAgICAgICAgICAgdGhpcy5pc01lZGljYXRpb25SZWZpbGxDaGVja2VkID0gZmFsc2U7IC8vIHRoaXMubWVkUmVmaWxsLmRlc2NyaXB0aW9uICE9IHVuZGVmaW5lZCA/IHRoaXMubWVkUmVmaWxsLmRlc2NyaXB0aW9uID0gXCJcIiA6IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmlzT3RoZXJIZWFsdGhJc3N1ZXNDaGVja2VkID0gZmFsc2U7IC8vIHRoaXMub3RoZXJJc3N1ZXMuZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkID8gdGhpcy5vdGhlcklzc3Vlcy5kZXNjcmlwdGlvbiA9IFwiXCIgOiBcIlwiO1xuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvblR5cGUgPT0gJ0xvbmdUZXJtJykge1xuICAgICAgICAgICAgdGhpcy5pc0xvbmdUZXJtQ29uZENoZWNrZWQgPSAhdGhpcy5pc0xvbmdUZXJtQ29uZENoZWNrZWQ7XG4gICAgICAgICAgICB0aGlzLmlzU2hvcnRUZXJtQ29uZENoZWNrZWQgPSBmYWxzZTsgLy90aGlzLnNob3J0VGVybUNvbXBsYWludC5kZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgPyB0aGlzLnNob3J0VGVybUNvbXBsYWludC5kZXNjcmlwdGlvbiA9IFwiXCIgOiBcIlwiO1xuICAgICAgICAgICAgdGhpcy5pc01lZGljYXRpb25SZWZpbGxDaGVja2VkID0gZmFsc2U7IC8vdGhpcy5tZWRSZWZpbGwuZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkID8gdGhpcy5tZWRSZWZpbGwuZGVzY3JpcHRpb24gPSBcIlwiIDogXCJcIjtcbiAgICAgICAgICAgIHRoaXMuaXNPdGhlckhlYWx0aElzc3Vlc0NoZWNrZWQgPSBmYWxzZTsgLy8gdGhpcy5vdGhlcklzc3Vlcy5kZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgPyB0aGlzLm90aGVySXNzdWVzLmRlc2NyaXB0aW9uID0gXCJcIiA6IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvblR5cGUgPT0gJ01lZGljYXRpb25SZWZpbGwnKSB7XG4gICAgICAgICAgICB0aGlzLmlzTWVkaWNhdGlvblJlZmlsbENoZWNrZWQgPSAhdGhpcy5pc01lZGljYXRpb25SZWZpbGxDaGVja2VkO1xuICAgICAgICAgICAgdGhpcy5pc0xvbmdUZXJtQ29uZENoZWNrZWQgPSBmYWxzZTsgLy8gdGhpcy5sb25nVGVybUNvbXBsYWludC5kZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgPyB0aGlzLmxvbmdUZXJtQ29tcGxhaW50LmRlc2NyaXB0aW9uID0gXCJcIiA6IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmlzU2hvcnRUZXJtQ29uZENoZWNrZWQgPSBmYWxzZTsgLy8gdGhpcy5zaG9ydFRlcm1Db21wbGFpbnQuZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkID8gdGhpcy5zaG9ydFRlcm1Db21wbGFpbnQuZGVzY3JpcHRpb24gPSBcIlwiIDogXCJcIjtcbiAgICAgICAgICAgIHRoaXMuaXNPdGhlckhlYWx0aElzc3Vlc0NoZWNrZWQgPSBmYWxzZTsgLy8gdGhpcy5vdGhlcklzc3Vlcy5kZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgPyB0aGlzLm90aGVySXNzdWVzLmRlc2NyaXB0aW9uID0gXCJcIiA6IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvblR5cGUgPT0gJ090aGVySGVhbHRoSXNzdWVzJykge1xuICAgICAgICAgICAgdGhpcy5pc090aGVySGVhbHRoSXNzdWVzQ2hlY2tlZCA9ICF0aGlzLmlzT3RoZXJIZWFsdGhJc3N1ZXNDaGVja2VkO1xuICAgICAgICAgICAgdGhpcy5pc0xvbmdUZXJtQ29uZENoZWNrZWQgPSBmYWxzZTsgLy90aGlzLmxvbmdUZXJtQ29tcGxhaW50LmRlc2NyaXB0aW9uICE9IHVuZGVmaW5lZCA/IHRoaXMubG9uZ1Rlcm1Db21wbGFpbnQuZGVzY3JpcHRpb24gPSBcIlwiIDogXCJcIjtcbiAgICAgICAgICAgIHRoaXMuaXNTaG9ydFRlcm1Db25kQ2hlY2tlZCA9IGZhbHNlOyAvL3RoaXMuc2hvcnRUZXJtQ29tcGxhaW50LmRlc2NyaXB0aW9uICE9IHVuZGVmaW5lZCA/IHRoaXMuc2hvcnRUZXJtQ29tcGxhaW50LmRlc2NyaXB0aW9uID0gXCJcIiA6IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmlzTWVkaWNhdGlvblJlZmlsbENoZWNrZWQgPSBmYWxzZTsgLy8gdGhpcy5tZWRSZWZpbGwuZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkID8gdGhpcy5tZWRSZWZpbGwuZGVzY3JpcHRpb24gPSBcIlwiIDogXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENvbXBsYWludERldGFpbHMoKSB7XG4gICAgICAgIHRoaXMuZm9ybVN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmlzU2hvcnRUZXJtQ29uZENoZWNrZWQgfHwgdGhpcy5pc0xvbmdUZXJtQ29uZENoZWNrZWQgfHwgdGhpcy5pc01lZGljYXRpb25SZWZpbGxDaGVja2VkIHx8IHRoaXMuaXNPdGhlckhlYWx0aElzc3Vlc0NoZWNrZWQpIHtcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3Rjb25zdWx0LlNob3J0VGVybUNvbmRpdGlvbkNoZWNrZWQgPSB0aGlzLmlzU2hvcnRUZXJtQ29uZENoZWNrZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Y29uc3VsdC5Mb25nVGVybUNvbmRpdGlvbkNoZWNrZWQgPSB0aGlzLmlzTG9uZ1Rlcm1Db25kQ2hlY2tlZDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYXRpb25SZWZpbGxDaGVja2VkID0gdGhpcy5pc01lZGljYXRpb25SZWZpbGxDaGVja2VkO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdGNvbnN1bHQuT3RoZXJIZWFsdGhJc3N1ZXNDaGVja2VkID0gdGhpcy5pc090aGVySGVhbHRoSXNzdWVzQ2hlY2tlZDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3Rjb25zdWx0LlNob3J0VGVybUNvbmRpdGlvbkRlc2NyaXB0aW9uID0gdGhpcy5zaG9ydFRlcm1Db21wbGFpbnQuZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Y29uc3VsdC5Mb25nVGVybUNvbmRpdGlvbkRlc2NyaXB0aW9uID0gdGhpcy5sb25nVGVybUNvbXBsYWludC5kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYXRpb25SZWZpbGxEZXNjcmlwdGlvbjEgPSB0aGlzLm1lZFJlZmlsbC5kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3Rjb25zdWx0Lk1lZGljYXRpb25SZWZpbGxEZXNjcmlwdGlvbjIgPSB0aGlzLm1lZFJlZmlsbDEuZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Y29uc3VsdC5PdGhlckhlYWx0aElzc3Vlc0Rlc2NyaXB0aW9uID0gdGhpcy5vdGhlcklzc3Vlcy5kZXNjcmlwdGlvbjtcblxuICAgICAgICAgICAgICAgIGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlcXVlc3Rjb25zdWx0KSB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2NoZWR1bGV0eXBlXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhbGlkYXRlKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pc1Nob3J0VGVybUNvbmRDaGVja2VkICYmIHRoaXMuc2hvcnRUZXJtQ29tcGxhaW50LmRlc2NyaXB0aW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNMb25nVGVybUNvbmRDaGVja2VkICYmIHRoaXMubG9uZ1Rlcm1Db21wbGFpbnQuZGVzY3JpcHRpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc01lZGljYXRpb25SZWZpbGxDaGVja2VkICYmIHRoaXMubWVkUmVmaWxsLmRlc2NyaXB0aW9uID09IHVuZGVmaW5lZCAmJiB0aGlzLm1lZFJlZmlsbDEuZGVzY3JpcHRpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc090aGVySGVhbHRoSXNzdWVzQ2hlY2tlZCAmJiB0aGlzLm90aGVySXNzdWVzLmRlc2NyaXB0aW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdvYmFjaygpIHtcbiAgICAgICAgbGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlcXVlc3Rjb25zdWx0KSB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9tZW1iZXJkZXRhaWxzXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9XG59O1xuXG4iXX0=