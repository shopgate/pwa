/**
 *  Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import {
  REQUEST_ADD_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
} from '../constants';

/**
 * Request add favorites action.
 * @param {Object} productId Product identifier.
 * @returns {Object}
 */
export const requestAddFavorites = productId => ({
  type: REQUEST_ADD_FAVORITES,
  productId,
});

/**
 * Request add favorites action.
 * @param {Object} products Products.
 * @returns {Object}
 */
export const receiveAddFavorites = products => ({
  type: RECEIVE_ADD_FAVORITES,
  products,
});

/**
 * Error on add favorites action.
 * @param {Object} error Error.
 * @returns {Object}
 */
export const errorAddFavorites = error => ({
  type: ERROR_ADD_FAVORITES,
  error,
});
