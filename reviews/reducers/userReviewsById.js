/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import {
  REQUEST_USER_REVIEW,
  RECEIVE_USER_REVIEW,
  ERROR_USER_REVIEW,
} from '../constants';

/**
 * Stores product reviews by their product ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function userReviewsById(state = {}, action) {
  switch (action.type) {
    case REQUEST_USER_REVIEW:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          review: null,
        },
      };
    case RECEIVE_USER_REVIEW:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
          review: action
        },
      };
    case ERROR_USER_REVIEW:
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
