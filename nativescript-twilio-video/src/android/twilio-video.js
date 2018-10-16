"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("tns-core-modules/utils/utils");
var observable_1 = require("tns-core-modules/data/observable");
var app = require("application");
var AudioManager = android.media.AudioManager;
var AudioAttributes = android.media.AudioAttributes;
var AudioFocusRequest = android.media.AudioFocusRequest;
var LocalParticipant = com.twilio.video.LocalParticipant;
var RoomState = com.twilio.video.RoomState;
var Video = com.twilio.video.Video;
var VideoRenderer = com.twilio.video.VideoRenderer;
var TwilioException = com.twilio.video.TwilioException;
var AudioTrack = com.twilio.video.AudioTrack;
var CameraCapturer = com.twilio.video.CameraCapturer;
// const CameraCapturerCameraSource = com.twilio.video.CameraCapturer.CameraSource;
var ConnectOptions = com.twilio.video.ConnectOptions;
var LocalAudioTrack = com.twilio.video.LocalAudioTrack;
var LocalVideoTrack = com.twilio.video.LocalVideoTrack;
// const VideoCapturer = com.twilio.video.VideoCapturer;
var Participant = com.twilio.video.RemoteParticipant;
var Room = com.twilio.video.Room;
var VideoTrack = com.twilio.video.VideoTrack;
// const CameraCapturerCompat = com.twilio.video.util.CameraCapturerCompat;
var VideoActivity = (function () {
    function VideoActivity() {
        this.audioManager = app.android.context.getSystemService(android.content.Context.AUDIO_SERVICE);
        this._event = new observable_1.Observable();
        // setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);
        // application.on('suspend', () => {
        //     if (this.localVideoTrack && this.localVideoTrack !== null) {
        //         /*
        //          * If this local video track is being shared in a Room, unpublish from room before
        //          * releasing the video track. Participants will be notified that the track has been
        //          * unpublished.
        //          */
        //         if (this.localParticipant) {
        //             this.localParticipant.unpublishTrack(this.localVideoTrack);
        //         }
        //         this.localVideoTrack.release();
        //         this.localVideoTrack = null;
        //     }
        // });
    }
    Object.defineProperty(VideoActivity.prototype, "event", {
        get: function () {
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    VideoActivity.prototype.startPreview = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.localVideoTrack && _this.localVideoTrack !== null) {
                resolve();
                return;
            }
            ;
            _this.localVideoView.setMirror(true);
            // this.cameraCapturer = new CameraCapturer(utils.ad.getApplicationContext(), CameraCapturer.CameraSource.FRONT_CAMERA, this.cameraListener());
            _this.cameraCapturer = new CameraCapturer(utils.ad.getApplicationContext(), CameraCapturer.CameraSource.FRONT_CAMERA, null);
            _this.localVideoTrack = LocalVideoTrack.create(utils.ad.getApplicationContext(), true, _this.cameraCapturer);
            _this.localVideoTrack.addRenderer(_this.localVideoView);
            resolve();
        });
    };
    VideoActivity.prototype.addRemoteParticipant = function (remoteParticipant) {
        if (remoteParticipant.getRemoteVideoTracks().size() > 0) {
            var remoteVideoTrackPublication = remoteParticipant.getRemoteVideoTracks().get(0);
            if (remoteVideoTrackPublication.isTrackSubscribed()) {
                this.addRemoteParticipantVideo(remoteVideoTrackPublication.getRemoteVideoTrack());
            }
        }
        /*
         * Start listening for participant events
         */
        remoteParticipant.setListener(this.participantListener());
    };
    VideoActivity.prototype.prepareLocalMedia = function () {
        var _this = this;
        // We will share local audio and video when we connect to room.
        // Create an audio track.
        return new Promise(function (resolve, reject) {
            if (!_this.localAudioTrack) {
                _this.localAudioTrack = LocalAudioTrack.create(utils.ad.getApplicationContext(), true);
                if (!_this.localAudioTrack) {
                    _this.onError("Failed to add audio track");
                    reject("Failed to add audio track");
                    return;
                }
            }
            // Create a video track which captures from the camera.
            if (!_this.localVideoTrack) {
                _this.startPreview();
            }
            resolve();
        });
    };
    VideoActivity.prototype.onError = function (reason) {
        this._event.notify({
            eventName: 'error',
            object: observable_1.fromObject({
                reason: reason
            })
        });
    };
    VideoActivity.prototype.removeParticipantVideo = function (videoTrack) {
        videoTrack.removeRenderer(this.remoteVideoView);
    };
    VideoActivity.prototype.removeRemoteParticipant = function (remoteParticipant) {
        // if (!remoteParticipant.getIdentity().equals(remoteParticipantIdentity)) {
        //     return;
        // }
        /*
        * Remove remote participant renderer
        */
        if (!remoteParticipant.getRemoteVideoTracks().isEmpty()) {
            var remoteVideoTrackPublication = remoteParticipant.getRemoteVideoTracks().get(0);
            /*
            * Remove video only if subscribed to participant track
            */
            if (remoteVideoTrackPublication.isTrackSubscribed()) {
                this.removeParticipantVideo(remoteVideoTrackPublication.getRemoteVideoTrack());
            }
        }
    };
    VideoActivity.prototype.connect_to_room = function (roomName) {
        if (!this.accessToken) {
            this.onError('Please provide a valid token to connect to a room');
            return;
        }
        this.configure_audio(true);
        this.prepareLocalMedia();
        console.log("PREPARE LOCAL MEDIA  ::::::::::::::::::::::::");
        var connectOptionsBuilder = new ConnectOptions.Builder(this.accessToken).roomName(roomName);
        if (this.localAudioTrack) {
            /*
            * Add local audio track to connect options to share with participants.
            */
            connectOptionsBuilder.audioTracks(java.util.Collections.singletonList(this.localAudioTrack));
            console.log("LOCAL AUDIO TRACK");
        }
        /*
         * Add local video track to connect options to share with participants.
         */
        if (this.localVideoTrack) {
            connectOptionsBuilder.videoTracks(java.util.Collections.singletonList(this.localVideoTrack));
            console.log("LOCAL VIDEO TRACK");
        }
        this.room = Video.connect(utils.ad.getApplicationContext(), connectOptionsBuilder.build(), this.roomListener());
        console.log(this.room.getName() + "  ROOM NAME ");
        console.log(this.room.getState() + " STATUS   ");
        console.log(JSON.stringify(this.room.getLocalParticipant()) + " PARTICIPANTS");
        console.log("TASK END " + JSON.stringify(this.room));
    };
    /*
     * Set primary view as renderer for participant video track
     */
    VideoActivity.prototype.addRemoteParticipantVideo = function (videoTrack) {
        this.remoteVideoView.setMirror(true);
        videoTrack.addRenderer(this.remoteVideoView);
    };
    VideoActivity.prototype.destroy_local_video = function () {
        this.localVideoTrack.removeRenderer(this.localVideoView);
        this.localVideoTrack = null;
    };
    VideoActivity.prototype.disconnect = function () {
        this.room.disconnect();
    };
    VideoActivity.prototype.cameraListener = function () {
        var self = this;
        return new CameraCapturer.Listener({
            onFirstFrameAvailable: function () {
                self._event.notify({
                    eventName: 'videoViewDidReceiveData',
                    object: observable_1.fromObject({
                        view: 'view',
                    })
                });
            },
            onError: function (e) {
                self.onError(e);
            }
        });
    };
    VideoActivity.prototype.roomListener = function () {
        var self = this;
        return new Room.Listener({
            onConnected: function (room) {
                var list = room.getRemoteParticipants();
                self.localParticipant = room.getLocalParticipant();
                self._event.notify({
                    eventName: 'didConnectToRoom',
                    object: observable_1.fromObject({
                        room: room,
                        count: list.size()
                    })
                });
                for (var i = 0, l = list.size(); i < l; i++) {
                    var participant = list.get(i);
                    if (participant.getVideoTracks().size() > 0) {
                        self.addRemoteParticipant(participant);
                    }
                }
            },
            onConnectFailure: function (room, error) {
                self.configure_audio(false);
                console.log(JSON.stringify(error) + " ROOM NAME :" + room);
                self._event.notify({
                    eventName: 'didFailToConnectWithError',
                    object: observable_1.fromObject({
                        room: room,
                        error: error
                    })
                });
            },
            onDisconnected: function (room, error) {
                self.room = '';
                self.localParticipant = null;
                self.configure_audio(false);
                if (self._event) {
                    self._event.notify({
                        eventName: 'onDisconnected',
                        object: observable_1.fromObject({
                            room: room,
                            error: error
                        })
                    });
                }
            },
            onParticipantConnected: function (room, participant) {
                console.log('participantDidConnect');
                self._event.notify({
                    eventName: 'participantDidConnect',
                    object: observable_1.fromObject({
                        room: room,
                        participant: participant,
                        count: participant.getRemoteVideoTracks().size()
                    })
                });
                self.addRemoteParticipant(participant);
            },
            onParticipantDisconnected: function (room, participant) {
                self._event.notify({
                    eventName: 'participantDidDisconnect',
                    object: observable_1.fromObject({
                        room: room,
                        participant: participant
                    })
                });
                self.removeRemoteParticipant(participant);
            },
            onRecordingStarted: function (room) {
                /*
                 * Indicates when media shared to a Room is being recorded. Note that
                 * recording is only available in our Group Rooms developer preview.
                 */
                // if (self._event) {
                //     self._event.notify({
                //         eventName: 'onRecordingStarted',
                //         object: fromObject({
                //             room: room
                //         })
                //     })
                // }
            },
            onRecordingStopped: function (room) {
                // if (self._event) {
                //     self._event.notify({
                //         eventName: 'onRecordingStopped',
                //         object: fromObject({
                //             room: room
                //         })
                //     })
                // }
            }
        });
    };
    VideoActivity.prototype.participantListener = function () {
        var self = this;
        return new Participant.Listener({
            onAudioTrackPublished: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantPublishedAudioTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            },
            onAudioTrackUnpublished: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantUnpublishedAudioTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            },
            onVideoTrackPublished: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantPublishedVideoTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            },
            onVideoTrackUnpublished: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantUnpublishedVideoTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            },
            onAudioTrackSubscribed: function (remoteParticipant, remoteAudioTrackPublication, remoteAudioTrack) {
                self._event.notify({
                    eventName: 'onAudioTrackSubscribed',
                    object: observable_1.fromObject({
                        participant: remoteParticipant,
                        publication: remoteAudioTrackPublication,
                        audioTrack: remoteAudioTrack
                    })
                });
            },
            onAudioTrackUnsubscribed: function (remoteParticipant, remoteAudioTrackPublication, remoteAudioTrack) {
                self._event.notify({
                    eventName: 'onAudioTrackUnsubscribed',
                    object: observable_1.fromObject({
                        participant: remoteParticipant,
                        publication: remoteAudioTrackPublication,
                        audioTrack: remoteAudioTrack
                    })
                });
            },
            onVideoTrackSubscribed: function (remoteParticipant, remoteVideoTrackPublication, remoteVideoTrack) {
                self.addRemoteParticipantVideo(remoteVideoTrack);
                console.log("onVideoTrackSubscribed");
                self._event.notify({
                    eventName: 'onVideoTrackSubscribed',
                    object: observable_1.fromObject({
                        participant: remoteParticipant,
                        publication: remoteVideoTrackPublication,
                        videoTrack: remoteVideoTrack
                    })
                });
            },
            onVideoTrackUnsubscribed: function (remoteParticipant, remoteVideoTrackPublication, remoteVideoTrack) {
                self.removeParticipantVideo(remoteVideoTrack);
                console.log("onVideoTrackUnsubscribed");
                self._event.notify({
                    eventName: 'onVideoTrackUnsubscribed',
                    object: observable_1.fromObject({
                        participant: remoteParticipant,
                        publication: remoteVideoTrackPublication,
                        videoTrack: remoteVideoTrack
                    })
                });
            },
            onVideoTrackDisabled: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantDisabledVideoTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            },
            onVideoTrackEnabled: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantEnabledVideoTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            },
            onAudioTrackDisabled: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantDisabledAudioTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            },
            onAudioTrackEnabled: function (participant, publication) {
                self._event.notify({
                    eventName: 'participantEnabledAudioTrack',
                    object: observable_1.fromObject({
                        participant: participant,
                        publication: publication
                    })
                });
            }
        });
    };
    VideoActivity.prototype.configure_audio = function (enable) {
        if (enable) {
            this.previousAudioMode = this.audioManager.getMode();
            // Request audio focus before making any device switch.
            // this.audioManager.requestAudioFocus(null, AudioManager.STREAM_VOICE_CALL, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
            this.requestAudioFocus();
            /*
             * Use MODE_IN_COMMUNICATION as the default audio mode. It is required
             * to be in this mode when playout and/or recording starts for the best
             * possible VoIP performance. Some devices have difficulties with
             * speaker mode if this is not set.
             */
            this.audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            /*
             * Always disable microphone mute during a WebRTC call.
             */
            this.previousMicrophoneMute = this.audioManager.isMicrophoneMute();
            this.audioManager.setMicrophoneMute(false);
        }
        else {
            this.audioManager.setMode(this.previousAudioMode);
            this.audioManager.abandonAudioFocus(null);
            this.audioManager.setMicrophoneMute(this.previousMicrophoneMute);
        }
    };
    VideoActivity.prototype.requestAudioFocus = function () {
        console.log(android.os.Build.VERSION.SDK_INT + " SDK VERSION");
        if (android.os.Build.VERSION.SDK_INT >= 25) {
            var playbackAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build();
            var focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                .setAudioAttributes(playbackAttributes)
                .setAcceptsDelayedFocusGain(true)
                .setOnAudioFocusChangeListener(new AudioManager.OnAudioFocusChangeListener({
                onAudioFocusChange: function (i) {
                    console.log(i);
                }
            }).build());
            this.audioManager.requestAudioFocus(focusRequest);
        }
        else {
            this.audioManager.requestAudioFocus(null, AudioManager.STREAM_VOICE_CALL, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
        }
    };
    VideoActivity.prototype.set_access_token = function (token) {
        this.accessToken = token;
    };
    VideoActivity.prototype.toggle_local_video = function () {
        if (this.localVideoTrack) {
            var enable = !this.localVideoTrack.isEnabled();
            this.localVideoTrack.enable(enable);
        }
    };
    VideoActivity.prototype.toggle_local_audio = function () {
        if (this.localAudioTrack) {
            var enabled = !this.localAudioTrack.isEnabled();
            this.localAudioTrack.enable(enabled);
        }
    };
    return VideoActivity;
}());
exports.VideoActivity = VideoActivity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpbGlvLXZpZGVvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHdpbGlvLXZpZGVvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0RBQXNEO0FBR3RELCtEQUEwRTtBQUkxRSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFJakMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7QUFDaEQsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7QUFDdEQsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO0FBQzFELElBQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7QUFDM0QsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQzdDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUNyQyxJQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7QUFDckQsSUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO0FBQ3pELElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUMvQyxJQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7QUFDdkQsbUZBQW1GO0FBQ25GLElBQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztBQUN2RCxJQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENB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Q0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBRTdCLENBQUM7SUFFTSwwQ0FBa0IsR0FBekI7UUFFSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUV2QixJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFeEMsQ0FBQztJQUVMLENBQUM7SUFFTSwwQ0FBa0IsR0FBekI7UUFFSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUV2QixJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekMsQ0FBQztJQUVMLENBQUM7SUFFTCxvQkFBQztBQUFELENBQUMsQUFyakJELElBcWpCQztBQXJqQlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaWV3IH0gZnJvbSAndWkvY29yZS92aWV3JztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3V0aWxzL3V0aWxzXCI7XG5pbXBvcnQgeyBSZW1vdGVWaWRlbyB9IGZyb20gXCIuL3JlbW90ZVZpZGVvXCI7XG5pbXBvcnQgeyBMb2NhbFZpZGVvIH0gZnJvbSBcIi4vbG9jYWxWaWRlb1wiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbU9iamVjdCB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlJztcbmltcG9ydCB7IFZpZGVvQWN0aXZpdHlCYXNlIH0gZnJvbSBcIi4uL3R3aWxpby1jb21tb25cIjtcbmltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XG5cbnZhciBhcHAgPSByZXF1aXJlKFwiYXBwbGljYXRpb25cIik7XG5cbmRlY2xhcmUgdmFyIGNvbSwgYW5kcm9pZDogYW55O1xuXG5jb25zdCBBdWRpb01hbmFnZXIgPSBhbmRyb2lkLm1lZGlhLkF1ZGlvTWFuYWdlcjtcbmNvbnN0IEF1ZGlvQXR0cmlidXRlcyA9IGFuZHJvaWQubWVkaWEuQXVkaW9BdHRyaWJ1dGVzO1xuY29uc3QgQXVkaW9Gb2N1c1JlcXVlc3QgPSBhbmRyb2lkLm1lZGlhLkF1ZGlvRm9jdXNSZXF1ZXN0O1xuY29uc3QgTG9jYWxQYXJ0aWNpcGFudCA9IGNvbS50d2lsaW8udmlkZW8uTG9jYWxQYXJ0aWNpcGFudDtcbmNvbnN0IFJvb21TdGF0ZSA9IGNvbS50d2lsaW8udmlkZW8uUm9vbVN0YXRlO1xuY29uc3QgVmlkZW8gPSBjb20udHdpbGlvLnZpZGVvLlZpZGVvO1xuY29uc3QgVmlkZW9SZW5kZXJlciA9IGNvbS50d2lsaW8udmlkZW8uVmlkZW9SZW5kZXJlcjtcbmNvbnN0IFR3aWxpb0V4Y2VwdGlvbiA9IGNvbS50d2lsaW8udmlkZW8uVHdpbGlvRXhjZXB0aW9uO1xuY29uc3QgQXVkaW9UcmFjayA9IGNvbS50d2lsaW8udmlkZW8uQXVkaW9UcmFjaztcbmNvbnN0IENhbWVyYUNhcHR1cmVyID0gY29tLnR3aWxpby52aWRlby5DYW1lcmFDYXB0dXJlcjtcbi8vIGNvbnN0IENhbWVyYUNhcHR1cmVyQ2FtZXJhU291cmNlID0gY29tLnR3aWxpby52aWRlby5DYW1lcmFDYXB0dXJlci5DYW1lcmFTb3VyY2U7XG5jb25zdCBDb25uZWN0T3B0aW9ucyA9IGNvbS50d2lsaW8udmlkZW8uQ29ubmVjdE9wdGlvbnM7XG5jb25zdCBMb2NhbEF1ZGlvVHJhY2sgPSBjb20udHdpbGlvLnZpZGVvLkxvY2FsQXVkaW9UcmFjaztcbmNvbnN0IExvY2FsVmlkZW9UcmFjayA9IGNvbS50d2lsaW8udmlkZW8uTG9jYWxWaWRlb1RyYWNrO1xuLy8gY29uc3QgVmlkZW9DYXB0dXJlciA9IGNvbS50d2lsaW8udmlkZW8uVmlkZW9DYXB0dXJlcjtcbmNvbnN0IFBhcnRpY2lwYW50ID0gY29tLnR3aWxpby52aWRlby5SZW1vdGVQYXJ0aWNpcGFudDtcbmNvbnN0IFJvb20gPSBjb20udHdpbGlvLnZpZGVvLlJvb207XG5jb25zdCBWaWRlb1RyYWNrID0gY29tLnR3aWxpby52aWRlby5WaWRlb1RyYWNrO1xuLy8gY29uc3QgQ2FtZXJhQ2FwdHVyZXJDb21wYXQgPSBjb20udHdpbGlvLnZpZGVvLnV0aWwuQ2FtZXJhQ2FwdHVyZXJDb21wYXQ7XG5cbmV4cG9ydCBjbGFzcyBWaWRlb0FjdGl2aXR5IGltcGxlbWVudHMgVmlkZW9BY3Rpdml0eUJhc2Uge1xuXG4gICAgcHVibGljIHByZXZpb3VzQXVkaW9Nb2RlOiBhbnk7XG4gICAgcHVibGljIGxvY2FsVmlkZW9WaWV3OiBhbnk7XG4gICAgcHVibGljIHJlbW90ZVZpZGVvVmlldzogYW55O1xuICAgIHB1YmxpYyBsb2NhbFZpZGVvVHJhY2s6IGFueTtcbiAgICBwdWJsaWMgbG9jYWxBdWRpb1RyYWNrOiBhbnk7XG4gICAgcHVibGljIGNhbWVyYUNhcHR1cmVyOiBhbnk7XG4gICAgcHVibGljIGNhbWVyYUNhcHR1cmVyQ29tcGF0OiBhbnk7XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIFRXSUxJT19BQ0NFU1NfVE9LRU46IHN0cmluZztcbiAgICBwdWJsaWMgcm9vbTogYW55O1xuICAgIHB1YmxpYyBwcmV2aW91c01pY3JvcGhvbmVNdXRlOiBib29sZWFuO1xuICAgIHB1YmxpYyBsb2NhbFBhcnRpY2lwYW50OiBhbnk7XG4gICAgcHVibGljIGF1ZGlvTWFuYWdlcjogYW55O1xuICAgIHByaXZhdGUgX2V2ZW50OiBPYnNlcnZhYmxlO1xuICAgIHByaXZhdGUgX3Jvb21MaXN0ZW5lcjogYW55O1xuICAgIHByaXZhdGUgX3BhcnRpY2lwYW50TGlzdGVuZXI6IGFueTtcbiAgICBwdWJsaWMgcGFydGljaXBhbnQ6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlciA9IGFwcC5hbmRyb2lkLmNvbnRleHQuZ2V0U3lzdGVtU2VydmljZShhbmRyb2lkLmNvbnRlbnQuQ29udGV4dC5BVURJT19TRVJWSUNFKTtcbiAgICAgICAgdGhpcy5fZXZlbnQgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICAvLyBzZXRWb2x1bWVDb250cm9sU3RyZWFtKEF1ZGlvTWFuYWdlci5TVFJFQU1fVk9JQ0VfQ0FMTCk7XG5cbiAgICAgICAgLy8gYXBwbGljYXRpb24ub24oJ3N1c3BlbmQnLCAoKSA9PiB7XG4gICAgICAgIC8vICAgICBpZiAodGhpcy5sb2NhbFZpZGVvVHJhY2sgJiYgdGhpcy5sb2NhbFZpZGVvVHJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAvKlxuICAgICAgICAvLyAgICAgICAgICAqIElmIHRoaXMgbG9jYWwgdmlkZW8gdHJhY2sgaXMgYmVpbmcgc2hhcmVkIGluIGEgUm9vbSwgdW5wdWJsaXNoIGZyb20gcm9vbSBiZWZvcmVcbiAgICAgICAgLy8gICAgICAgICAgKiByZWxlYXNpbmcgdGhlIHZpZGVvIHRyYWNrLiBQYXJ0aWNpcGFudHMgd2lsbCBiZSBub3RpZmllZCB0aGF0IHRoZSB0cmFjayBoYXMgYmVlblxuICAgICAgICAvLyAgICAgICAgICAqIHVucHVibGlzaGVkLlxuICAgICAgICAvLyAgICAgICAgICAqL1xuICAgICAgICAvLyAgICAgICAgIGlmICh0aGlzLmxvY2FsUGFydGljaXBhbnQpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5sb2NhbFBhcnRpY2lwYW50LnVucHVibGlzaFRyYWNrKHRoaXMubG9jYWxWaWRlb1RyYWNrKTtcbiAgICAgICAgLy8gICAgICAgICB9XG5cbiAgICAgICAgLy8gICAgICAgICB0aGlzLmxvY2FsVmlkZW9UcmFjay5yZWxlYXNlKCk7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5sb2NhbFZpZGVvVHJhY2sgPSBudWxsO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9KTtcblxuICAgIH1cblxuICAgIGdldCBldmVudCgpOiBPYnNlcnZhYmxlIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQ7XG5cbiAgICB9XG5cbiAgICBzdGFydFByZXZpZXcoKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmxvY2FsVmlkZW9UcmFjayAmJiB0aGlzLmxvY2FsVmlkZW9UcmFjayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmxvY2FsVmlkZW9WaWV3LnNldE1pcnJvcih0cnVlKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY2FtZXJhQ2FwdHVyZXIgPSBuZXcgQ2FtZXJhQ2FwdHVyZXIodXRpbHMuYWQuZ2V0QXBwbGljYXRpb25Db250ZXh0KCksIENhbWVyYUNhcHR1cmVyLkNhbWVyYVNvdXJjZS5GUk9OVF9DQU1FUkEsIHRoaXMuY2FtZXJhTGlzdGVuZXIoKSk7XG4gICAgICAgICAgICB0aGlzLmNhbWVyYUNhcHR1cmVyID0gbmV3IENhbWVyYUNhcHR1cmVyKHV0aWxzLmFkLmdldEFwcGxpY2F0aW9uQ29udGV4dCgpLCBDYW1lcmFDYXB0dXJlci5DYW1lcmFTb3VyY2UuRlJPTlRfQ0FNRVJBLCBudWxsKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxWaWRlb1RyYWNrID0gTG9jYWxWaWRlb1RyYWNrLmNyZWF0ZSh1dGlscy5hZC5nZXRBcHBsaWNhdGlvbkNvbnRleHQoKSwgdHJ1ZSwgdGhpcy5jYW1lcmFDYXB0dXJlcik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsVmlkZW9UcmFjay5hZGRSZW5kZXJlcih0aGlzLmxvY2FsVmlkZW9WaWV3KTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGFkZFJlbW90ZVBhcnRpY2lwYW50KHJlbW90ZVBhcnRpY2lwYW50OiBhbnkpIHtcbiAgICAgICAgaWYgKHJlbW90ZVBhcnRpY2lwYW50LmdldFJlbW90ZVZpZGVvVHJhY2tzKCkuc2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgbGV0IHJlbW90ZVZpZGVvVHJhY2tQdWJsaWNhdGlvbiA9IHJlbW90ZVBhcnRpY2lwYW50LmdldFJlbW90ZVZpZGVvVHJhY2tzKCkuZ2V0KDApO1xuICAgICAgICAgICAgaWYgKHJlbW90ZVZpZGVvVHJhY2tQdWJsaWNhdGlvbi5pc1RyYWNrU3Vic2NyaWJlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRSZW1vdGVQYXJ0aWNpcGFudFZpZGVvKHJlbW90ZVZpZGVvVHJhY2tQdWJsaWNhdGlvbi5nZXRSZW1vdGVWaWRlb1RyYWNrKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogU3RhcnQgbGlzdGVuaW5nIGZvciBwYXJ0aWNpcGFudCBldmVudHNcbiAgICAgICAgICovXG4gICAgICAgIHJlbW90ZVBhcnRpY2lwYW50LnNldExpc3RlbmVyKHRoaXMucGFydGljaXBhbnRMaXN0ZW5lcigpKTtcblxuICAgIH1cblxuICAgIHByZXBhcmVMb2NhbE1lZGlhKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIC8vIFdlIHdpbGwgc2hhcmUgbG9jYWwgYXVkaW8gYW5kIHZpZGVvIHdoZW4gd2UgY29ubmVjdCB0byByb29tLlxuICAgICAgICAvLyBDcmVhdGUgYW4gYXVkaW8gdHJhY2suXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5sb2NhbEF1ZGlvVHJhY2spIHtcblxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxBdWRpb1RyYWNrID0gTG9jYWxBdWRpb1RyYWNrLmNyZWF0ZSh1dGlscy5hZC5nZXRBcHBsaWNhdGlvbkNvbnRleHQoKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubG9jYWxBdWRpb1RyYWNrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKFwiRmFpbGVkIHRvIGFkZCBhdWRpbyB0cmFja1wiKTtcblxuICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJGYWlsZWQgdG8gYWRkIGF1ZGlvIHRyYWNrXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSB2aWRlbyB0cmFjayB3aGljaCBjYXB0dXJlcyBmcm9tIHRoZSBjYW1lcmEuXG4gICAgICAgICAgICBpZiAoIXRoaXMubG9jYWxWaWRlb1RyYWNrKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UHJldmlldygpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG9uRXJyb3IocmVhc29uOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcHVibGljIHJlbW92ZVBhcnRpY2lwYW50VmlkZW8odmlkZW9UcmFjaykge1xuICAgICAgICB2aWRlb1RyYWNrLnJlbW92ZVJlbmRlcmVyKHRoaXMucmVtb3RlVmlkZW9WaWV3KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlUmVtb3RlUGFydGljaXBhbnQocmVtb3RlUGFydGljaXBhbnQpIHtcblxuICAgICAgICAvLyBpZiAoIXJlbW90ZVBhcnRpY2lwYW50LmdldElkZW50aXR5KCkuZXF1YWxzKHJlbW90ZVBhcnRpY2lwYW50SWRlbnRpdHkpKSB7XG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvKlxuICAgICAgICAqIFJlbW92ZSByZW1vdGUgcGFydGljaXBhbnQgcmVuZGVyZXJcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKCFyZW1vdGVQYXJ0aWNpcGFudC5nZXRSZW1vdGVWaWRlb1RyYWNrcygpLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgbGV0IHJlbW90ZVZpZGVvVHJhY2tQdWJsaWNhdGlvbiA9IHJlbW90ZVBhcnRpY2lwYW50LmdldFJlbW90ZVZpZGVvVHJhY2tzKCkuZ2V0KDApO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICogUmVtb3ZlIHZpZGVvIG9ubHkgaWYgc3Vic2NyaWJlZCB0byBwYXJ0aWNpcGFudCB0cmFja1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChyZW1vdGVWaWRlb1RyYWNrUHVibGljYXRpb24uaXNUcmFja1N1YnNjcmliZWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlUGFydGljaXBhbnRWaWRlbyhyZW1vdGVWaWRlb1RyYWNrUHVibGljYXRpb24uZ2V0UmVtb3RlVmlkZW9UcmFjaygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG59XG5cbiAgICBwdWJsaWMgY29ubmVjdF90b19yb29tKHJvb21OYW1lOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcblxuICAgICAgICAgICAgdGhpcy5vbkVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIHRva2VuIHRvIGNvbm5lY3QgdG8gYSByb29tJyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWd1cmVfYXVkaW8odHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5wcmVwYXJlTG9jYWxNZWRpYSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBSRVBBUkUgTE9DQUwgTUVESUEgIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlwiKTtcblxuICAgICAgICBsZXQgY29ubmVjdE9wdGlvbnNCdWlsZGVyID0gbmV3IENvbm5lY3RPcHRpb25zLkJ1aWxkZXIodGhpcy5hY2Nlc3NUb2tlbikucm9vbU5hbWUocm9vbU5hbWUpO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsQXVkaW9UcmFjaykge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICogQWRkIGxvY2FsIGF1ZGlvIHRyYWNrIHRvIGNvbm5lY3Qgb3B0aW9ucyB0byBzaGFyZSB3aXRoIHBhcnRpY2lwYW50cy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25uZWN0T3B0aW9uc0J1aWxkZXIuYXVkaW9UcmFja3MoamF2YS51dGlsLkNvbGxlY3Rpb25zLnNpbmdsZXRvbkxpc3QodGhpcy5sb2NhbEF1ZGlvVHJhY2spKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTE9DQUwgQVVESU8gVFJBQ0tcIik7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFkZCBsb2NhbCB2aWRlbyB0cmFjayB0byBjb25uZWN0IG9wdGlvbnMgdG8gc2hhcmUgd2l0aCBwYXJ0aWNpcGFudHMuXG4gICAgICAgICAqL1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsVmlkZW9UcmFjaykge1xuICAgICAgICAgICAgY29ubmVjdE9wdGlvbnNCdWlsZGVyLnZpZGVvVHJhY2tzKGphdmEudXRpbC5Db2xsZWN0aW9ucy5zaW5nbGV0b25MaXN0KHRoaXMubG9jYWxWaWRlb1RyYWNrKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxPQ0FMIFZJREVPIFRSQUNLXCIpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvb20gPSBWaWRlby5jb25uZWN0KHV0aWxzLmFkLmdldEFwcGxpY2F0aW9uQ29udGV4dCgpLCBjb25uZWN0T3B0aW9uc0J1aWxkZXIuYnVpbGQoKSwgdGhpcy5yb29tTGlzdGVuZXIoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm9vbS5nZXROYW1lKCkrXCIgIFJPT00gTkFNRSBcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm9vbS5nZXRTdGF0ZSgpK1wiIFNUQVRVUyAgIFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5yb29tLmdldExvY2FsUGFydGljaXBhbnQoKSkrIFwiIFBBUlRJQ0lQQU5UU1wiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJUQVNLIEVORCBcIitKU09OLnN0cmluZ2lmeSh0aGlzLnJvb20pKTtcbiAgICB9XG5cbiAgIC8qXG4gICAgKiBTZXQgcHJpbWFyeSB2aWV3IGFzIHJlbmRlcmVyIGZvciBwYXJ0aWNpcGFudCB2aWRlbyB0cmFja1xuICAgICovXG4gICAgcHVibGljIGFkZFJlbW90ZVBhcnRpY2lwYW50VmlkZW8odmlkZW9UcmFjaykge1xuICAgICAgICB0aGlzLnJlbW90ZVZpZGVvVmlldy5zZXRNaXJyb3IodHJ1ZSk7XG4gICAgICAgIHZpZGVvVHJhY2suYWRkUmVuZGVyZXIodGhpcy5yZW1vdGVWaWRlb1ZpZXcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXN0cm95X2xvY2FsX3ZpZGVvKCkge1xuXG4gICAgICAgIHRoaXMubG9jYWxWaWRlb1RyYWNrLnJlbW92ZVJlbmRlcmVyKHRoaXMubG9jYWxWaWRlb1ZpZXcpO1xuXG4gICAgICAgIHRoaXMubG9jYWxWaWRlb1RyYWNrID0gbnVsbFxuXG4gICAgfVxuXG5cbiAgICBkaXNjb25uZWN0KCkge1xuXG4gICAgICAgIHRoaXMucm9vbS5kaXNjb25uZWN0KCk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgY2FtZXJhTGlzdGVuZXIoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IENhbWVyYUNhcHR1cmVyLkxpc3RlbmVyKHtcbiAgICAgICAgICAgIG9uRmlyc3RGcmFtZUF2YWlsYWJsZSgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWU6ICd2aWRlb1ZpZXdEaWRSZWNlaXZlRGF0YScsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3OiAndmlldycsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgb25FcnJvcihlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbkVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgcHVibGljIHJvb21MaXN0ZW5lcigpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBuZXcgUm9vbS5MaXN0ZW5lcih7XG4gICAgICAgICAgICBvbkNvbm5lY3RlZChyb29tKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSByb29tLmdldFJlbW90ZVBhcnRpY2lwYW50cygpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5sb2NhbFBhcnRpY2lwYW50ID0gcm9vbS5nZXRMb2NhbFBhcnRpY2lwYW50KCk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWU6ICdkaWRDb25uZWN0VG9Sb29tJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb206IHJvb20sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogbGlzdC5zaXplKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0LnNpemUoKTsgaSA8IGw7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0aWNpcGFudCA9IGxpc3QuZ2V0KGkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNpcGFudC5nZXRWaWRlb1RyYWNrcygpLnNpemUoKSA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRSZW1vdGVQYXJ0aWNpcGFudChwYXJ0aWNpcGFudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Db25uZWN0RmFpbHVyZShyb29tLCBlcnJvcikge1xuICAgICAgICAgICAgICAgIHNlbGYuY29uZmlndXJlX2F1ZGlvKGZhbHNlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3IpK1wiIFJPT00gTkFNRSA6XCIrcm9vbSk7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAnZGlkRmFpbFRvQ29ubmVjdFdpdGhFcnJvcicsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb29tOiByb29tLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRpc2Nvbm5lY3RlZChyb29tLCBlcnJvcikge1xuICAgICAgICAgICAgICAgIHNlbGYucm9vbSA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYubG9jYWxQYXJ0aWNpcGFudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25maWd1cmVfYXVkaW8oZmFsc2UpXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuX2V2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE5hbWU6ICdvbkRpc2Nvbm5lY3RlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb206IHJvb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblBhcnRpY2lwYW50Q29ubmVjdGVkKHJvb20sIHBhcnRpY2lwYW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BhcnRpY2lwYW50RGlkQ29ubmVjdCcpO1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RGlkQ29ubmVjdCcsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb29tOiByb29tLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHBhcnRpY2lwYW50LmdldFJlbW90ZVZpZGVvVHJhY2tzKCkuc2l6ZSgpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZi5hZGRSZW1vdGVQYXJ0aWNpcGFudChwYXJ0aWNpcGFudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25QYXJ0aWNpcGFudERpc2Nvbm5lY3RlZChyb29tLCBwYXJ0aWNpcGFudCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RGlkRGlzY29ubmVjdCcsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb29tOiByb29tLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVSZW1vdGVQYXJ0aWNpcGFudChwYXJ0aWNpcGFudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25SZWNvcmRpbmdTdGFydGVkKHJvb20pIHtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIEluZGljYXRlcyB3aGVuIG1lZGlhIHNoYXJlZCB0byBhIFJvb20gaXMgYmVpbmcgcmVjb3JkZWQuIE5vdGUgdGhhdFxuICAgICAgICAgICAgICAgICAqIHJlY29yZGluZyBpcyBvbmx5IGF2YWlsYWJsZSBpbiBvdXIgR3JvdXAgUm9vbXMgZGV2ZWxvcGVyIHByZXZpZXcuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLy8gaWYgKHNlbGYuX2V2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBldmVudE5hbWU6ICdvblJlY29yZGluZ1N0YXJ0ZWQnLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICByb29tOiByb29tXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC8vICAgICB9KVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblJlY29yZGluZ1N0b3BwZWQocm9vbSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIChzZWxmLl9ldmVudCkge1xuICAgICAgICAgICAgICAgIC8vICAgICBzZWxmLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZXZlbnROYW1lOiAnb25SZWNvcmRpbmdTdG9wcGVkJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcm9vbTogcm9vbVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHBhcnRpY2lwYW50TGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJ0aWNpcGFudC5MaXN0ZW5lcih7XG4gICAgICAgICAgICBvbkF1ZGlvVHJhY2tQdWJsaXNoZWQocGFydGljaXBhbnQsIHB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAncGFydGljaXBhbnRQdWJsaXNoZWRBdWRpb1RyYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25BdWRpb1RyYWNrVW5wdWJsaXNoZWQocGFydGljaXBhbnQsIHB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAncGFydGljaXBhbnRVbnB1Ymxpc2hlZEF1ZGlvVHJhY2snLFxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb246IHB1YmxpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblZpZGVvVHJhY2tQdWJsaXNoZWQocGFydGljaXBhbnQsIHB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAncGFydGljaXBhbnRQdWJsaXNoZWRWaWRlb1RyYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25WaWRlb1RyYWNrVW5wdWJsaXNoZWQocGFydGljaXBhbnQsIHB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAncGFydGljaXBhbnRVbnB1Ymxpc2hlZFZpZGVvVHJhY2snLFxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb246IHB1YmxpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkF1ZGlvVHJhY2tTdWJzY3JpYmVkKHJlbW90ZVBhcnRpY2lwYW50LCByZW1vdGVBdWRpb1RyYWNrUHVibGljYXRpb24sIHJlbW90ZUF1ZGlvVHJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWU6ICdvbkF1ZGlvVHJhY2tTdWJzY3JpYmVkJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiByZW1vdGVQYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiByZW1vdGVBdWRpb1RyYWNrUHVibGljYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBhdWRpb1RyYWNrOiByZW1vdGVBdWRpb1RyYWNrXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uQXVkaW9UcmFja1Vuc3Vic2NyaWJlZChyZW1vdGVQYXJ0aWNpcGFudCwgcmVtb3RlQXVkaW9UcmFja1B1YmxpY2F0aW9uLCByZW1vdGVBdWRpb1RyYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAnb25BdWRpb1RyYWNrVW5zdWJzY3JpYmVkJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiByZW1vdGVQYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiByZW1vdGVBdWRpb1RyYWNrUHVibGljYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBhdWRpb1RyYWNrOiByZW1vdGVBdWRpb1RyYWNrXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVmlkZW9UcmFja1N1YnNjcmliZWQocmVtb3RlUGFydGljaXBhbnQsIHJlbW90ZVZpZGVvVHJhY2tQdWJsaWNhdGlvbiwgcmVtb3RlVmlkZW9UcmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYuYWRkUmVtb3RlUGFydGljaXBhbnRWaWRlbyhyZW1vdGVWaWRlb1RyYWNrKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uVmlkZW9UcmFja1N1YnNjcmliZWRcIilcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWU6ICdvblZpZGVvVHJhY2tTdWJzY3JpYmVkJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiByZW1vdGVQYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiByZW1vdGVWaWRlb1RyYWNrUHVibGljYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb1RyYWNrOiByZW1vdGVWaWRlb1RyYWNrXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblZpZGVvVHJhY2tVbnN1YnNjcmliZWQocmVtb3RlUGFydGljaXBhbnQsIHJlbW90ZVZpZGVvVHJhY2tQdWJsaWNhdGlvbiwgcmVtb3RlVmlkZW9UcmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYucmVtb3ZlUGFydGljaXBhbnRWaWRlbyhyZW1vdGVWaWRlb1RyYWNrKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uVmlkZW9UcmFja1Vuc3Vic2NyaWJlZFwiKVxuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJ29uVmlkZW9UcmFja1Vuc3Vic2NyaWJlZCcsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudDogcmVtb3RlUGFydGljaXBhbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbjogcmVtb3RlVmlkZW9UcmFja1B1YmxpY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlkZW9UcmFjazogcmVtb3RlVmlkZW9UcmFja1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9uVmlkZW9UcmFja0Rpc2FibGVkKHBhcnRpY2lwYW50LCBwdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RGlzYWJsZWRWaWRlb1RyYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvblZpZGVvVHJhY2tFbmFibGVkKHBhcnRpY2lwYW50LCBwdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RW5hYmxlZFZpZGVvVHJhY2snLFxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb246IHB1YmxpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9uQXVkaW9UcmFja0Rpc2FibGVkKHBhcnRpY2lwYW50LCBwdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RGlzYWJsZWRBdWRpb1RyYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvbkF1ZGlvVHJhY2tFbmFibGVkKHBhcnRpY2lwYW50LCBwdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RW5hYmxlZEF1ZGlvVHJhY2snLFxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb246IHB1YmxpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbmZpZ3VyZV9hdWRpbyhlbmFibGU6IGJvb2xlYW4pIHtcblxuICAgICAgICBpZiAoZW5hYmxlKSB7XG5cbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNBdWRpb01vZGUgPSB0aGlzLmF1ZGlvTWFuYWdlci5nZXRNb2RlKCk7XG5cbiAgICAgICAgICAgIC8vIFJlcXVlc3QgYXVkaW8gZm9jdXMgYmVmb3JlIG1ha2luZyBhbnkgZGV2aWNlIHN3aXRjaC5cbiAgICAgICAgICAgIC8vIHRoaXMuYXVkaW9NYW5hZ2VyLnJlcXVlc3RBdWRpb0ZvY3VzKG51bGwsIEF1ZGlvTWFuYWdlci5TVFJFQU1fVk9JQ0VfQ0FMTCwgQXVkaW9NYW5hZ2VyLkFVRElPRk9DVVNfR0FJTl9UUkFOU0lFTlQpO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QXVkaW9Gb2N1cygpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFVzZSBNT0RFX0lOX0NPTU1VTklDQVRJT04gYXMgdGhlIGRlZmF1bHQgYXVkaW8gbW9kZS4gSXQgaXMgcmVxdWlyZWRcbiAgICAgICAgICAgICAqIHRvIGJlIGluIHRoaXMgbW9kZSB3aGVuIHBsYXlvdXQgYW5kL29yIHJlY29yZGluZyBzdGFydHMgZm9yIHRoZSBiZXN0XG4gICAgICAgICAgICAgKiBwb3NzaWJsZSBWb0lQIHBlcmZvcm1hbmNlLiBTb21lIGRldmljZXMgaGF2ZSBkaWZmaWN1bHRpZXMgd2l0aFxuICAgICAgICAgICAgICogc3BlYWtlciBtb2RlIGlmIHRoaXMgaXMgbm90IHNldC5cbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlci5zZXRNb2RlKEF1ZGlvTWFuYWdlci5NT0RFX0lOX0NPTU1VTklDQVRJT04pO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWx3YXlzIGRpc2FibGUgbWljcm9waG9uZSBtdXRlIGR1cmluZyBhIFdlYlJUQyBjYWxsLlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNNaWNyb3Bob25lTXV0ZSA9IHRoaXMuYXVkaW9NYW5hZ2VyLmlzTWljcm9waG9uZU11dGUoKTtcbiAgICAgICAgICAgIHRoaXMuYXVkaW9NYW5hZ2VyLnNldE1pY3JvcGhvbmVNdXRlKGZhbHNlKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlci5zZXRNb2RlKHRoaXMucHJldmlvdXNBdWRpb01vZGUpO1xuICAgICAgICAgICAgdGhpcy5hdWRpb01hbmFnZXIuYWJhbmRvbkF1ZGlvRm9jdXMobnVsbCk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlci5zZXRNaWNyb3Bob25lTXV0ZSh0aGlzLnByZXZpb3VzTWljcm9waG9uZU11dGUpO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVxdWVzdEF1ZGlvRm9jdXMoKSB7XG4gICAgY29uc29sZS5sb2coYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQrXCIgU0RLIFZFUlNJT05cIik7XG4gICAgICAgaWYgKGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UID49IDI1KSB7XG5cbiAgICAgICAgICAgIHZhciBwbGF5YmFja0F0dHJpYnV0ZXMgPSBuZXcgQXVkaW9BdHRyaWJ1dGVzLkJ1aWxkZXIoKVxuICAgICAgICAgICAgICAgIC5zZXRVc2FnZShBdWRpb0F0dHJpYnV0ZXMuVVNBR0VfVk9JQ0VfQ09NTVVOSUNBVElPTilcbiAgICAgICAgICAgICAgICAuc2V0Q29udGVudFR5cGUoQXVkaW9BdHRyaWJ1dGVzLkNPTlRFTlRfVFlQRV9TUEVFQ0gpXG4gICAgICAgICAgICAgICAgLmJ1aWxkKCk7XG5cbiAgICAgICAgICAgIHZhciBmb2N1c1JlcXVlc3QgPSBuZXcgQXVkaW9Gb2N1c1JlcXVlc3QuQnVpbGRlcihBdWRpb01hbmFnZXIuQVVESU9GT0NVU19HQUlOX1RSQU5TSUVOVClcbiAgICAgICAgICAgICAgICAgICAgLnNldEF1ZGlvQXR0cmlidXRlcyhwbGF5YmFja0F0dHJpYnV0ZXMpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRBY2NlcHRzRGVsYXllZEZvY3VzR2Fpbih0cnVlKVxuICAgICAgICAgICAgICAgICAgICAuc2V0T25BdWRpb0ZvY3VzQ2hhbmdlTGlzdGVuZXIobmV3IEF1ZGlvTWFuYWdlci5PbkF1ZGlvRm9jdXNDaGFuZ2VMaXN0ZW5lcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkF1ZGlvRm9jdXNDaGFuZ2UoaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5idWlsZCgpKTtcblxuICAgICAgICAgICAgdGhpcy5hdWRpb01hbmFnZXIucmVxdWVzdEF1ZGlvRm9jdXMoZm9jdXNSZXF1ZXN0KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hdWRpb01hbmFnZXIucmVxdWVzdEF1ZGlvRm9jdXMobnVsbCwgQXVkaW9NYW5hZ2VyLlNUUkVBTV9WT0lDRV9DQUxMLCBBdWRpb01hbmFnZXIuQVVESU9GT0NVU19HQUlOX1RSQU5TSUVOVCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0X2FjY2Vzc190b2tlbih0b2tlbjogc3RyaW5nKSB7XG5cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IHRva2VuO1xuXG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZV9sb2NhbF92aWRlbygpIHtcblxuICAgICAgICBpZiAodGhpcy5sb2NhbFZpZGVvVHJhY2spIHtcblxuICAgICAgICAgICAgbGV0IGVuYWJsZSA9ICF0aGlzLmxvY2FsVmlkZW9UcmFjay5pc0VuYWJsZWQoKTtcblxuICAgICAgICAgICAgdGhpcy5sb2NhbFZpZGVvVHJhY2suZW5hYmxlKGVuYWJsZSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZV9sb2NhbF9hdWRpbygpIHtcblxuICAgICAgICBpZiAodGhpcy5sb2NhbEF1ZGlvVHJhY2spIHtcblxuICAgICAgICAgICAgbGV0IGVuYWJsZWQgPSAhdGhpcy5sb2NhbEF1ZGlvVHJhY2suaXNFbmFibGVkKCk7XG5cbiAgICAgICAgICAgIHRoaXMubG9jYWxBdWRpb1RyYWNrLmVuYWJsZShlbmFibGVkKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbn0iXX0=