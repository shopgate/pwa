/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_PRODUCT } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT action object.
 * @param {string} productId The ID of the received product.
 * @return {Object} The ERROR_PRODUCT action.
 */
const errorProduct = productId => ({
  type: ERROR_PRODUCT,
  productId,
});

export default errorProduct;
