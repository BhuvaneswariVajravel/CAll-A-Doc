"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var OrderconfirmationComponent = (function () {
    function OrderconfirmationComponent(page, activatedRoutes) {
        this.page = page;
        this.activatedRoutes = activatedRoutes;
        this.activateAccount = {};
    }
    OrderconfirmationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = true;
        this.activatedRoutes.queryParams.subscribe(function (params) {
            if (params["LOGIN_CREDENTIALS"] != undefined) {
                _this.activateAccount = JSON.parse(params["LOGIN_CREDENTIALS"]);
                //console.log(JSON.stringify(this.activateAccount));
            }
        });
    };
    return OrderconfirmationComponent;
}());
OrderconfirmationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./orderconfirmation.component.html"
    }),
    __metadata("design:paramtypes", [page_1.Page, router_1.ActivatedRoute])
], OrderconfirmationComponent);
exports.OrderconfirmationComponent = OrderconfirmationComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJjb25maXJtYXRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXJjb25maXJtYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUNqRCxnQ0FBK0I7QUFLL0IsSUFBYSwwQkFBMEI7SUFFdEMsb0NBQW9CLElBQVUsRUFBVSxlQUErQjtRQUFuRCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBRHZFLG9CQUFlLEdBQVEsRUFBRSxDQUFDO0lBQ2lELENBQUM7SUFDNUUsNkNBQVEsR0FBUjtRQUFBLGlCQVFDO1FBUEEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELG9EQUFvRDtZQUNyRCxDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0YsaUNBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLDBCQUEwQjtJQUp0QyxnQkFBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSxvQ0FBb0M7S0FDakQsQ0FBQztxQ0FHeUIsV0FBSSxFQUEyQix1QkFBYztHQUYzRCwwQkFBMEIsQ0FZdEM7QUFaWSxnRUFBMEI7QUFZdEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuQENvbXBvbmVudCh7XG5cdG1vZHVsZUlkOiBtb2R1bGUuaWQsXG5cdHRlbXBsYXRlVXJsOiBcIi4vb3JkZXJjb25maXJtYXRpb24uY29tcG9uZW50Lmh0bWxcIlxufSlcbmV4cG9ydCBjbGFzcyBPcmRlcmNvbmZpcm1hdGlvbkNvbXBvbmVudCB7XG5cdGFjdGl2YXRlQWNjb3VudDogYW55ID0ge307XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXM6IEFjdGl2YXRlZFJvdXRlKSB7IH1cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG5cdFx0dGhpcy5hY3RpdmF0ZWRSb3V0ZXMucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG5cdFx0XHRpZiAocGFyYW1zW1wiTE9HSU5fQ1JFREVOVElBTFNcIl0gIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuYWN0aXZhdGVBY2NvdW50ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJMT0dJTl9DUkVERU5USUFMU1wiXSk7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5hY3RpdmF0ZUFjY291bnQpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufTtcblxuXG4iXX0=