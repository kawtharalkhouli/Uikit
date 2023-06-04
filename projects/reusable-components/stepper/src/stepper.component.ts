import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef,ViewEncapsulation } from '@angular/core';


interface stepsDetails{
  label:string;//Plain text label of the step.
  editable?:boolean;//Whether the user can return to this step once it has been marked as completed
  completed?:boolean;//Whether the step has been marked as completed
  optional?:boolean;//Whether the completion of step is optional
  stepControl?: any;//The top level abstract control of the step
  errorMessage?: string;//Error message to display when there's an error
  hasError?: boolean;//Whether step has an error.
  back?:boolean;//Whether there shoud be a back button for this step
  next?:boolean;//Whether there should be a next button for this step 
  reset?:boolean;//Whether there should be a reset button
}

@Component({
  selector: 'realsoft-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.component.html',
  encapsulation:ViewEncapsulation.None,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class StepperComponent {
  //Inputs
  @Input() linear!:boolean;//Whether the validity of previous steps should be checked or not
  @Input() orientation:any='horizontal';//The orientation of the stepper could be Horizontal or Vertical
  @Input() selectedIndex:any=0;//The index of the selected step
  @Input() stepsHeaders!:stepsDetails[];//Details of each step
  @Input() stepsContents!: TemplateRef<any>[] ;//Contents of each step
  @Input() labelPosition:any='end';//Whether the label should display in bottom or end position. Only applies in the horizontal orientation.

  //Outputs
  @Output() selectionChange:EventEmitter<any>=new EventEmitter<any>();//An event emitted when the selected step has been changed
  @Output() next: EventEmitter<any>= new EventEmitter<any>();
  @Output() back: EventEmitter<any>= new EventEmitter<any>();
  @Output() reset: EventEmitter<any>= new EventEmitter<any>();

  change(e:any){
  this.selectedIndex = e.selectedIndex
  this.selectionChange.emit(e)
  }
  nextClicked(e:any){this.next.emit(e);}
  backClicked(e:any){this.back.emit(e);}
  resetClicked(e:any){this.reset.emit(e)}

  constructor(private cdr: ChangeDetectorRef) {}
}
