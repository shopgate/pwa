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
} from '../constants';

/**
 * Stores a collection of products by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function reviewsByHash(state = {}, action) {
  switch (action.type) {
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
       * If there are no previous reviews and no incoming reviews
       * its set to empty array, otherwise it will be an array of the previous and the
       * new reviews. Duplicates are removed.
       */
      const stateReviews = (reviews || nextReviews.length) ? uniqBy(
        [
          ...(reviews || []),
          ...nextReviews,
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
          expires: Date.now() + REVIEWS_LIFETIME,
        },
      };
    }
    case ERROR_REVIEWS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: false,
          expires: 0,
        },
      };
    default:
      return state;
  }
}
