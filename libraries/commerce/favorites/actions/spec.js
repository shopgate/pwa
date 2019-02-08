import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import fetchFavorites from './fetchFavorites';
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
  RECEIVE_SYNC_FAVORITES, IDLE_SYNC_FAVORITES, ERROR_SYNC_FAVORITES,
} from '../constants';
import * as pipelines from '../constants/Pipelines';

let mockedResolver;
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
      mockedResolver(mockInstance, resolve, reject);
    })
  )
);

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('Favorites - actions', () => {
  describe(pipelines.SHOPGATE_USER_GET_FAVORITES, () => {
    /**
     * Assertion helper function
     * @param {string} variant ('then' or 'catch')
     * @param {Function} done Async test case done callback function.
     */
    const testFetch = (variant, done) => {
      const mockedDispatch = jest.fn();
      const promise = fetchFavorites()(mockedDispatch, mockedGetState(variant));
      // Make sure test callback is executed after the internal fetchReviews one.
      setTimeout(() => {
        promise[variant]((result) => {
          expect(result.mockInstance.name).toBe(pipelines.SHOPGATE_USER_GET_FAVORITES);
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
      const promise = fetchFavorites()(mockedDispatch, mockedGetState('then', { validCache: true }));
      promise.then((result) => {
        expect(result).toBe(undefined);
        expect(mockedDispatch.mock.calls.length).toBe(0);
        done();
      });
    });
  });

  describe(pipelines.SHOPGATE_USER_PUT_FAVORITES, () => {
    const mockedDispatch = jest.fn();
    it('should add', (done) => {
      mockedResolver = (mockInstance, resolve) => {
        resolve();
      };
      addFavorites('product')(mockedDispatch);
      expect(mockedDispatch.mock.calls.length).toBe(2);
      mockedDispatch.mock.calls[1][0](mockedDispatch, mockedGetState('then'));
      expect(mockedDispatch.mock.calls.length).toBe(3);
      setTimeout(() => {
        expect(mockedDispatch.mock.calls.slice(-2)[0][0].type).toBe(RECEIVE_SYNC_FAVORITES);
        done();
      }, 0);
    });
  });

  describe('removeFavorites', () => {
    it('should remove', (done) => {
      const mockedDispatch = jest.fn();
      mockedResolver = (mockInstance, resolve) => {
        resolve();
      };
      removeFavorites('product')(mockedDispatch);
      expect(mockedDispatch.mock.calls.length).toBe(2);
      mockedDispatch.mock.calls[1][0](mockedDispatch, mockedGetState('then'));
      expect(mockedDispatch.mock.calls.length).toBe(3);
      setTimeout(() => {
        expect(mockedDispatch.mock.calls.slice(-2)[0][0].type).toBe(RECEIVE_SYNC_FAVORITES);
        done();
      }, 0);
    });

    it('should remove with relatives', (done) => {
      const mockedDispatch = jest.fn();
      mockedResolver = (mockInstance, resolve) => {
        resolve();
      };
      removeFavorites('SG118', true)(mockedDispatch, mockedGetState('then', {
        withProducts: true,
      }));
      expect(mockedDispatch.mock.calls.length).toBe(4);
      // Dispathing request sync twice to see if second one would be ignored (by counting others).
      mockedDispatch.mock.calls[1][0](mockedDispatch, mockedGetState('then'));
      mockedDispatch.mock.calls[1][0](mockedDispatch, mockedGetState('then'));
      expect(mockedDispatch.mock.calls.length).toBe(5);
      setTimeout(() => {
        expect(mockedDispatch.mock.calls.slice(-2)[0][0].type).toBe(RECEIVE_SYNC_FAVORITES);
        // Last call should be requestSync dispatch again.
        expect(typeof mockedDispatch.mock.calls.slice(-1)[0][0]).toBe('function');
        // Now, last call should be IDLE.
        mockedDispatch.mock.calls.slice(-1)[0][0](mockedDispatch);
        expect(mockedDispatch.mock.calls.slice(-1)[0][0].type).toBe(IDLE_SYNC_FAVORITES);
        done();
      }, 0);
    });
  });

  describe('requestSync', () => {
    it('should handle error', (done) => {
      const mockedDispatch = jest.fn();
      mockedResolver = (mockInstance, resolve, reject) => {
        reject();
      };
      removeFavorites('SG117', true)(mockedDispatch, mockedGetState('then', {
        withProducts: true,
      }));
      mockedDispatch.mock.calls[1][0](mockedDispatch, mockedGetState('then'));
      setTimeout(() => {
        expect(mockedDispatch.mock.calls.slice(-2)[0][0].type).toBe(ERROR_SYNC_FAVORITES);
        done();
      }, 0);
    });
  });
});
