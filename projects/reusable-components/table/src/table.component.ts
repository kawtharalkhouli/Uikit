import { SelectionModel } from '@angular/cdk/collections';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges,  OnDestroy,  Output,  SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ButtonsDirective } from './directives/buttons.directive';
import { SystemLanguage, TableService } from './services/table.service';
import { CustomMatPaginatorIntl } from './helpers/CustomMatPaginatorIntl.class';
import { ActionIcon, DynamicToggles, DynamicTogglesBefore, EventColumn, FilterParam, FilterType, TableColumn } from './helpers/models';
import { FormGroup, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unsubscribe } from './helpers/unsubscribe';
import { FormService } from './services/form.service';


@Component({
  selector: 'realsoft-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl},
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomTableComponent),
        multi: true
      }
    ]
})
export class CustomTableComponent extends Unsubscribe implements AfterViewInit, OnChanges, OnDestroy {
  public tableDataSource = new MatTableDataSource<any>([]);
  public displayedColumns!:string[];

  filterValues: any = {};
  icons:any[]=[];
  toggles:any[]=[];
  togglesBefore:any[]=[];
  dragDisabled = true;
  draggableRowsArray!:string[];
  selection = new SelectionModel<any>(true, []);
  searchForm: FormGroup = new FormGroup({});
  textControl = new FormControl(null);
  dropDownControl = new FormControl(null);
  globalSearch = new FormControl(null);
  searchKey = '';
  filterForm = new FormGroup({})

  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;
  @ContentChild(ButtonsDirective) buttonGroupTemplate!: ButtonsDirective;


  @Input() isGlobalSearch: boolean = false; // enable global search
  @Input() isPageableTop: boolean = false; // enable pagination top
  @Input() isPageableBottom: boolean = false; // enable pagination bottom
  @Input() paginationSizes: number[] = [5, 10, 15]; // pagination size
  @Input() defaultPageSize = this.paginationSizes[1]; // default page size
  @Input() enableSorting: boolean = true; // enable sorting
  @Input() numericColumns!: string[]; // numerical columns sorted
  @Input() isFilterable: boolean = false; // can a column be filtered?
  @Input() isSearchable: boolean = false; //can a column be searched?
  @Input() isCustomColumn: boolean = false; // show or hide custom column
  @Input() tableColumns!: TableColumn[]; // data table columns
  @Input() dragEnabled = false; // enable drag and drop
  @Input() rowActionIcon!: ActionIcon[];
  @Input() rowActionToggles!:DynamicToggles[];
  @Input() rowActionTogglesBefore!: DynamicTogglesBefore[];
  @Input() buttonTxt!:string;
  @Input() selectable:boolean=false;
  @Input() rowActionCheckbox!: string[];
  @Input() isToggle!:boolean;
  @Input() isToggleAfter!:boolean;
  @Input() rowActionToggle!:string[];
  @Input() label : string = 'Search..';
  @Input() placeholder : string = 'Search..';
  @Input() lang: string = 'en';
  @Input() searchFilterLabel:string='Search';
  @Input() draggableRows: boolean =false;
  @Input() parentButtonGroupTemplate!: ButtonsDirective;
  @Input() count: number =5;
  @Input() isLoading: boolean =false;
  @Input() activeUsers:boolean=false;
  @Input() filterParams: FilterParam[] =[];
  @Input() reloadFilter =false;

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() rowAction: EventEmitter<EventColumn> = new EventEmitter<EventColumn>();
  @Output() columnsChange: EventEmitter<TableColumn[]> = new EventEmitter<TableColumn[]>();
  @Output() sortedColumn: EventEmitter<TableColumn[]> = new EventEmitter<TableColumn[]>();
  @Output() checkboxChange = new EventEmitter<any>();
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter();
  @Output() filteredData: EventEmitter<any> = new EventEmitter<any>();
  @Output() filteredSearch: EventEmitter<any> = new EventEmitter<any>();

  @Output() customColumnEvent: EventEmitter<any> =new EventEmitter();
  @Output() toggleChange: EventEmitter<any> =new EventEmitter();
  @Output() toggleAfterChange: EventEmitter<any> =new EventEmitter();
  @Output() clickedCell: EventEmitter<any> = new EventEmitter();
  @Output() drop: EventEmitter<any>=new EventEmitter();
  @Output() paginationChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  @Input() tableFilteredData: any[] = [];

  @Input() totalCount: number = 50;

  @Output() selectingOptionId = new EventEmitter<any>();

  get tableFilterType() {
    return FilterType
  }

