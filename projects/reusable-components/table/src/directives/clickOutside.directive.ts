import {
    Directive,
    ElementRef,
    Output,
    EventEmitter,
    HostListener,
    OnInit,
  } from '@angular/core';
  import { fromEvent } from 'rxjs';
  import { take } from 'rxjs/operators';
  
  @Directive({
    selector: '[appClickOutside]',
  })
  export class ClickOutsideDirective implements OnInit {
    @Output() clickOutside = new EventEmitter();
  
    captured:boolean = false;
  
    constructor(private elRef: ElementRef) {}
  
    @HostListener('document:click', ['$event.target'])
    onClick(target: Event) {
      if (!this.captured) {
        return;
      }
  
      if (!this.elRef.nativeElement.contains(target)) {
        this.clickOutside.emit();
      }
    }
  
    ngOnInit() {
      fromEvent(document, 'click', { capture: true })
        .pipe(take(1))
        .subscribe(() => (this.captured = true));
    }
  }
  