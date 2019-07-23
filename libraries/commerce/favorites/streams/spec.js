/* eslint-disable extra-rules/no-single-line-objects */
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import {
  APP_DID_START,
  ROUTE_WILL_ENTER,
  SUCCESS_LOGIN,
  SUCCESS_LOGOUT,
} from '@shopgate/pwa-common/constants/ActionTypes';
import {
  favoritesWillEnter$,
  addProductToFavoritesDebounced$,
  removeProductFromFavoritesDebounced$,
  favoritesError$,
  errorFavoritesLimit$,
  shouldFetchFavorites$,
  shouldFetchFreshFavorites$,
  favoritesDidUpdate$,
  favoritesWillAddItem$,
  favoritesDidAddItem$,
  favoritesWillRemoveItem$,
  favoritesDidRemoveItem$,
  receiveFavorites$,
  favoritesSyncIdle$,
  refreshFavorites$,
  didRequestAddOrRemoveFavorites$,
  didRequestFlushFavoritesBuffer$,
  didReceiveFlushFavoritesBuffer$,
} from './index';

import {
  FAVORITES_PATH,
  RECEIVE_FAVORITES,
  ERROR_FAVORITES,
  ERROR_FETCH_FAVORITES,
  REQUEST_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  FAVORITES_LIMIT_ERROR,
  FAVORITE_ACTION_BUFFER_TIME,
  FAVORITE_BUTTON_DEBOUNCE_TIME,
} from '../constants';
import {
  addProductToFavorites,
  removeProductFromFavorites,
  requestAddFavorites,
  requestRemoveFavorites,
  successAddFavorites,
  successRemoveFavorites,
  receiveFavorites,
  idleSyncFavorites,
  requestFlushFavoritesBuffer,
} from '../action-creators';