  constructor(
  private tableService:TableService,
  private cdr: ChangeDetectorRef,
  private fb: FormBuilder,
  private formService: FormService,) 
  { 
    super();
    this.intiTableFilters();
    this.searchForm = this.fb.group({
      customInputControl: [''],
    });
    this.tableDataSource.paginator = this.matPaginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.rowActionCheckbox = [' '];
    this.rowActionToggle = ['Active'];
    this.draggableRowsArray=['Drag'];
    this.icons = this.rowActionIcon?.map(({ iconColumnName }) => iconColumnName);
    this.toggles=this.rowActionToggles?.map(({toggleLabel})=>toggleLabel);
    this.togglesBefore=this.rowActionTogglesBefore?.map(({toggleLabel})=> toggleLabel);
    this.tableService.updateLang((this.lang || changes['lang'].currentValue) as SystemLanguage);
    this.showColumn();
    this.intiTableFilters();
    if(this.reloadFilter){
      this.filterForm.updateValueAndValidity();
    }
    this.cdr.markForCheck();
  }

  @ViewChild('paginator') paginator!: ElementRef;
  onPaginationChange(pagination: any) {
    this.paginationChange.emit(pagination);
  }


  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  cellClicked(n:any, e:any){
    this.clickedCell.emit({columnName: n, selectedRow: e})
  }

  dropped(event: any) {
    this.dragDisabled = true;
    moveItemInArray(this.tableDataSource.data, event.previousIndex, event.currentIndex);
    this.table.renderRows();
    // this.setTableDataSource(this.tableDataSource.data);
    this.tableDataSource.data=this.tableDataSource.data
    this.drop.emit({event : event, data: this.tableDataSource.data})
  }

  //Template Getter
  getButtonGroupTemplate(): TemplateRef<any> | null {
    const t = this.parentButtonGroupTemplate || this.buttonGroupTemplate;
    return t ? t.template : null;
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

  emitRowAction(row: Object, actionName: string, columnName? : string) {
    const data: EventColumn = {
      row,
      actionName,
      columnName
    };
    this.rowAction.emit(data);
  }

  onSelectionChange(event: any, element: TableColumn) {
    if (event.checked) {
      this.selection.select(element);
    } else {
      this.selection.deselect(element);
    }
    this.selectionChange.emit(this.selection.selected);
  }

  sortData(sortParameters: Sort) {
    if (this.enableSorting) {
      const keyName = sortParameters.active;
      let data = this.tableDataSource.data.slice(); // make a copy of the data array

      const numericColumns = this.numericColumns; // define the columns that should be sorted numerically

      if (sortParameters.direction === 'asc') {
        data.sort((a: any, b: any) => {
          if (a[keyName.toLocaleLowerCase()] === undefined || b[keyName.toLocaleLowerCase()] === undefined) {
            return 0; // fallback to no sort if keyName is undefined
          } else if (numericColumns.includes(keyName)) {
            return a[keyName.toLocaleLowerCase()] - b[keyName.toLocaleLowerCase()];
          } else {
            return a[keyName.toLocaleLowerCase()].localeCompare(b[keyName.toLocaleLowerCase()]);
          }
        });
      } else if (sortParameters.direction === 'desc') {
        data.sort((a: any, b: any) => {
          if (a[keyName.toLocaleLowerCase()] === undefined || b[keyName.toLocaleLowerCase()] === undefined) {
            return 0; // fallback to no sort if keyName is undefined
          } else if (numericColumns.includes(keyName)) {
            return b[keyName.toLocaleLowerCase()] - a[keyName.toLocaleLowerCase()];
          } else {
            return b[keyName.toLocaleLowerCase()].localeCompare(a[keyName.toLocaleLowerCase()]);
          }
        });
      } else {
        data = this.tableDataSource.data.slice(); // reset to the original data array
      }

      if(this.activeUsers){
        if (sortParameters.direction === 'asc') {
          data.sort((a: any, b: any) => {
            if (a['activeUsers'] === undefined || b['activeUsers'] === undefined) {
              return 0; // fallback to no sort if keyName is undefined
            } else if (numericColumns.includes(keyName)) {
              return a['activeUsers'] - b['activeUsers'];
            } else {
              return a['activeUsers'].localeCompare(b['activeUsers']);
            }
          });
        } else if (sortParameters.direction === 'desc') {
          data.sort((a: any, b: any) => {
            if (a['activeUsers'] === undefined || b['activeUsers'] === undefined) {
              return 0; // fallback to no sort if keyName is undefined
            } else if (numericColumns.includes(keyName)) {
              return b['activeUsers'] - a['activeUsers'];
            } else {
              return b['activeUsers'].localeCompare(a['activeUsers']);
            }
          });
        } else {
          data = this.tableDataSource.data.slice(); // reset to the original data array
        }
      }

      this.tableDataSource.data = data; // update the data source with the sorted data
    }
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLocaleLowerCase();


    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }

    this.filteredSearch.emit(filterValue);
    // Show a message when there is no data found
    this.tableDataSource.filteredData = this.tableDataSource.filteredData || [];
  }

