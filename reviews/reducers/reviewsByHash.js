/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import uniqBy from 'lodash/uniqBy';
import {
  REVIEWS_LIFETIME,
  REQUEST_REVIEWS,
  RECEIVE_REVIEWS,
  ERROR_REVIEWS,
  SET_CURRENT_REVIEWS_PRODUCT_ID,
} from '../constants';

/**
 * Stores a collection of products by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function reviewsByHash(state = {}, action) {
  switch (action.type) {
    /**
     * Sets the currentReviewsProductID.
     * This property is needed to make the reviews page independent of a product itself.
     * Usually the currentProduct should be set when user navigates from a product page.
     * However this workflow is not guaranteed also during automated tests.
     */
    case SET_CURRENT_REVIEWS_PRODUCT_ID:
      return {
        ...state,
        currentReviewsProductId: action.productId,
      };
    case REQUEST_REVIEWS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_REVIEWS: {
      const { reviews } = state[action.hash];
      const nextReviews = action.reviews || [];

      /**
       * If there are no previous products and no incoming products
       * its set to empty array, otherwise it will be an array of the previous and the
       * new products. Duplicates are removed.
       *
       * @todo Remove fakeId implementation when pipeline is updated.
       */
      let fakeId = (reviews && reviews.length) ? reviews.length : 0;
      const nextReviewsWithFakeId = nextReviews.map((rev) => {
        fakeId += 1;
        const review = JSON.parse(JSON.stringify(rev));
        review.id = fakeId;
        return review;
      });
      const stateReviews = (reviews || nextReviews.length) ? uniqBy(
        [
          ...(reviews || []),
          ...nextReviewsWithFakeId,
        ],
        'id'
      ) : [];

      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          reviews: stateReviews,
          totalResultCount: typeof action.totalResultCount !== 'undefined' ?
            action.totalResultCount : null,
          isFetching: false,
          expires: action.cached ? (Date.now() + REVIEWS_LIFETIME) : 0,
        },
      };
    }
    case ERROR_REVIEWS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
