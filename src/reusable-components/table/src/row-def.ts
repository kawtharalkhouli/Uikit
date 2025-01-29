import { CdkFooterRowDef, CdkHeaderRowDef, CdkRowDef } from "@angular/cdk/table";
import { booleanAttribute, Directive } from "@angular/core";


// This Directive is responsible of defining the header of the table including the columns to be displayed in the header

@Directive({
    selector: '[realsoftHeaderRowDef]',
    providers: [{provide: CdkHeaderRowDef, useExisting: RealsoftHeaderRowDef}],
    inputs: [
        {name: 'columns', alias: 'realsoftHeaderRowDef' },
        {name: 'sticky', alias: 'realsoftHeaderRowDefSticky', transform: booleanAttribute},
    ],
    standalone: true
})
export class RealsoftHeaderRowDef extends CdkHeaderRowDef {}

// This Directive is responsible for defining the footer of the table including the columns to be displayed in the footer

@Directive({
    selector: 'realsoftFooterRowDef',
    providers: [{provide: CdkFooterRowDef, useExisting: RealsoftFooterRowDef }],
    inputs: [
        {name: 'columns', alias: 'realsoftFooterRowDef'},
        {name: 'sticky', alias: 'realsoftFooterRowDefSticky', transform: booleanAttribute}
    ],
    standalone: true
})
export class RealsoftFooterRowDef extends CdkFooterRowDef {}

// This Directive is responsible for defining the rows of the table including the columns names to be displayes in each row.

@Directive({
    selector: 'realsoftRowDef',
    providers: [{provide: CdkRowDef, useExisting: RealsoftRowDef }],
    inputs: [
        {name: 'columns', alias: 'realsoftRowDef'},
    ],
    standalone: true
})
export class RealsoftRowDef<T> extends CdkRowDef<T> {}