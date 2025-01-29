import { InjectionToken } from "@angular/core";
import { RealsoftOption } from "./option";


//Change Event Object emitted by RealsoftOption when selected or deselected
export class RealsoftOptionSelectionChange<T = any> {
    constructor(
        public source: RealsoftOption<T>, //Reference to the option emitted by the event
        public isUserInput = false //Whether the change in the option's value was a result of a user's action
    ) {}
}

//Additional Option Configuration
export interface RealsoftOptionConfiguration {
    disableRipple?: boolean;
    multiple?: boolean;
    hideSingleSelectionIndicator?: boolean;
}

//Injection Token To provide additonal options for the option component => This is made because options are usually in a wrapping component like select so the configuration will be applied to all options within the wrapped component
export const REALSOFT_OPTION_CONFIG = new InjectionToken<RealsoftOptionConfiguration>('REALSOFT_OPTION_CONFIG');

