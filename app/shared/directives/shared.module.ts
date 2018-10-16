import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MinLengthDirective, IsEmailDirective, AlphaNumericOnlyDirective, AlphabetsOnlyDirective } from "./input.directive";

@NgModule({
  exports: [MinLengthDirective, IsEmailDirective, AlphaNumericOnlyDirective, AlphabetsOnlyDirective],
  declarations: [MinLengthDirective, IsEmailDirective, AlphaNumericOnlyDirective, AlphabetsOnlyDirective],
  schemas: [NO_ERRORS_SCHEMA],

})
export class SharedModule { }
