import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'realsoft-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wizard.component.html',
  encapsulation:ViewEncapsulation.None,
})
export class RealsoftWizardComponent implements OnChanges{
  

constructor(private cdr: ChangeDetectorRef) {}
ngOnChanges(){
 this.cdr.markForCheck();
}
}

