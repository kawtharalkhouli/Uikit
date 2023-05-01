import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
  
  export const VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerInputComponent),
    multi: true,
  };
  
  export const VALIDATOR: any = {
    provide: NG_VALIDATORS, useExisting: forwardRef(() => DatePickerInputComponent),
    multi: true
  };

@Component({
  selector: 'realsoft-date-picker-input',
  templateUrl:'./date-picker-input.component.html' ,
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    VALUE_ACCESSOR,VALIDATOR
  ],
  encapsulation:ViewEncapsulation.None

})
export class DatePickerInputComponent implements OnChanges, ControlValueAccessor, Validator {
//Input Attributes
@Input() label!:string;//label of the input field
@Input() placeholder: string = '';//placeholder of the input field
@Input() required:boolean=false;//If the field is required and not being used with reactive forms
@Input() multi!:boolean;
@Input() appearance!:string;
@Input() model!:any[];
@Input() startView:any="month";
@Input() startAt:any;
@Input() min!:any;
@Input() max!:any;
@Input() readonly!:boolean;

@Output() change: EventEmitter<any> =new EventEmitter<any>();

@ViewChild('picker', { static: true }) _picker!: MatDatepicker<Date>;

//Variables
isDisabled: boolean=false;
isRequired:boolean=false;
value: any;
CLOSE_ON_SELECTED = false;
resetModel = new Date(0);

constructor(private cdr: ChangeDetectorRef) {}
//Implementing Validator Interface
//Perform synchronized validation against the provided control
validate(c: AbstractControl): ValidationErrors {
  const validators: ValidatorFn[] = [];
  if(c.errors)
  this.isRequired=true
  return validators;
}
//Callback called whenever the Validator input changes
registerOnValidatorChange(fn: () => void): void { 
  this.onChange = fn;
  this.onTouched=fn;
}

ngOnChanges() {
this.cdr.markForCheck();}

getBooleanProperty(value: any): boolean {
  return value != null && value !== false;
}


@Input()
get disabled(): boolean { return this.isDisabled; }
set disabled(value) {
  this.isDisabled = this.getBooleanProperty(value);
}


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
markAsTouched(): void {
  this.onTouched();
}

public dateClass = (date: Date) => {
  if (this._findDate(date) !== -1) {
    return [ 'selected' ];
  }
  return [ ];
}

public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(date);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
        this._picker['_componentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
    this.change.emit(event);
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }
}
