import { NgModule } from '@angular/core';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RichTextEditorComponent],
  imports: [
  CommonModule,
  FormsModule, 
  ReactiveFormsModule,
  ],
  exports: [RichTextEditorComponent],
})
export class RichTextAreaModule {}

