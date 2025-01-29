import { AfterContentInit, booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, DoCheck, ElementRef, EventEmitter, forwardRef, HostAttributeToken, inject, Input, numberAttribute, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { RealosftSelectChange, REALSOFT_SELECT_CONFIG, REALSOFT_SELECT_SCROLL_STRATEGY, REALSOFT_SELECT_TRIGGER, realsoftMultipleModeNonArrayValueError, realsoftSelectNonFunctionalError, RealsoftSelectTrigger } from "./models";
import { defer, merge, Observable, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl, NgForm, Validators } from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import { ActiveDescendantKeyManager, addAriaReferencedId, LiveAnnouncer, removeAriaReferencedId } from "@angular/cdk/a11y";
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, ScrollStrategy } from "@angular/cdk/overlay";
import { Directionality } from "@angular/cdk/bidi";
import { A, DOWN_ARROW, ENTER, hasModifierKey, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW } from "@angular/cdk/keycodes";
import { transformPanel } from "./select-animation";
import { ErrorState, ErrorStateMatcher } from "./error-state-matcher";
import { RealsoftFormFieldControl } from "../form-field/directives/form-field-control";
import { REALSOFT_OPTION_CONFIG, RealsoftOptionSelectionChange } from "../option/models";
import { REALSOFT_FORM_FIELD } from "../form-field/models";
import { RealsoftFormField } from "../form-field/form-field";
import { RealsoftOption } from "../option/option";
import { UniqueIdGeneratorService } from "../id-generator";
import { REALSOFT_OPTION_GROUP, RealsoftOptionGroup } from "../option-group/option-group";

@Component({
    selector: 'realsoft-select',
    exportAs: 'realsoftSelect',
    templateUrl: './select.html',
    styleUrl: './select.scss',
    animations: [transformPanel],
    host: {
      'role': 'combobox',
      'class': 'realsoft-select',
      'aria-haspopup': 'listbox',
      '[id]': '_selectUniqueID',
      '[attr.tabindex]': 'disabled ? -1 : tabIndex',
      '[attr.aria-expanded]': 'panelOpen',
      '[attr.aria-invalid]': 'errorState',
      '[attr.aria-required]': 'required.toString()',
      '[attr.aria-disabled]': 'disabled.toString()',
      '[class.realsoft-select-disabled]': 'disabled',
      '[class.realsoft-select-required]': 'required',
      '[class.realsoft-select-empty]': 'empty',
      '[class.realsoft-select-multiple]': 'multiple',
      '[class.realsoft-select-invalid]': 'errorState',
      '[attr.aria-controls]' : 'panelOpen ? _selectUniqueID + "-panel" : null',
      '[attr.aria-label]': 'ariaLabel || null',
      '(keydown)': '_handleKeydown($event)',
      '(focus)': '_onFocus()',
      '(blur)': '_onBlur()',
      '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
      {provide: RealsoftFormFieldControl, useExisting: RealsoftSelect},
      {provide: REALSOFT_OPTION_CONFIG, useExisting: RealsoftSelect},
      {provide: REALSOFT_FORM_FIELD, useExisting: RealsoftFormField}
    ],
    imports : [CdkOverlayOrigin, CdkConnectedOverlay]
})
export class RealsoftSelect implements RealsoftFormFieldControl<any> ,ControlValueAccessor, AfterContentInit, OnChanges, OnDestroy, OnInit, DoCheck{
  private _defaultSelectConfig = inject(REALSOFT_SELECT_CONFIG, {optional: true});
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _hideSingleSelectionIndicator = this._defaultSelectConfig?.hideSingleSelectionIndicator ?? false;
  private _disableOptionCentering = this._defaultSelectConfig?.disableOptionCentering ?? false;
  readonly stateChanges = new Subject<void>();
  defaultErrorStateMatcher = inject(ErrorStateMatcher);
  private _placeholder: string;
  private _required: boolean | undefined;
  ngControl = inject(NgControl, {self: true, optional: true})!;
  private _multiple: boolean = false;
  _keyManager: ActiveDescendantKeyManager<RealsoftOption>;
  private _compareWith = (o1: any, o2: any) => o1 === o2;
  private _panelOpen = false; 
  private _value: any;
  private _focused = false;
  private _errorState: ErrorState;
  private _id: string;
  private _initializeOptions = new Subject<void>();
  private _uniqueIDGenerator = inject(UniqueIdGeneratorService, {optional: true});
  private _direction = inject(Directionality, {optional: true});
  private _selectNullableOptions = true;
  controlType = 'realsoft-select';//A name for the control that can be used by realsoft-form-field
  _wrapperFormField = inject<RealsoftFormField>(REALSOFT_FORM_FIELD, {optional: true});
  _overlayOrigin: CdkOverlayOrigin | ElementRef | undefined;
  readonly _elementRef = inject(ElementRef);
  _overlayWidth: string | number;
  private _trackedSelectDialog: Element | null = null;
  private _liveAnnouncer = inject(LiveAnnouncer);
  // The custom class to add to the overlay panel element.
  _overlayPanelClasses: string | string[] = this._defaultSelectConfig?.overlayPanelClass || '';
  /** Strategy that will be used to handle scrolling while the select panel is open. */
  _scrollStrategy: ScrollStrategy;

