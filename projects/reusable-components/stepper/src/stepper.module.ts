import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper.component';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [StepperComponent],
  imports: [
  CommonModule,
  MatStepperModule
  ],
  exports: [StepperComponent],
})
export class StepperModule {}
