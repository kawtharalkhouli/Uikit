import { Directive, inject, InjectionToken, Input } from "@angular/core";
import { UniqueIdGeneratorService } from "../../id-generator";



//Injection token to reference instances of RealsoftError
export const REALSOFT_ERROR = new InjectionToken<RealsoftError>('RealsoftError');

@Directive({
    selector: 'realsoft-error, [realsoftError]',
    host: {
        'class' : 'realsoft-form-field-error realsoft-form-field-bottom-align',
        '[id]' : 'id'
    },
    providers: [{provide: REALSOFT_ERROR, useExisting: RealsoftError}],
    standalone: true
})
export class RealsoftError {
    @Input() id: string = inject(UniqueIdGeneratorService).generateID('realsoft-error-');
}