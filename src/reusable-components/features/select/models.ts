import { Overlay, ScrollStrategy } from "@angular/cdk/overlay";
import { Directive, inject, InjectionToken } from "@angular/core";
import { RealsoftSelect } from "./select";

//Object that can be used to configure the default options for the select module
export interface RealsoftSelectConfig {
    disableOptionCentering: boolean; //Whether option centering should be disabled
    hideSingleSelectionIndicator: boolean; //Whether checkmark icon should be hidden for single-selection mode
    overlayPanelClass: string | string[]; //Class or list of classes to be applied to the menu's overlay panel
    panelWidth: string | number | null; // Width of the panel. If set to auto, the panel will match the trigger width. If set to null or an empty string, the panel will grow to match the longest option's text 
    typeaheadDebounceInterval: number; //Time to wait in milliseconds after the last keystroke before moving focus to an item
}

//Injection token that can be used to provide the default options for the select control
export const REALSOFT_SELECT_CONFIG = new InjectionToken<RealsoftSelectConfig>('REALSOFT_SELECT_CONFIG');

//Injection token that determines the scroll handling while select is open 
export const REALSOFT_SELECT_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
    'realsoft-select-scroll-strategy', 
    {
        providedIn: 'root',
        factory: () => {
            return () => inject(Overlay).scrollStrategies.reposition();
        }
    }
);


//Injection token that can be used to reference instances of RealsoftSelectTrigger. It serves as alternative token to the actual RealsoftSelectTrigger class which could cause unnecessary retention of the class and its directive metadata
export const REALSOFT_SELECT_TRIGGER = new InjectionToken<RealsoftSelectTrigger>('RealsoftSelectTrigger');


@Directive({
    selector: 'realsoft-select-trigger',
    standalone: true,
    providers: [{provide: REALSOFT_SELECT_TRIGGER, useExisting: RealsoftSelectTrigger }]
})
export class RealsoftSelectTrigger {}


//Change Event object that is emitter when the select value has changed 
export class RealosftSelectChange {

    constructor(
        public source: RealsoftSelect,//Reference to the select that emitted the change event
        public value: any //Current value of the select that emitted the event
    )
    {}
}

export function realsoftMultipleModeNonArrayValueError() : Error {
    return Error('Value must be an array in multiple selection mode');
}

export function realsoftSelectNonFunctionalError(): Error {
    return Error('`compareWith` must be a function.');
}


