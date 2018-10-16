import { Component } from "@angular/core";
import { registerElement } from "nativescript-angular/element-registry";
registerElement('MapView', () => require("nativescript-google-maps-sdk").MapView);
registerElement("Ripple", () => require("nativescript-ripple").Ripple);
//console.log("Registering DropDown and MapView..");
@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})
export class AppComponent {}
