import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appButtons]'
})
export class ButtonsDirective {

  constructor(public template: TemplateRef<any>) { }
  
}
