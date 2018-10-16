import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public ServerUrl: string = "https://www.247calladoc.com/WebServices/";
    public APIKey = "BD45F084-4261-774E-F31B-BA212F8C59D5";

    //Authentication Calls
    public AuthenticationApiUrl: string = "API_Security.asmx/";
    public AuthenticationAPI = this.ServerUrl + this.AuthenticationApiUrl;

   //Informational Calls - Refer API document - Section 2 
    public InformationApiUrl: string = "API.asmx/";
    public InformationAPI = this.ServerUrl + this.InformationApiUrl;

    //Benefits - Refer API document - Section 3 
    public BenefitsApiUrl: string = "API_Benefit.asmx/";
    public BenefitsAPI = this.ServerUrl + this.BenefitsApiUrl;

    //Consult History and Scheduled Consults - Refer API document - Section 4
    public ConsultHistory: string ="API_Consultations.asmx/";
    public ConsultHistoryAPI = this.ServerUrl + this.ConsultHistory;

    //Health Records - Refer API document - Section 5
    public HealthRecordsApiUrl: string ="API_EMR.asmx/";
    public HealthRecordsAPI = this.ServerUrl + this.HealthRecordsApiUrl;

    //Schedule - Refer API document - Section 7
    public ScheduleApiUrl: string ="API_Schedule.asmx/";
    public ScheduleAPI = this.ServerUrl + this.ScheduleApiUrl;
    //For inbox
    public InboxApiUrl: string = "API_Inbox.asmx/";
    public InboxAPI = this.ServerUrl + this.InboxApiUrl;
    //For GetMember Info 
    public EnrollmentAPI: string = "EnrollmentService.asmx/";
    public getMemberDtls = this.ServerUrl + this.EnrollmentAPI;

}
