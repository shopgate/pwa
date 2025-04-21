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
 * Use this to listen for scroll-related changes in any part of the app.
 * @type {Observable}
 */
export const viewScroll$ = Observable.from(eventsSubject);

/**
 * Sets up throttled scroll event stream for a given element or window.
 * Emits enriched scroll info such as direction and distance.
 *
 * @param {HTMLElement|Window} element - DOM node or window to observe
 * @param {number} throttleTime - Time in ms to throttle scroll events
 * @returns {Observable} - Observable emitting scroll-related data
 */
export const emitScrollEvents = (element, throttleTime = 250) => {
  // In rare situation during unmounting a react dom ref might
  // be null due to the execution order of events in fiber nodes.
  if (!element) {
    return undefined;
  }

  let previousScrollTop = 0;
  // Tracks scroll direction ('up' or 'down')
  let lastDirection = null;
  // Minimum distance to consider a real scroll
  const minDelta = 10;
  // Pixels from bottom to consider "at bottom"
  const bottomThreshold = 20;
  // Prevent scrollUp triggering in this zone
  const deadZoneThreshold = 30;

  const scroll$ = Observable
    .fromEvent(element, 'scroll')
    .throttleTime(throttleTime, asyncScheduler, {
      leading: false,
      trailing: true,
    })
    .map((event) => {
      // Determine if element is the window/document or a scrollable container
      const isWindow =
        element === window ||
        element === document.body ||
        element === document.documentElement;

      // Get current scroll position
      const rawScrollTop = isWindow
        ? window.scrollY || window.pageYOffset || 0
        : element.scrollTop;

      // Compute max scroll value
      const maxScrollTop = isWindow
        ? Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) - window.innerHeight
        : element.scrollHeight - element.clientHeight;

      // Clamp scrollTop to prevent overshoot from iOS bounce
      const scrollTop = Math.min(rawScrollTop, maxScrollTop);

      const delta = scrollTop - previousScrollTop;
      const isScrollingDown = delta > 0;
      const isScrollingUp = delta < 0;

      // Determine direction
      let direction = lastDirection;
      if (isScrollingDown) direction = 'down';
      else if (isScrollingUp) direction = 'up';

      // Are we near the bottom of the scrollable area?
      const nearBottom = scrollTop >= maxScrollTop - bottomThreshold;
      const inDeadZone = scrollTop >= maxScrollTop - deadZoneThreshold;

      // Detect downward scroll beyond threshold and not near bottom
      const scrollDown = isScrollingDown &&
        delta > minDelta &&
        !nearBottom;

      // Detect upward scroll beyond threshold
      let scrollUp = isScrollingUp &&
        Math.abs(delta) > minDelta;

      // Suppress scrollUp events in dead zone to avoid iOS bounce
      if (scrollUp && inDeadZone && direction === 'up') {
        scrollUp = false;
      }

      // Detect a bounce-back: scrollDown followed by a quick scrollUp at the bottom
      const bounced = lastDirection === 'down' &&
        direction === 'up' &&
        nearBottom;

      // Final scrolled flag — only emit if meaningful and not a bounce
      const scrolled = (scrollDown || scrollUp) && !bounced;

      // Update direction and scrollTop memory
      lastDirection = direction;

      return {
        event,
        scrollTop,
        previousScrollTop,
        scrolled,
        scrollUp,
        scrollDown: scrollDown && !bounced,
        direction,
        scrollOut: scrollDown && !bounced, // legacy compatibility
        scrollIn: scrollUp, // legacy compatibility
      };
    }).do((event) => {
      // Store current scrollTop for next event comparison
      previousScrollTop = event.scrollTop;
    });

  // Pipe scroll data into the shared stream for global consumers
  scroll$.subscribe(viewScroll$);

  return scroll$;
};
