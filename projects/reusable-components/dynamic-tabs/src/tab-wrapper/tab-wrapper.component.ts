import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewEncapsulation} from '@angular/core';
import { RealsoftTabComponent } from '../tab/tab.component';


@Component({
  selector: 'realsoft-tab-group',
  templateUrl:'./tab-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RealsoftTabGroupComponent implements OnChanges{
    @ContentChildren(RealsoftTabComponent) public tabItems: QueryList<RealsoftTabComponent>;
    @Input() selectedTabIndex: number;
    @Input() animationDuration: string = '900ms';
    @Input() disableRipple: boolean = false;
    @Input() dynamicHeight: boolean = false;
  
    @Output() selectedTabChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter<any>();
  
    tabChange(e: any){
    this.selectedTabIndex = e.index
    this.selectedTabChange.emit(e);
    }
  
    indexChange(e: any){
        this.selectedTabIndex = e;
    this.selectedIndexChange.emit(e);
    }
  
    constructor(private cdr: ChangeDetectorRef) { }

    ngOnChanges() {
    this.cdr.detectChanges()
    this.cdr.markForCheck()
    }
}
