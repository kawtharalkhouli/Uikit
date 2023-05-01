import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { SelectionListComponent } from './selection-list.component'

@NgModule({
  declarations: [SelectionListComponent],
  imports: [
  MatListModule,
  CommonModule,
  ],
  exports: [SelectionListComponent],
})
export class SelectionListModule {}
