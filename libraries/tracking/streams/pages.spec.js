import configureStore from 'redux-mock-store';
import middleware from '@shopgate/pwa-common/store/middelwares/streams';
import { routeDidEnter } from '@shopgate/pwa-common/action-creators/router';
import { setPWAVisibleState } from '../helpers';
import { pwaDidAppear } from '../action-creators';
import {
  blacklistedPaths,
  pagesAreReady$,
} from './pages';

let mockedPattern;
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({ pattern: mockedPattern }));

const mockedStore = configureStore([middleware]);
const store = mockedStore();

describe('Page streams', () => {
  const { dispatch } = store;
  let pagesAreReadySubscriber;

  beforeEach(() => {
    jest.clearAllMocks();
    store.clearActions();
    mockedPattern = '';
    pagesAreReadySubscriber = jest.fn();
    pagesAreReady$.subscribe(pagesAreReadySubscriber);
  });

  describe('pagesAreReady$', () => {
    beforeEach(() => {
      setPWAVisibleState(true);
    });

    it('should emit when a route is active which is not blacklisted', () => {
      const pattern = '/somepath';
      dispatch(routeDidEnter({
        pattern,
      }));

      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when a blacklisted route is active', () => {
      const pattern = blacklistedPaths[0];
      dispatch(routeDidEnter({
        pattern,
      }));

      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when a route is active, but the PWA is not visible', () => {
      setPWAVisibleState(false);

      const pattern = '/somepath';
      dispatch(routeDidEnter({
        pattern,
      }));

      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('coming back from legacy pages', () => {
    it('should emit when pwaDidAppear is dispatched and a not blacklisted route is active', () => {
      mockedPattern = '/somepath';
      dispatch(pwaDidAppear());
      expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when pwaDidAppear is dispatched and a blacklisted is active', () => {
      [mockedPattern] = blacklistedPaths;
      dispatch(pwaDidAppear());
      expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
    });
  });
});
