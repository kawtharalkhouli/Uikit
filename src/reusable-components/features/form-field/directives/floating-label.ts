import { SharedResizeObserver } from "@angular/cdk/observers/private";
import { Directive, ElementRef, inject, InjectionToken, Input, NgZone, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";


export interface RealsoftFloatingLabelParent {
    _handleLabelResized(): void;
  }
  
export const REALSOFT_FLOATING_LABEL_PARENT = new InjectionToken<RealsoftFloatingLabelParent>('RealsoftFloatingLabelParent');

@Directive({
    selector: 'label[realsoftFormFieldFloatingLabel]',
    host: {
        'class': 'realsoft-floating-label',
        '[class.realsoft-floating-label-float-above]': 'floating'
    },
    standalone: true
})
export class RealsoftFormFieldFloatingLabel implements OnDestroy{ 
    private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _floating = false;
    private _monitorResize = false;
    private _resizeObserver = inject(SharedResizeObserver);
    private _ngZone = inject(NgZone);
    private _parentWrapper = inject(REALSOFT_FLOATING_LABEL_PARENT);
    private _resizeLabelSubscription = new Subscription();

    @Input() 
    get floating() {
        return this._floating;
    }
    set floating(value: boolean) {
        this._floating = value;
        if(this.monitorResize) this._handleResize()
    }

    @Input()
    get monitorResize() {
      return this._monitorResize;
    }
    set monitorResize(value: boolean) {
      this._monitorResize = value;
      if (this._monitorResize) {
        this._resizeSubscription();
      } else {
        this._resizeLabelSubscription.unsubscribe();
      }
    }

    //Get the HTML Element of the floating label.
    get element(): HTMLElement {
        return this._elementRef.nativeElement;
    }

    //Get the width of the label, used when appearance is outline.
    getWidth(): number {
      return this.calculateElementScrollWidth(this._elementRef.nativeElement);
    }

    //Handle the resizing events when subscribing to the resizeobserver
    private _handleResize() {
        setTimeout(() => this._parentWrapper._handleLabelResized());
    }

    //Subscribe to resizing events by using Content Observer to watch elements for changes to their contents
    private _resizeSubscription() {
        this._resizeLabelSubscription.unsubscribe();
        this._ngZone.runOutsideAngular(() => {
            this._resizeLabelSubscription = this._resizeObserver.observe(this._elementRef.nativeElement,{box: 'border-box'}).subscribe(()=>{
              this._handleResize();
            });
        })
    }

    //A function to estimate the scrollWidth of an HTML element, even if the element is not currently visible in the DOM
    calculateElementScrollWidth(element: HTMLElement): number {
        const htmlElement = element as HTMLElement; //cast the function input parameter as an HTMLElement to explicitly ensure that the type is an HTMLElement

        //Checking if the element is visible => The offset property checks if the element is part of the visible DOM
        //If offsetParent is not null then the element is visible, hence the function will return the scroll width immediately.
        if(htmlElement.offsetParent !== null) return htmlElement.scrollWidth;

        //Handling Hidden Elements
        //1. If the element is not visible => display: none for example then it's scroll width cannot be calculated directly.
        //2. The function creates a clone of the original element using cloneNode(true) => A deep clone that includes child nodes
        const clonedElement = htmlElement.cloneNode(true) as HTMLElement;

        //Position the cloned element to be off-screen
        // The clone is styled to be absolutely positioned and moved off-screen using tranform: translate, which ensures the clone doesn't effect the layout of the visible page.
        clonedElement.style.setProperty('position', 'absolute');
        clonedElement.style.setProperty('transform','translate(-9999px, -9999px)');

        //Appened the cloned element to the DOM so that it's dimensions can be measured
        document.documentElement.appendChild(clonedElement);

        //Measure the width and remove the clone for unnecessary cluttering
        const scrollWidth = clonedElement.scrollWidth;
        clonedElement.remove();

        return scrollWidth
    }

    ngOnDestroy() {
        this._resizeLabelSubscription.unsubscribe();
      }
  }
  