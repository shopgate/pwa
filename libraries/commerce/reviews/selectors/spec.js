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
  isReviewListMissing,
  isReviewListLoading,
  hasReviewListError,
  getReviewListRequestOffset,
  hasMoreReviews,
  getReviewListSort,
  getReviewListFilters,
  isReviewListQueryChanged,
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

  describe('review list state', () => {
    /**
     * Builds a state with the given list collection for the test product.
     * @param {Object} [collection] The list collection.
     * @returns {Object}
     */
    const buildState = (collection) => {
      const state = _.cloneDeep(finalState);
      if (collection) {
        state.reviews.reviewsByHash[existingHash] = collection;
      } else {
        delete state.reviews.reviewsByHash[existingHash];
      }
      return state;
    };

    /**
     * @param {Object} state The state.
     * @returns {Object} The list flags and the last request offset.
     */
    const getFlags = state => ({
      missing: isReviewListMissing(state, propsProductId),
      loading: isReviewListLoading(state, propsProductId),
      error: hasReviewListError(state, propsProductId),
      requestOffset: getReviewListRequestOffset(state, propsProductId),
    });

    it('should report a list that was not requested yet as missing and loading', () => {
      expect(getFlags(buildState())).toEqual({
        missing: true,
        loading: true,
        error: false,
        requestOffset: 0,
      });
    });

    it('should report a running first request as loading', () => {
      expect(getFlags(buildState({
        isFetching: true,
        expires: 0,
        requestOffset: 0,
      }))).toEqual({
        missing: false,
        loading: true,
        error: false,
        requestOffset: 0,
      });
    });

    it('should report a running load more request as loading', () => {
      expect(getFlags(buildState({
        isFetching: true,
        expires: 0,
        reviews: [1, 2],
        requestOffset: 2,
      }))).toEqual({
        missing: false,
        loading: true,
        error: false,
        requestOffset: 2,
      });
    });

    it('should report received reviews as neither loading nor failed', () => {
      expect(getFlags(buildState({
        isFetching: false,
        expires: Date.now() + 1000,
        reviews: [],
        requestOffset: 0,
      }))).toEqual({
        missing: false,
        loading: false,
        error: false,
        requestOffset: 0,
      });
    });

    it('should report a failed first request as error', () => {
      expect(getFlags(buildState({
        isFetching: false,
        expires: 0,
        requestOffset: 0,
      }))).toEqual({
        missing: false,
        loading: false,
        error: true,
        requestOffset: 0,
      });
    });

    it('should report a failed load more request as error with its offset', () => {
      expect(getFlags(buildState({
        isFetching: false,
        expires: 0,
        reviews: [1, 2],
        requestOffset: 2,
      }))).toEqual({
        missing: false,
        loading: false,
        error: true,
        requestOffset: 2,
      });
    });
  });

  describe('hasMoreReviews', () => {
    /**
     * @param {Object} [collection] The list collection.
     * @param {string} [paginationType] The pagination type from the review settings.
     * @returns {Object}
     */
    const buildState = (collection, paginationType) => {
      const state = _.cloneDeep(finalState);
      if (collection) {
        state.reviews.reviewsByHash[existingHash] = collection;
      } else {
        delete state.reviews.reviewsByHash[existingHash];
      }
      state.reviews.reviewSettings = paginationType ? { paginationType } : {};
      return state;
    };

    it('should be false without a list or without loaded reviews', () => {
      expect(hasMoreReviews(buildState(), propsProductId)).toBe(false);
      expect(hasMoreReviews(buildState({
        reviews: [],
        totalReviewCount: 5,
        after: 'next',
      }, 'cursor'), propsProductId)).toBe(false);
    });

    it('should compare the loaded reviews with the total count with offset pagination', () => {
      expect(hasMoreReviews(buildState({
        reviews: [1, 2],
        totalReviewCount: 5,
      }, 'offset'), propsProductId)).toBe(true);
      expect(hasMoreReviews(buildState({
        reviews: [1, 2],
        totalReviewCount: 2,
      }, 'offset'), propsProductId)).toBe(false);
      expect(hasMoreReviews(buildState({
        reviews: [1, 2],
        totalReviewCount: null,
        after: 'next',
      }, 'offset'), propsProductId)).toBe(false);
    });

    it('should behave like offset pagination while the pagination type is unknown', () => {
      expect(hasMoreReviews(buildState({
        reviews: [1, 2],
        totalReviewCount: 5,
      }), propsProductId)).toBe(true);
    });

    it('should depend on the stored cursor with cursor pagination', () => {
      expect(hasMoreReviews(buildState({
        reviews: [1, 2],
        totalReviewCount: null,
        after: 'next',
      }, 'cursor'), propsProductId)).toBe(true);
      expect(hasMoreReviews(buildState({
        reviews: [1, 2],
        totalReviewCount: 5,
        after: null,
      }, 'cursor'), propsProductId)).toBe(false);
    });
  });

  describe('review list query', () => {
    /**
     * @param {Object} [collection] The list collection.
     * @returns {Object}
     */
    const buildState = (collection) => {
      const state = _.cloneDeep(finalState);
      if (collection) {
        state.reviews.reviewsByHash[existingHash] = collection;
      } else {
        delete state.reviews.reviewsByHash[existingHash];
      }
      return state;
    };

    /**
     * @param {Object} state The state.
     * @returns {Object} The requested sort and filters and whether the query changed.
     */
    const getQuery = state => ({
      sort: getReviewListSort(state, propsProductId),
      filters: getReviewListFilters(state, propsProductId),
      changed: isReviewListQueryChanged(state, propsProductId),
    });

    it('should use the defaults for a list that was not requested yet', () => {
      expect(getQuery(buildState())).toEqual({
        sort: 'dateDesc',
        filters: {},
        changed: false,
      });
    });

    it('should not report a change for a loaded list, a refresh or a later page', () => {
      const loaded = {
        reviews: [1, 2],
        sort: 'rateDesc',
        filters: { filterMedia: true },
        requestSort: 'rateDesc',
        requestFilters: { filterMedia: true },
        requestOffset: 0,
      };

      expect(getQuery(buildState(loaded))).toEqual({
        sort: 'rateDesc',
        filters: { filterMedia: true },
        changed: false,
      });
      expect(getQuery(buildState({
        ...loaded,
        isFetching: true,
      })).changed).toBe(false);
      expect(getQuery(buildState({
        ...loaded,
        isFetching: true,
        requestOffset: 2,
      })).changed).toBe(false);
    });

    it('should report a change while the first page of another sort is requested and after it failed', () => {
      const changing = {
        reviews: [1, 2],
        sort: 'dateDesc',
        requestSort: 'rateDesc',
        requestOffset: 0,
        isFetching: true,
      };

      expect(getQuery(buildState(changing))).toEqual({
        sort: 'rateDesc',
        filters: {},
        changed: true,
      });
      expect(getQuery(buildState({
        ...changing,
        isFetching: false,
        expires: 0,
      })).changed).toBe(true);
    });

    it('should report a change when only the media filter differs', () => {
      expect(getQuery(buildState({
        reviews: [1, 2],
        sort: 'dateDesc',
        requestSort: 'dateDesc',
        requestFilters: { filterMedia: true },
        requestOffset: 0,
      }))).toEqual({
        sort: 'dateDesc',
        filters: { filterMedia: true },
        changed: true,
      });

      expect(getQuery(buildState({
        reviews: [1, 2],
        sort: 'dateDesc',
        filters: { filterMedia: true },
        requestSort: 'dateDesc',
        requestFilters: {
          filterMedia: true,
          filterVerified: true,
        },
        requestOffset: 0,
      })).changed).toBe(true);
    });
  });
});
