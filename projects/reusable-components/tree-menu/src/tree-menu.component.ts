import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges,ViewEncapsulation } from '@angular/core';
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
 
treeControl = new NestedTreeControl<data>(node => node.children);
dataSource = new MatTreeNestedDataSource<data>();
hasChild = (_: number, node: data) => !!node.children && node.children.length > 0;
    

constructor(private cdr: ChangeDetectorRef) {}
ngOnChanges(){
  this.dataSource.data = this.data;
  this.cdr.markForCheck();}
}