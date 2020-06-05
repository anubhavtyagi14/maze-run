import { trigger, transition, query, style, group, animate } from '@angular/animations';

export const slider =
  trigger('routeAnimations', [
    transition('isRight => isLeft', slideTo('left')),
    transition('isLeft => isRight', slideTo('right')),
  ]);

function slideTo(direction) {
  const optional = { optional: true };
  return [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%' })
    ]),
    group([
      query(':leave', [
        animate('0.4s ease-in-out', style({ [direction]: '100%' }))
      ], optional),
      query(':enter', [
        animate('0.4s ease-in-out', style({ [direction]: '0%' }))
      ])
    ])
  ];
}



