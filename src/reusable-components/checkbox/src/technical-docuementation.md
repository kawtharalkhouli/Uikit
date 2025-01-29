

# Technical Documentation 

## Checkbox Configurations 

***Checkbox Click Action***

```js
   export type RealsoftCheckboxClickAction = 'noop' | 'check' | 'check-indeterminate' | undefined; 
```

The `RealsoftCheckboxClickAction` type alias determines the possible types of click actions when the user clicks on the input element. 
1. `noop` => Neither toggle checked nor indeterminate. 
2. `check` => Only toggle checked status and ignore indeterminate. 
3. `check-indeterminate` => Toggle checked status, and set indeterminate to false => This is the default behavior.
4. undefined => Same as `check-indeterminate`.

***Checkbox Default Options Interface***

```js
   export interface RealsoftCheckboxDefaultOptions {
    clickAction?: RealsoftCheckboxClickAction;
    disabledInteractive?: boolean
   }
```
The `RealsoftCheckboxDefaultOptions` interface represents the default options for the checkbox which can be overriden. 
1. `clickAction` => The default checkbox click action. 
2. `disabledInteractive` => Whether disabled checkboxes should be interactive.

***Injection Token that can be used to override the default options for the checkbox***

The code snippet defines an Angular Injection Token called `REALSOFT_CHECKBOX_DEFAULT_OPTIONS`, which is used to provide default configuration options for the checkbox component. 

```js
   export const REALSOFT_CHECKBOX_DEFAULT_OPTIONS = new InjectionToken<RealsoftCheckboxDefaultOptions>(
    'realsoft-checkbox-default-options', {
        providedIn: 'root',
        factory: REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY
    }
   );

   export function REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): RealsoftCheckboxDefaultOptions {
    return {
        clickAction: 'check-indeterminate',
        disabledInteractive: false
    }
   };

   export const defaultConfig = REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY(); 
```
**Injection Token**
* The usage of injection token is to allow to define a token to retrieve a dependency which in this case is the default options for `RealsoftCheckbox`.
* Name of the token => `realsoft-checkbox-default-options`
* Generic Type => `RealsoftCheckboxDefaultOptions`
* options passed to the InjectionToken constructor => 

1. `providedIn: 'root'` => Indicates that this token is available at the root level, meaning it can be injected anywhere in the application without explicitly adding it to any module's provider array. 
2. `factory` => A factory function (`REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY`) that provide the default value for this token.

**Factory Function**
* The `REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY` function defines the default configuration for `RealsoftCheckbox`. It returns an object with the default options: 
1. clickAction => `check-indeterminate` => This specifies the behavior of the checkbox when clicked.
2. disabledInteractive => false => This indicates whether the checkbox should have interactive behavior when it is disabled. A value of false suggests that even when the checkbox is disabled, it cannot be interactied with. 

**Default Configuration**
The default configuration of the checkbox is stored in `defaultConfig` and publicly exported. 

***Checkbox Change Event Object***

```js
   export class RealsoftCheckboxChange {
    source: RealsoftCheckbox;
    checked: boolean;
   }
```
* The `RealsoftCheckboxChange` is the change event object that will be emitted by the checkbox.
* It includes the following properties: 
1. source =>  The source checkbox of the event => An instance of the Checkbox Component Triggering the event.
2. checked => The new value of the checkbox representing whether the checkbox is checked or not.

***Checkbox Transition State***

The `RealsoftCheckboxTransitionState` enumeration provides a way to manage and track the transitions and states of a checkbox in a clear and type safe manner. It's used to control the behavior of the checkbox component in UI, such as animations, visual changes and certain logic that depends on the checkbox's state. 

```js
   export enum RealsoftCheckboxTransitionState {
    Initial, 
    Checked,
    Unchecked,
    indeterminate
   }
```
1. `Initial` => Represents the starting state of the checkbox before any user interaction. Which is when the checkbox is first rendered and has not been clicked or changed by the user. 

2. `Checked` => Represents the state when the checkbox is becoming checked(selected). This happens when a user clicks on the checkbox to select it or programmatically sets its state to checked.

3. `Unchecked` => Represents the state when the checkbox is becoming unchecked(deselected). This happens when a user unchecks the checkbox or it is programmatically set to be unchecked. 

