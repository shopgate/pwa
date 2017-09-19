/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  RECEIVE_REVIEWS,
  REQUEST_REVIEWS,
  ERROR_REVIEWS,
} from '../constants';

import {
  mockedReviews,
  moreMockedReviews,
  totalReviewCount,
} from './mock';

import reducers from './index';

describe('Reviews reducers', () => {
  const hash = 'foo';
  /**
   * Helper function for comparing changed state against expected shape.
   * @param {Object} state State.
   * @param {number} expectedReviewsLength How many reviews should be stored.
   */
  const analyzeReceivedState = (state, expectedReviewsLength = totalReviewCount) => {
    expect(state.reviewsByHash[hash].totalReviewCount).toBe(totalReviewCount);
    expect(state.reviewsByHash[hash].reviews).toBeInstanceOf(Array);
    expect(state.reviewsByHash[hash].reviews).toBeInstanceOf(Array);
    expect(state.reviewsByHash[hash].reviews).toHaveLength(expectedReviewsLength);
  };
  let state = {};
  describe(REQUEST_REVIEWS, () => {
    it('should manipulate state when REQUEST_REVIEWS', () => {
      state = reducers(state, {
        type: REQUEST_REVIEWS,
        hash,
      });
      expect(state.reviewsByHash[hash]).toEqual({
        expires: 0,
        isFetching: true,
      });
    });
  });
  describe(RECEIVE_REVIEWS, () => {
    it('should manipulate state when receive reviews', () => {
      state = reducers(state, {
        type: RECEIVE_REVIEWS,
        hash,
        reviews: mockedReviews,
        totalReviewCount,
      });
      analyzeReceivedState(state, mockedReviews.length);
      expect(state.reviewsByHash[hash].expires).toBeGreaterThan(Date.now());
    });
    it('should append more reviews when received more', () => {
      state = reducers(state, {
        type: RECEIVE_REVIEWS,
        hash,
        reviews: moreMockedReviews,
        totalReviewCount,
      });

      analyzeReceivedState(state);
      expect(state.reviewsByHash[hash].expires).toBeGreaterThan(Date.now());
    });
  });
  describe(ERROR_REVIEWS, () => {
    it('should mark errored state', () => {
      state = reducers(state, {
        type: ERROR_REVIEWS,
        hash,
      });
      analyzeReceivedState(state);
      expect(state.reviewsByHash[hash].expires).toBe(0);
    });
  });
});
