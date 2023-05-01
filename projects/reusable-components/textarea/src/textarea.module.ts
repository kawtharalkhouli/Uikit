import { NgModule } from '@angular/core';
import { CustomTextAreaComponent } from './textarea.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CustomTextAreaComponent],
  imports: [
  CommonModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule, 
  ReactiveFormsModule
  ],
  exports: [CustomTextAreaComponent],
})
export class TextAreaModule {}
