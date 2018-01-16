/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  SET_VIEW_LOADING,
  UNSET_VIEW_LOADING,
  INCREMENT_VIEW_LOADING,
  DECREMENT_VIEW_LOADING,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched SET_VIEW_LOADING action object.
 * @param {string} pathname The target pathname.
 * @return {Object} The dispatched action object.
 */
export const setLoading = pathname => ({
  type: SET_VIEW_LOADING,
  pathname,
});

/**
 * Creates the dispatched UNSET_VIEW_LOADING action object.
 * @param {string} pathname The target pathname.
 * @return {Object} The dispatched action object.
 */
export const unsetLoading = pathname => ({
  type: UNSET_VIEW_LOADING,
  pathname,
});

/**
 * Creates the dispatched INCREMENT_VIEW_LOADING action object.
 * @param {string} pathname The target pathname.
 * @return {Object} The dispatched action object.
 */
export const incrementLoading = pathname => ({
  type: INCREMENT_VIEW_LOADING,
  pathname,
});

/**
 * Creates the dispatched DECREMENT_VIEW_LOADING action object.
 * @param {string} pathname The target pathname.
 * @return {Object} The dispatched action object.
 */
export const decrementLoading = pathname => ({
  type: DECREMENT_VIEW_LOADING,
  pathname,
});
