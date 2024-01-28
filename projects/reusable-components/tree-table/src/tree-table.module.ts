import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeTableComponent } from './tree-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { DataPropertyGetterPipe } from './pipes/data-property-getter.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonsDirective } from './directives/buttons.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';


@NgModule({
  declarations: [
  TreeTableComponent,
  DataPropertyGetterPipe,
  ButtonsDirective,
],
  imports: [
  CommonModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTableModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  FormsModule,
  ReactiveFormsModule,
  MatTreeModule
  ],
  exports: [TreeTableComponent,ButtonsDirective],
})
export class TreeTableModule {}
