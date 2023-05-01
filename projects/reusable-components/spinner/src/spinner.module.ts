import { NgModule } from '@angular/core';
import { CustomSpinnerComponent } from './spinner.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [CustomSpinnerComponent],
  imports: [
  CommonModule,
  MatProgressSpinnerModule
  ],
  exports: [CustomSpinnerComponent],
})
export class SpinnerModule {}
