import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import fetchFavorites from './fetchFavorites';
import {
  addFavorites,
  removeFavorites,
  dispatchBufferedFavoriteActions,
} from './toggleFavorites';
import {
  mockedList,
  mockedGetState,
} from '../mock';
import {
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_SYNC_FAVORITES,
  REQUEST_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  ERROR_SYNC_FAVORITES,
  IDLE_SYNC_FAVORITES,
} from '../constants';
import * as pipelines from '../constants/Pipelines';

import { requestAddFavorites, requestRemoveFavorites } from '../action-creators';

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

  describe('Add Favorites', () => {
    it('should add', (done) => {
      const productId = 'product';
      const expectedActions = [
        {
          type: REQUEST_ADD_FAVORITES,
          productId,
        },
      ];

      const store = mockStore({});
      store.dispatch(addFavorites(productId));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });
  });

  describe('remove favorites', () => {
    it('should remove', (done) => {
      const productId = 'product';
      const expectedActions = [
        {
          type: REQUEST_REMOVE_FAVORITES,
          productId,
          silent: false,
        },
      ];
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
      ];
      const store = mockStore(mockedGetState('then', {
        withProducts: true,
      }));
      store.dispatch(removeFavorites(productId, true));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });
  });

  describe('Add Remove Sync', () => {
    it('should sync add favorites', (done) => {
      const productIds = ['1', '2', '3'];
      const mockBufferedActions = productIds
        .map(id => requestAddFavorites(id));
      const expectedActions = [
        {
          type: REQUEST_SYNC_FAVORITES,
          productIdsToAdd: [...productIds],
          productIdsToRemove: [],
        },
        {
          type: RECEIVE_SYNC_FAVORITES,
          productIdsToAdd: [...productIds],
          productIdsToRemove: [],
        },
      ];
      const mockResolveDetector = jest.fn();
      mockedResolver = (mockInstance, resolve) => {
        resolve(mockResolveDetector());
      };
      const store = mockStore({});
      store.dispatch(dispatchBufferedFavoriteActions(mockBufferedActions));
      setTimeout(() => {
        expect(mockResolveDetector.mock.calls.length).toEqual(productIds.length);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should sync add favorites without duplicate product ids', (done) => {
      const productIds = ['1', '2', '3'];
      const mockBufferedActions = [...productIds, ...productIds, ...productIds]
        .map(id => requestAddFavorites(id));
      const expectedActions = [
        {
          type: REQUEST_SYNC_FAVORITES,
          productIdsToAdd: [...productIds],
          productIdsToRemove: [],
        },
        {
          type: RECEIVE_SYNC_FAVORITES,
          productIdsToAdd: [...productIds],
          productIdsToRemove: [],
        },
      ];
      const mockResolveDetector = jest.fn();
      mockedResolver = (mockInstance, resolve) => {
        resolve(mockResolveDetector());
      };
      const store = mockStore({});
      store.dispatch(dispatchBufferedFavoriteActions(mockBufferedActions));
      setTimeout(() => {
        expect(mockResolveDetector.mock.calls.length).toEqual(productIds.length);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should not call any pipeline because there is an add and a remove for same product', (done) => {
      const productIds = ['1', '2', '3'];
      const mockBufferedActions = [
        ...productIds.map(id => requestAddFavorites(id)),
        ...productIds.map(id => requestRemoveFavorites(id)),
      ];
      const expectedActions = [
        {
          type: IDLE_SYNC_FAVORITES,
        },
      ];
      const mockResolveDetector = jest.fn();
      mockedResolver = (mockInstance, resolve) => {
        resolve(mockResolveDetector());
      };
      const store = mockStore({});
      store.dispatch(dispatchBufferedFavoriteActions(mockBufferedActions));
      setTimeout(() => {
        expect(mockResolveDetector.mock.calls.length).toEqual(0);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should add or remove all product ids that are not equally duplicated in both remove and add lists', (done) => {
      const productIdsToAdd = ['1', '2', '3'];
      const productIdsToRemove = ['4', '5', '6'];
      const productIdsInBoth = ['7', '8'];
      const mockBufferedActions = [
        ...[...productIdsToAdd, ...productIdsInBoth].map(id => requestAddFavorites(id)),
        ...[...productIdsToRemove, ...productIdsInBoth].map(id => requestRemoveFavorites(id)),
      ];
      const expectedActions = [
        {
          type: REQUEST_SYNC_FAVORITES,
          productIdsToAdd: [...productIdsToAdd],
          productIdsToRemove: [...productIdsToRemove],
        },
        {
          type: RECEIVE_SYNC_FAVORITES,
          productIdsToAdd: [...productIdsToAdd],
          productIdsToRemove: [...productIdsToRemove],
        },
      ];
      const mockResolveDetector = jest.fn();
      mockedResolver = (mockInstance, resolve) => {
        resolve(mockResolveDetector());
      };
      const store = mockStore({});
      store.dispatch(dispatchBufferedFavoriteActions(mockBufferedActions));
      setTimeout(() => {
        expect(mockResolveDetector.mock.calls.length)
          .toEqual(productIdsToAdd.length + productIdsToRemove.length);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should add product because there are more calls to add than remove', (done) => {
      const productIdsToAdd = ['1', '1', '1'];
      const productIdsToRemove = ['1', '1'];
      const mockBufferedActions = [
        ...productIdsToAdd.map(id => requestAddFavorites(id)),
        ...productIdsToRemove.map(id => requestRemoveFavorites(id)),
      ];
      const expectedActions = [
        {
          type: REQUEST_SYNC_FAVORITES,
          productIdsToAdd: ['1'],
          productIdsToRemove: [],
        },
        {
          type: RECEIVE_SYNC_FAVORITES,
          productIdsToAdd: ['1'],
          productIdsToRemove: [],
        },
      ];
      const mockResolveDetector = jest.fn();
      mockedResolver = (mockInstance, resolve) => {
        resolve(mockResolveDetector());
      };
      const store = mockStore({});
      store.dispatch(dispatchBufferedFavoriteActions(mockBufferedActions));
      setTimeout(() => {
        expect(mockResolveDetector.mock.calls.length).toEqual(1);
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should handel add error', (done) => {
      const productIds = ['1', '2', '3'];
      const mockBufferedActions = productIds
        .map(id => requestAddFavorites(id));
      const mockError = new Error('mock error');
      const expectedActions = [
        {
          type: REQUEST_SYNC_FAVORITES,
          productIdsToAdd: [...productIds],
          productIdsToRemove: [],
        },
        {
          type: ERROR_SYNC_FAVORITES,
          productIdsToAdd: [...productIds],
          productIdsToRemove: [],
          error: mockError,
        },
      ];
      mockedResolver = (mockInstance, resolve, reject) => {
        reject(mockError);
      };
      const store = mockStore({});
      store.dispatch(dispatchBufferedFavoriteActions(mockBufferedActions));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });
  });
});
