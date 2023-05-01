import { NgModule } from '@angular/core';
import { DatePickerInputComponent } from './date-picker-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DatePickerInputComponent],
  imports: [
  CommonModule,
  FormsModule, 
  ReactiveFormsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatChipsModule,
  MatIconModule
  ],
  exports: [DatePickerInputComponent],
})
export class DatePickerInputModule {}
