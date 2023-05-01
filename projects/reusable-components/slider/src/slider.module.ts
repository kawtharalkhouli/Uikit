import { NgModule } from '@angular/core';
import { CustomSliderComponent } from './slider.component';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomSliderComponent],
  imports: [
  CommonModule,
  MatSliderModule,
  ReactiveFormsModule,
  FormsModule,
  ],
  exports: [CustomSliderComponent],
})
export class SliderModule {}
