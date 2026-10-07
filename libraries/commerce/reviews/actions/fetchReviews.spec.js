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
 * @param {string} [paginationType] The pagination type from the review settings.
 * @returns {Function}
 */
const createGetState = (collection, paginationType) => () => ({
  reviews: {
    reviewsByHash: collection ? { [hash]: collection } : {},
    reviewSettings: paginationType ? { paginationType } : {},
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

  describe('request input', () => {
    let input;

    beforeEach(() => {
      input = undefined;
      mockedResolver = (mockInstance, resolve) => {
        ({ input } = mockInstance);
        resolve({
          reviews: [{ id: 'b' }],
          totalReviewCount: 30,
          cursors: { after: 'next' },
        });
      };
    });

    it('should request a first page without offset and cursor in every mode', async () => {
      await fetchReviews('foo', 10, 0)(jest.fn(), createGetState());
      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
      });

      await fetchReviews('foo', 10, 0)(jest.fn(), createGetState(undefined, 'offset'));
      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
      });

      await fetchReviews('foo', 10, 0)(jest.fn(), createGetState({
        after: 'stored',
        sort: 'dateDesc',
      }, 'cursor'));
      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
      });
    });

    it('should send the offset for a later page with offset pagination', async () => {
      await fetchReviews('foo', 10, 20)(jest.fn(), createGetState({ after: 'stored' }, 'offset'));

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
        offset: 20,
      });
    });

    it('should send the offset for a later page while the pagination type is unknown', async () => {
      await fetchReviews('foo', 10, 20)(jest.fn(), createGetState({ after: 'stored' }));

      expect(input).toEqual(expect.objectContaining({ offset: 20 }));
      expect(input).not.toHaveProperty('after');
    });

    it('should send the stored cursor instead of the offset with cursor pagination', async () => {
      const dispatch = jest.fn();

      await fetchReviews('foo', 10, 20)(dispatch, createGetState({
        after: 'stored',
        sort: 'dateDesc',
      }, 'cursor'));

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
        after: 'stored',
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: REQUEST_REVIEWS,
        offset: 20,
      }));
    });

    it('should request the first page when a later page has no cursor to continue from', async () => {
      const dispatch = jest.fn();

      await fetchReviews('foo', 10, 20)(dispatch, createGetState({
        after: null,
        sort: 'dateDesc',
      }, 'cursor'));

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: REQUEST_REVIEWS,
        offset: 0,
      }));
    });

    it('should request the first page when the stored cursor belongs to another sort', async () => {
      const dispatch = jest.fn();

      await fetchReviews('foo', 10, 20, 'rateDesc')(dispatch, createGetState({
        after: 'stored',
        sort: 'dateDesc',
      }, 'cursor'));

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'rateDesc',
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: REQUEST_REVIEWS,
        offset: 0,
        sort: 'rateDesc',
      }));
    });

    it('should treat an empty cursor as no cursor', async () => {
      await fetchReviews('foo', 10, 20)(jest.fn(), createGetState({
        after: '',
        sort: 'dateDesc',
      }, 'cursor'));

      expect(input).not.toHaveProperty('after');
      expect(input).not.toHaveProperty('offset');
    });

    it('should skip an identical next page request that is still in flight', async () => {
      const dispatch = jest.fn();

      const result = await fetchReviews('foo', 10, 20)(dispatch, createGetState({
        after: 'stored',
        sort: 'dateDesc',
        isFetching: true,
        requestOffset: 20,
        requestSort: 'dateDesc',
      }, 'cursor'));

      expect(result).toBeNull();
      expect(input).toBeUndefined();
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should not send a next page while the first page of another sort is in flight', async () => {
      const dispatch = jest.fn();

      const result = await fetchReviews('foo', 10, 20, 'rateDesc')(dispatch, createGetState({
        after: 'stored',
        sort: 'dateDesc',
        isFetching: true,
        requestOffset: 0,
        requestSort: 'rateDesc',
      }, 'cursor'));

      expect(result).toBeNull();
      expect(input).toBeUndefined();
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should send the media filter only when it is set and record it with the request', async () => {
      const dispatch = jest.fn();

      await fetchReviews('foo', 10, 0, 'rateDesc', { filterMedia: true })(dispatch, createGetState());

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'rateDesc',
        filterMedia: true,
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: REQUEST_REVIEWS,
        sort: 'rateDesc',
        filters: { filterMedia: true },
      }));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: RECEIVE_REVIEWS,
        filters: { filterMedia: true },
      }));

      await fetchReviews('foo', 10, 0, 'rateDesc', { filterMedia: false })(dispatch, createGetState());

      expect(input).not.toHaveProperty('filterMedia');
    });

    it('should send a request whose media filter differs from the one in flight', async () => {
      const dispatch = jest.fn();

      await fetchReviews('foo', 10, 0, 'dateDesc', { filterMedia: true })(dispatch, createGetState({
        isFetching: true,
        requestOffset: 0,
        requestSort: 'dateDesc',
      }));

      expect(input).toEqual(expect.objectContaining({ filterMedia: true }));
    });

    it('should send an unfiltered request while a filtered one is in flight', async () => {
      await fetchReviews('foo', 10, 0)(jest.fn(), createGetState({
        isFetching: true,
        requestOffset: 0,
        requestSort: 'dateDesc',
        requestFilters: { filterMedia: true },
      }));

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
      });
    });

    it('should skip an identical filtered request that is still in flight', async () => {
      const dispatch = jest.fn();

      const result = await fetchReviews('foo', 10, 0, 'dateDesc', { filterMedia: true })(dispatch, createGetState({
        isFetching: true,
        requestOffset: 0,
        requestSort: 'dateDesc',
        requestFilters: { filterMedia: true },
      }));

      expect(result).toBeNull();
      expect(input).toBeUndefined();
    });

    it('should request the first page when the stored cursor belongs to another filter', async () => {
      await fetchReviews('foo', 10, 20, 'dateDesc', { filterMedia: true })(jest.fn(), createGetState({
        after: 'stored',
        sort: 'dateDesc',
      }, 'cursor'));

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
        filterMedia: true,
      });
    });

    it('should continue a filtered list with its cursor', async () => {
      await fetchReviews('foo', 10, 20, 'dateDesc', { filterMedia: true })(jest.fn(), createGetState({
        after: 'stored',
        sort: 'dateDesc',
        filters: { filterMedia: true },
      }, 'cursor'));

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
        after: 'stored',
        filterMedia: true,
      });
    });

    it('should send every active filter and leave out inactive and unknown ones', async () => {
      const dispatch = jest.fn();

      await fetchReviews('foo', 10, 0, 'dateDesc', {
        filterMedia: true,
        filterVerified: true,
        filterUnknown: true,
      })(dispatch, createGetState());

      expect(input).toEqual({
        productId: 'foo',
        limit: 10,
        sort: 'dateDesc',
        filterMedia: true,
        filterVerified: true,
      });
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: REQUEST_REVIEWS,
        filters: {
          filterMedia: true,
          filterVerified: true,
        },
      }));
    });

    it('should send a request whose filters differ from the ones in flight', async () => {
      await fetchReviews('foo', 10, 0, 'dateDesc', { filterVerified: true })(
        jest.fn(),
        createGetState({
          isFetching: true,
          requestOffset: 0,
          requestSort: 'dateDesc',
          requestFilters: { filterMedia: true },
        })
      );

      expect(input).toEqual(expect.objectContaining({ filterVerified: true }));
      expect(input).not.toHaveProperty('filterMedia');
    });

    it('should continue with the cursor only when all filters match the stored list', async () => {
      const stored = {
        after: 'stored',
        sort: 'dateDesc',
        filters: {
          filterMedia: true,
          filterVerified: true,
        },
      };

      await fetchReviews('foo', 10, 20, 'dateDesc', {
        filterMedia: true,
        filterVerified: true,
      })(jest.fn(), createGetState(stored, 'cursor'));
      expect(input).toEqual(expect.objectContaining({ after: 'stored' }));

      await fetchReviews('foo', 10, 20, 'dateDesc', { filterMedia: true })(
        jest.fn(),
        createGetState(stored, 'cursor')
      );
      expect(input).not.toHaveProperty('after');
      expect(input).not.toHaveProperty('filterVerified');
    });

    it('should pass the returned cursor on with the received reviews', async () => {
      const dispatch = jest.fn();

      await fetchReviews('foo', 10, 0)(dispatch, createGetState(undefined, 'cursor'));

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: RECEIVE_REVIEWS,
        after: 'next',
      }));
    });
  });
});
