import { NgModule } from '@angular/core';
import { MultiSelectComponent } from './select.component';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule,FormsModule }   from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [MultiSelectComponent],
  imports: [
  MatIconModule,
  CommonModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatChipsModule,
  MatInputModule,
  MatSelectModule,
  ReactiveFormsModule,
  FormsModule,
  MatTooltipModule
  ],
  exports: [MultiSelectComponent],
})
export class SelectModule {}
