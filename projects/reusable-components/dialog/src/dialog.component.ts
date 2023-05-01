import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, TemplateRef} from '@angular/core';


@Component({
  selector: 'realsoft-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./dialog.component.html' 
})
export class RealsoftDialogComponent implements OnChanges{
    //Inputs
    @Input() dialogTitle!:string;
    @Input() dialogContent!:TemplateRef<any>;
    @Input() firstBtnTxt:string='Cancel';
    @Input() secondBtnTxt:string='Save';

    //Outputs
    @Output() cancel:EventEmitter<any> = new EventEmitter();
    @Output() save:EventEmitter<any> = new EventEmitter();
    @Output() close:EventEmitter<any> = new EventEmitter();

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnChanges(){this.cdr.markForCheck();}

    cancelClicked(e:any){this.cancel.emit(e)}
    actionClicked(e:any){this.save.emit(e)}
    closeDialog(e:any){this.close.emit(e)}
}
