/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import fetchReviews from './fetchReviews';
import getProductReviews from './getProductReviews';

const { console } = global;
let mockedResolver;
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
      mockedResolver(mockInstance, resolve, reject);
    })
  )
);

describe('Reviews actions', () => {
  describe('fetchReviews', () => {
    beforeEach(() => {
      console.error = jest.fn();
    });
    afterEach(() => {
      console.error.mockClear();
    });
    /**
     * Assertion helper function
     * @param {string} variant ('then' or 'catch')
     * @param {function} done Async test case done callback function.
     */
    const testFetch = (variant, done) => {
      const mockedDispatch = jest.fn();
      const promise = fetchReviews('foo', 2, 1)(mockedDispatch);
      // Make sure test callback is executed after the internal fetchReviews one.
      setTimeout(() => {
        promise[variant]((result) => {
          expect(result.mockInstance.name).toBe('getProductReviews');
          expect(result.mockInstance.input).toEqual({
            productId: 'foo',
            limit: 2,
            offset: 1,
            sort: 'dateDesc',
          });
          expect(console.error).toHaveBeenCalledTimes(variant === 'then' ? 0 : 1);
          expect(mockedDispatch).toHaveBeenCalledTimes(2);
          done();
        });
      }, 0);
    };
    it('should resolve and call appropriate actions', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          reviews: [],
          mockInstance,
        });
      };
      testFetch('then', done);
    });
    it('should fail and call appropriate actions', (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          mockInstance,
        });
      };
      testFetch('catch', done);
    });
  });
  describe('getProductReviews', () => {
    /**
     * Assertion helper function
     * @param {string} variant ('then' or 'catch')
     * @param {function} done Async test case done callback function.
     */
    const testGetProductReviews = (variant, done) => {
      const mockedDispatch = jest.fn();
      const promise = getProductReviews('foo', 10, 'invalidSort')(mockedDispatch);
      setTimeout(() => {
        promise[variant]((result) => {
          expect(result.mockInstance.name).toBe('getProductReviews');
          expect(result.mockInstance.input).toEqual({
            productId: 'foo',
            limit: 10,
            sort: 'invalidSort',
          });
          expect(mockedDispatch).toHaveBeenCalledTimes(2);
          done();
        });
      }, 0);
    };
    it('should resolve and call appropriate actions', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve({
          reviews: [],
          mockInstance,
        });
      };
      testGetProductReviews('then', done);
    });
    it('should reject and call appropriate actions', (done) => {
      mockedResolver = (mockInstance, resolve, reject) => {
        reject({
          mockInstance,
        });
      };
      testGetProductReviews('catch', done);
    });
  });
});
