"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var dialogs = require("ui/dialogs");
var xml2js = require("nativescript-xml2js");
var TermsConditionsComponent = (function () {
    function TermsConditionsComponent(page, router, activatedRoutes, webapi) {
        this.page = page;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.webapi = webapi;
        this.activateAccount = {};
    }
    TermsConditionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["ACTIVATE_ACCOUNT"] != undefined) {
                _this.activateAccount = JSON.parse(params["ACTIVATE_ACCOUNT"]);
            }
        });
    };
    TermsConditionsComponent.prototype.activate = function () {
        if (this.webapi.netConnectivityCheck()) {
            var self_1 = this;
            self_1.webapi.loader.show(self_1.webapi.options);
            this.webapi.activate_http(this.activateAccount).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_Activate.Successful == "true") {
                        var navigationExtras = {
                            queryParams: { "LOGIN_CREDENTIALS": JSON.stringify(result) }
                        };
                        self_1.router.navigate(["/orderconfirmation"], navigationExtras);
                        self_1.webapi.loader.hide();
                    }
                    else {
                        self_1.webapi.loader.hide();
                        dialogs.alert({
                            message: "We could not find the member in the system based on the information provided. Please call customer service 1-844-362-2447 to activate your account.",
                            okButtonText: "Ok"
                        });
                    }
                });
            }, function (error) {
                self_1.webapi.loader.hide();
                console.log("Error while activating. " + error);
            });
        }
    };
    return TermsConditionsComponent;
}());
TermsConditionsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./termsconditions.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, router_1.ActivatedRoute, web_api_service_1.WebAPIService])
], TermsConditionsComponent);
exports.TermsConditionsComponent = TermsConditionsComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybXNjb25kaXRpb25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlcm1zY29uZGl0aW9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUU7QUFDekUsMENBQTJFO0FBQzNFLGdDQUErQjtBQUMvQiwwRUFBeUU7QUFDekUseUVBQXNFO0FBQ3RFLG9DQUF1QztBQUN2QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQU01QyxJQUFhLHdCQUF3QjtJQUVwQyxrQ0FBb0IsSUFBVSxFQUFVLE1BQWMsRUFBVSxlQUErQixFQUFVLE1BQXFCO1FBQTFHLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUQ5SCxvQkFBZSxHQUFRLEVBQUUsQ0FBQztJQUN3RyxDQUFDO0lBQ25JLDJDQUFRLEdBQVI7UUFBQSxpQkFPQztRQU5BLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQy9ELENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFDRCwyQ0FBUSxHQUFSO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsTUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUk7Z0JBQzdELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxNQUFNO29CQUM3RSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3BELElBQUksZ0JBQWdCLEdBQXFCOzRCQUN4QyxXQUFXLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO3lCQUM1RCxDQUFDO3dCQUNGLE1BQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO3dCQUM5RCxNQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDM0IsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDUCxNQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQzs0QkFDYixPQUFPLEVBQUUscUpBQXFKOzRCQUM5SixZQUFZLEVBQUUsSUFBSTt5QkFDbEIsQ0FBQyxDQUFDO29CQUNKLENBQUM7Z0JBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLEVBQ0EsVUFBQSxLQUFLO2dCQUNKLE1BQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNGLENBQUM7SUFDRiwrQkFBQztBQUFELENBQUMsQUF0Q0QsSUFzQ0M7QUF0Q1ksd0JBQXdCO0lBTHBDLGdCQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsV0FBVyxFQUFFLGtDQUFrQztRQUMvQyxTQUFTLEVBQUUsQ0FBQywrQkFBYSxFQUFFLDZCQUFhLENBQUM7S0FDekMsQ0FBQztxQ0FHeUIsV0FBSSxFQUFrQixlQUFNLEVBQTJCLHVCQUFjLEVBQWtCLCtCQUFhO0dBRmxILHdCQUF3QixDQXNDcEM7QUF0Q1ksNERBQXdCO0FBc0NwQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmltcG9ydCBkaWFsb2dzID0gcmVxdWlyZShcInVpL2RpYWxvZ3NcIik7XG5sZXQgeG1sMmpzID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC14bWwyanNcIik7XG5AQ29tcG9uZW50KHtcblx0bW9kdWxlSWQ6IG1vZHVsZS5pZCxcblx0dGVtcGxhdGVVcmw6IFwiLi90ZXJtc2NvbmRpdGlvbnMuY29tcG9uZW50Lmh0bWxcIixcblx0cHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgVGVybXNDb25kaXRpb25zQ29tcG9uZW50IHtcblx0YWN0aXZhdGVBY2NvdW50OiBhbnkgPSB7fTtcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlczogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlKSB7IH1cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG5cdFx0dGhpcy5hY3RpdmF0ZWRSb3V0ZXMucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiQUNUSVZBVEVfQUNDT1VOVFwiXSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5hY3RpdmF0ZUFjY291bnQgPSBKU09OLnBhcnNlKHBhcmFtc1tcIkFDVElWQVRFX0FDQ09VTlRcIl0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGFjdGl2YXRlKCkge1xuXHRcdGlmICh0aGlzLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcblx0XHRcdHRoaXMud2ViYXBpLmFjdGl2YXRlX2h0dHAodGhpcy5hY3RpdmF0ZUFjY291bnQpLnN1YnNjcmliZShkYXRhID0+IHtcblx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5BUElSZXN1bHRfQWN0aXZhdGUuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0bGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG5cdFx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiTE9HSU5fQ1JFREVOVElBTFNcIjogSlNPTi5zdHJpbmdpZnkocmVzdWx0KSB9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0c2VsZi5yb3V0ZXIubmF2aWdhdGUoW1wiL29yZGVyY29uZmlybWF0aW9uXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKVxuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHRcdGRpYWxvZ3MuYWxlcnQoe1xuXHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBcIldlIGNvdWxkIG5vdCBmaW5kIHRoZSBtZW1iZXIgaW4gdGhlIHN5c3RlbSBiYXNlZCBvbiB0aGUgaW5mb3JtYXRpb24gcHJvdmlkZWQuIFBsZWFzZSBjYWxsIGN1c3RvbWVyIHNlcnZpY2UgMS04NDQtMzYyLTI0NDcgdG8gYWN0aXZhdGUgeW91ciBhY2NvdW50LlwiLFxuXHRcdFx0XHRcdFx0XHRva0J1dHRvblRleHQ6IFwiT2tcIlxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgYWN0aXZhdGluZy4gXCIgKyBlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTsiXX0=