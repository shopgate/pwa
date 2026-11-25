import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ViewContext } from '@shopgate/engage/components/View';
import { applyScrollContainer } from '@shopgate/engage/core/helpers';
import { getAppBarSettings } from '@shopgate/engage/settings/selectors/appSettings';

/**
 * Selects the header settings.
 * @returns The header settings.
 */
export const useAppBarSettings = () => useSelector(getAppBarSettings);

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
