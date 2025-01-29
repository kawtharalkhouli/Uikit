import { Directive, inject, InjectionToken, Input } from "@angular/core";
import { UniqueIdGeneratorService } from "../../id-generator";

//Injection Token to reference instances of RealsoftHint
export const REALSOFT_HINT = new InjectionToken<RealsoftHint>('RealsoftHint');

@Directive({
    selector: 'realsoft-hint',
    host: {
        'class': 'realsoft-form-field-hint realsoft-form-field-bottom-align',
        '[class.realsoft-form-field-hint-end]': 'align === "end"',
        '[id]': 'id'
    },
    providers: [{provide: REALSOFT_HINT, useExisting: RealsoftHint}],
    standalone: true
})
export class RealsoftHint {
    //Unique Id for the hint
    @Input() id: string = inject(UniqueIdGeneratorService).generateID('realsoft-hint-');
    //Whether to align the hint label at the start or end of the line
    @Input() align : 'start' | 'end' = 'start';
}