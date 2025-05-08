import { themeConfig } from '@shopgate/engage';
import { UIEvents } from '@shopgate/engage/core/events';
import { useWidgetSettings, useScrollDirectionChange } from '@shopgate/engage/core/hooks';
import {
  HIDE_TAB_BAR,
  SHOW_TAB_BAR,
} from './constants';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

/**
 * Hook to observe scroll events and show/hide the tab bar accordingly.
 * @param {boolean} isVisible Whether the tab bar is visible (determined by visibility rules).
 */
export const useTabBarScrollObserver = (isVisible) => {
  const { hideOnScroll = false } = useWidgetSettings('@shopgate/engage/components/TabBar');

  useScrollDirectionChange({
    enabled: hideOnScroll && isVisible,
    offset,
    onScrollDown: () => {
      UIEvents.emit(HIDE_TAB_BAR, { scroll: true });
    },
    onScrollUp: () => {
      UIEvents.emit(SHOW_TAB_BAR, { scroll: true });
    },
  });
};
