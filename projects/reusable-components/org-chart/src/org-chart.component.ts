import { Component, Input} from '@angular/core';
interface orgChart{
    id:number;
    title:string;
    children?: orgChart[];
}

@Component({
  selector: 'realsoft-og-chart',
  templateUrl: './org-chart.component.html',
})

export class OrgChartComponent{
@Input() data!:orgChart;
@Input() orientation!:string;
hideAll: boolean = false;
hideme= {};
}
