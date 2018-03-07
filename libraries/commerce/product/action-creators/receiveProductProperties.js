/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCT_PROPERTIES } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_PROPERTIES action object.
 * @param {string} productId The ID of the product that received properties.
 * @param {Object} properties Key-value list of properties.
 * @return {Object} The RECEIVE_PRODUCT_PROPERTIES action.
 */
const receiveProductProperties = (productId, properties) => ({
  type: RECEIVE_PRODUCT_PROPERTIES,
  productId,
  properties,
});

export default receiveProductProperties;
