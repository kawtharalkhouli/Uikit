import { NgModule } from '@angular/core';
import { RealsoftExpansionPanelComponent } from './expansion-panel.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@NgModule({
  declarations: [RealsoftExpansionPanelComponent],
  imports: [
  CommonModule,
  MatExpansionModule,
  CdkAccordionModule
  ],
  exports: [RealsoftExpansionPanelComponent],
})
export class ExpansionPanelModule {}
