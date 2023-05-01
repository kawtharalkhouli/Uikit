import {ChangeDetectionStrategy,ChangeDetectorRef,Component,EventEmitter,Input,OnChanges,Output} from '@angular/core';
 
interface menuConfig{
  type?: string;
  triggerBtn?:string;
}

@Component({
  selector: 'realsoft-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./menu.component.html' 

})
export class RealsoftMenuComponent implements OnChanges{
  //Inputs
  @Input() data!:any;
  @Input() configurations:menuConfig | undefined;
  @Input() btnTxt!:string;
  @Input() icon!:string;
  //Output Emitters 
  @Output() click= new EventEmitter<any>();
  @Output() closed=new EventEmitter<any>();
  

  clickMenuItem(event : any){this.click.emit(event);}

   constructor(private cdr: ChangeDetectorRef) { }
   ngOnChanges(){
    this.cdr.markForCheck();
   }
   menuClosed(e:any){ 
    this.closed.emit(e)
   }

}
