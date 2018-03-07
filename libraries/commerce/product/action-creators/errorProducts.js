/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_PRODUCTS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @return {Object} The ERROR_PRODUCTS action.
 */
const errorProducts = payload => ({
  type: ERROR_PRODUCTS,
  ...payload,
});

export default errorProducts;
