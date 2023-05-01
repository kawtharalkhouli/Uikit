import { NgModule } from '@angular/core';
import { RealsoftWizardComponent } from './wizard.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RealsoftWizardComponent],
  imports: [
  CommonModule,
  MatIconModule
  ],
  exports: [RealsoftWizardComponent],
})
export class WizardModule {}
