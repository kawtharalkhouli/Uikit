
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';

interface AlertConfig{
  closable?:boolean;
  alertType?:string;
}

interface StyleConfiguration{
  border?: string;
  background?: string;
  color?: string;
  iconColor? : string;
}

@Component({
  selector:'custom-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./alert.component.html' ,
})
export class CustomAlertComponent implements OnChanges {
  @Input() alertMsg!:string;
  @Input() configurations!:AlertConfig | undefined;
  @Input() alertHeader!:string;
  @Input() styleConfigurations!: StyleConfiguration | {};
  hide:boolean=false;
  alertIcon!:string;
  
  hideAlert(){
   this.hide=!this.hide
  }

  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges(){
  this.iconType();
  this.cdr.markForCheck();
  }


  iconType(){
    if(this.configurations?.alertType === 'danger')
    this.alertIcon = 'dangerous'
    else if (this.configurations?.alertType === 'warning')
    this.alertIcon= 'warning'
    else if (this.configurations?.alertType === 'success')
    this.alertIcon = 'check_circle'
    else
    this.alertIcon= 'info'
  }
}