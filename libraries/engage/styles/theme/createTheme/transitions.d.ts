export interface Easing {
  /**
   * This is the most common easing curve.
   */
  easeInOut: string;
  /**
   * Objects enter the screen at full velocity from off-screen and slowly decelerate to a resting
   * point.
   */
  easeOut: string;
  /**
   * Objects leave the screen at full velocity. They do not decelerate when off-screen.
   */
  easeIn: string;
  /**
   * The sharp curve is used by objects that may return to the screen at any time.
   */
  sharp: string;
}
export const easing: Easing;

export interface Duration {
  shortest: number;
  shorter: number;
  short: number;
  /**
   * Most basic recommended timing
   */
  standard: number;
  /**
   * This is to be used in complex animations
   */
  complex: number;
  /**
   * Recommended when something is entering screen
   */
  enteringScreen: number;
  /**
   * Recommended when something is leaving screen
   */
  leavingScreen: number;
}

export const duration: Duration;

export function formatMs(milliseconds: number): string;

export interface Transitions {
  /**
   * Easing functions for transitions.
   */
  easing: Easing;
  /**
   * Presets for transition durations.
   */
  duration: Duration;
  /**
   * Creates a CSS transition string based on the provided properties and options.
   */
  create(
    /**
     * The CSS properties to apply the transition to.
     * Can be a single property or an array of properties.
     */
    props: string | string[],
    options?: Partial<{
      /**
       * Duration of the transition as a number in milliseconds or a string with a
       * CSS time unit (e.g., '500ms', '0.5s').
       */
      duration: number | string;
      /**
       * Easing function to use for the transition.
       */
      easing: string;
      /**
       * Delay before the transition starts, as a number in milliseconds or a string with a
       * CSS time unit (e.g., '500ms', '0.5s').
       */
      delay: number | string
    }>
  ): string;
  /**
   * Calculates an appropriate animation duration (in milliseconds) for a height-based
   * transition effect. The duration increases with height but in a sub-linear fashion,
   * providing a smooth and visually pleasing animation speed for expanding/collapsing UI elements.
   *
   * @param {number} height - The height (in pixels) of the element being animated.
   * @returns {number} The calculated duration in milliseconds. Returns 0 if height is 0 or falsy.
   *
   * @example
   * getAutoHeightDuration(72); // returns ~222
   */
  getAutoHeightDuration(height: number): number;
}

// export type TransitionsOptions = DeepPartial<Transitions>;

declare const transitions: Transitions;
export default transitions;
