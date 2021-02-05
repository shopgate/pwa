import { useCallback, useEffect, useState } from 'react';
import { UIEvents, useScroll, useWidgetSettings } from '@shopgate/engage/core';
import { VIEW_EVENTS } from '@shopgate/engage/components';
import { HIDE_TAB_BAR, SHOW_TAB_BAR } from './constants';

/**
 * Scroll TabBar
 * @returns {JSX}
 */
function ScrollTabBar() {
  const { hideOnScroll } = useWidgetSettings('@shopgate/engage/components/TabBar');

  const [viewContentRef, setViewContentRef] = useState({});

  useEffect(() => {
    UIEvents.addListener(VIEW_EVENTS.CONTENT_REF, setViewContentRef);

    return () => UIEvents.removeListener(VIEW_EVENTS.CONTENT_REF, setViewContentRef);
  }, []);

  const onScroll = useCallback((callbackData) => {
    const { scrolled, scrollOut, scrollIn } = callbackData;
    if (scrolled && hideOnScroll) {
      if (scrollOut) {
        UIEvents.emit(HIDE_TAB_BAR, { scroll: true });
      }
      if (scrollIn) {
        UIEvents.emit(SHOW_TAB_BAR, { scroll: true });
      }
    }
  }, [hideOnScroll]);

  useScroll(onScroll, viewContentRef.current);

  return null;
}

export default ScrollTabBar;
