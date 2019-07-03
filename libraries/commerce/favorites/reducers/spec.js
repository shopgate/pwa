import {
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  ERROR_FETCH_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_ADD_REMOVE_FAVORITES_SYNC,
  ERROR_ADD_REMOVE_FAVORITES_SYNC,
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

  describe('Add/remove Favorites', () => {
    let state = {
      products: {
        ready: true,
        ids: [],
      },
    };
    const productId = 'product_1';

    it('should react on REQUEST_ADD_FAVORITES ', () => {
      state = reducers(state, {
        type: REQUEST_ADD_FAVORITES,
        productId,
      });
      expect(state.products.isFetching).toBe(true);
      expect(state.products.outOfSync).toBe(true);
      expect(typeof state).toBe('object');
      expect(state.products.ids).toContain(productId);
    });

    it(`should react on ${RECEIVE_ADD_REMOVE_FAVORITES_SYNC} `, () => {
      state = reducers(state, {
        type: RECEIVE_ADD_REMOVE_FAVORITES_SYNC,
        productId,
      });
      expect(state.products.isFetching).toBe(false);
      expect(state.products.outOfSync).toBe(false);
      expect(typeof state).toBe('object');
    });

    it('should not change current state on RECEIVE_FAVORITES when client is out of sync', () => {
      state = reducers(state, {
        type: RECEIVE_FAVORITES,
        products: [{ id: 'invalidProduct' }],
        requestTimestamp: 0,
      });
      expect(state.products.ids).not.toContain('invalidProduct');
    });

    it('should not change current state on RECEIVE_FAVORITES when request was before last change', () => {
      state.products = {
        ...state.products,
        outOfSync: false,
        lastChange: 1,
      };
      state = reducers(state, {
        type: RECEIVE_FAVORITES,
        products: [{ id: 'invalidProduct' }],
        requestTimestamp: 0,
      });
      expect(state.products.ids).not.toContain('invalidProduct');
    });

    it('should react on REQUEST_REMOVE_FAVORITES ', () => {
      state = reducers(state, {
        type: REQUEST_REMOVE_FAVORITES,
        productId,
      });
      expect(state.products.isFetching).toBe(true);
      expect(typeof state).toBe('object');
      expect(state.products.ids).not.toContain(productId);
    });

    it(`should react on ${ERROR_ADD_REMOVE_FAVORITES_SYNC} `, () => {
      state = reducers(state, {
        type: ERROR_ADD_REMOVE_FAVORITES_SYNC,
        productId,
        error: new Error('mock error'),
      });
      expect(state.products.isFetching).toBe(false);
      expect(state.products.outOfSync).toBe(false);
      expect(typeof state).toBe('object');
    });
  });
});
