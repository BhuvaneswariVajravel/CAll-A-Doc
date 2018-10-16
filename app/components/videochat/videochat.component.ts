import { EventData } from 'data/observable';
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
//import { VideoChat } from './main-view-model';
import { Observable, fromObject } from 'data/observable';
import { Page } from 'ui/page';
import * as app from "tns-core-modules/application";
import { LocalVideo, VideoActivity, RemoteVideo } from 'nativescript-twilio-video';
import * as dialogs from "ui/dialogs";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout/stack-layout';
import { GridLayout, ItemSpec } from 'ui/layouts/grid-layout';
import { TNSPlayer } from 'nativescript-audio';
import * as ApplicationSettings from "application-settings";
import { WebAPIService } from "../../shared/services/web-api.service";
import { Configuration } from "../../shared/configuration/configuration";
let xml2js = require('nativescript-xml2js');


let http = require("http");
let permissions = require('nativescript-permissions');
let timer = require("timer");

@Component({
    moduleId: module.id,
    templateUrl: "./videochat.component.html",
    providers: [WebAPIService, Configuration]
})
export class VideoChatComponent extends Observable implements OnInit {
    public player: TNSPlayer;
    public container: StackLayout;
    public localVideo: LocalVideo;
    public remoteVideo: RemoteVideo;
    public accessToken: string;
    public room: string;
    public name: string;
    public error: string;
    public videoActivity: VideoActivity;
    constructor(private page: Page, private webapi: WebAPIService) {
        super();
        console.log("Constructor............................");
      //  this.playCallingSound();
        this.page.actionBarHidden = true;

        this.videoActivity = new VideoActivity();

        this.localVideo = new LocalVideo();

        this.remoteVideo = new RemoteVideo();

        this.videoActivity.localVideoView = this.localVideo.localVideoView;

        this.videoActivity.remoteVideoView = this.remoteVideo.remoteVideoView;

        //this.add_video_views();

        this.videoActivity.event.on('error', (reason) => {
            this.error = reason.object['reason'];
            console.log(JSON.stringify(reason.object['reason']));
        });

        console.log("Constructor11111111111............................");

        this.videoActivity.event.on('didConnectToRoom', (r) => {
            console.log("VIJAY DID CONNECT TO ROOM " + r.object['count']);
            if (r.object['count'] < 1) return;
            console.log("didConnectToRoom");
            this.toggle_local_video_size();
        });

        this.videoActivity.event.on('didFailToConnectWithError', (r) => {
            console.log("didFailToConnectWithError");
        });

        this.videoActivity.event.on('participantDidConnect', (r) => {
            console.log("VIJAY PARTICIPANT DID CONNECT " + r.object['count']);
            if (r.object['count'] < 1) return;
            console.log("participantDidConnect");
            this.toggle_local_video_size();
        });

        this.videoActivity.event.on('participantDidDisconnect', (r) => {
            console.log("participantDidDisconnect");
            this.toggle_local_video_size();
        });

        this.videoActivity.event.on('participantUnpublishedAudioTrack', (r) => {
            console.log("participantUnpublishedAudioTrack");
        });

        this.videoActivity.event.on('participantPublishedVideoTrack', (r) => {
            console.log("participantPublishedVideoTrack");
        });

        this.videoActivity.event.on('participantUnpublishedVideoTrack', (r) => {
            console.log("participantUnpublishedVideoTrack");
        });

        this.videoActivity.event.on('onAudioTrackSubscribed', (r) => {
            console.log("onAudioTrackSubscribed");
        });

        this.videoActivity.event.on('onAudioTrackUnsubscribed', (r) => {
            console.log("onAudioTrackUnsubscribed");
        });

        this.videoActivity.event.on('onVideoTrackSubscribed', (r) => {
            console.log("onVideoTrackSubscribed");
        });

        this.videoActivity.event.on('onVideoTrackUnsubscribed', (r) => {
            console.log("onVideoTrackUnsubscribed 00");
        });

        this.videoActivity.event.on('participantDisabledVideoTrack', (r) => {
            console.log("participantDisabledVideoTrack");
        });

        this.videoActivity.event.on('participantEnabledVideoTrack', (r) => {
            console.log("participantEnabledVideoTrack");
        });

        this.videoActivity.event.on('participantDisabledAudioTrack', (r) => {
            console.log("participantDisabledAudioTrack");
        });

        this.videoActivity.event.on('participantEnabledAudioTrack', (r) => {
            console.log("participantEnabledAudioTrack");
        });
        console.log("Constructo22222222............................");


        let self = this;
        this.get_permissions()
            .then(() => {
                console.log("GET PERMISSIONS METHOD");

                // i find the settimeout allows for a smoother load if you're looking for the preview to begin immediately
                //  var t = timer.setTimeout(() => {
                console.log("JJJKLKKKKJHKHKHJJ");
                self.videoActivity.startPreview();
                //      timer.clearTimeout(t);
                console.log("jjjjj");
                //}, 1200);
            });
    }
    ngOnInit() {
        console.log("NG ON INIT");
        this.container = <StackLayout>this.page.getViewById('container');
        // this.container = <StackLayout>this.mainData.nativeElement;
        this.add_video_views();
    }

