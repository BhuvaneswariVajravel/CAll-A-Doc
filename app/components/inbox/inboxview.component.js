"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var configuration_1 = require("../../shared/configuration/configuration");
var web_api_service_1 = require("../../shared/services/web-api.service");
var xml2js = require('nativescript-xml2js');
var InboxviewComponent = (function () {
    function InboxviewComponent(page, router, actRoute, webapi) {
        this.page = page;
        this.router = router;
        this.actRoute = actRoute;
        this.webapi = webapi;
        this.isVisible = false;
        this.itemDetails = [];
    }
    InboxviewComponent.prototype.popupbtn = function () {
        this.isVisible = !this.isVisible;
    };
    InboxviewComponent.prototype.popupclose = function () {
        this.isVisible = false;
    };
    InboxviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.page.actionBarHidden = true;
        self.actRoute.queryParams.subscribe(function (params) {
            if (params["inboxItem"] != undefined && self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                var inboxItem = JSON.parse(params["inboxItem"]);
                _this.webapi.getInboxItemDtls(inboxItem.ItemId).subscribe(function (data) {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_InboxItemDetail.Successful == "true") {
                            var inboxView = result.APIResult_InboxItemDetail.ItemSummary;
                            self.itemDetails.push({ "ItemId": inboxView.ItemId, "From": inboxView.From, "Subject": inboxView.Subject, "SentDate": inboxView.SentDate, "AlreadyOpened": inboxView.AlreadyOpened });
                            self.hideIndicator();
                        }
                        else {
                            self.hideIndicator();
                            //console.log("Session expired / error in inbox item view");
                        }
                    });
                }, function (error) {
                    self.hideIndicator();
                    //console.log("Error while getting consult history view data.. " + error);
                });
            }
        });
    };
    InboxviewComponent.prototype.updateInboxItemStatus = function (item) {
        var self = this;
        this.webapi.inboxItemStatusUpdate(item.ItemId, true).subscribe(function (data) {
            xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                if (result.APIResult.Successful == "true") {
                    //console.log("UPDATED STATUS");
                }
                else {
                    //console.log("Session expired / UPDATION Failed..");
                }
            });
        }, function (error) {
            //	console.log("Error while update inbox status.. " + error);
        });
    };
    InboxviewComponent.prototype.goback = function () {
        var _this = this;
        this.actRoute.queryParams.subscribe(function (params) {
            if (params["INBOX_LIST"] != undefined) {
                var navigationExtras = {
                    queryParams: { "INBOX_LIST": params["INBOX_LIST"] }
                };
                _this.router.navigate(["/inbox"], navigationExtras);
            }
            else {
                _this.router.navigate(["/inbox"]);
            }
        });
    };
    InboxviewComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    return InboxviewComponent;
}());
InboxviewComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./inboxview.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.Router, router_1.ActivatedRoute, web_api_service_1.WebAPIService])
], InboxviewComponent);
exports.InboxviewComponent = InboxviewComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ib3h2aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluYm94dmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQTJFO0FBQzNFLGdDQUErQjtBQUMvQiwwRUFBeUU7QUFDekUseUVBQXNFO0FBQ3RFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBUTVDLElBQWEsa0JBQWtCO0lBRTlCLDRCQUFvQixJQUFVLEVBQVUsTUFBYyxFQUFVLFFBQXdCLEVBQVUsTUFBcUI7UUFBbkcsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFEdkgsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUFDLGdCQUFXLEdBQVEsRUFBRSxDQUFDO0lBQ3lFLENBQUM7SUFDNUgscUNBQVEsR0FBUjtRQUNDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFDRCx1Q0FBVSxHQUFWO1FBQ0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUNELHFDQUFRLEdBQVI7UUFBQSxpQkF5QkM7UUF4QkEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxN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O1lBQ2xDLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFDRCwwQ0FBYSxHQUFiO1FBQ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUNGLHlCQUFDO0FBQUQsQ0FBQyxBQWpFRCxJQWlFQztBQWpFWSxrQkFBa0I7SUFMOUIsZ0JBQVMsQ0FBQztRQUNWLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsNEJBQTRCO1FBQ3pDLFNBQVMsRUFBRSxDQUFDLCtCQUFhLEVBQUUsNkJBQWEsQ0FBQztLQUN6QyxDQUFDO3FDQUd5QixXQUFJLEVBQWtCLGVBQU0sRUFBb0IsdUJBQWMsRUFBa0IsK0JBQWE7R0FGM0csa0JBQWtCLENBaUU5QjtBQWpFWSxnREFBa0I7QUFpRTlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBXZWJBUElTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93ZWItYXBpLnNlcnZpY2VcIjtcbmxldCB4bWwyanMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQteG1sMmpzJyk7XG5cblxuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vaW5ib3h2aWV3LmNvbXBvbmVudC5odG1sXCIsXG5cdHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb25dXG59KVxuZXhwb3J0IGNsYXNzIEluYm94dmlld0NvbXBvbmVudCB7XG5cdGlzVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlOyBpdGVtRGV0YWlsczogYW55ID0gW107XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlKSB7IH1cblx0cG9wdXBidG4oKSB7XG5cdFx0dGhpcy5pc1Zpc2libGUgPSAhdGhpcy5pc1Zpc2libGU7XG5cdH1cblx0cG9wdXBjbG9zZSgpIHtcblx0XHR0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuXHR9XG5cdG5nT25Jbml0KCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHR0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcblx0XHRzZWxmLmFjdFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuXHRcdFx0aWYgKHBhcmFtc1tcImluYm94SXRlbVwiXSAhPSB1bmRlZmluZWQgJiYgc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuXHRcdFx0XHRzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcblx0XHRcdFx0bGV0IGluYm94SXRlbSA9IEpTT04ucGFyc2UocGFyYW1zW1wiaW5ib3hJdGVtXCJdKTtcblx0XHRcdFx0dGhpcy53ZWJhcGkuZ2V0SW5ib3hJdGVtRHRscyhpbmJveEl0ZW0uSXRlbUlkKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG5cdFx0XHRcdFx0eG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdF9JbmJveEl0ZW1EZXRhaWwuU3VjY2Vzc2Z1bCA9PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0XHRsZXQgaW5ib3hWaWV3ID0gcmVzdWx0LkFQSVJlc3VsdF9JbmJveEl0ZW1EZXRhaWwuSXRlbVN1bW1hcnk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuaXRlbURldGFpbHMucHVzaCh7IFwiSXRlbUlkXCI6IGluYm94Vmlldy5JdGVtSWQsIFwiRnJvbVwiOiBpbmJveFZpZXcuRnJvbSwgXCJTdWJqZWN0XCI6IGluYm94Vmlldy5TdWJqZWN0LCBcIlNlbnREYXRlXCI6IGluYm94Vmlldy5TZW50RGF0ZSwgXCJBbHJlYWR5T3BlbmVkXCI6IGluYm94Vmlldy5BbHJlYWR5T3BlbmVkIH0pXG5cdFx0XHRcdFx0XHRcdHNlbGYuaGlkZUluZGljYXRvcigpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5oaWRlSW5kaWNhdG9yKCk7XG5cdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgLyBlcnJvciBpbiBpbmJveCBpdGVtIHZpZXdcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0c2VsZi5oaWRlSW5kaWNhdG9yKCk7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgZ2V0dGluZyBjb25zdWx0IGhpc3RvcnkgdmlldyBkYXRhLi4gXCIgKyBlcnJvcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0dXBkYXRlSW5ib3hJdGVtU3RhdHVzKGl0ZW06IGFueSkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHR0aGlzLndlYmFwaS5pbmJveEl0ZW1TdGF0dXNVcGRhdGUoaXRlbS5JdGVtSWQsIHRydWUpLnN1YnNjcmliZShkYXRhID0+IHtcblx0XHRcdHhtbDJqcy5wYXJzZVN0cmluZyhkYXRhLl9ib2R5LCB7IGV4cGxpY2l0QXJyYXk6IGZhbHNlIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRpZiAocmVzdWx0LkFQSVJlc3VsdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlVQREFURUQgU1RBVFVTXCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyZWQgLyBVUERBVElPTiBGYWlsZWQuLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRcdGVycm9yID0+IHtcblx0XHRcdC8vXHRjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIHVwZGF0ZSBpbmJveCBzdGF0dXMuLiBcIiArIGVycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cdGdvYmFjaygpIHtcblx0XHR0aGlzLmFjdFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuXHRcdFx0aWYgKHBhcmFtc1tcIklOQk9YX0xJU1RcIl0gIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGxldCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuXHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiB7IFwiSU5CT1hfTElTVFwiOiBwYXJhbXNbXCJJTkJPWF9MSVNUXCJdIH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2luYm94XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9pbmJveFwiXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0aGlkZUluZGljYXRvcigpIHtcblx0XHR0aGlzLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuXHR9XG59O1xuXG5cbiJdfQ==