import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor,FormBuilder,NG_VALIDATORS,NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

interface textAreaConfig{
  rows?:number;
  cols?:number;
  maxlength?:number;
  name?:string;
}
export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomTextAreaComponent),
  multi: true,
};

export const VALIDATOR: any = {
  provide: NG_VALIDATORS, useExisting: forwardRef(() => CustomTextAreaComponent),
  multi: true
};

@Component({
  selector: 'custom-text-area',
  templateUrl:'./textarea.component.html' ,
  providers: [VALUE_ACCESSOR,VALIDATOR],
  encapsulation:ViewEncapsulation.None
})
export class CustomTextAreaComponent implements OnChanges, ControlValueAccessor,Validator{
//Inputs
@Input() label:string ='';//The floating label of the text area
@Input() placeholder: string = '';//The placeholder of the text area
@Input() value!:any | undefined;//Previously written value when not using reactive forms
@Input() configurations:textAreaConfig|undefined;
@Input() required!:boolean;//Whether the control is required
@Input() appearance!:string

//Variables
writtenValue: any='';
isDisabled: boolean=false;
isRequired:boolean=false;


constructor(private cdr: ChangeDetectorRef) {}

onChange = (value:any) => {};
onTouched = () => {};

validate(c: AbstractControl): ValidationErrors {
  const validators: ValidatorFn[] = [];
  if(c.errors)
  this.isRequired=true
  return validators;
}

registerOnValidatorChange(fn: () => void): void { 
  this.onChange = fn;
  this.onTouched=fn;
}
getBooleanProperty(value: any): boolean {
  return value != null && value !== false;
}

@Input()
get disabled(): boolean { return this.isDisabled; }
set disabled(value) {
  this.isDisabled = this.getBooleanProperty(value);
}

ngOnChanges() { 
if(this.value){
  this.writtenValue=this.value
}
this.cdr.markForCheck();} 

setDisabledState(isDisabled: boolean) {
  this.isDisabled = isDisabled;
  this.cdr.markForCheck();
}

writeValue(value: any, options?: { triggerChangeDetection: boolean }): void {
  this.writtenValue = value;
  if (options && options.triggerChangeDetection) {
    this.cdr.detectChanges();
}} 

registerOnChange(fn: (value: any) => void): void {
this.onChange = (value: any, options?: { triggerChangeDetection: boolean }) => {
fn(value);
  if (options && options.triggerChangeDetection) {
      this.cdr.detectChanges();
    }
  };
}

registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

markAsTouched(): void {
  this.onTouched();
}

}
