/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {
  getCurrentProductReviews,
  getProductReviewsExcerpt,
  getReviewsTotalCount,
  getCurrentReviewCount,
  getReviewsFetchingState,
  getProductReviewCount,
} from './index';
import {
  emptyState,
  finalState,
  testReviews,
} from './mock';

describe('Reviews selectors', () => {
  describe('getCurrentProductReviews', () => {
    it('should return reviews when reviews are available', () => {
      const reviews = getCurrentProductReviews(finalState);
      expect(reviews).toEqual(testReviews);
    });
    it('should return empty array when state has no reviews for current product', () => {
      const state = _.cloneDeep(finalState);
      state.product.currentProduct.productId = null;
      const reviews = getCurrentProductReviews(state);
      expect(reviews).toEqual([]);
    });
    it('should return empty array when state is empty', () => {
      const reviews = getCurrentProductReviews(emptyState);
      expect(reviews).toEqual([]);
    });
  });
  describe('getProductReviewsExcerpt', () => {
    it('should return product reviews when reviews are available', () => {
      const reviews = getProductReviewsExcerpt(finalState);
      expect(reviews).toEqual(testReviews);
    });
    it('should return null when state has no reviews for current product', () => {
      const state = _.cloneDeep(finalState);
      state.product.currentProduct.productId = null;
      const reviews = getProductReviewsExcerpt(state);
      expect(reviews).toBe(null);
    });
    it('should return null when state has no reviews for current product', () => {
      const reviews = getProductReviewsExcerpt(emptyState);
      expect(reviews).toBe(null);
    });
  });
  describe('getReviewsTotalCount', () => {
    it('should return null when no reviews are available', () => {
      const totalCount = getReviewsTotalCount(emptyState);
      expect(totalCount).toBe(null);
    });
    it('should return number when reviews are available', () => {
      const totalCount = getReviewsTotalCount(finalState);
      expect(totalCount).toBeGreaterThan(1);
    });
  });
  describe('getCurrentReviewCount', () => {
    it('should return null when no reviews are available', () => {
      const totalCount = getCurrentReviewCount(emptyState);
      expect(totalCount).toBe(null);
    });
    it('should return number when reviews are available', () => {
      const totalCount = getCurrentReviewCount(finalState);
      expect(totalCount).toBeGreaterThan(1);
    });
  });
  describe('getReviewsFetchingState', () => {
    it('should return fetchint state', () => {
      const result = getReviewsFetchingState(finalState);
      expect(result).toEqual(false);
    });
  });
  describe('getProductReviewCount', () => {
    it('should return review count', () => {
      const result = getProductReviewCount(finalState);
      expect(result).toBe(finalState.reviews.reviewsByProductId[9209597131].totalReviewCount);
    });
    it('should return null when there is no reviews', () => {
      const result = getProductReviewCount(emptyState);
      expect(result).toBe(null);
    });
  });
});
