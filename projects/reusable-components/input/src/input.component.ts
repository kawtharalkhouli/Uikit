import { Component, Input,  forwardRef, OnChanges, ChangeDetectorRef, ViewEncapsulation, Output, EventEmitter, ViewChild, AfterViewInit, OnInit, Inject, Injector, ViewChildren, QueryList, ContentChildren} from '@angular/core';
import { AbstractControl, ControlValueAccessor,  NG_VALIDATORS,  NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';

interface inputConfig{
fieldType?:string;
icon?: string;
min?:any;
max?:any;
maxlength?:number;
secondIcon?:string;
firstIcon?:string;
suffixIcon?:string;
largeFloatingLabel?:boolean;
smallFloatingLabel?:boolean;
mediumFloatingLabel?:boolean;
}
//Define providers here to prevent circular dependency
export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomInputComponent),
  multi: true,
};

export const VALIDATOR: any = {
  provide: NG_VALIDATORS, useExisting: forwardRef(() => CustomInputComponent),
  multi: true
};
@Component({
  selector: 'custom-input',
  templateUrl: './input.component.html',
  providers: [VALUE_ACCESSOR,VALIDATOR],
  encapsulation:ViewEncapsulation.None,
})

export class CustomInputComponent implements OnChanges,ControlValueAccessor,Validator{
//Input Attributes
@Input() label!:string;//label of the input field
@Input() placeholder: string = '';//placeholder of the input field
@Input() type: 'text' | 'email' | 'password' | 'number'| 'search' | 'date' | 'color' | 'datetime-local' | 'month' | 'tel' | 'time' | 'url' | 'week' = 'text';//type of the input field by default set to text
@Input() firstIconTooltip!:string;//The tooltip of the first icon if needed
@Input() secondIconTooltip!:string;//The tooltip of the second icon if needed
@Input() iconTooltip!:string;//The tooltip of the input field with a single icon if needed
@Input() configurations:inputConfig|undefined;//Additional attributes
@Input() required:boolean=false;//If the field is required and not being used with reactive forms
@Input() hidden!:boolean;//To hide the second icon if need be
@Input() appearance!:string;
@Input() size!:string;
@Input() autocomplete!:string;
@Input() minlength!:number;
@Input() maxlength!:number;



//Output Emitters
@Output() click : EventEmitter<any> =new EventEmitter<any>();
@Output() firstIconClick : EventEmitter<any> =new EventEmitter<any>();
@Output() secondIconClick : EventEmitter<any> =new EventEmitter<any>();
@Output() keyUp: EventEmitter<any> =new EventEmitter<any>();
@Output() search: EventEmitter<any> =new EventEmitter<any>();
@Output() inputSearch : EventEmitter<any> =new EventEmitter<any>();
@Output() blur: EventEmitter<any> = new EventEmitter<any>();
@Output() focus: EventEmitter<any> = new EventEmitter<any>();



//Variables
hidePassword: Boolean = true;
isDisabled: boolean=false;
isRequired:boolean=false;
invalid:boolean=false;

constructor(private cdr: ChangeDetectorRef) {
}


//Implementing Validator Interface
//Perform synchronized validation against the provided control
validate(c: AbstractControl): ValidationErrors {
  const validators: ValidatorFn[] = [];
  if(c.errors){
    if(c.errors['required'])
    {
      this.isRequired=true
    }
    if(!c.errors['required'])
    {
      this.invalid=true
    }
  }
  return validators;
}
//Callback called whenever the Validator input changes
registerOnValidatorChange(fn: () => void): void { 
  this.onChange = fn;
  this.onTouched=fn;
}

ngOnChanges() {
this.cdr.markForCheck();}

// maxLength(m){
//   if(this.type === 'number'){
//     if (this.value.length > m) this.value = this.value.slice(0, m);
//   }
    
// }

//Events to be emitted
onClick(event: any) {this.click.emit(event);}
//Click of the first icon in the input field
firsttIconClick(event: any) {this.firstIconClick.emit(event);}
//Click of the second icon in the input field
seconddIconClick(event: any) {this.secondIconClick.emit(event);}
//Key Up event
onKey(event:any){this.keyUp.emit(event);}
//Key Up Enter Event
enterEvent(event:any){this.inputSearch.emit(event);}
//Search Event
searchEvent(event:any){this.search.emit(event)}

getBooleanProperty(value: any): boolean {
  return value != null && value !== false;
}
hidePass() {this.hidePassword = !this.hidePassword;}

@Input()
get disabled(): boolean { return this.isDisabled; }
set disabled(value) {
  this.isDisabled = this.getBooleanProperty(value);
}

value: any;
onChange = (value:any) => {};
onTouched = () => {};
//A new value is written to the form control on each update
writeValue(value: any): void {
  this.value = value;
  this.cdr.markForCheck();
}
//Whenever the control value changes in the UI
registerOnChange(fn: (value: any) => void): void {
this.onChange = (value: any, options?: { triggerChangeDetection: boolean }) => {
fn(value);
  if (options && options.triggerChangeDetection) {
  this.cdr.detectChanges();
    }
  };
}
//For validation purposes and to mark the control as touched
registerOnTouched(fn: any): void {
  this.onTouched = fn;
}
//For enabling or disabling the control
setDisabledState(isDisabled: boolean) {
  this.isDisabled = isDisabled;
  this.cdr.markForCheck();
}
//Blur Event 
markAsTouched(e:any): void {
  this.onTouched();
  this.blur.emit(e)
}
focusEvent(e:any){
this.focus.emit(e);
}

}
