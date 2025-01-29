import { AfterViewInit, ANIMATION_MODULE_TYPE, booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostAttributeToken, inject, Input, NgZone, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { defaultConfig, REALSOFT_CHECKBOX_DEFAULT_OPTIONS, RealsoftCheckboxChange, RealsoftCheckboxDefaultOptions, RealsoftCheckboxTransitionState } from "./checkbox-configuration";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { FocusableOption } from "@angular/cdk/a11y";
import { RealsoftInternalFormField } from "./internal-form-field";
import { UniqueIdGeneratorService } from "./id-generator";


//Define a custom ControlValue Accessor for the Angular Component "Realsoft Checkbox Component".
export const REALSOFT_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR, //For providing a control value accessor for form controls
    useExisting: forwardRef(() => RealsoftCheckbox), //Refere to a reference of RealsoftCheckbox which has not yet been defined
    multi: true
}
  
export const  REALSOFT_CHECKBOX_VALIDATOR_ACCESSOR: any = {
    provide: NG_VALIDATORS, //For providing a control value accessor for form controls
    useExisting: forwardRef(() => RealsoftCheckbox), //Refere to a reference of RealsoftCheckbox which has not yet been defined
    multi: true
}

@Component({
    selector: 'realsoft-checkbox',
    exportAs: 'realsoftCheckbox',
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
    standalone: true,
    host: {
        'class': 'realsoft-checkbox',
        '[attr.aria-label]': 'null',
        '[attr.aria-labelledby]' : 'null',
        '[class.realsoft-checkbox-no-animation]': `_animation === 'NoopAnimations'`,
        '[class.realsoft-checkbox-disabled]': 'disabled',
        '[class.realsoft-checkbox-checked]': 'checked',
        '[class.realsoft-checkbox-disabled-interactive]' : 'disabledInteractive',
        '[class.realsoft-checkbox-indeterminate]': 'indeterminate',
        '[attr.tabindex]': 'null',
        '[id]': 'id'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        REALSOFT_CHECKBOX_VALIDATOR_ACCESSOR, REALSOFT_CHECKBOX_CONTROL_VALUE_ACCESSOR
    ],
    imports : [RealsoftInternalFormField]
})
export class RealsoftCheckbox implements ControlValueAccessor, Validator, OnChanges, FocusableOption, AfterViewInit {
    //For Dependency Injection
 private _changeDetectorRef = inject(ChangeDetectorRef); //For Triggering Change Detection
 element = inject<ElementRef<HTMLElement>>(ElementRef); //Reference to the checkbox element
 _animation? = inject(ANIMATION_MODULE_TYPE, {optional: true}); //For Transition and Animation
 private _options = inject<RealsoftCheckboxDefaultOptions>(REALSOFT_CHECKBOX_DEFAULT_OPTIONS, {optional: true});
 _tabIndex = inject(new HostAttributeToken('tabindex'), {optional: true});
 private _ngZone = inject(NgZone);

 //References to template elments
 @ViewChild('input') _input : ElementRef<HTMLInputElement>; //The native `<input type="checkbox">` element
 @ViewChild('label') _label : ElementRef<HTMLInputElement>; //The native `<label>` element

 //Class Properties 
 private _checked: boolean = false; //For the checked state of the checkbox
 private _disabled: boolean = false; //For the disabled state of the checkbox
 private _idUnique: string; // The unique id in case no id was specified
 private _indeterminate: boolean = false;// For the indeterminate state of the checkbox => Known as Mixed Mode

 //Animation Class Properties
 private _animationClass: string = ''; //The Animation Class to be Applied
 private _transitionState: RealsoftCheckboxTransitionState = RealsoftCheckboxTransitionState.Initial; //The Triggered Transition to move between the states of the checkbox

 /*Input Bindings and Properties*/

 //The `aria-describedby` is read after the element's label and field type
 @Input('aria-describedby') ariaDescribedby: string; 

