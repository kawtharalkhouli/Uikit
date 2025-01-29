import { Directive } from "@angular/core";
import { AbstractControlDirective, NgControl } from "@angular/forms";
import { Observable } from "rxjs";

//An interface that allows a control to work inside of a RealsoftFormField

//T Represents the value of the control
@Directive({})
export abstract class RealsoftFormFieldControl<T> {
    //Properties 

    //Whether the input is currently in an autofilled state. If property is not present on the control it is assumed to be false.
    readonly autofilled?: boolean;

    /*An optional name for the control type that can be used to distinguish realsoft-form-field elements based on their control type.
    The form field will add a class realsoft-form-field-type-{{controlType}} to its root element
    */
    readonly controlType?: string;

    /*Whether to automatically assign the ID of the form field as the for attribute on the <label> inside the form field. 
    Set this to true to prevent the form field from associating the label with non-native elements.*/
    readonly disableAutomaticLabeling?: boolean; 

    //Whether the control is disabled
    readonly disabled: boolean;

    //Whether the control is empty
    readonly empty: boolean;

    //Whether the control is in an error state
    readonly errorState: boolean;

    //Whether the control is focused
    readonly focused: boolean;

    //The element ID for this control 
    readonly id: string; 

    //Gets the AbstractControlDirective for this control 
    readonly ngControl: NgControl | AbstractControlDirective | null;

    //The placeholder for this control 
    readonly placeholder: string;

    //Whether the control is required
    readonly required: boolean;

    //Whether the RealsoftFormField label should float or not
    readonly shouldLabelFloat: boolean; 

    //Stream that emits whenever the state of the control changes such that the parent RealsoftFormField needs to run change detection.
    readonly stateChanges : Observable<void>;

    //Represents the value of the form control
    value: T | null; 

    //Value of aria-describedby that should be merged with the described-by ids which are set by the form-field
    readonly userAriaDescribedBy?: string;

    //Methods

    //Method 1 for handling the click on the control's container
    abstract onContainerClick(event: MouseEvent): void;

    //Method 2 for setting the list of element IDs that currently describe the control
    abstract setDescribedByIds(ids : string[]): void;

}