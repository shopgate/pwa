import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { async as asyncScheduler } from 'rxjs/scheduler/async';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/throttleTime';

export const eventsSubject = new Subject();

/**
 * Cold observable for View scroll events
 * @type {Observable}
 */
export const viewScroll$ = Observable.from(eventsSubject);

/**
 * @param {HTMLElement} element .
 * @param {number} throttleTime .
 * @returns {Observable}
 */
export const emitScrollEvents = (element, throttleTime = 250) => {
  let previousScrollTop = 0;
  const scroll$ = Observable
    .fromEvent(element, 'scroll')
    .throttleTime(throttleTime, asyncScheduler, {
      leading: false,
      trailing: true,
    })
    .map((event) => {
      const scrollTop = element.scrollY || element.scrollTop;
      return {
        event,
        scrollTop,
        previousScrollTop,
        scrolled: previousScrollTop !== scrollTop,
        scrollOut: previousScrollTop < scrollTop,
        scrollIn: previousScrollTop >= scrollTop,
      };
    }).do((event) => {
      // Remember scroll position for next event
      previousScrollTop = event.scrollTop;
    });

  // Copy all events to viewScroll$ stream
  scroll$.subscribe(viewScroll$);

  return scroll$;
};
