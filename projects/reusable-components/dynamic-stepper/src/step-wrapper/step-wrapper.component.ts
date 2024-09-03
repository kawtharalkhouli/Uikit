import { CdkStepper } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';
import { timer } from 'rxjs';
import { StepComponent } from '../step/step.component';

@Component({
  selector: 'realsoft-stepper-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-wrapper.component.html',
  encapsulation:ViewEncapsulation.None,
  providers: [
    {provide: CdkStepper, useExisting: RealsoftStepperGroupComponent},
  ],
})
export class RealsoftStepperGroupComponent extends CdkStepper{

    
  @ViewChild('stepper') stepper: any;

  @ContentChildren(StepComponent) dynamicSteps: QueryList<StepComponent>;
//   public dynamicSteps: QueryList<StepComponent>;

  @Input() override get selectedIndex(): number {
    return 1;
  }
  override set selectedIndex(index: number) {
    
  }

  @Input() labelPosition: 'bottom' | 'end' = 'bottom';
  @Input() disableRipple: boolean;

  @Output() change: EventEmitter<any> = new EventEmitter()

  changeStepper(e:any){

  }
  

  override next(){
    this.stepper.next();
  }

  override previous(){
    this.stepper.previous();
  }

  override reset(){
    this.stepper.reset();
  }

//   override ngAfterContentInit() {
//     timer(0).subscribe(() => {
//     this.dynamicSteps = this.contentItems;
// });}
  
}

