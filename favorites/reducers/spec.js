/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  ERROR_FETCH_FAVORITES,
  REQUEST_ADD_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  ABORT_ADD_FAVORITES,
} from '../constants';
import reducers from './index';
import { mockedList } from '../mock';

describe('Favorites - reducers', () => {
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
    expect(state.products.ids.length).toBe(1);
  });
  it('should keep the old data on next request', () => {
    state = reducers(state, { type: REQUEST_FAVORITES });
    expect(state.products.ids.length).toBe(1);
  });
  it('should save array even if ERROR is dispatched first', () => {
    const result = reducers({}, { type: ERROR_FETCH_FAVORITES });
    expect(result.products.ids instanceof Array).toBe(true);
  });

  describe('Add Favorites', () => {
    let addState = {};
    const productId = 'product_1';

    it('should react on REQUEST_ADD_FAVORITES ', () => {
      addState = reducers(addState, {
        type: REQUEST_ADD_FAVORITES,
        productId,
      });
      expect(addState.products.isFetching).toBe(true);
      expect(typeof addState).toBe('object');
      expect(addState.products.ids).toContain(productId);
    });
    it('should react on RECEIVE_ADD_FAVORITES ', () => {
      addState = reducers(addState, { type: RECEIVE_ADD_FAVORITES });
      expect(addState.products.isFetching).toBe(false);
      expect(typeof addState).toBe('object');
      expect(addState.products.ids).toContain(productId);
    });
    it('should react on ERROR_ADD_FAVORITES ', () => {
      addState = reducers(addState, {
        type: ERROR_ADD_FAVORITES,
        productId,
      });
      expect(addState.products.isFetching).toBe(false);
      expect(typeof addState).toBe('object');
      expect(addState.products.ids).not.toContain(productId);
    });
  });

  describe('Remove Favorites', () => {
    const productId = 'product_2';
    let removeState = {
      products: {
        ids: [productId],
      },
    };
    it('should react on REQUEST_REMOVE_FAVORITES ', () => {
      removeState = reducers(removeState, {
        type: REQUEST_REMOVE_FAVORITES,
        productId,
      });
      expect(removeState.products.isFetching).toBe(true);
      expect(typeof removeState).toBe('object');
      expect(removeState.products.ids).not.toContain(productId);
    });

    it('should react on RECEIVE_REMOVE_FAVORITES ', () => {
      removeState = reducers(removeState, { type: RECEIVE_REMOVE_FAVORITES });
      expect(removeState.products.isFetching).toBe(false);
      expect(typeof removeState).toBe('object');
      expect(removeState.products.ids).not.toContain(productId);
    });
    it('should react on ERROR_REMOVE_FAVORITES ', () => {
      removeState = reducers(removeState, {
        type: ERROR_REMOVE_FAVORITES,
        productId,
      });
      expect(removeState.products.isFetching).toBe(false);
      expect(typeof removeState).toBe('object');
      expect(removeState.products.ids).toContain(productId);
    });
    it('should react on ABORT_ADD_FAVORITES', () => {
      removeState = reducers(removeState, {
        type: ABORT_ADD_FAVORITES,
        productId,
      });
      expect(removeState.products.isFetching).toBe(false);
      expect(typeof removeState).toBe('object');
      expect(removeState.products.ids.includes(productId)).toBe(false);
    });
  });
});
