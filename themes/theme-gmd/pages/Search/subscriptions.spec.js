/* eslint-disable extra-rules/no-single-line-objects */
import { SORT_RELEVANCE } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/pwa-common-commerce/search/streams';
import { searchFiltersDidUpdate$ } from './streams';
import subscriptions from './subscriptions';

jest.mock('@shopgate/pwa-common-commerce/filter/actions/fetchFilters', () =>
  jest.fn().mockReturnValue('fetchFilters'));

jest.mock('@shopgate/pwa-common-commerce/search/actions/fetchSearchResults', () =>
  jest.fn().mockReturnValue('fetchSearchResults'));

jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: jest.fn(),
}));

jest.mock('@shopgate/engage/product', () => ({
  buildFetchSearchResultsParams: jest.fn(),
}));

describe('SearchPage subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();
  const getState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    subscriptions(subscribe);
  });

  it('should call subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(3);
  });

  describe('searchWillEnter$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [[stream, callback]] = subscribe.mock.calls;
    });

    it('should have been called as expected', () => {
      expect(stream).toBe(searchWillEnter$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch the fetchSearchResults action', () => {
      const action = {
        route: {
          query: {
            s: 'Some search phrase',
            sort: SORT_RELEVANCE,
          },
          state: {
            filters: {
              mocked: 'filters',
            },
          },
        },
      };

      callback({ dispatch, action, getState });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(fetchSearchResults());
      expect(fetchSearchResults).toHaveBeenCalledWith({
        filters: action.route.state.filters,
        searchPhrase: action.route.query.s,
        sort: action.route.query.sort,
      });
    });
  });

  describe('searchFiltersDidUpdate$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [, [stream, callback]] = subscribe.mock.calls;
    });

    it('should have been called as expected', () => {
      expect(stream).toBe(searchFiltersDidUpdate$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch the fetchSearchResults action', () => {
      const route = {
        query: {
          s: 'Some search phrase',
          sort: SORT_RELEVANCE,
        },
      };

      getCurrentRoute.mockReturnValue(route);

      const action = {
        filters: {
          mocked: 'filters',
        },
      };

      callback({ dispatch, action, getState });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(fetchSearchResults());
      expect(fetchSearchResults).toHaveBeenCalledWith({
        filters: action.filters,
        searchPhrase: route.query.s,
        sort: route.query.sort,
      });
    });
  });

  describe('searchDidEnter$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should have been called as expected', () => {
      expect(stream).toBe(searchDidEnter$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch the fetchFilters action', () => {
      callback({ dispatch });
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(fetchFilters());
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
