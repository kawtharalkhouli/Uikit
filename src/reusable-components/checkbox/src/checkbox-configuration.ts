import { InjectionToken } from "@angular/core";
import { RealsoftCheckbox } from "./checkbox";

//Checkbox Click Action when the user clicks on the input element 
/**
 * noop => Do not toggle checked nor indeterminate
 * check => only toggle checked status, and ignore indeterminate 
 * check-indeterminate => Toggle checked status, ans set indeterminate to false => This is the default behavior
 * undefined => Same and `check-indeterminate`
 */
export type RealsoftCheckboxClickAction = 'noop' | 'check' | 'check-indeterminate' | undefined;

//Default Options for the checkbox which can be overriden
export interface RealsoftCheckboxDefaultOptions {
    //The Default Checkbox Click Action
    clickAction?: RealsoftCheckboxClickAction;

    //Whether disabled checkboxes should be interactive
    disabledInteractive?: boolean;
}

//Injection Token that can be used to override the default options for the checkbox
export const REALSOFT_CHECKBOX_DEFAULT_OPTIONS = new InjectionToken<RealsoftCheckboxDefaultOptions>(
    'realsoft-checkbox-default-options', {
        providedIn: 'root',
        factory: REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY
    }
)

export function REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): RealsoftCheckboxDefaultOptions {
    return {
        clickAction: 'check-indeterminate',
        disabledInteractive: false
    }
}

//Change Event Object that will be emitted by the checkbox
export class RealsoftCheckboxChange { 
    //The source checkbox of the event
    source: RealsoftCheckbox;

    //The new value of the checkbox representing whether the checkbox is checked or not
    checked: boolean;
}

//Default Checkbox Configuration
export const defaultConfig = REALSOFT_CHECKBOX_DEFAULT_OPTIONS_FACTORY();

export enum RealsoftCheckboxTransitionState {
    //Before any user interaction
    Initial,
    //When the checkbox is becoming checked
    Checked,
    //When the checkbox is becoming unchecked
    Unchecked,
    //When the component is becoming indeterminate
    indeterminate
}



  
