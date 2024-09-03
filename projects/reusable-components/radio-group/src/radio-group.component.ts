import { ChangeDetectorRef, Component,EventEmitter, forwardRef,Input, Output, ViewEncapsulation,} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, AbstractControl, ValidationErrors, ValidatorFn, Validator } from '@angular/forms';

  interface RadioButton{
    value?:any;
    label?:any;
    labelAr?:any;
    checked?:boolean;
    required?:boolean;
    disabled?:boolean;
  }
  export const VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioGroupComponent),
    multi: true,
  };
  
  export const VALIDATOR: any = {
    provide: NG_VALIDATORS, useExisting: forwardRef(() => RadioGroupComponent),
    multi: true
  };
  @Component({
    selector: 'realsoft-radio-group',
    templateUrl: './radio-group.component.html',
    encapsulation:ViewEncapsulation.None,
    providers: [VALUE_ACCESSOR,VALIDATOR],
  })
  export class RadioGroupComponent implements ControlValueAccessor, Validator {
    @Input() options: RadioButton[] = [];
    @Input() lang: string = 'en';

    @Output() optionSelected = new EventEmitter<string>();
    @Output() change: EventEmitter<any>=new EventEmitter<any>();
    
  
    selectedOption!: string;
    isDisabled!: boolean;
    isRequired:boolean=false;
    invalid:boolean=false;
    value: any;
    onChange: any = () => {};
    onTouched: any = () => {};
  
    getBooleanProperty(value: any): boolean {
      return value != null && value !== false;
    }

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
    
    @Input()
    get disabled(): boolean { return this.isDisabled; }
    set disabled(value) {
      this.isDisabled = this.getBooleanProperty(value);
    }
    
    constructor(private cdr: ChangeDetectorRef) {}
  
    changeEvent(e:any){
     this.change.emit(e);
    }
  
    writeValue(value: string): void {
      this.value = value;
      this.selectedOption=value
    }
  
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
  
    setDisabledState(isDisabled: boolean): void {
      this.isDisabled = isDisabled;
    }
  
    selectOption(option : any): void {
      this.selectedOption = option;
      this.onChange(option);
      this.optionSelected.emit(option);
      this.onTouched();
    }

  }
  