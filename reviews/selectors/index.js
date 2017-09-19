/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getCurrentProductId } from '../../product/selectors/product';
/**
 * Select the product reviews state.
 * @param {Object} state The current application state.
 * @return {Object} The product reviews state.
 */
const getReviewsState = state => state.reviews.reviewsByHash;

/**
 * Retrieves the current product reviews.
 * @param {Object} state The current application state.
 * @return {Array|null} The reviews for a product
 */
export const getReviews = createSelector(
  getCurrentProductId,
  getReviewsState,
  (productId, reviewsState) => {
    const hash = generateResultHash({
      productId,
    });

    const collection = reviewsState[hash];
    if (!collection || !collection.reviews) {
      return null;
    }

    return collection.reviews;
  }
);
