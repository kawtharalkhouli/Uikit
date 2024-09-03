import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { SkeletonAnimation, SkeletonAppearance } from './helpers/models';


@Component({
  selector: 'realsoft-skeleton',
  templateUrl:'./skeleton.component.html',
  styleUrls: ['skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealsoftSkeletonComponent implements OnChanges{

  constructor(private cdr: ChangeDetectorRef){}

  ngOnChanges() {
    this.cdr.detectChanges()
    this.cdr.markForCheck()
  }

  @Input() count: number = 1;
  @Input() animation: SkeletonAnimation = this.skeletonAnimation.progress;
  @Input() appearance: SkeletonAppearance = this.skeletonappearance.line;
  @Input() theme: {} = {};

  repeat(length: number): any {
    if (length >= 0) {
      return new Array(length);
    }
  }

  get skeletonappearance() {
    return SkeletonAppearance;
  }

  get skeletonAnimation(){
    return SkeletonAnimation;
  }
  
}