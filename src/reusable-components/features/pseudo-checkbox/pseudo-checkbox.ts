import { ANIMATION_MODULE_TYPE, ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from "@angular/core";


export type RealsoftPseudoCheckboxStatus = 'unchecked' | 'checked' | 'indeterminate';

//Minimal Appearance only includes the checkmark or mixedmark based on the status
//Full Appearance includes the checkmark or mixedmark inside a square box based on the status
export type RealsoftPseudoCheckboxAppearance = 'minimal' | 'full';

//Intended to be use when a large number of checkboxes are needed like multi-select, uses no SVG or Complex Animation 
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
export class RealsoftPseudoCheckbox {
    _animation = inject(ANIMATION_MODULE_TYPE, {optional: true});
    
    //The status of the pseudo checkbox, starts from unchecked. Could be checked or indeterminate which is known as mixed mode
    @Input() status: RealsoftPseudoCheckboxStatus = 'unchecked';

    //Whether the pesudo checkbox is disabled
    @Input() disabled: boolean = false;
    
    //The appearance of the checkbox
    @Input() appearance: RealsoftPseudoCheckboxAppearance = 'full';

    constructor() {}
}