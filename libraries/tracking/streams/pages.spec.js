import { createMockStore } from '@shopgate/pwa-common/store';
import { routeDidEnter } from '@shopgate/pwa-common/action-creators/router';
import { setPWAVisibleState } from '../helpers';
import { pwaDidAppear } from '../action-creators';
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
    ({ dispatch } = createMockStore());

    pagesAreReadySubscriber = jest.fn();
    pagesAreReady$.subscribe(pagesAreReadySubscriber);
  });

  describe('pagesAreReady$', () => {
    beforeEach(() => {
      setPWAVisibleState(true);
    });

    it('should emit when a route is active which is not blacklisted', () => {
      dispatch(routeDidEnterWrapped('/somepath'));
      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when a blacklisted route is active', () => {
      dispatch(routeDidEnterWrapped(blacklistedPatterns[0]));
      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when a route is active, but the PWA is not visible', () => {
      setPWAVisibleState(false);
      dispatch(routeDidEnterWrapped('/somepath'));
      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
    });
  });

  describe('coming back from legacy pages', () => {
    it('should emit when pwaDidAppear is dispatched and a not blacklisted route is active', () => {
      dispatch(routeDidEnterWrapped('/somepath'));
      dispatch(pwaDidAppear());
      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when pwaDidAppear is dispatched and a blacklisted is active', () => {
      dispatch(routeDidEnterWrapped(blacklistedPatterns[0]));
      dispatch(pwaDidAppear());
      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
    });
  });
});
