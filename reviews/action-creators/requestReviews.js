/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_REVIEWS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_REVIEWS_LIST action.
 * @param {string} hash Generated hash.
 * @param {string} productId The ID of the product
 * @param {number} limit The maximum number of reviews
 * @param {number} offset The list offset.
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action
 */
const requestReviews = (hash, productId, limit, offset) => ({
  type: REQUEST_REVIEWS,
  hash,
  productId,
  limit,
  offset,
});

export default requestReviews;
