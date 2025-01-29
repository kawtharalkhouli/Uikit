import {state, style, transition, animate } from "@angular/animations";

 /** This animation transforms the select's overlay panel on and off the page. */
 export let transformPanel = [
    state(
      'void',
      style({
        opacity: 0,
        transform: 'scale(1, 0.8)',
      }),
    ),
    transition(
      'void => showing',
      animate(
        '120ms cubic-bezier(0, 0, 0.2, 1)',
        style({
          opacity: 1,
          transform: 'scale(1, 1)',
        }),
      ),
    ),
    transition('* => void', animate('100ms linear', style({opacity: 0}))),
  ]