    toggle_local_video_size(): void {
        console.log("TAPPED ON CAM VIDEO");
        if (this.localVideo.className === 'large') {
            this.localVideo.className = 'small';
            GridLayout.setColumn(this.localVideo, 1);
            GridLayout.setRow(this.localVideo, 0);
        } else {
            this.localVideo.className = 'large';
            GridLayout.setColumn(this.localVideo, 0);
            GridLayout.setColumnSpan(this.localVideo, 2);
            GridLayout.setRowSpan(this.localVideo, 2);
        }
    }

    add_video_views(): void {
        console.log("ADD VIDEO VIEW METHOD " + this.container);
        // this.localVideo.id = 'local-video';
        this.localVideo.className = 'large';
        this.remoteVideo.id = 'remote-video';

        this.localVideo.on('tap', this.toggle_local_video_size.bind(this));

        GridLayout.setColumnSpan(this.remoteVideo, 2);
        GridLayout.setRowSpan(this.remoteVideo, 2);
        GridLayout.setRow(this.remoteVideo, 0);
        GridLayout.setColumnSpan(this.localVideo, 2);
        GridLayout.setRowSpan(this.localVideo, 2);
        GridLayout.setRow(this.localVideo, 0);
        this.container.insertChild(this.remoteVideo, 0);
        this.container.insertChild(this.localVideo, 0);
        console.log("ADD VIDEO VIEW METHOD END.......");
    }



