/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  RECEIVE_REVIEWS,
} from '../constants';

/**
 * Stores a collection of products by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
function reviewsById(state = {}, action) {
  switch (action.type) {
    case RECEIVE_REVIEWS: {
      const nextReviews = action.reviews || [];
      return nextReviews.reduce((currentReviews, review) => ({
        ...currentReviews,
        [review.id]: review,
      }), state);
    }
    default:
      return state;
  }
}

export default reviewsById;
