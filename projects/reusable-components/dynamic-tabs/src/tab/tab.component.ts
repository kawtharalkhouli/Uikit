import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { RealsoftTabLabelComponent } from '../tab-label/tab-label.component';


@Component({
  selector: 'realsoft-tab',
  templateUrl:'./tab.component.html'
})
export class RealsoftTabComponent implements OnInit{
    @ViewChild(TemplateRef) public tabTemplate: TemplateRef<any>;
    @ContentChild(RealsoftTabLabelComponent) public labelTemplate: RealsoftTabLabelComponent;
    @Input() disabled: boolean = false;
    @Input() bodyClass: string | string[];
    @Input() labelClass: string | string[];
    constructor() {}
  
    ngOnInit() {
    }
}
