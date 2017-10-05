/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import { REQUEST_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_REVIEWS action.
 * @param {string} productId The ID of the product
 * @param {number} limit The maximum number of reviews
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action
 */
const requestProductReviews = (productId, limit) => ({
  type: REQUEST_PRODUCT_REVIEWS,
  productId,
  limit,
});

export default requestProductReviews;
