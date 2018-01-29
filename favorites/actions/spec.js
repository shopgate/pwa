/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import getFavorites from './getFavorites';
import {
  addFavorites,
  removeFavorites,
} from './toggleFavorites';
import {
  mockedList,
  mockedGetState,
} from '../mock';

import {
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  ERROR_FETCH_FAVORITES,
  REQUEST_ADD_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
} from '../constants';

let mockedResolver;
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
      mockedResolver(mockInstance, resolve, reject);
    })
  )
);

describe('Favorites - actions', () => {
  /**
   * Assertion helper function
   * @param {string} variant ('then' or 'catch')
   * @param {string} id Product id
   * @param {function} done Async test case done callback function.
   */
  const testAdd = (variant, id, done) => {
    const mockedDispatch = jest.fn();
    const promise = addFavorites(id)(mockedDispatch, mockedGetState(variant));
    setTimeout(() => {
      promise[variant]((result) => {
        if (!id) {
          expect(result).toBe(undefined);
          expect(mockedDispatch).toHaveBeenCalledTimes(1);
          expect(mockedDispatch.mock.calls[0][0].type).toBe(ERROR_ADD_FAVORITES);
          done();
          return;
        }

        expect(result.mockInstance.name).toBe('addFavorites');
        expect(mockedDispatch).toHaveBeenCalledTimes(2);
        expect(mockedDispatch.mock.calls[0][0].type).toBe(REQUEST_ADD_FAVORITES);
        expect(mockedDispatch.mock.calls[1][0].type)
          .toBe(variant === 'then' ? RECEIVE_ADD_FAVORITES : ERROR_ADD_FAVORITES);
        done();
      });
    }, 0);
  };

  /**
   * Assertion helper function
   * @param {string} variant ('then' or 'catch')
   * @param {string} id Product id
   * @param {function} done Async test case done callback function.
   */
  const testRemove = (variant, id, done) => {
    const mockedDispatch = jest.fn();
    const promise = removeFavorites(id)(mockedDispatch, mockedGetState(variant));
    setTimeout(() => {
      promise[variant]((result) => {
        if (!id) {
          expect(result).toBe(undefined);
          expect(mockedDispatch).toHaveBeenCalledTimes(1);
          expect(mockedDispatch.mock.calls[0][0].type).toBe(ERROR_REMOVE_FAVORITES);
          done();
          return;
        }
        expect(typeof result).toBe('object');
        expect(result.type).toBe(RECEIVE_REMOVE_FAVORITES);
        done();
      });
    }, 0);
  };

  describe('getFavorites', () => {
    /**
     * Assertion helper function
     * @param {string} variant ('then' or 'catch')
     * @param {function} done Async test case done callback function.
     */
    const testFetch = (variant, done) => {
      const mockedDispatch = jest.fn();
      const promise = getFavorites()(mockedDispatch, mockedGetState(variant));
      // Make sure test callback is executed after the internal fetchReviews one.
      setTimeout(() => {
        promise[variant]((result) => {
          expect(result.mockInstance.name).toBe('getFavorites');
          expect(mockedDispatch).toHaveBeenCalledTimes(2);
          expect(mockedDispatch.mock.calls[0][0].type).toBe(REQUEST_FAVORITES);
          expect(mockedDispatch.mock.calls[1][0].type)
            .toBe(variant === 'then' ? RECEIVE_FAVORITES : ERROR_FETCH_FAVORITES);
          done();
        });
      }, 0);
    };
    it('should call appropriate actions on *resolved* pipeline request', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          ...mockedList,
          mockInstance,
        });
      };
      testFetch('then', done);
    });
    it('should call appropriate action on *rejected* pipeline request', (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          ...mockedList,
          mockInstance,
        });
      };
      testFetch('catch', done);
    });
    it('should not call pipeline when data is cached and valid', (done) => {
      const mockedDispatch = jest.fn();
      const promise = getFavorites()(mockedDispatch, mockedGetState('then', { validCache: true }));
      promise.then((result) => {
        expect(result).toBe(undefined);
        expect(mockedDispatch.mock.calls.length).toBe(0);
        done();
      });
    });
  });
  describe('addFavorites', () => {
    it('should add', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          favorites: {
            products: {
              ids: ['product_1'],
            },
          },
          mockInstance,
        });
      };
      testAdd('then', 'product_1', done);
    });

    it('should cancel request on add - remove', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          favorites: {
            products: {
              ids: [],
            },
          },
          mockInstance,
        });
      };

      const mockedDispatchAdd = jest.fn();
      const mockedDispatchRemove = jest.fn();
      addFavorites('product_id')(mockedDispatchAdd, mockedGetState('then'));
      const promiseRemove
              = removeFavorites('product_id')(mockedDispatchRemove, mockedGetState('then'));

      // Make sure test callback is executed after the internal fetchReviews one.
      setTimeout(() => {
        promiseRemove.then((result) => {
          expect(result).toEqual({
            type: 'ABORT_ADD_FAVORITES',
            productId: 'product_id',
          });
          expect(mockedDispatchAdd).toHaveBeenCalledTimes(1);
          expect(mockedDispatchRemove).toHaveBeenCalledTimes(1);
          done();
        });
      }, 0);
    });

    it('should prevent multiple add', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          favorites: {
            products: {
              ids: [],
            },
          },
          mockInstance,
        });
      };

      const mockedDispatchAdd1 = jest.fn();
      const mockedDispatchAdd2 = jest.fn();
      addFavorites('product_id')(mockedDispatchAdd1, mockedGetState('then'));
      const addRemove = addFavorites('product_id')(mockedDispatchAdd2, mockedGetState('then'));

      // Make sure test callback is executed after the internal fetchReviews one.
      setTimeout(() => {
        addRemove.then(() => {
          expect(mockedDispatchAdd1).toHaveBeenCalledTimes(1);
          expect(mockedDispatchAdd2).toHaveBeenCalledTimes(2);
          done();
        });
      }, 0);
    });

    it('should not process empty request', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          favorites: {
            products: {
              ids: [],
            },
          },
          mockInstance,
        });
      };

      testAdd('catch', '', done);
    });
  });

  describe('removeFavorites', () => {
    it('should add', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          favorites: {
            products: {
              ids: ['product_1'],
            },
          },
          mockInstance,
        });
      };
      testRemove('then', 'product_1', done);
    });

    it('should not process empty request', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          favorites: {
            products: {
              ids: [],
            },
          },
          mockInstance,
        });
      };

      testRemove('catch', '', done);
    });
  });
});
