import { Directive, HostListener } from '@angular/core';
import { RealsoftStepperGroupComponent } from '../step-wrapper/step-wrapper.component';

@Directive({
  selector: 'button[realsoftStepperNext]',
})
export class StepperNextDirective{
  constructor(private _stepper: RealsoftStepperGroupComponent) { }

  @HostListener('click')
  onClick() {
    this._stepper.next();
  }


}