import { useEffect, useRef } from 'react';
import {
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
  APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND,
} from '@shopgate/engage/core/constants';
import { event } from '@shopgate/engage/core/classes';

/**
 * Additional options for app event hooks.
 */
export interface AppEventOptions {
  /**
   * When false, no listener is registered.
   * @default true
   */
  enabled?: boolean;
  /**
   * When true, the callback is removed after first call.
   * @default false
   */
  once?: boolean;
}

/**
 * Extended options for return-from-background hook.
 */
export interface ReturnFromBackgroundOptions extends AppEventOptions {
  /**
   * If true, requires a new background event to re-arm before firing again.
   * If false, remains armed until disabled or unmounted.
   * @default true
   */
  resetAfterFire?: boolean;
}

/**
 * Returns a stable reference to the given callback, preserving the same function identity
 * across renders, while still always calling the latest version of the callback.
 *
 * Useful when passing callbacks into event listeners or effects so they don't re-subscribe
 * on every render but still access up-to-date props/state.
 * @param fn The callback function whose latest version should be retained.
 * @returns A stable function reference that always invokes the latest callback.
 */
function useStableCallback<TArgs extends unknown[]>(fn: (...args: TArgs) => void) {
  const ref = useRef(fn);
  ref.current = fn;
  const stable = useRef((...args: TArgs) => ref.current?.(...args));
  return stable.current;
}

/**
 * Registers a callback for a given event from the Shopgate app event bus.
 *
 * Automatically unsubscribes on unmount. Can optionally run only once.
 * @param name The event name to subscribe to.
 * @param callback The function to call when the event fires.
 * @param options Additional options.
 */
export function useAppEvent(name: string, callback: () => void, options: AppEventOptions = {}) {
  const { enabled = true, once = false } = options;
  const latest = useStableCallback(callback);

  useEffect(() => {
    if (!enabled) return undefined;

    /**
     * Invokes the callback, and unsubscribes again when the event was only wanted once.
     */
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
 * @param callback The callback to run when entering foreground.
 * @param options Additional options.
 */
export function useAppEventOnEnterForeground(callback: () => void, options?: AppEventOptions) {
  useAppEvent(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND, callback, options);
}

/**
 * Registers a callback that fires when the app did enter background
 * (`applicationDidEnterBackground`).
 *
 * Automatically unsubscribes on unmount. Accepts same options as `useAppEvent`.
 * @param callback The callback to run when entering background.
 * @param options Additional options.
 */
export function useAppEventOnDidEnterBackground(callback: () => void, options?: AppEventOptions) {
  useAppEvent(APP_EVENT_APPLICATION_DID_ENTER_BACKGROUND, callback, options);
}

/**
 * Invokes a callback only after the app was first sent to background and then
 * returns to the foreground - i.e. a complete background to foreground cycle.
 *
 * Common use case: user leaves the app to open system settings and returns, so you
 * can re-check permissions or refresh data.
 *
 * Internally, this subscribes to both background and foreground events:
 * - Arms itself when entering background
 * - Fires on next foreground if armed
 * @param callback The callback to run after returning from background.
 * @param options Additional options.
 */
export function useAppEventOnReturnFromBackground(
  callback: () => void,
  options: ReturnFromBackgroundOptions = {}
) {
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
