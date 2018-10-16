"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("ui/core/view");
// const videoView = TVIVideoView.alloc().init();
var LocalVideo = (function (_super) {
    __extends(LocalVideo, _super);
    function LocalVideo() {
        var _this = _super.call(this) || this;
        // try {
        //     this._videoViewDelegate = VideoViewDelegate.initWithOwner(new WeakRef(this));
        //     this.localVideoView = TVIVideoView.alloc().init().initWithFrame(this._videoViewDelegate);
        // } catch(e) {
        //     console.log(e);
        // }
        _this.localVideoView = TVIVideoView.alloc().init();
        _this.localVideoView.mirror = true;
        _this.localVideoView.contentMode = 2 /* ScaleAspectFill */;
        return _this;
    }
    LocalVideo.prototype.createNativeView = function () {
        return this.localVideoView;
    };
    LocalVideo.prototype.disposeNativeView = function () {
        this.nativeView = null;
    };
    return LocalVideo;
}(view_1.View));
exports.LocalVideo = LocalVideo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxWaWRlby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2FsVmlkZW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBb0M7QUFRcEMsaURBQWlEO0FBRWpEO0lBQWdDLDhCQUFJO0lBTWhDO1FBQUEsWUFDSSxpQkFBTyxTQVVWO1FBVEcsUUFBUTtRQUNSLG9GQUFvRjtRQUNwRixnR0FBZ0c7UUFDaEcsZUFBZTtRQUNmLHNCQUFzQjtRQUN0QixJQUFJO1FBQ0osS0FBSSxDQUFDLGNBQWMsR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLEtBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLHVCQUFpQyxDQUFDOztJQUN4RSxDQUFDO0lBRU0scUNBQWdCLEdBQXZCO1FBRUksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFFL0IsQ0FBQztJQUVNLHNDQUFpQixHQUF4QjtRQUVJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBRTNCLENBQUM7SUFFTCxpQkFBQztBQUFELENBQUMsQUEvQkQsQ0FBZ0MsV0FBSSxHQStCbkM7QUEvQlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaWV3IH0gZnJvbSAndWkvY29yZS92aWV3JztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3V0aWxzL3V0aWxzXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmcm9tT2JqZWN0IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUnO1xuXG5pbXBvcnQgeyBWaWRlb1ZpZXdEZWxlZ2F0ZSB9IGZyb20gJy4vZGVsZWdhdGVzJztcblxuZGVjbGFyZSB2YXIgVFZJVmlkZW9WaWV3O1xuXG4vLyBjb25zdCB2aWRlb1ZpZXcgPSBUVklWaWRlb1ZpZXcuYWxsb2MoKS5pbml0KCk7XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFZpZGVvIGV4dGVuZHMgVmlldyB7XG5cbiAgICBsb2NhbFZpZGVvVmlldzogYW55O1xuICAgIF92aWRlb1ZpZXdEZWxlZ2F0ZTogYW55OyBcbiAgICBuYXRpdmVWaWV3OiBhbnk7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vIHRyeSB7XG4gICAgICAgIC8vICAgICB0aGlzLl92aWRlb1ZpZXdEZWxlZ2F0ZSA9IFZpZGVvVmlld0RlbGVnYXRlLmluaXRXaXRoT3duZXIobmV3IFdlYWtSZWYodGhpcykpO1xuICAgICAgICAvLyAgICAgdGhpcy5sb2NhbFZpZGVvVmlldyA9IFRWSVZpZGVvVmlldy5hbGxvYygpLmluaXQoKS5pbml0V2l0aEZyYW1lKHRoaXMuX3ZpZGVvVmlld0RlbGVnYXRlKTtcbiAgICAgICAgLy8gfSBjYXRjaChlKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgLy8gfVxuICAgICAgICB0aGlzLmxvY2FsVmlkZW9WaWV3ID0gVFZJVmlkZW9WaWV3LmFsbG9jKCkuaW5pdCgpO1xuICAgICAgICB0aGlzLmxvY2FsVmlkZW9WaWV3Lm1pcnJvciA9IHRydWU7XG4gICAgICAgIHRoaXMubG9jYWxWaWRlb1ZpZXcuY29udGVudE1vZGUgPSBVSVZpZXdDb250ZW50TW9kZS5TY2FsZUFzcGVjdEZpbGw7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZU5hdGl2ZVZpZXcoKTogYW55IHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsVmlkZW9WaWV3O1xuXG4gICAgfVxuXG4gICAgcHVibGljIGRpc3Bvc2VOYXRpdmVWaWV3KCk6IHZvaWQge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5uYXRpdmVWaWV3ID0gbnVsbDtcblxuICAgIH1cblxufVxuIl19