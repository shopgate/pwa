import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { generateResultHash, mutableActions } from '@shopgate/pwa-common/helpers/redux';
import { REQUEST_REVIEWS, RECEIVE_REVIEWS, ERROR_REVIEWS } from '../constants';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';
import fetchReviews from './fetchReviews';

let mockedResolver;

jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
    mockedResolver(mockInstance, resolve, reject);
  })
);

const hash = generateResultHash({
  pipeline: SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS,
  productId: 'foo',
}, false);

/**
 * @param {Object} [collection] The stored review collection.
 * @returns {Function}
 */
const createGetState = collection => () => ({
  reviews: {
    reviewsByHash: collection ? { [hash]: collection } : {},
  },
});

describe('Reviews actions: fetchReviews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchReviews.reset();
    mockedResolver = (mockInstance, resolve) => resolve({
      reviews: [{ id: 'a' }],
      totalReviewCount: 1,
    });
  });

  it('should dispatch request and receive with the request metadata', async () => {
    const dispatch = jest.fn();

    await fetchReviews('foo', 10, 0)(dispatch, createGetState());

    const [[requestAction], [receiveAction]] = dispatch.mock.calls;
    expect(requestAction).toEqual({
      type: REQUEST_REVIEWS,
      hash,
      requestId: expect.any(Number),
      offset: 0,
      sort: 'dateDesc',
    });
    expect(receiveAction).toEqual({
      type: RECEIVE_REVIEWS,
      hash,
      productId: 'foo',
      reviews: [{ id: 'a' }],
      totalReviewCount: 1,
      requestId: requestAction.requestId,
      offset: 0,
      sort: 'dateDesc',
    });
  });

  it('should use a new request id for every request', async () => {
    const dispatch = jest.fn();

    await fetchReviews('foo', 10, 0)(dispatch, createGetState());
    await fetchReviews('foo', 10, 0)(dispatch, createGetState());

    const requestIds = dispatch.mock.calls
      .filter(([action]) => action.type === REQUEST_REVIEWS)
      .map(([action]) => action.requestId);
    expect(requestIds[1]).toBeGreaterThan(requestIds[0]);
  });

  it('should dispatch the error with the request id on failure', async () => {
    mockedResolver = (mockInstance, resolve, reject) => reject(new Error('failed'));
    const dispatch = jest.fn();

    await fetchReviews('foo', 10, 0)(dispatch, createGetState()).catch(() => undefined);
    await Promise.resolve();

    const [[requestAction]] = dispatch.mock.calls;
    expect(dispatch).toHaveBeenCalledWith({
      type: ERROR_REVIEWS,
      hash,
      requestId: requestAction.requestId,
      offset: 0,
      sort: 'dateDesc',
    });
  });

  it('should skip an identical request that is still in flight', async () => {
    const dispatch = jest.fn();
    const getState = createGetState({
      isFetching: true,
      requestOffset: 10,
      requestSort: 'dateDesc',
    });

    const result = await fetchReviews('foo', 10, 10)(dispatch, getState);

    expect(result).toBeNull();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should send a request that differs from the one in flight', async () => {
    const dispatch = jest.fn();
    const getState = createGetState({
      isFetching: true,
      requestOffset: 10,
      requestSort: 'dateDesc',
    });

    await fetchReviews('foo', 10, 0)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: REQUEST_REVIEWS,
      offset: 0,
    }));
  });

  it('should record the sort that a useBefore hook passes on', async () => {
    const sort = JSON.stringify({
      sort: 'rateDesc',
      filter: 5,
    });
    fetchReviews.useBefore((productId, limit, offset) => (
      mutableActions.next(productId, limit, offset, sort)
    ));
    const dispatch = jest.fn();

    await fetchReviews('foo', 10, 0)(dispatch, createGetState());

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: REQUEST_REVIEWS,
      sort,
    }));
  });
});
