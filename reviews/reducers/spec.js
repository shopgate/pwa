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
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
} from '../constants';

import {
  mockedReviews,
  moreMockedReviews,
  totalReviewCount,
} from './mock';

import reducers from './index';

describe('Reviews reducers', () => {
  describe('ReviewsByHash', () => {
    const hash = 'foo';
    let state = {};

    /**
     * Helper function for comparing changed state against expected shape.
     * @param {Object} receivedState State.
     * @param {number} expectedReviewsLength How many reviews should be stored.
     */
    const analyzeReceivedState = (receivedState, expectedReviewsLength = totalReviewCount) => {
      expect(receivedState.reviewsByHash[hash].totalReviewCount).toBe(totalReviewCount);
      expect(receivedState.reviewsByHash[hash].reviews).toBeInstanceOf(Array);
      expect(receivedState.reviewsByHash[hash].reviews).toBeInstanceOf(Array);
      expect(receivedState.reviewsByHash[hash].reviews).toHaveLength(expectedReviewsLength);
    };
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
      it('should handle error state', () => {
        state.reviewsByHash[hash].isFetching = true;
        state = reducers(state, {
          type: ERROR_REVIEWS,
          hash,
        });
        analyzeReceivedState(state);
        expect(state.reviewsByHash[hash].expires).toBe(0);
      });
    });
  });
  describe('ReviewsByProductId', () => {
    let state = {};
    describe(REQUEST_PRODUCT_REVIEWS, () => {
      it('should manipulate state when REQUEST_REVIEWS', () => {
        state = reducers(state, {
          type: REQUEST_PRODUCT_REVIEWS,
          productId: 'foo',
        });
        expect(state.reviewsByProductId.foo).toEqual({
          isFetching: true,
          reviews: null,
          totalReviewCount: null,
        });
      });
    });
    describe(RECEIVE_PRODUCT_REVIEWS, () => {
      it('should manipulate state when receive reviews', () => {
        state = reducers(state, {
          type: RECEIVE_PRODUCT_REVIEWS,
          productId: 'foo',
          reviews: mockedReviews,
          totalReviewCount,
        });
        expect(state.reviewsByProductId.foo.reviews.length).toBe(mockedReviews.length);
      });
      it('should replace reviews on another call when received more', () => {
        state = reducers(state, {
          type: RECEIVE_PRODUCT_REVIEWS,
          productId: 'foo',
          reviews: moreMockedReviews,
          totalReviewCount,
        });
        expect(state.reviewsByProductId.foo.reviews.length).toBe(moreMockedReviews.length);
      });
    });
    describe(ERROR_PRODUCT_REVIEWS, () => {
      it('should handle error state', () => {
        state.reviewsByProductId.foo.isFetching = true;
        state = reducers(state, {
          type: ERROR_PRODUCT_REVIEWS,
          productId: 'foo',
        });
        expect(state.reviewsByProductId.foo.isFetching).toBe(false);
      });
    });
  });
});
