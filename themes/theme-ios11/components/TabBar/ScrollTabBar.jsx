import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/engage';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { UIEvents } from '@shopgate/engage/core/events';
import { viewScroll$ } from '@shopgate/engage/core/streams';
import {
  HIDE_TAB_BAR,
  SHOW_TAB_BAR,
} from './constants';
import connect from './connector';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

/**
 * Scroll TabBar
 * @returns {JSX}
 */
function ScrollTabBar({ isVisible }) {
  const { hideOnScroll = false } = useWidgetSettings('@shopgate/engage/components/TabBar');

  const onScroll = useCallback((scrollEvent) => {
    if (!isVisible || !hideOnScroll) {
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
  }, [hideOnScroll, isVisible]);

  useEffect(() => {
    if (hideOnScroll) {
      const subscription = viewScroll$.subscribe(onScroll);
      return () => subscription.unsubscribe();
    }
    return undefined;
  });

  return null;
}

ScrollTabBar.propTypes = {
  isVisible: PropTypes.bool,
};

ScrollTabBar.defaultProps = {
  isVisible: null,
};

export default connect(ScrollTabBar);
