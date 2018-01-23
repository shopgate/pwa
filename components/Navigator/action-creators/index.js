/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TOGGLE_NAVIGATOR_CART_ICON,
  TOGGLE_NAVIGATOR_SEARCH,
  TOGGLE_NAV_DRAWER,
  TOGGLE_PROGRESS_BAR,
  TOGGLE_LOGIN,
  SET_NAVIGATOR_BACKGROUND,
  SET_NAVIGATOR_COLOR,
  SET_NAVIGATOR_SEARCH_QUERY,
  SET_FILTER_OPENED,
  SET_FILTER_CLOSED,
  SET_FILTER_ATTRIBUTE_OPENED,
  SET_FILTER_ATTRIBUTE_CLOSED,
  SET_ICON_SHADOW_ENABLED,
  SET_ICON_SHADOW_DISABLED,
  SET_SEARCH_ENABLED,
  SET_SEARCH_DISABLED,
  SET_TITLE_ENABLED,
  SET_TITLE_DISABLED,
  SET_NAVIGATOR_ENABLED,
  SET_NAVIGATOR_DISABLED,
  ENABLE_VIEW_TRACKING,
  DISABLE_VIEW_TRACKING,
} from '../constants';

/**
 * Toggles the navigator progress bar..
 * @param {boolean} active The state of the progress bar.
 * @returns {Object} The action object.
 */
export const toggleProgressBar = active => ({
  type: TOGGLE_PROGRESS_BAR,
  active,
});

/**
 * Toggles the navigator cart icon.
 * @param {boolean} active The cart icon active state.
 * @returns {Object} The action object.
 */
export const toggleCartIcon = active => ({
  type: TOGGLE_NAVIGATOR_CART_ICON,
  active,
});

/**
 * Toggles the navigator search.
 * @param {boolean} active The search active state.
 * @returns {Object} The action object.
 */
export const toggleSearch = active => ({
  type: TOGGLE_NAVIGATOR_SEARCH,
  active,
});

/**
 * Toggles the navigation drawer visibility state.
 * @param {boolean} active Whether to show the navigation drawer.
 * @returns {Object} The action object.
 */
export const toggleNavDrawer = active => ({
  type: TOGGLE_NAV_DRAWER,
  active,
});

/**
 * Toggles the login open state.
 * @param {boolean} active Whether the login is open.
 * @returns {Object} The action object.
 */
export const toggleLogin = active => ({
  type: TOGGLE_LOGIN,
  active,
});

/**
 * Sets the background color of the navigator.
 * @param {boolean} color The navigator's new background color.
 * @returns {Object} The action object.
 */
export const setBackgroundColor = color => ({
  type: SET_NAVIGATOR_BACKGROUND,
  color,
});

/**
 * Sets the text color of the navigator.
 * @param {boolean} color The navigator's new text color.
 * @returns {Object} The action object.
 */
export const setTextColor = color => ({
  type: SET_NAVIGATOR_COLOR,
  color,
});

/**
 * Sets the navigator search string.
 * @param {string} query The search string.
 * @returns {Object} The action object.
 */
export const setSearchPhrase = query => ({
  type: SET_NAVIGATOR_SEARCH_QUERY,
  query,
});

/**
 * Creates the dispatched SET_FILTER_OPENED action object.
 * @return {Object} The dispatched action object.
 */
export const setFilterOpened = () => ({
  type: SET_FILTER_OPENED,
});

/**
 * Creates the dispatched SET_FILTER_CLOSED action object.
 * @return {Object} The dispatched action object.
 */
export const setFilterClosed = () => ({
  type: SET_FILTER_CLOSED,
});

/**
 * Creates the dispatched SET_FILTER_ATTRIBUTE_OPENED action object.
 * @return {Object} The dispatched action object.
 */
export const setFilterAttributeOpened = () => ({
  type: SET_FILTER_ATTRIBUTE_OPENED,
});

/**
 * Creates the dispatched SET_FILTER_ATTRIBUTE_CLOSED action object.
 * @return {Object} The dispatched action object.
 */
export const setFilterAttributeClosed = () => ({
  type: SET_FILTER_ATTRIBUTE_CLOSED,
});

/**
 * Enables the navigators icon shadows.
 * @returns {Object} The action object.
 */
export const enableIconShadow = () => ({
  type: SET_ICON_SHADOW_ENABLED,
});

/**
 * Disables the navigators icon shadows.
 * @returns {Object} The action object.
 */
export const disableIconShadow = () => ({
  type: SET_ICON_SHADOW_DISABLED,
});

/**
 * Enables the navigator search.
 * @returns {Object} The action object.
 */
export const enableSearch = () => ({
  type: SET_SEARCH_ENABLED,
});

/**
 * Disables the navigator search.
 * @returns {Object} The action object.
 */
export const disableSearch = () => ({
  type: SET_SEARCH_DISABLED,
});

/**
 * Enables the navigator title.
 * @returns {Object} The action object.
 */
export const enableTitle = () => ({
  type: SET_TITLE_ENABLED,
});

/**
 * Disables the navigator title
 * @returns {Object} The action object.
 */
export const disableTitle = () => ({
  type: SET_TITLE_DISABLED,
});

/**
 * Creates the SET_NAVIGATOR_ENABLED redux action object.
 * @returns {Object} The action object.
 */
export const enable = () => ({
  type: SET_NAVIGATOR_ENABLED,
});

/**
 * Creates the SET_NAVIGATOR_DISABLED redux action object.
 * @returns {Object} The action object.
 */
export const disable = () => ({
  type: SET_NAVIGATOR_DISABLED,
});

/**
 * Creates the ENABLE_VIEW_TRACKING redux action object.
 * @returns {Object} The action object.
 */
export const enableViewTracking = () => ({
  type: ENABLE_VIEW_TRACKING,
});

/**
 * Creates the DISABLE_VIEW_TRACKING redux action object.
 * @returns {Object} The action object.
 */
export const disableViewTracking = () => ({
  type: DISABLE_VIEW_TRACKING,
});
