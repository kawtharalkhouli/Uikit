import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RealsoftTabGroupComponent } from './tab-wrapper.component';
import { RealsoftTabLabelComponent } from '../tab-label/tab-label.component';
import { RealsoftTabContentComponent } from '../tab-content/tab-content.component';
import { RealsoftTabComponent } from '../tab/tab.component';

@NgModule({
  declarations: [RealsoftTabGroupComponent, RealsoftTabLabelComponent, RealsoftTabContentComponent,RealsoftTabComponent],
  imports: [
  CommonModule,
  MatIconModule,
  MatTabsModule
  ],
  exports: [RealsoftTabGroupComponent, RealsoftTabLabelComponent, RealsoftTabContentComponent,RealsoftTabComponent],
})
export class RealsoftDynamicTabsModule {}