"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var radside_component_1 = require("../radside/radside.component");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var xml2js = require('nativescript-xml2js');
//INBOX
var InboxComponent = (function () {
    function InboxComponent(page, webapi, router, actRoute) {
        this.page = page;
        this.webapi = webapi;
        this.router = router;
        this.actRoute = actRoute;
        this.pageNum = 1;
        this.totalCount = 0;
        this.isVisible = false;
        this.inboxList = [];
    }
    InboxComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.radSideComponent.inbxClass = true;
        var self = this;
        self.actRoute.queryParams.subscribe(function (params) {
            if (params["INBOX_LIST"] != undefined) {
                self.inboxList = JSON.parse(params["INBOX_LIST"]);
            }
            else if (self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                _this.webapi.getInboxList(_this.pageNum).subscribe(function (data) {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_InboxItemList.Successful == "true") {
                            if (result.APIResult_InboxItemList.InboxItemCount != "0") {
                                self.totalCount = result.APIResult_InboxItemList.TotalItemCountInAllPages;
                                var total = result.APIResult_InboxItemList.InboxItemList.InboxItem;
                                if (total.length != undefined) {
                                    for (var i = 0; i < total.length; i++) {
                                        self.inboxList.push(total[i]);
                                    }
                                }
                                else {
                                    self.inboxList.push(total);
                                }
                                self.hideIndicator();
                            }
                            else {
                                self.hideIndicator();
                            }
                        }
                        else {
                            self.hideIndicator();
                            if (result.APIResult_InboxItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                                self.webapi.logout();
                            }
                            //console.log("session expired / error in inbox list ::: " + result.APIResult_InboxItemList.Message);
                        }
                    });
                }, function (error) {
                    self.hideIndicator();
                    // console.log("Error while getting Inbox list.. " + error);
                });
            }
        });
    };
    InboxComponent.prototype.loadMoreInboxItems = function () {
        var self = this;
        if (this.totalCount >= this.pageNum * 8 && self.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1;
            this.webapi.getInboxList(this.pageNum).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_InboxItemList.Successful == "true") {
                        self.totalCount = result.APIResult_InboxItemList.TotalItemCountInAllPages;
                        var total = result.APIResult_InboxItemList.InboxItemList.InboxItem;
                        if (total.length != undefined) {
                            for (var i = 0; i < total.length; i++) {
                                self.inboxList.push(total[i]);
                            }
                        }
                        else {
                            self.inboxList.push(total);
                        }
                    }
                    else if (result.APIResult_InboxItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    }
                    else {
                        // console.log("Session expired or Error in inbox load more");
                    }
                });
            }, function (error) {
                // console.log("Error while getting InboxList more.. " + error);
            });
        }
    };
    InboxComponent.prototype.hideIndicator = function () {
        this.webapi.loader.hide();
    };
    InboxComponent.prototype.popupbtn = function () {
        this.isVisible = !this.isVisible;
    };
    InboxComponent.prototype.popupclose = function () {
        this.isVisible = false;
    };
    InboxComponent.prototype.inboxView = function (item) {
        var navigationExtras = {
            queryParams: {
                "INBOX_LIST": JSON.stringify(this.inboxList),
                "inboxItem": JSON.stringify(item)
            }
        };
        this.router.navigate(["/inboxview"], navigationExtras);
    };
    return InboxComponent;
}());
__decorate([
    core_1.ViewChild(radside_component_1.RadSideComponent),
    __metadata("design:type", radside_component_1.RadSideComponent)
], InboxComponent.prototype, "radSideComponent", void 0);
InboxComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./inbox.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration, radside_component_1.RadSideComponent]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService, router_1.Router, router_1.ActivatedRoute])
], InboxComponent);
exports.InboxComponent = InboxComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5ib3guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTZEO0FBQzdELDBDQUEyRTtBQUMzRSxnQ0FBK0I7QUFDL0Isa0VBQWdFO0FBQ2hFLHlFQUFzRTtBQUN0RSwwRUFBeUU7QUFDekUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDNUMsT0FBTztBQU1QLElBQWEsY0FBYztJQUl2Qix3QkFBb0IsSUFBVSxFQUFVLE1BQXFCLEVBQVUsTUFBYyxFQUFVLFFBQXdCO1FBQW5HLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBSHZILFlBQU8sR0FBRyxDQUFDLENBQUM7UUFBQyxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFBQyxjQUFTLEdBQVEsRUFBRSxDQUFDO0lBRTJFLENBQUM7SUFDNUgsaUNBQVEsR0FBUjtRQUFBLGlCQXdDQztRQXZDRyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN6RSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtZQUN0QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUM7WUFBQyxJ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LEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ0QsaUNBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxtQ0FBVSxHQUFWO1FBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELGtDQUFTLEdBQVQsVUFBVSxJQUFTO1FBQ2YsSUFBSSxnQkFBZ0IsR0FBcUI7WUFDckMsV0FBVyxFQUFFO2dCQUNULFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQzVDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUNwQztTQUNKLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQTVGRCxJQTRGQztBQXpGZ0M7SUFBNUIsZ0JBQVMsQ0FBQyxvQ0FBZ0IsQ0FBQzs4QkFBbUIsb0NBQWdCO3dEQUFDO0FBSHZELGNBQWM7SUFMMUIsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixXQUFXLEVBQUUsd0JBQXdCO1FBQ3JDLFNBQVMsRUFBRSxDQUFDLCtCQUFhLEVBQUUsNkJBQWEsRUFBRSxvQ0FBZ0IsQ0FBQztLQUM5RCxDQUFDO3FDQUs0QixXQUFJLEVBQWtCLCtCQUFhLEVBQWtCLGVBQU0sRUFBb0IsdUJBQWM7R0FKOUcsY0FBYyxDQTRGMUI7QUE1Rlksd0NBQWM7QUE0RjFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUsIE5hdmlnYXRpb25FeHRyYXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBSYWRTaWRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JhZHNpZGUvcmFkc2lkZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uXCI7XG5sZXQgeG1sMmpzID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXhtbDJqcycpO1xuLy9JTkJPWFxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2luYm94LmNvbXBvbmVudC5odG1sXCIsXG4gICAgcHJvdmlkZXJzOiBbV2ViQVBJU2VydmljZSwgQ29uZmlndXJhdGlvbiwgUmFkU2lkZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgSW5ib3hDb21wb25lbnQge1xuICAgIHBhZ2VOdW0gPSAxOyB0b3RhbENvdW50ID0gMDtcbiAgICBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTsgaW5ib3hMaXN0OiBhbnkgPSBbXTtcbiAgICBAVmlld0NoaWxkKFJhZFNpZGVDb21wb25lbnQpIHJhZFNpZGVDb21wb25lbnQ6IFJhZFNpZGVDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHdlYmFwaTogV2ViQVBJU2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUpIHsgfVxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTsgdGhpcy5yYWRTaWRlQ29tcG9uZW50LmluYnhDbGFzcyA9IHRydWU7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5hY3RSb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXNbXCJJTkJPWF9MSVNUXCJdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaW5ib3hMaXN0ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJJTkJPWF9MSVNUXCJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvYWRlci5zaG93KHNlbGYud2ViYXBpLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHRoaXMud2ViYXBpLmdldEluYm94TGlzdCh0aGlzLnBhZ2VOdW0pLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgeG1sMmpzLnBhcnNlU3RyaW5nKGRhdGEuX2JvZHksIHsgZXhwbGljaXRBcnJheTogZmFsc2UgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9JbmJveEl0ZW1MaXN0LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9JbmJveEl0ZW1MaXN0LkluYm94SXRlbUNvdW50ICE9IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudG90YWxDb3VudCA9IHJlc3VsdC5BUElSZXN1bHRfSW5ib3hJdGVtTGlzdC5Ub3RhbEl0ZW1Db3VudEluQWxsUGFnZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbCA9IHJlc3VsdC5BUElSZXN1bHRfSW5ib3hJdGVtTGlzdC5JbmJveEl0ZW1MaXN0LkluYm94SXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFsLmxlbmd0aCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmluYm94TGlzdC5wdXNoKHRvdGFsW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5ib3hMaXN0LnB1c2godG90YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlSW5kaWNhdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfSW5ib3hJdGVtTGlzdC5NZXNzYWdlID09PSBcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIHVzaW5nIE1lbWJlckxvZ2luIHNjcmVlbiB0byBnZXQgYSBuZXcga2V5IGZvciBmdXJ0aGVyIEFQSSBjYWxsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2Vzc2lvbiBleHBpcmVkIC8gZXJyb3IgaW4gaW5ib3ggbGlzdCA6OjogXCIgKyByZXN1bHQuQVBJUmVzdWx0X0luYm94SXRlbUxpc3QuTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGdldHRpbmcgSW5ib3ggbGlzdC4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxvYWRNb3JlSW5ib3hJdGVtcygpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy50b3RhbENvdW50ID49IHRoaXMucGFnZU51bSAqIDggJiYgc2VsZi53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSkge1xuICAgICAgICAgICAgdGhpcy5wYWdlTnVtID0gdGhpcy5wYWdlTnVtICsgMTtcbiAgICAgICAgICAgIHRoaXMud2ViYXBpLmdldEluYm94TGlzdCh0aGlzLnBhZ2VOdW0pLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5BUElSZXN1bHRfSW5ib3hJdGVtTGlzdC5TdWNjZXNzZnVsID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRvdGFsQ291bnQgPSByZXN1bHQuQVBJUmVzdWx0X0luYm94SXRlbUxpc3QuVG90YWxJdGVtQ291bnRJbkFsbFBhZ2VzO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gcmVzdWx0LkFQSVJlc3VsdF9JbmJveEl0ZW1MaXN0LkluYm94SXRlbUxpc3QuSW5ib3hJdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFsLmxlbmd0aCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5ib3hMaXN0LnB1c2godG90YWxbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbmJveExpc3QucHVzaCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LkFQSVJlc3VsdF9JbmJveEl0ZW1MaXN0Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNlc3Npb24gZXhwaXJlZCBvciBFcnJvciBpbiBpbmJveCBsb2FkIG1vcmVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgZ2V0dGluZyBJbmJveExpc3QgbW9yZS4uIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVJbmRpY2F0b3IoKSB7XG4gICAgICAgIHRoaXMud2ViYXBpLmxvYWRlci5oaWRlKCk7XG4gICAgfVxuICAgIHBvcHVwYnRuKCkge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9ICF0aGlzLmlzVmlzaWJsZTtcbiAgICB9XG4gICAgcG9wdXBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaW5ib3hWaWV3KGl0ZW06IGFueSkge1xuICAgICAgICBsZXQgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgXCJJTkJPWF9MSVNUXCI6IEpTT04uc3RyaW5naWZ5KHRoaXMuaW5ib3hMaXN0KSxcbiAgICAgICAgICAgICAgICBcImluYm94SXRlbVwiOiBKU09OLnN0cmluZ2lmeShpdGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvaW5ib3h2aWV3XCJdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9XG59O1xuXG5cblxuXG5cbiJdfQ==