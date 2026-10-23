import {
  RECEIVE_REVIEWS,
  REQUEST_REVIEWS,
  ERROR_REVIEWS,
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
  REQUEST_USER_REVIEW,
  RECEIVE_USER_REVIEW,
  ERROR_USER_REVIEW,
  REQUEST_SUBMIT_REVIEW,
  RECEIVE_SUBMIT_REVIEW,
  ERROR_SUBMIT_REVIEW,
  RESET_SUBMIT_REVIEW,
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
          expires: 0,
          isFetching: true,
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
  describe('ReviewsByHash request tracking', () => {
    const hash = 'bar';

    /**
     * @param {Object} state The current state.
     * @param {Object} meta Request metadata.
     * @returns {Object}
     */
    const request = (state, meta) => reducers(state, {
      type: REQUEST_REVIEWS,
      hash,
      ...meta,
    });

    /**
     * @param {Object} state The current state.
     * @param {Object} meta Request metadata.
     * @param {Array} reviews The received reviews.
     * @param {number} count The total review count.
     * @returns {Object}
     */
    const receive = (state, meta, reviews, count = totalReviewCount) => reducers(state, {
      type: RECEIVE_REVIEWS,
      hash,
      reviews,
      totalReviewCount: count,
      ...meta,
    });

    it('should replace the collection with a successful first page', () => {
      const first = {
        requestId: 1,
        offset: 0,
        sort: 'dateDesc',
      };
      let state = receive(request({}, first), first, mockedReviews);
      const next = {
        requestId: 2,
        offset: 0,
        sort: 'dateDesc',
      };
      state = receive(request(state, next), next, moreMockedReviews);

      expect(state.reviewsByHash[hash].reviews)
        .toEqual(moreMockedReviews.map(review => review.id));
      expect(state.reviewsByHash[hash].sort).toBe('dateDesc');
    });

    it('should append a later page with the same sort without duplicates', () => {
      const first = {
        requestId: 1,
        offset: 0,
        sort: 'dateDesc',
      };
      let state = receive(request({}, first), first, mockedReviews);
      const next = {
        requestId: 2,
        offset: mockedReviews.length,
        sort: 'dateDesc',
      };
      state = receive(request(state, next), next, [...mockedReviews, ...moreMockedReviews]);

      expect(state.reviewsByHash[hash].reviews)
        .toEqual([...mockedReviews, ...moreMockedReviews].map(review => review.id));
    });

    it('should not append a later page with another sort', () => {
      const first = {
        requestId: 1,
        offset: 0,
        sort: 'dateDesc',
      };
      let state = receive(request({}, first), first, mockedReviews);
      const next = {
        requestId: 2,
        offset: mockedReviews.length,
        sort: 'rateDesc',
      };
      state = receive(request(state, next), next, moreMockedReviews);

      expect(state.reviewsByHash[hash].reviews).toEqual(mockedReviews.map(review => review.id));
      expect(state.reviewsByHash[hash].sort).toBe('dateDesc');
      expect(state.reviewsByHash[hash].isFetching).toBe(false);
      expect(state.reviewsByHash[hash].expires).toBeGreaterThan(0);
    });

    it('should accept an opaque sort string set by an extension', () => {
      const sort = JSON.stringify({
        sort: 'dateDesc',
        filter: 5,
      });
      const first = {
        requestId: 1,
        offset: 0,
        sort,
      };
      let state = receive(request({}, first), first, mockedReviews);
      const next = {
        requestId: 2,
        offset: mockedReviews.length,
        sort,
      };
      state = receive(request(state, next), next, moreMockedReviews);

      expect(state.reviewsByHash[hash].reviews)
        .toEqual([...mockedReviews, ...moreMockedReviews].map(review => review.id));
      expect(state.reviewsByHash[hash].sort).toBe(sort);
    });

    it('should not append a later page when no sort is stored yet', () => {
      const meta = {
        requestId: 1,
        offset: 10,
        sort: 'dateDesc',
      };
      const state = receive(request({}, meta), meta, mockedReviews);

      expect(state.reviewsByHash[hash].reviews).toBeUndefined();
      expect(state.reviewsByHash[hash].isFetching).toBe(false);
      expect(state.reviewsByHash[hash].expires).toBe(0);
    });

    it('should ignore an error for a collection removed by an app reset', () => {
      const state = reducers({}, {
        type: ERROR_REVIEWS,
        hash,
        requestId: 1,
      });

      expect(state.reviewsByHash[hash]).toBeUndefined();
    });

    it('should ignore responses and errors of superseded requests', () => {
      const first = {
        requestId: 1,
        offset: 0,
        sort: 'dateDesc',
      };
      const next = {
        requestId: 2,
        offset: 0,
        sort: 'rateDesc',
      };
      let state = request(request({}, first), next);
      state = receive(state, first, mockedReviews);

      expect(state.reviewsByHash[hash].reviews).toBeUndefined();
      expect(state.reviewsByHash[hash].isFetching).toBe(true);

      state = reducers(state, {
        type: ERROR_REVIEWS,
        hash,
        ...first,
      });
      expect(state.reviewsByHash[hash].isFetching).toBe(true);

      state = receive(state, next, moreMockedReviews);
      expect(state.reviewsByHash[hash].reviews)
        .toEqual(moreMockedReviews.map(review => review.id));
      expect(state.reviewsByHash[hash].sort).toBe('rateDesc');
    });

    it('should ignore a response for a collection removed by an app reset', () => {
      const meta = {
        requestId: 1,
        offset: 0,
        sort: 'dateDesc',
      };
      const state = receive({}, meta, mockedReviews);

      expect(state.reviewsByHash[hash]).toBeUndefined();
    });

    it('should keep a total review count of zero', () => {
      const meta = {
        requestId: 1,
        offset: 0,
        sort: 'dateDesc',
      };
      const state = receive(request({}, meta), meta, [], 0);

      expect(state.reviewsByHash[hash].totalReviewCount).toBe(0);
      expect(state.reviewsByHash[hash].reviews).toEqual([]);
    });

    it('should store null when the total review count is missing', () => {
      const meta = {
        requestId: 1,
        offset: 0,
        sort: 'dateDesc',
      };
      const state = reducers(request({}, meta), {
        type: RECEIVE_REVIEWS,
        hash,
        reviews: mockedReviews,
        ...meta,
      });

      expect(state.reviewsByHash[hash].totalReviewCount).toBeNull();
    });
  });
  describe('ReviewsByProductId request tracking', () => {
    /**
     * @param {Object} state The current state.
     * @param {Object} meta Request metadata.
     * @returns {Object}
     */
    const request = (state, meta) => reducers(state, {
      type: REQUEST_PRODUCT_REVIEWS,
      productId: 'foo',
      ...meta,
    });

    it('should ignore responses and errors of superseded requests', () => {
      let state = request(request({}, { requestId: 1 }), { requestId: 2 });
      state = reducers(state, {
        type: RECEIVE_PRODUCT_REVIEWS,
        productId: 'foo',
        reviews: mockedReviews,
        totalReviewCount,
        requestId: 1,
      });
      state = reducers(state, {
        type: ERROR_PRODUCT_REVIEWS,
        productId: 'foo',
        requestId: 1,
      });

      expect(state.reviewsByProductId.foo.reviews).toBeUndefined();
      expect(state.reviewsByProductId.foo.isFetching).toBe(true);
    });

    it('should ignore a response for a product removed by an app reset', () => {
      const state = reducers({}, {
        type: RECEIVE_PRODUCT_REVIEWS,
        productId: 'foo',
        reviews: mockedReviews,
        totalReviewCount,
        requestId: 1,
      });

      expect(state.reviewsByProductId.foo).toBeUndefined();
    });

    it('should ignore an error for a product removed by an app reset', () => {
      const state = reducers({}, {
        type: ERROR_PRODUCT_REVIEWS,
        productId: 'foo',
        requestId: 1,
      });

      expect(state.reviewsByProductId.foo).toBeUndefined();
    });

    it('should keep a total review count of zero and store the sort', () => {
      let state = request({}, {
        requestId: 1,
        sort: 'relevance',
      });
      state = reducers(state, {
        type: RECEIVE_PRODUCT_REVIEWS,
        productId: 'foo',
        reviews: [],
        totalReviewCount: 0,
        requestId: 1,
        sort: 'relevance',
      });

      expect(state.reviewsByProductId.foo.totalReviewCount).toBe(0);
      expect(state.reviewsByProductId.foo.sort).toBe('relevance');
    });
  });
  describe('ReviewsById', () => {
    it('should not store a submitted review without an id', () => {
      const state = reducers({}, {
        type: RECEIVE_SUBMIT_REVIEW,
        review: {
          productId: 'foo',
          rate: 80,
        },
      });

      expect(state.reviewsById).toEqual({});
    });

    it('should not store a user review without an id', () => {
      const state = reducers({}, {
        type: RECEIVE_USER_REVIEW,
        productId: 'foo',
        review: {
          rate: 80,
        },
      });

      expect(state.reviewsById).toEqual({});
    });
  });
  describe('userReviewsByProductId', () => {
    let state = {};
    const review = {
      id: 'id',
      one: 1,
      two: {},
    };
    const reviewWithProductId = {
      ...review,
      productId: 'foo',
    };
    describe(REQUEST_USER_REVIEW, () => {
      it('should handle request state', () => {
        state = reducers(state, {
          type: REQUEST_USER_REVIEW,
          productId: 'foo',
        });
        expect(state.userReviewsByProductId.foo.isFetching).toBe(true);
        expect(state.userReviewsByProductId.foo.review).toEqual('');
      });
    });
    describe(RECEIVE_USER_REVIEW, () => {
      it('should handle receive state', () => {
        state = reducers(state, {
          type: RECEIVE_USER_REVIEW,
          productId: 'foo',
          review,
        });
        expect(state.userReviewsByProductId.foo.isFetching).toBe(false);
        expect(state.userReviewsByProductId.foo.review).toEqual('id');
      });
    });
    describe(ERROR_USER_REVIEW, () => {
      it('should handle receive state', () => {
        state = reducers(state, {
          type: ERROR_USER_REVIEW,
          productId: 'foo',
        });
        expect(typeof state.userReviewsByProductId.foo).toBe('undefined');
      });
    });
    describe(RECEIVE_USER_REVIEW, () => {
      it('should handle receive state', () => {
        state = reducers(state, {
          type: RECEIVE_USER_REVIEW,
          productId: 'foo',
          review: reviewWithProductId,
        });
        expect(state.userReviewsByProductId.foo.isFetching).toBe(false);
        expect(state.userReviewsByProductId.foo.review).toEqual('id');
      });
    });
    describe(REQUEST_SUBMIT_REVIEW, () => {
      it('should handle request state', () => {
        state = reducers(state, {
          type: REQUEST_SUBMIT_REVIEW,
          review: {
            ...review,
            productId: 'foo',
          },
        });
        expect(state.userReviewsByProductId.foo.isFetching).toBe(true);
        expect(state.userReviewsByProductId.foo.review).toEqual('id');
      });
    });
    describe(RECEIVE_SUBMIT_REVIEW, () => {
      it('should handle receive state', () => {
        reviewWithProductId.one = 'one';
        state = reducers(state, {
          type: RECEIVE_SUBMIT_REVIEW,
          review: reviewWithProductId,
        });

        expect(state.userReviewsByProductId.foo.isFetching).toBe(false);
        expect(state.userReviewsByProductId.foo.review).toEqual('id');
        expect(state.reviewsById[reviewWithProductId.id]).toEqual(reviewWithProductId);
      });
    });
    describe(ERROR_SUBMIT_REVIEW, () => {
      it('should handle receive state', () => {
        state = reducers(state, {
          type: ERROR_SUBMIT_REVIEW,
          productId: 'foo',
        });
        expect(typeof state.userReviewsByProductId.foo).toBe('undefined');
      });
    });
    describe(RESET_SUBMIT_REVIEW, () => {
      it('should handle receive state', () => {
        state = reducers(state, {
          type: RESET_SUBMIT_REVIEW,
          productId: 'foo',
          review: {
            productId: 'foo',
            one: '1',
          },
        });
        expect(state.userReviewsByProductId.foo.isFetching).toBe(false);
        expect(state.userReviewsByProductId.foo).toEqual({
          isFetching: false,
        });
      });
    });
  });
});
