import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DataPropertyGetterPipe } from './pipes/data-property-getter.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TransferrableDataTables } from './transferrable-data-tables.component';


@NgModule({
  declarations: [
  TransferrableDataTables,
  DataPropertyGetterPipe,
],
  imports: [
  CommonModule,
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatTableModule,
  MatCheckboxModule,
  ],
  exports: [TransferrableDataTables],
})
export class TransferrableDataTablesModule {}
