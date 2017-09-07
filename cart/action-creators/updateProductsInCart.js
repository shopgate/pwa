/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched UPDATE_PRODUCTS_IN_CART action object.
 * @param {Array} updateData The update data.
 * @returns {Object} The dispatched action object.
 */
const updateProductsInCart = updateData => ({
  type: UPDATE_PRODUCTS_IN_CART,
  updateData,
});

export default updateProductsInCart;
