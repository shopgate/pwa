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
 * Registers a callback for a given event from the Shopgate app event bus.
 *
 * Automatically unsubscribes on unmount. Can optionally run only once.
 *
 * @param name The event name to subscribe to.
 * @param callback The function to call when the event fires.
 * @param options Additional options.
 */
export declare function useAppEvent(
  name: string,
  callback: () => void,
  options?: AppEventOptions
): void;

/**
 * Registers a callback that fires when the app will enter foreground.
 *
 * Automatically unsubscribes on unmount.
 *
 * @param callback The callback to run when entering foreground.
 * @param options Additional options.
 */
export declare function useAppEventOnEnterForeground(
  callback: () => void,
  options?: AppEventOptions
): void;

/**
 * Registers a callback that fires when the app did enter background.
 *
 * Automatically unsubscribes on unmount.
 *
 * @param callback The callback to run when entering background.
 * @param options Additional options.
 */
export declare function useAppEventOnDidEnterBackground(
  callback: () => void,
  options?: AppEventOptions
): void;

/**
 * Invokes a callback only after the app was first sent to background and then
 * returns to the foreground — i.e. a complete background → foreground cycle.
 *
 * Common use case: user leaves the app to open system settings and returns, so you
 * can re-check permissions or refresh data.
 *
 * @param callback The callback to run after returning from background.
 * @param options Additional options.
 */
export declare function useAppEventOnReturnFromBackground(
  callback: () => void,
  options?: ReturnFromBackgroundOptions
): void;
