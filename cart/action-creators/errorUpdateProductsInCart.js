/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched ERROR_UPDATE_PRODUCTS_IN_CART action object.
 * @param {Array} updateData The update data from the failed UPDATE_PRODUCTS_IN_CART action.
 * @param {Array} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
const errorUpdateProductsInCart = (updateData, errors = []) => ({
  type: ERROR_UPDATE_PRODUCTS_IN_CART,
  updateData,
  errors,
});

export default errorUpdateProductsInCart;
