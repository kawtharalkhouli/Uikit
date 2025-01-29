import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, numberAttribute, OnDestroy, OnInit, Optional, Output, signal, ViewEncapsulation, WritableSignal } from "@angular/core";
import { Subscription } from "rxjs";
import { RealsoftPaginatorIntl } from "./paginator-intl";
import { DEFAULT_PAGE_SIZE, PageEvent, REALSOFT_PAGINATOR_DEFAULT_OPIONS, RealsoftPaginatorDefaultOptions } from "./paginator-config";


@Component({
    selector: 'realsoft-paginator',
    exportAs: 'realsoftPaginator',
    templateUrl: 'paginator.html',
    styleUrl: 'paginator.scss',
    host: {
        'class': 'realsoft-paginator',
        'role': 'group'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true
}) 
export class RealsoftPaginator implements OnInit, OnDestroy {
    private _pageIndex = 0;
    private _length = 0;
    private _pageSize: number;
    private _pageSizeOptions: number[] = [];
    private _intlChanges: Subscription;

    // Instead of using a ReplaySubject, use signals to allow you to directly access the current value without waiting for an emission.
    // The signal will always hold the current value and doesn't required explicit "replaying". Hence, it can replace a ReplaySubject in cases like this where you only need to track the latest state.
    _initialized: WritableSignal<boolean> = signal(false);
    _sortedPageSizeOptions: number[];

    //The Initial Page Index of the displayed list of items, the default value is set to zero
    @Input({transform: numberAttribute}) 
    get pageIndex(): number {
        return this._pageIndex;
    }
    set pageIndex(value: number) {
        this._pageIndex = value;
        this._changeDetectorRef.markForCheck();
    }

    //The Number of items to display on a page, By default set to 10
    @Input({transform: numberAttribute})
    get pageSize(): number{
        return this._pageSize;
    }
    set pageSize(value: number) {
        this._pageSize = value;
        this._changeDetectorRef.markForCheck();
    }

    //The length of the total number of items that are being paginated. Default is set to zero.
    @Input({transform: numberAttribute})
    get length(): number {
        return this._length;
    }
    set length(value: number) {
        this._length = value || 0;
        this._changeDetectorRef.markForCheck();
    }

    /**
     *@param value can be either a mutable array of numbers or a readonly array of numbers
    */
    @Input() //The set of provided page size options to be displayed to the user
    get pageSizeOptions(): number[] {
        return this._pageSizeOptions;
    }
    set pageSizeOptions(value: number[] | readonly number[]){
        //If the Value is null or undefined, then assign an empty array to ensure that the code won't break if the value is invalid.
        //The map function iterates over each element in the value array and converts each value aka n to a number or some numeric representation
        //If Coercion should fail then fall back to 0
        this._pageSizeOptions = (value || ([] as number[])).map(n => numberAttribute(n,0));
        this._updatePageSizeOptions(); //Update the Array
    }

    //Whether to hide the page size selection from the user
    @Input({transform: booleanAttribute}) hidePageSize = false;

    //Whether the paginator is disabled
    @Input({transform: booleanAttribute}) disabled = false;

    //Whether to show the first and last buttons to the user
    @Input({transform: booleanAttribute}) showFirstLastButtons = false;

    //Whenever the page index or page size change emit this event
    @Output() readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        public _internationalization: RealsoftPaginatorIntl,
        @Optional() @Inject(REALSOFT_PAGINATOR_DEFAULT_OPIONS) defaultValues?: RealsoftPaginatorDefaultOptions,
    ) {
        this._intlChanges = this._internationalization.changes$.subscribe(() => this._changeDetectorRef.markForCheck());
        if(defaultValues){
            //Object Destructuring
            const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons } = defaultValues;
            this._pageSize = pageSize ?? this._pageSize;
            this._pageSizeOptions = pageSizeOptions ?? this._pageSizeOptions;
            this.hidePageSize = hidePageSize ?? this.hidePageSize;
            this.showFirstLastButtons = showFirstLastButtons ?? this.showFirstLastButtons;
        }
    }

    ngOnInit(): void {
        this._initialized.set(true);
        this._updatePageSizeOptions();
    }

    private _updatePageSizeOptions() {
        if(!this._initialized()) return;

        //Set the page size to the first option of the pageSizeOptions array if not defined.
        if(!this.pageSize){
            this._pageSize = this.pageSizeOptions.length > 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
        }

        //Create a unique and sorted list of displayed page size options
        this._sortedPageSizeOptions = Array.from(
            new Set([...this._pageSizeOptions, this.pageSize])).sort((a,b) => a - b); 

        //Trigger Change Detection
        this._changeDetectorRef.markForCheck();
    } 

    //Determine whether there's a previous page or not
    hasPreviousPage(): boolean {
        return this.pageIndex >= 1 && this.pageIndex != 0;
    }
    
    //Method to proceed to the next page if there's any
    nextPage(): void {
        if(this.hasNextPage()) {
            this._navigate(this.pageIndex + 1);
        }
    }

    //Method to proceed to the last page if there's any
    previousPage(): void {
        if(this.hasPreviousPage()) {
            this._navigate(this.pageIndex - 1)
        }
    }

    //Method to proceed to the first page after making sure that the user is not already there
    firstPage(): void {
        //Make sure first that the user is not at the first page already
        if(this.hasPreviousPage()){
            this._navigate(0);
        }
    }

    //Method to proceed to the last page after making sure that the user is not already there
    lastPage(): void {
        if(this.hasNextPage()){
            this._navigate(this._lastPageIndex())
        }
    }

    //Determine whether there's a next page or not
    //To do so there must be a function that returns the total number of pages. 
    hasNextPage(): boolean {
        const lastPageIndex = this._lastPageIndex();
        return this.pageIndex < lastPageIndex && this.pageSize !=0 ;
    }

    //Calculate the number of pages
    getNumberOfPages(): number { 
        if (!this.pageSize) return 0;

        return Math.ceil(this.length / this.pageSize);
    }
    
    //Method to return the index of the last page for easier navigation
    private _lastPageIndex(): number{
        return this.getNumberOfPages() - 1;
    }

    //When the paginator's options change, emit an event to trigger the new changes
    private _pageEvent(previousPageIndex: number){
        this.page.emit({
            previousPageIndex,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        })
    }0

    //To Navigate to a certain page index
    private _navigate(index: number){
        //Store the value of the previous page index before modifying the page index value
        const previousPageIndex = this.pageIndex;

        if(index != previousPageIndex) {
            this.pageIndex = index;
            this._pageEvent(previousPageIndex);
        }
    }

    //Method that determines when to disable navigation to the next page
    _disableNextButton(): boolean {
        return this.disabled || !this.hasNextPage();
    }

    //Method that determines when to disable navigation to the previous page
    _disablePreviousButton(): boolean {
        return this .disabled || !this.hasPreviousPage();
    }

    //When updating the page size, the page index needs to be recaluculated and the page size needs to be updated based on the selected one
    _updatePageSize(pageSize: number) {
        //pageIndex is the current page number which typically starts at 0 for the first page
        //page size is the number of items per page
        //initialIndex represents the index of the first item in the current page in the dataset provided.
        //If pageIndex is 2 and pageSize is 10 then initial index is 20
        const initialIndex = this.pageIndex * this.pageSize;
        const previousPageIndex = this.pageIndex; //Store the previous current page value to trigger changes later. 

        //Recalculate the new Page Index 
        //Use Math.floor to ensure that the result is rounded down to the nearest whole number. 
        //The || 0 is a fallback to ensure that the new pageIndex is set to 0 if the calculated value is NAN, null, or undefined. 
        this.pageIndex = Math.floor(initialIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._pageEvent(previousPageIndex);//Trigger Changes.
    }

    ngOnDestroy(): void {
        this._initialized.set(false);
        this._intlChanges.unsubscribe(); //Kill the subscription
    }
}