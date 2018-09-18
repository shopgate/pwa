import configureStore from 'redux-mock-store';
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
 * Creates a mocked store.
 * @param {string} pathname The pathname for the state.
 * @param {boolean} hasFavorites Tells if products are on the favorite list.
 * @return {Object}
 */
const createMockedStore = (pathname = FAVORITES_PATH, hasFavorites = true) => {
  const mockStore = configureStore();

  const mockedState = {
    history: {
      pathname,
    },
    favorites: {
      products: {
        ids: hasFavorites ? ['one', 'two'] : [],
      },
    },
  };

  return mockStore(mockedState);
};

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

    let stream;
    let callback;

    beforeAll(() => {
      [stream, callback] = mockedSubscribe.mock.calls[0];
    });

    it('should be initialized as expected', () => {
      expect(stream).toEqual(favoritesWillRemoveItem$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should show a toast message when the favorites page is active', () => {
      const store = createMockedStore(FAVORITES_PATH, true);
      const { getState } = store;
      // The mock-store dispatch can't be use here since it can't handle the dispatched action.
      const dispatch = jest.fn();

      callback({
        dispatch,
        getState,
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
      const { dispatch, getState, getActions } = createMockedStore('/somepath', true);

      callback({
        dispatch,
        getState,
        action,
      });

      jest.runAllTimers();

      expect(getActions()).toHaveLength(0);
    });
  });

  describe('favoritesDidUpdate$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [stream, callback] = mockedSubscribe.mock.calls[1];
    });

    it('should be initialized as expected', () => {
      expect(stream).toEqual(favoritesDidUpdate$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should show the tabbar on the favorites route when products are on the list', () => {
      const { dispatch, getState, getActions } = createMockedStore(FAVORITES_PATH, true);

      callback({
        dispatch,
        getState,
      });

      const actions = getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(showTabBar());
    });

    it('should hide the tabbar on the favorites route when the list is empty', () => {
      const { dispatch, getState, getActions } = createMockedStore(FAVORITES_PATH, false);

      callback({
        dispatch,
        getState,
      });

      const actions = getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(hideTabBar(false));
    });

    it('should not update the tabbar visiblity if the favorites route is not active', () => {
      const { dispatch, getState, getActions } = createMockedStore('/somepath', true);

      callback({
        dispatch,
        getState,
      });

      expect(getActions()).toHaveLength(0);
    });
  });

  describe('routeDidEnter', () => {
    let callback;

    beforeAll(() => {
      [, callback] = mockedSubscribe.mock.calls[2];
    });

    it('should be initialized as expected', () => {
      expect(callback).toBeInstanceOf(Function);
    });

    it('should show the tabbar on the favorites route when products are on the list', () => {
      const { dispatch, getState, getActions } = createMockedStore(FAVORITES_PATH, true);

      callback({
        dispatch,
        getState,
      });

      const actions = getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(showTabBar());
    });

    it('should hide the tabbar on the favorites route when the list is empty', () => {
      const { dispatch, getState, getActions } = createMockedStore(FAVORITES_PATH, false);

      callback({
        dispatch,
        getState,
      });

      const actions = getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(hideTabBar());
    });
  });

  describe('routeDidLeave', () => {
    let callback;

    beforeAll(() => {
      [, callback] = mockedSubscribe.mock.calls[3];
    });

    it('should be initialized as expected', () => {
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dismiss the toast and show the tabbar again', () => {
      const { dispatch, getActions } = createMockedStore(FAVORITES_PATH, true);

      callback({
        dispatch,
      });

      const actions = getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual(dismissToasts());
      expect(actions[1]).toEqual(showTabBar());
    });
  });
});
/* eslint-enable prefer-destructuring */