4. `indeterminate` => Represents the state when the checkbox become indeterminate(Mixed mode) aka neither checked nor unchecked. This happens when a parent checkbox indicates a partial selection of child checkboxes.


***Value Accessors Providers*** 
The two providers integrate the `RealsoftCheckbox` components with Angular's forms system by: 

1. Allowing it to act as a `ControlValueAccessor`, making it compatible with form controls for managing values.
2. Allowing it to act as a `Validator`, making it capable of contributing custom validation logic.


```js
    export const REALSOFT_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RealsoftCheckbox),
        multi: true
    }
  
    export const  REALSOFT_CHECKBOX_VALIDATOR_ACCESSOR: any = {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => RealsoftCheckbox),
        multi: true
    }
```
**REALSOFT_CHECKBOX_CONTROL_VALUE_ACCESSOR** 
1. This is a provider for the `NG_VALUE_ACCESSOR` token, which Angular uses to find and interact with a custom control in a reactive or template-driven form.

2. `provide: NG_VALUE_ACCESSOR` => Tells Angular that the provider is for `NG_VALUE_ACCESSOR`: A built-in token in angular used to associate a form control with its value accessor. 

3. `useExisting: forwardRef(() => RealsoftCheckbox)` => Refers to the `RealsoftCheckbox` component as the implementation of the `ControlValueAccessor` interface. Since `RealsoftCheckbox` is defined later in the file, forwardRef is used to create a reference to it before it's declared. This prevents circular dependency issues. 

4. `multi: true` => This allows multiple providers to be associated with the `NG_VALUE_ACCESSOR` token. It ensures that this custom control doesn't replace other `NG_VALUE_ACCESSOR` implementations. 

**REALSOFT_CHECKBOX_VALIDATOR_ACCESSOR**
1. This is a provider for the `NG_VALIDATORS` token, which Angular uses to find custom validators.

2. `provide: NG_VALIDATORS` => This tells Angular that the provider is for `NG_VALIDATORS`: a built-in token Angular uses to associate form controls with custom validators. 

3. `useExisting: forwardRef(() => RealsoftCheckbox)` => Refers to the `RealsoftCheckbox` component as the implementation of the `Validator` interface. Since `RealsoftCheckbox` is defined later in the file, forwardRef is used to create a reference to it before it's declared. This prevents circular dependency issues. 

4. `multi: true` => This ensures that `RealsoftCheckbox` doesn't replace other validators already associated with `NG_VALIDATORS`

## Component's Meta Data 

```js
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
        REALSOFT_CHECKBOX_CONTROL_VALUE_ACCESSOR, REALSOFT_CHECKBOX_VALIDATOR_ACCESSOR
    ],
    imports : [RealsoftInternalFormField]
})

```


