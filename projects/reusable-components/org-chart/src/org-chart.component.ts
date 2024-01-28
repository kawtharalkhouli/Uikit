import { Component, Input} from '@angular/core';
interface orgChart{
    id:number;
    title:string;
    titleAr?:string;
    children?: orgChart[];
}

@Component({
  selector: 'realsoft-org-chart',
  templateUrl: './org-chart.component.html',
})

export class OrgChartComponent{
@Input() data!:orgChart;
@Input() orientation:string='ttb';
@Input() collapseTooltip:string='Collapse';
@Input() expandTooltip:string='Expand';
@Input() lang : string = 'en'; 

hideAll: boolean = false;
hide= {};
}
