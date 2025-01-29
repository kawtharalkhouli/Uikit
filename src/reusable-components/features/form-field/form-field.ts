import { AfterContentChecked, AfterContentInit, afterRender, AfterViewInit, ANIMATION_MODULE_TYPE, booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, contentChild, ContentChild, ContentChildren, ElementRef, inject, Injector, Input, OnDestroy, QueryList, ViewChild, ViewEncapsulation } from "@angular/core";
import { Directionality } from "@angular/cdk/bidi";
import { merge, Subject, Subscription, takeUntil } from "rxjs";
import { AbstractControlDirective } from "@angular/forms";
import { NgTemplateOutlet } from "@angular/common";
import { REALSOFT_FORM_FIELD, REALSOFT_FORM_FIELD_DEFAULT_OPTIONS, RealsoftFloatLabelType, RealsoftFormFieldAppearance, RealsoftFormFieldDefaultOptions, RealsoftSubscriptSizing } from "./models";
import { RealsoftFormFieldAnimations } from "./form-field-animations";
import { getRealsoftFormFieldDuplicateHintError, getRealsoftFormFieldMissingControlError } from "./form-field-errors";
import { REALSOFT_FLOATING_LABEL_PARENT, RealsoftFloatingLabelParent, RealsoftFormFieldFloatingLabel } from "./directives/floating-label";
import { RealsoftFormFieldNotchedOutline } from "./directives/notched-outline";
import { RealsoftFormFieldLineRipple } from "./directives/line-ripple";
import { REALSOFT_HINT, RealsoftHint } from "./directives/hint";
import { RealsoftFormFieldControl } from "./directives/form-field-control";
import { REALSOFT_ERROR, RealsoftError } from "./directives/error";
import { REALSOFT_SUFFIX, RealsoftSuffix } from "./directives/suffix";
import { REALSOFT_PREFIX, RealsoftPrefix } from "./directives/prefix";
import { RealsoftLabel } from "./directives/label";
import { UniqueIdGeneratorService } from "../id-generator";


const REALSOFT_DEFAULT_SUBSCRIPT_SIZING: RealsoftSubscriptSizing = 'fixed';

const REALSOFT_DEFAULT_FLOAT_LABEL: RealsoftFloatLabelType = 'auto';

const REALSOFT_DEFAULT_APPEARANCE: RealsoftFormFieldAppearance = 'outline';



@Component({
    selector: 'realsoft-form-field',
    templateUrl: './form-field.html',
    styleUrl: './form-field.scss',
    animations: [RealsoftFormFieldAnimations.transitionMessages],
    host: {
        'class': 'realsoft-form-field',
        '[class.realsoft-form-field-label-always-float]': '_shouldAlwaysFloat()',
        '[class.realsoft-form-field-has-icon-prefix]': 'hasIconPrefix',
        '[class.realsoft-form-field-has-icon-suffix]': 'hasIconSuffix',
        '[class.realsoft-form-field-invalid]': '_control.errorState',
        '[class.realsoft-form-field-disabled]': '_control.disabled',
        '[class.realsoft-form-field-autofilled]': '_control.autofilled',
        '[class.realsoft-form-field-no-animations]': '_animationMode === "NoopAnimations"',
        '[class.realsoft-form-field-appearance-fill]': 'appearance === "fill"',
        '[class.realsoft-form-field-appearance-outline]': 'appearance === "outline"',
        '[class.realsoft-form-field-hide-placeholder]': '_hasFloatingLabel() && !_shouldLabelFloat()',
        '[class.realsoft-form-field-focused]': '_control.focused',
        '[class.ng-untouched]': '_applyFormClasses("untouched")',
        '[class.ng-touched]': '_applyFormClasses("touched")',
        '[class.ng-pristine]': '_applyFormClasses("pristine")',
        '[class.ng-dirty]': '_applyFormClasses("dirty")',
        '[class.ng-valid]': '_applyFormClasses("valid")',
        '[class.ng-invalid]': '_applyFormClasses("invalid")',
        '[class.ng-pending]': '_applyFormClasses("pending")',
    },
    providers: [
      {provide: REALSOFT_FORM_FIELD, useExisting: RealsoftFormField},
      {provide: REALSOFT_FLOATING_LABEL_PARENT, useExisting: RealsoftFormField},
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        RealsoftFormFieldFloatingLabel,
        RealsoftFormFieldNotchedOutline,
        RealsoftFormFieldLineRipple,
        RealsoftHint,
        NgTemplateOutlet
    ],  
})
export class RealsoftFormField implements RealsoftFloatingLabelParent, AfterViewInit, AfterContentInit, AfterContentChecked, OnDestroy{
    _uniqueIDGenerator = inject(UniqueIdGeneratorService, {optional: true});
    _elementRef = inject(ElementRef);
    //For manual Change Detection
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _direction = inject(Directionality);
    private _defaultOptions = inject<RealsoftFormFieldDefaultOptions>(REALSOFT_FORM_FIELD_DEFAULT_OPTIONS, {optional: true});
    _animationMode = inject(ANIMATION_MODULE_TYPE, {optional: true});
    private _injector = inject(Injector);

