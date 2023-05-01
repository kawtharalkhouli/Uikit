import { NgModule } from '@angular/core';
import { RealsoftTreeMenuComponent } from './tree-menu.component';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RealsoftTreeMenuComponent],
  imports: [
  CommonModule,
  MatTreeModule,
  MatButtonModule,
  MatIconModule
  ],
  exports: [RealsoftTreeMenuComponent],
})
export class TreeMenuModule {}
