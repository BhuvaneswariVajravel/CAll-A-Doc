"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
var radside_component_1 = require("./radside.component");
var RadSideModule = (function () {
    function RadSideModule() {
    }
    return RadSideModule;
}());
RadSideModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule,
            angular_1.NativeScriptUISideDrawerModule
        ],
        declarations: [
            radside_component_1.RadSideComponent
        ],
        exports: [radside_component_1.RadSideComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [radside_component_1.RadSideComponent],
    })
], RadSideModule);
exports.RadSideModule = RadSideModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkc2lkZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyYWRzaWRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdGQUE4RTtBQUM5RSxzQ0FBMkQ7QUFDM0Qsc0RBQXVFO0FBQ3ZFLGtFQUF3RjtBQUN4Rix5REFBdUQ7QUFpQnZELElBQWEsYUFBYTtJQUExQjtJQUE2QixDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBQTlCLElBQThCO0FBQWpCLGFBQWE7SUFmekIsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtZQUN4Qix3Q0FBOEI7U0FDL0I7UUFDRCxZQUFZLEVBQUU7WUFDWixvQ0FBZ0I7U0FDakI7UUFDRCxPQUFPLEVBQUUsQ0FBQyxvQ0FBZ0IsQ0FBQztRQUMzQixPQUFPLEVBQUU7WUFDUCx1QkFBZ0I7U0FDakI7UUFDRCxTQUFTLEVBQUUsQ0FBQyxvQ0FBZ0IsQ0FBQztLQUM5QixDQUFDO0dBQ1csYUFBYSxDQUFJO0FBQWpCLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJU2lkZURyYXdlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xuaW1wb3J0IHsgUmFkU2lkZUNvbXBvbmVudCB9IGZyb20gXCIuL3JhZHNpZGUuY29tcG9uZW50XCI7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFVJU2lkZURyYXdlck1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBSYWRTaWRlQ29tcG9uZW50XG4gIF0sXG4gIGV4cG9ydHM6IFtSYWRTaWRlQ29tcG9uZW50XSxcbiAgc2NoZW1hczogW1xuICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgXSxcbiAgYm9vdHN0cmFwOiBbUmFkU2lkZUNvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIFJhZFNpZGVNb2R1bGUgeyB9XG4iXX0=