    check_permissions(): boolean {
        var audio, camera;

        if (app.android) {
            audio = permissions.hasPermission("android.permission.RECORD_AUDIO")
            camera = permissions.hasPermission("android.permission.CAMERA")
        } else {
            camera = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeVideo);
            audio = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeAudio);
            if (camera < 3) camera = false;
            if (audio < 3) audio = false;
        }

        if (!audio || !camera) return false;
        else return true;

    }

    get_permissions(): Promise<any> {

        return new Promise((resolve, reject) => {

            var has_permissions = this.check_permissions();

            if (has_permissions) {
                resolve();
                return;
            }

            if (app.android) {
                permissions.requestPermissions([
                    "android.permission.RECORD_AUDIO",
                    "android.permission.CAMERA"
                ], "I need these permissions because I'm cool")
                    .then((response) => {
                        console.dir(response);
                        resolve(response);
                    })
                    .catch((e) => {
                        console.dir(e);
                        console.log("Uh oh, no permissions - plan B time!");
                        var has_permissions = this.check_permissions();

                        if (!has_permissions) {

                            dialogs.alert("without mic and camera permissions \n you cannot connect. \n please allow permissions in settings and try again.").then(() => {

                            });

                        }
                    });

            } else {

                Promise.all([this.ios_mic_permission(), this.ios_camera_permission()])
                    .then(values => {
                        console.log(JSON.stringify(values));
                        resolve();
                    }, reason => {
                        console.log(JSON.stringify(reason));
                        this.error = reason;

                        dialogs.alert("without mic and camera permissions \n you cannot connect. \n please allow permissions in settings and try again.").then(() => {

                            UIApplication.sharedApplication.openURL(NSURL.URLWithString(UIApplicationOpenSettingsURLString));

                        });

                        reject()

                    });

            }

        })

    }

    ios_mic_permission(): Promise<any> {

        return new Promise((resolve, reject) => {

            var has_asked = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeAudio);

            if (has_asked === 2) {
                reject('mic permission denied');
                return;
            }

            AVAudioSession.sharedInstance().requestRecordPermission((bool) => {
                if (bool === true) {
                    resolve(bool);
                    return;
                }
                reject('mic permission denied');

            });

        })

    }

    ios_camera_permission(): Promise<any> {

        return new Promise((resolve, reject) => {

            var has_asked = AVCaptureDevice.authorizationStatusForMediaType(AVMediaTypeVideo);

            if (has_asked === 2) {
                reject('camera permission denied');
                return;
            }

            AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(AVMediaTypeVideo, (bool) => {
                if (bool === true) {
                    resolve(bool);
                    return;
                }
                reject('camera permission denied');

            });

        })
    }


    public disconnect() {
        ApplicationSettings.setBoolean("isDocCalling", false);
        global.__extends.isAppRuns = false;
        if (this.videoActivity.room) {
            this.videoActivity.disconnect();
        }
        if (this.player != null)
            this.player.dispose();
    }


    public toggle_local_audio() {

        this.videoActivity.toggle_local_audio();

    }


    public toggle_local_video() {

        this.videoActivity.toggle_local_video();

    }

    public connect_to_room(): void {
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
    }

    getTwilioVCToken() {
        let self = this;
        console.log("GET TWILIO TOKEN.............");
        if (self.webapi.netConnectivityCheck()) {
            self.webapi.launchTwilioVideo(68971).subscribe(data => {
                xml2js.parseString(data._body, { explicitArray: false }, function (err, result) {
                    if (result.APIResult_VideoConferenceAuthKey.Successful == "true" && result.APIResult_VideoConferenceAuthKey.RoomAvailable == "true") {
                        console.log("GOT THE ACCESS TOKEN AND NAME");
                        self.videoActivity.set_access_token(result.APIResult_VideoConferenceAuthKey.AuthKey);
                        self.videoActivity.connect_to_room(result.APIResult_VideoConferenceAuthKey.RoomName);

                    } else {
                        console.log("ROOM NOT AVAILABLE");
                        if (result.APIResult_VideoConferenceAuthKey.Message === "Session expired, please login using MemberLogin screen to get a new key for further API calls") {
                            self.webapi.logout();
                        }
                        console.log("Session expired / Error in Video consult status");
                    }
                });
            },
                error => {
                    console.log("Error while getting video consult token.. " + error);
                });
        }

    }


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
    public get_token(): Promise<any> {
        console.log("getToken");
        let name = this.get('name')
        return http.request({
            url: "http://192.168.3.52:8080/grabaccess/rest/grab/accessToken",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({ userName: name, roomName: this.get('room') })
        });
    }
    playCallingSound() {
        console.log("Play ifle")
        this.player = new TNSPlayer();
        this.player.initFromFile({
            audioFile: '~/sounds/' + "iphone.mp3", // ~ = app directory
            loop: false,
            completeCallback: this.trackComplete.bind(this),
            errorCallback: this.trackError.bind(this)
        }).then(() => {
            this.player.getAudioTrackDuration().then((duration) => {
                // iOS: duration is in seconds
                // Android: duration is in milliseconds
                console.log("song duration:", duration);
                // this.player.dispose();
            });
        });
        this.player.play();
    }
    trackComplete(args: any) {
        console.log('reference back to player:', args.player);
        this.player.dispose();

        // iOS only: flag indicating if completed succesfully
        //  console.log('whether song play completed successfully:', args.flag);
    }
    trackError(args: any) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);

        // Android only: extra detail on error
        //  console.log('extra info on the error:', args.extra);
    }
    ngOnDestroy() {
        console.log("VIDEO DESTROYED....");
        ApplicationSettings.setBoolean("isDocCalling", false);
        global.__extends.isAppRuns = false;
        if (this.player != null)
            this.player.dispose();
    }


}