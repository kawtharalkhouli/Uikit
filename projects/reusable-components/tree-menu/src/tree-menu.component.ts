import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges,Output,ViewEncapsulation } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface data {
    name: string;
    icon?: string;
    color?:string;
    children?: data[];
  }
  
@Component({
  selector: 'realsoft-tree-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tree-menu.component.html',
  encapsulation:ViewEncapsulation.None,
})
export class RealsoftTreeMenuComponent implements OnChanges {
@Input() data!:data[]
@Input() type!:string;
@Input() actionIcons!:boolean;

treeControl = new NestedTreeControl<any>(node => node.children);
dataSource =new MatTreeNestedDataSource<data>();
hasChild = (_: number, node: any) =>
!!node.children && node.children.length > 0;

@Output() zoom: EventEmitter<any> =new EventEmitter<any>();
@Output() add: EventEmitter<any> =new EventEmitter<any>();
@Output() edit: EventEmitter<any> =new EventEmitter<any>();

zoomIn(e:any){this.zoom.emit(e)}
addEvent(e:any){this.add.emit(e)}
editEvent(e:any){this.edit.emit(e)}

constructor(private cdr: ChangeDetectorRef) {}
ngOnChanges(){
  this.dataSource.data = this.data;
  this.cdr.markForCheck();}
}