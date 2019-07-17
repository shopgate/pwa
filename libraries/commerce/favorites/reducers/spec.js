import {
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  ERROR_FETCH_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  CANCEL_REQUEST_SYNC_FAVORITES,
  SUCCESS_ADD_FAVORITES,
  SUCCESS_REMOVE_FAVORITES,
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
} from '../constants';
import reducers from './index';
import { mockedList } from '../mock';

describe('Favorites - reducers', () => {
  describe('Simple fetching', () => {
    let state = {};

    it('should react on REQUEST_FAVORITES ', () => {
      state = reducers(state, { type: REQUEST_FAVORITES });
      expect(typeof state.products).toBe('object');
      // Is fetching.
      expect(state.products.isFetching).toBe(true);
      // Expires should be zero since it's fetching.
      expect(state.products.expires).toBe(0);
    });

    it('should react on RECEIVE_FAVORITES', () => {
      state = reducers(state, {
        type: RECEIVE_FAVORITES,
        products: mockedList.products,
      });
      expect(typeof state).toBe('object');
      // Is fetching is reset.
      expect(state.products.isFetching).toBe(false);
      // Expire flag is set up.
      expect(state.products.expires).toBeGreaterThan(0);
      expect(state.products.ready).toBe(true);
      // There is data saved.
      expect(state.products.ids instanceof Array).toBe(true);
      expect(typeof state.products.ids[0]).toBe('string');
    });

    it('should react on ERROR_FETCH_FAVORITES', () => {
      state = reducers(state, { type: ERROR_FETCH_FAVORITES });
      // Fetching is finished.
      expect(state.products.isFetching).toBe(false);
      // Expire flag is reset.
      expect(state.products.expires).toBe(0);
      // Data is NOT removed.
      expect(state.products.ids.length).toBe(2);
    });

    it('should keep the old data on next request', () => {
      state = reducers(state, { type: REQUEST_FAVORITES });
      expect(state.products.ids.length).toBe(2);
    });

    it('should save array even if ERROR is dispatched first', () => {
      const result = reducers({}, { type: ERROR_FETCH_FAVORITES });
      expect(result.products.ids instanceof Array).toBe(true);
    });
  });

  describe('Add and remove Favorites', () => {
    const state = {
      products: {
        ready: true,
        ids: ['p1', 'p2'],
        syncCount: 2,
      },
    };
    const { now } = Date;
    afterEach(() => {
      Date.now = now;
    });

    it('should not change current state on RECEIVE_FAVORITES when client is out of sync', () => {
      const invalidProduct = 'invalidProduct';
      const newState = reducers(state, {
        type: RECEIVE_FAVORITES,
        products: [{ id: invalidProduct }],
        requestTimestamp: 0,
      });
      expect(newState.products.ids).not.toContain(invalidProduct);
    });

    it('should not change current state on RECEIVE_FAVORITES when request was before last change', () => {
      const invalidProduct = 'invalidProduct';
      const newState = reducers({
        ...state,
        products: {
          ...state.products,
          lastChange: 1,
        },
      }, {
        type: RECEIVE_FAVORITES,
        products: [{ id: invalidProduct }],
        requestTimestamp: 0,
      });
      expect(newState.products.ids).not.toContain(invalidProduct);
    });

    it('should react on REQUEST_ADD_FAVORITES ', () => {
      Date.now = jest.fn(() => 1337);

      const productIdToAdd = 'p3';
      const newState = reducers(state, {
        type: REQUEST_ADD_FAVORITES,
        productId: productIdToAdd,
      });
      expect(newState.products.isFetching).toBeUndefined(); // Don't touch `isFetching` state
      expect(newState.products.syncCount).toBe(3); // Track as additional sync
      expect(newState.products.lastChange).toBe(1337);
      expect(typeof state).toBe('object');
      expect(newState.products.ids).toContain(productIdToAdd);
    });

    it('should react on REQUEST_REMOVE_FAVORITES ', () => {
      Date.now = jest.fn(() => 1337);

      const productIdToRemove = 'p2';
      const newState = reducers(state, {
        type: REQUEST_REMOVE_FAVORITES,
        productId: productIdToRemove,
      });
      expect(newState.products.isFetching).toBeUndefined(); // Don't touch `isFetching` state
      expect(newState.products.syncCount).toBe(3); // Track as additional sync
      expect(newState.products.lastChange).toBe(1337);
      expect(typeof newState).toBe('object');
      expect(newState.products.ids).not.toContain(productIdToRemove);
    });

    it('should react on CANCEL_REQUEST_SYNC_FAVORITES', () => {
      // Triggers a cancellation of the sync (reduces backend calls)
      const newState = reducers(state, {
        type: CANCEL_REQUEST_SYNC_FAVORITES,
        count: 2,
      });
      expect(typeof newState).toBe('object');
      expect(newState.products.syncCount).toBe(0);
    });

    it('should react on SUCCESS_ADD_FAVORITES', () => {
      Date.now = jest.fn(() => 1337);

      const newState = reducers(state, {
        type: SUCCESS_ADD_FAVORITES,
      });
      expect(newState.products.isFetching).toBeUndefined(); // Don't touch `isFetching` state
      expect(newState.products.syncCount).toBe(1); // Track as finished sync
      expect(newState.products.lastChange).toBe(1337);
      expect(typeof newState).toBe('object');
    });

    it('should react on SUCCESS_REMOVE_FAVORITES', () => {
      Date.now = jest.fn(() => 1337);

      const newState = reducers(state, {
        type: SUCCESS_REMOVE_FAVORITES,
      });
      expect(newState.products.isFetching).toBeUndefined(); // Don't touch `isFetching` state
      expect(newState.products.syncCount).toBe(1); // Track as finished sync
      expect(newState.products.lastChange).toBe(1337);
      expect(typeof newState).toBe('object');
    });

    it('should react on ERROR_ADD_FAVORITES ', () => {
      Date.now = jest.fn(() => 1337);

      const productIdToAdd = 'p2';
      const newState = reducers(state, {
        type: ERROR_ADD_FAVORITES,
        productId: productIdToAdd,
      });
      expect(newState.products.isFetching).toBeUndefined(); // Don't touch `isFetching` state
      expect(newState.products.syncCount).toBe(1); // Track as aborted sync
      expect(newState.products.lastChange).toBe(1337);
      expect(typeof newState).toBe('object');
      expect(newState.products.ids).not.toContain(productIdToAdd);
    });

    it('should react on ERROR_REMOVE_FAVORITES ', () => {
      Date.now = jest.fn(() => 1337);

      const productIdToRemove = 'p3';
      const newState = reducers(state, {
        type: ERROR_REMOVE_FAVORITES,
        productId: productIdToRemove,
      });
      expect(newState.products.isFetching).toBeUndefined(); // Don't touch `isFetching` state
      expect(newState.products.syncCount).toBe(1); // Track as aborted sync
      expect(newState.products.lastChange).toBe(1337);
      expect(typeof state).toBe('object');
      expect(newState.products.ids).toContain(productIdToRemove);
    });
  });
});
