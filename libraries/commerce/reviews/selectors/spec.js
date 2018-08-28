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
  const propsProductId = { productId: '9209597131' };
  const propsEmpty = { productId: null };

  describe('getProductReviews', () => {
    it('should return reviews when reviews are available', () => {
      const reviews = getProductReviews(finalState, propsProductId);
      expect(reviews).toEqual(testReviews);
    });

    it('should return empty array when state has no reviews for current product', () => {
      const state = _.cloneDeep(finalState);
      const reviews = getProductReviews(state, propsEmpty);
      expect(reviews).toEqual([]);
    });

    it('should return empty array when state is empty', () => {
      const reviews = getProductReviews(emptyState, propsProductId);
      expect(reviews).toEqual([]);
    });
  });

  describe('getProductReviewsExcerpt', () => {
    it('should return product reviews when reviews are available', () => {
      const reviews = getProductReviewsExcerpt(finalState, propsProductId);
      expect(reviews).toEqual(testReviews.slice(0, REVIEW_PREVIEW_COUNT));
    });

    it('should return null when state has no reviews for current product', () => {
      const state = _.cloneDeep(finalState);
      const reviews = getProductReviewsExcerpt(state, propsEmpty);
      expect(reviews).toBe(null);
    });

    it('should return null when state has no reviews for current product', () => {
      const reviews = getProductReviewsExcerpt(emptyState, propsProductId);
      expect(reviews).toBe(null);
    });
  });

  describe('getReviewsTotalCount', () => {
    it('should return null when no reviews are available', () => {
      const totalCount = getReviewsTotalCount(emptyState, propsProductId);
      expect(totalCount).toBe(null);
    });

    it('should return number when reviews are available', () => {
      const totalCount = getReviewsTotalCount(finalState, propsProductId);
      expect(totalCount).toBeGreaterThan(1);
    });
  });

  describe('getCurrentReviewCount', () => {
    it('should return null when no reviews are available', () => {
      const totalCount = getCurrentReviewCount(emptyState, propsProductId);
      expect(totalCount).toBe(null);
    });

    it('should return number when reviews are available', () => {
      const totalCount = getCurrentReviewCount(finalState, propsProductId);
      expect(totalCount).toBeGreaterThan(1);
    });
  });

  describe('getReviewsFetchingState', () => {
    it('should return fetching state', () => {
      const result = getReviewsFetchingState(finalState, propsProductId);
      expect(result).toEqual(false);
    });
  });

  describe('getProductReviewCount', () => {
    it('should return review count', () => {
      const result = getProductReviewCount(finalState, propsProductId);
      expect(result).toBe(finalState.reviews.reviewsByProductId[9209597131].totalReviewCount);
    });

    it('should return null when there is no reviews', () => {
      const result = getProductReviewCount(emptyState, propsProductId);
      expect(result).toBe(null);
    });
  });

  describe('getUserReviewForProduct', () => {
    it('should return user review', () => {
      const result = getUserReviewForProduct(finalState, propsProductId);
      expect(result).toEqual({
        ...finalState.reviews.reviewsById[1],
      });
    });

    it('should return empty object when no user review is available', () => {
      const result = getUserReviewForProduct(emptyState, propsProductId);
      expect(result).toEqual({});
    });
  });

  describe('getDefaultAuthorName', () => {
    it('should return author name when user is logged in', () => {
      const result = getDefaultAuthorName(finalState, propsProductId);
      expect(result).toBe('Foo Bar');
    });

    it('should return empty string, when user it not logged in', () => {
      const result = getDefaultAuthorName(emptyState, propsProductId);
      expect(result).toBe('');
    });
  });
});
