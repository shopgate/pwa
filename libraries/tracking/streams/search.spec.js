import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import { routeDidEnter } from '@shopgate/pwa-common/action-creators/router';
import { SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import receiveSearchResults from '@shopgate/pwa-common-commerce/search/action-creators/receiveSearchResults';
import { pwaDidAppear } from '@shopgate/pwa-common/action-creators';
import { searchIsReady$ } from './search';

let mockedRoutePattern;
let mockedSearchQuery;
jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: () => ({
    pattern: mockedRoutePattern,
    query: {
      ...(mockedSearchQuery && { s: mockedSearchQuery }),
    },
    state: {},
  }),
  getCurrentPathname: () => ({}),
  getCurrentQuery: () => ({}),
  getRouterStack: () => ({}),
  getCurrentState: () => ({}),
  getCurrentParams: () => ({}),
  getCurrentSearchQuery: () => mockedSearchQuery,
}));

/**
 * A wrapper for the route did enter action creator. Beside returning the action object of the
 * original action creator, it also updates the pattern of the mocked current route.
 * @param {string} pattern The route pattern.
 * @param {string} searchQuery A search query.
 * @return {Object} The dispatched action object.
 */
const routeDidEnterWrapped = (pattern, searchQuery) => {
  mockedRoutePattern = pattern;
  mockedSearchQuery = searchQuery;

  return routeDidEnter({
    pattern,
    query: {
      ...(searchQuery && { s: searchQuery }),
    },
  });
};

describe('Search streams', () => {
  let searchIsReadySubscriber;
  let dispatch;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mockedRoutePattern = '';
    mockedSearchQuery = null;
    ({ dispatch } = createMockStore(combineReducers({ product })));

    searchIsReadySubscriber = jest.fn();
    searchIsReady$.subscribe(searchIsReadySubscriber);
  });

  describe('searchIsReady$', () => {
    describe('search route', () => {
      const searchQuery = 'Search Query';

      it('should emit when the search route is active and search results came in', () => {
        dispatch(routeDidEnterWrapped(SEARCH_PATTERN, searchQuery));
        dispatch(receiveSearchResults());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when search route is active but no search results came in yet', () => {
        dispatch(routeDidEnterWrapped(SEARCH_PATTERN, searchQuery));
        expect(searchIsReadySubscriber).not.toHaveBeenCalled();
      });

      it('should not emit when search results came in but the route is not active', () => {
        dispatch(routeDidEnterWrapped('/some/pattern'));
        dispatch(receiveSearchResults());
        expect(searchIsReadySubscriber).not.toHaveBeenCalled();
      });
    });

    describe('navigating back from legacy pages', () => {
      it('should emit when pwaDidAppear is dispatched and a search route is active', () => {
        mockedRoutePattern = SEARCH_PATTERN;
        dispatch(pwaDidAppear());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when pwaDidAppear is dispatched and no search route is active', () => {
        mockedRoutePattern = '/some/pattern';
        dispatch(pwaDidAppear());
        expect(searchIsReadySubscriber).not.toHaveBeenCalled();
      });
    });
  });
});
