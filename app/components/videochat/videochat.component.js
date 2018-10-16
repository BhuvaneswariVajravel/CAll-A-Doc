"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
//import { VideoChat } from './main-view-model';
var observable_1 = require("data/observable");
var page_1 = require("ui/page");
var app = require("tns-core-modules/application");
var nativescript_twilio_video_1 = require("nativescript-twilio-video");
var dialogs = require("ui/dialogs");
var grid_layout_1 = require("ui/layouts/grid-layout");
var nativescript_audio_1 = require("nativescript-audio");
var ApplicationSettings = require("application-settings");
var web_api_service_1 = require("../../shared/services/web-api.service");
var configuration_1 = require("../../shared/configuration/configuration");
var xml2js = require('nativescript-xml2js');
var http = require("http");
var permissions = require('nativescript-permissions');
var timer = require("timer");
var VideoChatComponent = (function (_super) {
    __extends(VideoChatComponent, _super);
    function VideoChatComponent(page, webapi) {
        var _this = _super.call(this) || this;
        _this.page = page;
        _this.webapi = webapi;
        console.log("Constructor............................");
        //  this.playCallingSound();
        _this.page.actionBarHidden = true;
        _this.videoActivity = new nativescript_twilio_video_1.VideoActivity();
        _this.localVideo = new nativescript_twilio_video_1.LocalVideo();
        _this.remoteVideo = new nativescript_twilio_video_1.RemoteVideo();
        _this.videoActivity.localVideoView = _this.localVideo.localVideoView;
        _this.videoActivity.remoteVideoView = _this.remoteVideo.remoteVideoView;
        //this.add_video_views();
        _this.videoActivity.event.on('error', function (reason) {
            _this.error = reason.object['reason'];
            console.log(JSON.stringify(reason.object['reason']));
        });
        console.log("Constructor11111111111............................");
        _this.videoActivity.event.on('didConnectToRoom', function (r) {
            console.log("VIJAY DID CONNECT TO ROOM " + r.object['count']);
            if (r.object['count'] < 1)
                return;
            console.log("didConnectToRoom");
            _this.toggle_local_video_size();
        });
        _this.videoActivity.event.on('didFailToConnectWithError', function (r) {
            console.log("didFailToConnectWithError");
        });
        _this.videoActivity.event.on('participantDidConnect', function (r) {
            console.log("VIJAY PARTICIPANT DID CONNECT " + r.object['count']);
            if (r.object['count'] < 1)
                return;
            console.log("participantDidConnect");
            _this.toggle_local_video_size();
        });
        _this.videoActivity.event.on('participantDidDisconnect', function (r) {
            console.log("participantDidDisconnect");
            _this.toggle_local_video_size();
        });
        _this.videoActivity.event.on('participantUnpublishedAudioTrack', function (r) {
            console.log("participantUnpublishedAudioTrack");
        });
        _this.videoActivity.event.on('participantPublishedVideoTrack', function (r) {
            console.log("participantPublishedVideoTrack");
        });
        _this.videoActivity.event.on('participantUnpublishedVideoTrack', function (r) {
            console.log("participantUnpublishedVideoTrack");
        });
        _this.videoActivity.event.on('onAudioTrackSubscribed', function (r) {
            console.log("onAudioTrackSubscribed");
        });
        _this.videoActivity.event.on('onAudioTrackUnsubscribed', function (r) {
            console.log("onAudioTrackUnsubscribed");
        });
        _this.videoActivity.event.on('onVideoTrackSubscribed', function (r) {
            console.log("onVideoTrackSubscribed");
        });
        _this.videoActivity.event.on('onVideoTrackUnsubscribed', function (r) {
            console.log("onVideoTrackUnsubscribed 00");
        });
        _this.videoActivity.event.on('participantDisabledVideoTrack', function (r) {
            console.log("participantDisabledVideoTrack");
        });
        _this.videoActivity.event.on('participantEnabledVideoTrack', function (r) {
            console.log("participantEnabledVideoTrack");
        });
        _this.videoActivity.event.on('participantDisabledAudioTrack', function (r) {
            console.log("participantDisabledAudioTrack");
        });
        _this.videoActivity.event.on('participantEnabledAudioTrack', function (r) {
            console.log("participantEnabledAudioTrack");
        });
        console.log("Constructo22222222............................");
        var self = _this;
        _this.get_permissions()
            .then(function () {
            console.log("GET PERMISSIONS METHOD");
            // i find the settimeout allows for a smoother load if you're looking for the preview to begin immediately
            //  var t = timer.setTimeout(() => {
            console.log("JJJKLKKKKJHKHKHJJ");
            self.videoActivity.startPreview();
            //      timer.clearTimeout(t);
            console.log("jjjjj");
            //}, 1200);
        });
        return _this;
    }
    VideoChatComponent.prototype.ngOnInit = function () {
        console.log("NG ON INIT");
        this.container = this.page.getViewById('container');
        // this.container = <StackLayout>this.mainData.nativeElement;
        this.add_video_views();
    };
    VideoChatComponent.prototype.toggle_local_video_size = function () {
        console.log("TAPPED ON CAM VIDEO");
        if (this.localVideo.className === 'large') {
            this.localVideo.className = 'small';
            grid_layout_1.GridLayout.setColumn(this.localVideo, 1);
            grid_layout_1.GridLayout.setRow(this.localVideo, 0);
        }
        else {
            this.localVideo.className = 'large';
            grid_layout_1.GridLayout.setColumn(this.localVideo, 0);
            grid_layout_1.GridLayout.setColumnSpan(this.localVideo, 2);
            grid_layout_1.GridLayout.setRowSpan(this.localVideo, 2);
        }
    };
    VideoChatComponent.prototype.add_video_views = function () {
        console.log("ADD VIDEO VIEW METHOD " + this.container);
        // this.localVideo.id = 'local-video';
        this.localVideo.className = 'large';
        this.remoteVideo.id = 'remote-video';
        this.localVideo.on('tap', this.toggle_local_video_size.bind(this));
        grid_layout_1.GridLayout.setColumnSpan(this.remoteVideo, 2);
        grid_layout_1.GridLayout.setRowSpan(this.remoteVideo, 2);
        grid_layout_1.GridLayout.setRow(this.remoteVideo, 0);
        grid_layout_1.GridLayout.setColumnSpan(this.localVideo, 2);
        grid_layout_1.GridLayout.setRowSpan(this.localVideo, 2);
        grid_layout_1.GridLayout.setRow(this.localVideo, 0);
        this.container.insertChild(this.remoteVideo, 0);
        this.container.insertChild(this.localVideo, 0);
        console.log("ADD VIDEO VIEW METHOD END.......");
    };
    VideoChatComponent.prototype.check_permissions = function () {
        var audio, camera;
        if (app.android) {
            audio = permissions.hasPermission("android.permission.RECORD_AUDIO");
            camera = permissions.hasPermission("android.permission.CAMERA");
        }
        else {
            camera = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeVideo);
            audio = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeAudio);
            if (camera < 3)
                camera = false;
            if (audio < 3)
                audio = false;
        }
        if (!audio || !camera)
            return false;
        else
            return true;
    };
    VideoChatComponent.prototype.get_permissions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var has_permissions = _this.check_permissions();
            if (has_permissions) {
                resolve();
                return;
            }
            if (app.android) {
                permissions.requestPermissions([
                    "android.permission.RECORD_AUDIO",
                    "android.permission.CAMERA"
                ], "I need these permissions because I'm cool")
                    .then(function (response) {
                    console.dir(response);
                    resolve(response);
                })
                    .catch(function (e) {
                    console.dir(e);
                    console.log("Uh oh, no permissions - plan B time!");
                    var has_permissions = _this.check_permissions();
                    if (!has_permissions) {
                        dialogs.alert("without mic and camera permissions \n you cannot connect. \n please allow permissions in settings and try again.").then(function () {
                        });
                    }
                });
            }
            else {
                Promise.all([_this.ios_mic_permission(), _this.ios_camera_permission()])
                    .then(function (values) {
                    console.log(JSON.stringify(values));
                    resolve();
                }, function (reason) {
                    console.log(JSON.stringify(reason));
                    _this.error = reason;
                    dialogs.alert("without mic and camera permissions \n you cannot connect. \n please allow permissions in settings and try again.").then(function () {
                        UIApplication.sharedApplication.openURL(NSURL.URLWithString(UIApplicationOpenSettingsURLString));
                    });
                    reject();
                });
            }
        });
    };
    VideoChatComponent.prototype.ios_mic_permission = function () {
        return new Promise(function (resolve, reject) {
            var has_asked = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeAudio);
            if (has_asked === 2) {
                reject('mic permission denied');
                return;
            }
            AVAudioSession.sharedInstance().requestRecordPermission(function (bool) {
                if (bool === true) {
                    resolve(bool);
                    return;
                }
                reject('mic permission denied');
            });
        });
    };
    VideoChatComponent.prototype.ios_camera_permission = function () {
        return new Promise(function (resolve, reject) {
            var has_asked = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeVideo);
            if (has_asked === 2) {
                reject('camera permission denied');
                return;
            }
            AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(AVMediaTypeVideo, function (bool) {
                if (bool === true) {
                    resolve(bool);
                    return;
                }
                reject('camera permission denied');
            });
        });
    };
    VideoChatComponent.prototype.disconnect = function () {
        ApplicationSettings.setBoolean("isDocCalling", false);
        global.__extends.isAppRuns = false;
        if (this.videoActivity.room) {
            this.videoActivity.disconnect();
        }
        if (this.player != null)
            this.player.dispose();
    };
    VideoChatComponent.prototype.toggle_local_audio = function () {
        this.videoActivity.toggle_local_audio();
    };
    VideoChatComponent.prototype.toggle_local_video = function () {
        this.videoActivity.toggle_local_video();
    };
    VideoChatComponent.prototype.connect_to_room = function () {
        /* if (!this.get('name') || !this.get('room') || this.get('name').length < 1 || this.get('room').length < 1)
             return this.set('error', "Missing Info.");
         else this.set('error', "");
         this.get_token()
             .then(result => {
                 //  var result = result.content.toJSON();
                 let resp: any = JSON.stringify(result);
                 let tokenData: any = JSON.parse(resp);
                 console.log("SUCCESS TOKEN ::  " + tokenData.content.token);
 
                 this.videoActivity.set_access_token(tokenData.content.token);
                 this.videoActivity.connect_to_room(this.get('room'));
                 console.log(this.get('room') + " ROOM NAME");
             }, e => {
                 this.set('error', e);
             });*/
        this.getTwilioVCToken();
    };
    VideoChatComponent.prototype.getTwilioVCToken = function () {
        var self = this;
        console.log("GET TWILIO TOKEN.............");
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.launchTwilioVideo(68971).subscribe(function (data) {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_VideoConferenceAuthKey.Successful == "true" && result.APIResult_VideoConferenceAuthKey.RoomAvailable == "true") {
                        console.log("GOT THE ACCESS TOKEN AND NAME");
                        self.videoActivity.set_access_token(result.APIResult_VideoConferenceAuthKey.AuthKey);
                        self.videoActivity.connect_to_room(result.APIResult_VideoConferenceAuthKey.RoomName);
                    }
                    else {
                        console.log("ROOM NOT AVAILABLE");
                        if (result.APIResult_VideoConferenceAuthKey.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                        console.log("Session expired / Error in Video consult status");
                    }
                });
            }, function (error) {
                console.log("Error while getting video consult token.. " + error);
            });
        }
    };
    /* public get_token(): Promise<any> {
         let data: any = {};
         data.uid = this.name;
         data.AccountSid = "ACac2e4be2d54bfb014559f227f1ff5068";
         data.AuthToken = "6187f7890675716223373eff8d134ff1";
         let name = this.name;
         return http.request({
             url: "https://video.twilio.com/",
             method: "POST",
             headers: { "Content-Type": "application/json" },
             content: JSON.stringify(data)
         });
 }*/
    VideoChatComponent.prototype.get_token = function () {
        console.log("getToken");
        var name = this.get('name');
        return http.request({
            url: "http://192.168.3.52:8080/grabaccess/rest/grab/accessToken",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({ userName: name, roomName: this.get('room') })
        });
    };
    VideoChatComponent.prototype.playCallingSound = function () {
        var _this = this;
        console.log("Play ifle");
        this.player = new nativescript_audio_1.TNSPlayer();
        this.player.initFromFile({
            audioFile: '~/sounds/' + "iphone.mp3",
            loop: false,
            completeCallback: this.trackComplete.bind(this),
            errorCallback: this.trackError.bind(this)
        }).then(function () {
            _this.player.getAudioTrackDuration().then(function (duration) {
                // iOS: duration is in seconds
                // Android: duration is in milliseconds
                console.log("song duration:", duration);
                // this.player.dispose();
            });
        });
        this.player.play();
    };
    VideoChatComponent.prototype.trackComplete = function (args) {
        console.log('reference back to player:', args.player);
        this.player.dispose();
        // iOS only: flag indicating if completed succesfully
        //  console.log('whether song play completed successfully:', args.flag);
    };
    VideoChatComponent.prototype.trackError = function (args) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);
        // Android only: extra detail on error
        //  console.log('extra info on the error:', args.extra);
    };
    VideoChatComponent.prototype.ngOnDestroy = function () {
        console.log("VIDEO DESTROYED....");
        ApplicationSettings.setBoolean("isDocCalling", false);
        global.__extends.isAppRuns = false;
        if (this.player != null)
            this.player.dispose();
    };
    return VideoChatComponent;
}(observable_1.Observable));
VideoChatComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./videochat.component.html",
        providers: [web_api_service_1.WebAPIService, configuration_1.Configuration]
    }),
    __metadata("design:paramtypes", [page_1.Page, web_api_service_1.WebAPIService])
], VideoChatComponent);
exports.VideoChatComponent = VideoChatComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9jaGF0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpZGVvY2hhdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxzQ0FBcUU7QUFDckUsZ0RBQWdEO0FBQ2hELDhDQUF5RDtBQUN6RCxnQ0FBK0I7QUFDL0Isa0RBQW9EO0FBQ3BELHVFQUFtRjtBQUNuRixvQ0FBc0M7QUFFdEMsc0RBQThEO0FBQzlELHlEQUErQztBQUMvQywwREFBNEQ7QUFDNUQseUVBQXNFO0FBQ3RFLDBFQUF5RTtBQUN6RSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUc1QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDdEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBTzdCLElBQWEsa0JBQWtCO0lBQVMsc0NBQVU7SUFVOUMsNEJBQW9CLElBQVUsRUFBVSxNQUFxQjtRQUE3RCxZQUNJLGlCQUFPLFNBMEdWO1FBM0dtQixVQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUV6RCxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDekQsNEJBQTRCO1FBQzFCLEtBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUVqQyxLQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUNBQWEsRUFBRSxDQUFDO1FBRXpDLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxzQ0FBVSxFQUFFLENBQUM7UUFFbkMsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHVDQUFXLEVBQUUsQ0FBQztRQUVyQyxLQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNB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LENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFHTCx5QkFBQztBQUFELENBQUMsQUF0YUQsQ0FBd0MsdUJBQVUsR0FzYWpEO0FBdGFZLGtCQUFrQjtJQUw5QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsU0FBUyxFQUFFLENBQUMsK0JBQWEsRUFBRSw2QkFBYSxDQUFDO0tBQzVDLENBQUM7cUNBVzRCLFdBQUksRUFBa0IsK0JBQWE7R0FWcEQsa0JBQWtCLENBc2E5QjtBQXRhWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG4vL2ltcG9ydCB7IFZpZGVvQ2hhdCB9IGZyb20gJy4vbWFpbi12aWV3LW1vZGVsJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbU9iamVjdCB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICd1aS9wYWdlJztcclxuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCB7IExvY2FsVmlkZW8sIFZpZGVvQWN0aXZpdHksIFJlbW90ZVZpZGVvIH0gZnJvbSAnbmF0aXZlc2NyaXB0LXR3aWxpby12aWRlbyc7XHJcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2xheW91dHMvc3RhY2stbGF5b3V0L3N0YWNrLWxheW91dCc7XHJcbmltcG9ydCB7IEdyaWRMYXlvdXQsIEl0ZW1TcGVjIH0gZnJvbSAndWkvbGF5b3V0cy9ncmlkLWxheW91dCc7XHJcbmltcG9ydCB7IFROU1BsYXllciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hdWRpbyc7XHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCB7IFdlYkFQSVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3dlYi1hcGkuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb25cIjtcclxubGV0IHhtbDJqcyA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC14bWwyanMnKTtcclxuXHJcblxyXG5sZXQgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpO1xyXG5sZXQgcGVybWlzc2lvbnMgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQtcGVybWlzc2lvbnMnKTtcclxubGV0IHRpbWVyID0gcmVxdWlyZShcInRpbWVyXCIpO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi92aWRlb2NoYXQuY29tcG9uZW50Lmh0bWxcIixcclxuICAgIHByb3ZpZGVyczogW1dlYkFQSVNlcnZpY2UsIENvbmZpZ3VyYXRpb25dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBWaWRlb0NoYXRDb21wb25lbnQgZXh0ZW5kcyBPYnNlcnZhYmxlIGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIHB1YmxpYyBwbGF5ZXI6IFROU1BsYXllcjtcclxuICAgIHB1YmxpYyBjb250YWluZXI6IFN0YWNrTGF5b3V0O1xyXG4gICAgcHVibGljIGxvY2FsVmlkZW86IExvY2FsVmlkZW87XHJcbiAgICBwdWJsaWMgcmVtb3RlVmlkZW86IFJlbW90ZVZpZGVvO1xyXG4gICAgcHVibGljIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcm9vbTogc3RyaW5nO1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBlcnJvcjogc3RyaW5nO1xyXG4gICAgcHVibGljIHZpZGVvQWN0aXZpdHk6IFZpZGVvQWN0aXZpdHk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgd2ViYXBpOiBXZWJBUElTZXJ2aWNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnN0cnVjdG9yLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKTtcclxuICAgICAgLy8gIHRoaXMucGxheUNhbGxpbmdTb3VuZCgpO1xyXG4gICAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkgPSBuZXcgVmlkZW9BY3Rpdml0eSgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvY2FsVmlkZW8gPSBuZXcgTG9jYWxWaWRlbygpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbW90ZVZpZGVvID0gbmV3IFJlbW90ZVZpZGVvKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5sb2NhbFZpZGVvVmlldyA9IHRoaXMubG9jYWxWaWRlby5sb2NhbFZpZGVvVmlldztcclxuXHJcbiAgICAgICAgdGhpcy52aWRlb0FjdGl2aXR5LnJlbW90ZVZpZGVvVmlldyA9IHRoaXMucmVtb3RlVmlkZW8ucmVtb3RlVmlkZW9WaWV3O1xyXG5cclxuICAgICAgICAvL3RoaXMuYWRkX3ZpZGVvX3ZpZXdzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5ldmVudC5vbignZXJyb3InLCAocmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSByZWFzb24ub2JqZWN0WydyZWFzb24nXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVhc29uLm9iamVjdFsncmVhc29uJ10pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb25zdHJ1Y3RvcjExMTExMTExMTExLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlwiKTtcclxuXHJcbiAgICAgICAgdGhpcy52aWRlb0FjdGl2aXR5LmV2ZW50Lm9uKCdkaWRDb25uZWN0VG9Sb29tJywgKHIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWSUpBWSBESUQgQ09OTkVDVCBUTyBST09NIFwiICsgci5vYmplY3RbJ2NvdW50J10pO1xyXG4gICAgICAgICAgICBpZiAoci5vYmplY3RbJ2NvdW50J10gPCAxKSByZXR1cm47XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGlkQ29ubmVjdFRvUm9vbVwiKTtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGVfbG9jYWxfdmlkZW9fc2l6ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ2RpZEZhaWxUb0Nvbm5lY3RXaXRoRXJyb3InLCAocikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRpZEZhaWxUb0Nvbm5lY3RXaXRoRXJyb3JcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5ldmVudC5vbigncGFydGljaXBhbnREaWRDb25uZWN0JywgKHIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWSUpBWSBQQVJUSUNJUEFOVCBESUQgQ09OTkVDVCBcIiArIHIub2JqZWN0Wydjb3VudCddKTtcclxuICAgICAgICAgICAgaWYgKHIub2JqZWN0Wydjb3VudCddIDwgMSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcnRpY2lwYW50RGlkQ29ubmVjdFwiKTtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGVfbG9jYWxfdmlkZW9fc2l6ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ3BhcnRpY2lwYW50RGlkRGlzY29ubmVjdCcsIChyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFydGljaXBhbnREaWREaXNjb25uZWN0XCIpO1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZV9sb2NhbF92aWRlb19zaXplKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5ldmVudC5vbigncGFydGljaXBhbnRVbnB1Ymxpc2hlZEF1ZGlvVHJhY2snLCAocikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcnRpY2lwYW50VW5wdWJsaXNoZWRBdWRpb1RyYWNrXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ3BhcnRpY2lwYW50UHVibGlzaGVkVmlkZW9UcmFjaycsIChyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFydGljaXBhbnRQdWJsaXNoZWRWaWRlb1RyYWNrXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ3BhcnRpY2lwYW50VW5wdWJsaXNoZWRWaWRlb1RyYWNrJywgKHIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwYXJ0aWNpcGFudFVucHVibGlzaGVkVmlkZW9UcmFja1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy52aWRlb0FjdGl2aXR5LmV2ZW50Lm9uKCdvbkF1ZGlvVHJhY2tTdWJzY3JpYmVkJywgKHIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbkF1ZGlvVHJhY2tTdWJzY3JpYmVkXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ29uQXVkaW9UcmFja1Vuc3Vic2NyaWJlZCcsIChyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25BdWRpb1RyYWNrVW5zdWJzY3JpYmVkXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ29uVmlkZW9UcmFja1N1YnNjcmliZWQnLCAocikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uVmlkZW9UcmFja1N1YnNjcmliZWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5ldmVudC5vbignb25WaWRlb1RyYWNrVW5zdWJzY3JpYmVkJywgKHIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvblZpZGVvVHJhY2tVbnN1YnNjcmliZWQgMDBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5ldmVudC5vbigncGFydGljaXBhbnREaXNhYmxlZFZpZGVvVHJhY2snLCAocikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcnRpY2lwYW50RGlzYWJsZWRWaWRlb1RyYWNrXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ3BhcnRpY2lwYW50RW5hYmxlZFZpZGVvVHJhY2snLCAocikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcnRpY2lwYW50RW5hYmxlZFZpZGVvVHJhY2tcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5ldmVudC5vbigncGFydGljaXBhbnREaXNhYmxlZEF1ZGlvVHJhY2snLCAocikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcnRpY2lwYW50RGlzYWJsZWRBdWRpb1RyYWNrXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuZXZlbnQub24oJ3BhcnRpY2lwYW50RW5hYmxlZEF1ZGlvVHJhY2snLCAocikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcnRpY2lwYW50RW5hYmxlZEF1ZGlvVHJhY2tcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb25zdHJ1Y3RvMjIyMjIyMjIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXCIpO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZ2V0X3Blcm1pc3Npb25zKClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHRVQgUEVSTUlTU0lPTlMgTUVUSE9EXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGkgZmluZCB0aGUgc2V0dGltZW91dCBhbGxvd3MgZm9yIGEgc21vb3RoZXIgbG9hZCBpZiB5b3UncmUgbG9va2luZyBmb3IgdGhlIHByZXZpZXcgdG8gYmVnaW4gaW1tZWRpYXRlbHlcclxuICAgICAgICAgICAgICAgIC8vICB2YXIgdCA9IHRpbWVyLnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKSkpLTEtLS0tKSEtIS0hKSlwiKTtcclxuICAgICAgICAgICAgICAgIHNlbGYudmlkZW9BY3Rpdml0eS5zdGFydFByZXZpZXcoKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgdGltZXIuY2xlYXJUaW1lb3V0KHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqampqalwiKTtcclxuICAgICAgICAgICAgICAgIC8vfSwgMTIwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJORyBPTiBJTklUXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gPFN0YWNrTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZCgnY29udGFpbmVyJyk7XHJcbiAgICAgICAgLy8gdGhpcy5jb250YWluZXIgPSA8U3RhY2tMYXlvdXQ+dGhpcy5tYWluRGF0YS5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuYWRkX3ZpZGVvX3ZpZXdzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlX2xvY2FsX3ZpZGVvX3NpemUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUQVBQRUQgT04gQ0FNIFZJREVPXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLmxvY2FsVmlkZW8uY2xhc3NOYW1lID09PSAnbGFyZ2UnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxWaWRlby5jbGFzc05hbWUgPSAnc21hbGwnO1xyXG4gICAgICAgICAgICBHcmlkTGF5b3V0LnNldENvbHVtbih0aGlzLmxvY2FsVmlkZW8sIDEpO1xyXG4gICAgICAgICAgICBHcmlkTGF5b3V0LnNldFJvdyh0aGlzLmxvY2FsVmlkZW8sIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxWaWRlby5jbGFzc05hbWUgPSAnbGFyZ2UnO1xyXG4gICAgICAgICAgICBHcmlkTGF5b3V0LnNldENvbHVtbih0aGlzLmxvY2FsVmlkZW8sIDApO1xyXG4gICAgICAgICAgICBHcmlkTGF5b3V0LnNldENvbHVtblNwYW4odGhpcy5sb2NhbFZpZGVvLCAyKTtcclxuICAgICAgICAgICAgR3JpZExheW91dC5zZXRSb3dTcGFuKHRoaXMubG9jYWxWaWRlbywgMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZF92aWRlb192aWV3cygpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkFERCBWSURFTyBWSUVXIE1FVEhPRCBcIiArIHRoaXMuY29udGFpbmVyKTtcclxuICAgICAgICAvLyB0aGlzLmxvY2FsVmlkZW8uaWQgPSAnbG9jYWwtdmlkZW8nO1xyXG4gICAgICAgIHRoaXMubG9jYWxWaWRlby5jbGFzc05hbWUgPSAnbGFyZ2UnO1xyXG4gICAgICAgIHRoaXMucmVtb3RlVmlkZW8uaWQgPSAncmVtb3RlLXZpZGVvJztcclxuXHJcbiAgICAgICAgdGhpcy5sb2NhbFZpZGVvLm9uKCd0YXAnLCB0aGlzLnRvZ2dsZV9sb2NhbF92aWRlb19zaXplLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBHcmlkTGF5b3V0LnNldENvbHVtblNwYW4odGhpcy5yZW1vdGVWaWRlbywgMik7XHJcbiAgICAgICAgR3JpZExheW91dC5zZXRSb3dTcGFuKHRoaXMucmVtb3RlVmlkZW8sIDIpO1xyXG4gICAgICAgIEdyaWRMYXlvdXQuc2V0Um93KHRoaXMucmVtb3RlVmlkZW8sIDApO1xyXG4gICAgICAgIEdyaWRMYXlvdXQuc2V0Q29sdW1uU3Bhbih0aGlzLmxvY2FsVmlkZW8sIDIpO1xyXG4gICAgICAgIEdyaWRMYXlvdXQuc2V0Um93U3Bhbih0aGlzLmxvY2FsVmlkZW8sIDIpO1xyXG4gICAgICAgIEdyaWRMYXlvdXQuc2V0Um93KHRoaXMubG9jYWxWaWRlbywgMCk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0Q2hpbGQodGhpcy5yZW1vdGVWaWRlbywgMCk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0Q2hpbGQodGhpcy5sb2NhbFZpZGVvLCAwKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkFERCBWSURFTyBWSUVXIE1FVEhPRCBFTkQuLi4uLi4uXCIpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY2hlY2tfcGVybWlzc2lvbnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGF1ZGlvLCBjYW1lcmE7XHJcblxyXG4gICAgICAgIGlmIChhcHAuYW5kcm9pZCkge1xyXG4gICAgICAgICAgICBhdWRpbyA9IHBlcm1pc3Npb25zLmhhc1Blcm1pc3Npb24oXCJhbmRyb2lkLnBlcm1pc3Npb24uUkVDT1JEX0FVRElPXCIpXHJcbiAgICAgICAgICAgIGNhbWVyYSA9IHBlcm1pc3Npb25zLmhhc1Blcm1pc3Npb24oXCJhbmRyb2lkLnBlcm1pc3Npb24uQ0FNRVJBXCIpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FtZXJhID0gQVZDYXB0dXJlRGV2aWNlLmF1dGhvcml6YXRpb25TdGF0dXNGb3JNZWRpYVR5cGUoQVZNZWRpYVR5cGVWaWRlbyk7XHJcbiAgICAgICAgICAgIGF1ZGlvID0gQVZDYXB0dXJlRGV2aWNlLmF1dGhvcml6YXRpb25TdGF0dXNGb3JNZWRpYVR5cGUoQVZNZWRpYVR5cGVBdWRpbyk7XHJcbiAgICAgICAgICAgIGlmIChjYW1lcmEgPCAzKSBjYW1lcmEgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKGF1ZGlvIDwgMykgYXVkaW8gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXVkaW8gfHwgIWNhbWVyYSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldF9wZXJtaXNzaW9ucygpOiBQcm9taXNlPGFueT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIGhhc19wZXJtaXNzaW9ucyA9IHRoaXMuY2hlY2tfcGVybWlzc2lvbnMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNfcGVybWlzc2lvbnMpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGFwcC5hbmRyb2lkKSB7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMoW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYW5kcm9pZC5wZXJtaXNzaW9uLlJFQ09SRF9BVURJT1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYW5kcm9pZC5wZXJtaXNzaW9uLkNBTUVSQVwiXHJcbiAgICAgICAgICAgICAgICBdLCBcIkkgbmVlZCB0aGVzZSBwZXJtaXNzaW9ucyBiZWNhdXNlIEknbSBjb29sXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVWggb2gsIG5vIHBlcm1pc3Npb25zIC0gcGxhbiBCIHRpbWUhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzX3Blcm1pc3Npb25zID0gdGhpcy5jaGVja19wZXJtaXNzaW9ucygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNfcGVybWlzc2lvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dzLmFsZXJ0KFwid2l0aG91dCBtaWMgYW5kIGNhbWVyYSBwZXJtaXNzaW9ucyBcXG4geW91IGNhbm5vdCBjb25uZWN0LiBcXG4gcGxlYXNlIGFsbG93IHBlcm1pc3Npb25zIGluIHNldHRpbmdzIGFuZCB0cnkgYWdhaW4uXCIpLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5pb3NfbWljX3Blcm1pc3Npb24oKSwgdGhpcy5pb3NfY2FtZXJhX3Blcm1pc3Npb24oKV0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odmFsdWVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodmFsdWVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCByZWFzb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZWFzb24pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IHJlYXNvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQoXCJ3aXRob3V0IG1pYyBhbmQgY2FtZXJhIHBlcm1pc3Npb25zIFxcbiB5b3UgY2Fubm90IGNvbm5lY3QuIFxcbiBwbGVhc2UgYWxsb3cgcGVybWlzc2lvbnMgaW4gc2V0dGluZ3MgYW5kIHRyeSBhZ2Fpbi5cIikudGhlbigoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVUlBcHBsaWNhdGlvbi5zaGFyZWRBcHBsaWNhdGlvbi5vcGVuVVJMKE5TVVJMLlVSTFdpdGhTdHJpbmcoVUlBcHBsaWNhdGlvbk9wZW5TZXR0aW5nc1VSTFN0cmluZykpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW9zX21pY19wZXJtaXNzaW9uKCk6IFByb21pc2U8YW55PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGFzX2Fza2VkID0gQVZDYXB0dXJlRGV2aWNlLmF1dGhvcml6YXRpb25TdGF0dXNGb3JNZWRpYVR5cGUoQVZNZWRpYVR5cGVBdWRpbyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFzX2Fza2VkID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoJ21pYyBwZXJtaXNzaW9uIGRlbmllZCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBBVkF1ZGlvU2Vzc2lvbi5zaGFyZWRJbnN0YW5jZSgpLnJlcXVlc3RSZWNvcmRQZXJtaXNzaW9uKChib29sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9vbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYm9vbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVqZWN0KCdtaWMgcGVybWlzc2lvbiBkZW5pZWQnKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpb3NfY2FtZXJhX3Blcm1pc3Npb24oKTogUHJvbWlzZTxhbnk+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhciBoYXNfYXNrZWQgPSBBVkNhcHR1cmVEZXZpY2UuYXV0aG9yaXphdGlvblN0YXR1c0Zvck1lZGlhVHlwZShBVk1lZGlhVHlwZVZpZGVvKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNfYXNrZWQgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdCgnY2FtZXJhIHBlcm1pc3Npb24gZGVuaWVkJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEFWQ2FwdHVyZURldmljZS5yZXF1ZXN0QWNjZXNzRm9yTWVkaWFUeXBlQ29tcGxldGlvbkhhbmRsZXIoQVZNZWRpYVR5cGVWaWRlbywgKGJvb2wpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChib29sID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShib29sKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWplY3QoJ2NhbWVyYSBwZXJtaXNzaW9uIGRlbmllZCcpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImlzRG9jQ2FsbGluZ1wiLCBmYWxzZSk7XHJcbiAgICAgICAgZ2xvYmFsLl9fZXh0ZW5kcy5pc0FwcFJ1bnMgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy52aWRlb0FjdGl2aXR5LnJvb20pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlb0FjdGl2aXR5LmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmRpc3Bvc2UoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHRvZ2dsZV9sb2NhbF9hdWRpbygpIHtcclxuXHJcbiAgICAgICAgdGhpcy52aWRlb0FjdGl2aXR5LnRvZ2dsZV9sb2NhbF9hdWRpbygpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHRvZ2dsZV9sb2NhbF92aWRlbygpIHtcclxuXHJcbiAgICAgICAgdGhpcy52aWRlb0FjdGl2aXR5LnRvZ2dsZV9sb2NhbF92aWRlbygpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdF90b19yb29tKCk6IHZvaWQge1xyXG4gICAgICAgIC8qIGlmICghdGhpcy5nZXQoJ25hbWUnKSB8fCAhdGhpcy5nZXQoJ3Jvb20nKSB8fCB0aGlzLmdldCgnbmFtZScpLmxlbmd0aCA8IDEgfHwgdGhpcy5nZXQoJ3Jvb20nKS5sZW5ndGggPCAxKVxyXG4gICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0KCdlcnJvcicsIFwiTWlzc2luZyBJbmZvLlwiKTtcclxuICAgICAgICAgZWxzZSB0aGlzLnNldCgnZXJyb3InLCBcIlwiKTtcclxuICAgICAgICAgdGhpcy5nZXRfdG9rZW4oKVxyXG4gICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgICAvLyAgdmFyIHJlc3VsdCA9IHJlc3VsdC5jb250ZW50LnRvSlNPTigpO1xyXG4gICAgICAgICAgICAgICAgIGxldCByZXNwOiBhbnkgPSBKU09OLnN0cmluZ2lmeShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgIGxldCB0b2tlbkRhdGE6IGFueSA9IEpTT04ucGFyc2UocmVzcCk7XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUNDRVNTIFRPS0VOIDo6ICBcIiArIHRva2VuRGF0YS5jb250ZW50LnRva2VuKTtcclxuIFxyXG4gICAgICAgICAgICAgICAgIHRoaXMudmlkZW9BY3Rpdml0eS5zZXRfYWNjZXNzX3Rva2VuKHRva2VuRGF0YS5jb250ZW50LnRva2VuKTtcclxuICAgICAgICAgICAgICAgICB0aGlzLnZpZGVvQWN0aXZpdHkuY29ubmVjdF90b19yb29tKHRoaXMuZ2V0KCdyb29tJykpO1xyXG4gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ2V0KCdyb29tJykgKyBcIiBST09NIE5BTUVcIik7XHJcbiAgICAgICAgICAgICB9LCBlID0+IHtcclxuICAgICAgICAgICAgICAgICB0aGlzLnNldCgnZXJyb3InLCBlKTtcclxuICAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgICAgICB0aGlzLmdldFR3aWxpb1ZDVG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUd2lsaW9WQ1Rva2VuKCkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdFVCBUV0lMSU8gVE9LRU4uLi4uLi4uLi4uLi4uXCIpO1xyXG4gICAgICAgIGlmIChzZWxmLndlYmFwaS5uZXRDb25uZWN0aXZpdHlDaGVjaygpKSB7XHJcbiAgICAgICAgICAgIHNlbGYud2ViYXBpLmxhdW5jaFR3aWxpb1ZpZGVvKDY4OTcxKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB4bWwyanMucGFyc2VTdHJpbmcoZGF0YS5fYm9keSwgeyBleHBsaWNpdEFycmF5OiBmYWxzZSB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9WaWRlb0NvbmZlcmVuY2VBdXRoS2V5LlN1Y2Nlc3NmdWwgPT0gXCJ0cnVlXCIgJiYgcmVzdWx0LkFQSVJlc3VsdF9WaWRlb0NvbmZlcmVuY2VBdXRoS2V5LlJvb21BdmFpbGFibGUgPT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHT1QgVEhFIEFDQ0VTUyBUT0tFTiBBTkQgTkFNRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi52aWRlb0FjdGl2aXR5LnNldF9hY2Nlc3NfdG9rZW4ocmVzdWx0LkFQSVJlc3VsdF9WaWRlb0NvbmZlcmVuY2VBdXRoS2V5LkF1dGhLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnZpZGVvQWN0aXZpdHkuY29ubmVjdF90b19yb29tKHJlc3VsdC5BUElSZXN1bHRfVmlkZW9Db25mZXJlbmNlQXV0aEtleS5Sb29tTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUk9PTSBOT1QgQVZBSUxBQkxFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LkFQSVJlc3VsdF9WaWRlb0NvbmZlcmVuY2VBdXRoS2V5Lk1lc3NhZ2UgPT09IFwiU2Vzc2lvbiBleHBpcmVkLCBwbGVhc2UgbG9naW4gdXNpbmcgTWVtYmVyTG9naW4gc2NyZWVuIHRvIGdldCBhIG5ldyBrZXkgZm9yIGZ1cnRoZXIgQVBJIGNhbGxzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud2ViYXBpLmxvZ291dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcmVkIC8gRXJyb3IgaW4gVmlkZW8gY29uc3VsdCBzdGF0dXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBnZXR0aW5nIHZpZGVvIGNvbnN1bHQgdG9rZW4uLiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qIHB1YmxpYyBnZXRfdG9rZW4oKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgbGV0IGRhdGE6IGFueSA9IHt9O1xyXG4gICAgICAgICBkYXRhLnVpZCA9IHRoaXMubmFtZTtcclxuICAgICAgICAgZGF0YS5BY2NvdW50U2lkID0gXCJBQ2FjMmU0YmUyZDU0YmZiMDE0NTU5ZjIyN2YxZmY1MDY4XCI7XHJcbiAgICAgICAgIGRhdGEuQXV0aFRva2VuID0gXCI2MTg3Zjc4OTA2NzU3MTYyMjMzNzNlZmY4ZDEzNGZmMVwiO1xyXG4gICAgICAgICBsZXQgbmFtZSA9IHRoaXMubmFtZTtcclxuICAgICAgICAgcmV0dXJuIGh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly92aWRlby50d2lsaW8uY29tL1wiLFxyXG4gICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcclxuICAgICAgICAgICAgIGNvbnRlbnQ6IEpTT04uc3RyaW5naWZ5KGRhdGEpXHJcbiAgICAgICAgIH0pO1xyXG4gfSovXHJcbiAgICBwdWJsaWMgZ2V0X3Rva2VuKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRUb2tlblwiKTtcclxuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0KCduYW1lJylcclxuICAgICAgICByZXR1cm4gaHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly8xOTIuMTY4LjMuNTI6ODA4MC9ncmFiYWNjZXNzL3Jlc3QvZ3JhYi9hY2Nlc3NUb2tlblwiLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IEpTT04uc3RyaW5naWZ5KHsgdXNlck5hbWU6IG5hbWUsIHJvb21OYW1lOiB0aGlzLmdldCgncm9vbScpIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwbGF5Q2FsbGluZ1NvdW5kKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGxheSBpZmxlXCIpXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgVE5TUGxheWVyKCk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuaW5pdEZyb21GaWxlKHtcclxuICAgICAgICAgICAgYXVkaW9GaWxlOiAnfi9zb3VuZHMvJyArIFwiaXBob25lLm1wM1wiLCAvLyB+ID0gYXBwIGRpcmVjdG9yeVxyXG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjazogdGhpcy50cmFja0NvbXBsZXRlLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2s6IHRoaXMudHJhY2tFcnJvci5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmdldEF1ZGlvVHJhY2tEdXJhdGlvbigpLnRoZW4oKGR1cmF0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBpT1M6IGR1cmF0aW9uIGlzIGluIHNlY29uZHNcclxuICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQ6IGR1cmF0aW9uIGlzIGluIG1pbGxpc2Vjb25kc1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzb25nIGR1cmF0aW9uOlwiLCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnBsYXllci5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnBsYXkoKTtcclxuICAgIH1cclxuICAgIHRyYWNrQ29tcGxldGUoYXJnczogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlZmVyZW5jZSBiYWNrIHRvIHBsYXllcjonLCBhcmdzLnBsYXllcik7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICAvLyBpT1Mgb25seTogZmxhZyBpbmRpY2F0aW5nIGlmIGNvbXBsZXRlZCBzdWNjZXNmdWxseVxyXG4gICAgICAgIC8vICBjb25zb2xlLmxvZygnd2hldGhlciBzb25nIHBsYXkgY29tcGxldGVkIHN1Y2Nlc3NmdWxseTonLCBhcmdzLmZsYWcpO1xyXG4gICAgfVxyXG4gICAgdHJhY2tFcnJvcihhcmdzOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVmZXJlbmNlIGJhY2sgdG8gcGxheWVyOicsIGFyZ3MucGxheWVyKTtcclxuICAgICAgICBjb25zb2xlLmxvZygndGhlIGVycm9yOicsIGFyZ3MuZXJyb3IpO1xyXG5cclxuICAgICAgICAvLyBBbmRyb2lkIG9ubHk6IGV4dHJhIGRldGFpbCBvbiBlcnJvclxyXG4gICAgICAgIC8vICBjb25zb2xlLmxvZygnZXh0cmEgaW5mbyBvbiB0aGUgZXJyb3I6JywgYXJncy5leHRyYSk7XHJcbiAgICB9XHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlZJREVPIERFU1RST1lFRC4uLi5cIik7XHJcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiaXNEb2NDYWxsaW5nXCIsIGZhbHNlKTtcclxuICAgICAgICBnbG9iYWwuX19leHRlbmRzLmlzQXBwUnVucyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllciAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5kaXNwb3NlKCk7XHJcbiAgICB9XHJcblxyXG5cclxufSJdfQ==