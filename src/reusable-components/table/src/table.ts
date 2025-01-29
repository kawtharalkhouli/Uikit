import { CDK_TABLE, CdkTable, DataRowOutlet, FooterRowOutlet, HeaderRowOutlet, NoDataRowOutlet } from "@angular/cdk/table";
import { Component, ViewEncapsulation } from "@angular/core";


@Component({
    selector: 'realsoft-table ,table[realsoft-table]',
    exportAs: 'realsoftTable',
    templateUrl: './table.html',
    styleUrl: './table.scss',
    providers: [
        {provide: CdkTable, useExisting: RealsoftTableComponent},
        {provide: CDK_TABLE, useExisting: RealsoftTableComponent}
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet]
})
export class RealsoftTableComponent<T> extends CdkTable<T> {
    protected override needsPositionStickyOnElement = false; //No need to provide position: sticky on every sticky cell element in CdkTable
}