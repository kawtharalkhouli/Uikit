import {ChangeDetectionStrategy,Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation,} from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

@Component({
    selector: 'realsoft-selection-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './selection-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SelectionListComponent {
    //Inputs
    @Input() chosenField!:string;
    @Input() disabled!:boolean;
    @Input() multiple:boolean=true;
    @Input() data!:any;
  
    @ViewChild('list') optionsSelectionList!: MatSelectionList;

    //Outputs
    @Output() selectionChange: EventEmitter<any>=new EventEmitter<any>();
    @Output() selectedOptions: EventEmitter<any>=new EventEmitter<any>();
    @Output() unSelectedOptions: EventEmitter<any>=new EventEmitter<any>();
  
    onSelectionChange(e:any) {
      this.selectionChange.emit(e)
    }
  
    getSelected() {
      let selected= this.optionsSelectionList.selectedOptions.selected.map(s => s.value);
      this.selectedOptions.emit(selected);
      return selected;
    }
  
    getUnselected() {
      const differ = [];
      const selected = this.getSelected();
      for(let i = 0; i < this.data.length; i ++) {
        if (selected.indexOf(this.data[i].id) === -1) {
          differ.push(this.data[i])
        }
      }
      this.unSelectedOptions.emit(differ);
      return differ;
    }
}
  