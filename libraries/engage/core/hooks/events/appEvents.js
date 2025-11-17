import { useEffect, useRef } from 'react';
import {
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
  APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND,
} from '@shopgate/engage/core/constants';
import { event } from '@shopgate/engage/core/classes';

/**
 * Returns a stable reference to the given callback, preserving the same function identity
 * across renders, while still always calling the latest version of the callback.
 *
 * Useful when passing callbacks into event listeners or effects so they don't re-subscribe
 * on every render but still access up-to-date props/state.
 *
 * @param {Function} fn The callback function whose latest version should be retained.
 * @returns {Function} A stable function reference that always invokes the latest callback.
 */
function useStableCallback(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  const stable = useRef((...args) => ref.current?.(...args));
  return stable.current;
}
/**
 * Registers a callback for a given event from the Shopgate app event bus.
 *
 * Automatically unsubscribes on unmount. Can optionally run only once.
 *
 * @param {string} name The event name to subscribe to.
 * @param {Function} callback The function to call when the event fires.
 * @param {Object} [options] Additional options.
 * @param {boolean} [options.enabled=true] When false, no listener is registered.
 * @param {boolean} [options.once=false] When true, the callback is removed after first call.
 */
export function useAppEvent(name, callback, options = {}) {
  const { enabled = true, once = false } = options;
  const latest = useStableCallback(callback);

  useEffect(() => {
    if (!enabled) return undefined;
    // eslint-disable-next-line require-jsdoc
    const handler = () => {
      latest();
      if (once) event.removeCallback(name, handler);
    };
    event.addCallback(name, handler);
    return () => event.removeCallback(name, handler);
  }, [name, enabled, once, latest]);
}

/**
 * Registers a callback that fires when the app will enter foreground
 * (`applicationWillEnterForeground`).
 *
 * Automatically unsubscribes on unmount. Accepts same options as `useAppEvent`.
 *
 * @param {Function} callback The callback to run when entering foreground.
 * @param {Object} [options] Additional options.
 * @param {boolean} [options.enabled=true] When false, the listener is not registered.
 * @param {boolean} [options.once=false] Remove after first call.
 */
export function useAppEventOnEnterForeground(callback, options) {
  useAppEvent(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND, callback, options);
}

/**
 * Registers a callback that fires when the app did enter background
 * (`applicationDidEnterBackground`).
 ** Automatically unsubscribes on unmount. Accepts same options as `useAppEvent`.
 *
 * @param {Function} callback The callback to run when entering background.
 * @param {Object} [options] Additional options.
 * @param {boolean} [options.enabled=true] When false, the listener is not registered.
 * @param {boolean} [options.once=false] Remove after first call.
 */
export function useAppEventOnDidEnterBackground(callback, options) {
  useAppEvent(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND, callback, options);
}

/**
 * Invokes a callback only after the app was first sent to background and then
 * returns to the foreground — i.e. a complete background → foreground cycle.
 *
 * Common use case: user leaves the app to open system settings and returns, so you
 * can re-check permissions or refresh data.
 *
 * Internally, this subscribes to both background and foreground events:
 * - Arms itself when entering background
 * - Fires on next foreground if armed
 *
 * @param {Function} callback The callback to run after returning from background.
 * @param {Object} [options] Additional options.
 * @param {boolean} [options.enabled=true] When false, no listener behavior is active.
 * @param {boolean} [options.once=false] When true, callback fires only for the first cycle.
 * @param {boolean} [options.resetAfterFire=true]
 *        If true, requires a new background event to re-arm before firing again.
 *        If false, remains armed until disabled or unmounted.
 */
export function useAppEventOnReturnFromBackground(callback, options = {}) {
  const { enabled = true, once = false, resetAfterFire = true } = options;
  const armedRef = useRef(false);
  const firedOnceRef = useRef(false);
  const latest = useStableCallback(callback);

  useAppEventOnDidEnterBackground(() => {
    if (!enabled) return;
    if (once && firedOnceRef.current) return;
    armedRef.current = true;
  }, { enabled });

  useAppEventOnEnterForeground(() => {
    if (!enabled) return;
    if (once && firedOnceRef.current) return;
    if (armedRef.current) {
      latest();
      if (once) firedOnceRef.current = true;
      if (resetAfterFire) armedRef.current = false;
    }
  }, { enabled });
}
