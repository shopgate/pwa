/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';

/**
 * Selects the general UI state.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getGeneralUI = state => state.ui.general;

/**
 * Selects the title from the UI.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getTitle = createSelector(
  getGeneralUI,
  general => general.title || ''
);

/**
 * Selects the top status from the UI.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getTopStatus = createSelector(
  getGeneralUI,
  general => general.isTop
);
