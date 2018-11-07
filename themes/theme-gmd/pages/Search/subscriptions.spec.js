/* eslint-disable extra-rules/no-single-line-objects */
import { SORT_RELEVANCE } from '@shopgate/pwa-common/constants/DisplayOptions';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import getSearchResults from '@shopgate/pwa-common-commerce/search/actions/getSearchResults';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';
import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/pwa-common-commerce/search/streams';
import { searchFiltersDidUpdate$ } from './streams';
import subscriptions from './subscriptions';

jest.mock('@shopgate/pwa-common-commerce/filter/actions/getFilters', () =>
  jest.fn().mockReturnValue('getFilters'));

jest.mock('@shopgate/pwa-common-commerce/search/actions/getSearchResults', () =>
  jest.fn().mockReturnValue('getSearchResults'));

jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => jest.fn());

describe('SearchPage subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

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

    it('should dispatch the getSearchResults action', () => {
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

      callback({ dispatch, action });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(getSearchResults());
      expect(getSearchResults).toHaveBeenCalledWith({
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

    it('should dispatch the getSearchResults action', () => {
      const route = {
        query: {
          s: 'Some search phrase',
          sort: SORT_RELEVANCE,
        },
      };

      getCurrentRoute.mockReturnValueOnce(route);

      const action = {
        filters: {
          mocked: 'filters',
        },
      };

      callback({ dispatch, action });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(getSearchResults());
      expect(getSearchResults).toHaveBeenCalledWith({
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

    it('should dispatch the getFilters action', () => {
      callback({ dispatch });
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(getFilters());
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
