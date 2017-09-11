/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCTS } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {Object} payload.products The data of the received products.
 * @param {boolean} payload.cached If the result should be cached.
 * @return {Object} The RECEIVE_PRODUCTS action.
 */
const receiveProducts = payload => ({
  type: RECEIVE_PRODUCTS,
  ...payload,
});

export default receiveProducts;
