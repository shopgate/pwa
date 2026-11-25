import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { async as asyncScheduler } from 'rxjs/scheduler/async';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/auditTime';
import 'rxjs/add/operator/map';

export const eventsSubject = new Subject();

const scrollSubscriptions = new WeakMap();

/**
 * Cold observable for View scroll events
 * Use this to listen for scroll-related changes in any part of the app.
 * @type {Observable}
 */
export const viewScroll$ = Observable.from(eventsSubject);

/**
 * Stops the scroll events emitScrollEvents set up for an element, so the element can be released.
 * @param {HTMLElement|Window} element - DOM node or window to stop observing
 */
export const stopScrollEvents = (element) => {
  const subscription = element && scrollSubscriptions.get(element);

  if (subscription) {
    subscription.unsubscribe();
    scrollSubscriptions.delete(element);
  }
};

/**
 * Pipes the scroll events of an element or the window into viewScroll$, enriched with scroll
 * info such as direction and distance. Emits the last position at the end of each time window.
 * Calling it again for an element replaces its stream; stopScrollEvents ends it.
 *
 * @param {HTMLElement|Window} element - DOM node or window to observe
 * @param {number} throttleTime - Length of the time window in ms
 * @returns {Observable} - Observable emitting scroll-related data
 */
export const emitScrollEvents = (element, throttleTime = 250) => {
  // In rare situation during unmounting a react dom ref might
  // be null due to the execution order of events in fiber nodes.
  if (!element) {
    return undefined;
  }

  // Determine if element is the window/document or a scrollable container
  const isWindow =
    element === window ||
    element === document.body ||
    element === document.documentElement;

  /**
   * Reads the current scroll position of the element.
   * @returns {number}
   */
  const getScrollTop = () => (isWindow
    ? window.scrollY || window.pageYOffset || 0
    : element.scrollTop);

  let previousScrollTop = getScrollTop();
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
    .auditTime(throttleTime, asyncScheduler)
    .map((event) => {
      // Get current scroll position
      const rawScrollTop = getScrollTop();

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

      // Detect downward scroll beyond threshold that didn't start near bottom
      const startedNearBottom = previousScrollTop >= maxScrollTop - bottomThreshold;
      const scrollDown = isScrollingDown &&
        delta > minDelta &&
        !startedNearBottom;

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
  stopScrollEvents(element);
  scrollSubscriptions.set(element, scroll$.subscribe(viewScroll$));

  return scroll$;
};
