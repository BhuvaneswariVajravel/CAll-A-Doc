"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var requestconsult_model_1 = require("./requestconsult.model");
var radside_component_1 = require("../radside/radside.component");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
// PHARMACY
var BillingComponent = (function () {
    function BillingComponent(page, router, activatedRoutes) {
        this.page = page;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
    }
    BillingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.rcClass = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
            }
        });
    };
    BillingComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        if (this.requestconsult.SetPreferredPharmacy) {
            this.router.navigate(["/pharmacy"], navigationExtras);
        }
        else {
            this.router.navigate(["/searchpharmacy"], navigationExtras);
        }
    };
    BillingComponent.prototype.showNextPage = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/summary"], navigationExtras);
    };
    return BillingComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], BillingComponent.prototype, "radSideComponent", void 0);
BillingComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./billing.component.html",
        providers: [radside_component_1.RadSideComponent, web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, router_1.ActivatedRoute])
], BillingComponent);
exports.BillingComponent = BillingComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlsbGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiaWxsaW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLCtEQUE2RDtBQUM3RCxrRUFBZ0U7QUFDaEUseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSxXQUFXO0FBTVgsSUFBYSxnQkFBZ0I7SUFHNUIsMEJBQW9CLElBQVUsRUFBVSxNQUFjLEVBQVUsZUFBK0I7UUFBM0UsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFGL0YsbUJBQWMsR0FBRyxJQUFJLDBDQUFtQixFQUFFLENBQUM7SUFFd0QsQ0FBQztJQUNwRyxtQ0FBUSxHQUFSO1FBQUEsaUJBUUM7UUFQQSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtZQUNoRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxLQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUM3RCxDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0QsaUNBQU0sR0FBTjtRQUNDLElBQUksZ0JBQWdCLEdBQXFCO1lBQ3hDLFdBQVcsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1NBQ3ZFLENBQUM7UUFDRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDN0QsQ0FBQztJQUNGLENBQUM7SUFDRCx1Q0FBWSxHQUFaO1FBQ0MsSUFBSSxnQkFBZ0IsR0FBcUI7WUFDeEMsV0FBVyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7U0FDdkUsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0YsdUJBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBM0I2QjtJQUE1QixnQkFBUyxDQUFDLG9DQUFnQixDQUFDOzhCQUFtQixvQ0FBZ0I7MERBQUM7QUFGcEQsZ0JBQWdCO0lBTDVCLGdCQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLDBCQUEwQjtRQUN2QyxTQUFTLEVBQUUsQ0FBQyxvQ0FBZ0IsRUFBRSwrQkFBYSxFQUFFLDZCQUFhLENBQUM7S0FDM0QsQ0FBQztxQ0FJeUIsV0FBSSxFQUFrQixlQUFNLEVBQTJCLHVCQUFjO0dBSG5GLGdCQUFnQixDQTZCNUI7QUE3QlksNENBQWdCO0FBNkI1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgUmVxdWVzdENvbnN1bHRNb2RlbCB9IGZyb20gXCIuL3JlcXVlc3Rjb25zdWx0Lm1vZGVsXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG4vLyBQSEFSTUFDWVxuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vYmlsbGluZy5jb21wb25lbnQuaHRtbFwiLFxuXHRwcm92aWRlcnM6IFtSYWRTaWRlQ29tcG9uZW50LCBXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uXVxufSlcbmV4cG9ydCBjbGFzcyBCaWxsaW5nQ29tcG9uZW50IHtcblx0cmVxdWVzdGNvbnN1bHQgPSBuZXcgUmVxdWVzdENvbnN1bHRNb2RlbCgpO1xuXHRAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXM6IEFjdGl2YXRlZFJvdXRlKSB7IH1cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG5cdFx0dGhpcy5yYWRTaWRlQ29tcG9uZW50LnJjQ2xhc3MgPSB0cnVlO1xuXHRcdHRoaXMuYWN0aXZhdGVkUm91dGVzLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuXHRcdFx0aWYgKHBhcmFtc1tcIlJFUVVFU1RfQ09OU1VMVFwiXSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5yZXF1ZXN0Y29uc3VsdCA9IEpTT04ucGFyc2UocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRnb2JhY2soKSB7XG5cdFx0bGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG5cdFx0XHRxdWVyeVBhcmFtczogeyBcIlJFUVVFU1RfQ09OU1VMVFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlcXVlc3Rjb25zdWx0KSB9XG5cdFx0fTtcblx0XHRpZiAodGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXRQcmVmZXJyZWRQaGFybWFjeSkge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3BoYXJtYWN5XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NlYXJjaHBoYXJtYWN5XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9XG5cdH1cblx0c2hvd05leHRQYWdlKCkge1xuXHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0cXVlcnlQYXJhbXM6IHsgXCJSRVFVRVNUX0NPTlNVTFRcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1ZXN0Y29uc3VsdCkgfVxuXHRcdH07XG5cdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3N1bW1hcnlcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHR9XG59OyJdfQ==