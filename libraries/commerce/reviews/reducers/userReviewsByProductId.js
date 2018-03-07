/*
 *  Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import {
  REQUEST_USER_REVIEW,
  REQUEST_SUBMIT_REVIEW,
  RECEIVE_USER_REVIEW,
  RECEIVE_SUBMIT_REVIEW,
  ERROR_USER_REVIEW,
  ERROR_SUBMIT_REVIEW,
  RESET_SUBMIT_REVIEW,
  FLUSH_USER_REVIEWS,
  USER_REVIEW_LIFETIME,
} from '../constants';

/**
 * Stores product reviews by their product ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function userReviewsByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_USER_REVIEW:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          review: '',
          expires: 0,
        },
      };
    case RECEIVE_USER_REVIEW:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
          review: action.review.id,
          expires: Date.now() + USER_REVIEW_LIFETIME,
        },
      };
    case ERROR_SUBMIT_REVIEW:
    case ERROR_USER_REVIEW: {
      const newState = { ...state };
      delete newState[action.productId];
      return newState || {};
    }
    case REQUEST_SUBMIT_REVIEW:
      return {
        ...state,
        [action.review.productId]: {
          ...state[action.review.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_SUBMIT_REVIEW:
      return {
        ...state,
        [action.review.productId]: {
          isFetching: false,
          review: action.review.id,
          expires: action.review.id ? Date.now() + USER_REVIEW_LIFETIME : 0,
        },
      };
    case RESET_SUBMIT_REVIEW:
      return {
        ...state,
        [action.review.productId]: {
          ...state[action.review.productId],
          isFetching: false,
          review: action.review.id,
        },
      };
    case FLUSH_USER_REVIEWS:
      return {};
    default:
      return state;
  }
}
