import _ from 'lodash';
import {
  getProductReviews,
  getProductReviewsExcerpt,
  getReviewsTotalCount,
  getCurrentReviewCount,
  getReviewsFetchingState,
  getProductReviewCount,
  getUserReviewForProduct,
  getDefaultAuthorName,
} from './index';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import {
  emptyState,
  finalState,
  testReviews,
} from './mock';

describe('Reviews selectors', () => {
  describe('getProductReviews', () => {
    it('should return reviews when reviews are available', () => {
      const reviews = getProductReviews(finalState);
      expect(reviews).toEqual(testReviews);
    });
    it('should return empty array when state has no reviews for current product', () => {
      const state = _.cloneDeep(finalState);
      state.product.currentProduct.productId = null;
      const reviews = getProductReviews(state);
      expect(reviews).toEqual([]);
    });
    it('should return empty array when state is empty', () => {
      const reviews = getProductReviews(emptyState);
      expect(reviews).toEqual([]);
    });
  });
  describe('getProductReviewsExcerpt', () => {
    it('should return product reviews when reviews are available', () => {
      const reviews = getProductReviewsExcerpt(finalState);
      expect(reviews).toEqual(testReviews.slice(0, REVIEW_PREVIEW_COUNT));
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
  describe('getUserReviewForProduct', () => {
    it('should return user review', () => {
      const result = getUserReviewForProduct(finalState);
      expect(result).toEqual({
        ...finalState.reviews.reviewsById[1],
      });
    });
    it('should return empty object when no user review is available', () => {
      const result = getUserReviewForProduct(emptyState);
      expect(result).toEqual({});
    });
  });
  describe('getDefaultAuthorName', () => {
    it('should return author name when user is logged in', () => {
      const result = getDefaultAuthorName(finalState);
      expect(result).toBe('Foo Bar');
    });
    it('should return empty string, when user it not logged in', () => {
      const result = getDefaultAuthorName(emptyState);
      expect(result).toBe('');
    });
  });
});
