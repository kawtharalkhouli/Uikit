import { InjectionToken } from "@angular/core";

//Define the default page size when there's no page size and there are no provided page size options
export const DEFAULT_PAGE_SIZE = 10;

//Creating a Change Event Object that is emitted when the user selects a different page size or navigates to another page.

export class PageEvent { 
    pageIndex: number; //The current page index
    previousPageIndex: number; //Index of the page that was selected previously
    pageSize: number; //The current page size
    length: number; //The current total number of items being paged
}

export interface RealsoftPaginatorDefaultOptions {
    pageSize?: number;//Number of items to display on a page. By default set to 10
    pageSizeOptions?: number[]; //The set of provided page size options to display to the user
    hidePageSize?: boolean; //Whether to hide the page size selection UI from the user
    showFirstLastButtons?: boolean; //Whether to show the first/last buttons UI to the user
}

//Injection Token that can be used to provide the default options for the paginator module.
export const REALSOFT_PAGINATOR_DEFAULT_OPIONS = new InjectionToken<RealsoftPaginatorDefaultOptions>(
    'REALSOFT_PAGINATOR_DEFAULT_OPIONS'
);

