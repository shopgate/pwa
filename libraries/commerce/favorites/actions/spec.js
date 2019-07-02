import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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
  REQUEST_ADD_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  ERROR_FETCH_FAVORITES,
  ERROR_FAVORITES,
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

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

  describe(pipelines.SHOPGATE_USER_ADD_FAVORITES, () => {
    const productId = 'product';
    it('should add', (done) => {
      const expectedActions = [
        {
          type: REQUEST_ADD_FAVORITES,
          productId,
        },
        {
          type: RECEIVE_ADD_FAVORITES,
          productId,
        },
      ];
      mockedResolver = (mockInstance, resolve) => {
        resolve();
      };
      const store = mockStore({});
      store.dispatch(addFavorites(productId));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should handel add error', (done) => {
      const mockError = new Error('mock error');
      const expectedActions = [
        {
          type: REQUEST_ADD_FAVORITES,
          productId,
        },
        {
          type: ERROR_FAVORITES,
          productId,
          error: mockError,
        },
      ];
      mockedResolver = (mockInstance, resolve, reject) => {
        reject(mockError);
      };
      const store = mockStore({});
      store.dispatch(addFavorites(productId));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });
  });

  describe(pipelines.SHOPGATE_USER_DELETE_FAVORITES, () => {
    it('should remove', (done) => {
      const productId = 'product';
      const expectedActions = [
        {
          type: REQUEST_REMOVE_FAVORITES,
          productId,
          silent: false,
        },
        {
          type: RECEIVE_REMOVE_FAVORITES,
          productId,
        },
      ];
      mockedResolver = (mockInstance, resolve) => {
        resolve();
      };
      const store = mockStore({});
      store.dispatch(removeFavorites(productId));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should remove with relatives', (done) => {
      const relativeProductId = 'SG117';
      const productId = 'SG118';
      const expectedActions = [
        {
          type: REQUEST_REMOVE_FAVORITES,
          productId: relativeProductId,
          silent: false,
        },
        {
          type: REQUEST_REMOVE_FAVORITES,
          productId,
          silent: false,
        },
        {
          type: RECEIVE_REMOVE_FAVORITES,
          productId: relativeProductId,
        },
        {
          type: RECEIVE_REMOVE_FAVORITES,
          productId,
        },
      ];
      mockedResolver = (mockInstance, resolve) => {
        resolve();
      };
      const store = mockStore(mockedGetState('then', {
        withProducts: true,
      }));
      store.dispatch(removeFavorites(productId, true));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should handel remove error', (done) => {
      const mockError = new Error('mock error');
      const productId = 'product';
      const expectedActions = [
        {
          type: REQUEST_REMOVE_FAVORITES,
          productId,
          silent: false,
        },
        {
          type: ERROR_FAVORITES,
          productId,
          error: mockError,
        },
      ];
      mockedResolver = (mockInstance, resolve, reject) => {
        reject(mockError);
      };
      const store = mockStore({});
      store.dispatch(removeFavorites(productId));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });
  });
});
