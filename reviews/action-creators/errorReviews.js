/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_REVIEWS } from '../constants';

/**
 * Dispatches the ERROR_REVIEWS action.
 * @param {string} hash Generated hash.
 * @param {string} productId The ID of the product.
 * @param {number} limit The limit which was used for a get request.
 * @param {number} offset The offset which was used for a get request.
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action.
 */
const errorProductReviews = (hash, productId, limit, offset) => ({
  type: ERROR_REVIEWS,
  hash,
  productId,
  limit,
  offset,
});

export default errorProductReviews;
