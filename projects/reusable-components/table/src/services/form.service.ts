import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SystemService } from './system.service';
import { isArray } from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { FilterParam, TableFilterOptions, TableFilterType, TransformedFilterParam } from '../helpers/models';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private systemService: SystemService
  ) { }

  registerTableFilters<T = any>(formGroup: FormGroup, dataSource: MatTableDataSource<T>, filterParams: FilterParam[], options?: TableFilterOptions) {

    formGroup = this.generateFilterControls(formGroup, filterParams);

    dataSource.filterPredicate = this.getFilterPredicate<T>(options?.condition || "AND");

    formGroup.valueChanges
      .subscribe({
        next: (_values) => {

          let values = this.systemService.sanitizeObjectValues(_values);
          let filterValues = this.transformFilterValues(filterParams, values)
          dataSource.filter = JSON.stringify(filterValues)
        }
      })
  }


  getFilterPredicate<T = any>(filterType: "AND" | "OR" = "AND") {

    return (row: T, _filter: string) => {

      let filters: TransformedFilterParam[] = JSON.parse(_filter);
      let shouldReturnRow = true;

      if (isArray(filters) && !filters.length) return shouldReturnRow;
      // if(!isArray(filters)) filters = [filters]
      
      let globalSearch = filters.find(row => row.key == "globalSearch")

      if (globalSearch) {
        shouldReturnRow = this.searchForGlobalAttribute(row, globalSearch.value)
        if (!shouldReturnRow) return shouldReturnRow;
        filters = filters.filter(row => row.key != "globalSearch")
      }

      for (const filter of filters) {

        let filterValue = filter.value;
        const rowItemValue = row[filter.key];

        if (filterValue && !rowItemValue) {
          shouldReturnRow = false;
          break;
        }

        switch (filter.type) {

          case TableFilterType.text: {            
            if(typeof rowItemValue === "number") shouldReturnRow = rowItemValue?.toString()?.toLowerCase()?.includes((filterValue)?.toLowerCase());
            else
            shouldReturnRow = rowItemValue?.toLowerCase()?.includes((filterValue)?.toLowerCase())
            break;
          }

          case TableFilterType.dropDown: {
            shouldReturnRow = filterValue == rowItemValue
            break;
          }

          case TableFilterType.date: {
            filterValue = moment(filterValue).format('DD/MM/YYYY');
            shouldReturnRow = filterValue == rowItemValue;
            break;
          }

        }

        if (!shouldReturnRow && filterType == "AND") break;
        else if (shouldReturnRow && filterType == "OR") break;
      }

      return shouldReturnRow
    }
  }

  generateFilterControls(formGroup: FormGroup, filterParams: FilterParam[]) {

    let params = filterParams.map(param => param.key);
    
    formGroup.addControl('globalSearch', new FormControl(null))

    for (const param of params) {
      formGroup.addControl(param, new FormControl(null))
    }

    return formGroup

  }

  searchForGlobalAttribute(row: { [key: string]: any }, searchValue: string): boolean {

    let found = false;

    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const element = row[key];

        if (typeof element == "string") {
          found = element.toLowerCase().includes((searchValue).toLowerCase())

        } else if (typeof element == "number") {
          found = element == Number(searchValue)
        }

        if (found) return found;
      }
    }
    return false
  }

  transformFilterValues(filterParams: FilterParam[], filterValues: { [key: string]: any }) {

    let transformedParams = [];

    for (const key in filterValues) {

      if (Object.prototype.hasOwnProperty.call(filterValues, key)) {

        let param = filterParams.find(row => row.key === key)

        let newParam = {
          ...param,
          value: filterValues[key]
        }

        transformedParams.push(newParam);
      }
    }

    return transformedParams;
  }

}

