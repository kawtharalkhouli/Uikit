import {Directive} from '@angular/core';

import {
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCellDef,
  CdkHeaderCellDef,
} from '@angular/cdk/table';


// This Directive will be used as the cell definition for the table

@Directive({
  selector: '[realsoftCellDef]',
  providers: [{provide: CdkCellDef, useExisting: RealsoftCellDef }],
  standalone: true
})
export class RealsoftCellDef extends CdkCellDef {}

// This Directive will be used as the header cell definition for the table

@Directive({
  selector: '[realsoftHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: RealsoftHeaderCellDef}],
  standalone: true
})
export class RealsoftHeaderCellDef extends CdkHeaderCellDef {}

// This Directive will be used as the footer cell definition for the table

@Directive({
  selector: '[realsoftFooterCellDef]',
  providers: [{provide: CdkFooterCellDef, useExisting: RealsoftFooterCellDef}],
  standalone: true
})
export class RealsoftFooterCellDef extends CdkFooterCellDef {}

// This Directive will be used as the entire column definition for the table

@Directive({
  selector: '[realsoftColumnDef]',
  providers: [{provide: CdkColumnDef, useExisting: RealsoftColumnDef}],
  standalone: true
})
export class RealsoftColumnDef extends CdkColumnDef {}