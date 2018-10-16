import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../configuration/configuration';
import 'rxjs/add/operator/map';
import * as ApplicationSettings from "application-settings";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { connectionType, getConnectionType } from "connectivity";
import dialogs = require("ui/dialogs");
import { RouterExtensions } from "nativescript-angular/router";


@Injectable()
export class WebAPIService {
        loader = new LoadingIndicator();
        options = {
                message: 'Loading...',
                progress: 0.65,
                android: {
                        indeterminate: true,
                        cancelable: false,
                        max: 100,
                        progressNumberFormat: "%1d/%2d",
                        progressPercentFormat: 0.53,
                        progressStyle: 1,
                        secondaryProgress: 1
                },
                ios: {
                        details: "Additional detail note!",
                        margin: 10,
                        dimBackground: true,
                        color: "#000", // color of indicator and labels 
                        // background box around indicator 
                        // hideBezel will override this if true 
                        //backgroundColor: "yellow",
                        hideBezel: true, // default false, can hide the surrounding bezel 
                        //view: UIView, // Target view to show on top of (Defaults to entire window) 
                        // mode: // see iOS specific options below 
                }
        };
        private headers: Headers;
        private APIKey: string;
        private Key: string = "";
        private GroupNumber: string = "";
        public ExternalMemberId: string = ""; private usertype: string = "";
        constructor(private http: Http, private configuration: Configuration, private router: Router, private rs: RouterExtensions) {
                this.APIKey = configuration.APIKey;
                if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
                        let usrdata = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
                        this.Key = usrdata.Key;
                        this.GroupNumber = usrdata.GroupNumber;
                        this.usertype = usrdata.AccountType;
                        this.ExternalMemberId = usrdata.ExternalMemberId;
                        if (ApplicationSettings.hasKey("MEMBER_ACCESS")) {
                                this.ExternalMemberId = ApplicationSettings.getString("MEMBER_ACCESS");
                        }
                }
        }
        // For Http POST method - To convert application/json to application/x-www-form-urlencoded format
        JsonToFormEncoded(details) {
                let formBody: any = [];
                for (var property in details) {
                        var encodedKey = encodeURIComponent(property);
                        var encodedValue = encodeURIComponent(details[property]);
                        formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                return formBody;
        }
        // Get Service Types
        activate_http(user_input): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { APIKey: this.APIKey, FirstName: user_input.FirstName, LastName: user_input.LastName, DOB: user_input.DOB, ExtMemberId: user_input.ExternalMemberId };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.AuthenticationAPI + "Activate", body, options)
                        .map((response: Response) => response);
        }
        // Get Service Types
        authenticate_http(username, password): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { APIKey: this.APIKey, LoginName: username, Password: password };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.AuthenticationAPI + "Authenticate", body, options)
                        .map((response: Response) => response);
        }
        // Get Service Types
        getServiceType_http(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ListName: "ServiceType", Demo: "None" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.InformationAPI + "CodeList_Get", body, options)
                        .map((response: Response) => response);
        }
        // Get Member InformationAPI
        getMemberInfo(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.APIKey, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.getMemberDtls + "GetMemberInfo", body, options)
                        .map((response: Response) => response);
        }
         getMemberInfoForImage(ExternalId): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.APIKey, GroupNumber: this.GroupNumber, ExternalMemberId: ExternalId, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.getMemberDtls + "GetMemberInfo", body, options)
                        .map((response: Response) => response);
        }

        // Get Member Plan Info
        getPlanInfo(apiname): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.BenefitsAPI + apiname, body, options)
                        .map((response: Response) => response);
        }
        // Get Member Billing Info
        getBillingInfo(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.BenefitsAPI + "BillingInfo_Get", body, options)
                        .map((response: Response) => response);
        }
        // Save Biiling Info
        saveBillingInfo(usr: any): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "", CardNumber: usr.CardNumber, ExpMonth: usr.ExpMonth, ExpYear: usr.ExpYear, NameOnCard: usr.NameOnCard, Address1: usr.Address1, Address2: usr.Address2, City: usr.City, State: usr.State, Zip: usr.Zip, Phone: usr.Phone };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.BenefitsAPI + "BillingInfo_Set", body, options)
                        .map((response: Response) => response);
        }
        // Save Insurance Info
        saveInsureInfo(user: any): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "", CarrierName: user.CarrierName, CarrierAddress: user.CarrierAddress, CarrierCity: user.CarrierCity, CarrierState: user.CarrierState, CarrierZip: user.CarrierZip, CarrierPhone: user.CarrierPhone, InsuranceGroupId: user.InsuranceGroupId, InsuranceMemberId: user.InsuranceMemberId, BIN: user.BIN, PCN: user.PCN };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.BenefitsAPI + "InsuranceInfo_Set", body, options)
                        .map((response: Response) => response);
        }
        paymentGateway(cardDtls: any): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "", PaymentAmount: cardDtls.ConsultFee, CCVCode: cardDtls.CCVCode, ServiceId: cardDtls.ServiceType, Description: "" };
                let body = this.JsonToFormEncoded(input);
                console.log(body);
                return this.http
                        .post(this.configuration.BenefitsAPI + "ProcessCCPayment", body, options)
                        .map((response: Response) => response);
        }
        personalInfoSave(user: any): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.APIKey, ExternalMemberId: this.ExternalMemberId, GroupNumber: this.GroupNumber, FirstName: user.FirstName, LastName: user.LastName, DOB: user.DOB, Gender: user.Gender, Address1: user.Address1, Address2: user.Address2, City: user.City, State: user.State, Zip: user.Zip, Phone: user.Phone, Phone2: user.Phone2, TimeZoneId: user.TimeZoneId, Email: user.Email };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.getMemberDtls + "UpdateMemberP2", body, options)
                        .map((response: Response) => response);
        }
        savePrefPhar(user: any): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, PharmacyName: user.PharmacyName, PharmacyId: user.PharmacyId, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.ScheduleAPI + "Consultation_MembersPreferredPharmacy_Set", body, options)
                        .map((response: Response) => response);
        }

        getCodeList(listname): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.APIKey, GroupNumber: this.GroupNumber, ListName: listname, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.InformationAPI + "CodeList_Get", body, options)
                        .map((response: Response) => response);
        }
        // Get members preferred pharmacy
        getMembersPreferredPharmacy_http(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.ScheduleAPI + "Consultation_MembersPreferredPharmacy_Get", body, options)
                        .map((response: Response) => response);
        }
        //Request Consult
        consultationScheduleEmail_http(subject: string, desc: string): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Subject: subject, Content: desc, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.ScheduleAPI + "Consultation_NewEmailRequestSubmit", body, options)
                        .map((response: Response) => response);
        }
        //Consulting History
        consulthistorydata(pfname, plname, servn, servs, startd, endd, pageNo): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, PhysicianFirstName: pfname, PhysicianLastName: plname, ServiceType: servn, ServiceStatus: servs, ServiceDateStart: startd, ServiceDateEnd: endd, PageNumber: pageNo, ItemCountPerPage: 10, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "ConsultationSearch", body, options)
                        .map((response: Response) => response);
        }
        consulthistoryView(itemId): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ConsultationItemId: itemId, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "ConsultationDetail_Get", body, options)
                        .map((response: Response) => response);
        }
        followUpOrReply(conitemId, sub, cont): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ConsultationItemId: conitemId, Subject: sub, Content: cont, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "ConsultationDetail_FollowUpOrReply", body, options)
                        .map((response: Response) => response);
        }
        consultationRecordAudio(itemId): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ActionItemId: itemId, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "ConsultationRecording_Get", body, options)
                        .map((response: Response) => response);
        }
        //Scheduled Consults
        scheduledconsults(pageNo): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, PageNumber: pageNo, ItemCountPerPage: 6, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "ConsultationScheduledList_Get", body, options)
                        .map((response: Response) => response);
        }
        markAsReadOrUnread(conitemId, read): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ConsultationItemId: conitemId, MarkAsRead: read, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "ConsultationDetail_StatusUpdate", body, options)
                        .map((response: Response) => response);
        }
        //Pharmacy Search
        pharmacySearch(pharname, zip, state, city): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, PharmacyName: pharname, Zip: zip, MaxCount: 15, StateAbbrev: state, CityName: city, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ScheduleAPI + "Pharmacy_Search", body, options)
                        .map((response: Response) => response);
        }
        //TO Place Markers in PharmacySearch
        getPlaces(place): Observable<any> {
                let url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + place + "&key=AIzaSyBT4TkMAGKWiM_Bh9GhbP_lgLqdRaWwUXw";
                return this.http.get(url).map((response: Response) => response.json());
        }
        //To Show INBOX List
        getInboxList(pageNo): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemCountPerPage: 8, PageNumber: pageNo, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.InboxAPI + "InboxItemList_Get", body, options)
                        .map((response: Response) => response);
        }
        //Inbox item data
        getInboxItemDtls(itemId): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: itemId, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.InboxAPI + "InboxItem_Get", body, options)
                        .map((response: Response) => response);
        }
        inboxItemStatusUpdate(itemId, opened): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: itemId, AlreadyOpened: opened, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.InboxAPI + "InboxItem_StatusUpdate", body, options)
                        .map((response: Response) => response);
        }
        changepassword(changepwd): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, UserType: this.usertype, Pwd: changepwd.Password, PwdConfirm: changepwd.ConfirmPassword };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.AuthenticationAPI + "ChangePassword", body, options)
                        .map((response: Response) => response);
        }
        followUpList(pageNo): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, PageNumber: pageNo, ItemCountPerPage: 8, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "ConsultationFollowUpList_Get", body, options)
                        .map((response: Response) => response);
        }
        // For got password
        forgotPassword(name, email): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { APIKey: this.APIKey, LoginName: name, Email: email };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.AuthenticationAPI + "ForgotPassword", body, options)
                        .map((response: Response) => response);
        }
        // Fee details
        consultationFeeDetails(serviceid): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { APIKey: this.APIKey, ExternalMemberId: this.ExternalMemberId, GroupNumber: this.GroupNumber, ServiceId: serviceid };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "GetConsultFee", body, options)
                        .map((response: Response) => response);
        }
        //Personal and life style Get
        personalAndLSSummary(apiname): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(apiname != 'FamilyMembers_Grid_Get' ? this.configuration.HealthRecordsAPI + apiname : this.configuration.BenefitsAPI + apiname, body, options)
                        .map((response: Response) => response);
        }
        //EMR Complete
        getEMRComplete_http(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.HealthRecordsAPI + "EMRComplete_Get", body, options)
                        .map((response: Response) => response);
        }
        //Drug allergies grid get
        drugAllergiesGet(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: 0, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.HealthRecordsAPI + "EMR_DrugAllergy_Grid_Get", body, options)
                        .map((response: Response) => response);
        }
        //Get Medications List
        getMedications_http(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: 0, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.HealthRecordsAPI + "EMR_Medications_Grid_Get", body, options)
                        .map((response: Response) => response);
        }
        //Get Medical Conditions List
        getMedicalConditions_http(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: 0, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.HealthRecordsAPI + "EMR_MedicalCondition_Grid_Get", body, options)
                        .map((response: Response) => response);
        }
        //Get Medical Conditions List
        addOrUpdateMedicalConditions_http(item): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: 0, Demo: "" };
                let body = this.JsonToFormEncoded(input)
                return this.http
                        .post(this.configuration.HealthRecordsAPI + "EMR_MedicalCondition_Grid_Get", body, options)
                        .map((response: Response) => response);
        }
        gridGetInHealth(apiname): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: 0, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.HealthRecordsAPI + apiname, body, options)
                        .map((response: Response) => response);
        }
        getFamilyHistory_http(): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ItemId: 0, ConditionId: 0, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.HealthRecordsAPI + "EMR_FamilyHistory_Grid_Get", body, options)
                        .map((response: Response) => response);
        }
        setFamilyHistoryCondition_http(conditionId, type): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, ConditionId: conditionId, Type: type, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.HealthRecordsAPI + "EMR_FamilyHistory_SetFamilyHistoryCondition", body, options)
                        .map((response: Response) => response);
        }

        launchTwilioVideo(serviceId): Observable<any> {
                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                let options = new RequestOptions({ headers: headers });
                let input = { Key: this.Key, GroupNumber: this.GroupNumber, ExternalMemberId: this.ExternalMemberId, PersonServiceRequestId: serviceId, Demo: "" };
                let body = this.JsonToFormEncoded(input);
                return this.http
                        .post(this.configuration.ConsultHistoryAPI + "VideoConferenceAuthKey_Get", body, options)
                        .map((response: Response) => response);

        }
        
        convertTime24to12(time24) {
                if (time24 != undefined) {
                        time24 = time24.split(' ');
                        let time12;
                        let tmpArr = time24[1].split(':');
                        if (+tmpArr[0] == 13) {
                                time12 = time24[0] + '  ' + (+tmpArr[0] - 1) + ':' + tmpArr[1] + ':' + tmpArr[2] + ' PM';
                        } else if (+tmpArr[0] == 0) {
                                time12 = time24[0] + '  ' + "11:" + tmpArr[1] + ':' + tmpArr[2] + ' PM';
                        } else {
                                if (+tmpArr[0] == 1) {
                                        time12 = time24[0] + '  ' + '12:' + tmpArr[1] + ':' + tmpArr[2] + ' AM';
                                } else {
                                        if (+tmpArr[0] > 13)
                                                time12 = time24[0] + '  ' + ((+tmpArr[0] - 13).toString().length > 1 ? (+tmpArr[0] - 13) : "0" + (+tmpArr[0] - 13)) + ':' + tmpArr[1] + ':' + tmpArr[2] + ' PM';
                                        else
                                                time12 = time24[0] + '  ' + ((+tmpArr[0] - 1).toString().length > 1 ? (+tmpArr[0] - 1) : "0" + (+tmpArr[0] - 1)) + ':' + tmpArr[1] + ':' + tmpArr[2] + ' AM';
                                }
                        }
                        return time12;
                } else {
                        return "";
                }
        }
        netConnectivityCheck() {
                let value = true;
                if (getConnectionType() === connectionType.none) {
                        dialogs.alert({
                                message: "You are in offline !!!",
                                okButtonText: "Ok"
                        })
                        value = false;
                }
                return value;
        }
        clearCache() {
                ApplicationSettings.clear();
        }
        logout() {
                this.clearCache();
                this.rs.navigate(["/login"], { clearHistory: true });
        }

}