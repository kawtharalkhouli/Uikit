import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'realsoft-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './counter.component.html',
  providers:[ {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CounterComponent),
    multi: true,
  },]
})
export class CounterComponent implements ControlValueAccessor {
  @Input() min:number=0;
  @Input() max:number=100;
  @Input() value:number=0;
  disabled = false;


  onTouch!: () => void;
  onChange!: (value: number) => void;

  constructor(private _cdr: ChangeDetectorRef) {}

  up() {
    if(this.value<this.max){
      this.setValue(this.value + 1, true);
    }  
  }

  down() {
    if(this.value>this.min){
      this.setValue(this.value - 1, true);
    }  
  }

  registerOnChange(fn: (value: number) => void) {
      this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
      this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
      this.disabled = isDisabled;
  }

  writeValue(value: number) {
      this.setValue(value, false);
      this._cdr.markForCheck();
  }

    setValue(value: number, emitEvent: boolean) {
      const parsed = parseInt(value as any);
      this.value = isNaN(parsed) ? 0 : parsed;
      if (emitEvent && this.onChange) {
          this.onChange(value);
          this.onTouch();
      }
  }
}
