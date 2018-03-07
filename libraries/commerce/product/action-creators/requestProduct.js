/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCT } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT action object.
 * @param {string} productId The ID of the product to request.
 * @return {Object} The REQUEST_PRODUCT action.
 */
const requestProduct = productId => ({
  type: REQUEST_PRODUCT,
  productId,
});

export default requestProduct;
