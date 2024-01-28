import {AfterContentChecked, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, TemplateRef } from '@angular/core';


@Component({
  selector: 'realsoft-expansion-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./expansion-panel.component.html' 
})
export class RealsoftExpansionPanelComponent implements OnChanges,AfterViewChecked,AfterContentChecked{
  @Input() panels!: {title: string, subtitle?:string,titleAr?: string, subtitleAr?:string, expanded:boolean}[] | undefined;
  @Input() panelsContents!: TemplateRef<any>[] | undefined; ;
  @Input() isMultiple:boolean=false;
  @Input() lang: string = 'en';
  @Input() panelTitle!: string;
  @Input() panelDescription!:string;
  @Input() multi:boolean=false;
  @Input() hideToggle:boolean=false;
  @Input() disabled:boolean=false;
  @Input() expanded:boolean=false;
  @Input() isDynamic:boolean=false;

  selectedPanelIndex: any;

  //Output Emitters
  @Output() opened:EventEmitter<any> = new EventEmitter();
  @Output() closed:EventEmitter<any> = new EventEmitter();
  @Output() afterCollapse:EventEmitter<any> = new EventEmitter();
  @Output() afterExpand:EventEmitter<any> = new EventEmitter();

  openedEvent(e:any){
    this.opened.emit(e);
  }

  closedEvent(e:any){
    this.closed.emit(e);
  }

  afterCollapseEvent(e:any){
    this.afterCollapse.emit(e);
  }

  afterExpandEvent(e:any){
    this.afterExpand.emit(e);
  }
  
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
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

}
