import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
    selector: '[minlength]',
    providers: [{ provide: NG_VALIDATORS, useExisting: MinLengthDirective, multi: true }]
})
export class MinLengthDirective implements Validator {
    @Input() minlength: string;
    public constructor() { }
    public validate(control: AbstractControl): { [key: string]: any } {
        return !control.value || control.value.length >= this.minlength ? null : { "minlength": true };
    }
}
@Directive({
    selector: '[email]',
    providers: [{ provide: NG_VALIDATORS, useExisting: IsEmailDirective, multi: true }]
})
export class IsEmailDirective implements Validator {
    public constructor() { }
    public validate(control: AbstractControl): { [key: string]: any } {
        let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        let valid = emailRegEx.test(control.value);
        return control.value < 1 || valid ? null : { 'email': true };
    }
}
@Directive({
    selector: '[alphanumeric]',
    providers: [{ provide: NG_VALIDATORS, useExisting: AlphaNumericOnlyDirective, multi: true }]
})
export class AlphaNumericOnlyDirective implements Validator {
    public constructor() { }
    public validate(control: AbstractControl): { [key: string]: any } {
        let inputRegEx = /^([a-zA-Z0-9\-_\s]+)$/;
        let valid = inputRegEx.test(control.value);
        return control.value < 1 || valid ? null : { 'alphanumeric': true };
    }
}
@Directive({
    selector: '[alphabets]',
    providers: [{ provide: NG_VALIDATORS, useExisting: AlphabetsOnlyDirective, multi: true }]
})
export class AlphabetsOnlyDirective implements Validator {
    public constructor() { }
    public validate(control: AbstractControl): { [key: string]: any } {
        let inputRegEx = /^([a-zA-Z\-_\s]+)$/;
        let valid = inputRegEx.test(control.value);
        return control.value < 1 || valid ? null : { 'alphabets': true };
    }

}