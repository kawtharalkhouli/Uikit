import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges,Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface data{
    id?:any;
    label:string;
    labelAr?:string;
    value?:any;
    checked?:boolean;
    name?:string;
  }
  
@Component({
  selector: 'realsoft-segment',
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
@Input() style !:string;
@Input() lang: string = 'en';

isDisabled!: boolean;
selectedOption!: string;

getBooleanProperty(value: any): boolean {
  return value != null && value !== false;
}

@Input()
get disabled(): boolean { return this.isDisabled; }
set disabled(value) {
  this.isDisabled = this.getBooleanProperty(value);
}

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
this.value = value;
this.selectedOption=value;
this.cdr.markForCheck();
} 

registerOnChange(fn:any): void {
this.onChange =fn;
}

registerOnTouched(fn: any): void {
this.onTouched = fn;
}

markAsTouched(): void {
this.onTouched();
}
setDisabledState(isDisabled: boolean): void {
  this.isDisabled = isDisabled;
}

  
selectOption(option : any): void {
  this.selectedOption = option;
  this.onChange(option);
  this.selectionChange.emit(option);
  this.onTouched();
}

}
