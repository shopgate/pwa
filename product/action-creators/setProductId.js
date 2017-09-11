/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_PRODUCT_ID } from '../constants';

/**
 * Creates the dispatched SET_PRODUCT_ID action object.
 * @param {string|null} productId The product id.
 * @returns {Object} The dispatched action object.
 */
const setProductId = productId => ({
  type: SET_PRODUCT_ID,
  productId,
});

export default setProductId;
