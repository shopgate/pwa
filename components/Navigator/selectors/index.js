/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import {
  getHistoryPathname,
  getQueryParamsAsString,
} from '@shopgate/pwa-common/selectors/history';

import {
  getCartProductCount,
  getProductPendingCount,
} from '@shopgate/pwa-common-commerce/cart/selectors';

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
  navigatorState => navigatorState.backgroundColor
);

/**
 * Selects the current text color from navigator state.
 * @param {Object} state The global state.
 * @return {string}
 */
export const getTextColor = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.textColor
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
  navigatorState => navigatorState.showSearch
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
 * Selects the current state from navigator title.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isTitleShowing = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.showTitle
);

/**
 * Selects the current state state from navigator disabled status.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isEnabled = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.enabled
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
 * Selects the current state of the navigation drawer.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isNavDrawerActive = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.navDrawerActive
);

/**
 * Selects the current state of the navigation drawer.
 * @param {Object} state The global state.
 * @return {string}
 */
export const isNavSearchFieldActive = createSelector(
  getNavigatorState,
  navigatorState => navigatorState.searchActive
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

/**
 * Selects the navigator state for tracking.
 * @param {Object} state The application state.
 * @return {Object}
 */
export const getTrackingNavigatorState = createSelector(
  getHistoryPathname,
  getQueryParamsAsString,
  (pathname, queryString) => ({
    pathname,
    queryString,
  })
);
