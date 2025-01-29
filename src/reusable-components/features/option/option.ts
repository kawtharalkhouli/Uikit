import { AfterViewChecked, booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, isSignal, OnDestroy, Output, Signal, ViewChild, ViewEncapsulation } from "@angular/core";
import { FocusableOption, FocusOrigin} from '@angular/cdk/a11y';
import { Subject } from "rxjs";
import { hasModifierKey } from '@angular/cdk/keycodes';
import { REALSOFT_OPTION_CONFIG, RealsoftOptionConfiguration, RealsoftOptionSelectionChange } from "./models";
import { RealsoftPseudoCheckbox } from "../pseudo-checkbox/pseudo-checkbox";
import { UniqueIdGeneratorService } from "../id-generator";
 


@Component({
    selector: 'realsoft-option',
    exportAs: 'realsoftOption',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './option.html',
    styleUrl: './option.scss',
    host: {
        'class': 'realsoft-option realsoft-list-item',
        'role': 'option',
        '[id]': 'id',
        '[class.realsoft-list-item-selected]': 'selected',
        '[class.realsoft-list-item-active]': 'active',
        '[class.realsoft-list-item-disabled]': 'disabled',
        '[class.realsoft-option-multiple]': 'multiple',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.aria-selected]' : 'selected',
        '(click)': 'selectOption()',
        '(keydown)': '_handleKeydown($event)'
    },
    standalone: true,
    imports: [RealsoftPseudoCheckbox]
})
export class RealsoftOption<T = any> implements FocusableOption, AfterViewChecked, OnDestroy{
    private _element = inject<ElementRef<HTMLElement>>(ElementRef); //Reference to the html element such that it can be used for certain cases
    private _selected = false; //The option is by default not selected
    _changeDetectorRef = inject(ChangeDetectorRef);
    private _options = inject<RealsoftOptionConfiguration>(REALSOFT_OPTION_CONFIG, {optional: true});

    //Whether or not the option is currently active and ready to be selected
    private _active = false; //The option is by default not active
    private _disabled = false; //The option is by default not disabled
    private _optionCurrentValue = ''; //Current option value before it changes

    @Input() value: T; //The form value of the option
    @Input() id : string = inject(UniqueIdGeneratorService).generateID('realsoft-option-'); // Unique ID of the option

    @Output() readonly onSelectionChange = new EventEmitter<RealsoftOptionSelectionChange<T>>();

    //Emit when the state of the option changes and wrapper components need to be notified
    readonly _changes = new Subject<void>;

    //Whether the option is disabled
    @Input({transform: booleanAttribute})
    get disabled(): boolean{
        return this._disabled;
    }
    set disabled(value: boolean){
        this._disabled = value;
    }

    //Get a reference of the text of the option 
    @ViewChild('option', {static: true}) _option: ElementRef<HTMLElement> | undefined;

    constructor() {}

    ngAfterViewChecked() {
        //make sure the option is selected first before notifying the wrapper component
        if (this._selected) {
            //Option is selected and the option text content value has changed. Notify the wrapper component
            if(this.viewValue !== this._optionCurrentValue){

              if(this._optionCurrentValue) this._changes.next;

              this._optionCurrentValue = this.viewValue;
            }
        }
    }
    /*Whether or not option is currently active and ready to be selected. An active option displays styles as if its focused, but the focus is 
    actually retained somewhere else. This comes in handy for components like autocomplete where focus must remain on the input.
    */
    get active(): boolean {
        return this._active;
    }

    //Whether or not the option is currently selected
    get selected(): boolean {
        return this._selected;
    }

    //Retrieve the text of the option element, fall back to an empty string in case the text was undefined or falsy
    get optionValue() : string {
        return (this._element.nativeElement.textContent || '').trim();
    }

    //Whether the wrapping component is in multiple selection mode
    get multiple(): boolean {
        return this._options && this._options.multiple;
    }

    //Whether ripples for the option are disabled
    get disableRipple(): boolean {
        return !!this._options && this._options.disableRipple;
    }

    //Whether or not to display the checkmark for single selection
    get hideSingleSelectionIndicator(): boolean {
        return !!this._options && this._options.hideSingleSelectionIndicator;
    }

    //The displayed value of the option. It is necessary to show the selected option in the select's trigger.
    get viewValue(): string {
        return (this._option.nativeElement.textContent || '').trim();
    }

    //Gets the label when determining whether the option should be focused
    getLabel(): string{
        return this.viewValue;
    }

    getHostElement(): HTMLElement {
        return this._element.nativeElement;
    }

    //Deselecting the option => This method is likely used to indicate that the selection didn't come from the user like in multi-selection where the click of the select all checkbox might unselect all options and so on
    deselect(emitEvent = true) {
        if(this._selected){
            this._selected = false;
            this._changeDetectorRef.markForCheck();
        }

        if(emitEvent){
            this.onSelectionChange.emit(new RealsoftOptionSelectionChange<T>(this, false));
        }
    }

    //Selecting the option 
    select(emitEvent = true) {
        if(!this._selected) {
            this._selected = true;
            this._changeDetectorRef.markForCheck();
        }

        if(emitEvent){
            this.onSelectionChange.emit(new RealsoftOptionSelectionChange<T>(this, false));
        }
    }

    selectOption(): void {
        if(!this.disabled) {
            this._selected = this.multiple ? !this._selected : true;
            this._changeDetectorRef.markForCheck();
            this.onSelectionChange.emit(new RealsoftOptionSelectionChange<T>(this,true));
        }
    }

    _handleKeydown(event: KeyboardEvent): void {
        if((event.key === 'Enter' || event.key === 'Space' && !hasModifierKey(event))){
            this.selectOption();
            event.preventDefault()
        }
        
    }

    //Set the focus onto the option 
    focus(_origin?: FocusOrigin, options?: FocusOptions){
        const element = this._element.nativeElement; //Get the Host DOM Element
        
        if(typeof element.focus === 'function') element.focus(options);
    }

    /*This method displays styles on the option to make it appear active. This is used by the ActiveDescendantKeyManager so key events 
    will display the proper options as active on arrow key events
    */
    setActiveStyles(): void {
        if(!this._active) {
            this._active = true;
            this._changeDetectorRef.markForCheck();
        }
    }

    /*This method removes display styles on the option that made it appear active. This is used by the ActiveDescendantKeyManager
    so key events will display the proper options as active on arrow key events
    */
    setInactiveStyles(): void {
        if(this._active) {
            this._active = false;
            this._changeDetectorRef.markForCheck();
        }
    }

    ngOnDestroy(): void {
        this._changes.complete();//Kill the subscription
    }
}