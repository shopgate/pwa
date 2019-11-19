import { configuration } from '@shopgate/pwa-common/collections';
import { TAB_BAR_PATTERNS_BLACK_LIST } from '@shopgate/pwa-common/constants/Configuration';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import shouldCartHaveTabBar from './shouldCartHaveTabBar';

/**
 * Checks if the tab bar is supposed to be visible for a specific route.
 * @param {Object} state The application state.
 * @param {string} pattern A route pattern.
 * @returns {boolean}
 */
const isTabBarVisible = (state, pattern) => {
  let visible = false;

  if (pattern === CART_PATH) {
    // Enable TabBar for empty cart page.
    visible = shouldCartHaveTabBar(state);
  } else if (!configuration.get(TAB_BAR_PATTERNS_BLACK_LIST).includes(pattern)) {
    // Enable TabBar for those that are not blacklisted.
    visible = true;
  }

  return visible;
};

export default isTabBarVisible;