    private _destroy = new Subject<void>();
    private _changes : Subscription | undefined;
    private _valueChanges : Subscription | undefined;

    private _focused: boolean | null = null;
    private _currentFormFieldControl: RealsoftFormFieldControl<any>;
    private _previousFormFieldControl: RealsoftFormFieldControl<unknown> | null = null;


    @ViewChild('textField') _textField: ElementRef<HTMLElement>;
    @ViewChild('prefixText') _prefixText: ElementRef<HTMLElement>;
    @ViewChild('prefixIcon') _prefixIcon: ElementRef<HTMLElement>;
    @ViewChild('suffixText') _suffixText: ElementRef<HTMLElement>;
    @ViewChild('suffixIcon') _suffixIcon: ElementRef<HTMLElement>;

    @ViewChild(RealsoftFormFieldNotchedOutline) _notchedOutline: RealsoftFormFieldNotchedOutline | undefined;
    @ViewChild(RealsoftFormFieldLineRipple) _lineRipple: RealsoftFormFieldLineRipple | undefined;

    //Query all possible childrens of the form field
    @ContentChildren(REALSOFT_PREFIX, {descendants: true}) _prefixeElements: QueryList<RealsoftPrefix>;
    @ContentChildren(REALSOFT_SUFFIX, {descendants: true}) _suffixElements: QueryList<RealsoftSuffix>;
    @ContentChildren(REALSOFT_ERROR, {descendants: true}) _errorElements: QueryList<RealsoftError>;
    @ContentChildren(REALSOFT_HINT, {descendants: true}) _hintElements: QueryList<RealsoftHint>;
    @ViewChild(RealsoftFormFieldFloatingLabel) _floatingLabel: RealsoftFormFieldFloatingLabel | undefined;


    @ContentChild(RealsoftFormFieldControl) _formFieldControl: RealsoftFormFieldControl<any>;
    private readonly _labelElement = contentChild(RealsoftLabel);

    //Unique id for the internal form field label
    readonly _labelId = this._uniqueIDGenerator.generateID('realsoft-form-field-label-');
    readonly _hintId = this._uniqueIDGenerator.generateID('realsoft-hint-');
    getLabelId = computed(() => (this._hasFloatingLabel() ? this._labelId : null));

    //Class Properties 
    private _hideRequiredMarker = false;
    private _floatLabel: RealsoftFloatLabelType;
    private _appearance: RealsoftFormFieldAppearance = 'outline';
    private _hintLabel = '';
    private _hasIconPrefix = false;
    private _hasTextPrefix = false;
    private _hasIconSuffix = false;
    private _hasTextSuffix = false;
    private _oultineLabelOffsetUpdateNeeded = false;
    private _subscriptSizing: RealsoftSubscriptSizing | null = null;
    _subscriptsAnimationState = ''; //state of the realsoft-hint and realsoft-error animations.

