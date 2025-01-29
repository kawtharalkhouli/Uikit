import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, NgZone, ViewChild, ViewEncapsulation } from "@angular/core";


@Component({
    selector: 'div[realsoftFormFieldNotchedOutline]',
    template: `<div class="realsoft-notch-piece realsoft-notched-outline__leading"></div>
        <div class="realsoft-notch-piece realsoft-notched-outline__notch" #notchOutline>
          <ng-content></ng-content>
        </div>
    <div class="realsoft-notch-piece realsoft-notched-outline__trailing"></div>`,
    host: {
        'class': 'realsoft-notched-outline',
        '[class.realsoft-notched-outline-notched]': 'open'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class RealsoftFormFieldNotchedOutline implements AfterViewInit {
        private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
        private _ngZone = inject(NgZone);

    @Input('realsoftFormFieldOpenNotchedOutline') open: boolean = false;

    @ViewChild('notchOutline') _notchElement: ElementRef;

    ngAfterViewInit(): void {
        const label = this._getFloatingLabelElement();

        if(label) {
            this._upgradeOutline();
            this._applyTransitionAnimation(label);
        } else {
            this._setNoFloatingLabelClass();
        }
    }
 
    private _getFloatingLabelElement(): HTMLElement | null {
        return this._elementRef.nativeElement.querySelector<HTMLElement>('.realsoft-floating-label');
    }

    private _upgradeOutline(): void {
        this._elementRef.nativeElement.classList.add('realsoft-notched-outline-upgraded');
    }

    private _setNoFloatingLabelClass(): void {
        this._elementRef.nativeElement.classList.add('realsoft-notched-outline-no-floating-label');
    }

    private _applyTransitionAnimation(label: HTMLElement): void {
        if(typeof requestAnimationFrame === 'function') {
            label.style.transitionDuration = '0s';
            this._ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => {
                    label.style.transitionDuration = '';
                })
            })
        }
    }

    _setNotchWidth(labelWidth: number) {
        (!this.open || !labelWidth) ? this._zeroNotchWidth() : this._calculateNotchWidth(labelWidth);
    }

    _zeroNotchWidth(): void {
        this._notchElement.nativeElement.style.width = '';
    }

    _calculateNotchWidth(labelWidth: number): void {
        const padding = 8;
        const border = 1;
        this._notchElement.nativeElement.style.width = `calc(${labelWidth}px * var(--realsoft-form-field-floating-label-scale, 0.75) + ${
            padding + border
        }px)`;
    }

}
