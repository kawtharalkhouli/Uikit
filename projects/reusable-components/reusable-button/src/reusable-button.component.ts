import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges,ViewEncapsulation } from '@angular/core';

interface buttonConfig{
  style?:string;
  iconName?:string;
  size?:string;
  type?:string;
  arialabel?:string;
  routerLink?:any;
}
@Component({
  selector: 'realsoft-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./reusable-button.component.html',
  encapsulation:ViewEncapsulation.None
})
export class ReusableButtonComponent implements OnChanges {
  @Input() disabled!:boolean;
  @Input() buttonTxt!:string;
  @Input() configurations: buttonConfig | undefined;
  @Input() size : string = 'medium';
  @Input() style: string = 'primary';
  @Input() loading:boolean=false;
  
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges(){
   this.cdr.markForCheck();
  }

}