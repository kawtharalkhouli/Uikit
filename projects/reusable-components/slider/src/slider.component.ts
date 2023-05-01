import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges,Output,ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';


@Component({
  selector: 'custom-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./slider.component.html' ,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSliderComponent),
      multi: true,
    }
  ],
})
export class CustomSliderComponent implements OnChanges, ControlValueAccessor {
  @Input() invert!:boolean;
  @Input() max: number = 100; 
  @Input() min: number = 0;
  @Input() step: number = 1;
  @Input() thumbLabel!:boolean;
  @Input() vertical !:boolean;


  @Output() change: EventEmitter<any>=new EventEmitter<any>();

  //Variables
  isDisabled: boolean=false;
  value!: any;

  getBooleanProperty(value: any): boolean {
    return value != null && value !== false;
  }

  ngOnChanges() {
    this.cdr.markForCheck();}
    constructor(private cdr: ChangeDetectorRef) {}
  
  
  @Input()
  get disabled(): boolean { return this.isDisabled; }
  set disabled(value) {
    this.isDisabled = this.getBooleanProperty(value);
  }
  
  onChange = (value:any) => {};
  onTouched = () => {};

  //A new value is written to the form control on each update
  writeValue(value: any): void {
    if(value) this.value = value;
    this.cdr.markForCheck();
  }
  //Whenever the control value changes in the UI
  registerOnChange(fn): void {
  this.onChange =fn
  }
  //For validation purposes and to mark the control as touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  //For enabling or disabling the control
  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();}

  onSliderChange(event: MatSliderChange) {
    this.change.emit(event)
  }
}