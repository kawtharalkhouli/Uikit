import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[button-directive]'
})
export class ButtonsDirective {

  constructor(public template: TemplateRef<any>) { }

}
