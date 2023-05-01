import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSelectionComponent } from './table-selection.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [TableSelectionComponent],
  imports: [
  CommonModule,
  MatCheckboxModule,
  MatTableModule
  ],
  exports: [TableSelectionComponent],
})
export class TableSelectionModule {}
