/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DELETE_PRODUCTS_FROM_CART } from '../constants';

/**
 * Creates the dispatched DELETE_PRODUCTS_FROM_CART action object.
 * @param {Array} cartItemIds The cart items to be deleted.
 * @returns {Object} The dispatched action object.
 */
const deleteProductsFromCart = cartItemIds => ({
  type: DELETE_PRODUCTS_FROM_CART,
  cartItemIds,
});

export default deleteProductsFromCart;
