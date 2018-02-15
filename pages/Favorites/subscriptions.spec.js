/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  favoritesWillRemoveItem$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import subscribe from './subscriptions';

jest.mock('./constants', () => ({
  FAVORITES_SHOW_TOAST_DELAY: 0,
}));
describe('Favorites subscriptions', () => {
  let subscribeMock;
  let first;
  beforeAll(() => {
    subscribeMock = jest.fn();
  });
  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(1);
    [first] = subscribeMock.mock.calls;
    expect(first[0]).toBe(favoritesWillRemoveItem$);
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
    it('should dispatch create toast action', (done) => {
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
      first[1]({
        getState,
        action,
        dispatch,
      });
      setTimeout(() => {
        dispatch.mock.calls[0][0](dispatch);
        expect(typeof dispatch.mock.calls[1][0] === 'object').toBe(true);
        done();
      }, 1);
    });
  });
});
