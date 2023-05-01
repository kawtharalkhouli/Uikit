import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';

interface spinnerConfig{
  lowProgressMin?:number;
  lowProgressMax?:number;
  normalProgressMin?:number;
  normalProgressMax?:number;
  highProgressMin?:number;
  highProgressMax?:number;
  fullProgressMin?:number;
  fullProgressMax?:number;
}

@Component({
  selector: 'custom-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./spinner.component.html' ,
  encapsulation: ViewEncapsulation.None
})
export class CustomSpinnerComponent implements OnChanges {
  @Input() configurations: spinnerConfig | undefined
  @Input() value!: number;
  progressType!:string;

  determineProgress(){
    if (this.value >= this.configurations?.lowProgressMin && this.value <= this.configurations?.lowProgressMax){
       this.progressType = 'low'
    }
    else if (this.value > this.configurations?.normalProgressMin && this.value <= this.configurations?.normalProgressMax){
      this.progressType = 'normal'
    }
    else if (this.value > this.configurations?.highProgressMin && this.value <=this.configurations?.highProgressMax){
      this.progressType = 'high'
    }
    else if(this.value > this.configurations?.fullProgressMin && this.value <= this.configurations?.fullProgressMax)
    this.progressType = 'full'
  }


  ngOnChanges(){
    this.determineProgress();
    this.cdr.markForCheck();
  }

  
  constructor(private cdr: ChangeDetectorRef) { }
}
