import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getIsCookieConsentHandled } from '@shopgate/engage/tracking/selectors/cookieConsent';

/**
 * Returns a tabBar state.
 * @param {Object} state State.
 * @return {Object}
 */
const getTabBarState = state => state?.ui?.tabBar;

/**
 * Checks if the tab bar is currently enabled.
 *
 * !!! ATTENTION !!! This selector is a copy from the ios-theme TabBar selectors. It should be
 * replaced with a real one when the TabBar is moved to the engage library.
 *
 * @return {boolean}
 */
export const isTabBarEnabled = createSelector(
  getTabBarState,
  getIsCookieConsentHandled,
  // Do not show the TabBar when cookie consent is not handled yet. This prevents breaking out
  // of the cookie consent process.
  (state, cookieConsentHandled) => cookieConsentHandled && !!state?.enabled
);

/**
 * Creates a selector that returns whether the bottom insets should be applied to the View.
 * That's needed on any screen of the GMD theme (detected by th absence of the TabBar state)
 * and on screens of the iOS theme where the TabBar is enabled.
 */
export const getApplyBottomInsets = createSelector(
  getTabBarState,
  isTabBarEnabled,
  (tabBarState, tabBarEnabled) => {
    if (typeof tabBarState === 'undefined') {
      return true;
    }

    return tabBarEnabled;
  }
);

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  applyBottomInsets: getApplyBottomInsets(state),
});

export default connect(mapStateToProps);
