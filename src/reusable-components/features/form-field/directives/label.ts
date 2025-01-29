import { Directive } from "@angular/core";


@Directive({
    selector: 'realsoft-label',
    host: {
        'class' : 'realsoft-label'
    },
    standalone: true,
})
export class RealsoftLabel {}