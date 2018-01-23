/*
 *  Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import {
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
  REQUEST_SUBMIT_REVIEW,
  REVIEWS_LIFETIME,
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
          expires: 0,
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
          expires: Date.now() + REVIEWS_LIFETIME,
        },
      };
    case ERROR_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
          expires: 0,
        },
      };
    case REQUEST_SUBMIT_REVIEW:
      return {
        ...state,
        [action.review.productId]: {
          ...(state[action.review.productId] || {}),
          expires: 0,
        },
      };
    default:
      return state;
  }
}
