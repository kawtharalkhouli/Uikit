import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
}) 
export class RealsoftPaginatorIntl {
    private readonly changes = new Subject<void>();
    readonly changes$: Observable<void> = this.changes.asObservable();

    //A label for the button that moves to the first page
    firstPageLabel: string = 'First Page';

    //A label for the button that moves to the last page
    lastPageLabel: string = 'Last Page';

    //A label for the button that moves to the next page
    nextPageLabel: string = 'Next Page';

    //A label for the button that moves to the previous page
    previousPageLabel: string = 'Previous Page'

    //A label for the page size selector
    itemsPerPageLabel: string = 'Items per Page';


    //A label for the range of items within the current page and the length of the whole list
    //getRangeLabel is declared with a specific function type, the function takes three arguments page, pageSize, length and returns a string
    getRangeLabel: (page: number, pageSize: number, length: number) => string = (
        page,
        pageSize,
        length
    ) => {
        //First: Empty or zero page dataset case: When there's no items (length = 0) or no items can be shown per page (pageSize = 0)
        if (length === 0 || pageSize === 0) return `0 of ${length}`;

        //Second: Make sure that length is not negative. 
        length = Math.max(length, 0);

        //Determine the first item index of the current page
        const initialIndex = page * pageSize; 

        //Computing the final index of the last item on the current page
        let finalIndex;

        //Check whether the first index is within the set 
        if(initialIndex < length){
            //initialIndex + pageSize is the maximum index of the current page
            finalIndex = Math.min(initialIndex + pageSize, length);
        } else {
            //the final index is the initialIndex + pageSize if the initial index exceeds the dataset length
            finalIndex = initialIndex + pageSize
        }
        return `${initialIndex + 1} - ${finalIndex} of ${length}`;
    }
}
  
