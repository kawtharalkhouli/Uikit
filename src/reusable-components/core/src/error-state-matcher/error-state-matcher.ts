


import { Injectable } from "@angular/core";
import { AbstractControl, FormGroupDirective, NgControl, NgForm } from "@angular/forms";
import { Subject } from 'rxjs';

export interface RealsoftErrorState extends ErrorStateMatcher {}


//This code defines an Angular service called ErrorState which is used to determine whether a form control should be displayed in an error state. It's designed to work with Angular's form validation system, particularly is scenarios where you want to customize error display logic.
@Injectable({providedIn: 'root'})
export class ErrorStateMatcher {

  //The method determines if a form control should be marked as having an error, it takes two parameters: control is the form control being checked, and the parent form which is optional
  //The method returns a boolan where if true => This means that the control is an an error state, and if false the control is valid
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //contol && control.invalid => Ensures the control exists and has validation errors where invalid is true
    //(control.touched || (form && form.submitted)) => Ensures the user has interacted with the control or the form has been submitted
    //The !! ensures the result is a boolean value
    return !!(control && control.invalid && (control.touched || (form && form.submitted)));
  }
}

export class ErrorState {
    errorState = false;
    matcher: ErrorStateMatcher;

    constructor(
        private _defaultMatcher: ErrorStateMatcher | null,
        public ngControl: NgControl | null,
        private _parentFormGroup: FormGroupDirective | null,
        private _parentForm: NgForm | null,
        private _stateChanges: Subject<void>,
    ) {}

    updateErrorState() {
        const oldState = this.errorState;
        const parent = this._parentFormGroup || this._parentForm;
        const matcher = this._defaultMatcher || this.matcher;
        const control = this.ngControl?.control as AbstractControl ?? null;
        const newState = matcher?.isErrorState(control, parent) ?? false;

        if(newState !== oldState) {
            this.errorState = newState;
            this._stateChanges.next();
        }
    }

}

