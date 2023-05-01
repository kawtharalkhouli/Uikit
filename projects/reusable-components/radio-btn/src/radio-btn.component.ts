import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges,Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RADIO_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RealsoftRadioBtnComponent),
  multi: true,
};

@Component({
  selector: 'realsoft-radio-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-btn.component.html',
  encapsulation:ViewEncapsulation.None,
  providers: [RADIO_VALUE_ACCESSOR],
})
export class RealsoftRadioBtnComponent implements OnChanges, ControlValueAccessor{
//Inputs
@Input() option!: string;
@Input() value!:any;
@Input() checked!:boolean;
@Input() required!:boolean;
@Input() name!:string;

//Output Emitters
@Output() change: EventEmitter<any> = new EventEmitter();

//Variables
isDisabled: boolean=false;


// getBooleanProperty(value: any): boolean {
//   return value != null && value !== false;
// }

// @Input()
// get disabled(): boolean { return this.isDisabled;}
// set disabled(value) {
//   this.isDisabled = this.getBooleanProperty(value);
// }

constructor(private cdr: ChangeDetectorRef) { }

ngOnChanges(){ this.cdr.markForCheck();}

changeEvent(event:any){ this.change.emit(event) }

public onChange: Function = () => {};
public onTouched: Function = () => {};

writeValue(value: any): void {
  this.value = value;
  this.checked=value
  this.cdr.detectChanges();
}

registerOnChange(fn: any): void {
  this.onChange = fn;
}

registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

setDisabledState(isDisabled: boolean) {
  this.isDisabled = isDisabled;
  this.cdr.detectChanges();
}
onModelChange(value: any) {
  this.onTouched(value);
  this.onChange(value);
  this.cdr.markForCheck();
}

}
