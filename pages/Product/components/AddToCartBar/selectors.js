/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';

/**
 * Selects the addToCartBar state.
 * @param {Object} state The current application state.
 * @return {Object}
 */
const getAddToCartBarState = state => state.ui.addToCartBar;

/**
 * Selects the current added count from the addToCartBar state.
 * @param {Object} state The current application state.
 * @return {number}
 */
export const selectActionCount = createSelector(
  getAddToCartBarState,
  state => state.added
);
