import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StepLabelComponent } from '../step-label/step-label.component';


@Component({
  selector: 'realsoft-step',
  templateUrl: './step.component.html',
})  
export class StepComponent implements OnInit {

  @ViewChild(TemplateRef) public stepTemplate: TemplateRef<any>;
  @ContentChild(StepLabelComponent) public labelTemplate: StepLabelComponent;


  @Input() stepControl: any;
  @Input() completed: boolean;
  @Input() editable: boolean;
  @Input() optional: boolean;
  @Input() hasError: boolean;
  @Input() errorMessage: string;
  @Input() state: any;

  ngOnInit() {
  }
  
}
