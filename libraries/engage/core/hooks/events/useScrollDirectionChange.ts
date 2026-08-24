import { useEffect, useRef, useCallback } from 'react';
import { viewScroll$ } from '@shopgate/engage/core/streams';

/**
 * A scroll event as the view scroll stream emits it.
 */
export interface ViewScrollEvent {
  /**
   * The original scroll event object.
   */
  event: UIEvent;

  /**
   * Current vertical scroll position.
   */
  scrollTop: number;

  /**
   * Previous scrollTop value.
   */
  previousScrollTop: number;

  /**
   * True if scrolling down.
   */
  scrollDown: boolean;

  /**
   * True if scrolling up.
   */
  scrollUp: boolean;

  /**
   * Scroll direction: 'up', 'down', or null.
   */
  direction: 'up' | 'down' | null;

  /**
   * Optional internal/legacy props (not passed to callbacks).
   */
  [key: string]: unknown;
}

/**
 * A callback that receives a scroll event.
 */
export type ScrollCallback = (event: ViewScrollEvent) => void;

/**
 * Parameters for the scroll direction change hook.
 */
export interface UseScrollDirectionChangeParams {
  /**
   * Whether the hook is active.
   */
  enabled: boolean;

  /**
   * ScrollTop threshold for down scroll triggers. When set,
   * `onScrollDown` fires only when the scroll position is greater than this.
   * @default 100
   */
  offset?: number;

  /**
   * If true, callbacks fire only once per direction change.
   * @default true
   */
  onlyFireOnDirectionChange?: boolean;

  /**
   * If true, onScrollUp fires only when scrollTop is below or equal to
   * `onlyFireOnScrollUpAtTopOffset`.
   * @default false
   */
  onlyFireOnScrollUpAtTop?: boolean;

  /**
   * Maximum scrollTop at which `onScrollUp` may fire when
   * `onlyFireOnScrollUpAtTop` is true.
   * @default 0
   */
  onlyFireOnScrollUpAtTopOffset?: number;

  /**
   * Callback triggered on scroll up.
   */
  onScrollUp?: ScrollCallback;

  /**
   * Callback triggered on scroll down past offset.
   */
  onScrollDown?: ScrollCallback;
}

// Strips the internal properties the stream adds before an event reaches a callback.
const toPublicEvent = ({
  scrollIn: _scrollIn, scrollOut: _scrollOut, scrolled: _scrolled, ...publicEvent
}: ViewScrollEvent) => publicEvent as ViewScrollEvent;

/**
 * A scroll hook that detects scroll direction changes (up/down) and
 * triggers the appropriate callbacks. Commonly used to show/hide
 * UI elements based on scroll behavior.
 * @param params The hook parameters.
 */
export default function useScrollDirectionChange(params: UseScrollDirectionChangeParams) {
  const {
    enabled,
    offset = 100,
    onlyFireOnDirectionChange = true,
    onlyFireOnScrollUpAtTop = false,
    onlyFireOnScrollUpAtTopOffset = 0,
    onScrollUp,
    onScrollDown,
  } = params;

  const lastDirectionRef = useRef<ViewScrollEvent['direction']>(null);
  const downTriggeredRef = useRef(false);
  const upTriggeredRef = useRef(false);

  const handleScroll = useCallback(
    (event: ViewScrollEvent) => {
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

      // Handle downward scroll
      if (direction === 'down') {
        const shouldFire =
          (!onlyFireOnDirectionChange || directionChanged || !downTriggeredRef.current) &&
          scrollTop >= offset;

        if (shouldFire && typeof onScrollDown === 'function') {
          downTriggeredRef.current = true;
          onScrollDown(toPublicEvent(event));
        }
      }

      // Handle upward scroll
      if (direction === 'up') {
        // if user wants "only fire at the very top" and we are not at 0, skip
        if (onlyFireOnScrollUpAtTop && scrollTop > onlyFireOnScrollUpAtTopOffset) {
          return;
        }

        const shouldFire =
          !onlyFireOnDirectionChange || directionChanged || !upTriggeredRef.current;

        if (shouldFire && typeof onScrollUp === 'function') {
          upTriggeredRef.current = true;
          onScrollUp(toPublicEvent(event));
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
