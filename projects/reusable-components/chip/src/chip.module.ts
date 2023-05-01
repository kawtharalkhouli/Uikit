import { NgModule } from '@angular/core';
import { CustomChipComponent } from './chip.component';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CustomChipComponent],
  imports: [
  MatIconModule,
  CommonModule
  ],
  exports: [CustomChipComponent],
})
export class ChipModule {}
