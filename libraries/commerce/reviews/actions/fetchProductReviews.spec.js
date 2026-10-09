import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import {
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
} from '../constants';
import fetchProductReviews from './fetchProductReviews';

let mockedResolver;

jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
    mockedResolver(mockInstance, resolve, reject);
  })
);

/**
 * @returns {Object}
 */
const getState = () => ({
  reviews: {
    reviewsByProductId: {},
  },
});

describe('Reviews actions: fetchProductReviews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch request and receive with the request metadata', async () => {
    mockedResolver = (mockInstance, resolve) => resolve({
      reviews: [],
      totalReviewCount: 0,
    });
    const dispatch = jest.fn();

    await fetchProductReviews('foo', 2)(dispatch, getState);

    const [[requestAction]] = dispatch.mock.calls;
    expect(requestAction).toEqual({
      type: REQUEST_PRODUCT_REVIEWS,
      productId: 'foo',
      limit: 2,
      requestId: expect.any(Number),
      sort: 'relevance',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: RECEIVE_PRODUCT_REVIEWS,
      productId: 'foo',
      reviews: [],
      totalReviewCount: 0,
      requestId: requestAction.requestId,
      sort: 'relevance',
    });
  });

  it('should pass the returned summary on with the received reviews', async () => {
    const summary = {
      average: 69,
      count: 35,
    };
    mockedResolver = (mockInstance, resolve) => resolve({
      reviews: [],
      totalReviewCount: 35,
      ratingSummary: summary,
    });
    const dispatch = jest.fn();

    await fetchProductReviews('foo', 2)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: RECEIVE_PRODUCT_REVIEWS,
      productId: 'foo',
      summary,
    }));
  });

  it('should skip the request while cached preview reviews are still valid', async () => {
    const dispatch = jest.fn();

    const result = await fetchProductReviews('foo', 2)(dispatch, () => ({
      reviews: {
        reviewsByProductId: {
          foo: {
            isFetching: false,
            expires: Date.now() + 100000,
            reviews: [],
          },
        },
      },
    }));

    expect(result).toBeNull();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch the error with the request id on failure', async () => {
    mockedResolver = (mockInstance, resolve, reject) => reject(new Error('failed'));
    const dispatch = jest.fn();

    await fetchProductReviews('foo', 2)(dispatch, getState).catch(() => undefined);
    await Promise.resolve();

    const [[requestAction]] = dispatch.mock.calls;
    expect(dispatch).toHaveBeenCalledWith({
      type: ERROR_PRODUCT_REVIEWS,
      productId: 'foo',
      requestId: requestAction.requestId,
      sort: 'relevance',
    });
  });
});
