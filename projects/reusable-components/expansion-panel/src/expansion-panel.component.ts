import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, TemplateRef } from '@angular/core';


@Component({
  selector: 'realsoft-expansion-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./expansion-panel.component.html' 
})
export class RealsoftExpansionPanelComponent implements OnChanges,AfterViewChecked{
    @Input() panels!: {title: string}[] | undefined;
    @Input() panelsContents!: TemplateRef<any>[] | undefined; ;
    @Input() isMultiple:boolean=false;
    selectedPanelIndex: any;
    @Output() opened:EventEmitter<any> = new EventEmitter();
    @Output() closed:EventEmitter<any> = new EventEmitter();
    @Output() afterCollapse:EventEmitter<any> = new EventEmitter();
    @Output() afterExpand:EventEmitter<any> = new EventEmitter();
  
    constructor(private cdr: ChangeDetectorRef) {
      this.selectedPanelIndex = null;
    }
  
    panelOpened(index: number, e :any) {
      this.selectedPanelIndex = index;
      this.opened.emit(e)
    }
  
    panelClosed(index: number, e :any) {
      if (this.selectedPanelIndex === index) {
        this.selectedPanelIndex = null;
      }
      this.closed.emit(e)
    }
    afterPanelCollapse(e:any){
     this.afterCollapse.emit(e)
    }
    afterPanelExpand(e:any){
     this.afterExpand.emit(e)
    }
    ngOnChanges(){this.cdr.detectChanges()}
  
    ngAfterViewChecked(){this.cdr.detectChanges()}
}
