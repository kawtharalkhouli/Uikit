import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'custom-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar.component.html',
  encapsulation:ViewEncapsulation.None

})
export class CustomProgressBarComponent implements OnChanges {
  //inputs
  @Input() type ! :string;
  @Input() value !:any;
  @Input() errorMsg:string='An error has occurred';
  @Input() mode : 'determinate' | 'indeterminate' | 'buffer' | 'query' ='determinate';
  //event emitters
  @Output() onClose = new EventEmitter<any>();
  @Output() onRefresh = new EventEmitter<any>();
  closed: boolean = false;
  
constructor(private cdr: ChangeDetectorRef) {
}
ngOnChanges() { 
this.cdr.markForCheck();
}

  close(e:any){
   this.closed = !this.closed;
   this.onClose.emit(e);
  }
  refresh(e:any){
    window.location.reload();
    this.onRefresh.emit(e)
  }
}