 //The `aria-label` attribute is attached to the the aria-label attribute of the host element. In most cases, `aria-labelledby` will take precedence so this may be omitted.
 @Input('aria-label') ariaLabel: string;

 //The `aria-labelledby` is for users to specify and it'll be forwarded to the input element.
 @Input('aria-labelledby') ariaLabelledby: string | null = null;

 //Whether the checkbox has a Ripple
 @Input({transform: booleanAttribute}) disableRipple: boolean;

 //Whether the checkbox should remain interactive when it is disabled 
 @Input({transform: booleanAttribute}) disabledInteractive: boolean;

 //A unique id for the checkbox input. If none is supplied, it will be auto generated via the Unique ID Generator Service.
 @Input() id: string;

 //Whether the label should appear after or before the checkbox. Defaults to `after`
 @Input() labelPosition: 'after' | 'before' = 'after';

 //Name value will be applied to the input element if present.
 @Input() name: string | null = null;

 //Whether the checkbox is required 
 @Input({transform: booleanAttribute}) required: boolean;

 //The value attribute of the native input element 
 @Input() value: string;

 //Whether the checkbox is checked
 @Input({transform: booleanAttribute})
 get checked(): boolean {
     return this._checked;
 }
 set checked(value: boolean) {
     //Check first if the value is equal to the checked value to prevent unnecessary change detection
     if(value != this.checked){
         this._checked = value;
         this._changeDetectorRef.markForCheck();
     }
 }
 
 //Whether the checkbox is disabled
 @Input({transform: booleanAttribute}) 
 get disabled(): boolean {
     return this._disabled;
 }
 set disabled(value: boolean) {
     //Check first if the value is equal to the disabled value to prevent unnecessry change detection
     if (value !== this.disabled) {
         this._disabled = value;
         this._changeDetectorRef.markForCheck();
     }
 }

 //Whether the checkbox is in indeterminate mode: Known as Mixed Mode:
 @Input({transform: booleanAttribute})
 get indeterminate(): boolean {
     return this._indeterminate;
 }
 set indeterminate(value: boolean) {
    //Check first if the value being set is already the same as the indeterminate value 
    const valueHasChanged = this._indeterminate != value;
    this._indeterminate =  value//For synchronization purposes => Also set the indeterminate state of the native input element

    //To avoid having cannot read properties of undefined error
    const nativeCheckbox = this._input;

    if (nativeCheckbox) {
      nativeCheckbox.nativeElement.indeterminate = value;
    }

    //Decide what happens when the value changes to reflect the needed animation class and transition state
    if(valueHasChanged) {
        //Value Has Changed => Reflect the needed changes based on whether indeterminate is true or not 
        if(this._indeterminate){
            this._checkboxTransitionState(RealsoftCheckboxTransitionState.indeterminate);
        } else {
            //Indeterminate is false, check whether the checkbox is in checked mode or not
            if(this._checked){
                this._checkboxTransitionState(RealsoftCheckboxTransitionState.Checked)
            } else{
                //Checkbox is in the unchecked state 
                this._checkboxTransitionState(RealsoftCheckboxTransitionState.Unchecked)
            }
            //Since Value Has Changed, emit the event 
            this.indeterminateChange.emit(this._indeterminate);
        }

    }; 

}

 //Tab Index for the checkbox
 @Input() tabIndex: number;

 /*Output Emitters*/
 //Event emitted when the checkbox's checked value changes
 @Output() change: EventEmitter<RealsoftCheckboxChange> = new EventEmitter<RealsoftCheckboxChange>();

 //Event emitted when the checkbox's indeterminate value changes
 @Output() indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();


 constructor() {
     this.id = this._idUnique = inject(UniqueIdGeneratorService).generateID('realsoft-checkbox-');
     this._options = this._options || defaultConfig; //Default Configuration of the checkbox
     this.tabIndex = this._tabIndex == null ? 0 : parseInt(this._tabIndex) || 0;
 }

 ngOnChanges(changes: SimpleChanges): void {
     if(changes['required']){
         this._validatorChangeFn();
     }
 }

