/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCT_OPTIONS } from '../constants';

/**
 * Dispatches the RECEIVE_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @param {Object} options The data of the received product options.
 * @return {Object} The RECEIVE_PRODUCT_OPTIONS action.
 */
const receiveProductOptions = (productId, options) => ({
  type: RECEIVE_PRODUCT_OPTIONS,
  productId,
  options,
});

export default receiveProductOptions;
