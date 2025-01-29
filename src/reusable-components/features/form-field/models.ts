import { InjectionToken } from "@angular/core";
import { RealsoftFormField } from "./form-field";

//Possible appearance styles for the form field
export type RealsoftFormFieldAppearance = 'fill' | 'outline';

//Behaviors for how the subscript height is set
export type RealsoftSubscriptSizing = 'fixed' | 'dynamic';

//Type for the available floatLabel values
export type RealsoftFloatLabelType = 'always' | 'auto';

//Represents the default options for the form field that can be configured using the REALSOFT_FORM_FIELD_DEFAULT_OPTIONS Injection Token
export interface RealsoftFormFieldDefaultOptions { 
    //Default Form Field Appearance Style
    appearance: RealsoftFormFieldAppearance; 

    //Whether the label for the form fields should by default float always 
    floatLabel: RealsoftFloatLabelType; 

    //Whether the required marker should be hidden by default 
    hideRequiredMarker: boolean;

    //Whether the form field should reverse space for one line by default
    subscriptSizing: RealsoftSubscriptSizing;
}

//Injection token that can be used to inject an instances of RealsoftFormField. It serves as alternative token to the actual RealsoftFormField class which would cause unnecessary retention of the RealsoftFormField class and its component metadata.
export const REALSOFT_FORM_FIELD = new InjectionToken<RealsoftFormField>('RealsoftFormField');

//Injection token that can be used to configure the default options for all form field within an app 
export const REALSOFT_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken<RealsoftFormFieldDefaultOptions>('REALSOFT_FORM_FIELD_DEFAULT_OPTIONS');

