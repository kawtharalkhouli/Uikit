import { NgModule } from '@angular/core';
import { RealsoftWizardComponent } from './wizard.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RealsoftWizardComponent],
  imports: [
  CommonModule,
  MatIconModule,
  MatStepperModule,
  MatButtonModule
  ],
  exports: [RealsoftWizardComponent],
})
export class WizardModule {}