    //Class getters
    get hasIconPrefix(): boolean {
        return this._hasIconPrefix;
    }

    get hasTextPrefix(): boolean {
        return this._hasTextPrefix;
    }

    get hasIconSuffix(): boolean {
        return this._hasIconSuffix;
    }

    get hasTextSuffix(): boolean {
        return this._hasTextSuffix;
    }

    _hasFloatingLabel = computed(() => !!this._labelElement());


    //Whether the required marker should be hidden 
    @Input({transform: booleanAttribute})
    get hideRequiredMarker(): boolean {
        return this._hideRequiredMarker;
    }
    set hideRequiredMarker(value: boolean) {
        this._hideRequiredMarker = value;
    }

    //Whether the label should always float ir float as the user types
    @Input()
    get floatLabel(): RealsoftFloatLabelType {
        return this._floatLabel || this._defaultOptions?.floatLabel || REALSOFT_DEFAULT_FLOAT_LABEL;
    }
    set floatLabel(value: RealsoftFloatLabelType) {
        if(value !== this._floatLabel) {
            this._floatLabel = value;
            this._changeDetectorRef.markForCheck();
        }
    }

    //The Form Field Appearance Style
    @Input()
    get appearance(): RealsoftFormFieldAppearance {
        return this._appearance;
    }
    set appearance(value: RealsoftFormFieldAppearance) {
        const previousValue = this._appearance;
        this._appearance = value || this._defaultOptions?.appearance || REALSOFT_DEFAULT_APPEARANCE;

        if(this._appearance === 'outline' && this._appearance !== previousValue) {
            this._oultineLabelOffsetUpdateNeeded = true;
        }
    }

    //Whether the form field should reserve space for one line of hint/error text(default) or to have the spacing grow from 0px as needed based on the size of the hint/error context. 
    @Input()
    get subscriptSizing(): RealsoftSubscriptSizing {
        return this._subscriptSizing || this._defaultOptions?.subscriptSizing || REALSOFT_DEFAULT_SUBSCRIPT_SIZING;
    }
    set subscriptSizing(value: RealsoftSubscriptSizing) {
        this._subscriptSizing = value || this._defaultOptions?.subscriptSizing || REALSOFT_DEFAULT_SUBSCRIPT_SIZING;
    }

    //Text for the form field hint 
    @Input()
    get hintLabel(): string {
        return this._hintLabel; 
    }
    set hintLabel(value: string) {
        this._hintLabel = value;
        this._validatingHints();
    }

    constructor() {
        if(this._defaultOptions?.appearance) {
            this.appearance = this._defaultOptions?.appearance;
        }
        if(this._defaultOptions?.hideRequiredMarker) {
            this.hideRequiredMarker = this._defaultOptions?.hideRequiredMarker;
        }
    }

    //Lifecycle Hooks Implementation
    ngAfterViewInit(): void {
        this._updatingFormFieldFocusState();
        this._subscriptsAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    }

    ngAfterContentInit(): void {
        this._formControlPresenceCheck();
        this._initializeHintErrorSubscripts();
        this._initializePrefixAndSuffix();
        this._initOutlineLabelOffset();
    }

    ngAfterContentChecked() {
        this._formControlPresenceCheck();

        if(this._control !== this._previousFormFieldControl) {
            this._controlInitialization(this._previousFormFieldControl);
            this._previousFormFieldControl = this._control;
        }

    }

    //get the current form field control 
    get _control(): RealsoftFormFieldControl<any> {
        return this._currentFormFieldControl || this._formFieldControl;
    }
    set _control(value) {
        this._currentFormFieldControl = value;
    }

    getConnectedOverlayOrigin(): ElementRef {
        return this._textField || this._elementRef;
    }

