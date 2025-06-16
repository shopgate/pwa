import { RefObject } from 'react';

/**
 * Represents the dimensions of a DOM element.
 */
export interface ElementSize {
  /**
   * The element's height in pixels.
   */
  height: number;

  /**
   * The element's width in pixels (optional).
   */
  width?: number;
}

/**
 * Options for configuring the useElementSize hook.
 */
export interface UseElementSizeOptions {
  /**
   * Throttle delay in milliseconds.
   * @default 100
   */
  throttleMs?: number;

  /**
   * Whether to measure the element's width.
   * @default false
   */
  includeWidth?: boolean;
}

/**
 * Tracks the height (and optionally width) of a DOM element using ResizeObserver.
 * Falls back to window resize and MutationObserver in older browsers.
 *
 * @param ref A ref to the element being measured.
 * @param options Optional settings.
 * @returns The current height (and optionally width) of the element.
 */
export default function useElementSize(
  ref: RefObject<HTMLElement>,
  options?: UseElementSizeOptions
): ElementSize;
