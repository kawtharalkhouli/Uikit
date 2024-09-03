import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'realsoft-step-label',
  templateUrl: './step-label.component.html',
})

export class StepLabelComponent implements OnInit{
  @ViewChild(TemplateRef) public labelTemplate: TemplateRef<any>;
  @Input() label:string = '';

  constructor() { }

  ngOnInit() {
  }
}
