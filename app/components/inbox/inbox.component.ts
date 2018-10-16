import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { RadSideComponent } from "../radside/radside.component";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
let xml2js = require('nativescript-xml2js');
//INBOX
@Component({
    moduleId: module.id,
    templateUrl: "./inbox.component.html",
    providers: [WebAPIService, Configuration, RadSideComponent]
})
export class InboxComponent {
    pageNum = 1; totalCount = 0;
    isVisible: boolean = false; inboxList: any = [];
    @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
    constructor(private page: Page, private webapi: WebAPIService, private router: Router, private actRoute: ActivatedRoute) { }
    ngOnInit() {
        this.page.actionBarHidden = true; this.radSideComponent.inbxClass = true;
        let self = this;
        self.actRoute.queryParams.subscribe(params => {
            if (params["INBOX_LIST"] != undefined) {
                self.inboxList = JSON.parse(params["INBOX_LIST"]);
            } else if (self.webapi.netConnectivityCheck()) {
                self.webapi.loader.show(self.webapi.options);
                this.webapi.getInboxList(this.pageNum).subscribe(data => {
                    xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                        if (result.APIResult_InboxItemList.Successful == "true") {
                            if (result.APIResult_InboxItemList.InboxItemCount != "0") {
                                self.totalCount = result.APIResult_InboxItemList.TotalItemCountInAllPages;
                                let total = result.APIResult_InboxItemList.InboxItemList.InboxItem;
                                if (total.length != undefined) {
                                    for (let i = 0; i < total.length; i++) {
                                        self.inboxList.push(total[i]);
                                    }
                                } else {
                                    self.inboxList.push(total);
                                }
                                self.hideIndicator();
                            } else {
                                self.hideIndicator();
                            }
                        } else {
                            self.hideIndicator();
                            if (result.APIResult_InboxItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                                self.webapi.logout();
                            }
                            //console.log("session expired / error in inbox list ::: " + result.APIResult_InboxItemList.Message);
                        }
                    });
                },
                    error => {
                        self.hideIndicator();
                       // console.log("Error while getting Inbox list.. " + error);
                    });
            }
        });
    }
    loadMoreInboxItems() {
        let self = this;
        if (this.totalCount >= this.pageNum * 8 && self.webapi.netConnectivityCheck()) {
            this.pageNum = this.pageNum + 1;
            this.webapi.getInboxList(this.pageNum).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_InboxItemList.Successful == "true") {
                        self.totalCount = result.APIResult_InboxItemList.TotalItemCountInAllPages;
                        let total = result.APIResult_InboxItemList.InboxItemList.InboxItem;
                        if (total.length != undefined) {
                            for (let i = 0; i < total.length; i++) {
                                self.inboxList.push(total[i]);
                            }
                        } else {
                            self.inboxList.push(total);
                        }
                    } else if (result.APIResult_InboxItemList.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                        self.webapi.logout();
                    } else {
                       // console.log("Session expired or Error in inbox load more");
                    }
                });
            },
                error => {
                   // console.log("Error while getting InboxList more.. " + error);
                });
        }
    }
    hideIndicator() {
        this.webapi.loader.hide();
    }
    popupbtn() {
        this.isVisible = !this.isVisible;
    }
    popupclose() {
        this.isVisible = false;
    }
    inboxView(item: any) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "INBOX_LIST": JSON.stringify(this.inboxList),
                "inboxItem": JSON.stringify(item)
            }
        };
        this.router.navigate(["/inboxview"], navigationExtras);
    }
};





