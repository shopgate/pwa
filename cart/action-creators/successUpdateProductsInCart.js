/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SUCCESS_UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successUpdateProductsInCart = () => ({
  type: SUCCESS_UPDATE_PRODUCTS_IN_CART,
});

export default successUpdateProductsInCart;
