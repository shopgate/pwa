import {
  useContext, useEffect, useLayoutEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { themeConfig } from '@shopgate/engage';
import { ViewContext } from '@shopgate/engage/components/View';
import { applyScrollContainer } from '@shopgate/engage/core/helpers';
import { getAppBarSettings } from '@shopgate/engage/settings/selectors/appSettings';

const { variables: { scroll: { offset = 100 } = {} } = {} } = themeConfig || {};
const MIN_DELTA = 10;
const INITIAL_SCROLL_STATE = {
  scrolled: false,
  scrollingDown: false,
};

/**
 * @returns {Object} The header settings.
 */
export const useAppBarSettings = () => useSelector(getAppBarSettings);

/**
 * Tracks the scroll position of the current view for the floating header.
 * @param {boolean} enabled Whether the header floats over the content.
 * @returns {{ scrolled: boolean, scrollingDown: boolean }}
 */
export const useOverlayScroll = (enabled) => {
  const { contentRef } = useContext(ViewContext) || {};
  const [state, setState] = useState(INITIAL_SCROLL_STATE);

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
    const target = useWindow ? window : contentRef?.current;

    if (!target) {
      return undefined;
    }

    /**
     * @returns {number} The scroll position of the view.
     */
    const getScrollTop = () => (useWindow ? window.scrollY : target.scrollTop);
    let previous = getScrollTop();
    let frame = null;

    /**
     * Updates the state from the current scroll position.
     */
    const update = () => {
      frame = null;
      const scrollTop = getScrollTop();
      const delta = scrollTop - previous;

      setState((current) => {
        const scrolled = scrollTop > offset;
        let { scrollingDown } = current;

        if (Math.abs(delta) >= MIN_DELTA) {
          scrollingDown = delta > 0 && scrolled;
          previous = scrollTop;
        }

        if (!scrolled) {
          scrollingDown = false;
        }

        if (scrolled === current.scrolled && scrollingDown === current.scrollingDown) {
          return current;
        }

        return {
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
