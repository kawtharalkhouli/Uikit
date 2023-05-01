import { NgModule } from '@angular/core';
import { CustomButtonComponent } from './button.component';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CustomButtonComponent],
  imports: [
  MatButtonModule,
  MatIconModule,
  CommonModule
  ],
  exports: [CustomButtonComponent],
})
export class ButtonModule {}
