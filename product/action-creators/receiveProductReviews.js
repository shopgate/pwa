/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the RECEIVE_PRODUCT_REVIEWS action
 * @param {string} productId The ID of the product
 * @param {Object} reviews The received review data
 * @param {number} totalReviewCount The total number of reviews for a product
 * @returns {Object} The RECEIVE_PRODUCT_REVIEWS action
 */
const receiveProductReviews = (productId, reviews, totalReviewCount) => ({
  type: RECEIVE_PRODUCT_REVIEWS,
  productId,
  reviews,
  totalReviewCount,
});

export default receiveProductReviews;
