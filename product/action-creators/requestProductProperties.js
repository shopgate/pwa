/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCT_PROPERTIES } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that requests properties.
 * @return {Object} The REQUEST_PRODUCT_PROPERTIES action.
 */
const requestProductProperties = productId => ({
  type: REQUEST_PRODUCT_PROPERTIES,
  productId,
});

export default requestProductProperties;
