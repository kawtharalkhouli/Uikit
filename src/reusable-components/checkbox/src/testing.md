

# Checkbox Test Cases 

The following test scenarios have been made for `realsoft-checkbox` to cover various functionalities, including user interaction, state management and integration with forms. 

## Functional Scenarios 

***Default State***

1. Verify the `realsoft-checkbox` is unchecked by default if no value provided. 
2. Verify the `realsoft-checkbox` displays the correct label text.

***Check and Uncheck Behavior***

1. Verify the checkbox is checked when clicked.
2. Verify the checkbox is uncheckedwhen clicked again.
3. Test the `checked` property binding to ensure it updates correctly when changed programmatically. 

***Disabled State***

1. Verify the checkbox cannot be checked when `disabled` is set to `true`.
2. Verify the checkbox does not emit any events when disabled.

***Indeterminate State***

1. Verify the checkbox is displayed in the indeterminate state when `indeterminate` is set to `true`.
2. Verify clicking on the indeterminate checkbox transitions it to the checked state.

***Label Click***

1. Verify clicking on the label toggles the checkbox state. 

## Form Related Scenarios 

***Reactive Forms Integration***

1. Verify that the checkbox binds correctly to a FormControl value.
2. Verify that the checkbox reflects FormControl's `disabled` state dynamically. 
3. Test validation states => `Required Field`. 

***Template Driven Forms***

1. Verify that the checkbox binds correctly to `[(ngModel)]`.


***Two-way Binding***

1. Verify two-way data binding updates the model when the checkbox is toggled and vice versa. 


## Event Emission 

***Change Event***

1. Verify that the `change` event is emitted with the correct state when the checkbox is toggled.
2. Verify that no `change` event is emitted when the value changes programmatically. 


## Accessibility 

***ARIA Roles and Attributes***

1. Verify the checkbox has the appropriate ARIA atributes (`role="checkbox"`, `aria-checked`, `aria-disabled`). 
2. Verify the indeterminate state is announced correctly to screen readers. 


***Keyboard Interaction***

1. Verify the checkbox can be toggled using the `Space` key. 
2. Verify the focus state is visually distiguishable. 


## Styling and Theme Changes 

***Custom Classes***

1. Verify custom classes are applied correctly to the checkbox element. 
2. Verify animation classes are applied correctly to the checkbox element and removed after 1 second from interacting with the checkbox element. 


***Theming***

1. Verify that checkbox styles match correctly under different Themes. 

## Edge Cases 

***Dynamic Change***

1. Verify the checkbox state changes dynamically when its properties like `checked`, `disabled` are updated at run time. 
2. Verify the checkbox handles rapid state changes without errors. 


***Initialization***

1. Verify that the checkbox initializes correctly with pre-checked and pre-disabled states. 



