/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
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
        },
      };
    case RECEIVE_USER_REVIEW:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
          review: action.review.id,
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
        },
      };
    case RECEIVE_SUBMIT_REVIEW:
      return {
        ...state,
        [action.review.productId]: {
          isFetching: false,
          review: action.review.id,
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
    default:
      return state;
  }
}
