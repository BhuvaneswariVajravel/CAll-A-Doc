"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("ui/core/view");
var RemoteVideo = (function (_super) {
    __extends(RemoteVideo, _super);
    function RemoteVideo() {
        var _this = _super.call(this) || this;
        // this._remoteViewDelegate = VideoViewDelegate.initWithOwner(new WeakRef(this));
        _this.remoteVideoView = TVIVideoView.alloc().init();
        _this.remoteVideoView.mirror = true;
        _this.remoteVideoView.contentMode = 2 /* ScaleAspectFill */;
        return _this;
    }
    RemoteVideo.prototype.createNativeView = function () {
        return this.remoteVideoView;
    };
    RemoteVideo.prototype.disposeNativeView = function () {
        this.nativeView = null;
    };
    Object.defineProperty(RemoteVideo.prototype, "ios", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    return RemoteVideo;
}(view_1.View));
exports.RemoteVideo = RemoteVideo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3RlVmlkZW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW1vdGVWaWRlby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFvQztBQVNwQztJQUFpQywrQkFBSTtJQU1qQztRQUFBLFlBQ0ksaUJBQU8sU0FNVjtRQUpHLGlGQUFpRjtRQUNqRixLQUFJLENBQUMsZUFBZSxHQUFHLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuRCxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEdBQUcsdUJBQWlDLENBQUM7O0lBQ3pFLENBQUM7SUFFTSxzQ0FBZ0IsR0FBdkI7UUFFSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUVoQyxDQUFDO0lBRU0sdUNBQWlCLEdBQXhCO1FBRUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFFM0IsQ0FBQztJQUdELHNCQUFJLDRCQUFHO2FBQVA7WUFFSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUUzQixDQUFDOzs7T0FBQTtJQUVMLGtCQUFDO0FBQUQsQ0FBQyxBQWxDRCxDQUFpQyxXQUFJLEdBa0NwQztBQWxDWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZpZXcgfSBmcm9tICd1aS9jb3JlL3ZpZXcnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdXRpbHMvdXRpbHNcIjtcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb21PYmplY3QgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZSc7XG5cbi8vIGltcG9ydCB7IFZpZGVvVmlld0RlbGVnYXRlIH0gZnJvbSAnLi9kZWxlZ2F0ZXMnO1xuXG5kZWNsYXJlIHZhciBUVklWaWRlb1ZpZXcsIENHUmVjdE1ha2U7XG5cblxuZXhwb3J0IGNsYXNzIFJlbW90ZVZpZGVvIGV4dGVuZHMgVmlldyB7XG5cbiAgICByZW1vdGVWaWRlb1ZpZXc6IGFueTtcbiAgICBfcmVtb3RlVmlld0RlbGVnYXRlOiBhbnk7XG4gICAgbmF0aXZlVmlldzogVUlWaWV3O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIFxuICAgICAgICAvLyB0aGlzLl9yZW1vdGVWaWV3RGVsZWdhdGUgPSBWaWRlb1ZpZXdEZWxlZ2F0ZS5pbml0V2l0aE93bmVyKG5ldyBXZWFrUmVmKHRoaXMpKTtcbiAgICAgICAgdGhpcy5yZW1vdGVWaWRlb1ZpZXcgPSBUVklWaWRlb1ZpZXcuYWxsb2MoKS5pbml0KCk7IFxuICAgICAgICB0aGlzLnJlbW90ZVZpZGVvVmlldy5taXJyb3IgPSB0cnVlOyAgIFxuICAgICAgICB0aGlzLnJlbW90ZVZpZGVvVmlldy5jb250ZW50TW9kZSA9IFVJVmlld0NvbnRlbnRNb2RlLlNjYWxlQXNwZWN0RmlsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlTmF0aXZlVmlldygpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdGVWaWRlb1ZpZXc7XG5cbiAgICB9ICAgIFxuXG4gICAgcHVibGljIGRpc3Bvc2VOYXRpdmVWaWV3KCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMubmF0aXZlVmlldyA9IG51bGw7XG5cbiAgICB9XG5cblxuICAgIGdldCBpb3MoKTogYW55IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uYXRpdmVWaWV3O1xuXG4gICAgfSAgXG5cbn0iXX0=