    _lockLabel(): void {
        if(this._hasFloatingLabel()) this.floatLabel = 'always';
    }

  private _validatingHints() {
    if (this._hintElements) {
        let startHint: RealsoftHint;
        let endHint: RealsoftHint;

        this._hintElements.forEach((hint: RealsoftHint) => {
            if(hint.align === 'start') {
                if(startHint || this.hintLabel) {
                    throw getRealsoftFormFieldDuplicateHintError('start');
                }
                startHint = hint;
            }
            else if(hint.align === 'end') {
                if(endHint || this.hintLabel) {
                    throw getRealsoftFormFieldDuplicateHintError('end');
                }
                endHint = hint;
            }
        })

    }
  }

   _isOutline(): boolean {
    return this.appearance === 'outline';
   }

  _handleLabelResized(): void {
    this._recalculateOutlineNotchWidth();
  }

  _shouldAlwaysFloat() {
    return this.floatLabel === 'always';
  }

  _shouldLabelFloat(): boolean {
    if (!this._hasFloatingLabel()) {
      return false;
    }
    return this._control.shouldLabelFloat || this._shouldAlwaysFloat();
  }


  //Determines the class to be applied on the host element based on the control property
  _applyFormClasses(property: keyof AbstractControlDirective): boolean {
    const control = this._control ? this._control.ngControl : null;
    return control && control[property];
  }

  _getMessagesToDisplay(): 'error' | 'hint' { 
    return this._errorElements && this._errorElements.length > 0 && this._control.errorState ? 'error' : 'hint';
  }

  private _updatingFormFieldFocusState() {
    //Focus State is handled by checking if the abstract form field control focused state changes
    if(this._control.focused && !this._focused) {
        this._focused = true;
        this._lineRipple?.activateRipple();
    } else if (!this._control.focused && (this._focused || this._focused === null)) {
        this._focused = false;
        this._lineRipple?.deactivateRipple();
    }
    this._textField?.nativeElement.classList.toggle('realsoft-text-field-focused', this._control.focused);
  }


