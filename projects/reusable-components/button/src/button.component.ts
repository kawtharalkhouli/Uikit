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
  selector: 'custom-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./button.component.html',
  encapsulation:ViewEncapsulation.None
})
export class CustomButtonComponent implements OnChanges {
  @Input() disabled!:boolean;
  @Input() buttonTxt!:string;
  @Input() configurations: buttonConfig | undefined

  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges(){
   this.cdr.markForCheck();
  }

}