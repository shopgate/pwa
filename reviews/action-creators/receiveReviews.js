/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_REVIEWS } from '../constants';

/**
 * Dispatches the RECEIVE_REVIEWS action.
 * @param {string} hash Generated hash for an entity.
 * @param {string} productId The ID of the product.
 * @param {Object} reviews The received review data.
 * @param {number} totalReviewCount The total number of reviews for a product.
 * @returns {Object} The RECEIVE_PRODUCT_REVIEWS action.
 */
const receiveReviews = (hash, productId, reviews, totalReviewCount) => ({
  type: RECEIVE_REVIEWS,
  hash,
  productId,
  reviews,
  totalReviewCount,
});

export default receiveReviews;
