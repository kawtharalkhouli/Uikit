import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'realsoft-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wizard.component.html',
})
export class RealsoftWizardComponent implements OnChanges{
    @Input() data!:any[]
    @Input() orientation:string='horizontal';
    @Output() click =new EventEmitter<any>();
    constructor(private cdr: ChangeDetectorRef) { }

    clickEvent(e:any){
      this.click.emit(e)
    }

    ngOnChanges(): void {this.cdr.detectChanges();}
}

