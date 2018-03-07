/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCT_CACHED } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_CACHED action object.
 * @param {Object} productData The product data.
 * @return {Object} The RECEIVE_PRODUCT_CACHED action.
 */
const receiveProductCached = productData => ({
  type: RECEIVE_PRODUCT_CACHED,
  productData,
});

export default receiveProductCached;
