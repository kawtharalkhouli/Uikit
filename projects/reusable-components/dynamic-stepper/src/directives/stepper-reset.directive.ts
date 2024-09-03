import { Directive, HostListener } from '@angular/core';
import { RealsoftStepperGroupComponent } from '../step-wrapper/step-wrapper.component';

@Directive({
  selector: 'button[realsoftStepperReset]'
})
export class StepperResetDirective {

  constructor(private _stepper: RealsoftStepperGroupComponent) { }

  @HostListener('click')
  onClick() {
    this._stepper.reset();
  }

}
