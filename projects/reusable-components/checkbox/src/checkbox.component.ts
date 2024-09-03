import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'realsoft-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./checkbox.component.html' ,
  encapsulation:ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RealsoftCheckboxComponent),
      multi: true,
    },
  ],
})
export class RealsoftCheckboxComponent implements OnChanges, ControlValueAccessor {
//Inputs
@Input() option!:string | undefined; 
@Input() checked!:boolean | undefined;
@Input() value!:any;
@Input() required:boolean=false;
@Input() indeterminate!: boolean;

//Outputs
@Output() change:EventEmitter<any> = new EventEmitter();

  isDisabled: boolean=false;

  changeEvent(event:any){
  this.change.emit(event);
  this.onChange(event.checked)
  }

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(){
  this.cdr.markForCheck();
  }

  getBooleanProperty(value: any): boolean {
    return value != null && value !== false;
  }

  @Input()
  get disabled(): boolean { return this.isDisabled; }
  set disabled(value) {
  this.isDisabled = this.getBooleanProperty(value);
}
  onTouched = () => {};
  writeValue(value: any, options?: { triggerChangeDetection: boolean }): void {
    this.checked = value;
    if (options && options.triggerChangeDetection) {
      this.cdr.detectChanges();
    }} 

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(event: any) {
    this.checked = event.checked;
  }
  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  onModelChange(e: any) {
    this.checked = e;
    this.onChange(e);
  }
}
