"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var ApplicationSettings = require("application-settings");
var RadSideComponent = (function () {
    function RadSideComponent(webapi, rs) {
        this.webapi = webapi;
        this.rs = rs;
        this.user = {};
        this.navIcon = false;
        this.hlthClass = false;
        this.fmclass = false;
        this.homeClass = false;
        this.rcClass = false;
        this.inbxClass = false;
        this.folUpClass = false;
        this.conHisClass = false;
        this.schConslts = false;
        this.htClass = false;
        this.pfClass = false;
    }
    RadSideComponent.prototype.ngAfterViewInit = function () {
        this.drawer = this.drawerComponent.sideDrawer;
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                var userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    var index_1 = userList.findIndex(function (x) { return x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"); });
                    if (index_1 >= 0)
                        this.user.RelationShip = userList[index_1].RelationShip;
                }
                else {
                    this.user.RelationShip = "Primary Member";
                }
            }
        }
        else {
            this.user.RelationShip = "Primary Member";
        }
    };
    RadSideComponent.prototype.openDrawer = function () {
        this.drawer.showDrawer();
    };
    RadSideComponent.prototype.openDrawer1 = function (args) {
        args.drawer.showDrawer();
    };
    RadSideComponent.prototype.closeDrawer = function () {
        this.drawer.closeDrawer();
    };
    RadSideComponent.prototype.logout = function () {
        this.webapi.clearCache();
        this.rs.navigate(["/login"], { clearHistory: true });
    };
    RadSideComponent.prototype.navigateToPage = function (data) {
        var self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            setTimeout(function () {
                self.rs.navigate([data]).then(function () {
                    setTimeout(function () {
                        self.webapi.loader.hide();
                    }, 1000);
                });
            }, 500);
        }
    };
    RadSideComponent.prototype.gotoRadsidePage = function (data) {
        if (this.webapi.netConnectivityCheck())
            this.rs.navigate([data], { clearHistory: data == '/home' || data == '/home1' ? true : false });
    };
    return RadSideComponent;
}());
__decorate([
    core_1.ViewChild(angular_1.RadSideDrawerComponent),
    __metadata("design:type", angular_1.RadSideDrawerComponent)
], RadSideComponent.prototype, "drawerComponent", void 0);
RadSideComponent = __decorate([
    core_1.Component({
        selector: "side-drawer",
        moduleId: module.id,
        templateUrl: "./radside.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [web_api_service_1.WebAPIService, router_1.RouterExtensions])
], RadSideComponent);
exports.RadSideComponent = RadSideComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkc2lkZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyYWRzaWRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFxRDtBQUNyRCxzREFBK0Q7QUFDL0Qsa0VBQWdHO0FBQ2hHLHlFQUFzRTtBQUN0RSwwRUFBeUU7QUFDekUsMERBQTREO0FBUTVELElBQWEsZ0JBQWdCO0lBRXpCLDBCQUFvQixNQUFxQixFQUFVLEVBQW9CO1FBQW5ELFdBQU0sR0FBTixNQUFNLENBQWU7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFrQjtRQUN2RSxTQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ2lCLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFBQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQUMsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUMvRyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQUMsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUFDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFBQyxlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzlHLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQUMsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUFDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFBQyxZQUFPLEdBQVksS0FBSyxDQUFDO0lBSm5DLENBQUM7SUFLNUUsMENBQWUsR0FBZjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUQsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMs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QUFDO1FBQ1AsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSwwQkFBMEI7UUFDdkMsU0FBUyxFQUFFLENBQUMsK0JBQWEsRUFBRSw2QkFBYSxDQUFDO0tBQzVDLENBQUM7cUNBRzhCLCtCQUFhLEVBQWMseUJBQWdCO0dBRjlELGdCQUFnQixDQXVENUI7QUF2RFksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQsIFNpZGVEcmF3ZXJUeXBlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXByby11aS9zaWRlZHJhd2VyL2FuZ3VsYXInO1xuaW1wb3J0IHsgV2ViQVBJU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvd2ViLWFwaS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcInNpZGUtZHJhd2VyXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3JhZHNpZGUuY29tcG9uZW50Lmh0bWxcIixcbiAgICBwcm92aWRlcnM6IFtXZWJBUElTZXJ2aWNlLCBDb25maWd1cmF0aW9uXVxufSlcbmV4cG9ydCBjbGFzcyBSYWRTaWRlQ29tcG9uZW50IHtcbiAgICBAVmlld0NoaWxkKFJhZFNpZGVEcmF3ZXJDb21wb25lbnQpIHB1YmxpYyBkcmF3ZXJDb21wb25lbnQ6IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB3ZWJhcGk6IFdlYkFQSVNlcnZpY2UsIHByaXZhdGUgcnM6IFJvdXRlckV4dGVuc2lvbnMpIHsgfVxuICAgIHVzZXI6IGFueSA9IHt9O1xuICAgIHByaXZhdGUgZHJhd2VyOiBTaWRlRHJhd2VyVHlwZTsgbmF2SWNvbjogYm9vbGVhbiA9IGZhbHNlOyBobHRoQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTsgZm1jbGFzczogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGhvbWVDbGFzczogYm9vbGVhbiA9IGZhbHNlOyByY0NsYXNzOiBib29sZWFuID0gZmFsc2U7IGluYnhDbGFzczogYm9vbGVhbiA9IGZhbHNlOyBmb2xVcENsYXNzOiBib29sZWFuID0gZmFsc2U7XG4gICAgY29uSGlzQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTsgc2NoQ29uc2x0czogYm9vbGVhbiA9IGZhbHNlOyBodENsYXNzOiBib29sZWFuID0gZmFsc2U7IHBmQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuZHJhd2VyID0gdGhpcy5kcmF3ZXJDb21wb25lbnQuc2lkZURyYXdlcjtcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiVVNFUlwiKSkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlVTRVJcIikpO1xuICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiRkFNSUxZX01FTUJFUl9ERVRBSUxTXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJMaXN0ID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIkZBTUlMWV9NRU1CRVJfREVUQUlMU1wiKSk7XG4gICAgICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwiTUVNQkVSX0FDQ0VTU1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB1c2VyTGlzdC5maW5kSW5kZXgoeCA9PiB4LlBlcnNvbklkID09IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiTUVNQkVSX0FDQ0VTU1wiKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gdXNlckxpc3RbaW5kZXhdLlJlbGF0aW9uU2hpcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXIuUmVsYXRpb25TaGlwID0gXCJQcmltYXJ5IE1lbWJlclwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXNlci5SZWxhdGlvblNoaXAgPSBcIlByaW1hcnkgTWVtYmVyXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb3BlbkRyYXdlcigpIHtcbiAgICAgICAgdGhpcy5kcmF3ZXIuc2hvd0RyYXdlcigpO1xuICAgIH1cbiAgICBvcGVuRHJhd2VyMShhcmdzKSB7XG4gICAgICAgIGFyZ3MuZHJhd2VyLnNob3dEcmF3ZXIoKTtcbiAgICB9XG4gICAgY2xvc2VEcmF3ZXIoKSB7XG4gICAgICAgIHRoaXMuZHJhd2VyLmNsb3NlRHJhd2VyKCk7XG4gICAgfVxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy53ZWJhcGkuY2xlYXJDYWNoZSgpO1xuICAgICAgICB0aGlzLnJzLm5hdmlnYXRlKFtcIi9sb2dpblwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9QYWdlKGRhdGE6IGFueSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XG4gICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuc2hvdyhzZWxmLndlYmFwaS5vcHRpb25zKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYucnMubmF2aWdhdGUoW2RhdGFdKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndlYmFwaS5sb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ290b1JhZHNpZGVQYWdlKGRhdGE6IGFueSkge1xuICAgICAgICBpZiAodGhpcy53ZWJhcGkubmV0Q29ubmVjdGl2aXR5Q2hlY2soKSlcbiAgICAgICAgICAgIHRoaXMucnMubmF2aWdhdGUoW2RhdGFdLCB7IGNsZWFySGlzdG9yeTogZGF0YSA9PSAnL2hvbWUnIHx8IGRhdGEgPT0gJy9ob21lMScgPyB0cnVlIDogZmFsc2UgfSk7XG4gICAgfVxufVxuXG5cblxuIl19