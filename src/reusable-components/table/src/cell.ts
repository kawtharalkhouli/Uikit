import { CdkCell, CdkFooterCell, CdkHeaderCell } from "@angular/cdk/table";
import { Directive } from "@angular/core";

// The Cell template that adds the needed classes
@Directive({
    selector: 'realsoft-cell, td[realsoft-cell]',
    host: {'class' : 'realsoft-cell'},
    standalone: true
})
export class RealsoftCell extends CdkCell {}

//The Header Cell Template that adds the needed classes
@Directive({
    selector: 'realsoft-header-cell th[realsoft-header-cell]',
    host: {'class' : 'realsoft-header-cell'},
    standalone: true
})
export class RealsoftHeaderCell extends CdkHeaderCell {}

// The Footer Cell Template that adds the needed classes
@Directive({
    selector: 'realsoft-footer-cell td[realsoft-footer-cell]',
    host: {'class': 'realsoft-footer-cell'},
    standalone: true
})
export class RealsoftFooterCell extends CdkFooterCell {}