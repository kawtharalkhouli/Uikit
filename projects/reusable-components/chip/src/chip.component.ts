import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'custom-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip.component.html'
})
export class CustomChipComponent implements OnChanges {
    @Input() type!:string;
    @Input() label!:string;
    @Input() iconName!:string;
    @Input() size!:string;

    constructor(private cdr: ChangeDetectorRef) { }
    
    ngOnChanges(){this.cdr.markForCheck();}


}