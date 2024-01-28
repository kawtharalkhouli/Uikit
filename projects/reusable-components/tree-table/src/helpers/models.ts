export interface Data {
    nameEn: string;
    nameAr: string;
    icon?: string;
    color?:string;
    count?: number;
    checkbox?:boolean;
    action?:boolean
    children?: Data[];
    status?:boolean;
    id?:number;
    employeeName?:any;
    employeeNameAr?:any
    showIcon?:boolean;

  }
  
export interface DataNode {
    id:number
    expandable: boolean;
    nameEn: string;
    nameAr: string;
    count: number;
    level: number;
    visible: boolean;
    value: any;
  }
  
export interface TableColumn {
    name: string; // column name
    nameAr?:string; // column name in arabic
    dataKey: string; // name of key of the actual data in this column
    dataKeyAr?:any;
    className?:string;
    show:boolean;
    nested:boolean;
    action?:boolean;
    withIcon?:boolean;
    icon?: string;
    iconColor?:string;
    clickable?:boolean;
  }

export interface EventColumn {
    node: any;
    actionName: string;
    columnName?: string;
  }
  
export interface ActionIcon {
    iconName: string;
    iconColumnName: string;
    iconColumnNameAr?: string;
    iconColor?: string;
    className?: string;
    disabled?: boolean;
  }
  
export interface DynamicToggles {
    toggleLabel: string;
    toggleLabelAr?: string;
    id?: any;
    disabled?: boolean;
    checked?: boolean;
  }
  