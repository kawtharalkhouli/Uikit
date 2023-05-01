import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SegmentComponent } from './segment.component';

@NgModule({
  declarations: [SegmentComponent],
  imports: [
  CommonModule,
  FormsModule, 
  ReactiveFormsModule,
  MatButtonToggleModule
  ],
  exports: [SegmentComponent],
})
export class SegmentModule {}