  applyFilterColumn(event: Event, column: string,columnAr:string) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    if(this.lang === 'ar'){
      this.tableDataSource.filterPredicate = (data: any, filter: string) => {
        const columnValue = data[columnAr].toString().toLowerCase();
        return columnValue.indexOf(filter) !== -1;
    };
    }

    if(this.lang === 'en'){
      this.tableDataSource.filterPredicate = (data: any, filter: string) => {
      const columnValue = data[column].toString().toLowerCase();
      return columnValue.indexOf(filter) !== -1;
    };
    }




    this.tableDataSource.filter = filterValue;
    this.filteredData.emit(this.tableDataSource.filter);
  }

  applyFilter(
    filter: { type: 'string' | 'select'; value: string },
    dataKey: string
  ) {
    this.tableDataSource.filterPredicate = (
      data: any,
      filter: string | string[]
    ) => {
      const value = data[dataKey];
      if (Array.isArray(filter)) {
        return filter.length === 0 || filter.includes(value);
      } else {
        return value.toLowerCase().includes(filter);
      }
    };
    this.tableDataSource.filter = filter.value;
    this.filteredData.emit(this.tableDataSource.filter);
  }
  applySelectFilter(column: string,columnAr:string ,event: any) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    if(this.lang === 'en'){
      this.tableDataSource.filterPredicate = (data: any, filter: string) => {
        const columnValue = data[column].toString().toLowerCase();
        return columnValue.indexOf(filter) !== -1;
      };  
    }
    else if (this.lang === 'ar'){
      this.tableDataSource.filterPredicate = (data: any, filter: string) => {
        const columnValue = data[columnAr].toString().toLowerCase();
        return columnValue.indexOf(filter) !== -1;
      };
    }

    this.tableDataSource.filter = filterValue;
    this.filteredData.emit(this.tableDataSource.filter);
  }

  selectOption(option: Object) {
    this.selectingOptionId.emit(option);
  }

  showFilter(event: Event, item: any) {
    event.stopPropagation();
    let action = item.filter.show;
    this.tableColumns.forEach((col: any) => {
      if (col.filter) {
        col.filter.show = false;
      }
    });
    item.filter.show = !action;
  }


  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource(data);
    if (this.enableSorting) this.tableDataSource.sort = this.matSort;

    setTimeout(() => {
      if (this.isPageableTop || this.isPageableBottom) {
        this.tableDataSource.paginator = this.matPaginator;
      }
      // this.tableDataSource.paginator = this.matPaginator;
    }, 0);
  }
  

  openModal(e:any): void {
    this.customColumnEvent.emit(e);
  }

 showColumn() {
    // initialize filterValues for each column
    this.tableColumns.forEach((column) => {
      this.filterValues[column.dataKey] = '';
    });

    const columnNames: string[] = [];
    this.tableColumns.forEach((tableColumn: TableColumn) => {
      if (tableColumn.show) columnNames.push(tableColumn.name);
    });

    const someCol = this.tableColumns.some((col) => col.show);
    //Table with Draggable Rows, Toggle After, Toggle Before and Icons
    if (this.rowActionIcon && someCol && !this.selectable && this.draggableRows && this.isToggle && this.isToggleAfter) {
      this.displayedColumns = [
      ...this.draggableRowsArray,
      ...this.togglesBefore,
      ...columnNames,
      ...this.toggles,
      ...this.icons
    ];
    }
    //Table with Icons, Toggle Before, and Draggable Rows
    else if (this.rowActionIcon && someCol && !this.selectable && this.draggableRows && this.isToggle) {
      this.displayedColumns = [
      ...this.draggableRowsArray,
      ...this.togglesBefore,
      ...columnNames,
      ...this.icons
    ];
    }
    else if (this.rowActionIcon && someCol && !this.selectable && this.draggableRows && this.isToggleAfter) {
      this.displayedColumns = [
      ...this.draggableRowsArray,
      ...columnNames,
      ...this.toggles,
      ...this.icons
    ];
    }
    //Table With Icons and Draggable Rows
    else if (this.rowActionIcon && someCol && !this.selectable && this.draggableRows) {
      this.displayedColumns = [
      ...this.draggableRowsArray,
      ...columnNames,
      ...this.icons
    ];
    }
    //Table With Toggle Before, Toggle After and Icons
    else if (this.rowActionIcon && someCol && !this.selectable && this.isToggleAfter && this.isToggle ) {
      this.displayedColumns = [
      ...this.togglesBefore,
      ...columnNames,
      ...this.toggles,
      ...this.icons
    ];
    } 
    //Table with Icons and Toggle After
    else if (this.rowActionIcon && someCol && !this.selectable && this.isToggleAfter ) {
      this.displayedColumns = [
      ...columnNames,
      ...this.toggles,
      ...this.icons
    ];
    } 
    //Table Selection with Toggle Before, Toggle After, Icons and Draggable Rows
    else if (this.selectable && someCol && this.isToggle && this.isToggleAfter && this.draggableRows && this.rowActionIcon){
      this.displayedColumns = [
      ...this.draggableRowsArray,
      ...this.rowActionCheckbox,
      ...this.togglesBefore,
      ...columnNames,
      ...this.toggles,
      ...this.icons
    ];
    }
    //Table Selection with only Toggle Before, Toggle After and Draggable Rows
    else if (this.selectable && someCol && this.isToggle && this.isToggleAfter && this.draggableRows){
      this.displayedColumns = [
      ...this.draggableRowsArray,
      ...this.rowActionCheckbox,
      ...this.togglesBefore,
      ...columnNames,
      ...this.toggles
    ];
    }
    //Table Selection With only Toggle Before and Toggle After
    else if (this.selectable && someCol && this.isToggle && this.isToggleAfter){
      this.displayedColumns = [
      ...this.rowActionCheckbox,
      ...this.togglesBefore,
      ...columnNames,
      ...this.toggles
    ];
    }
    //Table with Draggable Rows, Toggle After, and Toggle Before
    else if ( someCol && this.isToggle && this.isToggleAfter && this.draggableRows){
      this.displayedColumns = [
        ...this.draggableRowsArray,
        ...this.togglesBefore,
        ...columnNames,
        ...this.toggles
      ];
    }
    //Table with Toggle Before and After
    else if ( someCol && this.isToggle && this.isToggleAfter){
      this.displayedColumns = [
        ...this.togglesBefore,
      ...columnNames,
      ...this.toggles
    ];
    }
    else if ( this.rowActionIcon && someCol && this.isToggle && this.isToggleAfter){
      this.displayedColumns = [
        ...this.togglesBefore,
      ...columnNames,
      ...this.toggles,
      ...this.icons
    ];
    }
    //Table with Icons and Toggle Before
    else if (this.rowActionIcon && someCol && !this.selectable && this.isToggle) {
      this.displayedColumns = [
        ...this.togglesBefore,
      ...columnNames,
      ...this.icons
    ];
    } 
    //Table with Icons Only
    else if (this.rowActionIcon && someCol && !this.selectable) {
      this.displayedColumns = [
      ...columnNames,
      ...this.icons
    ];
    } 
    //Table Selection with Icons and Draggable Rows Only
    else if (this.rowActionIcon && someCol && this.selectable && !this.isToggle && !this.isToggleAfter && this.draggableRows) {
      this.displayedColumns = [
        ...this.draggableRowsArray,
        ...this.rowActionCheckbox,
        ...columnNames,
        ...this.icons,
      ];
    } 
    else if (this.rowActionIcon && someCol && this.selectable && !this.isToggle && !this.isToggleAfter) {
      this.displayedColumns = [
        ...this.rowActionCheckbox,
        ...columnNames,
        ...this.icons,
      ];
    } 
    //Selection Table with Draggable Rows 
    else if (this.selectable && !this.isToggle && !this.isToggleAfter && this.draggableRows){
      this.displayedColumns = [
        ...this.draggableRowsArray,
        ...this.rowActionCheckbox,
        ...columnNames,
      ];
    }
    //Table Selection Only
    else if (this.selectable && !this.isToggle && !this.isToggleAfter){
      this.displayedColumns = [
        ...this.rowActionCheckbox,
        ...columnNames,
      ];
    }
    //Table Selection With Toggle Before and Draggable Rows Only
    else if (this.selectable && this.isToggle && !this.rowActionIcon && !this.isToggleAfter && this.draggableRows){
      this.displayedColumns = [
        ...this.draggableRowsArray,
        ...this.rowActionCheckbox,
        ...this.togglesBefore,
        ...columnNames,
      ];
    }
    //Table Selection With Toggle Before
    else if (this.selectable && this.isToggle && !this.rowActionIcon && !this.isToggleAfter){
      this.displayedColumns = [
        ...this.rowActionCheckbox,
        ...this.togglesBefore,
        ...columnNames,
      ];
    }

   //Table Selection with Toggle After and Draggable Rows
    else if (this.selectable && !this.isToggle && !this.rowActionIcon && this.isToggleAfter && this.draggableRows){
      this.displayedColumns = [
        ...this.draggableRowsArray,
        ...this.rowActionCheckbox,
        ...columnNames,
        ...this.toggles
      ];
    }
    //Table Selection With Toggle After
    else if (this.selectable && !this.isToggle && !this.rowActionIcon && this.isToggleAfter){
      this.displayedColumns = [
        ...this.rowActionCheckbox,
        ...columnNames,
        ...this.toggles
      ];
    }
    //Table Selection With Toggle Before, icons and Draggable Rows
    else if(this.selectable && this.isToggle && this.rowActionIcon &&this.draggableRows){
      this.displayedColumns = [
        ...this.draggableRowsArray,
        ...this.rowActionCheckbox,
        ...this.togglesBefore,
        ...columnNames,
        ...this.icons
      ];
      
    }
    //Table Selection With Toggle Before and Icons
    else if(this.selectable && this.isToggle && this.rowActionIcon){
      this.displayedColumns = [
        ...this.rowActionCheckbox,
        ...this.togglesBefore,
        ...columnNames,
        ...this.icons
      ];
    }
    //Table Selection with Toggle After, Draggable Rows and Icons
    else if(this.selectable && !this.isToggle && this.rowActionIcon && this.isToggleAfter && this.draggableRows){
      this.displayedColumns = [
        ...this.draggableRowsArray,
        ...this.rowActionCheckbox,
        ...columnNames,
        ...this.toggles,
        ...this.icons
      ];
    }
    else if(!this.selectable && !this.isToggle && this.rowActionIcon && this.isToggleAfter){
      this.displayedColumns = [
        ...this.rowActionCheckbox,
        ...columnNames,
        ...this.toggles,
        ...this.icons
      ];
    }
    //Table Selection with Toggle After and Icons
    else if(this.selectable && !this.isToggle && this.rowActionIcon && this.isToggleAfter){
      this.displayedColumns = [
        ...this.rowActionCheckbox,
        ...columnNames,
        ...this.toggles,
        ...this.icons
      ];
    }
    //Table With Draggable Rows and Toggle After
    else if(this.isToggleAfter && someCol && this.draggableRows){
      this.displayedColumns=[
        ...this.draggableRowsArray,
        ...columnNames,
        ...this.toggles
      ]
    }
    //Table With Toggle After Only
    else if(this.isToggleAfter && someCol){
      this.displayedColumns=[
        ...columnNames,
        ...this.toggles
      ]
    }
    //Table with Draggable Rows and Toggle Before Only
    else if(this.isToggle && someCol && this.draggableRows){
      this.displayedColumns=[
        ...this.draggableRowsArray,
        ...this.togglesBefore,
        ...columnNames,       
      ]
    }

    //Table with Toggle Before Only
    else if(this.isToggle && someCol){
      this.displayedColumns=[
        ...this.togglesBefore,
        ...columnNames,       
      ]
    }
    //Table with Draggable Rows Only
    else if(this.draggableRows && someCol){
      this.displayedColumns=[
        ...this.draggableRowsArray,
        ...columnNames,
      ]
    }
    else {
      this.displayedColumns = columnNames;
    }
  }

  clickedOutside(tableColumn: any): void {
    if (tableColumn.filter.show) tableColumn.filter.show = false;
  }

  updateActiveStatus1(event:any,element:any,column:any) {
    this.toggleChange.emit({columnName: column, element: element,event:event})
  }
  updateActiveStatus2(event:any,element:any,column:any) {
    this.toggleAfterChange.emit({columnName: column, element: element,event:event})
  }

  
  repeat(length: number): any {
    if (length >= 0) {
      return new Array(length);
    }
  }

  override ngOnDestroy(): void {
    this.tableService.destroy$.next(true);
  }

  intiTableFilters() {

    let filterParams: FilterParam[] = this.filterParams;

    this.formService.registerTableFilters(this.filterForm, this.tableDataSource, filterParams);
  }


  resetControls() {
    this.textControl.reset();
    this.dropDownControl.reset();
  }

}
