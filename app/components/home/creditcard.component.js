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
// CREADIT DEBIT CARD
var CreditCardComponent = (function () {
    function CreditCardComponent(page, router, webapi, activatedRoutes) {
        this.page = page;
        this.router = router;
        this.webapi = webapi;
        this.activatedRoutes = activatedRoutes;
        this.requestconsult = new requestconsult_model_1.RequestConsultModel();
        this.billingInfo = {};
        this.formSubmitted = false;
        //public cardno: string; public cardname: string; 
        //mSelectedIndex: number = 0; selectedMonth: string; public cvv: string;
        //	ySelectedIndex: number = 0; selectedYear: string; 
        this.years = [];
        this.months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    }
    CreditCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.radSideComponent.rcClass = true;
        for (var i = 0; i < 12; i++) {
            this.years.push((new Date()).getFullYear() + i);
        }
        this.page.actionBarHidden = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["REQUEST_CONSULT"] != undefined) {
                _this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
            }
        });
    };
    CreditCardComponent.prototype.ngAfterViewInit = function () {
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.getBillingInfo().subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_CCInfo.Successful == "true") {
                        self.billingInfo = result.APIResult_CCInfo;
                        self.billingInfo.monthindx = self.months.indexOf(self.billingInfo.ExpMonth);
                        self.billingInfo.yearindx = self.years.indexOf(new Date(self.billingInfo.ExpYear).getFullYear());
                        self.billingInfo.ConsultFee = self.requestconsult.ConsultFee;
                        self.billingInfo.ServiceType = self.requestconsult.ServiceType;
                    }
                    else if (result.APIResult_CCInfo.Message == "Please login using MemberLogin screen to get the key before calling any API functions") {
                        //console.log("LOGOUT DUE SESSION TIME OUT IN CREDIT CARDDETAILS --->" + result.APIResult_CCInfo.Message);
                        self.webapi.logout();
                    }
                    else {
                        //console.log("Session expired or error in getting billing data...");
                    }
                });
            }, function (error) {
                //	console.log("Error in getting billing data.... " + error);
            });
        }
    };
    CreditCardComponent.prototype.onMonthChange = function (args) {
        this.billingInfo.month = this.months[args.value];
    };
    CreditCardComponent.prototype.onYearChange = function (args) {
        this.billingInfo.year = this.years[args.value];
    };
    CreditCardComponent.prototype.showNextPage = function (cardnum, name, cvv) {
        this.formSubmitted = true;
        var self = this;
        if (cardnum && name && cvv && self.isValidCard() && self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            //	console.log("PaymentAmount: " + self.billingInfo.ConsultFee + " FeeScheduleMasterId: " + self.billingInfo.CardNumber + " ServiceId: " + self.billingInfo.ServiceType);
            self.webapi.paymentGateway(self.billingInfo).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult.Successful == "true") {
                        //		console.log("PAYMENT SUCCESFULL");
                        var navigationExtras = {
                            queryParams: { "REQUEST_CONSULT": JSON.stringify(self.requestconsult) }
                        };
                        if (self.requestconsult.ServiceType == 3) {
                            self.router.navigate(["/billing"], navigationExtras);
                        }
                        else {
                            self.router.navigate(["/secureemail"], navigationExtras);
                        }
                        self.webapi.loader.hide();
                    }
                    else if (result.APIResult.Message == "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.loader.hide();
                        //console.log("LOGOUT DUE SESSION TIME OUT IN CREDIT CARD --->" + result.APIResult.Message);
                        self.webapi.logout();
                    }
                    else {
                        self.billingInfo.errorMsg = "Your payment is unsuccessful. Please call customer support to resolve.";
                        self.billingInfo.error = true;
                        setTimeout(function () {
                            self.billingInfo.error = false;
                        }, 6000);
                        self.webapi.loader.hide();
                        //console.log("Session expired or error in payment data...");
                    }
                });
            }, function (error) {
                self.billingInfo.errorMsg = "Something went wrong with your card details. Please check.";
                self.billingInfo.error = true;
                setTimeout(function () {
                    self.billingInfo.error = false;
                }, 6000);
                self.webapi.loader.hide();
                //console.log("Error in getting payment gateway.... " + error);
            });
        }
    };
    CreditCardComponent.prototype.isValidCard = function () {
        if (this.billingInfo.CardNumber.indexOf('************') > -1 && this.billingInfo.CardNumber.indexOf('-') > -1) {
            return true;
        }
        else {
            return /^([0-9]{16})$/.test(this.billingInfo.CardNumber);
            //return /^(^[0-9]{17})$/.test(this.billingInfo.CardNumber);
        }
    };
    CreditCardComponent.prototype.goback = function () {
        var navigationExtras = {
            queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        if (this.requestconsult.ServiceType == 4) {
            this.router.navigate(["/healthrecords"], navigationExtras);
        }
        else if (this.requestconsult.ServiceType == 3 && this.requestconsult.SetPreferredPharmacy) {
            this.router.navigate(["/pharmacy"], navigationExtras);
        }
        else {
            this.router.navigate(["/searchpharmacy"], navigationExtras);
        }
    };
    return CreditCardComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], CreditCardComponent.prototype, "radSideComponent", void 0);
CreditCardComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./creditcard.component.html",
        providers: [configuration_1.Configuration, web_api_service_1.WebAPIService, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, web_api_service_1.WebAPIService, router_1.ActivatedRoute])
], CreditCardComponent);
exports.CreditCardComponent = CreditCardComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlZGl0Y2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcmVkaXRjYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBMkU7QUFDM0UsZ0NBQStCO0FBQy9CLDBFQUF5RTtBQUN6RSx5RUFBc0U7QUFDdEUsK0RBQTZEO0FBQzdELGtFQUFnRTtBQUNoRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUU1QyxxQkFBcUI7QUFNckIsSUFBYSxtQkFBbUI7SUFRL0IsNkJBQW9CLElBQVUsRUFBVSxNQUFjLEVBQVUsTUFBcUIsRUFBVSxlQUErQjtRQUExRyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFQOUgsbUJBQWMsR0FBRyxJQUFJLDBDQUFtQixFQUFFLENBQUM7UUFBQyxnQkFBVyxHQUFRLEVBQUUsQ0FBQztRQUFDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXpGLGtEQUFrRDtRQUNsRCx3RUFBd0U7UUFDeEUscURBQXFEO1FBQ3JELFVBQUssR0FBUSxFQUFFLENBQUM7UUFDaEIsV0FBTSxHQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMyQyxDQUFDO0lBQ25JLHNDQUFRLEdBQVI7UUFBQSxpQkFXQztRQVZBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFF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QUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxDQUFDO0lBQ0YsQ0FBQztJQUNGLDBCQUFDO0FBQUQsQ0FBQyxBQXBIRCxJQW9IQztBQWxIOEI7SUFBNUIsZ0JBQVMsQ0FBQyxvQ0FBZ0IsQ0FBQzs4QkFBbUIsb0NBQWdCOzZEQUFDO0FBRnJELG1CQUFtQjtJQUwvQixnQkFBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSw2QkFBNkI7UUFDMUMsU0FBUyxFQUFFLENBQUMsNkJBQWEsRUFBRSwrQkFBYSxFQUFFLG9DQUFnQixDQUFDO0tBQzNELENBQUM7cUNBU3lCLFdBQUksRUFBa0IsZUFBTSxFQUFrQiwrQkFBYSxFQUEyQix1QkFBYztHQVJsSCxtQkFBbUIsQ0FvSC9CO0FBcEhZLGtEQUFtQjtBQW9IL0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSwgTmF2aWdhdGlvbkV4dHJhcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgV2ViQVBJU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvd2ViLWFwaS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSZXF1ZXN0Q29uc3VsdE1vZGVsIH0gZnJvbSBcIi4vcmVxdWVzdGNvbnN1bHQubW9kZWxcIjtcbmltcG9ydCB7IFJhZFNpZGVDb21wb25lbnQgfSBmcm9tIFwiLi4vcmFkc2lkZS9yYWRzaWRlLmNvbXBvbmVudFwiO1xubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcblxuLy8gQ1JFQURJVCBERUJJVCBDQVJEXG5AQ29tcG9uZW50KHtcblx0bW9kdWxlSWQ6IG1vZHVsZS5pZCxcblx0dGVtcGxhdGVVcmw6IFwiLi9jcmVkaXRjYXJkLmNvbXBvbmVudC5odG1sXCIsXG5cdHByb3ZpZGVyczogW0NvbmZpZ3VyYXRpb24sIFdlYkFQSVNlcnZpY2UsIFJhZFNpZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIENyZWRpdENhcmRDb21wb25lbnQge1xuXHRyZXF1ZXN0Y29uc3VsdCA9IG5ldyBSZXF1ZXN0Q29uc3VsdE1vZGVsKCk7IGJpbGxpbmdJbmZvOiBhbnkgPSB7fTsgZm9ybVN1Ym1pdHRlZCA9IGZhbHNlO1xuXHRcdEBWaWV3Q2hpbGQoUmFkU2lkZUNvbXBvbmVudCkgcmFkU2lkZUNvbXBvbmVudDogUmFkU2lkZUNvbXBvbmVudDtcblx0Ly9wdWJsaWMgY2FyZG5vOiBzdHJpbmc7IHB1YmxpYyBjYXJkbmFtZTogc3RyaW5nOyBcblx0Ly9tU2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDsgc2VsZWN0ZWRNb250aDogc3RyaW5nOyBwdWJsaWMgY3Z2OiBzdHJpbmc7XG5cdC8vXHR5U2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDsgc2VsZWN0ZWRZZWFyOiBzdHJpbmc7IFxuXHR5ZWFyczogYW55ID0gW107XG5cdG1vbnRoczogYW55ID0gW1wiMDFcIiwgXCIwMlwiLCBcIjAzXCIsIFwiMDRcIiwgXCIwNVwiLCBcIjA2XCIsIFwiMDdcIiwgXCIwOFwiLCBcIjA5XCIsIFwiMTBcIiwgXCIxMVwiLCBcIjEyXCJdO1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlczogQWN0aXZhdGVkUm91dGUpIHsgfVxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLnJhZFNpZGVDb21wb25lbnQucmNDbGFzcyA9IHRydWU7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG5cdFx0XHR0aGlzLnllYXJzLnB1c2goKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgKyBpKTtcblx0XHR9XG5cdFx0dGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG5cdFx0dGhpcy5hY3RpdmF0ZWRSb3V0ZXMucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiUkVRVUVTVF9DT05TVUxUXCJdICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLnJlcXVlc3Rjb25zdWx0ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJSRVFVRVNUX0NPTlNVTFRcIl0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdG5nQWZ0ZXJWaWV3SW5pdCgpIHtcblx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0aWYgKHNlbGYud2ViYXBpLm5ldENvbm5lY3Rpdml0eUNoZWNrKCkpIHtcblx0XHRcdHNlbGYud2ViYXBpLmdldEJpbGxpbmdJbmZvKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9DQ0luZm8uU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mbyA9IHJlc3VsdC5BUElSZXN1bHRfQ0NJbmZvO1xuXHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby5tb250aGluZHggPSBzZWxmLm1vbnRocy5pbmRleE9mKHNlbGYuYmlsbGluZ0luZm8uRXhwTW9udGgpO1xuXHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby55ZWFyaW5keCA9IHNlbGYueWVhcnMuaW5kZXhPZihuZXcgRGF0ZShzZWxmLmJpbGxpbmdJbmZvLkV4cFllYXIpLmdldEZ1bGxZZWFyKCkpO1xuXHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby5Db25zdWx0RmVlID0gc2VsZi5yZXF1ZXN0Y29uc3VsdC5Db25zdWx0RmVlO1xuXHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby5TZXJ2aWNlVHlwZSA9IHNlbGYucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGU7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQuQVBJUmVzdWx0X0NDSW5mby5NZXNzYWdlID09IFwiUGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgdGhlIGtleSBiZWZvcmUgY2FsbGluZyBhbnkgQVBJIGZ1bmN0aW9uc1wiKSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiTE9HT1VUIERVRSBTRVNTSU9OIFRJTUUgT1VUIElOIENSRURJVCBDQVJEREVUQUlMUyAtLS0+XCIgKyByZXN1bHQuQVBJUmVzdWx0X0NDSW5mby5NZXNzYWdlKTtcblx0XHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvZ291dCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIG9yIGVycm9yIGluIGdldHRpbmcgYmlsbGluZyBkYXRhLi4uXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA9PiB7XG5cdFx0XHRcdC8vXHRjb25zb2xlLmxvZyhcIkVycm9yIGluIGdldHRpbmcgYmlsbGluZyBkYXRhLi4uLiBcIiArIGVycm9yKTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdH1cblx0b25Nb250aENoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5iaWxsaW5nSW5mby5tb250aCA9IHRoaXMubW9udGhzW2FyZ3MudmFsdWVdO1xuXHR9XG5cdG9uWWVhckNoYW5nZShhcmdzKSB7XG5cdFx0dGhpcy5iaWxsaW5nSW5mby55ZWFyID0gdGhpcy55ZWFyc1thcmdzLnZhbHVlXTtcblx0fVxuXHRzaG93TmV4dFBhZ2UoY2FyZG51bSwgbmFtZSwgY3Z2KSB7XG5cdFx0dGhpcy5mb3JtU3VibWl0dGVkID0gdHJ1ZTsgbGV0IHNlbGYgPSB0aGlzO1xuXHRcdGlmIChjYXJkbnVtICYmIG5hbWUgJiYgY3Z2ICYmIHNlbGYuaXNWYWxpZENhcmQoKSAmJiBzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG5cdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcblx0XHQvL1x0Y29uc29sZS5sb2coXCJQYXltZW50QW1vdW50OiBcIiArIHNlbGYuYmlsbGluZ0luZm8uQ29uc3VsdEZlZSArIFwiIEZlZVNjaGVkdWxlTWFzdGVySWQ6IFwiICsgc2VsZi5iaWxsaW5nSW5mby5DYXJkTnVtYmVyICsgXCIgU2VydmljZUlkOiBcIiArIHNlbGYuYmlsbGluZ0luZm8uU2VydmljZVR5cGUpO1xuXHRcdFx0c2VsZi53ZWJhcGkucGF5bWVudEdhdGV3YXkoc2VsZi5iaWxsaW5nSW5mbykuc3Vic2NyaWJlKGRhdGEgPT4ge1xuXHRcdFx0XHR4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdC8vXHRcdGNvbnNvbGUubG9nKFwiUEFZTUVOVCBTVUNDRVNGVUxMXCIpO1xuXHRcdFx0XHRcdFx0bGV0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG5cdFx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHNlbGYucmVxdWVzdGNvbnN1bHQpIH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRpZiAoc2VsZi5yZXF1ZXN0Y29uc3VsdC5TZXJ2aWNlVHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYucm91dGVyLm5hdmlnYXRlKFtcIi9iaWxsaW5nXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYucm91dGVyLm5hdmlnYXRlKFtcIi9zZWN1cmVlbWFpbFwiXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdC5NZXNzYWdlID09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYud2ViYXBpLmxvYWRlci5oaWRlKCk7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiTE9HT1VUIERVRSBTRVNTSU9OIFRJTUUgT1VUIElOIENSRURJVCBDQVJEIC0tLT5cIiArIHJlc3VsdC5BUElSZXN1bHQuTWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2dvdXQoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby5lcnJvck1zZyA9IFwiWW91ciBwYXltZW50IGlzIHVuc3VjY2Vzc2Z1bC4gUGxlYXNlIGNhbGwgY3VzdG9tZXIgc3VwcG9ydCB0byByZXNvbHZlLlwiO1xuXHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby5lcnJvciA9IHRydWU7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby5lcnJvciA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSwgNjAwMCk7XG5cdFx0XHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlNlc3Npb24gZXhwaXJlZCBvciBlcnJvciBpbiBwYXltZW50IGRhdGEuLi5cIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRcdGVycm9yID0+IHtcblx0XHRcdFx0XHRzZWxmLmJpbGxpbmdJbmZvLmVycm9yTXNnID0gXCJTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHlvdXIgY2FyZCBkZXRhaWxzLiBQbGVhc2UgY2hlY2suXCI7XG5cdFx0XHRcdFx0c2VsZi5iaWxsaW5nSW5mby5lcnJvciA9IHRydWU7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmJpbGxpbmdJbmZvLmVycm9yID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgNjAwMCk7XG5cdFx0XHRcdFx0c2VsZi53ZWJhcGkubG9hZGVyLmhpZGUoKTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3IgaW4gZ2V0dGluZyBwYXltZW50IGdhdGV3YXkuLi4uIFwiICsgZXJyb3IpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0aXNWYWxpZENhcmQoKSB7XG5cdFx0aWYgKHRoaXMuYmlsbGluZ0luZm8uQ2FyZE51bWJlci5pbmRleE9mKCcqKioqKioqKioqKionKSA+IC0xICYmIHRoaXMuYmlsbGluZ0luZm8uQ2FyZE51bWJlci5pbmRleE9mKCctJykgPiAtMSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAvXihbMC05XXsxNn0pJC8udGVzdCh0aGlzLmJpbGxpbmdJbmZvLkNhcmROdW1iZXIpO1xuXHRcdFx0Ly9yZXR1cm4gL14oXlswLTldezE3fSkkLy50ZXN0KHRoaXMuYmlsbGluZ0luZm8uQ2FyZE51bWJlcik7XG5cdFx0fVxuXHR9XG5cdGdvYmFjaygpIHtcblx0XHRsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcblx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiUkVRVUVTVF9DT05TVUxUXCI6IEpTT04uc3RyaW5naWZ5KHRoaXMucmVxdWVzdGNvbnN1bHQpIH1cblx0XHR9O1xuXHRcdGlmICh0aGlzLnJlcXVlc3Rjb25zdWx0LlNlcnZpY2VUeXBlID09IDQpIHtcblx0XHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9oZWFsdGhyZWNvcmRzXCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMucmVxdWVzdGNvbnN1bHQuU2VydmljZVR5cGUgPT0gMyAmJiB0aGlzLnJlcXVlc3Rjb25zdWx0LlNldFByZWZlcnJlZFBoYXJtYWN5KSB7XG5cdFx0XHR0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvcGhhcm1hY3lcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvc2VhcmNocGhhcm1hY3lcIl0sIG5hdmlnYXRpb25FeHRyYXMpO1xuXHRcdH1cblx0fVxufTsgXG4iXX0=