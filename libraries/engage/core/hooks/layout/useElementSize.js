import { useState, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

/**
 * @typedef {Object} ElementSize
 * @property {number} height - The element's height in pixels.
 * @property {number} [width] - The element's width in pixels (optional).
 */

/**
 * @typedef {Object} UseElementSizeOptions
 * @property {number} [throttleMs=100] - Throttle delay in milliseconds.
 * @property {boolean} [includeWidth=false] - Whether to measure the element's width.
 */

/**
 * Tracks the height (and optionally width) of a DOM element using ResizeObserver,
 * with a fallback to window resize and MutationObserver in older browsers.
 *
 * @param {React.RefObject<HTMLElement>} ref - A ref to the element being measured.
 * @param {UseElementSizeOptions} [options={}] - Optional settings.
 * @returns {ElementSize} The current height (and optionally width) of the element.
 */
export default function useElementSize(ref, options = {}) {
  const { throttleMs = 100, includeWidth = false } = options;

  /**
   * Holds the current element size in state.
   */
  const [size, setSize] = useState({
    height: 0,
    ...(includeWidth && { width: 0 }),
  });

  /**
   * Tracks the most recent measured size to prevent unnecessary state updates.
   */
  const sizeRef = useRef(size);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    /**
     * Measures the current size of the element and updates state if it changed.
     */
    const updateSize = () => {
      const newHeight = element.offsetHeight;
      const newWidth = includeWidth ? element.offsetWidth : undefined;

      const hasChanged =
        newHeight !== sizeRef.current.height ||
        (includeWidth && newWidth !== sizeRef.current.width);

      if (hasChanged) {
        const newSize = {
          height: newHeight,
          ...(includeWidth ? { width: newWidth } : {}),
        };

        sizeRef.current = newSize;
        setSize(newSize);
      }
    };

    /**
     * Throttles the update function to limit how often measurements occur.
     */
    const throttledUpdate = throttle(updateSize, throttleMs);

    /**
     * Sets up ResizeObserver or fallback observers to trigger measurement.
     */
    let cleanup = () => {};

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(throttledUpdate);
      resizeObserver.observe(element);
      updateSize();

      cleanup = () => {
        resizeObserver.disconnect();
        throttledUpdate.cancel();
      };
    } else {
      window.addEventListener('resize', throttledUpdate);

      const mutationObserver = new MutationObserver(throttledUpdate);
      mutationObserver.observe(element, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      updateSize();

      cleanup = () => {
        window.removeEventListener('resize', throttledUpdate);
        mutationObserver.disconnect();
        throttledUpdate.cancel();
      };
    }

    return cleanup;
  }, [ref, throttleMs, includeWidth]);

  return size;
}
