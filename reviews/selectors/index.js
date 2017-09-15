/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
/**
 * Select the product reviews state
 * @param {Object} state The current application state.
 * @return {Object} The product reviews state.
 */
const getReviewsState = state => state.reviews.reviewsByHash;

/**
 * Select the current product reviews product id.
 * @param {Object} state The product reviews state.
 * @return {Object} The Product reviews state.
 */
const getReviewsCurrentProductId = state => state.reviews.reviewsByHash.currentReviewsProductId;
/**
 * Retrieves the current product reviews.
 * @param {Object} state The current application state.
 * @return {Object} The reviews for a product
 */
export const getReviews = createSelector(
  getReviewsCurrentProductId,
  getReviewsState,
  (productId, reviewsState) => {
    const hash = generateResultHash(
      productId
    );

    const collection = reviewsState[hash];
    if (!collection || !collection.reviews) {
      return null;
    }

    return collection.reviews;
  }
);
