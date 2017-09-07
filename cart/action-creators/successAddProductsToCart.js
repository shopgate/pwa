/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SUCCESS_ADD_PRODUCTS_TO_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_ADD_PRODUCTS_TO_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successAddProductsToCart = () => ({
  type: SUCCESS_ADD_PRODUCTS_TO_CART,
});

export default successAddProductsToCart;
