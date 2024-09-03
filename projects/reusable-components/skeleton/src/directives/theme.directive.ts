import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[theme]'
})
export class ThemeDirective {

  @Input()
  theme: any = {};

  @HostBinding('style')
  get style(): string {
    return this.theme;
  }

  constructor() { }

}
