import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFiltersComponent } from './table-filters.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
  TableFiltersComponent
],
  imports: [
  CommonModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  MatMenuModule,
  MatDatepickerModule
  ],
  exports: [TableFiltersComponent],
})
export class TableFiltersModule {}
