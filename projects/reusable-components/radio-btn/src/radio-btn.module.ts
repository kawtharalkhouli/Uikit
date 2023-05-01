import { NgModule } from '@angular/core';
import { RealsoftRadioBtnComponent } from './radio-btn.component';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RealsoftRadioBtnComponent],
  imports: [
  CommonModule,
  MatRadioModule,
  FormsModule, 
  ReactiveFormsModule
  ],
  exports: [RealsoftRadioBtnComponent],
})
export class RadioBtnModule {}
