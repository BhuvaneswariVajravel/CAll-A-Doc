"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var ApplicationSettings = require("application-settings");
var user_model_1 = require("../../shared/model/user.model");
var web_api_service_1 = require("../../shared/services/web-api.service");
var requestconsult_model_1 = require("./requestconsult.model");
var radside_component_1 = require("../radside/radside.component");
//let xml2js = require('nativescript-xml2js');
//let application = require('application');
// SERVICE TYPE
var ServiceTypeComponent = (function () {
    function ServiceTypeComponent(page, webapi, router, activatedRoutes) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.activatedRoutes = activatedRoutes;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.mSelectedIndex = null;
        this.membersList = [];
        this.familyMembers = new nativescript_drop_down_1.ValueList();
        this.user = new user_model_1.User();
    }
    ServiceTypeComponent.prototype.ngOnInit = function () {
        this.radSideComponent.rcClass = true;
        this.page.actionBarHidden = true;
        this.radSideComponent.navIcon = true;
        this.user = JSON.parse(ApplicationSettings.getString("USER"));
        /* if (this.webapi.netConnectivityCheck()) {
             this.webapi.getFamilyMembers_http().subscribe(data => {
                 let self = this;
                 xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                     if (result.APIResult_FamilyMembers_Grid.Successful == "true") {
                         // console.log("Count  " + JSON.stringify(result.APIResult_FamilyMembers_Grid));
                         for (let loop = 0; loop < result.APIResult_FamilyMembers_Grid.FamilyMemberCount; loop++) {
                             if (result.APIResult_FamilyMembers_Grid.FamilyMemberCount == "1") {
                                 self.familyMembers.setItem(loop, {
                                     value: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem.PersonId,
                                     display: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem.FirstName + " " + result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem.LastName,
                                 });
                             } else {
                                 if (result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].RelationShip == "Primary Member") {
                                     self.familyMembers.setItem(loop, {
                                         value: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].PersonId,
                                         display: result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].FirstName + " " + result.APIResult_FamilyMembers_Grid.FamilyMemberList.APIResult_FamilyMemberItem[loop].LastName,
                                     });
                                 }
                             }
                         }
                         self.activatedRoutes.queryParams.subscribe(params => {
                             if (params["REQUEST_CONSULT"] != undefined) {
                                 self.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
                                 self.mSelectedIndex = self.familyMembers.getIndex(self.requestconsult.ExternalMemberId);
                             } else {
                                 self.mSelectedIndex = 0;
                             }
                         });
                     } else {
                         console.log("Error in getting the family members information / Session expired ");
                     }
                 });
             },
                 error => {
                     console.log("Error in getting the family members information.. " + error);
                 });
         }*/
    };
    /*  onMemberChange(args) {
          //console.log("Member Id " + this.familyMembers.getValue(args.selectedIndex));
          this.requestconsult.ExternalMemberId = this.familyMembers.getValue(args.selectedIndex);
      }*/
    ServiceTypeComponent.prototype.gotoMedicalEmergency = function (serviceId, serviceName) {
        this.requestconsult.ServiceName = serviceName;
        this.requestconsult.ServiceType = serviceId;
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/medicalemergency"], navigationExtras);
    };
    return ServiceTypeComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], ServiceTypeComponent.prototype, "radSideComponent", void 0);
ServiceTypeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./servicetype.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute])
], ServiceTypeComponent);
exports.ServiceTypeComponent = ServiceTypeComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZXR5cGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmljZXR5cGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTZEO0FBQzdELDBDQUEyRTtBQUMzRSxnQ0FBK0I7QUFDL0IsMEVBQXlFO0FBQ3pFLGlFQUFtRDtBQUNuRCwwREFBNEQ7QUFDNUQsNERBQXFEO0FBQ3JELHlFQUFzRTtBQUN0RSwrREFBNkQ7QUFDN0Qsa0VBQWdFO0FBRWhFLDhDQUE4QztBQUM5QywyQ0FBMkM7QUFDM0MsZUFBZTtBQU1mLElBQWEsb0JBQW9CO0lBTTdCLDhCQUFvQixJQUFVLEVBQVUsTUFBcUIsRUFBVSxNQUFjLEVBQVUsZUFBK0I7UUFBMUcsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBTDlILG1CQUFjLEdBQUcsSUFBSSwwQ0FBbUIsRUFBRSxDQUFDO1FBQzNDLG1CQUFjLEdBQVcsSUFBSSxDQUFDO1FBQzlCLGdCQUFXLEdBQVEsRUFBRSxDQUFDO1FBQUMsa0JBQWEsR0FBRyxJQUFJLGtDQUFTLEVBQVUsQ0FBQztRQUMvRCxTQUFJLEdBQUcsSUFBSSxpQkFBSSxFQUFFLENBQUM7SUFFZ0gsQ0FBQztJQUVuSSx1Q0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUM3RyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFxQ0k7SUFDUCxDQUFDO0lBQ0g7OztTQUdLO0lBQ0gsbURBQW9CLEdBQXBCLFVBQXFCLFNBQVMsRUFBRSxXQUFXO1FBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUM5QyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDeEMsSUFBSSxnQkFBZ0IsR0FBcUI7WUFDckMsV0FBVyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7U0FDMUUsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ3JFLENBQUM7SUFDTCwyQkFBQztBQUFELENBQUMsQUE5REQsSUE4REM7QUF6RGdDO0lBQTVCLGdCQUFTLENBQUMsb0NBQWdCLENBQUM7OEJBQW1CLG9DQUFnQjs4REFBQztBQUx2RCxvQkFBb0I7SUFMaEMsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsOEJBQThCO1FBQzNDLFNBQVMsRUFBRSxDQUFDLCtCQUFhLEVBQUUsNkJBQWEsRUFBRSxvQ0FBZ0IsQ0FBQztLQUM5RCxDQUFDO3FDQU80QixXQUFJLEVBQWtCLCtCQUFhLEVBQWtCLGVBQU0sRUFBMkIsdUJBQWM7R0FOckgsb0JBQW9CLENBOERoQztBQTlEWSxvREFBb0I7QUE4RGhDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFZhbHVlTGlzdCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvdXNlci5tb2RlbFwiO1xuaW1wb3J0IHsgV2ViQVBJU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvd2ViLWFwaS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSZXF1ZXN0Q29uc3VsdE1vZGVsIH0gZnJvbSBcIi4vcmVxdWVzdGNvbnN1bHQubW9kZWxcIjtcbmltcG9ydCB7IFJhZFNpZGVDb21wb25lbnQgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLmNvbXBvbmVudFwiO1xuXG4vL2xldCB4bWwyanMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQteG1sMmpzJyk7XG4vL2xldCBhcHBsaWNhdGlvbiA9IHJlcXVpcmUoJ2FwcGxpY2F0aW9uJyk7XG4vLyBTRVJWSUNFIFRZUEVcbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9zZXJ2aWNldHlwZS5jb21wb25lbnQuaHRtbFwiLFxuICAgIHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFJhZFNpZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFNlcnZpY2VUeXBlQ29tcG9uZW50IHtcbiAgICByZXF1ZXN0Y29uc3VsdCA9IG5ldyBSZXF1ZXN0Q29uc3VsdE1vZGVsKCk7XG4gICAgbVNlbGVjdGVkSW5kZXg6IG51bWJlciA9IG51bGw7XG4gICAgbWVtYmVyc0xpc3Q6IGFueSA9IFtdOyBmYW1pbHlNZW1iZXJzID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KCk7XG4gICAgdXNlciA9IG5ldyBVc2VyKCk7XG4gICAgQFZpZXdDaGlsZChSYWRTaWRlQ29tcG9uZW50KSByYWRTaWRlQ29tcG9uZW50OiBSYWRTaWRlQ29tcG9uZW50O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVzOiBBY3RpdmF0ZWRSb3V0ZSkgeyB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5yYWRTaWRlQ29tcG9uZW50LnJjQ2xhc3MgPSB0cnVlOyB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTsgdGhpcy5yYWRTaWRlQ29tcG9uZW50Lm5hdkljb24gPSB0cnVlO1xuICAgICAgICB0aGlzLnVzZXIgPSBKU09OLnBhcnNlKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiVVNFUlwiKSk7XG4gICAgICAgLyogaWYgKHRoaXMud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcbiAgICAgICAgICAgIHRoaXMud2ViYXBpLmdldEZhbWlseU1lbWJlcnNfaHR0cCgpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNvdW50ICBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsb29wID0gMDsgbG9vcCA8IHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkLkZhbWlseU1lbWJlckNvdW50OyBsb29wKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJzX0dyaWQuRmFtaWx5TWVtYmVyQ291bnQgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mYW1pbHlNZW1iZXJzLnNldEl0ZW0obG9vcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkLkZhbWlseU1lbWJlckxpc3QuQVBJUmVzdWx0X0ZhbWlseU1lbWJlckl0ZW0uUGVyc29uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiByZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5GYW1pbHlNZW1iZXJMaXN0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJJdGVtLkZpcnN0TmFtZSArIFwiIFwiICsgcmVzdWx0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJzX0dyaWQuRmFtaWx5TWVtYmVyTGlzdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVySXRlbS5MYXN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkLkZhbWlseU1lbWJlckxpc3QuQVBJUmVzdWx0X0ZhbWlseU1lbWJlckl0ZW1bbG9vcF0uUmVsYXRpb25TaGlwID09IFwiUHJpbWFyeSBNZW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mYW1pbHlNZW1iZXJzLnNldEl0ZW0obG9vcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5GYW1pbHlNZW1iZXJMaXN0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJJdGVtW2xvb3BdLlBlcnNvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHJlc3VsdC5BUElSZXN1bHRfRmFtaWx5TWVtYmVyc19HcmlkLkZhbWlseU1lbWJlckxpc3QuQVBJUmVzdWx0X0ZhbWlseU1lbWJlckl0ZW1bbG9vcF0uRmlyc3ROYW1lICsgXCIgXCIgKyByZXN1bHQuQVBJUmVzdWx0X0ZhbWlseU1lbWJlcnNfR3JpZC5GYW1pbHlNZW1iZXJMaXN0LkFQSVJlc3VsdF9GYW1pbHlNZW1iZXJJdGVtW2xvb3BdLkxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjdGl2YXRlZFJvdXRlcy5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlcXVlc3Rjb25zdWx0ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJSRVFVRVNUX0NPTlNVTFRcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1TZWxlY3RlZEluZGV4ID0gc2VsZi5mYW1pbHlNZW1iZXJzLmdldEluZGV4KHNlbGYucmVxdWVzdGNvbnN1bHQuRXh0ZXJuYWxNZW1iZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tU2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgdGhlIGZhbWlseSBtZW1iZXJzIGluZm9ybWF0aW9uIC8gU2Vzc2lvbiBleHBpcmVkIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZ2V0dGluZyB0aGUgZmFtaWx5IG1lbWJlcnMgaW5mb3JtYXRpb24uLiBcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSovXG4gICAgfVxuICAvKiAgb25NZW1iZXJDaGFuZ2UoYXJncykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiTWVtYmVyIElkIFwiICsgdGhpcy5mYW1pbHlNZW1iZXJzLmdldFZhbHVlKGFyZ3Muc2VsZWN0ZWRJbmRleCkpO1xuICAgICAgICB0aGlzLnJlcXVlc3Rjb25zdWx0LkV4dGVybmFsTWVtYmVySWQgPSB0aGlzLmZhbWlseU1lbWJlcnMuZ2V0VmFsdWUoYXJncy5zZWxlY3RlZEluZGV4KTtcbiAgICB9Ki9cbiAgICBnb3RvTWVkaWNhbEVtZXJnZW5jeShzZXJ2aWNlSWQsIHNlcnZpY2VOYW1lKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSA9IHNlcnZpY2VJZDtcbiAgICAgICAgICAgIGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHRoaXMucmVxdWVzdGNvbnN1bHQpIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbWVkaWNhbGVtZXJnZW5jeVwiXSwgbmF2aWdhdGlvbkV4dHJhcylcbiAgICB9XG59O1xuXG4iXX0=