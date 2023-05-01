import { NgModule } from '@angular/core';
import { OrgChartComponent } from './org-chart.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OrgChartComponent],
  imports: [
  CommonModule,
  ],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
