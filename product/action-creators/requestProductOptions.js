/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCT_OPTIONS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @return {Object} The REQUEST_PRODUCT_OPTIONS action.
 */
const requestProductOptions = productId => ({
  type: REQUEST_PRODUCT_OPTIONS,
  productId,
});

export default requestProductOptions;
