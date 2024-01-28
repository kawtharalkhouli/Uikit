import { SelectionModel } from "@angular/cdk/collections";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SystemLanguage, TableService } from "./services/table.service";
import { CustomMatPaginatorIntl } from "./helpers/CustomMatPaginatorIntl.class";
import { ActionIcon, EventColumn, TableColumn } from "./helpers/models";

@Component({
  selector: "realsoft-transferrable-data-tables",
  templateUrl: "./transferrable-data-tables.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }, // Here
  ],
})
export class TransferrableDataTables implements OnChanges, OnDestroy {
  public tableDataSource = new MatTableDataSource<any>([]);
  public secondTableDataSource = new MatTableDataSource<any>([]);

  public displayedColumns!: string[];
  @Input() rowActionIcon!: ActionIcon[];
  @Input() isCheckbox: boolean = true;
  @Input() rowActionCheckbox!: string[];
  @Input() tableColumns!: TableColumn[]; // data table columns

  @Input() lang: string = "en";
  selection = new SelectionModel<any>(true, []);
  checkedSelection = new SelectionModel<any>(true, []);
  @Input() count: number = 5;
  @Input() isLoading: boolean = false;
  @Input() isPageableBottom: boolean = false; // enable pagination bottom
  @Input() paginationSizes: number[] = [5, 10, 15]; // pagination size
  @Input() defaultPageSize = this.paginationSizes[1]; // default page size

  @Input() set firstTableData(data: any[]) {
    this.setTableDataSource(data);
  }

  @Input() set secondTableData(data: any[]) {
    this.setSecondTableDataSource(data);
  }

  @Output() paginationChange: EventEmitter<PageEvent> =
    new EventEmitter<PageEvent>();
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter();
  @Output() rowAction: EventEmitter<EventColumn> =
    new EventEmitter<EventColumn>();
  @Output() transferredRows: EventEmitter<any> = new EventEmitter<any>();
  @Output() removedRows: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild("secondPaginator") secondPaginator!: MatPaginator;

  firstData: any[] = [];
  secondData: any[] = [];

  constructor(
    private tableService: TableService,
    private cdr: ChangeDetectorRef
  ) {
    this.tableDataSource.paginator = this.paginator;
    this.secondTableDataSource.paginator = this.secondPaginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.rowActionCheckbox = [" "];
    this.tableService.updateLang(
      (this.lang || changes["lang"].currentValue) as SystemLanguage
    );
    this.showColumn();
    this.cdr.markForCheck();
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource(data);
    this.firstData = Object.assign(data);

    setTimeout(() => {
      if (this.isPageableBottom) {
        this.tableDataSource.paginator = this.paginator;
      }
    }, 0);
  }

  setSecondTableDataSource(data: any) {
    this.secondTableDataSource = new MatTableDataSource(data);
    this.secondData = Object.assign(data);

    setTimeout(() => {
      if (this.isPageableBottom) {
        this.secondTableDataSource.paginator = this.secondPaginator;
      }
    }, 0);
  }

  emitRowAction(row: Object, actionName: string, columnName?: string) {
    const data: EventColumn = {
      row,
      actionName,
      columnName,
    };
    this.rowAction.emit(data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.tableDataSource.data.forEach((row) => this.selection.select(row));
    this.selectionChange.emit(this.selection.selected);
  }

  onSelectionChange(event: any, element: TableColumn) {
    if (event.checked) {
      this.selection.select(element);
    } else {
      this.selection.deselect(element);
    }
    this.selectionChange.emit(this.selection.selected);
  }

  onPaginationChange(pagination: any) {
    this.paginationChange.emit(pagination);
  }

  repeat(length: number): any {
    if (length >= 0) {
      return new Array(length);
    }
  }

  showColumn() {
    const columnNames: string[] = [];
    this.tableColumns.forEach((tableColumn: TableColumn) => {
      if (tableColumn.show) columnNames.push(tableColumn.name);
    });

    const someCol = this.tableColumns.some((col) => col.show);
    //Table with Draggable Rows, Toggle After, Toggle Before and Icons
    this.displayedColumns = [...this.rowActionCheckbox, ...columnNames];
  }

  transferSelectedRows() {
    this.selection.selected.forEach((item) => {
      let index: number = this.firstData.findIndex((d: any) => d === item);

      this.secondData.unshift(this.firstData[index]);
      this.firstData.splice(index, 1);
    });

    this.selection = new SelectionModel<any>(true, []);
    this.tableDataSource = new MatTableDataSource<any>(this.firstData);
    this.secondTableDataSource = new MatTableDataSource<any>(this.secondData);
    this.tableDataSource.paginator = this.paginator;
    this.secondTableDataSource.paginator = this.secondPaginator;

    this.transferredRows.emit({
      firstTableData: this.tableDataSource,
      secondTableData: this.secondTableDataSource,
    });
  }

  removeSelectedRows() {
    this.checkedSelection.selected.forEach((item) => {
      let index: number = this.secondData.findIndex((d) => d === item);

      this.firstData.push(this.secondData[index]);
      this.secondData.splice(index, 1);
    });
    this.checkedSelection = new SelectionModel<any>(true, []);
    this.tableDataSource = new MatTableDataSource<any>(this.firstData);
    this.secondTableDataSource = new MatTableDataSource<any>(this.secondData);
    this.tableDataSource.paginator = this.paginator;
    this.secondTableDataSource.paginator = this.secondPaginator;

    this.removedRows.emit({
      firstTableData: this.tableDataSource,
      secondTableData: this.secondTableDataSource,
    });
  }

  masterSecondToggle() {
    this.isAllSecondSelected()
      ? this.checkedSelection.clear()
      : this.secondTableDataSource.data.forEach((row) =>
          this.checkedSelection.select(row)
        );
    this.selectionChange.emit(this.selection.selected);
  }

  isAllSecondSelected() {
    const numSelected = this.checkedSelection.selected.length;
    const numRows = this.secondTableDataSource.data.length;
    return numSelected === numRows;
  }
  ngOnDestroy(): void {
    this.tableService.destroy$.next(true);
  }
}
