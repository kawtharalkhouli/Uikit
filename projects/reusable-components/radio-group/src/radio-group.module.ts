import { NgModule } from '@angular/core';
import { RadioGroupComponent } from './radio-group.component';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RadioGroupComponent],
  imports: [
  CommonModule,
  MatRadioModule,
  FormsModule, 
  ReactiveFormsModule
  ],
  exports: [RadioGroupComponent],
})
export class RadioGroupModule {}
