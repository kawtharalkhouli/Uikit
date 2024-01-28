export interface TableColumn {
    name: string; // column name
    nameAr?:string; // column name in arabic
    dataKey: string; // name of key of the actual data in this column
    dataKeyAr?:any;
    position?: 'right' | 'left'; // should it be right-aligned or left-aligned?
    isSortable?: boolean; // can a column be sorted?
    isSearchable?: boolean; //can a column be searched?
    isFilterable?: boolean; // can a column be filtered?
    show?: boolean; // show or hide custom column
    clickable?:boolean;
    className?:string;
    classNameKey?:any;
    filter?: {
      type: 'string' | 'select';
      value?: string | string[];
      options?: string[];
      show?: boolean; // enable filter card
    };
}
  
  
export interface ActionIcon{
    iconName: string;
    iconColumnName: string;
    iconColumnNameAr?:string;
    iconColor?: string;
    className?:string;
    disabled?:boolean
}
  
export interface EventColumn {
    row: Object;
    actionName: string;
    columnName?: string;
}
  