import { combineReducers } from 'redux';
import { ACTION_REPLACE } from '@virtuous/conductor';
import { createMockStore } from '@shopgate/pwa-common/store';
import user from '@shopgate/pwa-common/reducers/user';
import { routeDidEnter, navigate } from '@shopgate/pwa-common/action-creators/router';
import { appWillStart } from '@shopgate/pwa-common/action-creators/app';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  pwaDidAppear,
  pwaDidDisappear,
} from '@shopgate/pwa-common/action-creators';
import { blacklistedPatterns, pagesAreReady$ } from './pages';

let mockedPattern;
jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: () => ({
    pattern: mockedPattern,
  }),
}));

/**
 * A wrapper for the route did enter action creator. Beside returning the action object of the
 * original action creator, it also updates the pattern of the mocked current route.
 * @param {string} pattern The route pattern.
 * @return {Object} The dispatched action object.
 */
const routeDidEnterWrapped = (pattern) => {
  mockedPattern = pattern;
  return routeDidEnter({
    pattern,
  });
};

describe('Page streams', () => {
  let pagesAreReadySubscriber;
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedPattern = '';
    ({ dispatch } = createMockStore(combineReducers({ user })));

    pagesAreReadySubscriber = jest.fn();
    pagesAreReady$.subscribe(pagesAreReadySubscriber);
  });

  describe('pagesAreReady$', () => {
    beforeEach(() => {
      // Simulate app is started
      dispatch(appWillStart('/'));
    });

    it('should emit when a route not blacklisted', () => {
      dispatch(routeDidEnterWrapped('/somepath'));
      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when a blacklisted route is active', () => {
      dispatch(routeDidEnterWrapped(blacklistedPatterns[0]));
      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when a route is active, but the PWA is not visible', () => {
      // Simulate pwa is disappear
      dispatch(pwaDidDisappear());

      dispatch(routeDidEnterWrapped('/somepath'));
      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();

      // Simulate pwa is appeared again
      dispatch(pwaDidAppear());
      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
    });
  });

  describe('coming back from legacy pages', () => {
    beforeEach(() => {
      // Simulate app is started
      dispatch(appWillStart('/'));
    });
    it('should emit when PWA is reappear and a not blacklisted route is active', () => {
      dispatch(routeDidEnterWrapped('/somepath'));
      dispatch(pwaDidDisappear());
      dispatch(pwaDidAppear());
      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(2);
    });

    it('should not emit when pwaDidAppear is dispatched and a blacklisted is active', () => {
      dispatch(routeDidEnterWrapped(blacklistedPatterns[0]));
      dispatch(pwaDidDisappear());
      dispatch(pwaDidAppear());
      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
    });
  });

  describe('go to checkout', () => {
    beforeEach(() => {
      // Simulate app is started
      dispatch(appWillStart('/'));
    });
    it('should not emit events when user goes to checkout', () => {
      dispatch(routeDidEnterWrapped('/somepath'));
      dispatch(navigate({
        action: ACTION_REPLACE,
        pathname: CHECKOUT_PATH,
      }));
      // should not track this path
      dispatch(routeDidEnterWrapped('/somepath2'));
      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
    });
  });
});
