"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var delegates_1 = require("./delegates");
var VideoActivity = (function () {
    function VideoActivity() {
        // this._cameraCapturerDelegate = CameraCapturerDelegate.initWithOwner(new WeakRef(this));
        this._roomDelegate = delegates_1.RoomDelegate.initWithOwner(new WeakRef(this), this);
        this._participantDelegate = delegates_1.RemoteParticipantDelegate.initWithOwner(new WeakRef(this), this);
    }
    VideoActivity.prototype.startPreview = function () {
        // TVICameraCapturer is not supported with the Simulator.
        // this.camera = TVICameraCapturer.alloc().initWithSourceDelegate(TVICameraCaptureSourceFrontCamera, this._cameraCapturerDelegate);
        this.camera = TVICameraCapturer.alloc().initWithSource(TVICameraCaptureSourceFrontCamera);
        this.localVideoTrack = TVILocalVideoTrack.trackWithCapturer(this.camera);
        if (!this.localVideoTrack) {
            this.notify('Failed to add video track');
        }
        else {
            // Add renderer to video track for local preview
            this.localVideoTrack.addRenderer(this.localVideoView);
        }
    };
    VideoActivity.prototype.disconnect = function () {
        this.room.disconnect();
    };
    VideoActivity.prototype.prepareLocalMedia = function () {
        var _this = this;
        // We will share local audio and video when we connect to room.
        // Create an audio track.
        return new Promise(function (resolve, reject) {
            if (!_this.localAudioTrack) {
                _this.localAudioTrack = TVILocalAudioTrack.track();
                if (!_this.localAudioTrack) {
                    _this.notify("Failed to add audio track");
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
    VideoActivity.prototype.toggle_local_video = function () {
        if (this.localVideoTrack) {
            this.localVideoTrack.enabled = !this.localVideoTrack.enable;
        }
    };
    VideoActivity.prototype.toggle_local_audio = function () {
        if (this.localAudioTrack) {
            this.localAudioTrack.enabled = !this.localAudioTrack.enabled;
        }
    };
    VideoActivity.prototype.connect_to_room = function (room) {
        var _this = this;
        if (!this.accessToken) {
            this.notify('Please provide a valid token to connect to a room');
            return;
        }
        // this.room = room;
        // Prepare local media which we will share with Room Participants.
        this.prepareLocalMedia();
        console.log("After prepare Local Media");
        var connectOptions = TVIConnectOptions.optionsWithTokenBlock(this.accessToken, function (builder) {
            // Use the local media that we prepared earlier.
            builder.audioTracks = [_this.localAudioTrack];
            builder.videoTracks = [_this.localVideoTrack];
            // The name of the Room where the Client will attempt to connect to. Please note that if you pass an empty
            // Room `name`, the Client will create one for you. You can get the name or sid from any connected Room.
            builder.roomName = room;
        });
        // Connect to the Room using the options we provided.
        this.room = TwilioVideo.connectWithOptionsDelegate(connectOptions, this._roomDelegate);
    };
    VideoActivity.prototype.cleanupRemoteParticipant = function () {
        if (this.remoteParticipants && this.remoteParticipants.videoTracks.count > 0) {
            this.videoTrack.removeRenderer(this.remoteVideoView);
            this.remoteVideoView.removeFromSuperview();
            this.remoteParticipants = undefined;
        }
    };
    VideoActivity.prototype.notify = function (reason) {
        this.event.notify({
            eventName: 'error',
            object: observable_1.fromObject({
                reason: reason
            })
        });
    };
    VideoActivity.prototype.connectToRoomWithListener = function (room) {
        if (room.remoteParticipants.count > 0) {
            this.remoteParticipants = room.remoteParticipants[0];
            this.remoteParticipants.delegate = this._participantDelegate;
        }
    };
    VideoActivity.prototype.participant_joined_room = function (participant) {
        if (!this.remoteParticipants) {
            this.remoteParticipants = participant;
            this.remoteParticipants.delegate = this._participantDelegate;
        }
    };
    VideoActivity.prototype.set_access_token = function (token) {
        this.accessToken = token;
    };
    VideoActivity.prototype.add_video_track = function (videoTrack) {
        videoTrack.addRenderer(this.remoteVideoView);
    };
    VideoActivity.prototype.destroy_local_video = function () {
        this.localVideoTrack.removeRenderer(this.localVideoView);
    };
    VideoActivity.prototype.configure_audio = function (enable) {
        // We will share local audio and video when we connect to room.
        // Create an audio track.
        if (!this.localAudioTrack) {
            this.localAudioTrack = TVILocalAudioTrack.track();
            if (!this.localAudioTrack) {
                return 'failed to get local audio';
            }
        }
    };
    Object.defineProperty(VideoActivity.prototype, "event", {
        get: function () {
            return delegates_1.DelegateEvents._event;
        },
        enumerable: true,
        configurable: true
    });
    return VideoActivity;
}());
exports.VideoActivity = VideoActivity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpbGlvLXZpZGVvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHdpbGlvLXZpZGVvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsK0RBQTBFO0FBRTFFLHlDQUE4RztBQWU5RztJQXNCSTtRQUVJLDBGQUEwRjtRQUUxRixJQUFJLENBQUMsYUFBYSxHQUFHLHdCQUFZLENBQUMsYUFBYSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXpFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxxQ0FBeUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFakcsQ0FBQztJQUVELG9DQUFZLEdBQVo7UUFDSSx5REFBeUQ7UUFDekQsbUlBQW1JO1FBQ25JLElBQUksQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFFMUYsSUFBSSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFekUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUV4QixJQUFJLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFN0MsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUxRCxDQUFDO0lBRUwsQ0FBQztJQUVELGtDQUFVLEdBQVY7UUFFSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRTNCLENBQUM7SUFFRCx5Q0FBaUIsR0FBakI7UUFBQSxpQkFnQ0M7UUEvQkcsK0RBQStEO1FBQy9ELHlCQUF5QjtRQUN6QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUUvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUV4QixLQUFJLENBQUMsZUFBZSxHQUFHLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUV4QixLQUFJLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDLENBQUM7b0JBRXpDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO29CQUVwQyxNQUFNLENBQUM7Z0JBRVgsQ0FBQztZQUVMLENBQUM7WUFFRCx1REFBdUQ7WUFDdkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFFeEIsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXhCLENBQUM7WUFFRCxPQUFPLEVBQUUsQ0FBQztRQUVkLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVNLDBDQUFrQixHQUF6QjtRQUVJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7UUFFaEUsQ0FBQztJQUVMLENBQUM7SUFFTSwwQ0FBa0IsR0FBekI7UUFFSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUV2QixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBRWpFLENBQUM7SUFFTCxDQUFDO0lBRUQsdUNBQWUsR0FBZixVQUFnQixJQUFZO1FBQTVCLGlCQXFDQztRQW5DRyxFQUFFLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxXQUFZLENBQUMsQ0FBQyxDQUFDO1lBRXRCLElBQUksQ0FBQyxNQUFNLENBQUMsbURBQW1ELENBQUMsQ0FBQztZQUVqRSxNQUFNLENBQUM7UUFFWCxDQUFDO1FBRUQsb0JBQW9CO1FBRXBCLGtFQUFrRTtRQUNsRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFekMsSUFBSSxjQUFjLEdBQUcsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFDLE9BQU87WUFHbkYsZ0RBQWdEO1lBRWhELE9BQU8sQ0FBQyxXQUFXLEdBQUcsQ0FBRSxLQUFJLENBQUMsZUFBZSxDQUFFLENBQUM7WUFFL0MsT0FBTyxDQUFDLFdBQVcsR0FBRyxDQUFFLEtBQUksQ0FBQyxlQUFlLENBQUUsQ0FBQztZQUUvQywwR0FBMEc7WUFDMUcsd0dBQXdHO1lBQ3hHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRzVCLENBQUMsQ0FBQyxDQUFDO1FBSUgscURBQXFEO1FBQ3JELElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLDBCQUEwQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFM0YsQ0FBQztJQUdELGdEQUF3QixHQUF4QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztRQUN4QyxDQUFDO0lBQ0wsQ0FBQztJQUVELDhCQUFNLEdBQU4sVUFBTyxNQUFjO1FBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2QsU0FBUyxFQUFFLE9BQU87WUFDbEIsTUFBTSxFQUFFLHVCQUFVLENBQUM7Z0JBQ2YsTUFBTSxFQUFFLE1BQU07YUFDakIsQ0FBQztTQUNMLENBQUMsQ0FBQztJQUVQLENBQUM7SUFLTSxpREFBeUIsR0FBaEMsVUFBaUMsSUFBSTtRQUVqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUVqRSxDQUFDO0lBRUwsQ0FBQztJQUVNLCtDQUF1QixHQUE5QixVQUErQixXQUFXO1FBRXRDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUUzQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsV0FBVyxDQUFDO1lBRXRDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBRWpFLENBQUM7SUFFTCxDQUFDO0lBRU0sd0NBQWdCLEdBQXZCLFVBQXdCLEtBQWE7UUFFakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFFN0IsQ0FBQztJQUVNLHVDQUFlLEdBQXRCLFVBQXVCLFVBQVU7UUFFN0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFakQsQ0FBQztJQUVNLDJDQUFtQixHQUExQjtRQUVJLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUU3RCxDQUFDO0lBR00sdUNBQWUsR0FBdEIsVUFBdUIsTUFBZTtRQUVsQywrREFBK0Q7UUFFL0QseUJBQXlCO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUV4QixNQUFNLENBQUMsMkJBQTJCLENBQUM7WUFFdkMsQ0FBQztRQUVMLENBQUM7SUFFTCxDQUFDO0lBSUQsc0JBQUksZ0NBQUs7YUFBVDtZQUVJLE1BQU0sQ0FBQywwQkFBYyxDQUFDLE1BQU0sQ0FBQztRQUVqQyxDQUFDOzs7T0FBQTtJQUtMLG9CQUFDO0FBQUQsQ0FBQyxBQXRQRCxJQXNQQztBQXRQWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgUmVtb3RlVmlkZW8gfSBmcm9tIFwiLi9yZW1vdGVWaWRlb1wiO1xuaW1wb3J0IHsgTG9jYWxWaWRlbyB9IGZyb20gXCIuL2xvY2FsVmlkZW9cIjtcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb21PYmplY3QgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBWaWRlb0FjdGl2aXR5QmFzZSB9IGZyb20gXCIuLi90d2lsaW8tY29tbW9uXCI7XG5pbXBvcnQgeyBSb29tRGVsZWdhdGUsIFJlbW90ZVBhcnRpY2lwYW50RGVsZWdhdGUsIERlbGVnYXRlRXZlbnRzLCBDYW1lcmFDYXB0dXJlckRlbGVnYXRlIH0gZnJvbSBcIi4vZGVsZWdhdGVzXCI7XG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvblwiO1xuXG5kZWNsYXJlIHZhciBUVklDb25uZWN0T3B0aW9ucyxcbiAgICAgICAgICAgIFRWSUNhbWVyYUNhcHR1cmVyLFxuICAgICAgICAgICAgVFZJTG9jYWxWaWRlb1RyYWNrLFxuICAgICAgICAgICAgVFZJUmVtb3RlUGFydGljaXBhbnQsXG4gICAgICAgICAgICBUd2lsaW9WaWRlbyxcbiAgICAgICAgICAgIFRWSUxvY2FsQXVkaW9UcmFjayxcbiAgICAgICAgICAgIFRWSVJvb20sXG4gICAgICAgICAgICBUVklWaWRlb1ZpZXcsXG4gICAgICAgICAgICBUVklSZW1vdGVWaWRlb1RyYWNrLFxuICAgICAgICAgICAgVFZJQ2FtZXJhQ2FwdHVyZVNvdXJjZUZyb250Q2FtZXJhO1xuXG5cbmV4cG9ydCBjbGFzcyBWaWRlb0FjdGl2aXR5IGltcGxlbWVudHMgVmlkZW9BY3Rpdml0eUJhc2Uge1xuXG4gICAgbG9jYWxWaWRlb1ZpZXc6IGFueTtcbiAgICByZW1vdGVWaWRlb1ZpZXc6IGFueTtcbiAgICBsb2NhbFZpZGVvVHJhY2s6IGFueTtcbiAgICBsb2NhbEF1ZGlvVHJhY2s6IGFueTtcbiAgICBjYW1lcmFDYXB0dXJlcjogYW55O1xuICAgIF9jYW1lcmFDYXB0dXJlckRlbGVnYXRlOiBhbnk7XG4gICAgYWNjZXNzVG9rZW46IHN0cmluZztcbiAgICByb29tT2JqOiBhbnk7XG4gICAgcHJldmlvdXNNaWNyb3Bob25lTXV0ZTogYm9vbGVhbjtcbiAgICBsb2NhbFBhcnRpY2lwYW50OiBhbnk7XG4gICAgcmVtb3RlUGFydGljaXBhbnRzOiBhbnk7XG4gICAgX3Jvb21MaXN0ZW5lcjogYW55O1xuICAgIF9wYXJ0aWNpcGFudERlbGVnYXRlOiBhbnk7XG4gICAgX3Jvb21EZWxlZ2F0ZTogYW55O1xuICAgIHBhcnRpY2lwYW50OiBhbnk7XG4gICAgdmlkZW9UcmFjazogYW55O1xuICAgIC8vIGV2ZW50OiBPYnNlcnZhYmxlO1xuICAgIHJvb206IGFueTtcbiAgICBjYW1lcmE6IGFueTtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHsgXG5cbiAgICAgICAgLy8gdGhpcy5fY2FtZXJhQ2FwdHVyZXJEZWxlZ2F0ZSA9IENhbWVyYUNhcHR1cmVyRGVsZWdhdGUuaW5pdFdpdGhPd25lcihuZXcgV2Vha1JlZih0aGlzKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9yb29tRGVsZWdhdGUgPSBSb29tRGVsZWdhdGUuaW5pdFdpdGhPd25lcihuZXcgV2Vha1JlZih0aGlzKSwgdGhpcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9wYXJ0aWNpcGFudERlbGVnYXRlID0gUmVtb3RlUGFydGljaXBhbnREZWxlZ2F0ZS5pbml0V2l0aE93bmVyKG5ldyBXZWFrUmVmKHRoaXMpLCB0aGlzKTsgICAgICBcblxuICAgIH1cblxuICAgIHN0YXJ0UHJldmlldygpIHtcbiAgICAgICAgLy8gVFZJQ2FtZXJhQ2FwdHVyZXIgaXMgbm90IHN1cHBvcnRlZCB3aXRoIHRoZSBTaW11bGF0b3IuXG4gICAgICAgIC8vIHRoaXMuY2FtZXJhID0gVFZJQ2FtZXJhQ2FwdHVyZXIuYWxsb2MoKS5pbml0V2l0aFNvdXJjZURlbGVnYXRlKFRWSUNhbWVyYUNhcHR1cmVTb3VyY2VGcm9udENhbWVyYSwgdGhpcy5fY2FtZXJhQ2FwdHVyZXJEZWxlZ2F0ZSk7XG4gICAgICAgIHRoaXMuY2FtZXJhID0gVFZJQ2FtZXJhQ2FwdHVyZXIuYWxsb2MoKS5pbml0V2l0aFNvdXJjZShUVklDYW1lcmFDYXB0dXJlU291cmNlRnJvbnRDYW1lcmEpO1xuXG4gICAgICAgIHRoaXMubG9jYWxWaWRlb1RyYWNrID0gVFZJTG9jYWxWaWRlb1RyYWNrLnRyYWNrV2l0aENhcHR1cmVyKHRoaXMuY2FtZXJhKTtcblxuICAgICAgICBpZiAoIXRoaXMubG9jYWxWaWRlb1RyYWNrKSB7XG5cbiAgICAgICAgICAgIHRoaXMubm90aWZ5KCdGYWlsZWQgdG8gYWRkIHZpZGVvIHRyYWNrJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFkZCByZW5kZXJlciB0byB2aWRlbyB0cmFjayBmb3IgbG9jYWwgcHJldmlld1xuICAgICAgICAgICAgdGhpcy5sb2NhbFZpZGVvVHJhY2suYWRkUmVuZGVyZXIodGhpcy5sb2NhbFZpZGVvVmlldyk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucm9vbS5kaXNjb25uZWN0KCk7XG5cbiAgICB9XG5cbiAgICBwcmVwYXJlTG9jYWxNZWRpYSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICAvLyBXZSB3aWxsIHNoYXJlIGxvY2FsIGF1ZGlvIGFuZCB2aWRlbyB3aGVuIHdlIGNvbm5lY3QgdG8gcm9vbS5cbiAgICAgICAgLy8gQ3JlYXRlIGFuIGF1ZGlvIHRyYWNrLlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICghdGhpcy5sb2NhbEF1ZGlvVHJhY2spIHtcblxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxBdWRpb1RyYWNrID0gVFZJTG9jYWxBdWRpb1RyYWNrLnRyYWNrKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxvY2FsQXVkaW9UcmFjaykge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5KFwiRmFpbGVkIHRvIGFkZCBhdWRpbyB0cmFja1wiKTtcblxuICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJGYWlsZWQgdG8gYWRkIGF1ZGlvIHRyYWNrXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSB2aWRlbyB0cmFjayB3aGljaCBjYXB0dXJlcyBmcm9tIHRoZSBjYW1lcmEuXG4gICAgICAgICAgICBpZiAoIXRoaXMubG9jYWxWaWRlb1RyYWNrKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UHJldmlldygpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlX2xvY2FsX3ZpZGVvKCkge1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsVmlkZW9UcmFjaykge1xuXG4gICAgICAgICAgICB0aGlzLmxvY2FsVmlkZW9UcmFjay5lbmFibGVkID0gIXRoaXMubG9jYWxWaWRlb1RyYWNrLmVuYWJsZTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlX2xvY2FsX2F1ZGlvKCkge1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsQXVkaW9UcmFjaykge1xuXG4gICAgICAgICAgICB0aGlzLmxvY2FsQXVkaW9UcmFjay5lbmFibGVkID0gIXRoaXMubG9jYWxBdWRpb1RyYWNrLmVuYWJsZWQ7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29ubmVjdF90b19yb29tKHJvb206IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIGlmICggIXRoaXMuYWNjZXNzVG9rZW4gKSB7XG5cbiAgICAgICAgICAgIHRoaXMubm90aWZ5KCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIHRva2VuIHRvIGNvbm5lY3QgdG8gYSByb29tJyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5yb29tID0gcm9vbTtcblxuICAgICAgICAvLyBQcmVwYXJlIGxvY2FsIG1lZGlhIHdoaWNoIHdlIHdpbGwgc2hhcmUgd2l0aCBSb29tIFBhcnRpY2lwYW50cy5cbiAgICAgICAgdGhpcy5wcmVwYXJlTG9jYWxNZWRpYSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFmdGVyIHByZXBhcmUgTG9jYWwgTWVkaWFcIik7XG5cbiAgICAgICAgdmFyIGNvbm5lY3RPcHRpb25zID0gVFZJQ29ubmVjdE9wdGlvbnMub3B0aW9uc1dpdGhUb2tlbkJsb2NrKHRoaXMuYWNjZXNzVG9rZW4sIChidWlsZGVyKSA9PiB7XG5cblxuICAgICAgICAgICAgLy8gVXNlIHRoZSBsb2NhbCBtZWRpYSB0aGF0IHdlIHByZXBhcmVkIGVhcmxpZXIuXG5cbiAgICAgICAgICAgIGJ1aWxkZXIuYXVkaW9UcmFja3MgPSBbIHRoaXMubG9jYWxBdWRpb1RyYWNrIF07XG5cbiAgICAgICAgICAgIGJ1aWxkZXIudmlkZW9UcmFja3MgPSBbIHRoaXMubG9jYWxWaWRlb1RyYWNrIF07XG5cbiAgICAgICAgICAgIC8vIFRoZSBuYW1lIG9mIHRoZSBSb29tIHdoZXJlIHRoZSBDbGllbnQgd2lsbCBhdHRlbXB0IHRvIGNvbm5lY3QgdG8uIFBsZWFzZSBub3RlIHRoYXQgaWYgeW91IHBhc3MgYW4gZW1wdHlcbiAgICAgICAgICAgIC8vIFJvb20gYG5hbWVgLCB0aGUgQ2xpZW50IHdpbGwgY3JlYXRlIG9uZSBmb3IgeW91LiBZb3UgY2FuIGdldCB0aGUgbmFtZSBvciBzaWQgZnJvbSBhbnkgY29ubmVjdGVkIFJvb20uXG4gICAgICAgICAgICBidWlsZGVyLnJvb21OYW1lID0gcm9vbTtcblxuXG4gICAgICAgIH0pO1xuICAgICAgICAgICAgXG5cblxuICAgICAgICAvLyBDb25uZWN0IHRvIHRoZSBSb29tIHVzaW5nIHRoZSBvcHRpb25zIHdlIHByb3ZpZGVkLlxuICAgICAgICB0aGlzLnJvb20gPSBUd2lsaW9WaWRlby5jb25uZWN0V2l0aE9wdGlvbnNEZWxlZ2F0ZShjb25uZWN0T3B0aW9ucywgdGhpcy5fcm9vbURlbGVnYXRlKTtcblxuICAgIH1cblxuXG4gICAgY2xlYW51cFJlbW90ZVBhcnRpY2lwYW50KCkge1xuICAgICAgICBpZiAodGhpcy5yZW1vdGVQYXJ0aWNpcGFudHMgJiYgdGhpcy5yZW1vdGVQYXJ0aWNpcGFudHMudmlkZW9UcmFja3MuY291bnQgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnZpZGVvVHJhY2sucmVtb3ZlUmVuZGVyZXIodGhpcy5yZW1vdGVWaWRlb1ZpZXcpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdGVWaWRlb1ZpZXcucmVtb3ZlRnJvbVN1cGVydmlldygpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdGVQYXJ0aWNpcGFudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub3RpZnkocmVhc29uOiBzdHJpbmcpIHtcblxuICAgICAgICB0aGlzLmV2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdlcnJvcicsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIFxuXG5cbiAgICBwdWJsaWMgY29ubmVjdFRvUm9vbVdpdGhMaXN0ZW5lcihyb29tKSB7IC8vIHJ1bnMgZnJvbSBvbkNvbm5lY3RlZC9kaWRDb25uZWN0VG9Sb29tXG5cbiAgICAgICAgaWYgKHJvb20ucmVtb3RlUGFydGljaXBhbnRzLmNvdW50ID4gMCkge1xuXG4gICAgICAgICAgICB0aGlzLnJlbW90ZVBhcnRpY2lwYW50cyA9IHJvb20ucmVtb3RlUGFydGljaXBhbnRzWzBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnJlbW90ZVBhcnRpY2lwYW50cy5kZWxlZ2F0ZSA9IHRoaXMuX3BhcnRpY2lwYW50RGVsZWdhdGU7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHVibGljIHBhcnRpY2lwYW50X2pvaW5lZF9yb29tKHBhcnRpY2lwYW50KSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLnJlbW90ZVBhcnRpY2lwYW50cykge1xuXG4gICAgICAgICAgICB0aGlzLnJlbW90ZVBhcnRpY2lwYW50cyA9IHBhcnRpY2lwYW50O1xuXG4gICAgICAgICAgICB0aGlzLnJlbW90ZVBhcnRpY2lwYW50cy5kZWxlZ2F0ZSA9IHRoaXMuX3BhcnRpY2lwYW50RGVsZWdhdGU7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHVibGljIHNldF9hY2Nlc3NfdG9rZW4odG9rZW46IHN0cmluZykge1xuXG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0b2tlbjtcblxuICAgIH1cblxuICAgIHB1YmxpYyBhZGRfdmlkZW9fdHJhY2sodmlkZW9UcmFjaykge1xuXG4gICAgICAgIHZpZGVvVHJhY2suYWRkUmVuZGVyZXIodGhpcy5yZW1vdGVWaWRlb1ZpZXcpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3lfbG9jYWxfdmlkZW8oKSB7XG5cbiAgICAgICAgdGhpcy5sb2NhbFZpZGVvVHJhY2sucmVtb3ZlUmVuZGVyZXIodGhpcy5sb2NhbFZpZGVvVmlldyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBjb25maWd1cmVfYXVkaW8oZW5hYmxlOiBib29sZWFuKTogYW55IHtcblxuICAgICAgICAvLyBXZSB3aWxsIHNoYXJlIGxvY2FsIGF1ZGlvIGFuZCB2aWRlbyB3aGVuIHdlIGNvbm5lY3QgdG8gcm9vbS5cblxuICAgICAgICAvLyBDcmVhdGUgYW4gYXVkaW8gdHJhY2suXG4gICAgICAgIGlmICghdGhpcy5sb2NhbEF1ZGlvVHJhY2spIHtcblxuICAgICAgICAgICAgdGhpcy5sb2NhbEF1ZGlvVHJhY2sgPSBUVklMb2NhbEF1ZGlvVHJhY2sudHJhY2soKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmxvY2FsQXVkaW9UcmFjaykge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICdmYWlsZWQgdG8gZ2V0IGxvY2FsIGF1ZGlvJztcblxuICAgICAgICAgICAgfSAgICAgICAgIFxuXG4gICAgICAgIH0gXG5cbiAgICB9XG5cblxuXG4gICAgZ2V0IGV2ZW50KCk6IE9ic2VydmFibGUge1xuXG4gICAgICAgIHJldHVybiBEZWxlZ2F0ZUV2ZW50cy5fZXZlbnQ7XG5cbiAgICB9XG5cbiAgICBcblxuXG59XG5cbiJdfQ==