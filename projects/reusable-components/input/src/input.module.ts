import { NgModule } from '@angular/core';
import { CustomInputComponent } from './input.component';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomInputComponent],
  imports: [
  MatIconModule,
  CommonModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule, 
  ReactiveFormsModule
  ],
  exports: [CustomInputComponent],
})
export class InputModule {}
