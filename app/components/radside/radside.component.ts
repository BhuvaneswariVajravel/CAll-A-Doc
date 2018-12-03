import { Component, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-pro-ui/sidedrawer/angular';
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
import * as ApplicationSettings from "application-settings";

@Component({
    selector: "side-drawer",
    moduleId: module.id,
    templateUrl: "./radside.component.html",
    providers: [WebAPIService, Configuration]
})
export class RadSideComponent {
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    constructor(private webapi: WebAPIService, private rs: RouterExtensions) { }
    user: any = {};
    private drawer: SideDrawerType; navIcon: boolean = false; hlthClass: boolean = false; fmclass: boolean = false;
    homeClass: boolean = false; rcClass: boolean = false; inbxClass: boolean = false; folUpClass: boolean = false;
    conHisClass: boolean = false; schConslts: boolean = false; htClass: boolean = false; pfClass: boolean = false;
    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        if (ApplicationSettings.hasKey("USER")) {
            this.user = JSON.parse(ApplicationSettings.getString("USER"));
            if (ApplicationSettings.hasKey("FAMILY_MEMBER_DETAILS")) {
                let userList = JSON.parse(ApplicationSettings.getString("FAMILY_MEMBER_DETAILS"));
                if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                    let index = userList.findIndex(x => x.PersonId == ApplicationSettings.getString("MEMBER_ACCESS"))
                    if (index >= 0)
                        this.user.RelationShip = userList[index].RelationShip;
                } else {
                    this.user.RelationShip = "Primary Member";
                }
            }
        } else {
            this.user.RelationShip = "Primary Member";
        }
    }
    openDrawer() {
        this.drawer.showDrawer();
    }
    openDrawer1(args) {
        args.drawer.showDrawer();
    }
    closeDrawer() {
        this.drawer.closeDrawer();
    }
    logout() {
        this.webapi.clearCache();
        this.rs.navigate(["/login"], { clearHistory: true });
    }

    // To Show Loader Long content pages 
    navigateToPage(data: any) {
        let self = this;
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.loader.show(self.webapi.options);
            setTimeout(() => {
                self.rs.navigate([data]).then(function () {
                    setTimeout(() => {
                        self.webapi.loader.hide();
                    }, 1000);
                });
            }, 500);
        }
    }
    gotoRadsidePage(data: any) {
        if (this.webapi.netConnectivityCheck())
            this.rs.navigate([data], { clearHistory: data == '/home' || data == '/home1' ? true : false });
    }
}



