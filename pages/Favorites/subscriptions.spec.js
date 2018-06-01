import dismissToasts from '@shopgate/pwa-common/action-creators/toast/dismissToasts';
import { CREATE_TOAST } from '@shopgate/pwa-common/constants/ActionTypes';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import {
  favoritesWillRemoveItem$,
  favoritesDidUpdate$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import {
  showTabBar,
  hideTabBar,
} from 'Components/TabBar/actions';

import subscriptions from './subscriptions';

/**
 * Creates a mocked getState function.
 * @param {string} pathname The pathname for the state.
 * @param {boolean} hasFavorites Tells if products are on the favorite list.
 * @return {Function}
 */
const createMockedGetState = (pathname = FAVORITES_PATH, hasFavorites = true) => () => ({
  history: {
    pathname,
  },
  favorites: {
    products: {
      ids: hasFavorites ? ['one', 'two'] : [],
    },
  },
});

jest.useFakeTimers();

/* eslint-disable prefer-destructuring */
describe('Favorites subscriptions', () => {
  let mockedSubscribe;

  beforeAll(() => {
    mockedSubscribe = jest.fn();
    subscriptions(mockedSubscribe);
  });

  it('should call subscribe as expected', () => {
    expect(mockedSubscribe).toHaveBeenCalledTimes(4);
  });

  describe('favoritesWillRemoveItem$', () => {
    const action = {
      productId: 123,
    };

    let dispatch;
    let stream;
    let callback;

    beforeEach(() => {
      [stream, callback] = mockedSubscribe.mock.calls[0];
      dispatch = jest.fn();
    });

    it('should be initialized as expected', () => {
      expect(stream).toEqual(favoritesWillRemoveItem$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should show a toast message when the favorites page is active', () => {
      callback({
        dispatch,
        getState: createMockedGetState(FAVORITES_PATH, true),
        action,
      });

      jest.runAllTimers();

      expect(dispatch).toHaveBeenCalledTimes(1);
      // Dispatch the actual CREATE_TOAST action
      dispatch.mock.calls[0][0](dispatch);
      expect(dispatch).toHaveBeenCalledTimes(2);
      // Inspect the action payload
      const payload = dispatch.mock.calls[1][0];
      expect(payload).toBeInstanceOf(Object);
      expect(payload.type).toBe(CREATE_TOAST);
      expect(payload.options).toBeInstanceOf(Object);
    });

    it('should not show a toast message when the favorites page is not active', () => {
      callback({
        dispatch,
        getState: createMockedGetState('/somepath', true),
        action,
      });

      jest.runAllTimers();

      expect(dispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('favoritesDidUpdate$', () => {
    let dispatch;
    let stream;
    let callback;

    beforeEach(() => {
      [stream, callback] = mockedSubscribe.mock.calls[1];
      dispatch = jest.fn();
    });

    it('should be initialized as expected', () => {
      expect(stream).toEqual(favoritesDidUpdate$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should show the tabbar on the favorites route when products are on the list', () => {
      callback({
        dispatch,
        getState: createMockedGetState(FAVORITES_PATH, true),
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(showTabBar());
    });

    it('should hide the tabbar on the favorites route when the list is empty', () => {
      callback({
        dispatch,
        getState: createMockedGetState(FAVORITES_PATH, false),
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(hideTabBar(false));
    });

    it('should not update the tabbar visiblity if the favorites route is not active', () => {
      callback({
        dispatch,
        getState: createMockedGetState('/somepath', false),
      });

      expect(dispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('routeDidEnter', () => {
    let dispatch;
    let callback;

    beforeEach(() => {
      [, callback] = mockedSubscribe.mock.calls[2];
      dispatch = jest.fn();
    });

    it('should be initialized as expected', () => {
      expect(callback).toBeInstanceOf(Function);
    });

    it('should show the tabbar on the favorites route when products are on the list', () => {
      callback({
        dispatch,
        getState: createMockedGetState(FAVORITES_PATH, true),
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(showTabBar());
    });

    it('should hide the tabbar on the favorites route when the list is empty', () => {
      callback({
        dispatch,
        getState: createMockedGetState(FAVORITES_PATH, false),
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(hideTabBar());
    });
  });

  describe('routeDidLeave', () => {
    let dispatch;
    let callback;

    beforeEach(() => {
      [, callback] = mockedSubscribe.mock.calls[3];
      dispatch = jest.fn();
    });

    it('should be initialized as expected', () => {
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dismiss the toast and show the tabbar again', () => {
      callback({
        dispatch,
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(dismissToasts());
      expect(dispatch).toHaveBeenCalledWith(showTabBar());
    });
  });
});
/* eslint-enable prefer-destructuring */
