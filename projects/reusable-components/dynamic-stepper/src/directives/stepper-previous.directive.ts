import { CdkStep, CdkStepper, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive, HostListener } from '@angular/core';
import { RealsoftStepperGroupComponent } from '../step-wrapper/step-wrapper.component';

@Directive({
  selector: 'button[realsoftStepperPrevious]',
})
export class StepperPreviousDirective{
  constructor(private _stepper: RealsoftStepperGroupComponent) { }

  @HostListener('click')
  onClick() {
    this._stepper.previous();
  }
}