 ngAfterViewInit(): void {
     if(this._input){
         this._input.nativeElement.indeterminate = this._indeterminate;
     }
 }

 //A method that returns the unique id for the visual hidden input element
 get inputId(): string {
     return `${this.id || this._idUnique}-input`;
 }

 get _disabledInteractive (): boolean {
     return this._options.disabledInteractive ?? false;
 }

 //Setting focus to the native `<input type="checkbox"> element
 focus(): void {
     this._input?.nativeElement.focus();
 }

 //The Object to be emitted by the checkbox whenever an emitted event is needed
 private _changeEvent(checked: boolean) {
     const event = new RealsoftCheckboxChange();
     event.source = this;
     event.checked = checked;
     return event;
 }

 //Checkbox Animation Logic
 /**
  * The following map resembles the transition state of the checkbox and the corresponding animation class to be applied when triggered
 */
 private _animationClasses = new Map<string, string>([
     ['uncheckedToChecked', 'realsoft-checkbox-unchecked-checked-animation'],
     ['uncheckedToIndeterminate', 'realsoft-checkbox-unchecked-indeterminate-animation'],
     ['checkedToUnchecked', 'realsoft-checkbox-checked-unchecked-animation'],
     ['checkedToIndeterminate', 'realsoft-checkbox-checked-indeterminate-animation'],
     ['indeterminateToChecked', 'realsoft-checkbox-indeterminate-checked-animation'],
     ['indeterminateToUnchecked', 'realsoft-checkbox-indeterminate-unchecked-animation']
 ]);

 //Animation Classes Getter Method 
 private _getAnimationClasses(previousState: RealsoftCheckboxTransitionState, nextState: RealsoftCheckboxTransitionState): string {
     if(this._animation === 'NoopAnimations') return ''; //Animations are Disabled. No Need to apply them, in this case the Animation Class is an empty string

     switch(previousState) {
         case RealsoftCheckboxTransitionState.Initial : 
             if(nextState === RealsoftCheckboxTransitionState.Checked){
                 return this._animationClasses.get('uncheckedToChecked');
             } 
             else if (nextState === RealsoftCheckboxTransitionState.indeterminate){
                 return this._checked ? this._animationClasses.get('checkedToIndeterminate') : this._animationClasses.get('uncheckedToIndeterminate');
             }
         break;

         case RealsoftCheckboxTransitionState.Checked :
             return nextState === RealsoftCheckboxTransitionState.Unchecked ? this._animationClasses.get('checkedToUnchecked') : this._animationClasses.get('checkedToIndeterminate');

         case RealsoftCheckboxTransitionState.indeterminate :
             return nextState === RealsoftCheckboxTransitionState.Checked ? this._animationClasses.get('indeterminateToChecked') : this._animationClasses.get('indeterminateToUnchecked');

         case RealsoftCheckboxTransitionState.Unchecked :
             return nextState === RealsoftCheckboxTransitionState.Checked ? this._animationClasses.get('uncheckedToChecked') : this._animationClasses.get('uncheckedToIndeterminate');
     }
     return ''; //Fallback
 }

 //Method to be invoked whenever the state of the checkbox has been changing
 private _checkboxTransitionState(nextState: RealsoftCheckboxTransitionState) {
     let previousState = this._transitionState; //Store the previous state
     let element = this._input?.nativeElement; //Get The Native Input Element

     //Fallback When the next State is the same as the previous state or the element for some reason is undefined.
     if (previousState === nextState || !element) return;

     if(this._animationClass) element.classList.remove(this._animationClass); //Remove the previously applied animation class if there's any to make sure that multiple animation classes don't coexist
     
     //Now that the next and previous states are ready for usage, get the new Animation Class: 
     this._animationClass = this._getAnimationClasses(previousState, nextState);

     //Update the transition state with the new state so that they're in sync
     this._transitionState = nextState;

     //Add the new animation class to the checkbox element
     if(this._animationClass.length > 0) {
        element.classList.add(this._animationClass);
       }
  
    //Animation Should be added for a second then removed, also change detection should not be triggered 
    this._ngZone.runOutsideAngular(() => {
        if(this._animationClass) {
          setTimeout(() => {
            element.classList.remove(this._animationClass);
          }, 1000)
        }
    });
 }

