import { useCallback, useEffect } from 'react';
import { themeConfig } from '@shopgate/engage';
import { UIEvents, useWidgetSettings } from '@shopgate/engage/core';
import { viewScroll$ } from '@shopgate/pwa-common/streams/view';
import {
  TAB_BAR_SCROLL_IN,
  TAB_BAR_SCROLL_OUT,
} from './constants';

const { variables: { scroll: { offset = 100 } } } = themeConfig;

/**
 * Scroll TabBar
 * @returns {JSX}
 */
function ScrollTabBar() {
  const { hideOnScroll = true } = useWidgetSettings('@shopgate/engage/components/TabBar');

  const onScroll = useCallback((scrollEvent) => {
    if (!hideOnScroll) {
      return;
    }
    const {
      scrolled, scrollOut, scrollIn, scrollTop,
    } = scrollEvent;
    if (scrolled) {
      if (scrollOut && scrollTop >= offset) {
        UIEvents.emit(TAB_BAR_SCROLL_OUT);
      }
      if (scrollIn) {
        UIEvents.emit(TAB_BAR_SCROLL_IN);
      }
    }
  }, [hideOnScroll]);

  useEffect(() => {
    if (hideOnScroll) {
      const subscription = viewScroll$.subscribe(onScroll);
      return () => subscription.unsubscribe();
    }
    return undefined;
  });

  return null;
}

export default ScrollTabBar;
