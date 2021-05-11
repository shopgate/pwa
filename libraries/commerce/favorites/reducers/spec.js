import {
  ADD_PRODUCT_TO_FAVORITES,
  ERROR_ADD_FAVORITES,
  ERROR_FAVORITES_IDS,
  ERROR_REMOVE_FAVORITES,
  FAVORITES_LIFETIME,
  RECEIVE_FAVORITES_IDS,
  REMOVE_PRODUCT_FROM_FAVORITES,
  REQUEST_FAVORITES_IDS,
  SUCCESS_ADD_FAVORITES,
  SUCCESS_REMOVE_FAVORITES,
} from '../constants';
import reducers from './index';
import { mockedList } from '../mock';

describe('Favorites - reducers', () => {
  describe('Favorites IDs', () => {
    let state = {};

    const { now } = Date;
    afterEach(() => {
      Date.now = now;
    });

    it('should react on REQUEST_FAVORITES_IDS ', () => {
      state = reducers(state, { type: REQUEST_FAVORITES_IDS });
      expect(state.products).toMatchObject({
        isFetching: true,
        expires: 0,
      });
    });

    it('should react on RECEIVE_FAVORITES_IDS', () => {
      Date.now = jest.fn(() => 1000);
      const productIds = mockedList.products.map(p => p.id);
      state = reducers(state, {
        type: RECEIVE_FAVORITES_IDS,
        productIds,
      });

      expect(state.products).toMatchObject({
        isFetching: false,
        expires: 1000 + FAVORITES_LIFETIME,
        ready: true,
        ids: productIds,
        originalIds: productIds,
      });
    });

    it('should react on ERROR_FAVORITES_IDS', () => {
      const productIds = mockedList.products.map(p => p.id);
      state = reducers(state, { type: ERROR_FAVORITES_IDS });
      expect(state.products).toMatchObject({
        isFetching: false,
        ready: false,
        expires: 0,
        ids: productIds,
      });
    });

    it('should keep the old data on next request', () => {
      state = reducers(state, { type: REQUEST_FAVORITES_IDS });
      expect(state.products.ids).toHaveLength(2);
    });
  });

  describe('Add and remove favorites', () => {
    const state = {
      products: {
        ready: true,
        ids: ['p1', 'p2'],
        originalIds: ['p1', 'p2'],
      },
    };

    it('should react on REQUEST_ADD_FAVORITES ', () => {
      const productIdToAdd = 'p3';
      let newState = reducers(state, {
        type: ADD_PRODUCT_TO_FAVORITES,
        productId: productIdToAdd,
      });
      expect(newState.products).toMatchObject({
        ids: ['p3', ...state.products.ids],
        originalIds: state.products.originalIds,
      });

      newState = reducers(newState, {
        type: SUCCESS_ADD_FAVORITES,
        productId: productIdToAdd,
      });
      expect(newState.products).toMatchObject({
        ids: ['p3', ...state.products.ids],
        originalIds: ['p3', ...state.products.ids],
      });
    });

    it('should react on REQUEST_REMOVE_FAVORITES ', () => {
      const productIdToRemove = 'p2';
      let newState = reducers(state, {
        type: REMOVE_PRODUCT_FROM_FAVORITES,
        productId: productIdToRemove,
      });
      expect(newState.products).toMatchObject({
        ids: ['p1'],
        originalIds: state.products.originalIds,
      });
      newState = reducers(newState, {
        type: SUCCESS_REMOVE_FAVORITES,
        productId: productIdToRemove,
      });
      expect(newState.products).toMatchObject({
        ids: ['p1'],
        originalIds: ['p1'],
      });
    });

    it('should react on ERROR_ADD_FAVORITES ', () => {
      const productIdToAdd = 'p2';
      const newState = reducers(state, {
        type: ERROR_ADD_FAVORITES,
        productId: productIdToAdd,
      });
      expect(newState.products).toMatchObject({
        ids: ['p1'],
        originalIds: state.products.originalIds,
      });
    });

    it('should react on ERROR_REMOVE_FAVORITES ', () => {
      const productIdToRemove = 'p3';
      const newState = reducers(state, {
        type: ERROR_REMOVE_FAVORITES,
        productId: productIdToRemove,
      });
      expect(newState.products).toMatchObject({
        ids: ['p3', ...state.products.ids],
        originalIds: state.products.originalIds,
      });
    });
  });
});