 /*Implementing the ControlValueAccessor Interface Logic*/

 
 _onTouched: () => any = () => {};//For the Blur of the Checkbox
 private _controlValueAccessorChangeFn: (value: any) => void = () => {};//To Notify Angular of Value Changes
 private _validatorChangeFn = () => {}; //To Notify Angular of Validator State Changes

 writeValue(value: any): void {
    this.checked = !!value; //Make sure that value is boolean by using the double negation 
 }

 registerOnChange(fn: (value: any) => void) {
     this._controlValueAccessorChangeFn = fn;
 }

 registerOnTouched(fn: any): void {
     this._onTouched = fn;
 }

 setDisabledState(isDisabled: boolean): void {
     this.disabled = isDisabled;
 }


 /*Implementing the Validator Inteface Logic*/

 //The validate Function returns validation error for the required case
 validate(control: AbstractControl<boolean>): ValidationErrors | null {
     if(this.required && control.value != true) {
         return {'required': true} //In case the validation failed
     }
     else 
     return null;
 }

 registerOnValidatorChange(fn: () => void): void {
     this._validatorChangeFn = fn;
 }

 private _emiteChangeEvent() {
     const element = this._input?.nativeElement; //Get the input element.
     this._controlValueAccessorChangeFn(this.checked);
     this.change.emit(this._changeEvent(this.checked)); //Emit the new change event object

     if(element) {
         element.checked = this.checked; //For synchronization purposes
     }
 }

 //Input Events Logic
 _onBlur() {
     this._onTouched();
     this._changeDetectorRef.markForCheck();
 }

 protected _inputClick() {
     //Get the click Action from the Default Checkbox Configuration
     const action = this._options?.clickAction;

     //Make sure the Input is not disabled and the Click Action is not noop since the `noop` action indicates not to trigger neither checked nor indeterminate
     if(!this.disabled && action !== 'noop') {
         //The action is now either `check` or `check-indeterminate`
         //Make Sure that indeterminate is set to false, since this mode is not set by the user, instead it is set internally by another logic

         //If the Action is `check` then you need to trigger the check state and ignore indeterminate. Hence, make sure to check the value of indeterminate
         if(this.indeterminate && action !== 'check'){
             this._indeterminate = false; 
             this.indeterminateChange.emit(this._indeterminate);
         }

         //Trigger the checked state. Note that there's no need to set indeterminate to false here as it will be false either way
         this._checked = !this._checked; //Revert the checked state

         //Animation Classed Need to be triggered based on the new transition state 
         this._checkboxTransitionState(this._checked ? RealsoftCheckboxTransitionState.Checked : RealsoftCheckboxTransitionState.Unchecked);
         this._emiteChangeEvent(); //Emit the change event
     } 

     //Handle the case where the checkbox is not disabled and the action is `noop` Aka No triggering for either the check nor the indeterminate
     else if (!this.disabled && action === 'noop') {
         //No Triggering Needs to happen. Simply sync the input with the checked and indeterminate states
         //No need to emit an event in this case
         this._inputSync();
     }

     else if(this.disabled || this.disabledInteractive) {
         //No Triggering Needs to happen. Simply sync the input with the checked and indeterminate states
         //No need to emit an event in this case
         this._inputSync();
     }

 }

 //Sync the native input element with the checked and indeterminate states
 private _inputSync(): void {
     this._input.nativeElement.checked = this.checked; 
     this._input.nativeElement.indeterminate = this.indeterminate;
 }

 _touchTargetClick(): void {
     //Make sure that the native input element is not disabled. so that nothing will be triggered from the touch target if it's disabled already
     if(!this.disabled) {
         this._inputClick(); //Trigger the input click if it was from the touch target
         this._input?.nativeElement.focus();
     }
 }
}