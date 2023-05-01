import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'realsoft-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle-button.component.html',
  encapsulation:ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RealsoftToggleBtnComponent),
      multi: true,
    },
  ],
})
export class RealsoftToggleBtnComponent implements OnChanges, ControlValueAccessor {
  //Inputs
  @Input() checked:boolean=false;//Whether the slide toggle element is checked or not
  @Input() label!:string;//The label beside the slide toggle if any
  @Input() required!:boolean;//Whether the slide toggle is required

  //Outputs
  @Output() change = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<any>();
  
  //Variables
  isDisabled: boolean =false;
  
  //An event emitted each time the slide toggle changes its value
  changeEvent(e:any){
    this.change.emit(e);
  }
  constructor(private cdr: ChangeDetectorRef) { }
  
  ngOnChanges(){
    this.cdr.markForCheck();
  }
  
  getBooleanProperty(value: any): boolean {
    return value != null && value !== false;
  }
  public onChange: Function = () => {};
  public onTouched: Function = () => {};

  @Input()
  get disabled(): boolean { return this.isDisabled; }
  set disabled(value) {
    this.isDisabled = this.getBooleanProperty(value);
  }
  //For enabling and disabling the control
  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  //To write a new value to the control
  writeValue(value: any): void {
    this.checked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  //Execute this whenever ngModel changes
  onModelChange(value: any) {
    this.onTouched(value);
    this.onChange(value);
    this.checked=value;
    this.cdr.markForCheck();
    this.valueChange.emit(value);
  }

}