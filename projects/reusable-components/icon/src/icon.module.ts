import { NgModule } from '@angular/core';
import { CustomIconComponent } from './icon.component';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [CustomIconComponent],
  imports: [
  MatIconModule,
  CommonModule,
  MatTooltipModule,
  MatBadgeModule
  ],
  exports: [CustomIconComponent],
})
export class IconModule {}
