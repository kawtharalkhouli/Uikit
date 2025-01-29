# Checkbox ControlValueAccessor 

## Control Value Accessor Overview 
The `ControlValueAccessor` Interface allows the checkbox component to be used as a form control. Aka either in reactive or template driven forms. It acts as a bridge between the Angular forms API and the DOM element, enabling two-way binding and interaction with forms. 

## REALSOFT_CHECKBOX_VALUE_ACCESSOR Explanation
This constant is a configuration object that makes the `RealsoftCheckbox` Component usable as a custom form control as follows: 

### Key Elements
***provide: NG_VALUE_ACCESSOR***
`NG_VALUE_ACCESSOR` => Special token provided by Angular. It tells Angular's dependency injection system that this component will act as `ControlValueAccessor`.

***useExisting: forwardRef(() => RealsoftCheckbox)***
1. `useExisting` tells Angular to use an existing instance of the `RealsoftCheckbox` component as the `ControlValueAccessor`.
2. `forwardRef` is necessary because `RealsoftCheckbox` might not be defined yet when this object is declared. Hence, it delays the resolution of `RealsoftCheckbox` until it's needed. 

***multi: true***
Setting `multi` to true allows multiple providers to be associated with the `NG_VALUE_ACCESSOR` token. This is essential because Angular allows multiple custom form controls to coexist. 

## Retrieving the REALSOFT_CHECKBOX_DEFAULT_OPTIONS
1. The `REALSOFT_CHECKBOX_DEFAULT_OPTIONS` is an injection token that provides default configuration options for `RealsoftCheckbox`. These options might include properties of the type of the click options for the checkbox, apperance, etc.

```js
    private _options = inject<RealsoftCheckboxDefaultOptions>(REALSOFT_CHECKBOX_DEFAULT_OPTIONS, {optional: true});
```

**Notes**
1. The `inject<RealsoftCheckboxDefaultOptions>` tells Angular to retrieve the value associated with the `REALSOFT_CHECKBOX_DEFAULT_OPTIONS` token, and it expects the value to conform to the `RealsoftCheckboxDefaultOptions` interface.

2. `Optional Injection` => The `true` option means: 
If the `REALSOFT_CHECKBOX_DEFAULT_OPTIONS` token is not provided in the dependency injection tree, the `_options` variable will be undefined instead of causing an error. Which makes the injection safe and allows the component to operate without requiring a global configuration for checkboxes.


## Checkbox TabIndex Logic 

```js
   _tabIndex = inject(new HostAttributeToken('tabindex'), { optional: true });
```
**Notes**
1. The Above Code Snippet uses the `inject()` function to retrieve dependencies or tokens in Angular. And in this case it's used to retrieve the value of the tabindex attribute from the host element at runtime. 

2. `HostAttributeToken` is a special type of token from the `@angular/core` that allows you to request attributes from the host element in Angular. 

3. `new HostAttributeToken('tabIndex')` tells Angular to look for the `tabIndex` attribute on the host element. 

4. The `{optional: true}` option makes the injection optional. Such that if the `tabIndex` attribute is not present on the host element, the `inject()` function will return null instead of throwing an error.

## NgZone Usage For Preventing Unnecessary Change Detection

```js
   this._ngZone.runOutsideAngular(() => {
    setTimeout(() => {
        element.classList.remove(this._animationClass);
    }, 1000)
   })
```
The above code snippet resembles the usage of ngZone.runOutsideAngular to improve performance by preventing Angular's change detection mechanism from being triggered unnecessarily. 

**Detailed Explanation** 

1. `Angular Zones` => Angular uses `NgZone` to track asynchronous operations (like setTimeout, Promise, or DOM events) and run change detection automatically when these operations complete. However, running change detection frequenlty can be a performance bottleneck, especially when change detection in not necessary for certain operations like this case in which removing the animation class after 1 second won't require change detection to occur.

2. The `runOutsideAngular` method => It allows you to execute code outside of Angular's zone. Meaning angular won't trigger change detection for the specified code block. 

**Benefits**
1. Improved Performance => Preventing Unnecessary Change Detection reduces the overhead. Especially in scenarios with frequent or repetitive DOM updates.

2. Focused Execution => Ensure that Angular's change detection only runs when absolutely necessary, keeping the component more efficient. 

## Validation Logic Implementation

***Code Snippet***

```js
   ngOnChanges(changes: SimpleChanges): void {
        if(changes['required']){
            this._validatorChangeFn();
        }
    }
```
1. The usage of the `ngOnChanges` lifecycle hook is because it'll be called whenever one or more data-bound input properties of a directive change. And in this case, it has been used to observe changes to the `required` input property. 

2. The function `_validatorChangeFn()` is called in this hook to inform `Angular forms` system that the validator associated with the `RealsoftCheckbox` Component needs to be re-evaluated. 

***Notes on Why This Pattern is used Here***
**Dynamic Changes in Validators**
1. => If the `required` input changes (e.g., from true to false or vice versa), then the form control's validation rules need to be updated.
2. => Valaidators in Angular are typically set up when a form control is initialized, so a manual trigger is necessary to update the validation when inputs change dynamically. 

**Informing the System**
1. => `_validatorChangeFn()` is a callback function that Angular's Validator interface provides via the `registerOnValidatorChange`. It tells Angular's forms system to run the validator again, ensuring the form control's state `(valid/invalid)` is in sync with the updated validator rules