  private _recalculateOutlineNotchWidth() {
    if(!this._isOutline() || !this._floatingLabel || !this._shouldLabelFloat()) {
        this._notchedOutline._setNotchWidth(0);
    } else {
        this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth());
    }
  }


  private _formControlPresenceCheck() {
    if(!this._control) {
        throw getRealsoftFormFieldMissingControlError()
    }
  }

  private _initializeHintErrorSubscripts() {
    this._hintElements.changes.subscribe(() => {
        this._validatingHints();
        this._changeDetectorRef.markForCheck();
    });

    this._errorElements.changes.subscribe(() => {
        this._changeDetectorRef.markForCheck();
    });

    this._validatingHints();

  }

 
  private _initializePrefixAndSuffix() {
    this._checkPrefixTypes();
    this._checkSuffixTypes();

    merge(this._prefixeElements.changes, this._suffixElements.changes).subscribe(() => {
        this._checkPrefixTypes();
        this._checkSuffixTypes();
        this._changeDetectorRef.markForCheck();
    });
  }

  private _checkPrefixTypes() {
    this._hasIconPrefix = !!this._prefixeElements.find(prefixElement => !prefixElement._isText);
    this._hasTextPrefix = !!this._prefixeElements.find(prefixElement => prefixElement._isText);
  }

  private _checkSuffixTypes() {
    this._hasIconSuffix = !!this._suffixElements.find(suffixElement => !suffixElement._isText);
    this._hasTextSuffix = !!this._suffixElements.find(suffixElement => suffixElement._isText);
  }


  private _initOutlineLabelOffset() {
    this._prefixeElements.changes.subscribe(() => this._oultineLabelOffsetUpdateNeeded = true);
    afterRender(
        () => {
          if (this._oultineLabelOffsetUpdateNeeded) {
            this._oultineLabelOffsetUpdateNeeded = false;
            this._updateOutlineLabelOffset();
          }
        },
        {
          injector: this._injector,
        },
      );

    this._direction.change.pipe(takeUntil(this._destroy)).subscribe(() => this._oultineLabelOffsetUpdateNeeded = true);
  }

  private _updateOutlineLabelOffset() {
    if(this.appearance !== 'outline' || !this._floatingLabel) return;

    //Reset the outline label offset if no prefix is displayed
    if(!(this._prefixText || this._prefixIcon)) {
        this._resetFloatingLabel();
        return;
    }

    //Wait for the form field to be present in the DOM to triggere the label offset update 
    if(!this._formFieldConnectedToDOM) {
        this._oultineLabelOffsetUpdateNeeded = true;
        return;
    }
    this._calculateLabelOffsetWidth();

    //Update the notch width respectively  when prefix and suffix exist
    this._calculateNotchWidth();
  }

  private _resetFloatingLabel() {
    this._floatingLabel.element.style.transform  = '';
  }

  private _formFieldConnectedToDOM() {
    const element = this._elementRef.nativeElement; 
    return document.documentElement.contains(element);
  }

  private _calculateLabelOffsetWidth() {
    const iconPrefixContentWidth = this._prefixIcon?.nativeElement?.getBoundingClientRect().width ?? 0;
    const textPrefixContentWidth = this._prefixText?.nativeElement?.getBoundingClientRect().width ?? 0;

    //RTL Support 
    const direction = this._direction.value === 'rtl' ? '-1' : '1';
    const prefixWidth = `${iconPrefixContentWidth + textPrefixContentWidth}px`;
    const labelOffset = `calc(${direction} * (${prefixWidth} + var(--realsoft-form-field-label-offset-x, 0px)))`;

    this._floatingLabel.element.style.transform = `var(--realsoft-form-field-label-transform, translateY(-50%) translateX(${labelOffset})`;
  }

  private _calculateNotchWidth() {
    const prefixIconWidth = this._prefixIcon.nativeElement.getBoundingClientRect().width ?? 0;
    const prefixTextWidth = this._prefixText.nativeElement.getBoundingClientRect().width ?? 0;
    const suffixIconWidth = this._suffixIcon.nativeElement.getBoundingClientRect().width ?? 0;
    const suffixTextWidth = this._suffixText.nativeElement.getBoundingClientRect().width ?? 0;

    const prefixAndSuffixWidth = prefixIconWidth + prefixTextWidth + suffixIconWidth + suffixTextWidth;

    this._elementRef.nativeElement.style.setProperty('--realsoft-form-field-notch-max-width', `calc(100% - ${prefixAndSuffixWidth}px)`);
  }

  private _controlInitialization(previousControl: RealsoftFormFieldControl<unknown> | null) {
    const controlTypePrefixClass = 'realsoft-form-field-type-';

    if(previousControl) this._elementRef.nativeElement.classList.remove(controlTypePrefixClass + previousControl.controlType);

    if(this._control.controlType) this._elementRef.nativeElement.classList.add(controlTypePrefixClass + this._control.controlType);

    this._childControlStateChangesUpdate();

    this._childControlValueChangesUpdate();

  }

  private _childControlStateChangesUpdate() {
    this._changes?.unsubscribe();//Kill the previous subscription
    this._changes = this._control.stateChanges.subscribe(() => {
        this._updatingFormFieldFocusState();
        this._changeDetectorRef.markForCheck();
    });
  }

  private _childControlValueChangesUpdate() {
    this._valueChanges?.unsubscribe();//Kill the previous subscription 
    if(this._control.ngControl && this._control.ngControl.valueChanges) {
        this._valueChanges = this._control.ngControl.valueChanges.pipe(takeUntil(this._destroy)).subscribe(() => this._changeDetectorRef.markForCheck());
    }
  }

  ngOnDestroy(): void {
    this._changes.unsubscribe();//Kill the subscription 
    this._valueChanges?.unsubscribe();
    this._destroy.next();
    this._destroy.complete();
  }
}