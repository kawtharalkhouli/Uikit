import { Directive, ElementRef, inject, NgZone, OnDestroy } from "@angular/core";

@Directive({
    selector: 'div[realsoftFormFieldLineRipple]',
    host: {
        'class': 'realsoft-line-ripple'
    },
    standalone: true
})
export class RealsoftFormFieldLineRipple implements OnDestroy {
    private _ngZone = inject(NgZone);
    private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _cleanupTransition: () => void;


    constructor() {
        this._ngZone.runOutsideAngular(() => {
            const transitionHandler = this._handleTransition.bind(this);
            this._elementRef.nativeElement.addEventListener('transitionend', transitionHandler);

            this._cleanupTransition = () => {
                this._elementRef.nativeElement.removeEventListener('transitionend', transitionHandler)
            }
        })
    }

    activateRipple() {
        this._elementRef.nativeElement.classList.remove('realsoft-line-ripple-deactivating');
        this._elementRef.nativeElement.classList.add('realsoft-line-ripple-active');
    }

    deactivateRipple() {
        this._elementRef.nativeElement.classList.remove('realsoft-line-ripple-active');
        this._elementRef.nativeElement.classList.add('realsoft-line-ripple-deactivating');
    }

    private _handleTransition = (event: TransitionEvent) => {
        const deactiviating = this._elementRef.nativeElement.classList.contains('realsoft-line-ripple-deactivating');

        if(event.propertyName === 'opacity' && deactiviating) this._elementRef.nativeElement.classList.remove('realsoft-line-ripple-active', 'realsoft-line-ripple-deactivating');
    }

    ngOnDestroy(): void {
        this._cleanupTransition();
    }

}

