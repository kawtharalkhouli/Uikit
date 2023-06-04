import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges,Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface data{
    id?:any;
    value?:any;
    checked?:boolean;
    name?:string;
  }
  
@Component({
  selector: 'realsoft-segment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segment.component.html',
  encapsulation:ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SegmentComponent),
    multi: true,
  }],
})
export class SegmentComponent implements OnChanges, ControlValueAccessor{
//Inputs
@Input() appearance!:any;
@Input() multiple!:boolean;
@Input() vertical!:boolean;
@Input() value!:any;
@Input() data!:data[];
@Input() chosenField!:string;

//Outputs
@Output() change: EventEmitter<any> = new EventEmitter<any>();
@Output() selectionChange: EventEmitter<any> =new EventEmitter<any>();

groupChange(e:any){ 
this.change.emit(e)
}
buttonChange(e:any){ 
this.selectionChange.emit(e)
}

constructor(private cdr: ChangeDetectorRef) { }

ngOnChanges(){
this.cdr.markForCheck();
}

onChange = (value:any) => {};
onTouched = () => {};

writeValue(value: any): void {
this.value = value;} 

registerOnChange(fn:any): void {
this.onChange =fn;
}

registerOnTouched(fn: any): void {
this.onTouched = fn;
}

markAsTouched(): void {
this.onTouched();
}

}
