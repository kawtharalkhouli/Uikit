import { Component,EventEmitter, forwardRef,Input, Output, ViewEncapsulation,} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

  interface radioButton{
    value?:any;
    label?:any;
    checked?:boolean;
    required?:boolean;
    disabled?:boolean;
  }
  @Component({
    selector: 'realsoft-radio-group',
    templateUrl: './radio-group.component.html',
    encapsulation:ViewEncapsulation.None,
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => RadioGroupComponent),
          multi: true
        }
      ]
  })
  export class RadioGroupComponent implements  ControlValueAccessor {
    @Input() options: radioButton[] = [];
    @Output() optionSelected = new EventEmitter<string>();
    @Output() change: EventEmitter<any>=new EventEmitter<any>();
  
    selectedOption!: string;
    isDisabled!: boolean;
    value: any;
    onChange: any = () => {};
    onTouched: any = () => {};
  
    getBooleanProperty(value: any): boolean {
      return value != null && value !== false;
    }
    
    @Input()
    get disabled(): boolean { return this.isDisabled; }
    set disabled(value) {
      this.isDisabled = this.getBooleanProperty(value);
    }
    
    constructor() {}
  
    changeEvent(e:any){
    console.log(e)
     this.change.emit(e);
    }
  
    writeValue(value: string): void {
      this.value = value;
      this.selectedOption=value
    }
  
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
  
    setDisabledState(isDisabled: boolean): void {
      this.isDisabled = isDisabled;
    }
  
    selectOption(option : any): void {
      console.log(option)
      this.selectedOption = option;
      this.onChange(option);
      this.optionSelected.emit(option);
      this.onTouched();
    }

  }
  