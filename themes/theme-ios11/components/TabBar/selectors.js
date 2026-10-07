import { createSelector } from 'reselect';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { getIsCookieConsentHandled } from '@shopgate/engage/tracking/selectors/cookieConsent';
import getTabForPathname from './helpers/getTabForPathname';

/**
 * Returns a tabBar state.
 * @param {Object} state State.
 * @return {Object}
 */
const getTabBarState = state => state.ui.tabBar;

/**
 * Returns what tab is active, returns TAB_NONE if none is active.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getActiveTab = createSelector(
  getCurrentPathname,
  getTabForPathname
);

/**
 * Returns the last route that was shown within a tab.
 * @param {Object} state The application state.
 * @param {string} tab The tab.
 * @returns {Object|null}
 */
export const getTabLastRoute = (state, tab) => getTabBarState(state).lastRoutes[tab] ?? null;

/**
 * Checks if the tab bar is currently enabled.
 * @return {boolean}
 */
export const isTabBarEnabled = createSelector(
  getTabBarState,
  getIsCookieConsentHandled,
  // Do not show the TabBar when cookie consent is not handled yet. This prevents breaking out
  // of the cookie consent process.
  (state, cookieConsentHandled) => cookieConsentHandled && state.enabled
);

/**
 * Checks if the tab bar is currently visible.
 * @return {boolean}
 */
export const isTabBarVisible = createSelector(
  getTabBarState,
  isTabBarEnabled,
  (state, enabled) => {
    if (!enabled) {
      return false;
    }

    return state.visible;
  }
);
