import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef,ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'realsoft-table-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-selection.component.html',
})
export class TableSelectionComponent {
@Input() displayedColumns!: string[] ;
@Input() dataSource = new MatTableDataSource<any>();
selection = new SelectionModel<any>(true, []);
@Output() selectedItems:EventEmitter<any>=new EventEmitter<any>();


constructor(private cdr: ChangeDetectorRef) {}
    
// Whether the number of selected items matches the total number of rows in the table
isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
}
getSelected(){
    this.selectedItems.emit(this.selection)
    return this.selection;
  }

// Selects all rows if they are not all selected; otherwise clear selection 
masterToggle() {
// if there is a selection then clear that selection
if (this.isSomeSelected()) {this.selection.clear();}
 else {
this.isAllSelected() ? this.selection.clear(): this.dataSource.data.forEach(row => this.selection.select(row));
    }
}
isSomeSelected() {
    this.getSelected()
    return this.selection.selected.length > 0;
}


}
