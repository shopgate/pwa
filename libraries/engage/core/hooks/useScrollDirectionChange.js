import { useEffect, useRef, useCallback } from 'react';
import { viewScroll$ } from '@shopgate/engage/core/streams';

/**
 * @typedef {Object} ViewScrollEvent
 * @property {Event} event The original scroll event object
 * @property {number} scrollTop Current vertical scroll position
 * @property {number} previousScrollTop Previous scrollTop value
 * @property {boolean} scrolled True if scrollTop changed from previous
 * @property {boolean} scrollDown True if scrolling down
 * @property {boolean} scrollUp True if scrolling up
 */

/**
 * @callback ScrollCallback
 * @param {ViewScrollEvent} event
 * @returns {void}
 */

/**
 * A scroll hook that detects scroll direction changes (up/down) and
 * triggers the appropriate callbacks. It is commonly used to show or
 * hide UI elements like toolbars or tab bars based on scroll behavior.
 *
 * KEY BEHAVIOR:
 * - Fires `onScrollDown` when scroll direction changes to "down"
 *   AND scrollTop is equal to or greater than `offset`
 * - Fires `onScrollUp` when direction changes to "up"
 * - Optionally fires only on direction change (default), or on every scroll
 *
 * @param {Object} params The hook parameters
 * @param {boolean} params.enabled Whether the hook is active and should listen to scroll
 * @param {number} [params.offset=100] Minimum scrollTop required to trigger onScrollDown
 * @param {boolean} [params.onlyFireOnDirectionChange=true]
 *   If true, callbacks only fire once per direction change
 * @param {ScrollCallback} [params.onScrollUp] Called when scrolling up (direction = "up")
 * @param {ScrollCallback} [params.onScrollDown] Called when scrolling down past offset
 */
function useScrollDirectionChange({
  enabled,
  offset = 100,
  onlyFireOnDirectionChange = true,
  onScrollUp,
  onScrollDown,
}) {
  // Track the last known scroll direction ('up' or 'down')
  const lastDirectionRef = useRef(null);

  // Track whether onScrollDown has already fired in the current downward scroll session
  const downTriggeredRef = useRef(false);

  // Track whether onScrollUp has already fired in the current upward scroll session
  const upTriggeredRef = useRef(false);

  /**
   * Scroll event handler.
   * Determines direction and triggers the appropriate callback
   * based on direction change and offset.
   */
  const handleScroll = useCallback(/** @param {ViewScrollEvent} event Event object */(event) => {
    if (!enabled || !event.scrolled) return;

    const { scrollDown, scrollUp, scrollTop } = event;

    // Determine scroll direction from event flags
    let currentDirection = null;
    if (scrollDown) currentDirection = 'down';
    else if (scrollUp) currentDirection = 'up';

    if (!currentDirection) return;

    const previousDirection = lastDirectionRef.current;
    const directionChanged = currentDirection !== previousDirection;

    // Update last direction ref
    if (directionChanged) {
      lastDirectionRef.current = currentDirection;

      // Reset "already fired" flags when direction changes
      if (currentDirection === 'down') downTriggeredRef.current = false;
      if (currentDirection === 'up') upTriggeredRef.current = false;
    }

    // 🔽 Scroll down logic
    if (currentDirection === 'down') {
      // Fire if:
      // - direction just changed
      // - or repeat firing is allowed
      // - and we're past the offset
      const shouldFire =
        (!onlyFireOnDirectionChange || directionChanged || !downTriggeredRef.current) &&
        scrollTop >= offset;

      if (shouldFire && typeof onScrollDown === 'function') {
        downTriggeredRef.current = true;
        // We need to remove some deprecated / internal properties from the event
        const {
          scrollIn, scrollOut, scrolled, ...publicEventProps
        } = event;
        onScrollDown(publicEventProps);
      }
    }

    // 🔼 Scroll up logic
    if (currentDirection === 'up') {
      // Fire if:
      // - direction just changed
      // - or repeat firing is allowed
      const shouldFire =
        !onlyFireOnDirectionChange || directionChanged || !upTriggeredRef.current;

      if (shouldFire && typeof onScrollUp === 'function') {
        upTriggeredRef.current = true;
        // We need to remove some deprecated / internal properties from the event
        const {
          scrollIn, scrollOut, scrolled, ...publicEventProps
        } = event;
        onScrollUp(publicEventProps);
      }
    }
  }, [enabled, offset, onlyFireOnDirectionChange, onScrollUp, onScrollDown]);

  /**
   * Subscribe to the global scroll stream and handle clean-up on unmount or disable.
   */
  useEffect(() => {
    if (!enabled) return undefined;

    const subscription = viewScroll$.subscribe(handleScroll);
    return () => subscription.unsubscribe();
  }, [enabled, handleScroll]);
}

export default useScrollDirectionChange;
