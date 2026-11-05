import {
  useContext, useEffect, useLayoutEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { themeConfig } from '@shopgate/engage';
import { ViewContext } from '@shopgate/engage/components/View';
import { applyScrollContainer } from '@shopgate/engage/core/helpers';
import { getAppBarSettings } from '@shopgate/engage/settings/selectors/appSettings';

const { variables: { scroll: { offset = 100 } = {} } = {} } = (themeConfig || {}) as {
  variables?: { scroll?: { offset?: number } };
};
const MIN_DELTA = 10;

/**
 * Scroll state of the current view.
 */
interface OverlayScrollState {
  /** Whether any content moved below the top edge. */
  moved: boolean;
  scrolled: boolean;
  scrollingDown: boolean;
}

const INITIAL_SCROLL_STATE: OverlayScrollState = {
  moved: false,
  scrolled: false,
  scrollingDown: false,
};

/**
 * Selects the header settings.
 * @returns The header settings.
 */
export const useAppBarSettings = () => useSelector(getAppBarSettings);

/**
 * Tracks the scroll position and direction of the current view.
 * @param enabled Whether to track the scrolling.
 * @returns Whether content moved at all, whether it is scrolled past the offset, and whether
 * it scrolls down.
 */
export const useOverlayScroll = (enabled: boolean): OverlayScrollState => {
  const { contentRef } = (useContext(ViewContext) || {}) as {
    contentRef?: { current: HTMLElement | null };
  };
  const [state, setState] = useState<OverlayScrollState>(INITIAL_SCROLL_STATE);

  useLayoutEffect(() => {
    if (!enabled) {
      setState(INITIAL_SCROLL_STATE);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const useWindow = !applyScrollContainer();
    const target: HTMLElement | Window | null | undefined = useWindow
      ? window
      : contentRef?.current;

    if (!target) {
      return undefined;
    }

    /**
     * Reads the scroll position of the view.
     * @returns The scroll position of the view.
     */
    const getScrollTop = () => (useWindow ? window.scrollY : (target as HTMLElement).scrollTop);
    let previous = getScrollTop();
    let frame: number | null = null;

    /**
     * Updates the state from the current scroll position.
     */
    const update = () => {
      frame = null;
      const scrollTop = getScrollTop();
      const delta = scrollTop - previous;

      setState((current) => {
        const moved = scrollTop > 0;
        const scrolled = scrollTop > offset;
        let { scrollingDown } = current;

        if (Math.abs(delta) >= MIN_DELTA) {
          scrollingDown = delta > 0 && scrolled;
          previous = scrollTop;
        }

        if (!scrolled) {
          scrollingDown = false;
        }

        if (
          moved === current.moved
          && scrolled === current.scrolled
          && scrollingDown === current.scrollingDown
        ) {
          return current;
        }

        return {
          moved,
          scrolled,
          scrollingDown,
        };
      });
    };

    /**
     * Schedules an update for the next frame.
     */
    const handleScroll = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    target.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [contentRef, enabled]);

  return state;
};

const SCROLL_THRESHOLD = 6;

/**
 * Scrolls the current view when the visitor scrolls on the floating header. The header lies
 * outside of the scroll container, so a wheel or a swipe on its buttons or its search bar would
 * otherwise not move the page.
 * @param enabled Whether the header floats over the content.
 */
export const useForwardScroll = (enabled: boolean) => {
  const { contentRef } = (useContext(ViewContext) || {}) as {
    contentRef?: { current: HTMLElement | null };
  };

  useEffect(() => {
    const header = document.getElementById('AppHeader');
    if (!enabled || !header) {
      return undefined;
    }

    /**
     * Scrolls the view.
     * @param top The distance to scroll.
     */
    const scrollBy = (top: number) => {
      if (applyScrollContainer()) {
        contentRef?.current?.scrollBy({ top });
      } else {
        window.scrollBy({ top });
      }
    };

    let lastY: number | null = null;
    let dragging = false;

    /**
     * Scrolls the view by the distance of the wheel.
     * @param event The wheel event.
     */
    const handleWheel = (event: WheelEvent) => {
      scrollBy(event.deltaY);
    };

    /**
     * Starts a swipe.
     * @param event The touch event.
     */
    const handleTouchStart = (event: TouchEvent) => {
      lastY = event.touches[0]?.clientY ?? null;
      dragging = false;
    };

    /**
     * Scrolls the view along with the swipe once it is clearly no tap.
     * @param event The touch event.
     */
    const handleTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (lastY === null || typeof y !== 'number') {
        return;
      }

      const delta = lastY - y;
      if (!dragging && Math.abs(delta) < SCROLL_THRESHOLD) {
        return;
      }

      dragging = true;
      lastY = y;
      scrollBy(delta);
    };

    /**
     * Ends a swipe.
     */
    const handleTouchEnd = () => {
      lastY = null;
    };

    header.addEventListener('wheel', handleWheel, { passive: true });
    header.addEventListener('touchstart', handleTouchStart, { passive: true });
    header.addEventListener('touchmove', handleTouchMove, { passive: true });
    header.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      header.removeEventListener('wheel', handleWheel);
      header.removeEventListener('touchstart', handleTouchStart);
      header.removeEventListener('touchmove', handleTouchMove);
      header.removeEventListener('touchend', handleTouchEnd);
    };
  }, [contentRef, enabled]);
};
