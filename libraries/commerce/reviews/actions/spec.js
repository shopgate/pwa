import { logger } from '@shopgate/pwa-core/helpers';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { EUNKNOWN, EACCESS } from '@shopgate/pwa-core/constants/Pipeline';
import fetchReviews from './fetchReviews';
import fetchProductReviews from './fetchProductReviews';
import fetchUserReview from './fetchUserReview';
import submitReview from './submitReview';
import { finalState } from '../selectors/mock';
import * as pipelines from '../constants/Pipelines';

let mockedResolver;
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
      mockedResolver(mockInstance, resolve, reject);
    })
  )
);

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe.skip('Reviews actions', () => {
  describe('fetchReviews', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should resolve and call appropriate actions', async (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          reviews: [],
          mockInstance,
        });
      };

      const mockedDispatch = jest.fn();

      try {
        const result = await fetchReviews('foo', 2, 1)(mockedDispatch);

        expect(result.mockInstance.name).toBe(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS);
        expect(result.mockInstance.input).toEqual({
          productId: 'foo',
          limit: 2,
          offset: 1,
          sort: 'dateDesc',
        });
        expect(logger.error).toHaveBeenCalledTimes(0);
        expect(mockedDispatch).toHaveBeenCalledTimes(2);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('should fail and call appropriate actions', async (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          mockInstance,
        });
      };

      const mockedDispatch = jest.fn();
      let result;

      try {
        result = await fetchReviews('foo', 2, 1)(mockedDispatch);

        expect(result.mockInstance.name).toBe(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS);
        expect(result.mockInstance.input).toEqual({
          productId: 'foo',
          limit: 2,
          offset: 1,
          sort: 'dateDesc',
        });
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(mockedDispatch).toHaveBeenCalledTimes(2);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('fetchProductReviews', () => {
    /**
     * Assertion helper function
     * @param {string} variant ('then' or 'catch')
     * @param {Function} done Async test case done callback function.
     * @param {Object} state React state.
     */
    const testFetchProductReviews = (variant, done, state) => {
      const mockedDispatch = jest.fn();
      const promise = fetchProductReviews('foo', 10, 'invalidSort')(mockedDispatch, () => state);
      setTimeout(() => {
        promise[variant]((result) => {
          expect(result.mockInstance.name).toBe(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS);
          expect(result.mockInstance.input).toEqual({
            productId: 'foo',
            limit: 10,
            sort: 'invalidSort',
          });
          expect(mockedDispatch).toHaveBeenCalledTimes(2);
          done();
        });
      }, 0);
    };

    it('should resolve and call appropriate actions', async (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          reviews: [],
          mockInstance,
        });
      };

      const mockedDispatch = jest.fn();

      try {
        const result = await fetchProductReviews('foo', 10, 'invalidSort')(mockedDispatch, () => finalState);

        expect(result.mockInstance.name).toBe(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS);
        expect(result.mockInstance.input).toEqual({
          productId: 'foo',
          limit: 10,
          sort: 'invalidSort',
        });
        expect(mockedDispatch).toHaveBeenCalledTimes(2);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('should reject and call appropriate actions', async (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          mockInstance,
        });
      };

      const mockedDispatch = jest.fn();
      let result;

      try {
        result = await fetchProductReviews('foo', 10, 'invalidSort')(mockedDispatch, () => finalState);

        expect(result.mockInstance.name).toBe(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS);
        expect(result.mockInstance.input).toEqual({
          productId: 'foo',
          limit: 10,
          sort: 'invalidSort',
        });
        expect(mockedDispatch).toHaveBeenCalledTimes(2);

        done();
      } catch (err) {
        done(err);
      }

      testFetchProductReviews('catch', done, finalState);
    });
  });

  describe('fetchUserReview', () => {
    /**
     * Assertion helper function
     * @param {string} variant ('then' or 'catch')
     * @param {Function} done Async test case done callback function.
     * @param {Object} state React state.
     */
    const testFetchUserReview = (variant, done, state) => {
      const mockedDispatch = jest.fn();
      const promise = fetchUserReview('foo')(mockedDispatch, () => state);
      setTimeout(() => {
        promise[variant]((result) => {
          expect(result.mockInstance.name).toBe(pipelines.SHOPGATE_USER_GET_REVIEW);
          expect(result.mockInstance.errorBlacklist).toEqual([EUNKNOWN, EACCESS]);
          expect(result.mockInstance.input).toEqual({
            productId: 'foo',
          });
          expect(mockedDispatch).toHaveBeenCalledTimes(2);
          done();
        });
      }, 0);
    };

    it('should resolve and call appropriate actions', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          reviews: [],
          mockInstance,
        });
      };
      testFetchUserReview('then', done, finalState);
    });

    it('should reject and call appropriate actions', (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          mockInstance,
        });
      };
      testFetchUserReview('catch', done, finalState);
    });
  });

  describe('submitReview', () => {
    const testReviewInput = {
      productId: 'foo',
      rate: 10,
      title: ' Title ',
      author: ' Author  ',
      review: 'RRRR   ',
    };
    const testReviewSanitized = {
      productId: 'foo',
      rate: 10,
      title: 'Title',
      author: 'Author',
      review: 'RRRR',
    };
    /**
     * Assertion helper function
     * @param {string} variant ('then' or 'catch')
     * @param {Object} review Review.
     * @param {boolean} update Update.
     * @param {Object} state React state.
     * @param {Function} done Async test case done callback function.
     */
    const testSubmitReview = (variant, review, update, state, done) => {
      const expectedDispatches = variant === 'then' ? 3 : 2;
      const mockedDispatch = jest.fn();
      const promise = submitReview(review, update)(mockedDispatch, () => state);
      setTimeout(() => {
        promise[variant]((result) => {
          expect(result.mockInstance.name).toBe((
            update ?
              pipelines.SHOPGATE_CATALOG_UPDATE_PRODUCT_REVIEW :
              pipelines.SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW
          ));
          expect(result.mockInstance.input).toEqual(testReviewSanitized);
          expect(mockedDispatch).toHaveBeenCalledTimes(expectedDispatches);
          done();
        });
      }, 0);
    };

    it('should resolve and call appropriate actions on update', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          reviews: [],
          mockInstance,
        });
      };
      testSubmitReview('then', testReviewInput, true, finalState, done);
    });

    it('should resolve and call appropriate actions on add', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          reviews: [],
          mockInstance,
        });
      };
      testSubmitReview('then', testReviewInput, false, finalState, done);
    });

    it('should reject and call appropriate actions on add', (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          reviews: [],
          mockInstance,
        });
      };
      testSubmitReview('catch', testReviewInput, false, finalState, done);
    });

    it('should reject and call appropriate actions on update', (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          reviews: [],
          mockInstance,
        });
      };
      testSubmitReview('catch', testReviewInput, true, finalState, done);
    });
  });
});
