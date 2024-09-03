import { NgModule } from '@angular/core';
import { RealsoftSkeletonComponent } from './skeleton.component';
import { CommonModule } from '@angular/common';
import { ThemeDirective } from './directives/theme.directive';

@NgModule({
  declarations: [RealsoftSkeletonComponent, ThemeDirective],
  imports: [
  CommonModule
  ],
  exports: [RealsoftSkeletonComponent, ThemeDirective],
})
export class RealsoftSkeletonModule {}
