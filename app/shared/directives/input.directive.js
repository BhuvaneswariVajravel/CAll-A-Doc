"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var MinLengthDirective = MinLengthDirective_1 = (function () {
    function MinLengthDirective() {
    }
    MinLengthDirective.prototype.validate = function (control) {
        return !control.value || control.value.length >= this.minlength ? null : { "minlength": true };
    };
    return MinLengthDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MinLengthDirective.prototype, "minlength", void 0);
MinLengthDirective = MinLengthDirective_1 = __decorate([
    core_1.Directive({
        selector: '[minlength]',
        providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: MinLengthDirective_1, multi: true }]
    }),
    __metadata("design:paramtypes", [])
], MinLengthDirective);
exports.MinLengthDirective = MinLengthDirective;
var IsEmailDirective = IsEmailDirective_1 = (function () {
    function IsEmailDirective() {
    }
    IsEmailDirective.prototype.validate = function (control) {
        var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        var valid = emailRegEx.test(control.value);
        return control.value < 1 || valid ? null : { 'email': true };
    };
    return IsEmailDirective;
}());
IsEmailDirective = IsEmailDirective_1 = __decorate([
    core_1.Directive({
        selector: '[email]',
        providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: IsEmailDirective_1, multi: true }]
    }),
    __metadata("design:paramtypes", [])
], IsEmailDirective);
exports.IsEmailDirective = IsEmailDirective;
var AlphaNumericOnlyDirective = AlphaNumericOnlyDirective_1 = (function () {
    function AlphaNumericOnlyDirective() {
    }
    AlphaNumericOnlyDirective.prototype.validate = function (control) {
        var inputRegEx = /^([a-zA-Z0-9\-_\s]+)$/;
        var valid = inputRegEx.test(control.value);
        return control.value < 1 || valid ? null : { 'alphanumeric': true };
    };
    return AlphaNumericOnlyDirective;
}());
AlphaNumericOnlyDirective = AlphaNumericOnlyDirective_1 = __decorate([
    core_1.Directive({
        selector: '[alphanumeric]',
        providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: AlphaNumericOnlyDirective_1, multi: true }]
    }),
    __metadata("design:paramtypes", [])
], AlphaNumericOnlyDirective);
exports.AlphaNumericOnlyDirective = AlphaNumericOnlyDirective;
var AlphabetsOnlyDirective = AlphabetsOnlyDirective_1 = (function () {
    function AlphabetsOnlyDirective() {
    }
    AlphabetsOnlyDirective.prototype.validate = function (control) {
        var inputRegEx = /^([a-zA-Z\-_\s]+)$/;
        var valid = inputRegEx.test(control.value);
        return control.value < 1 || valid ? null : { 'alphabets': true };
    };
    return AlphabetsOnlyDirective;
}());
AlphabetsOnlyDirective = AlphabetsOnlyDirective_1 = __decorate([
    core_1.Directive({
        selector: '[alphabets]',
        providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: AlphabetsOnlyDirective_1, multi: true }]
    }),
    __metadata("design:paramtypes", [])
], AlphabetsOnlyDirective);
exports.AlphabetsOnlyDirective = AlphabetsOnlyDirective;
var MinLengthDirective_1, IsEmailDirective_1, AlphaNumericOnlyDirective_1, AlphabetsOnlyDirective_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5wdXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWlEO0FBQ2pELHdDQUEyRTtBQU0zRSxJQUFhLGtCQUFrQjtJQUUzQjtJQUF1QixDQUFDO0lBQ2pCLHFDQUFRLEdBQWYsVUFBZ0IsT0FBd0I7UUFDcEMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNuRyxDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQUxZO0lBQVIsWUFBSyxFQUFFOztxREFBbUI7QUFEbEIsa0JBQWtCO0lBSjlCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsYUFBYTtRQUN2QixTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBYSxFQUFFLFdBQVcsRUFBRSxvQkFBa0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDeEYsQ0FBQzs7R0FDVyxrQkFBa0IsQ0FNOUI7QUFOWSxnREFBa0I7QUFXL0IsSUFBYSxnQkFBZ0I7SUFDekI7SUFBdUIsQ0FBQztJQUNqQixtQ0FBUSxHQUFmLFVBQWdCLE9BQXdCO1FBQ3BDLElBQUksVUFBVSxHQUFHLHlKQUF5SixDQUFDO1FBQzNLLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUFksZ0JBQWdCO0lBSjVCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsU0FBUztRQUNuQixTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBYSxFQUFFLFdBQVcsRUFBRSxrQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDdEYsQ0FBQzs7R0FDVyxnQkFBZ0IsQ0FPNUI7QUFQWSw0Q0FBZ0I7QUFZN0IsSUFBYSx5QkFBeUI7SUFDbEM7SUFBdUIsQ0FBQztJQUNqQiw0Q0FBUSxHQUFmLFVBQWdCLE9BQXdCO1FBQ3BDLElBQUksVUFBVSxHQUFHLHVCQUF1QixDQUFDO1FBQ3pDLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3hFLENBQUM7SUFDTCxnQ0FBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUFkseUJBQXlCO0lBSnJDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFhLEVBQUUsV0FBVyxFQUFFLDJCQUF5QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUMvRixDQUFDOztHQUNXLHlCQUF5QixDQU9yQztBQVBZLDhEQUF5QjtBQVl0QyxJQUFhLHNCQUFzQjtJQUMvQjtJQUF1QixDQUFDO0lBQ2pCLHlDQUFRLEdBQWYsVUFBZ0IsT0FBd0I7UUFDcEMsSUFBSSxVQUFVLEdBQUcsb0JBQW9CLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDckUsQ0FBQztJQUVMLDZCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSxzQkFBc0I7SUFKbEMsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFhLEVBQUUsV0FBVyxFQUFFLHdCQUFzQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUM1RixDQUFDOztHQUNXLHNCQUFzQixDQVFsQztBQVJZLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRvciwgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1ttaW5sZW5ndGhdJyxcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBNaW5MZW5ndGhEaXJlY3RpdmUsIG11bHRpOiB0cnVlIH1dXG59KVxuZXhwb3J0IGNsYXNzIE1pbkxlbmd0aERpcmVjdGl2ZSBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gICAgQElucHV0KCkgbWlubGVuZ3RoOiBzdHJpbmc7XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkgeyB9XG4gICAgcHVibGljIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgICAgICByZXR1cm4gIWNvbnRyb2wudmFsdWUgfHwgY29udHJvbC52YWx1ZS5sZW5ndGggPj0gdGhpcy5taW5sZW5ndGggPyBudWxsIDogeyBcIm1pbmxlbmd0aFwiOiB0cnVlIH07XG4gICAgfVxufVxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbZW1haWxdJyxcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBJc0VtYWlsRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZSB9XVxufSlcbmV4cG9ydCBjbGFzcyBJc0VtYWlsRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7IH1cbiAgICBwdWJsaWMgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgICAgIGxldCBlbWFpbFJlZ0V4ID0gL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC9pO1xuICAgICAgICBsZXQgdmFsaWQgPSBlbWFpbFJlZ0V4LnRlc3QoY29udHJvbC52YWx1ZSk7XG4gICAgICAgIHJldHVybiBjb250cm9sLnZhbHVlIDwgMSB8fCB2YWxpZCA/IG51bGwgOiB7ICdlbWFpbCc6IHRydWUgfTtcbiAgICB9XG59XG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1thbHBoYW51bWVyaWNdJyxcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBBbHBoYU51bWVyaWNPbmx5RGlyZWN0aXZlLCBtdWx0aTogdHJ1ZSB9XVxufSlcbmV4cG9ydCBjbGFzcyBBbHBoYU51bWVyaWNPbmx5RGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7IH1cbiAgICBwdWJsaWMgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgICAgIGxldCBpbnB1dFJlZ0V4ID0gL14oW2EtekEtWjAtOVxcLV9cXHNdKykkLztcbiAgICAgICAgbGV0IHZhbGlkID0gaW5wdXRSZWdFeC50ZXN0KGNvbnRyb2wudmFsdWUpO1xuICAgICAgICByZXR1cm4gY29udHJvbC52YWx1ZSA8IDEgfHwgdmFsaWQgPyBudWxsIDogeyAnYWxwaGFudW1lcmljJzogdHJ1ZSB9O1xuICAgIH1cbn1cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2FscGhhYmV0c10nLFxuICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IEFscGhhYmV0c09ubHlEaXJlY3RpdmUsIG11bHRpOiB0cnVlIH1dXG59KVxuZXhwb3J0IGNsYXNzIEFscGhhYmV0c09ubHlEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHsgfVxuICAgIHB1YmxpYyB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICAgICAgbGV0IGlucHV0UmVnRXggPSAvXihbYS16QS1aXFwtX1xcc10rKSQvO1xuICAgICAgICBsZXQgdmFsaWQgPSBpbnB1dFJlZ0V4LnRlc3QoY29udHJvbC52YWx1ZSk7XG4gICAgICAgIHJldHVybiBjb250cm9sLnZhbHVlIDwgMSB8fCB2YWxpZCA/IG51bGwgOiB7ICdhbHBoYWJldHMnOiB0cnVlIH07XG4gICAgfVxuXG59Il19