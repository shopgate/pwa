import { ACTION_PUSH } from '@virtuous/conductor';
import { CATEGORY_ALL_PATTERN } from '@shopgate/engage/category';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import { SEARCH_PATTERN } from '../constants';
import subscriptions from './index';

jest.mock('@shopgate/pwa-common/providers', () => ({
  LoadingProvider: {
    setLoading: jest.fn(),
    unsetLoading: jest.fn(),
  },
}));
jest.mock('@shopgate/engage/product', () => ({
  buildFetchSearchResultsParams: jest.fn(() => ({})),
  getProductsResult: jest.fn(() => ({
    hash: 'hash',
    expired: false,
  })),
}));
jest.mock('@shopgate/engage/core', () => ({
  hex2bin: jest.fn(input => input),
  router: { update: jest.fn() },
}));
jest.mock('@shopgate/engage/category', () => ({
  CATEGORY_ALL_PATTERN: '/category/:categoryId/all',
  fetchCategory: jest.fn(),
  getShowAllProductsFilters: jest.fn(),
}));
jest.mock('@shopgate/engage/filter/helpers', () => ({
  buildFilterParamsForFetchFiltersRequest: jest.fn(filters => filters),
}));
jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: jest.fn(),
}));
jest.mock('@shopgate/pwa-common-commerce/product/action-creators/expireProductsByHash', () => jest.fn());
jest.mock('@shopgate/pwa-common-commerce/search/actions/fetchSearchResults', () => jest.fn(() => 'fetchSearchResults'));
jest.mock('@shopgate/pwa-common-commerce/filter/actions/fetchFilters', () => jest.fn(() => 'fetchFilters'));
jest.mock('@shopgate/pwa-common-commerce/category/streams', () => ({
  categoryAllWillEnter$: 'categoryAllWillEnter$',
  categoryAllFiltersDidUpdateFromFilterPage$: 'categoryAllFiltersDidUpdateFromFilterPage$',
}));
jest.mock('../streams', () => ({
  searchWillEnter$: { merge: () => 'searchBasedRouteWillEnter$' },
  searchFiltersDidUpdateFromFilterPage$: { merge: () => 'searchBasedFiltersDidUpdate$' },
  searchRequesting$: 'searchRequesting$',
  searchReceived$: 'searchReceived$',
  searchProductsNeedUpdate$: 'searchProductsNeedUpdate$',
}));

describe('Search subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({}));

  beforeEach(() => {
    jest.clearAllMocks();
    subscriptions(subscribe);
  });

  describe('searchBasedRouteWillEnter$', () => {
    let callback;

    beforeEach(() => {
      [, callback] = subscribe.mock.calls
        .find(([stream]) => stream === 'searchBasedRouteWillEnter$');
    });

    /**
     * Creates a callback payload for the route enter stream.
     * @param {Object} route The route.
     * @returns {Object}
     */
    const createPayload = route => ({
      dispatch,
      getState,
      action: {
        historyAction: ACTION_PUSH,
        route: {
          state: {},
          query: {},
          params: {},
          ...route,
        },
      },
    });

    it('should fetch search results and filters for a search phrase', async () => {
      await callback(createPayload({
        pattern: SEARCH_PATTERN,
        query: { s: 'shoes' },
      }));

      expect(fetchSearchResults).toHaveBeenCalledWith(expect.objectContaining({
        searchPhrase: 'shoes',
      }));
      expect(fetchFilters).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it.each([
      ['an empty', { s: '' }],
      ['a missing', {}],
    ])('should not fetch anything for %s search phrase', async (_, query) => {
      await callback(createPayload({
        pattern: SEARCH_PATTERN,
        query,
      }));

      expect(fetchSearchResults).not.toHaveBeenCalled();
      expect(fetchFilters).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should fetch search results and filters for "show all products" pages', async () => {
      await callback(createPayload({
        pattern: CATEGORY_ALL_PATTERN,
        params: { categoryId: '1234' },
        state: { filters: {} },
      }));

      expect(fetchSearchResults).toHaveBeenCalledWith(expect.objectContaining({
        searchPhrase: '*',
      }));
      expect(fetchFilters).toHaveBeenCalledTimes(1);
    });
  });
});
