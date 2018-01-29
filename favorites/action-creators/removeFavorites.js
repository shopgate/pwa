/**
 *  Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import {
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
} from '../constants';

/**
 * Request add favorites action.
 * @param {string} productId Product identifier.
 * @returns {Object}
 */
export const requestRemoveFavorites = productId => ({
  type: REQUEST_REMOVE_FAVORITES,
  productId,
});

/**
 * Request add favorites action.
 * @returns {Object}
 */
export const receiveRemoveFavorites = () => ({
  type: RECEIVE_REMOVE_FAVORITES,
});

/**
 * Error on add favorites action.
 * @param {string} productId Product identifier.
 * @returns {Object}
 */
export const errorRemoveFavorites = productId => ({
  type: ERROR_REMOVE_FAVORITES,
  productId,
});
