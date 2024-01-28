import { Component, Input} from '@angular/core';

@Component({
  selector: 'realsoft-nav-tab',
  templateUrl: './nav-tab.component.html',
})

export class NavTabComponent{
@Input() navLinks!:any[];
@Input() lang: string = 'en';
}
