import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
    selector: '[realsoft-internal-form-field]',
    template: `<ng-content></ng-content>`,
    styleUrl: './internal-form-field.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        'class': 'realsoft-internal-form-field', 
        '[class.realsoft-form-field-align-end]' : 'labelPosition === "before"'
    }
})
export class RealsoftInternalFormField {
    @Input({required: true}) labelPosition : 'before' | 'after' = 'after';
}