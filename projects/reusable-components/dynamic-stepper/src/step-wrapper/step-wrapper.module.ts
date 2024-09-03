import { NgModule } from '@angular/core';
import { RealsoftStepperGroupComponent } from './step-wrapper.component';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { StepContentComponent } from '../step-content/step-content.component';
import { StepLabelComponent } from '../step-label/step-label.component';
import { StepComponent } from '../step/step.component';
import { StepperNextDirective } from '../directives/stepper-next.directive';
import { StepperPreviousDirective } from '../directives/stepper-previous.directive';
import { StepperResetDirective } from '../directives/stepper-reset.directive';


@NgModule({
  declarations: [
    RealsoftStepperGroupComponent, 
    StepComponent, 
    StepContentComponent, 
    StepLabelComponent,
    StepperNextDirective,
    StepperPreviousDirective,
    StepperResetDirective
  ],
  imports: [
  CommonModule,
  MatStepperModule,
  ],
  exports: [
    RealsoftStepperGroupComponent,
    StepComponent, 
    StepContentComponent, 
    StepLabelComponent,
    StepperNextDirective,
    StepperPreviousDirective,
    StepperResetDirective
  ],
})
export class RealsoftDynamicStepperModule {}
