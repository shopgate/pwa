import configureStore from 'redux-mock-store';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import {
  enableTabBar,
  disableTabBar,
} from './actions';
import subscriptions from './subscriptions';

/**
 * Creates a mocked store.
 * @return {Object}
 */
const createMockedStore = () => configureStore()({});

describe.skip('TabBar subscriptions', () => {
  let mockedSubscribe;

  beforeAll(() => {
    mockedSubscribe = jest.fn();
    subscriptions(mockedSubscribe);
  });

  it('should call subscribe as expected', () => {
    expect(mockedSubscribe).toHaveBeenCalledTimes(1);
  });

  describe('routeDidEnter$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      // eslint-disable-next-line prefer-destructuring
      [stream, callback] = mockedSubscribe.mock.calls[0];
    });

    it('should be initialized as expected', () => {
      expect(stream).toEqual(routeDidEnter$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should enable the tabbar on a not blacklisted route', () => {
      const { dispatch, getActions } = createMockedStore();
      const pathname = '/somepath';

      callback({
        dispatch,
        pathname,
      });

      const actions = getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(enableTabBar());
    });

    it('should disable the tabbar on a blacklisted route', () => {
      const { dispatch, getActions } = createMockedStore();
      const pathname = LOGIN_PATH;

      callback({
        dispatch,
        pathname,
      });

      const actions = getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(disableTabBar());
    });
  });
});
