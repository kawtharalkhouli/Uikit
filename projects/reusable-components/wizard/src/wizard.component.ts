import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, TemplateRef, ViewEncapsulation } from '@angular/core';

interface stepsDetails{
  label:string;//Plain text label of the step.
  labelAr?:string;
  editable?:boolean;//Whether the user can return to this step once it has been marked as completed
  stepControl?: any;//The top level abstract control of the step
  back?:boolean;//Whether there shoud be a back button for this step
  next?:boolean;//Whether there should be a next button for this step 
  backButton?:string;
  nextButton?:string;
  submitButton?:string;
  submit?:boolean;
}
@Component({
  selector: 'realsoft-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wizard.component.html',
  encapsulation:ViewEncapsulation.None,
})
export class RealsoftWizardComponent implements OnChanges{
//Inputs
@Input() linear!:boolean;//Whether the validity of previous steps should be checked or not
@Input() orientation:any='horizontal';//The orientation of the stepper could be Horizontal or Vertical
@Input() selectedIndex:any=0;//The index of the selected step
@Input() stepsHeaders!:stepsDetails[];//Details of each step
@Input() stepsContents!: TemplateRef<any>[] ;//Contents of each step
@Input() labelPosition:any='bottom';//Whether the label should display in bottom or end position. Only applies in the horizontal orientation.
@Input() lang:string='en';
//Outputs
@Output() selectionChange:EventEmitter<any>=new EventEmitter<any>();//An event emitted when the selected step has been changed
@Output() next: EventEmitter<any>= new EventEmitter<any>();
@Output() back: EventEmitter<any>= new EventEmitter<any>();
@Output() submit: EventEmitter<any>=new EventEmitter<any>();

change(e:any){
this.selectedIndex = e.selectedIndex
this.selectionChange.emit(e)
}
nextClicked(e:any){this.next.emit(e);}
backClicked(e:any){this.back.emit(e);}
submitClicked(e:any){this.submit.emit(e)}

constructor(private cdr: ChangeDetectorRef) {}
ngOnChanges(){
 this.cdr.markForCheck();
}
}

