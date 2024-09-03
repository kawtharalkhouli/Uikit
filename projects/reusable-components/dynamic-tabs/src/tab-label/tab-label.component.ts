import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';


@Component({
  selector: 'realsoft-tab-label',
  templateUrl:'./tab-label.component.html',
  styleUrls: ['./tab-label.component.scss']
})
export class RealsoftTabLabelComponent implements OnInit{
  @ViewChild(TemplateRef) public labelTemplate: TemplateRef<any>;
  @Input() label:string = '';
  @Input() prefixIcon: string = '';
  @Input() suffixIcon: string = '';
  @Input() prefixIconClass: string | string[];
  @Input() suffixIconClass: string | string[];

  @Output() prefixClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() suffixClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  prefixIconClicked(e: any){
    this.prefixClick.emit(e);
  }

  suffixIconClicked(e: any){
    this.suffixClick.emit(e);
  }

}