1. `selector` => Defines the HTML tag `realsoft-checkbox` used to represent this component. 
2. `exportAs` => Allows this component to be referenced in template using the name `realsoftCheckbox` => (e.g., via #ref="realsoftCheckbox"). 
3. `standalone` => Indicates that this is a standalone component and doesn't depend on Angular Modules for usage. 
4. `host` =>

* Specifies the host element's bindings and classes. 
* `class` => Adds a base CSS class aka: `realsoft-checkbox` to the host element. 
* Dynamic Class Bindings => Various `[class.*]` bindings that dynamically set classes on the host element based on certain component properties. 
`realsoft-checkbox-no-animation` class is applied whenever animations are disabled.
`realsoft-checkbox-disabled` class is applied whenever the native input element is disabled. 
`realsoft-checkbox-checked` class is applied whenever the native input element is checked.
`realsoft-checkbox-disabled-interactive` class is applied whenever the native input element is said to remain active when disabled. 
`realsoft-checkbox-indeterminate` class is applied whenever the native input element is in the indeterminate state which is also known as the mixed mode. 
* Dynamic Attribute Bindings => Various `[attr.*]` bindings that dynamically set attributes on the host element based on component properties. 
* `[id]` => Dynamically assigns the component's `id`. 

5. `encapsulation` => Uses `ViewEncapsulation.None` to disable all style encapsulation for the component. and all styles in `checkbox.scss` are applied globally without scoping to this component. 
6. `changeDetection` => Uses `ChangeDetectionStrategy.OnPush` for improved performance, ensuring the view only updates when its inputs change. 
7. `providers` => Configures Dependency Injection, registers the components as a custom form control enabling it to work with both Reactive Forms and Template Driven Forms, while also handling validation. 
8. `imports` => The component depends on `RealsoftInternalFormField` standalone component for handling the label position to either be placed before or after the checkbox. 

## Dependency Injection 

    ```js
        private _changeDetectorRef = inject(ChangeDetectorRef);
    ```
    This injects Angular's `ChangeDetectorRef` which allows manual triggering of change detection, this is used when the components needs to update its view for certain changes that Angular doesn't automatically detect aka changes happening outside the Angular zone. 

    ```js
    element = inject<ElementRef<HTMLElement>>(ElementRef);
    ```
    This injects the `ElementRef` for the host element of the component to provide a reference to the actual DOM element which is `<realsoft-checkbox>` in this case. The type parameter `<HTMLElement>` indicates that the type of the native element, making the reference type-safe. 

    ```js
    _animation? = inject(ANIMATION_MODULE_TYPE, {optional: true});
    ```
    This injects `ANIMATION_MODULE_TYPE` which identifies whether the Angular Animation module is loaded. It basically helps in determining whether animations are enabled (`BrowserAnimationsModule`) or disabled (`NoopAnimationsModule`). The `{optional: true}` flag ensures that the injection won't throw an error if `ANIMATION_MODULE_TYPE` is not provided. The optional property `?` indicates that `_animation` can be undefined. 

    ```js
    private _options = inject<RealsoftCheckboxDefaultOptions>(REALSOFT_CHECKBOX_DEFAULT_OPTIONS, {optional: true});
    ```
    This injects custom default options for the checkbox component. The `REALSOFT_CHECKBOX_DEFAULT_OPTIONS` is an Injection Token that provides default configuration values (e.g. default click actions of the checkbox). The `{optional: true}` flag ensures the injection won't fail if the defaults aren't explicitly provided. 

    ```js
    _tabIndex = inject(new HostAttributeToken('tabindex'), {optional: true});
    ```
    1. The following code snippet uses `HostAttributeToken` which is a special type of token from the `@angular/core` that allows you to request attributes from host element in Angular.
    2. The `new HostAttributeToken('tabindex')` tells Angular to look for the `tabIndex` attribute on the host element. 
    3. The `{optional: true}` option makes the injection optional. Such that if the `tabIndex` attribute is not present on the host element, the `inject()` function will return null instead of throwing an error. 

    ```js
    private _ngZone = inject(NgZone);
    ```
    This injects Angular's `NgZone` which allows you to manage and control how Angular's change detection interacts with asynchronous tasks. And for this component, it's used to run `runOutsideAngular` to perform tasks that don't need change detection to be triggered. 

## Template References 

Fetches a reference to the native `<input type="checkbox">` element in the template. So that it can be used later on. 
```js
   @ViewChild('input') _input : ElementRef<HTMLInputElement>; 
```

Fetches a reference to the native `<label>` element in the template. 
```js
   @ViewChild('label') _label : ElementRef<HTMLInputElement>; 
```

## Component's Input Bindings 

### Input Bindings
```js
    @Input({transform: booleanAttribute}) required: boolean;

    @Input({transform: booleanAttribute}) disableRipple: boolean;

    @Input({transform: booleanAttribute}) disabledInteractive: boolean;

    @Input() id: string;

    @Input() labelPosition: 'after' | 'before' = 'after';

    @Input() name: string | null = null;

    @Input({transform: booleanAttribute}) required: boolean;

    @Input() value: string;

    @Input() tabIndex: number;

    @Input('aria-describedby') ariaDescribedby: string; 

    @Input('aria-label') ariaLabel: string;

    @Input('aria-labelledby') ariaLabelledby: string | null = null;
```
**Notes on why transform: booleanAttribute is used here**
1. Automatic Boolean Conversion => Using `booleanAttribute` ensures that string values such as "true", "false", or empty strings "" values are automatically converted to a proper boolean. 

2. Simplifying Handling Default Behavior => Without `booleanAttribute` you'd need to manually parse and handle these values, which can lead to error-prone code. `booleanAttribute` ensures the value is always correctly interpreted as a boolean hence reducing bugs. 


### Checked State Input Binding
The `checked` input represents whether the component is in a checked state or not. 
```js
   @Input({transform: booleanAttribute})
    get checked(): boolean {
        return this._checked;
    }
    set checked(value: boolean) {
        if(value != this.checked){
            this._checked = value;
            this._changeDetectorRef.markForCheck();
        }
    }
```
***Notes***
1. The property accepts a boolean value. The `@Input` decorator uses the `booleanAttribute` transform to automatically convert attribute values like `true`, `false`, or absence of the attribute into a proper boolean.

2. when the value is changed, the setter ensures: 

* The new value is different from the current value to avoid triggering unnecessary change detection. "Optimization"
* The `_checked` state is updated.
* Angular's change detection is marked to update the view accordingly.  

### Disabled State Input Binding

```js
   @Input({transform: booleanAttribute}) 
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        if (value !== this.disabled) {
            this._disabled = value;
            this._changeDetectorRef.markForCheck();
        }
    }
```

***Notes***
1. The property accepts a boolean value. The `@Input` decorator uses the `booleanAttribute` transform to automatically convert attribute values like `true`, `false`, or absence of the attribute into a proper boolean.

2. when the value is changed, the setter ensures: 

* The new value is different from the current value to avoid triggering unnecessary change detection. "Optimization"
* The `_disabled` state is updated.
* Angular's change detection is marked to update the view accordingly. 

### Indeterminate State Input Binding

```js
    @Input({transform: booleanAttribute})
    get indeterminate(): boolean {
        return this._indeterminate;
    }
    set indeterminate(value: boolean) {
        const valueHasChanged = this._indeterminate !== value;
        this._indeterminate = this._input.nativeElement.indeterminate= value;
        if(valueHasChanged) {
            if(this._indeterminate){
                this._checkboxTransitionState(RealsoftCheckboxTransitionState.indeterminate);
            } else {
                if(this._checked){
                    this._checkboxTransitionState(RealsoftCheckboxTransitionState.Checked)
                } else{
                    this._checkboxTransitionState(RealsoftCheckboxTransitionState.Unchecked)
                }
                this.indeterminateChange.emit(this._indeterminate);
            }

        }

    }
```

***Notes***
1. The property accepts a boolean value. The `@Input` decorator uses the `booleanAttribute` transform to automatically convert attribute values like `true`, `false`, or absence of the attribute into a proper boolean.

2. The setter does the following: 
* First checks if the new value is different from the current value to determine if further actions are necessary. 
* It synchronizes the internal `_indeterminate` property with the indeterminate state of the native input element.
* State Management and Transition: 

If the indeterminate value changes: 
- If indeterminate is true, the component transitions to the indeterminate state. 
- If indetermiate is false, it checks whether the checkbox is in a checked or unchecked state and transitions accordingly. 

When the state changes, the `indeterminateChange` event is emitted.

## Output Emitters 

```js 
    @Output() change: EventEmitter<RealsoftCheckboxChange> = new EventEmitter<RealsoftCheckboxChange>();

    @Output() indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
```

## Animation Classes Logic and Transition States 

***Animation Classes***

```js
   private _animationClasses = new Map<string, string>([
        ['uncheckedToChecked', 'realsoft-checkbox-unchecked-checked-animation'],
        ['uncheckedToIndeterminate', 'realsoft-checkbox-unchecked-indeterminate-animation'],
        ['checkedToUnchecked', 'realsoft-checkbox-checked-unchecked-animation'],
        ['checkedToIndeterminate', 'realsoft-checkbox-checked-indeterminate-animation'],
        ['indeterminateToChecked', 'realsoft-checkbox-indeterminate-checked-animation'],
        ['indeterminateToUnchecked', 'realsoft-checkbox-indeterminate-unchecked-animation']
    ]);
```
The above code snippet resembles a map between the transition state of the checkbox and the corresponding animation class to be applied when triggered.

1. The `realsoft-checkbox-unchecked-checked-animation` animation class needs to be applied on the native input element whenever the transition state of the checkbox is `uncheckedToChecked` aka the checkbox previous state was `unchecked` and the current state is `checked`. 

2. The `realsoft-checkbox-unchecked-indeterminate-animation` animation class needs to be applied on the native input element whenever the transition state of the checkbox is `uncheckedToIndeterminate` aka the checkbox previous state was `unchecked` and the current state is `indeterminate`.

3. The `realsoft-checkbox-checked-unchecked-animation` animation class needs to be applied on the native input element whenever the transition state of the checkbox is `checkedToUnchecked` aka the checkbox previous state was `checked` and the current state is `unchecked`.

4. The `realsoft-checkbox-checked-indeterminate-animation` animation class needs to be applied on the native input element whenever the transition state of the checkbox is `checkedToIndeterminate` aka the checkbox previous state was `checked` and the current state is `indeterminate`.

5. The `realsoft-checkbox-indeterminate-checked-animation` animation class needs to be applied on the native input element whenever the transition state of the checkbox is `indeterminateToChecked` aka the checkbox previous state was `indeterminate` and the current state is `checked`.

6. The `realsoft-checkbox-indeterminate-unchecked-animation` animation class needs to be applied on the native input element whenever the transition state of the checkbox is `indeterminateToUnchecked` aka the checkbox previous state was `indeterminate` and the current state is `unchecked`. 

***Animation Classes Getter Method***

```js
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
```
* The above code snippet is the getter method for the animation classes that will be used whenever the checkbox is transitioning from one state to another to add the animation class to the native input element. 

* The method returns a string that represents the name of the animation class to be applied on the native input element. 

* The method accepts two input parameters => `previousState` and  `nextState`, where both of them resemble the previous state of the checkbox and the next state of the checkbox. 

* If animations are disabled then fallback and return an empty string indicating that no animation classes are to be applied on the native input element. 

***Breaking the code to multiple blocks***

**First Case**
```js
   case RealsoftCheckboxTransitionState.Initial : 
        if(nextState === RealsoftCheckboxTransitionState.Checked){
            return this._animationClasses.get('uncheckedToChecked');
        } 
        else if (nextState === RealsoftCheckboxTransitionState.indeterminate){
            return this._checked ? this._animationClasses.get('checkedToIndeterminate') : this._animationClasses.get('uncheckedToIndeterminate');
        }
    break;
```
* If the previous state of the checkbox is the initial state aka the user has still not interacted with the checkbox, the possible next states can either be `checked` or `indeterminate`. 

* If the user has still not interacted with the checkbox and the next state is `checked` then the transition state is `uncheckedToChecked` which can be used to access the needed animation class from the the `_animationClasses` Map. 

* If the user has still not interacted with the checbox and the next state is `indeterminate` then we need to check whether the `checked` property is true or not. This is a corner case where the user might not had interacted with the input but the checkbox might be a select all checkbox that is checked or not. If `checked` is true then the transition state is `checkedToIndeterminate` otherwise ist's `uncheckedToIndeterminate`. **NOTE** => Indeterminate mode is set programmatically rather than via interaction that's why it's needed to check for the `checked` state of the input. 

**Second Case**
```js
   case RealsoftCheckboxTransitionState.Checked :
        return nextState === RealsoftCheckboxTransitionState.Unchecked ? this._animationClasses.get('checkedToUnchecked') : this._animationClasses.get('checkedToIndeterminate');
```

* If the previous state of the checkbox is `checked` and the next state is `unchecked` then the transition state is `checkedToUnchecked`.
* If the previous state of the checkbox is `checked` and the next state is `indeterminate` then the transition state is `checkedToIndeterminate`.

**Third Case**
```js
   case RealsoftCheckboxTransitionState.indeterminate :
        return nextState === RealsoftCheckboxTransitionState.Checked ? this._animationClasses.get('indeterminateToChecked') : this._animationClasses.get('indeterminateToUnchecked');
```
* If the previous state of the checkbox is `indeterminate` and the next state is `checked` then the transition state is `indeterminateToChecked`.
* If the previous state of the checkbox is `indeterminate` and the state is `unchecked` then the transition state is `indeterminateToUnchecked`.

**Fourth Case**
```js
   case RealsoftCheckboxTransitionState.Unchecked :
        return nextState === RealsoftCheckboxTransitionState.Checked ? this._animationClasses.get('uncheckedToChecked') : this._animationClasses.get('uncheckedToIndeterminate');
```
* If the previous state of the checkbox is `unchecked` and the next state is `checked` then the transition is `uncheckedToChecked`. 
* If the previous state of the checkbox is `unchecked` and the next state is `indeterminate` then the transition state is `uncheckedToIndeterminate`.

**Fifth Case**
```js
   return '';
```
If the code breakes and for some reason none of the cases match then as a fallback return an empty string. 

***Transition State Method***
Whenever the state of the checkbox changes either via input click or via keyboard or certain logic the `_checkboxTransitionState` is applied to apply the needed animation class. 

```js
    private _checkboxTransitionState(nextState: RealsoftCheckboxTransitionState) {
        let previousState = this._transitionState;
        let element = this._input.nativeElement;

        if (previousState === nextState || !element) return;

        if(this._animationClass) element.classList.remove(this._animationClass);

        this._animationClass = this._getAnimationClasses(previousState, nextState);

        this._transitionState = nextState;

        element.classList.add(this._animationClass);

        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                element.classList.remove(this._animationClass);
            }, 1000)
        });
    }
```

* The method doesn't return anything, it simply invokes the needed animation class on the native input element and removes it after 1 second.

* The method accepts one input parameter that resembles the next state of the checkbox. No need of passing the previous state of the checkbox, as it will be stored in the `_transitionState` property. 

***Breaking the code into multiple blocks***
1. First Block
```js
   let previousState = this._transitionState; 
   let element = this._input.nativeElement;
```

* The method first stores the previous state of the checkbox into a variable to be used later before changing the current transition state of the checkbox. 

* The method gets the native input element so that the animation class can be applied to it. 

2. Second Block

```js
    if (previousState === nextState || !element) return;
        
    if(this._animationClass) element.classList.remove(this._animationClass);
```
* The first if statement is a fallback in case the previous state is the same as the next state which is unlikely to happen, but so that the code doesn't break the if statement is there as a fallback. 

* Make sure to remove the previous animation class from the native input element in case there were any to make sure that multiple animation classes don't coexist. 

3. Third Block

```js
    this._transitionState = nextState;

    element.classList.add(this._animationClass);

    //Animation Should be added for a second then removed, also change detection should not be triggered 
    this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
            element.classList.remove(this._animationClass);
        }, 1000)
    });
```
* Update the transition state with the new state so that they're in sync. 
* Add the new Animation Class to the native input element. And after 1 second remove it. 

**NOTE** => **NgZone Usage for preventing Unnecessary Change Detection**

* The usage of `_ngZone.runOutsideAngular` is to improve performance by preventing Angular's change detection mechanism from being triggered unnecessarily. 

* Since Angular uses `NgZone` to track asynchronous operations (like setTimeout, Promise or DOM events) and run change detection automatically when these operations complete. However, running change detection frequently can be a performance bottleneck, especially when change detection is not necessary for certain operations like this case in which removing the animation class after 1 second won't require change detection to occur.

* The `runOutsideAngular` method => It allows exceuting code outside of Angular's Zone. Meaning Angular won't trigger change detection for the specified code block.

* The benefits of using `NgZone` is improving performance, since preventing unnecessary change detection reduces the overhead. Especially in scenarios with frequent or repetitive DOM updates. It also ensures that Angular's change detection only runs when absolutely necessary, keeping the component more efficient.

## Input Logic

### Input Synchronization Logic
In several cases the input state needs to be synchronized with the changes happening. Since, this is used throughout the component, it is written into a reusable function for code readability. 

```js
    private _inputSync(): void {
        this._input.nativeElement.checked = this.checked; 
        this._input.nativeElement.indeterminate = this.indeterminate;
    }
```

### Input Click Logic

```js
    protected _inputClick() {
        const action = this._options?.clickAction;

        if(!this.disabled && action !== 'noop') {
            if(this.indeterminate && action !== 'check'){
                this._indeterminate = false; 
                this.indeterminateChange.emit(this._indeterminate);
            }

            this._checked = !this._checked; 

            this._checkboxTransitionState(this._checked ? RealsoftCheckboxTransitionState.Checked : RealsoftCheckboxTransitionState.Unchecked);
            this._emiteChangeEvent(); 
        } 

        else if (!this.disabled && action === 'noop') {
            this._inputSync();
        }

        else if(this.disabled || this.disabledInteractive) {
            this._inputSync();
        }

    }
```
- The `_inputClick()` method is called internally when a user interacts with the checkbox via a click event. The functionality depends on the component's configuration (`_options`) and state (`disabled`, `indeterminate`).

***Behavior Logic***
* Step 1: Check Disabled State => If the checkbox is `disabled` or `disabledInteractive`, it calls `_inputSync()` to synchronize the input state and exits.

* Step 2: Retrieve the click action from `_options` => Once retrieved, here are the possible case scenarios:
***The input is not disabled, and the click action is not `noop` (Neither toggle checked nor indeterminate)***

- The checkbox is `indeterminate` and the action is not `check`. 
1. Reset the indeterminate state to false. 
2. Emit the `indeterminateChange` event. 

- Toggle the checked state of the checkbox. 
- Trigger the transition state (`checked` or `unchecked`). 
- Emit a change event. 

***The input click action is `noop` (Neither toggle checked nor indeterminate)***
Ensure the is input state is synchronized by calling `_inputSync()`.

***The input is disabled***
Ensure the is input state is synchronized by calling `_inputSync()`.


## Implementing the ControlValueAccessor Interface 
The `RealsoftCheckbox` component implements the `ControlValueAccessor` interface to ensure that the component integrates seamlessly with Angular's forms API. 

### Properties 

```js
   _onTouched: () => any = () => {};
```
A function reference for handling the blur event of the component. Angular will call this function to indicate that the control has been "touched" (i.e., the user has interacted with it, even if they haven't changed its value).


```js
   private _controlValueAccessorChangeFn: (value: any) => void = () => {};
```
A function reference used to notify Angular when the value of the checkbox component changes. Hence, when the checkbox's value changes, this function is called with the new value to update the form control. 


### Methods 

```js
    writeValue(value: any): void {
       this.checked = !!value; 
    }
```
1. This method will be called when it wants to set a value on the checkbox component. 
2. `this.checked = !!value` => Ensures the value is coerced into a boolean using the double negation `!!`.
3. This updates the state of the component to reflect the value provided by the form control. So, if the form control's value is true, this method ensures the checkbox is marked as checked.

```js
    registerOnChange(fn: (value: any) => void) {
        this._controlValueAccessorChangeFn = fn;
    }
```
1. This method is called to register a callback function that will be triggered when the component's value changes.
2. The `RealsoftCheckbox` component calls this function whenever the value changes so that Angular can update the form model.

```js
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }
```
1. This method is called to register a callback function that will be triggered when the component is "touched" (e.g., blurred).
2. The `RealsoftCheckbox` component calls this function when the user interacts with it in a way that counts as "touching" the control. 

```js
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
```
1. This method is called when it wants to enable or disable the component. 
2. The `isDisabled` parameter is true if the component should be disabled, and false otherwise. The method updates the disabled property of the component which can be used to control its state in the UI. 


## Implementing the Validator Interface 
The `RealsoftCheckbox` component implements the `Validator` interface to ensure that the component integrates seamlessly with Angular's forms API. 

### Properties 

```js 
    private _validatorChangeFn = () => {}; 
```
A function reference to notify Angular when the validation state of the component changes. 

### Methods 

```js
    validate(control: AbstractControl<boolean>): ValidationErrors | null {
        if(this.required && control.value != true) {
            return {'required': true}
        }
        else 
        return null;
    }
```

1. This method needs to be implemented when implementing the Validator Interface. It allows the `Checkbox` component to provide validation logic to Angular forms. 

2. The method accepts `AbstractControl<boolean>` as a parameter, which represents the form control bound to the component, it contains the current value and other metadata about the form control. The generic type `<boolean>` indicates the control's value is expected to be a boolean.

3. The method returns: `ValidationErrors | null`, where if the validation fails, it returns an object with the validation error. And if the validation passes, it returns null. 

4. If the required property of the component is true then the method checks whether the control's value is also true, if the control's value is not true, it returns `{'required': true}` to indicate a validation error. Otherwise, it returns null signaling that the value is valid. 


```js
    registerOnValidatorChange(fn: () => void): void {
        this._validatorChangeFn = fn;
    }
```

1. This method allows Angular to register a callback that will be triggered whenever the validation state of the component changes.

2. The method accepts `fn: () => void` as a parameter which is a callback function provided by Angular, when called, it signals Angular to re-run validation for the associated form control.

3. The callback function is stored in the `_validatorChangeFn` property so that the component can trigger it when necessary. 

### Triggering Validation
The `_validatorChangeFn` is called inside the `ngOnChanges` lifecycle hook since the validation state of the checkbox component depends on input-bound properties aka `required`.

```js
    ngOnChanges(changes: SimpleChanges): void {
        if(changes['required']){
            this._validatorChangeFn();
        }
    }
```
