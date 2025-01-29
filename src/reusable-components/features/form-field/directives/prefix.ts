import { Directive, InjectionToken, Input } from "@angular/core";

//Injection Token to reference instances of RealsoftPrefix
export const REALSOFT_PREFIX = new InjectionToken<RealsoftPrefix>('RealsoftPrefix');

@Directive({
    selector: '[realsoftPrefix], [realsoftIconPrefix], [realsoftTextPrefix]',
    providers: [{provide: REALSOFT_PREFIX, useExisting: RealsoftPrefix}],
    standalone:true
})
export class RealsoftPrefix {
  _isText = false;
  @Input('realsoftTextPrefix')
  set _isTextSelector(value: '') {
    this._isText = true;
  }
}