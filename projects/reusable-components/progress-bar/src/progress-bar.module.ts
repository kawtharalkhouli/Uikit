import { NgModule } from '@angular/core';
import { CustomProgressBarComponent } from './progress-bar.component';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CustomProgressBarComponent],
  imports: [
  MatIconModule,
  CommonModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatFormFieldModule
  ],
  exports: [CustomProgressBarComponent],
})
export class ProgressBarModule {}
