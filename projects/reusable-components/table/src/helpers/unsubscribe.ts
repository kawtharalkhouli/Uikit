import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export abstract class Unsubscribe implements OnDestroy {
    protected destroy$ = new Subject<boolean>();
    constructor(

    ) { }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

}

