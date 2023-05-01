import { NgModule } from '@angular/core';
import { RealsoftCheckboxComponent } from './checkbox.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RealsoftCheckboxComponent],
  imports: [
  CommonModule,
  MatCheckboxModule,
  FormsModule, 
  ReactiveFormsModule
  ],
  exports: [RealsoftCheckboxComponent],
})
export class CheckboxModule {}
