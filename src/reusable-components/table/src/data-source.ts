import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";


export class RealsoftTableDataSource<T> extends DataSource<T> {
    //Stream that emits when a new data array is set on the data source
    private readonly _data: BehaviorSubject<T[]>;

    get data() {
        return this._data.value; //Return the data array that will be rendered by the table. 
    }

    set data(data: T[]) {
        data = Array.isArray(data) ? data : []; // Type Checking
        this._data.next(data);

    }

    connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
        throw new Error("Method not implemented.");
    }
    disconnect(collectionViewer: CollectionViewer): void {
        throw new Error("Method not implemented.");
    }

}