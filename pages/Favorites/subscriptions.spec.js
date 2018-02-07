/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  favoritesWillFetch$,
  favoritesDidFetch$,
  favoritesWillRemoveItem$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import {
  SET_VIEW_LOADING,
  UNSET_VIEW_LOADING,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import subscribe from './subscriptions';

describe('Favorites subscriptions', () => {
  let subscribeMock;
  let first;
  let second;
  let third;
  beforeAll(() => {
    subscribeMock = jest.fn();
  });
  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(3);
    [first, second, third] = subscribeMock.mock.calls;
    expect(first[0]).toBe(favoritesWillRemoveItem$);
    expect(second[0]).toBe(favoritesWillFetch$);
    expect(third[0]).toBe(favoritesDidFetch$);
  });

  describe('favoritesWillRemoveItem$', () => {
    it('should return when currentPath is not favorites page', () => {
      /**
       * Get state function.
       * @returns {Object}
       */
      const getState = () => ({
        history: {
          pathname: 'foo',
        },
      });
      // Didn't pass dispatch. If won't return early, exception would be thrown.
      expect(first[1]({ getState })).toBe(undefined);
    });
    it('should dispatch create toast action', () => {
      /**
       * Get state function.
       * @returns {Object}
       */
      const getState = () => ({
        history: {
          pathname: FAVORITES_PATH,
        },
      });
      const action = {
        productId: 123,
      };
      const dispatch = jest.fn();
      first[1]({ getState, action, dispatch });
      dispatch.mock.calls[0][0](dispatch);
      expect(typeof dispatch.mock.calls[1][0] === 'object').toBe(true);
    });
  });
  describe('favoritesWillFetch$', () => {
    it('should dispatch setViewLoading', () => {
      const dispatch = jest.fn();
      const state = {
        view: {
          isLoading: {},
        },
      };
      /**
       * Get state.
       * @returns {Object}
       */
      const getState = () => state;

      second[1]({ dispatch });
      dispatch.mock.calls[0][0](dispatch, getState);
      expect(dispatch.mock.calls[1][0].type).toBe(SET_VIEW_LOADING);
    });
  });
  describe('favoritesDidFetch$', () => {
    it('should dispatch unsetViewLoading', () => {
      const dispatch = jest.fn();
      const state = {
        view: {
          isLoading: {},
        },
      };
      state.view.isLoading[FAVORITES_PATH] = 1;
      /**
       * Get state.
       * @returns {Object}
       */
      const getState = () => state;

      third[1]({ dispatch });
      dispatch.mock.calls[0][0](dispatch, getState);
      expect(dispatch.mock.calls[1][0].type).toBe(UNSET_VIEW_LOADING);
    });
  });
});
