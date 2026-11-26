import {
  useContext, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { ViewContext } from '@shopgate/engage/components/View/context';
import { applyScrollContainer } from '@shopgate/engage/core/helpers/scrollContainer';
import { useRoute } from '../useRoute';

const { variables: { scroll: { offset = 100 } = {} } = {} } = (themeConfig || {}) as {
  variables?: { scroll?: { offset?: number } };
};
const SCROLL_DOWN_DELTA = 10;
const SCROLL_UP_DELTA = 50;
const BOTTOM_ZONE = 100;
const REMEMBERED_ROUTES = 50;
const lastScrollingDown = new Map<string, boolean>();

/**
 * Parameters of the useViewScroll hook.
 */
export interface UseViewScrollParams {
  /** Whether to track the scrolling. Defaults to true. */
  enabled?: boolean;
}

/**
 * Scroll state of the current view.
 */
export interface ViewScrollState {
  /** Whether the view is scrolled away from the top. */
  moved: boolean;
  /** Whether the view is scrolled past the scroll offset of the theme. */
  scrolled: boolean;
  /** Whether the view scrolls down while it is scrolled past the scroll offset of the theme. */
  scrollingDown: boolean;
}

/**
 * Builds the scroll state of a scroll position.
 * @param scrollTop The scroll position.
 * @param scrollingDown Whether the view scrolls down.
 * @returns The scroll state.
 */
const getStateAt = (scrollTop: number, scrollingDown = false): ViewScrollState => ({
  moved: scrollTop > 0,
  scrolled: scrollTop > offset,
  scrollingDown: scrollingDown && scrollTop > offset,
});

/**
 * Tracks how far and in which direction the current view is scrolled, for elements that follow
 * the scroll position. It reads the position once per frame, while useScrollDirectionChange gets
 * the view scroll stream at most every 250 ms. It only works inside a View. When the view mounts
 * or shows again with a scroll position past the offset, scrolling down turns false once the
 * position is restored, so elements that hide while scrolling down slide in again. Elements that
 * mount again, also in a new view of the same route, start with the direction the route had when
 * it was left; the last 50 routes are remembered. It takes 10 px down to count as scrolling down
 * and 50 px up to count as scrolling up. Moving up within 100 px of the bottom doesn't count as
 * scrolling up.
 * @param params The hook parameters.
 * @param params.enabled Whether to track the scrolling. Defaults to true.
 * @returns The scroll state of the view.
 */
const useViewScroll = ({ enabled = true }: UseViewScrollParams = {}): ViewScrollState => {
  const { contentRef } = useContext(ViewContext) as {
    contentRef?: { current: HTMLElement | null };
  };
  const route = useRoute();
  const routeId = route?.id;
  const visible = route?.visible !== false;
  const savedScrollTop = (route?.state as { scrollTop?: number } | undefined)?.scrollTop || 0;
  const latestSavedScrollTop = useRef(savedScrollTop);
  const restoreExpected = useRef(true);
  latestSavedScrollTop.current = savedScrollTop;
  const [state, setState] = useState<ViewScrollState>(() => {
    const remembered = routeId ? lastScrollingDown.get(routeId) : undefined;
    return getStateAt(enabled ? savedScrollTop : 0, enabled && (remembered ?? true));
  });

  useLayoutEffect(() => {
    if (!enabled) {
      setState(getStateAt(0));
    }
  }, [enabled]);

  useEffect(() => {
    if (!visible) {
      restoreExpected.current = true;
    }

    if (!enabled || !visible) {
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

    /**
     * Reads the largest scroll position of the view.
     * @returns The largest scroll position of the view.
     */
    const getMaxScrollTop = () => (useWindow
      ? Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
        - window.innerHeight
      : (target as HTMLElement).scrollHeight - (target as HTMLElement).clientHeight);
    const restorePending = restoreExpected.current && getScrollTop() === 0
      && latestSavedScrollTop.current > 0;
    let previous = restorePending ? latestSavedScrollTop.current : getScrollTop();
    let scrollingDown = false;
    let frame: number | null = null;
    restoreExpected.current = false;

    /**
     * Updates the state from the current scroll position.
     */
    const update = () => {
      frame = null;
      const maxScrollTop = Math.max(0, getMaxScrollTop());
      const scrollTop = Math.min(Math.max(0, getScrollTop()), maxScrollTop);
      const delta = scrollTop - previous;

      if (delta >= SCROLL_DOWN_DELTA || delta <= -SCROLL_UP_DELTA) {
        if (delta > 0 || scrollTop < maxScrollTop - BOTTOM_ZONE) {
          scrollingDown = delta > 0;
        }
        previous = scrollTop;
      }

      const next = getStateAt(scrollTop, scrollingDown);
      if (routeId) {
        lastScrollingDown.delete(routeId);
        lastScrollingDown.set(routeId, next.scrollingDown);
        if (lastScrollingDown.size > REMEMBERED_ROUTES) {
          lastScrollingDown.delete(lastScrollingDown.keys().next().value as string);
        }
      }
      setState(current => (
        current.moved === next.moved
        && current.scrolled === next.scrolled
        && current.scrollingDown === next.scrollingDown
          ? current
          : next
      ));
    };

    /**
     * Schedules an update for the next frame.
     */
    const handleScroll = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(update);
      }
    };

    if (!restorePending) {
      update();
    }
    target.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [contentRef, enabled, routeId, visible]);

  return state;
};

export default useViewScroll;
