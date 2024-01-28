import { Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
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
    control: FormControl
  }

  @Input() lang= 'en';

  constructor() { }

  get tableFilterType() {
    return TableFilterType
  }

  get controlHasValue() {
    return !!this.content?.control?.value
  }
  ngOnInit(): void {

  }


}
