import { ChangeDetectorRef, Component,EventEmitter, forwardRef,Input, OnChanges, Output, ViewEncapsulation,} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import 'quill-emoji';

//Define providers here to prevent circular dependency
export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextEditorComponent),
  multi: true,
};

export const VALIDATOR: any = {
  provide: NG_VALIDATORS, useExisting: forwardRef(() => RichTextEditorComponent),
  multi: true
};

@Component({
    selector: 'realsoft-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    encapsulation:ViewEncapsulation.None,
    providers: [VALUE_ACCESSOR,VALIDATOR],
})
export class RichTextEditorComponent implements  ControlValueAccessor, OnChanges {
@Input() placeholder!:string;
@Input() styles!:any;
@Input() quillConfiguration!:any;
isRequired!:boolean;
isDisabled!:boolean;
value: any;
onChange = (value:any) => {};
onTouched = () => {};
@Output() onContentChanged : EventEmitter<any>=new EventEmitter<any>();
@Output() onSelectionChanged : EventEmitter<any>=new EventEmitter<any>();

constructor(private cdr: ChangeDetectorRef) {}

ngOnChanges() {this.cdr.markForCheck();}

onSelectionChange(e:any){this.onSelectionChanged.emit(e)}
onContentChange(e:any){this.onContentChanged.emit(e)}

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

writeValue(value: any): void {
  this.value = value;
  this.cdr.markForCheck();
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

setDisabledState(isDisabled: boolean) {
  this.isDisabled = isDisabled;
  this.cdr.markForCheck();
}

markAsTouched(): void {
  this.onTouched();
}

}
  