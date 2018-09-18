import { createMockStore } from '@shopgate/pwa-common/store';
import { routeDidEnter, routeDidLeave } from '@shopgate/pwa-common/action-creators/router';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import receiveSearchResults from '@shopgate/pwa-common-commerce/search/action-creators/receiveSearchResults';
import { pwaDidAppear } from '../action-creators';
import { searchIsReady$ } from './search';

let mockedRoutePattern = '';
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({ pattern: mockedRoutePattern }));

/**
 * A wrapper for the route did enter action creator. Beside returning the action object of the
 * original action creator, it also updates the pattern of the mocked current route.
 * @param {string} pattern The route pattern.
 * @return {Object} The dispatched action object.
 */
const routeDidEnterWrapped = (pattern) => {
  mockedRoutePattern = pattern;
  return routeDidEnter({
    pattern,
  });
};

describe('Search streams', () => {
  let searchIsReadySubscriber;
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRoutePattern = '';
    ({ dispatch } = createMockStore());

    searchIsReadySubscriber = jest.fn();
    searchIsReady$.subscribe(searchIsReadySubscriber);
  });

  describe('searchIsReady$', () => {
    describe('search route', () => {
      it('should emit when the search route is active and search results came in', () => {
        dispatch(routeDidLeave('/somepath'));
        dispatch(routeDidEnterWrapped(SEARCH_PATH));
        dispatch(receiveSearchResults());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when search route is active but no search results came in yet', () => {
        dispatch(routeDidEnterWrapped('/somepath'));
        expect(searchIsReadySubscriber).not.toHaveBeenCalled();
      });

      it('should not emit when search results came in but the route is not active', () => {
        dispatch(routeDidEnterWrapped('/somepath'));
        dispatch(receiveSearchResults());
        expect(searchIsReadySubscriber).not.toHaveBeenCalled();
      });
    });

    describe('coming back from legacy pages', () => {
      it('should emit when pwaDidAppear is dispatched and a search path is active', () => {
        mockedRoutePattern = SEARCH_PATH;
        dispatch(pwaDidAppear());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when pwaDidAppear is dispatched and no search path is active', () => {
        mockedRoutePattern = '/somepath';
        dispatch(pwaDidAppear());
        expect(searchIsReadySubscriber).not.toHaveBeenCalled();
      });
    });
  });
});
