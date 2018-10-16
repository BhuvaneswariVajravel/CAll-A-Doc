import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Page } from "ui/page";
import { RequestConsultModel } from "./requestconsult.model";
import { RadSideComponent } from "../radside/radside.component";
import { DatePicker } from "ui/date-picker";
import { TimePicker } from "ui/time-picker";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
// SCHEDULE TYPE
@Component({
  moduleId: module.id,
  templateUrl: "./scheduletype.component.html",
  providers: [RadSideComponent, WebAPIService, Configuration]
})
export class ScheduleTypeComponent {
  public isScheduleNow: boolean = true;
  requestconsult = new RequestConsultModel();
  dtyear: any; dtmonth: any; dtday: any;
  @ViewChild("date") datePicker: ElementRef;
  @ViewChild("time") timePicker: ElementRef;
  today: Date = new Date();
  tSelectedIndex: number = 0;
  timeRange: any = [];
  selectedTime: string;
  showError: boolean = false;
  @ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
  constructor(private page: Page, private router: Router, private activatedRoutes: ActivatedRoute) {
    this.dtday = this.today.getDate();
    this.dtmonth = this.today.getMonth() + 1; //January is 0!
    this.dtyear = this.today.getFullYear();
    this.timeRange = ["7: 00 AM", "8: 00 AM", "9: 00 AM", "10: 00 AM", "11: 00 AM", "12: 00 AM", "1: 00 PM", "2: 00 PM", "3: 00 PM", "4: 00 PM", "4: 00 PM", "5: 00 PM", "6: 00 PM", "7: 00 PM"];
  }
  ngOnInit() {
    this.page.actionBarHidden = true;
    this.radSideComponent.rcClass = true;
    this.activatedRoutes.queryParams.subscribe(params => {
      if (params["REQUEST_CONSULT"] != undefined)
        this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
      this.isScheduleNow = this.requestconsult.ScheduleTimeNow;
      if (!this.isScheduleNow) {
        let selDate = new Date(this.requestconsult.ScheduleTimeFuture);
        this.dtday = selDate.getDate();
        this.dtmonth = selDate.getMonth() + 1;
        this.dtyear = selDate.getFullYear();
        for (let i = 0; i < this.timeRange.length; i++) {
          if (this.timeRange[i] == this.requestconsult.ScheduleTimeRange)
            this.tSelectedIndex = i;
        }
      }
    });
  }
  scheduleTypeOnChange() {
    this.isScheduleNow = !this.isScheduleNow;
  }
  configureDateAndTime() {
   // console.log("execute");
    setTimeout(() => {
      let datePicker: DatePicker = <DatePicker>this.datePicker.nativeElement;
      datePicker.minDate = this.today;
    }, 1000);
  }
  goback() {
    let navigationExtras: NavigationExtras = {
      queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
    };
    this.router.navigate(["/consultationdetails"], navigationExtras);
  }
  showNextPage() {
    if (this.isScheduleNow) {
      this.showError = false;
      this.requestconsult.ScheduleTimeNow = this.isScheduleNow;
      this.requestconsult.ScheduleTimeFuture = "";
      let navigationExtras: NavigationExtras = {
        queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
      };
      this.router.navigate(["/healthrecords"], navigationExtras);
    } else if (!this.isScheduleNow) {
      let now = new Date();
      let t: any = this.selectedTime.split(":");
      let t1: any = t[1].split(" "), hours: number;
      if (t1[2] == "PM" && !(parseInt(t[0]) == 12)) {
        hours = parseInt(t[0]);
        hours = hours + 12;
      } else {
        hours = t[0];
      }
      let sDate = this.getSelectedDate();
      sDate.setHours(hours, 0, 0, 0);
      now.setHours(this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
      let datePicker: DatePicker = <DatePicker>this.datePicker.nativeElement;
      if (sDate > now) {
        this.showError = false;
        this.requestconsult.ScheduleTimeNow = this.isScheduleNow;
        if (!this.isScheduleNow) {
          this.requestconsult.ScheduleTimeFuture = this.getSelectedDate();
          this.requestconsult.ScheduleTimeRange = this.selectedTime;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
        };
        this.router.navigate(["/healthrecords"], navigationExtras);
      } else {
        this.showError = true;
      }
    }
  }
  getSelectedDate(): Date {
    let selectedDate = new Date(this.today.getTime());
    let datePicker: DatePicker = <DatePicker>this.datePicker.nativeElement;
    if (datePicker.date != undefined) {
      selectedDate.setDate(datePicker.date.getDate());
      selectedDate.setMonth(datePicker.date.getMonth());
      selectedDate.setFullYear(datePicker.date.getFullYear());
    }
    return selectedDate;
  }
  onTimeChange(args) {
    //console.log(this.timeRange[args.value]);
    this.selectedTime = this.timeRange[args.value];
  }
};
