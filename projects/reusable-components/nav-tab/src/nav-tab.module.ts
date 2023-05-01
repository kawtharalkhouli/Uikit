import { NgModule } from '@angular/core';
import { NavTabComponent } from './nav-tab.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavTabComponent],
  imports: [
  CommonModule,
  MatTabsModule,
  RouterModule
  ],
  exports: [NavTabComponent],
})
export class NavTabModule {}
