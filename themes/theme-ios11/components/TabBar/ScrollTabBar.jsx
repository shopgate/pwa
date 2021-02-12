import { useCallback, useEffect } from 'react';
import { themeConfig } from '@shopgate/engage';
import { UIEvents, useWidgetSettings } from '@shopgate/engage/core';
import { viewScroll$ } from '@shopgate/pwa-common/streams/view';
import { HIDE_TAB_BAR, SHOW_TAB_BAR } from './constants';

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
        UIEvents.emit(HIDE_TAB_BAR, { scroll: true });
      }
      if (scrollIn) {
        UIEvents.emit(SHOW_TAB_BAR, { scroll: true });
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
