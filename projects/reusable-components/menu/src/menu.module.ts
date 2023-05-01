import { NgModule } from '@angular/core';
import { RealsoftMenuComponent } from './menu.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [RealsoftMenuComponent],
  imports: [
  CommonModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule
  ],
  exports: [RealsoftMenuComponent],
})
export class MenuModule {}
