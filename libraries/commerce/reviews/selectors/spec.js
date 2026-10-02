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
  isProductReviewsExcerptMissing,
  isProductReviewsExcerptLoading,
  hasProductReviewsExcerptError,
} from './index';
import {
  emptyState,
  existingHash,
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

    it('should keep the pipeline order and not pin the user review', () => {
      const state = _.cloneDeep(finalState);
      state.reviews.userReviewsByProductId['9209597131'].review = testReviews[2].id;
      const reviews = getProductReviews(state, propsProductId);
      expect(reviews).toEqual(testReviews);
    });
  });

  describe('getProductReviewsExcerpt', () => {
    it('should return product reviews when reviews are available', () => {
      const reviews = getProductReviewsExcerpt(finalState, propsProductId);
      expect(reviews).toEqual(testReviews);
    });

    it('should keep the pipeline order and not pin the user review', () => {
      const state = _.cloneDeep(finalState);
      state.reviews.reviewsByProductId['9209597131'].reviews = [1, 2];
      state.reviews.userReviewsByProductId['9209597131'].review = testReviews[2].id;
      const reviews = getProductReviewsExcerpt(state, propsProductId);
      expect(reviews).toEqual(testReviews.slice(0, 2));
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

    it('should return zero when the product has no reviews', () => {
      const state = _.cloneDeep(finalState);
      state.reviews.reviewsByHash[existingHash].totalReviewCount = 0;
      expect(getReviewsTotalCount(state, propsProductId)).toBe(0);
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

    it('should return zero when the product has no reviews', () => {
      const state = _.cloneDeep(finalState);
      state.reviews.reviewsByProductId['9209597131'].totalReviewCount = 0;
      expect(getProductReviewCount(state, propsProductId)).toBe(0);
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

    it('should return empty string for a logged out user with remaining user data', () => {
      const state = _.cloneDeep(finalState);
      state.user.login.isLoggedIn = false;
      const result = getDefaultAuthorName(state, propsProductId);
      expect(result).toBe('');
    });
  });

  describe('review preview state', () => {
    /**
     * Builds a state with the given preview collection for the test product.
     * @param {Object} [collection] The preview collection.
     * @returns {Object}
     */
    const buildState = (collection) => {
      const state = _.cloneDeep(finalState);
      if (collection) {
        state.reviews.reviewsByProductId['9209597131'] = collection;
      } else {
        delete state.reviews.reviewsByProductId['9209597131'];
      }
      return state;
    };

    /**
     * @param {Object} state The state.
     * @returns {Object} The three preview flags.
     */
    const getFlags = state => ({
      missing: isProductReviewsExcerptMissing(state, propsProductId),
      loading: isProductReviewsExcerptLoading(state, propsProductId),
      error: hasProductReviewsExcerptError(state, propsProductId),
    });

    it('should report a preview that was not requested yet as missing and loading', () => {
      expect(getFlags(buildState())).toEqual({
        missing: true,
        loading: true,
        error: false,
      });
    });

    it('should report a running request as loading', () => {
      expect(getFlags(buildState({
        isFetching: true,
        requestId: 1,
      }))).toEqual({
        missing: false,
        loading: true,
        error: false,
      });
    });

    it('should report received reviews as neither loading nor failed', () => {
      expect(getFlags(buildState({
        isFetching: false,
        requestId: 1,
        reviews: [],
      }))).toEqual({
        missing: false,
        loading: false,
        error: false,
      });
    });

    it('should report a failed first request as error', () => {
      expect(getFlags(buildState({
        isFetching: false,
        requestId: 1,
        expires: 0,
      }))).toEqual({
        missing: false,
        loading: false,
        error: true,
      });
    });

    it('should keep previously received reviews after a failed refresh', () => {
      expect(getFlags(buildState({
        isFetching: false,
        requestId: 2,
        reviews: [1, 2],
        expires: 0,
      }))).toEqual({
        missing: false,
        loading: false,
        error: false,
      });
    });

    it('should not report an entry created by a review submit as error', () => {
      expect(getFlags(buildState({ expires: 0 }))).toEqual({
        missing: false,
        loading: true,
        error: false,
      });
    });
  });
});
