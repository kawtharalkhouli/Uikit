import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { FormControl } from "@angular/forms";
import { ButtonsDirective } from "./directives/buttons.directive";
import {
  ActionIcon,
  DynamicToggles,
  EventColumn,
  TableColumn,
  Data,
  DataNode,
} from "./helpers/models";

@Component({
  selector: "realsoft-tree-table",
  templateUrl: "./tree-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;
  @Input() isGlobalSearch: boolean = false; // enable global search
  @Input() label: string = "Search..";
  @Input() placeholder: string = "Search..";
  @Input() parentButtonGroupTemplate!: ButtonsDirective;
  @Input() expandAllToggle: boolean = false;
  @Input() expandAll: boolean = false;
  @Input() expandAllText: string;
  @Input() tableColumns!: TableColumn[]; // data table columns
  @ContentChild(ButtonsDirective) buttonGroupTemplate!: ButtonsDirective;
  @Input() rowActionIcon!: ActionIcon[];
  @Input() rowActionToggles!: DynamicToggles[];
  @Input() rowActionCheckbox!: string[];
  @Input() lang: string = "en";
  @Input() isToggleAfter: boolean = false;
  @Input() nodeActionText: string = "New Subject";
  @Input() headerActionText: string = "New Subjects Group";
  @Input() draggable: boolean = false;
  @Input() previouslyExpanded: boolean =false;
  @Input() count: number =5;
  @Input() isLoading: boolean =false;
  @Input() size : any;
  @Input() isCount:boolean=false;
  @Input() parentChildDisabled: boolean=false;


  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }



  searchFilter = new FormControl();
  initialArray = []

  @Output() rowAction: EventEmitter<EventColumn> = new EventEmitter<EventColumn>();
  @Output() toggleChange: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() nodeClick: EventEmitter<any> = new EventEmitter();
  @Output() headerClick: EventEmitter<any> = new EventEmitter();

  public displayedColumns!: string[];

  icons: any[] = [];
  toggles: any[] = [];
  parentsDisabled =false;
  leafsDisabled=false;


  getButtonGroupTemplate(): TemplateRef<any> | null {
    const t = this.parentButtonGroupTemplate || this.buttonGroupTemplate;
    return t ? t.template : null;
  }

  private transformer = (node: Data, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      nameAr: node.nameAr,
      nameEn: node.nameEn,
      icon: node.icon,
      color: node.color,
      count: node.count,
      level: level,
      checkbox: node.checkbox,
      action: node.action,
      status : node.status,
      id: node.id,
      dataKey: node.employeeName,
      dataKeyAr: node.employeeName,
      showIcon: node.showIcon,

    };
  };
  treeControl = new FlatTreeControl<DataNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource: any = new MatTreeFlatDataSource(
    this.treeControl as any,
    this.treeFlattener
  );

  setTableDataSource(data: any) {
    this.dataSource.data = this.initialArray = data; 
    if(this.previouslyExpanded){
      this.expandAll=true;
      this.treeControl.expandAll();
      this.expandAllText = this.lang === 'ar' ? 'إغلاق الكل' : 'Collapse All';
    }

    else if(!this.previouslyExpanded){
      this.expandAll=false;
      this.treeControl.collapseAll();
      this.expandAllText = this.lang === 'ar' ? 'عرض الكل' : 'Expand All';
    }
    this.cdr.detectChanges();
  }
  selection = new SelectionModel<any>(true, []);

  constructor(private cdr: ChangeDetectorRef) {
  }

  @Output() clickedCell: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.searchFilter.valueChanges.pipe().subscribe({
      next: (value: string) => {
        let filteredArray = this.searchText(this.initialArray, value);
        this.dataSource.data = filteredArray;
        this.treeControl.expandAll()
      },
    });
  }
  ngAfterViewInit() {this.cdr.detectChanges();}

  hasChild = (_: number, node: DataNode) => node.expandable;

  ngOnChanges(changes: SimpleChanges): void {
    this.rowActionCheckbox = [" "];
    this.icons = this.rowActionIcon?.map(
      ({ iconColumnName }) => iconColumnName
    );
    this.toggles = this.rowActionToggles?.map(({ toggleLabel }) => toggleLabel);
    this.showColumn();
    this.cdr.markForCheck();
  }

  emitRowAction(row: any, actionName: string, columnName?: string) {
    let node= this.search(row.id, this.dataSource.data)
    const data: EventColumn = {
      node,
      actionName,
      columnName,
    };
    this.rowAction.emit(data);
  }

  search(id: any, array: Data[]) {

    for (const node of array) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const result = this.search(id,node.children);
        if (result) {
          return result;
        }
      }
    } 
    return null;
  }

  public searchText(items: any[], term: string): any[] {
    return items.reduce((result, item) => {
      if (this.contains(item.nameEn, term) || this.contains(item.nameAr, term) || this.contains(item.employeeName, term)) {
        result.push(item);
      } else if (item.children && item.children.length > 0) {
        const newItems = this.searchText(item.children, term);
        if (newItems.length > 0) {
          result.push({ ...item, children: newItems });
        }
      }

      return result;
    }, []);
  }

  showColumn() {
    // initialize filterValues for each column
    const columnNames: string[] = [];
    this.tableColumns.forEach((tableColumn: TableColumn) => {
      if (tableColumn.show) columnNames.push(tableColumn.name);
    });

    const someCol = this.tableColumns.some((col) => col.show);
    //Table with Draggable Rows, Toggle After, Toggle Before and Icons
    if (this.rowActionIcon && someCol && this.isToggleAfter) {
      this.displayedColumns = [...columnNames, ...this.toggles, ...this.icons];
    }
    if (this.rowActionIcon && someCol && !this.isToggleAfter) {
      this.displayedColumns = [...columnNames, ...this.icons];
    }
    if (!this.rowActionIcon && someCol && this.isToggleAfter) {
      this.displayedColumns = [...columnNames, ...this.toggles];
    }
  }
  updateActiveStatus(element: any, column: any, event: any) {
    let node= this.search(element.id, this.dataSource.data)
    this.toggleChange.emit({ columnName: column, element: node, event: event });
  }

  collapse(e: any) {
    if (!e.checked) {
      this.treeControl.collapseAll();
      this.lang === 'ar' ?  this.expandAllText='عرض الكل' : this.expandAllText='Expand All';
      this.parentsDisabled =false;
      this.leafsDisabled=false
    } else {
      this.treeControl.expandAll();
      this.lang === 'ar' ?  this.expandAllText='إغلاق الكل' : this.expandAllText='Collapse All'
      this.parentsDisabled =false;
      this.leafsDisabled=false
    }
    this.cdr.detectChanges();
  }

  filter(searchText: string, array: Data[]) {
    return array.map((node) => {
      if (node.nameEn.toLowerCase().includes(searchText.toLowerCase())) {
        return node;
      } else if (!!node.children && node.children.length > 0) {
        return {
          ...node,
          children: this.filter(searchText, node.children),
        };
      }
      return node;
    });
  }
  nodeClicked(n: any) {
    let node= this.search(n.id, this.dataSource.data)
    this.nodeClick.emit(node);
  }
  headerClicked(n: string) {
    this.headerClick.emit(n);
  }
  onSelectionChange(event: any, element: any) {

    let dataToEmit= this.search(element.id, this.dataSource.data);  
    if (event.checked) {
      let selection= this.search(element.id, this.dataSource.data);
      this.selection.selected.push(selection)
      if(this.parentChildDisabled){
        if(!this.selection.selected.length) {
          this.parentsDisabled = false;
          this.leafsDisabled = false;
        }
        let leafNodeChecked = this.selection.selected.some(node => node.children.length === 0)
  
        if(leafNodeChecked) {
          this.parentsDisabled = true;
          this.leafsDisabled = false;
        }
        else{
          this.parentsDisabled = false;
          this.leafsDisabled = true;
        }
  
      }
    } else {
      let deselection= this.search(element.id, this.dataSource.data);
      this.selection.selected.pop();
      if(this.parentChildDisabled){
        if(!this.selection.selected.length) {
          this.parentsDisabled = false;
          this.leafsDisabled = false;
        }
        let leafNodeChecked = this.selection.selected.some(node => node.children.length === 0)
  
        if(leafNodeChecked) {
          this.parentsDisabled = true;
          this.leafsDisabled = false;
        }
        else{
          this.parentsDisabled = false;
          this.leafsDisabled = false;
        }
  
      }
    }
    this.selectionChange.emit({
      event: event,
      selected: dataToEmit,
      selection: this.selection.selected
    });
  }

  repeat(length: number): any {
    if (length >= 0) {
      return new Array(length);
    }
  }
  cellClicked(e:any){
    this.clickedCell.emit(e)
}

contains(text: string, term: string): any {
  if (text) return text.toLowerCase().search(term?.toLowerCase() || '') >= 0;
}
}
