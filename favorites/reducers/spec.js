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
} from '../constants';
import reducers from './index';
import {
  mockedList,
} from '../mock';

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
});
