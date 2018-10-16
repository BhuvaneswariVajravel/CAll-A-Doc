"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var dependent_component_1 = require("./dependent.component");
var DependentModule = (function () {
    function DependentModule() {
    }
    return DependentModule;
}());
DependentModule = __decorate([
    core_1.NgModule({
        imports: [
            nativescript_module_1.NativeScriptModule,
            router_1.NativeScriptRouterModule
        ],
        declarations: [
            dependent_component_1.DependentComponent
        ],
        exports: [dependent_component_1.DependentComponent],
        schemas: [
            core_1.NO_ERRORS_SCHEMA
        ],
        bootstrap: [dependent_component_1.DependentComponent],
    })
], DependentModule);
exports.DependentModule = DependentModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW50Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGVuZGVudC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnRkFBOEU7QUFDOUUsc0NBQTJEO0FBQzNELHNEQUF1RTtBQUN2RSw2REFBMkQ7QUFnQjNELElBQWEsZUFBZTtJQUE1QjtJQUErQixDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBQWhDLElBQWdDO0FBQW5CLGVBQWU7SUFkM0IsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1Asd0NBQWtCO1lBQ2xCLGlDQUF3QjtTQUN6QjtRQUNELFlBQVksRUFBRTtZQUNaLHdDQUFrQjtTQUNuQjtRQUNELE9BQU8sRUFBRSxDQUFDLHdDQUFrQixDQUFDO1FBQzdCLE9BQU8sRUFBRTtZQUNQLHVCQUFnQjtTQUNqQjtRQUNELFNBQVMsRUFBRSxDQUFDLHdDQUFrQixDQUFDO0tBQ2hDLENBQUM7R0FDVyxlQUFlLENBQUk7QUFBbkIsMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgRGVwZW5kZW50Q29tcG9uZW50IH0gZnJvbSBcIi4vZGVwZW5kZW50LmNvbXBvbmVudFwiO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBEZXBlbmRlbnRDb21wb25lbnRcbiAgXSxcbiAgZXhwb3J0czogW0RlcGVuZGVudENvbXBvbmVudF0sXG4gIHNjaGVtYXM6IFtcbiAgICBOT19FUlJPUlNfU0NIRU1BXG4gIF0sXG4gIGJvb3RzdHJhcDogW0RlcGVuZGVudENvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIERlcGVuZGVudE1vZHVsZSB7IH1cbiJdfQ==