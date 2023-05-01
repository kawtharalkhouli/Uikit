import { NgModule } from '@angular/core';
import { RealsoftToggleBtnComponent } from './toggle-button.component';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RealsoftToggleBtnComponent],
  imports: [
  CommonModule,
  MatSlideToggleModule,
  FormsModule, 
  ReactiveFormsModule
  ],
  exports: [RealsoftToggleBtnComponent],
})
export class ToggleButtonModule {}
