import { NgModule } from '@angular/core';
import { RealsoftDialogComponent } from './dialog.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [RealsoftDialogComponent],
  imports: [
  CommonModule,
  MatIconModule
  ],
  exports: [RealsoftDialogComponent],
})
export class DialogModule {}
