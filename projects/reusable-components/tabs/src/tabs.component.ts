import {  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges,  Output,  TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'realsoft-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RealsoftTabsComponent implements OnChanges{
  @Input() tabs!: {label: string}[];
  @Input() tabsContents!: TemplateRef<any>[] ;
  @Input() orientation!:string;
  @Input() selectedTabIndex: number=0;

  @Output() selectedTabChange= new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(): void {
    this.cdr.detectChanges();
  }
  tabChange(e:any){
    this.selectedTabIndex = e.index
    this.selectedTabChange.emit(e)
  }
}
