import { NgModule } from '@angular/core';
import { RealsoftTabsComponent } from './tabs.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [RealsoftTabsComponent],
  imports: [
  CommonModule,
  MatTabsModule
  ],
  exports: [RealsoftTabsComponent],
})
export class TabsModule {}
