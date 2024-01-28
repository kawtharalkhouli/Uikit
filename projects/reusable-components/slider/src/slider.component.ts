import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges,Output,ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomSliderComponent),
  multi: true,
};

export const VALIDATOR: any = {
  provide: NG_VALIDATORS, useExisting: forwardRef(() => CustomSliderComponent),
  multi: true
};


@Component({
  selector: 'custom-slider',
  templateUrl:'./slider.component.html' ,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [VALUE_ACCESSOR,VALIDATOR],
})
export class CustomSliderComponent implements OnChanges, ControlValueAccessor,Validator {
  @Input() invert!:boolean;
  @Input() max: number = 100; 
  @Input() min: number = 0;
  @Input() step: number = 1;
  @Input() thumbLabel!:boolean;
  @Input() vertical !:boolean;
  @Input() required!:boolean;
  isRequired:boolean=false;
  invalid:boolean=false;


  @Output() change: EventEmitter<any>=new EventEmitter<any>();

  //Variables
  isDisabled: boolean=false;
  value!: any;

  getBooleanProperty(value: any): boolean {
    return value != null && value !== false;
  }

  ngOnChanges() {
    this.cdr.detectChanges()
    this.cdr.markForCheck()
  }
    constructor(private cdr: ChangeDetectorRef) {}
  
  
  @Input()
  get disabled(): boolean { return this.isDisabled; }
  set disabled(value) {
    this.isDisabled = this.getBooleanProperty(value);
  }
  
  public onChange: Function = () => {};
  public onTouched: Function = () => {};

  //A new value is written to the form control on each update
  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }
  //Whenever the control value changes in the UI
//Whenever the control value changes in the UI
registerOnChange(fn: any): void {
  this.onChange = fn;
  this.registerOnValidatorChange=fn
}

registerOnTouched(fn: any): void {
  this.onTouched = fn;
  this.registerOnValidatorChange=fn
}
  //For enabling or disabling the control
  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();}

  onSliderChange(event: MatSliderChange) {
    this.onTouched();
    this.registerOnValidatorChange;
    this.cdr.detectChanges()
    this.change.emit(event)
  }

  markAsTouched(): void {
    this.onTouched();
  }

      //For validation
      validate(c: AbstractControl): ValidationErrors {
        const validators: ValidatorFn[] = [];
        if(c.errors){
          if(c.errors['required'])
          {
            this.markAsTouched();
            this.registerOnValidatorChange;
            this.cdr.detectChanges();
          }
          if(!c.errors['required'])
          {
            this.markAsTouched();
            this.registerOnValidatorChange;
            this.cdr.detectChanges();
          }
        }
        return validators;
      }
      
      registerOnValidatorChange(fn: () => void): void { 
        this.onChange = fn;
        this.onTouched=fn;
      }

      onInputChange(event: any): void {
        const newValue = (event.target as HTMLInputElement).valueAsNumber;
        this.value = newValue;
        this.onChange(newValue);
        this.onTouched();
      }
}