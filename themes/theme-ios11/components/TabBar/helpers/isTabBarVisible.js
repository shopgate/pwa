import { configuration } from '@shopgate/pwa-common/collections';
import { TAB_BAR_PATTERNS_BLACK_LIST } from '@shopgate/pwa-common/constants/Configuration';

/**
 * Checks if the tab bar is supposed to be visible for a specific route.
 * @param {string} pattern A route pattern.
 * @returns {boolean}
 */
const isTabBarVisible = pattern => (
  !configuration.get(TAB_BAR_PATTERNS_BLACK_LIST).includes(pattern)
);

export default isTabBarVisible;
