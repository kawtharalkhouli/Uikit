import { ChangeDetectionStrategy,ViewEncapsulation, ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';

interface IconConfig{
  matBadge?:any;
  matBadgeColor?:any;
  size?:string;
}
@Component({
  selector: 'custom-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./icon.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomIconComponent implements OnChanges {
    @Input() iconName!:string;
    @Input() matTooltip!:string | undefined;
    @Input() configurations:IconConfig|undefined;
    @Input() iconColor!: any | string;

    constructor(private cdr: ChangeDetectorRef) { }
    ngOnChanges(){
     this.cdr.markForCheck();
    }
 
}
