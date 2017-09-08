/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PRODUCTS } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {string} params The criteria of the products to request.
 * @return {Object} The REQUEST_PRODUCTS action.
 */
const requestProducts = payload => ({
  type: REQUEST_PRODUCTS,
  ...payload,
});

export default requestProducts;
