import {
    animate,
    state,
    style,
    transition,
    trigger,
    AnimationTriggerMetadata,
  } from '@angular/animations';
  
  export const RealsoftFormFieldAnimations: {
    readonly transitionMessages: AnimationTriggerMetadata;
  } = {
    transitionMessages: trigger('transitionMessages', [
      state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
      transition('void => enter', [
        style({opacity: 0, transform: 'translateY(-5px)'}),
        animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
      ]),
    ]),
  };