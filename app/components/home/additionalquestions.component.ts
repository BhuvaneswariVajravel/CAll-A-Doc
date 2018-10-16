import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Page } from "ui/page";
import { Configuration } from "../../shared/configuration/configuration";
import { WebAPIService } from "../../shared/services/web-api.service";
import { RequestConsultModel } from "./requestconsult.model";
import * as ApplicationSettings from "application-settings";
import * as imagepicker from "nativescript-imagepicker";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { RadSideComponent } from "../radside/radside.component";
let ImageSourceModule = require("image-source");
// ADDITIONAL QUESTIONS
let http_request = require("http");
let xml2js = require('nativescript-xml2js');
let permissions = require("nativescript-permissions");
let platformModule = require("platform");
declare let android: any;
@Component({
	moduleId: module.id,
	templateUrl: "./additionalquestions.component.html",
	providers: [WebAPIService, Configuration, RadSideComponent]
})
export class AdditionalQuestionsComponent {
	requestconsult = new RequestConsultModel();
	userPhoneNumber: string;
	formSubmitted: boolean = false;
	emergencyRoomChecked: boolean = false;
	urgentCareChecked: boolean = false;
	primaryCareChecked: boolean = false;
	authorize: boolean = false;
	rDetails: any = {}; usrdata: any = {}; imgdtls: any = {};
	pic1: any = null; pic2: any = null; pic3: any = null;
	@ViewChild(RadSideComponent) radSideComponent: RadSideComponent;
	constructor(private page: Page, private webapi: WebAPIService, private router: Router, private activatedRoutes: ActivatedRoute, private _changeDetectionRef: ChangeDetectorRef) { }
	ngOnInit() {
		if (ApplicationSettings.hasKey("USER")) {
			this.userPhoneNumber = JSON.parse(ApplicationSettings.getString("USER")).Phone;
		}
		this.page.actionBarHidden = true;
		this.radSideComponent.rcClass = true;
		this.activatedRoutes.queryParams.subscribe(params => {
			if (params["REQUEST_CONSULT"] != undefined)
				this.requestconsult = JSON.parse(params["REQUEST_CONSULT"]);
		});
	}
	ngAfterViewInit() {
		if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
			let data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
			this.usrdata.GroupNumber = data.GroupNumber;
			this.usrdata.Key = data.Key;
			this.usrdata.ExternalMemberId = data.ExternalMemberId;
		}
	}
	goback() {
		let navigationExtras: NavigationExtras = {
			queryParams: { "REQUEST_CONSULT": JSON.stringify(this.requestconsult) }
		};
		this.router.navigate(["/summary"], navigationExtras);
	}
	showNextPage() {
		this.formSubmitted = true;
		if (this.formSubmitted && this.userPhoneNumber != undefined && this.userPhoneNumber != "" && (this.emergencyRoomChecked || this.urgentCareChecked || this.primaryCareChecked) && this.authorize) {
			this.rDetails.MedicalRequestDetail = [];
			if (this.requestconsult.ShortTermConditionChecked) {
				let rDetail: any = {};
				rDetail.ItemId = 1;
				rDetail.ComplainType = "Short Term Medical Condition";
				rDetail.ComplainTypeItemId = 1;
				rDetail.ComplainDescription = this.requestconsult.ShortTermConditionDescription;
				this.rDetails.MedicalRequestDetail.push(rDetail);
			}
			if (this.requestconsult.LongTermConditionChecked) {
				let rDetail: any = {};
				rDetail.ItemId = 2;
				rDetail.ComplainType = "Long Term Medical Condition";
				rDetail.ComplainTypeItemId = 2;
				rDetail.ComplainDescription = this.requestconsult.LongTermConditionDescription;
				this.rDetails.MedicalRequestDetail.push(rDetail);
			}
			if (this.requestconsult.MedicationRefillChecked) {
				let rDetail: any = {};
				rDetail.ItemId = 3;
				rDetail.ComplainType = "Medication Refill";
				rDetail.ComplainTypeItemId = 3;
				rDetail.ComplainDescription = this.requestconsult.MedicationRefillDescription1 + " , " + this.requestconsult.MedicationRefillDescription2;
				this.rDetails.MedicalRequestDetail.push(rDetail);
			}
			if (this.requestconsult.OtherHealthIssuesChecked) {
				let rDetail: any = {};
				rDetail.ItemId = 4;
				rDetail.ComplainType = "Other Health Related Issues";
				rDetail.ComplainTypeItemId = 4;
				rDetail.ComplainDescription = this.requestconsult.OtherHealthIssuesDescription;
				this.rDetails.MedicalRequestDetail.push(rDetail);
			}
			let usrdata: any = {};
			if (ApplicationSettings.hasKey("USER")) {
				usrdata.ExternalMemberId = JSON.parse(ApplicationSettings.getString("USER")).ExternalMemberId;
			}
			if (ApplicationSettings.hasKey("USER_DEFAULTS")) {
				let data = JSON.parse(ApplicationSettings.getString("USER_DEFAULTS"));
				usrdata.Key = data.Key;
				usrdata.GroupNumber = data.GroupNumber;
			}
			let medDetail: string = this.createXMLDocument(this.rDetails.MedicalRequestDetail);
			//console.log("resuklt         " + medDetail);

			if (this.webapi.netConnectivityCheck()) {
				http_request.request({
					url: "https://www.247calladoc.com/WebServices/API_Schedule.asmx",
					method: "POST",
					headers: { "Content-Type": "text/xml" },
					content: "<?xml version='1.0' encoding='UTF-8'?>" +
					"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/' >" +
					"<soapenv:Body>" +
					"<web:Consultation_Schedule>" +
					"<web:Key>" + usrdata.Key + "</web:Key>" +
					"<web:GroupNumber>" + usrdata.GroupNumber + "</web:GroupNumber>" +
					"<web:ExternalMemberId>" + usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
					"<web:Demo/>" +
					"<web:Request>" +
					"<web:ConsultationType>" + this.requestconsult.ServiceType + "</web:ConsultationType>" +
					"<web:State>" + this.requestconsult.StateId + "</web:State>" +
					"<web:MedicalRequestDetailCount>" + this.rDetails.MedicalRequestDetail.length + "</web:MedicalRequestDetailCount>" +
					"<web:ScheduleTimeNow>" + this.requestconsult.ScheduleTimeNow + "</web:ScheduleTimeNow>" +
					"<web:ScheduleTimeFuture>" + this.requestconsult.ScheduleTimeFuture + "</web:ScheduleTimeFuture>" +
					"<web:PharmacyName>" + this.requestconsult.PharmacyName + "</web:PharmacyName>" +
					"<web:PharmacyId>" + this.requestconsult.PharmacyId + "</web:PharmacyId>" +
					"<web:SetPreferredPharmacy>" + this.requestconsult.SetPreferredPharmacy + "</web:SetPreferredPharmacy>" + medDetail +
					/*"<web:MedicalRequestDetails>"+
					"<web:MedicalRequestDetail>"+
						"<web:ItemId>1</web:ItemId>"+
						"<web:ComplainType>Short Term Medical Condition</web:ComplainType>"+
						"<web:ComplainTypeItemId>1</web:ComplainTypeItemId>"+
						"<web:ComplainDescription>Fever</web:ComplainDescription>"+
					"</web:MedicalRequestDetail>"+
					"</web:MedicalRequestDetails>"+*/
					"</web:Request>" +
					"</web:Consultation_Schedule>" +
					"</soapenv:Body>" +
					"</soapenv:Envelope>"
				}).then((response) => {
					//console.log("-----------------------------------------------------------------");
					//console.log("response  " + response.content);
					//console.log("----------------------------------------------------------------");
					let self = this;
					//console.log(response.content);
					xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {

						//console.log(JSON.stringify(result));
						//console.log(JSON.stringify(result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse));
						//console.log(JSON.stringify(result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse.Consultation_ScheduleResult.Successful));
						let res = result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse.Consultation_ScheduleResult.Successful;
						if (res == "true") {
							//console.log("success     ");
							let navigationExtras: NavigationExtras = {
								queryParams: { "REQUEST_CONSULT": JSON.stringify(self.requestconsult) }
							};
							self.router.navigate(["/confirmation"], navigationExtras);
						} else if (result['soap:Envelope']['soap:Body'].Consultation_ScheduleResponse.Consultation_ScheduleResult.Message == "Please login using MemberLogin screen to get the key before calling any API functions") {
							self.webapi.logout();
						} else {
							alert("Error in Consultation schedule. / Session expired.Try After some time ");
							//console.log("Session expired or Error in Confirming consultation.");
						}
					});
				}, function (e) {
					console.log("Error: " + e);
				});
			}
		}
	}

	createXMLDocument(arr): string {
		let xmlDocument = "<web:MedicalRequestDetails>\n";

		for (let i = 0; i < arr.length; i++) {
			let xmlNode = "\t<web:MedicalRequestDetail>\n ";
			xmlNode += "\t<web:ItemId>" + arr[i].ItemId + "</web:ItemId>\n";
			xmlNode += "\t<web:ComplainType>" + arr[i].ComplainType + "</web:ComplainType>\n";
			xmlNode += "\t<web:ComplainTypeItemId>" + arr[i].ComplainTypeItemId + "</web:ComplainTypeItemId>\n";
			xmlNode += "\t<web:ComplainDescription>" + arr[i].ComplainDescription + "</web:ComplainDescription>\n";
			xmlNode += "</web:MedicalRequestDetail>";
			xmlDocument += "\n" + xmlNode;
		}
		return xmlDocument + "\n</web:MedicalRequestDetails>";
	}
	onConcernChange(value: number) {
		if (value == 1) {
			this.emergencyRoomChecked = true;
			this.urgentCareChecked = false;
			this.primaryCareChecked = false;
		} else if (value == 2) {
			this.emergencyRoomChecked = false;
			this.urgentCareChecked = true;
			this.primaryCareChecked = false;
		} else if (value == 3) {
			this.emergencyRoomChecked = false;
			this.urgentCareChecked = false;
			this.primaryCareChecked = true;
		}
	}
	onAuthorize() {
		this.authorize = !this.authorize;
	}
	onSelectMultipleTap() {
		let context = imagepicker.create({
			mode: "multiple"
		});
		this.startSelection(context);
	}
	onSelectSingleTap() {
		if (this.pic1 == null || this.pic2 == null || this.pic3 == null) {
			let context = imagepicker.create({
				mode: "single"
			});
			this.startSelection(context);
		} else {
			alert("User can upload only 3 images");
		}
	}
	startSelection(context) {
		let _that = this;
		context
			.authorize()
			.then(() => {
				return context.present();
			})
			.then((selection) => {
				//console.log("Selection done:");
				selection.forEach(function (selected) {
					selected.getImage().then(res => {
						_that.imgdtls = {};
						//console.log("----------------");
						//console.log("uri: " + selected.uri);
						//console.log("fileUri: " + selected.fileUri);
						let imgres = selected.fileUri.split("/");
						let imageName = imgres[imgres.length - 1];
						_that.imgdtls.imageName = imageName;
						if (imageName.indexOf('.jpg') > -1 || imageName.indexOf('.png') > -1 || imageName.indexOf('.jpeg') > -1) {
							//console.log("JPG OR JPEG OR PNG IMAGE SELECTED  " + imageName);
							_that.imgdtls.base64textString = res.toBase64String(imageName.split(".")[1], 10);
							_that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
							//console.log(_that.imgdtls.imageSize);
							_that.saveConsultationDocs(_that.imgdtls, "Add");
						} else {
							//console.log("DOCUMENT NAME " + imageName);
							_that.imgdtls.base64textString = res.toBase64String(imageName.split(".")[1], 10);
							_that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
							//console.log(_that.imgdtls.imageSize);
							_that.saveConsultationDocs(_that.imgdtls, "Add");
						}
					});
					if (_that.pic1 == null) {
						_that.pic1 = selected;
					} else if (_that.pic1 != null && _that.pic2 == null) {
						_that.pic2 = selected;
					} else if (_that.pic2 != null && _that.pic3 == null) {
						_that.pic3 = selected;
					}
				});
				_that._changeDetectionRef.detectChanges();
			}).catch(function (e) {
				//console.log(e);
			});
	}

	deleteImage(id) {
		if (id == "pic1") {
			this.pic1 = null;
		} else if (id == "pic2") {
			this.pic2 = null;
		} else if (id == "pic3") {
			this.pic3 = null;
		}
	}

	saveToGallery: boolean = true;
	cameraImage: ImageAsset;
	onTakePictureTap() {
		let _that = this; this.imgdtls = {};
		takePicture({ width: 180, height: 180, keepAspectRatio: false, saveToGallery: this.saveToGallery })
			.then((imageAsset) => {
				let source = new ImageSource();
				source.fromAsset(imageAsset).then((source) => {
					//console.log(`Size: ${source.width}x${source.height}`);
					_that.imgdtls.imageName = "sample.jpg";
					_that.imgdtls.base64textString = source.toBase64String("jpg", 10);
					_that.imgdtls.imageSize = Math.round(_that.imgdtls.base64textString.replace(/\=/g, "").length * 0.75) - 200;
					_that.saveConsultationDocs(_that.imgdtls, "Add");
				})
				_that.cameraImage = imageAsset;
				if (_that.pic1 == null) {
					_that.pic1 = imageAsset;
				} else if (_that.pic1 != null && _that.pic2 == null) {
					_that.pic2 = imageAsset;
				} else if (_that.pic2 != null && _that.pic3 == null) {
					_that.pic3 = imageAsset;
				}
				//console.log("pic1 " + _that.pic1);
				//console.log("pic1 " + _that.pic2);
				//console.log("pic1 " + _that.pic3);
			}, (error) => {
				console.log("Error: " + error);
			});
	}
	onRequestPermissionsTap() {
		if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
			//console.log("hello 1");
			permissions.requestPermission(android.Manifest.permission.CAMERA, "I need these permissions to read from storage")
				.then(() => {
					//console.log("Permissions granted!");
					this.onTakePictureTap();
				})
				.catch(() => {
					//console.log("Uh oh, no permissions - plan B time!");
					alert("You don't have permission to access the camera");
				});
		} else {
			this.onTakePictureTap();
		}
	}
	saveConsultationDocs(item: any, operation) {
		if (this.webapi.netConnectivityCheck()) {
			let self = this;
			self.webapi.loader.show(self.webapi.options);
			if (operation == 'Add') {
				item.PersonServiceRequestId = this.requestconsult.ServiceType;
				item.Action = "Add"; item.ItemId = 0; item.docItemId = 0;
				item.DocumentType = "Consultation Image"; item.FileName = item.imageName;
				item.FileSize = item.imageSize;
				item.FileData = item.base64textString;
				//console.log(item.FileSize + " <<>> " + item.FileName + " <<>> " + item.PersonServiceRequestId);
			}
			http_request.request({
				url: "https://www.247calladoc.com/WebServices/API_Schedule.asmx",
				method: "POST",
				headers: { "Content-Type": "text/xml" },
				content: "<?xml version= '1.0' encoding='utf-8' ?>" +
				"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='https://www.247CallADoc.com/WebServices/'> " +
				"<soapenv:Body>" +
				"<web:ConsultationDocument_Save>" +
				"<web:Key>" + this.usrdata.Key + "</web:Key>" +
				"<web:GroupNumber>" + this.usrdata.GroupNumber + "</web:GroupNumber>" +
				"<web:ExternalMemberId>" + this.usrdata.ExternalMemberId + "</web:ExternalMemberId>" +
				"<web:PersonServiceRequestId>" + item.PersonServiceRequestId + "</web:PersonServiceRequestId>" +
				"<web:Action>" + item.Action + "</web:Action>" +
				"<web:Content><web:ItemId>" + item.ItemId + "</web:ItemId>" +
				"<web:TheDocument>" +
				"<web:DocumentType>" + item.DocumentType + "</web:DocumentType>" +
				"<web:ItemId>" + item.docItemId + "</web:ItemId>" +
				"<web:FileName>" + item.FileName + "</web:FileName>" +
				"<web:FileSize>" + item.FileSize + "</web:FileSize>" +
				"<web:FileData>" + item.FileData + "</web:FileData>" +
				"</web:TheDocument></web:Content><web:Demo/>" +
				"</web:ConsultationDocument_Save></soapenv:Body></soapenv:Envelope>"
			}).then((response) => {
				xml2js.parseString(response.content, { explicitArray: false }, function (err, result) {
					//console.log("Convertionnnn ");
					//console.log(result['soap:Envelope']['soap:Body']);
					//console.log(response.content);
					if (result) {
						let resp = result['soap:Envelope']['soap:Body'].ConsultationDocument_SaveResponse.ConsultationDocument_SaveResult;
					}
					self.webapi.loader.hide();
				});
			}, function (e) {
				self.webapi.loader.hide();
				//console.log("Error in Consultation doc upload : ... " + e);
			});
		}
	}
};