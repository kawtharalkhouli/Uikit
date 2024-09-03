import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges,ViewEncapsulation } from '@angular/core';

interface ButtonConfig{
  iconName?:string;
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
  @Input() value!:string;
  @Input() configurations: ButtonConfig | undefined;
  @Input() size : string = 'medium';
  @Input() style: string = 'primary';
  @Input() loading:boolean=false;
  
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges(){
   this.cdr.markForCheck();
  }

}