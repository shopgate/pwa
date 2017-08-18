import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/constants/RoutePaths';
import { isCartButtonVisible } from 'Library/selectors/cart';
import {
  getSearchPhrase,
  getSortOrder,
} from '@shopgate/pwa-common/selectors/history';
import {
  pushHistory,
  replaceHistory,
} from '@shopgate/pwa-common/actions/history';
import {
  getBackgroundColor,
  getTextColor,
  isIconShadowShowing,
  isSearchShowing,
  isTitleShowing,
  isEnabled,
  isNavDrawerActive,
} from '../selectors';
import {
  enable,
  disable,
  toggleCartIcon as toggleNavigatorCartIcon,
  toggleSearch,
  toggleNavDrawer as toggleNavDrawerAction,
  setBackgroundColor,
  setSearchPhrase,
  setTextColor,
  enableIconShadow,
  disableIconShadow,
  enableSearch,
  disableSearch,
  enableTitle,
  disableTitle,
  enableViewTracking,
  disableViewTracking,
} from '../action-creators';

/**
 * Enable view tracking if not already enabled.
 * @returns {Function} A redux thunk.
 */
export const setViewTrackingEnabled = () => (dispatch, getState) => {
  const { navigator: { viewTracking } } = getState();

  if (!viewTracking) {
    dispatch(enableViewTracking());
  }
};

/**
 * Disables view tracking if not already disabled.
 * @returns {Function} A redux thunk.
 */
export const setViewTrackingDisabled = () => (dispatch, getState) => {
  const { navigator: { viewTracking } } = getState();

  if (viewTracking) {
    dispatch(disableViewTracking());
  }
};

/**
 * Sets the view scroll position to top.
 * @return {Function} A redux thunk.
 */
export const setViewScrollToTop = () => (dispatch, getState) => {
  const { history } = getState();

  dispatch(replaceHistory({
    state: {
      ...history.state,
      viewTop: true,
    },
  }));
};

/**
 * Resets the view scroll position if the given sort order
 * is different from the currently set sort order.
 * @param {string} sortOrder The sort order to compare.
 * @return {Function} A redux thunk.
 */
export const resetScrollTopBySort = sortOrder => (dispatch, getState) => {
  if (getSortOrder(getState()) !== sortOrder) {
    dispatch(setViewScrollToTop());
  }
};

/**
 * Sets the color of the Navigator's background.
 * @param {string} color The new background color of the navigator.
 * @return {Function} A redux thunk.
 */
export const setNavigatorBackground = color => (dispatch, getState) => {
  if (getBackgroundColor(getState()) !== color) {
    dispatch(setBackgroundColor(color));
  }
};

/**
 * Sets the color of the Navigator's text.
 * @param {string} color The new text color of the navigator.
 * @return {Function} A redux thunk.
 */
export const setNavigatorColor = color => (dispatch, getState) => {
  if (getTextColor(getState()) !== color) {
    dispatch(setTextColor(color));
  }
};

/**
 * Enables the shadow on the Navigator's icons.
 * @return {Function} A redux thunk.
 */
export const enableNavigatorIconShadow = () => (dispatch, getState) => {
  if (!isIconShadowShowing(getState())) {
    dispatch(enableIconShadow());
  }
};

/**
 * Disables the shadow on the Navigator's icons.
 * @return {Function} A redux thunk.
 */
export const disableNavigatorIconShadow = () => (dispatch, getState) => {
  if (isIconShadowShowing(getState())) {
    dispatch(disableIconShadow());
  }
};

/**
 * Enables the Navigator's search.
 * @return {Function} A redux thunk.
 */
export const enableNavigatorSearch = () => (dispatch, getState) => {
  if (!isSearchShowing(getState())) {
    dispatch(enableSearch());
  }
};

/**
 * Disables the Navigator's search.
 * @return {Function} A redux thunk.
 */
export const disableNavigatorSearch = () => (dispatch, getState) => {
  if (isSearchShowing(getState())) {
    dispatch(disableSearch());
  }
};

/**
 * Enables the Navigator's title.
 * @return {Function} A redux thunk.
 */
export const enableNavigatorTitle = () => (dispatch, getState) => {
  if (!isTitleShowing(getState())) {
    dispatch(enableTitle());
  }
};

/**
 * Disables the Navigator's title.
 * @return {Function} A redux thunk.
 */
export const disableNavigatorTitle = () => (dispatch, getState) => {
  if (isTitleShowing(getState())) {
    dispatch(disableTitle());
  }
};

/**
 * Disables the navigator.
 * @return {Function} A redux thunk.
 */
export const disableNavigator = () => (dispatch, getState) => {
  if (isEnabled(getState())) {
    dispatch(disable());
  }
};

/**
 * Disables the navigator.
 * @return {Function} A redux thunk.
 */
export const enableNavigator = () => (dispatch, getState) => {
  if (!isEnabled(getState())) {
    dispatch(enable());
  }
};

/**
 * Toggles the visibility of the cart icon.
 * @param {boolean} value Whether to show the cart icon.
 * @return {Function} A redux thunk.
 */
export const toggleCartIcon = value => (dispatch, getState) => {
  if (isCartButtonVisible(getState()) !== value) {
    dispatch(toggleNavigatorCartIcon(value));
  }
};

/**
 * Toggles the visibility of the navigation drawer.
 * @param {boolean} enabled Whether to show the navigation drawer.
 * @return {Function} A redux thunk.
 */
export const toggleNavDrawer = enabled => (dispatch, getState) => {
  if (isNavDrawerActive(getState()) !== enabled) {
    dispatch(toggleNavDrawerAction(enabled));
  }
};

/**
 * Performs appropriate action(s) when UI search gets triggered.
 * @return {Function} A redux thunk.
 */
export const submitSearch = () => (dispatch, getState) => {
  const state = getState();
  const { searchActive, searchPhrase } = state.navigator;

  if (!searchActive) {
    // Reset search phrase
    dispatch(setSearchPhrase(''));
    // Show search input
    dispatch(toggleSearch(true));
    return;
  } else if (!searchPhrase) {
    // Hide search input
    dispatch(toggleSearch(false));
    return;
  }

  // Perform search by entering/updating search route
  const { history } = state;
  const { sort, ...otherParams } = history.queryParams;
  const prevSearchPhrase = getSearchPhrase(state);

  // Set up next history location.
  const historyLocation = {
    pathname: SEARCH_PATH,
    params: {
      ...otherParams,
      s: searchPhrase,
    },
    state: {
      // Force view to scroll back to top
      viewTop: true,
    },
  };

  // Check if we are already on the search route
  if (history.pathname.startsWith(SEARCH_PATH)) {
    if (searchPhrase !== prevSearchPhrase) {
      // Preserve current history state
      historyLocation.state = {
        ...history.state,
        ...historyLocation.state,
      };
      // Just update the current history location
      dispatch(replaceHistory(historyLocation));
    }
  } else {
    // Move to the search location
    dispatch(pushHistory(historyLocation));
  }

  // Always close search upon submit
  dispatch(toggleSearch(false));
};
