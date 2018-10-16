"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Configuration = (function () {
    function Configuration() {
        this.ServerUrl = "https://www.247calladoc.com/WebServices/";
        this.APIKey = "BD45F084-4261-774E-F31B-BA212F8C59D5";
        //Authentication Calls
        this.AuthenticationApiUrl = "API_Security.asmx/";
        this.AuthenticationAPI = this.ServerUrl + this.AuthenticationApiUrl;
        //Informational Calls - Refer API document - Section 2 
        this.InformationApiUrl = "API.asmx/";
        this.InformationAPI = this.ServerUrl + this.InformationApiUrl;
        //Benefits - Refer API document - Section 3 
        this.BenefitsApiUrl = "API_Benefit.asmx/";
        this.BenefitsAPI = this.ServerUrl + this.BenefitsApiUrl;
        //Consult History and Scheduled Consults - Refer API document - Section 4
        this.ConsultHistory = "API_Consultations.asmx/";
        this.ConsultHistoryAPI = this.ServerUrl + this.ConsultHistory;
        //Health Records - Refer API document - Section 5
        this.HealthRecordsApiUrl = "API_EMR.asmx/";
        this.HealthRecordsAPI = this.ServerUrl + this.HealthRecordsApiUrl;
        //Schedule - Refer API document - Section 7
        this.ScheduleApiUrl = "API_Schedule.asmx/";
        this.ScheduleAPI = this.ServerUrl + this.ScheduleApiUrl;
        //For inbox
        this.InboxApiUrl = "API_Inbox.asmx/";
        this.InboxAPI = this.ServerUrl + this.InboxApiUrl;
        //For GetMember Info 
        this.EnrollmentAPI = "EnrollmentService.asmx/";
        this.getMemberDtls = this.ServerUrl + this.EnrollmentAPI;
    }
    return Configuration;
}());
Configuration = __decorate([
    core_1.Injectable()
], Configuration);
exports.Configuration = Configuration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFHM0MsSUFBYSxhQUFhO0lBRDFCO1FBRVcsY0FBUyxHQUFXLDBDQUEwQyxDQUFDO1FBQy9ELFdBQU0sR0FBRyxzQ0FBc0MsQ0FBQztRQUV2RCxzQkFBc0I7UUFDZix5QkFBb0IsR0FBVyxvQkFBb0IsQ0FBQztRQUNwRCxzQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUV2RSx1REFBdUQ7UUFDL0Msc0JBQWlCLEdBQVcsV0FBVyxDQUFDO1FBQ3hDLG1CQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFFaEUsNENBQTRDO1FBQ3JDLG1CQUFjLEdBQVcsbUJBQW1CLENBQUM7UUFDN0MsZ0JBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFMUQseUVBQXlFO1FBQ2xFLG1CQUFjLEdBQVUseUJBQXlCLENBQUM7UUFDbEQsc0JBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBRWhFLGlEQUFpRDtRQUMxQyx3QkFBbUIsR0FBVSxlQUFlLENBQUM7UUFDN0MscUJBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7UUFFcEUsMkNBQTJDO1FBQ3BDLG1CQUFjLEdBQVUsb0JBQW9CLENBQUM7UUFDN0MsZ0JBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDMUQsV0FBVztRQUNKLGdCQUFXLEdBQVcsaUJBQWlCLENBQUM7UUFDeEMsYUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNwRCxxQkFBcUI7UUFDZCxrQkFBYSxHQUFXLHlCQUF5QixDQUFDO1FBQ2xELGtCQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBRS9ELENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFsQ0QsSUFrQ0M7QUFsQ1ksYUFBYTtJQUR6QixpQkFBVSxFQUFFO0dBQ0EsYUFBYSxDQWtDekI7QUFsQ1ksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uIHtcclxuICAgIHB1YmxpYyBTZXJ2ZXJVcmw6IHN0cmluZyA9IFwiaHR0cHM6Ly93d3cuMjQ3Y2FsbGFkb2MuY29tL1dlYlNlcnZpY2VzL1wiO1xyXG4gICAgcHVibGljIEFQSUtleSA9IFwiQkQ0NUYwODQtNDI2MS03NzRFLUYzMUItQkEyMTJGOEM1OUQ1XCI7XHJcblxyXG4gICAgLy9BdXRoZW50aWNhdGlvbiBDYWxsc1xyXG4gICAgcHVibGljIEF1dGhlbnRpY2F0aW9uQXBpVXJsOiBzdHJpbmcgPSBcIkFQSV9TZWN1cml0eS5hc214L1wiO1xyXG4gICAgcHVibGljIEF1dGhlbnRpY2F0aW9uQVBJID0gdGhpcy5TZXJ2ZXJVcmwgKyB0aGlzLkF1dGhlbnRpY2F0aW9uQXBpVXJsO1xyXG5cclxuICAgLy9JbmZvcm1hdGlvbmFsIENhbGxzIC0gUmVmZXIgQVBJIGRvY3VtZW50IC0gU2VjdGlvbiAyIFxyXG4gICAgcHVibGljIEluZm9ybWF0aW9uQXBpVXJsOiBzdHJpbmcgPSBcIkFQSS5hc214L1wiO1xyXG4gICAgcHVibGljIEluZm9ybWF0aW9uQVBJID0gdGhpcy5TZXJ2ZXJVcmwgKyB0aGlzLkluZm9ybWF0aW9uQXBpVXJsO1xyXG5cclxuICAgIC8vQmVuZWZpdHMgLSBSZWZlciBBUEkgZG9jdW1lbnQgLSBTZWN0aW9uIDMgXHJcbiAgICBwdWJsaWMgQmVuZWZpdHNBcGlVcmw6IHN0cmluZyA9IFwiQVBJX0JlbmVmaXQuYXNteC9cIjtcclxuICAgIHB1YmxpYyBCZW5lZml0c0FQSSA9IHRoaXMuU2VydmVyVXJsICsgdGhpcy5CZW5lZml0c0FwaVVybDtcclxuXHJcbiAgICAvL0NvbnN1bHQgSGlzdG9yeSBhbmQgU2NoZWR1bGVkIENvbnN1bHRzIC0gUmVmZXIgQVBJIGRvY3VtZW50IC0gU2VjdGlvbiA0XHJcbiAgICBwdWJsaWMgQ29uc3VsdEhpc3Rvcnk6IHN0cmluZyA9XCJBUElfQ29uc3VsdGF0aW9ucy5hc214L1wiO1xyXG4gICAgcHVibGljIENvbnN1bHRIaXN0b3J5QVBJID0gdGhpcy5TZXJ2ZXJVcmwgKyB0aGlzLkNvbnN1bHRIaXN0b3J5O1xyXG5cclxuICAgIC8vSGVhbHRoIFJlY29yZHMgLSBSZWZlciBBUEkgZG9jdW1lbnQgLSBTZWN0aW9uIDVcclxuICAgIHB1YmxpYyBIZWFsdGhSZWNvcmRzQXBpVXJsOiBzdHJpbmcgPVwiQVBJX0VNUi5hc214L1wiO1xyXG4gICAgcHVibGljIEhlYWx0aFJlY29yZHNBUEkgPSB0aGlzLlNlcnZlclVybCArIHRoaXMuSGVhbHRoUmVjb3Jkc0FwaVVybDtcclxuXHJcbiAgICAvL1NjaGVkdWxlIC0gUmVmZXIgQVBJIGRvY3VtZW50IC0gU2VjdGlvbiA3XHJcbiAgICBwdWJsaWMgU2NoZWR1bGVBcGlVcmw6IHN0cmluZyA9XCJBUElfU2NoZWR1bGUuYXNteC9cIjtcclxuICAgIHB1YmxpYyBTY2hlZHVsZUFQSSA9IHRoaXMuU2VydmVyVXJsICsgdGhpcy5TY2hlZHVsZUFwaVVybDtcclxuICAgIC8vRm9yIGluYm94XHJcbiAgICBwdWJsaWMgSW5ib3hBcGlVcmw6IHN0cmluZyA9IFwiQVBJX0luYm94LmFzbXgvXCI7XHJcbiAgICBwdWJsaWMgSW5ib3hBUEkgPSB0aGlzLlNlcnZlclVybCArIHRoaXMuSW5ib3hBcGlVcmw7XHJcbiAgICAvL0ZvciBHZXRNZW1iZXIgSW5mbyBcclxuICAgIHB1YmxpYyBFbnJvbGxtZW50QVBJOiBzdHJpbmcgPSBcIkVucm9sbG1lbnRTZXJ2aWNlLmFzbXgvXCI7XHJcbiAgICBwdWJsaWMgZ2V0TWVtYmVyRHRscyA9IHRoaXMuU2VydmVyVXJsICsgdGhpcy5FbnJvbGxtZW50QVBJO1xyXG5cclxufVxyXG4iXX0=