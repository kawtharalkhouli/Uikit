import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { DataPropertyGetterPipe } from './pipes/data-property-getter.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClickOutsideDirective } from './directives/clickOutside.directive';
import { ClickStopPropagationDirective } from './directives/clickStopPropagation';
import { ButtonsDirective } from './directives/buttons.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { TableFiltersModule } from './table-filters/public-api';


@NgModule({
  declarations: [
  CustomTableComponent,
  DataPropertyGetterPipe,
  ClickOutsideDirective,
  ClickStopPropagationDirective,
  ButtonsDirective,
],
  imports: [
  CommonModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule,
  MatTableModule,
  DragDropModule,
  MatSortModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  FormsModule,
  ReactiveFormsModule,
  MatTooltipModule,
  MatMenuModule,
  TableFiltersModule
  ],
  exports: [CustomTableComponent,ButtonsDirective],
})
export class TableModule {}
