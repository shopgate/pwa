import { createSelector } from 'reselect';
import {
  getCartProductCount,
  getProductPendingCount,
} from '@shopgate/pwa-common-commerce/cart/selectors';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';

/**
 * Selects the navigator state.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getNavigatorState = state => state.navigator;

/**
 * Selects the current background color from navigator state.
 * @param {Object} state The global state.
 * @return {string}
 */
export const getBackgroundColor = createSelector(
  getNavigatorState,
  state => state.backgroundColor
);

/**
 * Selects the current text color from navigator state.
 * @param {Object} state The global state.
 * @return {string}
 */
export const getTextColor = createSelector(
  getNavigatorState,
  state => state.textColor
);

/**
 * Selects the current state of shadow of the navigator's icons.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isIconShadowShowing = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.showIconShadow
);

/**
 * Selects the current state from navigator search.
 * @param {Object} state The global state.
 * @return {string}
 */
export const getSearchPhrase = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.searchPhrase
);

/**
 * Selects the current state from navigator search.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isSearchShowing = createSelector(
  getNavigatorState,
  state => state.showSearch
);

/**
 * Selects the current state from navigator progress bar.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isProgressBarShowing = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.showProgressBar
);

/**
 * @param {Object} state The global state.
 * @return {boolean}
 */
export const showLoadingBar = createSelector(
  isProgressBarShowing,
  isViewLoading,
  (progressBarShowing, viewLoading) => !!(progressBarShowing && viewLoading)
);

/**
 * Selects the current state from navigator title.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isTitleShowing = createSelector(
  getNavigatorState,
  state => state.showTitle
);

/**
 * Selects the current state state from navigator disabled status.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isEnabled = createSelector(
  getNavigatorState,
  state => state.enabled
);

/**
 * Selects the current state state from navigator disabled status.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isLoadingBarShowing = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.showLoadingBar
);

/**
 * Checks if the cart button is available.
 * @return {boolean}
 */
export const isCartButtonVisible = createSelector(
  getCartProductCount,
  getProductPendingCount,
  getNavigatorState,
  (count, pendingCount, navigator) => (
    navigator.showCartIcon && (count + pendingCount) > 0
  )
);
