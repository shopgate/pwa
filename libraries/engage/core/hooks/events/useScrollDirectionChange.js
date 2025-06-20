// @ts-check
import { useEffect, useRef, useCallback } from 'react';
import { viewScroll$ } from '@shopgate/engage/core/streams';

/** @typedef {import('./useScrollDirectionChange').ViewScrollEvent} ViewScrollEvent */
/** @typedef {import('./useScrollDirectionChange').ScrollCallback} ScrollCallback */
// eslint-disable-next-line max-len
/** @typedef {import('./useScrollDirectionChange').UseScrollDirectionChangeParams} UseScrollDirectionChangeParams */

/**
 * A scroll hook that detects scroll direction changes (up/down) and
 * triggers the appropriate callbacks. Commonly used to show/hide
 * UI elements based on scroll behavior.
 *
 * @param {UseScrollDirectionChangeParams} params The hook parameters
 */
export default function useScrollDirectionChange({
  enabled,
  offset = 100,
  onlyFireOnDirectionChange = true,
  onlyFireOnScrollUpAtTop = false,
  onlyFireOnScrollUpAtTopOffset = 0,
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
        // @ts-expect-error
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
        // if user wants “only fire at the very top” and we’re not at 0, skip
        if (onlyFireOnScrollUpAtTop && scrollTop > onlyFireOnScrollUpAtTopOffset) {
          return;
        }

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
    [
      enabled,
      onlyFireOnDirectionChange,
      offset,
      onScrollDown,
      onlyFireOnScrollUpAtTop,
      onlyFireOnScrollUpAtTopOffset,
      onScrollUp,
    ]
  );

  useEffect(() => {
    if (!enabled) return undefined;

    const subscription = viewScroll$.subscribe(handleScroll);
    return () => subscription.unsubscribe();
  }, [enabled, handleScroll]);
}