   /** Factory function used to create a scroll strategy for this select. */
   private _scrollStrategyFactory = inject(REALSOFT_SELECT_SCROLL_STRATEGY);

  /** Emits whenever the component is destroyed. */
  readonly _destroy = new Subject<void>();

  parentForm = inject(NgForm, {optional: true});
  parentFormGroup = inject(FormGroupDirective, {optional: true});


  //Unique Id for the select input element
  _selectUniqueID = this._uniqueIDGenerator.generateID('realsoft-select-');

  _overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      panelClass: 'realsoft-select-panel-above',
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      panelClass: 'realsoft-select-panel-above',
    },
  ];

  //Unique Id for the node containing the select's value
  _selectValueID = this._uniqueIDGenerator.generateID('realsoft-select-value-');

  //For keeping track of the previous form control assigned to the select.
  private _control: AbstractControl | null | undefined;

  /** Current `aria-labelledby` value for the select trigger. */
  private _triggerAriaLabelledBy: string | null = null;

  @ViewChild('triggerSelect') trigger: ElementRef;//A trigger that opens the select

  @ViewChild('selectPanel') panel: ElementRef;//Panel containing the select options

  @ViewChild(CdkConnectedOverlay) _overlayPanel: CdkConnectedOverlay;//Overlay panel containing the options

  //For Dealing with the selection logic
  _selectionModel : SelectionModel<RealsoftOption>;
      
  //Query all deeply nested options for the select control
  @ContentChildren(RealsoftOption, {descendants: true}) options: QueryList<RealsoftOption>;

  //Query all deeply nested option groups for the select control 
  @ContentChildren(REALSOFT_OPTION_GROUP, {descendants: true}) optionGroups: QueryList<RealsoftOptionGroup>;

  //Query the select trigger
  @ContentChild(REALSOFT_SELECT_TRIGGER) customTrigger: RealsoftSelectTrigger;

  //Aria Label of the select 
  @Input('aria-label') ariaLabel: string = '';

  //Input that can be used to specify the `aria-labelledby` attribute 
  @Input('aria-labelledby') ariaLabelledby: string;

  @Input('aria-describedby') userAriaDescribedBy: string;

  //Classes to be passed to the select panel. Supports the same syntax as ngClass
  @Input() panelClass: string | string[] | Set<string> | {[key: string]: any}; 
   
  //Whether the select is disabled
  @Input({transform: booleanAttribute}) disabled: boolean = false; 

  //Tab index of the select 
  @Input() tabIndex: number = 0;

  //Whether checkmark indicator for single selection options is hidden or not
  @Input({transform: booleanAttribute})
  get hideSingleSelectionIndicator(): boolean {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value: boolean) {
    this._hideSingleSelectionIndicator = value;
    if(this.options) {
      for (const option of this.options){
        option._changeDetectorRef.markForCheck();
      }
    }
  }

  //Select Placeholder to be shown if no value has been selected
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  //Whether the select control is required
  @Input({transform: booleanAttribute})
  get required(): boolean {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value: boolean) {
    this._required = value;
    this.stateChanges.next();
  }

  //Whether the user should be allowed to select multiple options or not
  @Input({transform: booleanAttribute}) 
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean){
    this._multiple = value;
  }

  //Whether to center the active option over the trigger 
  @Input({transform: booleanAttribute}) disableOptionCentering = this._disableOptionCentering ?? false;

  //Function to compare the option values with the selected values, the first argument is a value from an option. The second is a value from the selection, A boolean should be returned
  @Input()
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if(typeof fn !== 'function'){ 
      throw realsoftSelectNonFunctionalError();
    }
    this._compareWith = fn;
    if (this._selectionModel) this._initializeSelection();
  }

  //Value of the select control
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    const valueHasChanged = this.valueHasChanged(newValue);

    if (valueHasChanged) this._onChange(newValue);
  }


  private valueHasChanged(newValue: any | any[]): boolean {
    if(newValue !== this._value || (this._multiple && Array.isArray(newValue))) {
      if(this.options) this._selection(newValue);

      this._value = newValue;
      return true;
    }
    return false;
  }

  //Object used to control when error messages are shown
  @Input()
  get errorStateMatcher() {
    return this._errorState.matcher;
  }
  set errorStateMatcher(value: ErrorStateMatcher){
    this._errorState.matcher = value;
  }

  //Time to wait in milliseconds after the last keystrokes before moving focus to an item
  @Input({transform: numberAttribute}) typeaheadDebounceInterval: number;

  //Function used to sort the values in select in multiple mode 
  @Input() sortComparator: (a: RealsoftOption, b: RealsoftOption, options: RealsoftOption[]) => number;

  //Unique id of the element
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
    this.stateChanges.next();
  }

  //Width of the panel, if set to auto, the panel will match the trigger width. If set to null or an empty string, the panel will grow to match the longest option's text
  @Input() panelWidth: string | number | null = this._defaultSelectConfig && typeof this._defaultSelectConfig.panelWidth !== 'undefined' ? this._defaultSelectConfig.panelWidth : 'auto';


  //Determine whether the select is in an error state or not
  get errorState() {
    return this._errorState?.errorState;
  }

  //Set the select's error state
  set errorState(value: boolean) {
    this._errorState.errorState = value;
  }

  get shouldLabelFloat(): boolean {
    return this.panelOpen || !this.empty || (this.focused && !!this.placeholder);
  }

  //Combined stream of all of the child option's change events
  readonly optionSelectionChanges: Observable<RealsoftOptionSelectionChange> = defer(() => {
    const options = this.options;

    if(options) {
      return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map(option => option.onSelectionChange))))
    }

    return this._initializeOptions.pipe(switchMap(() => this.optionSelectionChanges))
  });

  //Event emitted when the select panel has been toggled
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  //Event emitted when the seleted value has been changed by the user
  @Output() readonly selectionChange = new EventEmitter<RealosftSelectChange>();

  //Event emitted whenever the value of the select changes
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  private _initiateErrorState() {
    return new ErrorState(
      this.defaultErrorStateMatcher,
      this.ngControl,
      this.parentFormGroup,
      this.parentForm,
      this.stateChanges,
    );
  }

  constructor() {
    //To avoid Circular Dependency
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    if (this._defaultSelectConfig?.typeaheadDebounceInterval != null) {
      this.typeaheadDebounceInterval = this._defaultSelectConfig.typeaheadDebounceInterval;
    }

    this._errorState = this._initiateErrorState();
    this._scrollStrategy = this._scrollStrategyFactory();

    this.id = this.id; //Force id initialization 
  }

  //Lifecycle Hooks 

  ngOnInit() : void{
     this._selectionModel = new SelectionModel<RealsoftOption>(this.multiple);
     this.stateChanges.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled'] || changes['userAriaDescribedBy']) {
      this.stateChanges.next();
    }

    if (changes['typeaheadDebounceInterval'] && this._keyManager) {
      this._keyManager.withTypeAhead(this.typeaheadDebounceInterval);
    }
  }

  ngAfterContentInit() : void {
    this._initializeOptions.next();
    this._initializeOptions.complete();

    this.initiateKeyManager();
    this._selectionModelChanges();
    this._optionsQueryListChanges();
  }

  private _selectionModelChanges() {
    this._selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe(event => {
      event.added.forEach(option => option.select());
      event.removed.forEach(option => option.deselect())
    })
  }

  private _optionsQueryListChanges() {
    this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
      this._optionReset();
      this._initializeSelection();
    })
  }

  ngDoCheck(): void {
    const ngControl = this.ngControl;

    if(ngControl) {
      if(this._control !== ngControl.control) {
        if(this._control !== undefined && ngControl.disabled !== null && ngControl.disabled !== this.disabled) this.disabled = ngControl.disabled;
      }
      this._control = ngControl.control; //Update control value
    }

    this.updateErrorState();
  }

  private _selectTriggerARIALabelledby(): string | null {
    if (this.ariaLabel) return null; 

    const labelID = this._wrapperFormField?.getLabelId();
    let labelValue;

    if(labelID) labelValue = labelID + ' ' + this._selectValueID;
    else labelValue = this._selectValueID;

    if (this.ariaLabelledby) {
      labelValue += ' ' + this.ariaLabelledby;
    }

    return labelValue;
  }

  private _optionReset(): void {
    const optionObservable = merge(this.options.changes, this._destroy);
    this._optionSelectionChanges(optionObservable);
    this._optionStateChanges(optionObservable);
  }

  private _optionSelectionChanges(optionObservable: Observable<void>): void {
    this.optionSelectionChanges.pipe(takeUntil(optionObservable)).subscribe(event => {
      this._optionClick(event.source, event.isUserInput);

      //If the user selected an option, and the panel is open and the selection mode is single then close the panel and focus the native element 
      if(event.isUserInput && !this.multiple && this._panelOpen) {
        this.close();
        this._elementRef.nativeElement.focus();
      }
    })
  }

  private _optionStateChanges(optionObservable: Observable<void>): void {
    merge(...this.options.map(option => option._changes)).pipe(takeUntil(optionObservable)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
      this.stateChanges.next();
    })

  }

  skipPredicate = (option: RealsoftOption) => {
    if(this.panelOpen) return false;
    return option.disabled;
  }

  onContainerClick() {
    this.focus();
    this.open();
  }

  initiateKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager<RealsoftOption>(this.options)
    .withAllowedModifierKeys(['shiftKey'])
    .withHomeAndEnd()
    .withHorizontalOrientation(this._isRTL() ? 'rtl' : 'ltr')
    .withPageUpDown()
    .withVerticalOrientation()
    .withTypeAhead(this.typeaheadDebounceInterval)
    .skipPredicate(this.skipPredicate);
    
    this._keyManagerChangesSubscription();
    this._keyManagerTabOutSubscription();
  }

  private _keyManagerChangesSubscription() {
    this._keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
      if(!this._panelOpen && !this.multiple && this._keyManager.activeItem) this._keyManager.activeItem.selectOption();
      else if(this._panelOpen && this.panel) this._scrollOptionIntoOverlayPanel(this._keyManager.activeItemIndex || 0);
    });
  }

  private _keyManagerTabOutSubscription() {
    this._keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => {
      if(!this.multiple && this._keyManager.activeItem) this._keyManager.activeItem.selectOption();
      this._elementRef.nativeElement.focus();
      this.close();
    })
  }


  //Set the selected option based on the passed value
  private _selection(value: any | any[]) : void {
    this.options.forEach(option => option.setInactiveStyles());
    this._selectionModel.clear();

    if(this.multiple && value){
      if(!Array.isArray(value)) {
        throw realsoftMultipleModeNonArrayValueError();
      }

      value.forEach((value: any) => this._selectOption(value));
      this._sortValues();
    } else {
      const option = this._selectOption(value);

      if(option) {
        this._keyManager.updateActiveItem(option);
      } else if (!this.panelOpen) this._keyManager.updateActiveItem(-1);
    }

    this._changeDetectorRef.markForCheck();
  }


  //Selecting the option Logic
  private _selectOption(value: any): RealsoftOption | undefined {
    const option = this.options.find((option: RealsoftOption) => {
      if (this._selectionModel.isSelected(option)) {
        return false;
      }
      else {
        return (option.value != null || this._selectNullableOptions) && this._compareWith(option.value, value) ;
      }
    });

    if (option) this._selectionModel.select(option);
    return option;
  }

  //Getters
  get panelOpen(): boolean {
    return this._panelOpen;//Whether or not the overlay panel is open
  }

  get selected(): RealsoftOption | RealsoftOption[] {
    return this.multiple ? this._selectionModel?.selected || [] : this._selectionModel?.selected[0];//The currently selected option
  }

  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();//Whether the select has a value
  }

  get focused(): boolean {
    return this._focused || this._panelOpen;//Whether the select is focused
  }
  
  //The value displayed in the trigger
  get triggerValue(): string{
    if(this.empty) return ''; 

    if (this._multiple) {
      const optionsSelected = this._selectionModel.selected.map(option => option.viewValue);

      if(this._isRTL()) optionsSelected.reverse();

      return optionsSelected.join(', ');
    }

    return this._selectionModel.selected[0].viewValue;
  }

  _isRTL(): boolean {
    return this._direction ? this._direction.value === 'rtl' : false;//Whether the element is in RTL mode
  }

  //For updating the error state of the select
  updateErrorState() {
    this._errorState?.updateErrorState();
  }

  //Gets the aria-labelledby
  _panelARIALabeldby(): string | null {
    if(this.ariaLabel) return null; 

    const panelLabel = this._wrapperFormField.getLabelId() || null;
    const panelLabelCombo = panelLabel ? panelLabel + ' ' : '';
    return this.ariaLabelledby ? panelLabelCombo + this.ariaLabelledby : panelLabel;
  }

  //Closes the overlay panel and focuses the host element
  close(): void {
    if(this._panelOpen){
      this._panelOpen = false;
      //Using withHorizontalOrientation to configure the key manager to move the selection horizontally. Passing in null will disable horizontal movement
      this._keyManager.withHorizontalOrientation(this._isRTL() ? 'rtl' : 'ltr');
      this._changeDetectorRef.markForCheck();
      this._onTouched(); 
      this.stateChanges.next(); 
      
    }
  }

  //Opens the overlay panel and focuses the host element
  open(): void {
    if(!this._panelOpen && !this.disabled && this.options?.length <= 0) return;
      if(this._wrapperFormField){
        this._overlayOrigin = this._wrapperFormField.getConnectedOverlayOrigin(); 
      }

      this._overlayWidth = this._getOverlayWidth(this._overlayOrigin);
      const modal = this._elementRef.nativeElement.closest(
        'body > .cdk-overlay-container [aria-modal="true"]',
      );
      if (modal) {
        const panelId = `${this.id}-panel`;
        if (this._trackedSelectDialog) {
          removeAriaReferencedId(this._trackedSelectDialog, 'aria-owns', panelId);
        }
        addAriaReferencedId(modal, 'aria-owns', panelId);
        this._trackedSelectDialog = modal;
      }
      this._panelOpen = true;
      this._keyManager.withHorizontalOrientation(null);//Disable Horizontal Movement 
      //Activate the selected option, if there's no selected option then activate the first enabled item
      if(this._keyManager){
        //No Option Has been selected or not
        if(this.empty){
          let enabledOptionIndex = -1;
          for(let i = 0; i < this.options.length; i++) {
            const option = this.options.get(i) ?? null;
            if(!option.disabled){
              enabledOptionIndex = i;
              break; //First Enabled Option Has been found, terminate
            }
          }
          this._keyManager.setActiveItem(enabledOptionIndex);
        } else {
          this._keyManager.setActiveItem(this._selectionModel.selected[0]);
        }
      }

      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
  }

  //Handling key events on the select

  _handleKeyEvents(event: KeyboardEvent): void {
    if(!this.disabled){
      if(this._panelOpen){
        this._openPanelKeyEvents(event);
      } else {
        this._closedPanelKeyEvents(event);
      }
    }
  }
  //In multiple selection mode => Once values are selected, sort the selected values based on their order in the panel
  private _sortValues() {
    const options = this.options.toArray();

    this._selectionModel.sort((a,b) => {
      return this.sortComparator ? this.sortComparator(a, b , options) : options.indexOf(a) - options.indexOf(b);
    });
    this.stateChanges.next();
  }

  //Initialize the selection model 
  private async _initializeSelection() {
    await Promise.resolve(); 
    
    if(this.ngControl) this._value = this.ngControl.value;
    this._selection(this._value);
    this.stateChanges.next();
  }

  //Handled all keyboard events when the select panel is opened
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.panelOpen ? this._openPanelKeyEvents(event) : this._closedPanelKeyEvents(event);
    }
  }

  private _openPanelKeyEvents(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const arrowKeyActivated = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const isTyping = this._keyManager.isTyping();

    //close the select on ALT + arrow key to match the native select
    if(arrowKeyActivated && event.altKey){
      event.preventDefault();
      this.close();
    } 

    else if (!isTyping && (keyCode === ENTER || keyCode === SPACE) && this._keyManager.activeItem && !hasModifierKey(event)) {
      event.preventDefault();
      this._keyManager.activeItem.selectOption();
    }

    else if (!isTyping && this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      this.options.forEach(option => {
        if (!option.disabled) {
          this.options.some(opt => !opt.disabled && !opt.selected) ? option.select() : option.deselect()
        }
      });
    }
    else {
      const previousIndex = this._keyManager.activeItemIndex;
      this._keyManager.onKeydown(event)
      if(this._multiple && arrowKeyActivated && event.shiftKey && this._keyManager.activeItem && this._keyManager.activeItemIndex !== previousIndex){
        this._keyManager.activeItem.selectOption();
      }
    }
  }

  //Handled all keyboard events when the select panel is closed
  _closedPanelKeyEvents(event: KeyboardEvent): void {
    const keyCode =event.keyCode;
    const isArrowKeyActivated = keyCode === DOWN_ARROW || keyCode === UP_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
    const isOpenSelectKey = keyCode === ENTER || keyCode === SPACE;

    if((!this._keyManager.isTyping() && isOpenSelectKey && !hasModifierKey(event)) || ((this._multiple || event.altKey) && isArrowKeyActivated)){
      event.preventDefault();
      this.open();
    } else if(!this.multiple) {
      const previouslySelectedOption = this.selected;
      this._keyManager.onKeydown(event);
      const currentlySelectedOption = this.selected;
      if(currentlySelectedOption && previouslySelectedOption !== currentlySelectedOption) {
        this._liveAnnouncer.announce((currentlySelectedOption as RealsoftOption).viewValue, 1000)
      }
    }
  }

  //Get the overlay panel width 
  private _getOverlayWidth(preferredOrigin: ElementRef<ElementRef> | CdkOverlayOrigin | undefined) : string | number {
    if (this.panelWidth === 'auto') {
      const referenceElement = preferredOrigin instanceof CdkOverlayOrigin ? preferredOrigin.elementRef : preferredOrigin || this._elementRef;
      const overlayWidth = referenceElement.nativeElement.getBoundingClientRect().width;
      return overlayWidth;
    }

    return this.panelWidth === null ? '' : this.panelWidth;
  }

  //Implementing Control Value Accessor Interface

  //Callback function when the value of the select changes
  _onChange: (value: any) => void = () => {};

  //Callback function when the select has been touched
  _onTouched = () => {};


  writeValue(value: any): void {
    if(value !== this._value || (this._multiple && Array.isArray(value))) {
      if(this.options){
        this._selection(value)
      }

      this._value = value;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn:() => {}): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  //Toggle the state of the panel based on whether its closed or opeend
  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  //Sets Focus to the host select element
  _onFocus() {
    if(!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  _onBlur() {
    this._focused =false;
    this._keyManager?.cancelTypeahead();

    if(!this.panelOpen && !this.disabled){
      this._onTouched();
      this._changeDetectorRef.markForCheck()
      this.stateChanges.next()
    }

  }

  setDescribedByIds(ids: string[]) {
    if (ids.length) {
      this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this._elementRef.nativeElement.removeAttribute('aria-describedby');
    }
  }

  //Determines the aria-activedescendant property to be set on the host which is used to identify the currently active element of the combobox popup.
  _getAriaActiveDescendant(): string | null {
    if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
      const currentActiveID = this._keyManager.activeItem.id;
      return currentActiveID;
    }
    return null;
  }

  //For attaching the scroll strategy to the overlay 
  _attached(): void {
    const subscription = this._overlayPanel.positionChange.subscribe(()=> {
      this._changeDetectorRef.detectChanges();
      this._scrollOptionIntoOverlayPanel(this._keyManager.activeItemIndex || 0);
      subscription.unsubscribe();
    })
  }

  _scrollOptionIntoOverlayPanel(index: number): void {
    const option = this.options.get(index);

    if(option) {
      const panel: HTMLElement = this.panel.nativeElement;
      const element = option.getHostElement();

      if(index === 0) panel.scrollTop = 0;
      else {
        panel.scrollTop = this._optionScrollPosition(element.offsetTop, element.offsetHeight, panel.scrollTop, panel.offsetHeight);
      }
    }
  }

  _optionScrollPosition(optionOffset: number, optionHeight: number, scrollPosition: number, selectPanelHeight: number): number {
    if(optionOffset< scrollPosition) return optionOffset;

    if(optionOffset + optionHeight > scrollPosition + selectPanelHeight) return Math.max(0, optionOffset - selectPanelHeight+ optionHeight)

    return scrollPosition;
  }

  // private _optionClick(option: RealsoftOption, isUserInput: boolean): void {
  //   const isOptionPreviouslySelected = this._selectionModel.isSelected(option);
  //   let emittedValue: any;
    
  //   if(isOptionPreviouslySelected != option.selected) option.selected ? this._selectionModel.select(option) : this._selectionModel.deselect(option);

  //   if(isUserInput) this._keyManager.setActiveItem(option);

  //   if(this.multiple){
  //     this._sortValues(); 
  //     emittedValue = (this.selected as RealsoftOption[]).map(option => option.value);
  //   } else if (!this.multiple) {
  //     emittedValue = (this.selected as RealsoftOption).value
  //   }

  //   this._value = emittedValue;
  //   this.valueChange.emit(emittedValue);
  //   this._onChange(emittedValue);
  //   this.selectionChange.emit(new RealosftSelectChange(this, emittedValue));
  //   this._changeDetectorRef.markForCheck();
  //   this.stateChanges.next()
  // }

  private _optionClick(option: RealsoftOption, isUserInput: boolean): void {
    const optionWasPreviouslySelected = this._selectionModel.isSelected(option);
    let emittedValue : any;

    if(!this._selectNullableOptions && option.value == null && !this._multiple) {
      option.deselect();
      this._selectionModel.clear();

      if(this.value != null) {
        emittedValue = this.selected ? (this.selected as RealsoftOption).value : option.value;
        this._value = emittedValue;
        this.valueChange.emit(emittedValue);
        this._onChange(emittedValue);
        this.selectionChange.emit(new RealosftSelectChange(this, emittedValue));
        this._changeDetectorRef.markForCheck();
      }
    } else {
      if(optionWasPreviouslySelected !== option.selected) {
        option.selected ? this._selectionModel.select(option) : this._selectionModel.deselect(option);
      }
      
      if(isUserInput) this._keyManager.setActiveItem(option);

      if(this.multiple) {
        this._sortValues();
        if(isUserInput) this.focus()
      }
    }

    if(optionWasPreviouslySelected !== this._selectionModel.isSelected(option)) {
      if (this.multiple) {
        emittedValue = (this.selected as RealsoftOption[]).map(option => option.value);
      } else {
        emittedValue = this.selected ? (this.selected as RealsoftOption).value : option.value;
      }
  
      this._value = emittedValue;
      this.valueChange.emit(emittedValue);
      this._onChange(emittedValue);
      this.selectionChange.emit(new RealosftSelectChange(this, emittedValue));
      this._changeDetectorRef.markForCheck();
    }
    this.stateChanges.next();
  }

  ngOnDestroy(): void {
    this._keyManager?.destroy();
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();

    if(this._trackedSelectDialog) {
      const panelID = `${this.id}-panel`;
      removeAriaReferencedId(this._trackedSelectDialog, 'aria-owns', panelID);
      this._trackedSelectDialog = null;
    }
  }
}