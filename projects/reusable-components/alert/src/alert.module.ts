import { NgModule } from '@angular/core';
import { CustomAlertComponent } from './alert.component';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CustomAlertComponent],
  imports: [
  MatIconModule,
  CommonModule
  ],
  exports: [CustomAlertComponent],
})
export class AlertModule {}
