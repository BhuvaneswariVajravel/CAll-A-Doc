import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
@Component({
	moduleId: module.id,
	templateUrl: "./forgotpasswordconfirm.component.html"
})
export class ForgotPasswordConfirmComponent {
	
	constructor(private page: Page) { }
	ngOnInit() {
		this.page.actionBarHidden = true;
	}
};


