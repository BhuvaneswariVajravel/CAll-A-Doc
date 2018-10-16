"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var forms_1 = require("nativescript-angular/forms");
var videochat_routing_1 = require("./videochat.routing");
var videochat_component_1 = require("./videochat.component");
var VideoChatModule = (function () {
    function VideoChatModule() {
    }
    return VideoChatModule;
}());
VideoChatModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            forms_1.NativeScriptFormsModule,
            router_1.NativeScriptRouterModule.forRoot(videochat_routing_1.videoChatRoutes),
            http_1.NativeScriptHttpModule
        ],
        declarations: [videochat_component_1.VideoChatComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [videochat_component_1.VideoChatComponent],
    })
], VideoChatModule);
exports.VideoChatModule = VideoChatModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9jaGF0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpZGVvY2hhdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnRkFBOEU7QUFFOUUsc0NBQTJEO0FBQzNELGtEQUFtRTtBQUNuRSxzREFBdUU7QUFDdkUsb0RBQXFFO0FBQ3JFLHlEQUFzRDtBQUN0RCw2REFBMkQ7QUFnQjNELElBQWEsZUFBZTtJQUE1QjtJQUErQixDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBQWhDLElBQWdDO0FBQW5CLGVBQWU7SUFkM0IsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4QiwrQkFBdUI7WUFDdkIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLG1DQUFlLENBQUM7WUFDakQsNkJBQXNCO1NBQ3ZCO1FBQ0QsWUFBWSxFQUFFLENBQUMsd0NBQWtCLENBQUM7UUFDbEMsT0FBTyxFQUFFO1lBQ1AsdUJBQWdCO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFLENBQUMsd0NBQWtCLENBQUM7S0FDaEMsQ0FBQztHQUNXLGVBQWUsQ0FBSTtBQUFuQiwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvbkVuZCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyB2aWRlb0NoYXRSb3V0ZXMgfSBmcm9tIFwiLi92aWRlb2NoYXQucm91dGluZ1wiO1xuaW1wb3J0IHsgVmlkZW9DaGF0Q29tcG9uZW50IH0gZnJvbSBcIi4vdmlkZW9jaGF0LmNvbXBvbmVudFwiO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUuZm9yUm9vdCh2aWRlb0NoYXRSb3V0ZXMpLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbVmlkZW9DaGF0Q29tcG9uZW50XSxcbiAgc2NoZW1hczogW1xuICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgXSxcbiAgYm9vdHN0cmFwOiBbVmlkZW9DaGF0Q29tcG9uZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgVmlkZW9DaGF0TW9kdWxlIHsgfVxuIl19