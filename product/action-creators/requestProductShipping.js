/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCT_SHIPPING } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @return {Object} The REQUEST_PRODUCT_SHIPPING action.
 */
const requestProductShipping = productId => ({
  type: REQUEST_PRODUCT_SHIPPING,
  productId,
});

export default requestProductShipping;
