/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_DELETE_PRODUCTS_FROM_CART } from '../constants';

/**
 * Creates the dispatched ERROR_DELETE_PRODUCTS_FROM_CART action object.
 * @param {Array} products The products that where supposed to be deleted within
 *   an DELETE_PRODUCTS_FROM_CART action.
 * @param {Array} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
const errorDeleteProductsFromCart = (products, errors = []) => ({
  type: ERROR_DELETE_PRODUCTS_FROM_CART,
  products,
  errors,
});

export default errorDeleteProductsFromCart;
