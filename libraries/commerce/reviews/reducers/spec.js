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
