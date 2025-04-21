import { useEffect, useRef, useCallback } from 'react';
import { viewScroll$ } from '@shopgate/engage/core/streams';

/**
 * @typedef {Object} ViewScrollEvent
 * @property {Event} event The original scroll event object
 * @property {number} scrollTop Current vertical scroll position
 * @property {number} previousScrollTop Previous scrollTop value
 * @property {boolean} scrollDown True if scrolling down
 * @property {boolean} scrollUp True if scrolling up
 * @property {'up' | 'down' | null} direction Scroll direction
 */

/**
 * @callback ScrollCallback
 * @param {ViewScrollEvent} event
 * @returns {void}
 */

/**
 * A scroll hook that detects scroll direction changes (up/down) and
 * triggers the appropriate callbacks. Commonly used to show/hide
 * UI elements based on scroll behavior.
 *
 * @param {Object} params The hook parameters
 * @param {boolean} params.enabled Whether the hook is active
 * @param {number} [params.offset=100] ScrollTop threshold for down scroll triggers. When set,
 * onScrollDown will first be triggered when the scroll position is greater than this value.
 * @param {boolean} [params.onlyFireOnDirectionChange=true]
 *   If true, callbacks fire only once per direction change
 * @param {ScrollCallback} [params.onScrollUp] Triggered on scroll up
 * @param {ScrollCallback} [params.onScrollDown] Triggered on scroll down past offset
 */
function useScrollDirectionChange({
  enabled,
  offset = 100,
  onlyFireOnDirectionChange = true,
  onScrollUp,
  onScrollDown,
}) {
  const lastDirectionRef = useRef(null);
  const downTriggeredRef = useRef(false);
  const upTriggeredRef = useRef(false);

  /**
   * Scroll event handler.
   * Uses `event.direction` and triggers callbacks accordingly.
   */
  const handleScroll = useCallback(
    /** @param {ViewScrollEvent} event The event */
    (event) => {
      if (!enabled || !event.scrolled || !event.direction) return;

      const { scrollTop, direction } = event;

      const prevDirection = lastDirectionRef.current;
      const directionChanged = direction !== prevDirection;

      // Store current direction and reset flags if direction changed
      if (directionChanged) {
        lastDirectionRef.current = direction;
        if (direction === 'down') downTriggeredRef.current = false;
        if (direction === 'up') upTriggeredRef.current = false;
      }

      // 🔽 Handle downward scroll
      if (direction === 'down') {
        const shouldFire =
          (!onlyFireOnDirectionChange || directionChanged || !downTriggeredRef.current) &&
          scrollTop >= offset;

        if (shouldFire && typeof onScrollDown === 'function') {
          downTriggeredRef.current = true;

          // Strip internal/legacy properties
          const {
            scrollIn, scrollOut, scrolled, ...publicEvent
          } = event;
          onScrollDown(publicEvent);
        }
      }

      // 🔼 Handle upward scroll
      if (direction === 'up') {
        const shouldFire =
          !onlyFireOnDirectionChange || directionChanged || !upTriggeredRef.current;

        if (shouldFire && typeof onScrollUp === 'function') {
          upTriggeredRef.current = true;

          const {
            scrollIn, scrollOut, scrolled, ...publicEvent
          } = event;
          onScrollUp(publicEvent);
        }
      }
    },
    [enabled, offset, onlyFireOnDirectionChange, onScrollUp, onScrollDown]
  );

  useEffect(() => {
    if (!enabled) return undefined;

    const subscription = viewScroll$.subscribe(handleScroll);
    return () => subscription.unsubscribe();
  }, [enabled, handleScroll]);
}

export default useScrollDirectionChange;
