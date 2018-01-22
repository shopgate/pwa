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
} from './constants';

/**
 * Stores all the navigator information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (
  state = {
    backgroundColor: null,
    enabled: true,
    filterOpen: false,
    filterAttributeOpen: false,
    loginOpen: false,
    searchActive: false,
    searchPhrase: '',
    showCartIcon: true,
    showIconShadow: false,
    showProgressBar: true,
    showSearch: true,
    showTitle: true,
    textColor: null,
    viewTracking: false,
  },
  action
) => {
  switch (action.type) {
    case TOGGLE_NAVIGATOR_CART_ICON:
      return {
        ...state,
        showCartIcon: action.active,
      };
    case TOGGLE_NAVIGATOR_SEARCH:
      return {
        ...state,
        searchActive: action.active,
      };
    case TOGGLE_NAV_DRAWER:
      return {
        ...state,
        navDrawerActive: action.active,
      };
    case TOGGLE_LOGIN:
      return {
        ...state,
        loginOpen: action.active,
      };
    case TOGGLE_PROGRESS_BAR:
      return {
        ...state,
        showProgressBar: action.active,
      };
    case SET_NAVIGATOR_BACKGROUND:
      return {
        ...state,
        backgroundColor: action.color,
      };
    case SET_NAVIGATOR_COLOR:
      return {
        ...state,
        textColor: action.color,
      };
    case SET_NAVIGATOR_SEARCH_QUERY:
      return {
        ...state,
        searchPhrase: action.query,
      };
    case SET_FILTER_OPENED:
      return {
        ...state,
        filterOpen: true,
        searchActive: false,
      };
    case SET_FILTER_CLOSED:
      return {
        ...state,
        filterOpen: false,
      };
    case SET_FILTER_ATTRIBUTE_OPENED:
      return {
        ...state,
        filterAttributeOpen: true,
      };
    case SET_FILTER_ATTRIBUTE_CLOSED:
      return {
        ...state,
        filterAttributeOpen: false,
      };
    case SET_ICON_SHADOW_ENABLED:
      return {
        ...state,
        showIconShadow: true,
      };
    case SET_ICON_SHADOW_DISABLED:
      return {
        ...state,
        showIconShadow: false,
      };
    case SET_SEARCH_ENABLED:
      return {
        ...state,
        showSearch: true,
      };
    case SET_SEARCH_DISABLED:
      return {
        ...state,
        showSearch: false,
      };
    case SET_TITLE_ENABLED:
      return {
        ...state,
        showTitle: true,
      };
    case SET_TITLE_DISABLED:
      return {
        ...state,
        showTitle: false,
      };
    case SET_NAVIGATOR_ENABLED:
      return {
        ...state,
        enabled: true,
      };
    case SET_NAVIGATOR_DISABLED:
      return {
        ...state,
        enabled: false,
      };
    case ENABLE_VIEW_TRACKING:
      return {
        ...state,
        viewTracking: true,
      };
    case DISABLE_VIEW_TRACKING:
      return {
        ...state,
        viewTracking: false,
      };
    default:
      return state;
  }
};
