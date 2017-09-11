/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_PRODUCT_PROPERTIES } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that received properties.
 * @return {Object} The ERROR_PRODUCT_PROPERTIES action.
 */
const errorProductProperties = productId => ({
  type: ERROR_PRODUCT_PROPERTIES,
  productId,
});

export default errorProductProperties;
