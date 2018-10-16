"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var requestconsult_model_1 = require("./requestconsult.model");
var radside_component_1 = require("../radside/radside.component");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
// MEDICAL EMERGENCY
var application = require('application');
var MedicalEmergencyComponent = (function () {
    function MedicalEmergencyComponent(page, router, activatedRoutes) {
        this.page = page;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
    }
    MedicalEmergencyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.radSideComponent.navIcon = false;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined)
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
        });
    };
    MedicalEmergencyComponent.prototype.showNextPage = function (page) {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/" + page], navigationExtras);
    };
    MedicalEmergencyComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/servicetype"], navigationExtras);
    };
    return MedicalEmergencyComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], MedicalEmergencyComponent.prototype, "radSideComponent", void 0);
MedicalEmergencyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./medicalemergency.component.html",
        providers: [radside_component_1.RadSideComponent, web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, router_1.ActivatedRoute])
], MedicalEmergencyComponent);
exports.MedicalEmergencyComponent = MedicalEmergencyComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWNhbGVtZXJnZW5jeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZWRpY2FsZW1lcmdlbmN5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLCtEQUE2RDtBQUM3RCxrRUFBZ0U7QUFDaEUseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUV6RSxvQkFBb0I7QUFDcEIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBTXpDLElBQWEseUJBQXlCO0lBR3JDLG1DQUFvQixJQUFVLEVBQVUsTUFBYyxFQUFVLGVBQStCO1FBQTNFLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBRi9GLG1CQUFjLEdBQUcsSUFBSSwwQ0FBbUIsRUFBRSxDQUFDO0lBRXdELENBQUM7SUFDcEcsNENBQVEsR0FBUjtRQUFBLGlCQU9DO1FBTkEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDNUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtZQUNoRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxTQUFTLENBQUM7Z0JBQzFDLEtBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELGdEQUFZLEdBQVosVUFBYSxJQUFJO1FBQ2hCLElBQUksZ0JBQWdCLEdBQXFCO1lBQ3hDLFdBQVcsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1NBQ3ZFLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFDRCwwQ0FBTSxHQUFOO1FBQ0MsSUFBSSxnQkFBZ0IsR0FBcUI7WUFDeEMsV0FBVyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7U0FDdkUsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQ0YsZ0NBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBdEI2QjtJQUE1QixnQkFBUyxDQUFDLG9DQUFnQixDQUFDOzhCQUFtQixvQ0FBZ0I7bUVBQUM7QUFGcEQseUJBQXlCO0lBTHJDLGdCQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLG1DQUFtQztRQUNoRCxTQUFTLEVBQUUsQ0FBQyxvQ0FBZ0IsRUFBRSwrQkFBYSxFQUFFLDZCQUFhLENBQUM7S0FDM0QsQ0FBQztxQ0FJeUIsV0FBSSxFQUFrQixlQUFNLEVBQTJCLHVCQUFjO0dBSG5GLHlCQUF5QixDQXdCckM7QUF4QlksOERBQXlCO0FBd0JyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgUmVxdWVzdENvbnN1bHRNb2RlbCB9IGZyb20gXCIuL3JlcXVlc3Rjb25zdWx0Lm1vZGVsXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5cbi8vIE1FRElDQUwgRU1FUkdFTkNZXG5sZXQgYXBwbGljYXRpb24gPSByZXF1aXJlKCdhcHBsaWNhdGlvbicpO1xuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vbWVkaWNhbGVtZXJnZW5jeS5jb21wb25lbnQuaHRtbFwiLFxuXHRwcm92aWRlcnM6IFtSYWRTaWRlQ29tcG9uZW50LCBXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uXVxufSlcbmV4cG9ydCBjbGFzcyBNZWRpY2FsRW1lcmdlbmN5Q29tcG9uZW50IHtcblx0cmVxdWVzdGNvbnN1bHQgPSBuZXcgUmVxdWVzdENvbnN1bHRNb2RlbCgpO1xuXHRAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXM6IEFjdGl2YXRlZFJvdXRlKSB7IH1cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG5cdFx0dGhpcy5yYWRTaWRlQ29tcG9uZW50LnJjQ2xhc3MgPSB0cnVlOyB0aGlzLnJhZFNpZGVDb21wb25lbnQubmF2SWNvbiA9IGZhbHNlO1xuXHRcdHRoaXMuYWN0aXZhdGVkUm91dGVzLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuXHRcdFx0aWYgKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSAhPSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMucmVxdWVzdGNvbnN1bHQgPSBKU09OLnBhcnNlKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSk7XG5cdFx0fSk7XG5cdH1cblx0c2hvd05leHRQYWdlKHBhZ2UpIHtcblx0XHRsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcblx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHRoaXMucmVxdWVzdGNvbnN1bHQpIH1cblx0XHR9O1xuXHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9cIiArIHBhZ2VdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0fVxuXHRnb2JhY2soKSB7XG5cdFx0bGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG5cdFx0XHRxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlcXVlc3Rjb25zdWx0KSB9XG5cdFx0fTtcblx0XHR0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VydmljZXR5cGVcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHR9XG59OyJdfQ==