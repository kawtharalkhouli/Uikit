import { NgModule } from '@angular/core';
import { ReusableButtonComponent } from './reusable-button.component';
import { MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ReusableButtonComponent],
  imports: [
  MatButtonModule,
  CommonModule,
  MatProgressSpinnerModule,
  MatIconModule
  ],
  exports: [ReusableButtonComponent],
})
export class ReusableButtonModule {}