// Required for custom runner without env-setup
jest.mock('@shopgate/pwa-core', () => ({
  UIEvents: {
    emit: jest.fn(),
    on: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
}));

describe('Favorites streams', () => {
  const DUMMY_ACTION = 'DUMMY_ACTION';
  let subscriber;

  beforeEach(() => {
    subscriber = jest.fn();
  });

  describe('favoritesWillEnter$', () => {
    it('should call subscribers when the favorites page will open', () => {
      favoritesWillEnter$.subscribe(subscriber);
      mainSubject.next({ action: { type: ROUTE_WILL_ENTER, route: { pattern: FAVORITES_PATH } } });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the path does not match', () => {
      favoritesWillEnter$.subscribe(subscriber);
      mainSubject.next({ action: { type: ROUTE_WILL_ENTER, route: { pattern: '/other_path' } } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });

    it('should not call subscribers when the action does not match', () => {
      favoritesWillEnter$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION, route: { pattern: FAVORITES_PATH } } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('addProductToFavoritesDebounced$', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call subscribers only once, when the action is triggered multiple times', () => {
      jest.useFakeTimers();
      addProductToFavoritesDebounced$.subscribe(subscriber);
      const action = addProductToFavorites('product1');
      mainSubject.next({ action });
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should call subscribers twice, when debounce time has passed', () => {
      jest.useFakeTimers();
      addProductToFavoritesDebounced$.subscribe(subscriber);
      const action = addProductToFavorites('product1');
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should not call subscribers when the action does not match', () => {
      addProductToFavoritesDebounced$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeProductFromFavoritesDebounced$', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call subscribers only once, when the action is triggered multiple times', () => {
      jest.useFakeTimers();
      removeProductFromFavoritesDebounced$.subscribe(subscriber);
      const action = removeProductFromFavorites('product1', true);
      mainSubject.next({ action });
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should call subscribers twice, when debounce time has passed', () => {
      jest.useFakeTimers();
      removeProductFromFavoritesDebounced$.subscribe(subscriber);
      const action = removeProductFromFavorites('product1', true);
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should not call subscribers when the action does not match', () => {
      removeProductFromFavoritesDebounced$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('favoritesError$', () => {
    const actionTypes = [
      ERROR_FETCH_FAVORITES,
      ERROR_ADD_FAVORITES,
      ERROR_REMOVE_FAVORITES,
      ERROR_FAVORITES,
      DUMMY_ACTION, // This should not trigger the subscriber
    ];

    it('should call subscribers for every dispatched favorites error and no others', () => {
      favoritesError$.subscribe(subscriber);
      actionTypes.forEach((type) => {
        mainSubject.next({ action: { type } });
      });
      expect(subscriber).toHaveBeenCalledTimes(4);
    });
  });

  describe('errorFavoritesLimit$', () => {
    it('should call subscribers only for the internal favorites limit error and no others', () => {
      errorFavoritesLimit$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ERROR_FAVORITES,
          error: {
            code: FAVORITES_LIMIT_ERROR,
          },
        },
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      errorFavoritesLimit$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });

    it('should not call subscribers on any other internal favorites error', () => {
      errorFavoritesLimit$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ERROR_FAVORITES,
          error: {
            code: 'SOME_OTHER_CODE',
          },
        },
      });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('shouldFetchFavorites$', () => {
    it('should call subscribers to fetch favorites on every app start and on route enter', () => {
      shouldFetchFavorites$.subscribe(subscriber);
      mainSubject.next({ action: { type: APP_DID_START } });
      mainSubject.next({ action: { type: ROUTE_WILL_ENTER, route: { pattern: FAVORITES_PATH } } });
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should call subscribers on any other action', () => {
      shouldFetchFavorites$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('shouldFetchFreshFavorites$', () => {
    it('should call subscribers to fetch fresh favorites on every login and logout', () => {
      shouldFetchFreshFavorites$.subscribe(subscriber);
      mainSubject.next({ action: { type: SUCCESS_LOGIN } });
      mainSubject.next({ action: { type: SUCCESS_LOGOUT } });
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should call subscribers on any other action', () => {
      shouldFetchFreshFavorites$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('favoritesDidUpdate$', () => {
    const actionTypes = [
      REQUEST_ADD_FAVORITES,
      ERROR_ADD_FAVORITES,
      REQUEST_REMOVE_FAVORITES,
      ERROR_REMOVE_FAVORITES,
      RECEIVE_FAVORITES,
      ERROR_FETCH_FAVORITES,
      DUMMY_ACTION, // This should not trigger the subscriber
    ];

    it('should call subscribers for every dispatched favorites update and no others', () => {
      favoritesDidUpdate$.subscribe(subscriber);
      actionTypes.forEach((type) => {
        mainSubject.next({ action: { type } });
      });
      expect(subscriber).toHaveBeenCalledTimes(6);
    });
  });

  describe('favoritesWillAddItem$', () => {
    it('should call subscribers for every favorite to be added', () => {
      favoritesWillAddItem$.subscribe(subscriber);
      mainSubject.next({ action: requestAddFavorites('product1') });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      favoritesWillAddItem$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('favoritesDidAddItem$', () => {
    it('should call subscribers for every favorite that was added', () => {
      favoritesDidAddItem$.subscribe(subscriber);
      mainSubject.next({ action: successAddFavorites('product1') });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      favoritesDidAddItem$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('favoritesWillRemoveItem$', () => {
    it('should call subscribers for every favorite to be removed', () => {
      favoritesWillRemoveItem$.subscribe(subscriber);
      mainSubject.next({ action: requestRemoveFavorites('product1') });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      favoritesWillRemoveItem$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('favoritesDidRemoveItem$', () => {
    it('should call subscribers for every favorite that was removed', () => {
      favoritesDidRemoveItem$.subscribe(subscriber);
      mainSubject.next({ action: successRemoveFavorites('product1') });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      favoritesDidRemoveItem$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('receiveFavorites$', () => {
    it('should call subscribers for every receive favorites action', () => {
      receiveFavorites$.subscribe(subscriber);
      mainSubject.next({ action: receiveFavorites() });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      receiveFavorites$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('favoritesSyncIdle$', () => {
    it('should call subscribers for every sync idle call', () => {
      favoritesSyncIdle$.subscribe(subscriber);
      mainSubject.next({ action: idleSyncFavorites() });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      favoritesSyncIdle$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('refreshFavorites$', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call subscribers only once, when the action is triggered multiple times', () => {
      jest.useFakeTimers();
      refreshFavorites$.subscribe(subscriber);
      const action = idleSyncFavorites();
      mainSubject.next({ action });
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should call subscribers twice, when debounce time has passed', () => {
      jest.useFakeTimers();
      refreshFavorites$.subscribe(subscriber);
      const action = idleSyncFavorites();
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      mainSubject.next({ action });
      jest.advanceTimersByTime(FAVORITE_BUTTON_DEBOUNCE_TIME);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should not call subscribers when the action does not match', () => {
      refreshFavorites$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('didRequestAddOrRemoveFavorites$', () => {
    it('should call subscribers for every actual add or remove request', () => {
      didRequestAddOrRemoveFavorites$.subscribe(subscriber);
      mainSubject.next({ action: requestAddFavorites('product1') });
      mainSubject.next({ action: requestRemoveFavorites('product2', false) });
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('should not call subscribers when the action does not match', () => {
      didRequestAddOrRemoveFavorites$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('didRequestFlushFavoritesBuffer$', () => {
    it('should call subscribers for every buffer flush request', () => {
      didRequestFlushFavoritesBuffer$.subscribe(subscriber);
      mainSubject.next({ action: requestFlushFavoritesBuffer() });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers when the action does not match', () => {
      didRequestFlushFavoritesBuffer$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });

  describe('didReceiveFlushFavoritesBuffer$', () => {
    it('should call subscribers with the full action buffer when the buffer period has passed', () => {
      jest.useFakeTimers();
      const bufferedActions = [
        { action: requestAddFavorites('product1') },
        { action: requestAddFavorites('product2') },
        { action: requestRemoveFavorites('product2', false) },
        { action: requestAddFavorites('product2') },
      ];
      didReceiveFlushFavoritesBuffer$.subscribe(subscriber);

      // Pump all actions into the buffer
      bufferedActions.forEach((action) => {
        mainSubject.next(action);
      });

      // Trigger flush by timeout
      jest.advanceTimersByTime(FAVORITE_ACTION_BUFFER_TIME);

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(bufferedActions);

      jest.useRealTimers();
    });

    it('should call subscribers with the full action buffer when the buffer is cleared by manual request', () => {
      const bufferedActions = [
        { action: requestAddFavorites('product1') },
        { action: requestAddFavorites('product2') },
        { action: requestRemoveFavorites('product2', false) },
        { action: requestAddFavorites('product2') },
      ];
      didReceiveFlushFavoritesBuffer$.subscribe(subscriber);

      // Pump all actions into the buffer
      bufferedActions.forEach((action) => {
        mainSubject.next(action);
      });

      // Trigger flush via manual request action
      mainSubject.next({ action: requestFlushFavoritesBuffer() });

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(bufferedActions);
    });

    it('should not call subscribers when the action does not match', () => {
      didReceiveFlushFavoritesBuffer$.subscribe(subscriber);
      mainSubject.next({ action: { type: DUMMY_ACTION } });
      expect(subscriber).toHaveBeenCalledTimes(0);
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
