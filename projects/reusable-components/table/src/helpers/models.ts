
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
    showTooltip?:boolean;
    filter?: {
      type: number;
      value?: string;
      labelEn? : string;
      labelAr?: string;
      formControl? : string;
      options?: FilterOption[];
      show?: boolean; // enable filter card
    };
  }
  
  export interface FilterOption {
    id: number;
    nameEn: string;
    nameAr: string
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
  export interface DynamicTogglesBefore{
    toggleLabel:string;
    toggleLabelAr?:string;
    id?:any;
    checked?:boolean;
    disabled?:boolean;
  }
  
 export interface DynamicToggles{
    toggleLabel:string; 
    toggleLabelAr?:string;
    id?:any;
    disabled?:boolean;
    checked?:boolean
  }

  export enum FilterType {
    dropDown = 1,
    text = 2,
    number = 3,
    multiSelect = 4,
    global,
    date
} 



export interface FilterParam {
  key: string;
  type: TableFilterType
}

export interface TransformedFilterParam extends FilterParam {
  value: any;
}

export interface TableFilterOptions {
  condition: "AND" | "OR";
}


export enum TableFilterType {
  dropDown = 1,
  text = 2,
  number = 3,
  multiSelect = 4,
  global,
  date
}
