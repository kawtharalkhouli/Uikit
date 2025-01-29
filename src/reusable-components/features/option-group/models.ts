import { InjectionToken } from "@angular/core";

//Additional Option Configuration
export interface RealsoftOptionConfiguration {
    disableRipple?: boolean;
    multiple?: boolean;
    hideSingleSelectionIndicator?: boolean;
}

//Injection Token To provide additonal options for the option component => This is made because options are usually in a wrapping component like select so the configuration will be applied to all options within the wrapped component
export const REALSOFT_OPTION_CONFIG = new InjectionToken<RealsoftOptionConfiguration>('REALSOFT_OPTION_CONFIG');

