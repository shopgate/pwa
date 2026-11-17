import { useContext, useEffect } from 'react';
import type { RefObject } from 'react';
import { ViewContext } from '@shopgate/engage/components/View';

const MOMENTUM_WINDOW = 100;

/**
 * Stops the page from scrolling on when a touch lands on the given column.
 * @param columnRef The scrollable column inside the page.
 * @param enabled Whether the column scrolls on its own.
 */
export const useStopPageMomentum = (columnRef: RefObject<HTMLElement>, enabled: boolean) => {
  const { contentRef } = (useContext(ViewContext) || {}) as {
    contentRef?: { current: HTMLElement | null };
  };

  useEffect(() => {
    const page = contentRef?.current;
    const column = columnRef.current;

    if (!enabled || !(page instanceof HTMLElement) || !column) {
      return undefined;
    }

    let lastScroll = -Infinity;

    /**
     * Remembers when the page scrolled last.
     * @param event The scroll event of the page.
     */
    const handleScroll = (event: Event) => {
      lastScroll = event.timeStamp;
    };

    /**
     * Stops the page for two frames when it was still scrolling.
     * @param event The touch event on the column.
     */
    const handleTouchStart = (event: TouchEvent) => {
      if (event.timeStamp - lastScroll > MOMENTUM_WINDOW) {
        return;
      }

      const { overflow } = page.style;
      page.style.setProperty('overflow', 'hidden');

      requestAnimationFrame(() => requestAnimationFrame(() => {
        page.style.setProperty('overflow', overflow);
      }));
    };

    page.addEventListener('scroll', handleScroll, { passive: true });
    column.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      page.removeEventListener('scroll', handleScroll);
      column.removeEventListener('touchstart', handleTouchStart);
    };
  }, [columnRef, contentRef, enabled]);
};
