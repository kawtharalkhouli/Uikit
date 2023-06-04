import { NgModule } from '@angular/core';
import { NavTabComponent } from './nav-tab.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NavTabComponent],
  imports: [
  CommonModule,
  MatTabsModule,
  RouterModule,
  MatIconModule
  ],
  exports: [NavTabComponent],
})
export class NavTabModule {}
