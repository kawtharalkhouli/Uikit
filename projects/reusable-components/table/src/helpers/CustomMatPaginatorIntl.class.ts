import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { takeUntil } from "rxjs";
import { SystemLanguage, TableService } from "../services/table.service";


const arabicRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 من ${length}`; }
    
    length = Math.max(length, 0);
  
    const startIndex = page * pageSize;
  
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
  
    return `${startIndex + 1} - ${endIndex} من ${length}`;
  }

  const englishRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 of ${length}`; }
    
    length = Math.max(length, 0);
  
    const startIndex = page * pageSize;
  
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
  
    return `${startIndex + 1} - ${endIndex} of ${length}`;
  }

@Injectable({providedIn: 'root'})
export class CustomMatPaginatorIntl extends MatPaginatorIntl{

    constructor(
        private tableService:TableService
    ){
        super();
        this.tableService.listenToLang()
        .pipe(takeUntil(this.tableService.destroy$))
        .subscribe({
            next: (lang)=>{
                this.updateTableLanguage(lang);
            }   
        })
    }

    updateTableLanguage(lang: SystemLanguage){
        if(lang  == 'ar'){
            this.itemsPerPageLabel = 'عدد العناصر في الصفحة';
            this.firstPageLabel='الصفحة الأولى';
            this.lastPageLabel='الصفحة الأخيرة';
            this.nextPageLabel='الصفحة التالية';
            this.previousPageLabel='الصفحة السابقة';
            this.getRangeLabel= arabicRangeLabel;
            this.changes.next();
        }
         else{
        this.itemsPerPageLabel = 'Items Per Page';
        this.firstPageLabel='First Page';
        this.lastPageLabel='Last Page';
        this.nextPageLabel='Next Page';
        this.previousPageLabel='Previous Page';
        this.getRangeLabel= englishRangeLabel;
        this.changes.next();
         }
    }

}