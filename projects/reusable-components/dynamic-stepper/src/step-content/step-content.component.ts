import { CdkStep } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'realsoft-step-content',
  templateUrl: './step-content.component.html',
  providers: [{ provide: CdkStep, useExisting: StepContentComponent}]
})
export class StepContentComponent implements OnInit{
  constructor() { }

  ngOnInit() {
  }
}
