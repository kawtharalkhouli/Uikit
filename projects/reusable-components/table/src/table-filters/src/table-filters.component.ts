import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractResponseData, TableFilterType } from './helpers/models';


@Component({
  selector: 'table-filter',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableFiltersComponent implements OnInit {

    
  @Input() content: {
    type: TableFilterType
    labelEn: string;
    labelAr: string;
    data: AbstractResponseData[];
    control: FormControl | any;
    iconColor: string | any;
    iconName: string | any;
    topValue: string | any;
    filterBefore: boolean
  }

  @Input() lang= 'en';
  filteredData!: any;
  searchValue:any='';
  @Output() selectingOptionId = new EventEmitter<any>();
  @Output() filterSearch = new EventEmitter<any>();
  @Output() reloadFilter= new EventEmitter<any>();

  constructor() { }

  get tableFilterType() {
    return TableFilterType
  }

  get controlHasValue() {
    return !!this.content?.control?.value
  }
  ngOnInit(): void {

  }
  ngOnChanges(): void {
    this.filteredData = this.content.data;
  }
  columnTextSearch(event:any){
    this.filterSearch.emit(event)
  }

  selectOption(option: Object) {
    this.selectingOptionId.emit(option);
  }

  filterOptions(e :any , data :any){
    this.searchValue = e.target.value.toLowerCase();
    this.filteredData=data.filter((item: any) => {
      let compare = item.en;
      return compare.toLowerCase().includes(this.searchValue.toLowerCase());
    });
  }

  clearFilter(){
    this.reloadFilter.emit(true)
  }


}
