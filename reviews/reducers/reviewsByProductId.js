/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import {
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
} from '../constants';

/**
 * Stores product reviews by their product ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function reviewsByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          reviews: null,
          totalReviewCount: null,
        },
      };
    case RECEIVE_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
          reviews: action.reviews.map(review => review.id),
          totalReviewCount: action.totalReviewCount,
        },
      };
    case ERROR_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };

    default:
      return state;
  }
}
