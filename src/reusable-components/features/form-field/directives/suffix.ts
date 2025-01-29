import { Directive, InjectionToken, Input } from "@angular/core";

//Injection Token to reference instances of RealsoftSuffix
export const REALSOFT_SUFFIX = new InjectionToken<RealsoftSuffix>('RealsoftSuffix');

@Directive({
    selector: '[realsoftSuffix], [realsoftIconSuffix], [realsoftTextSuffix]',
    providers: [{provide: REALSOFT_SUFFIX, useExisting: RealsoftSuffix}],
    standalone: true
})
export class RealsoftSuffix {
    _isText = false;
  @Input('realsoftTextSuffix')
  set _isTextSelector(value: '') {
    this._isText = true;
  }
}