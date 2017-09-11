/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCT } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT action object.
 * @param {string} productId The ID of the received product.
 * @param {Object} productData The data of the received product.
 * @return {Object} The RECEIVE_PRODUCT action.
 */
const receiveProduct = (productId, productData) => ({
  type: RECEIVE_PRODUCT,
  productId,
  productData,
});

export default receiveProduct;
