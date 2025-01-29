# Pseudo Checkbox Configuration

## Overview 

The `RealsoftPseudoCheckbox` component is a lightweight, customizable `pseudo-checkbox` component designed for use within other reusable components. It provides a visual representation of checkbox states => `checked`, `indeterminate` and `unchecked` without managing form inputs.

The component itself doesn't include native checkbox functionality but instead it relies on styling and state management to visually indicate the selection status. It's intended to be used when a large number of checkboxes are needed like a multiple selection dropdown, since it used no SVG or Complex animations.


## Pseudo Checkbox Status Type Alias
The `RealsoftPseudoCheckboxStatus` type alias represents the status of a `pseudo-checkbox`.

```js
   export type RealsoftPseudoCheckboxStatus = 'unchecked' | 'checked' | 'indeterminate';
```

**Notes**
1. `unchecked` => The Checkbox is not selected.
2. `checked` => The Checkbox is selected.
3. `indeterminate` => The checkbox is in indeterminate state known also as the mixed mode (neither checked nor unchecked).

## Pseudo Checkbox Appearance Type Alias
The `RealsoftPseudoCheckboxAppearance` type alias represents the appearance of the pseudo checkbox.

```js
   export type RealsoftPseudoCheckboxAppearance = 'minimal' | 'full';
```
**Notes**
1. `minimal` => Minimal Appearance includes the checkmark or mixedmark based on the status.
2. `full` => Full Appearance includes the checkmark or mixedmark inside a square box based on the status.

## Component's Metadata 

```js
@Component({
    selector: 'realsoft-pseudo-checkbox',
    template: '',
    styleUrl: './pseudo-checkbox.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'realsoft-pseudo-checkbox',
        '[class.realsoft-pseudo-checkbox-indeterminate]': 'status === "indeterminate"',
        '[class.realsoft-pseudo-checkbox-checked]': 'status === "checked"',
        '[class.realsoft-pseudo-checkbox-disabled]': 'disabled',
        '[class.realsoft-pseudo-checkbox-full]': 'appearance === "full"',
        '[class.realsoft-pseudo-checkbox-minimal]': 'appearance === "minimal"',
        '[class.realsoft-pseudo-checkbox-no-animation]': '_animation === "NoopAnimations"'
    }
})
export class RealsoftPseudoCheckbox {}
```

**Notes**
1. `selector` => Defines the HTML tag `realsoft-pseudo-checkbox` used to represent this component. 
2. `standalone` => Indicates that this is a standalone component and doesn't depend on Angular Modules for usage.
3. `enacapsulation` => Uses `ViewEncapsulation.None` to disable all style encapsulation for the component. and all styles in `pseudo-checkbox.scss` are applied globally without scoping to this component. 
4. `changeDetection` => Uses `ChangeDetectionStrategy.OnPush` for improved performance, ensuring the view only updates when its inputs bindings change. 
5. `host` => Specifies the host element's bindings and classes.
* `class` => Adds a base CSS class aka: `realsoft-pseudo-checkbox` to the host element. 
* Dynamic Class Bindings => Various `[class.*]` bindings that dynamically set classes on the host element based on certain component properties. 
`realsoft-pseudo-checkbox-indeterminate` => Applied when the pseudo checkbox is in indeterminate state. 
`realsoft-pseudo-checkbox-checked` => Applied when the pseudo checkbox is in checked state.
`realsoft-pseudo-checkbox-disabled` => Applied when the pseudo checkbox is in disabled state. 
`realsoft-pseudo-checkbox-full` => Applied when the pseudo checkbox appearance is set to full.
`realsoft-pseudo-checkbox-minimal` => Applied when the pseudo checkbox appearance is set to minimal. 
`realsoft-pseudo-checkbox-no-animation` => Applied when animations are disabled.

## Component's Input Bindings

```js
    @Input() status: RealsoftPseudoCheckboxStatus = 'unchecked';

    @Input() disabled: boolean = false;
    
    @Input() appearance: RealsoftPseudoCheckboxAppearance = 'full';
```

**Notes**

1. `status` =>  Determines the visual state of the checkbox which is uncheked by default.
2. `disabled` => Controls when the checkbox appears disabled.
3. `appearance` =>  Configures the visual appearance style of the checkbox.

## Dependency 

```js
    _animation? = inject(ANIMATION_MODULE_TYPE, {optional: true});
```
This injects `ANIMATION_MODULE_TYPE` which identifies whether the Angular Animation module is loaded. It basically helps in determining whether animations are enabled (`BrowserAnimationsModule`) or disabled (`NoopAnimationsModule`). The `{optional: true}` flag ensures that the injection won't throw an error if `ANIMATION_MODULE_TYPE` is not provided. The optional property `?` indicates that `_animation` can be undefined. 
