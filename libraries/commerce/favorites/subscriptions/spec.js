import {
  subscribe,
  invoke,
  getSubscriptionCount,
  resetSubscriptions,
} from '@shopgate/pwa-common/subscriptions/mock';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import {
  favoritesWillEnter$,
  shouldFetchFreshFavorites$,
  addProductToFavoritesDebounced$,
  removeProductFromFavoritesDebounced$,
  didReceiveFlushFavoritesBuffer$,
  errorFavoritesLimit$,
  refreshFavorites$,
} from '../streams';
import favorites from './index';
import fetchFavorites from '../actions/fetchFavorites';
import addFavorites from '../actions/addFavorites';
import removeFavorites from '../actions/removeFavorites';
import { FAVORITES_LIMIT_ERROR } from '../constants';
import {
  SHOPGATE_USER_ADD_FAVORITES,
  SHOPGATE_USER_DELETE_FAVORITES,
} from '../constants/Pipelines';
import { fetchProductsById } from '../../product';
import {
  addProductToFavorites,
  removeProductFromFavorites,
  requestAddFavorites,
  requestRemoveFavorites,
  cancelRequestSyncFavorites,
  errorFavorites,
  idleSyncFavorites,
} from '../action-creators';
import {
  getFavoritesProductsIds,
  getFavoritesProducts,
  getFavoritesCount,
  getProductRelativesOnFavorites,
} from '../selectors';

// Required for custom runner without env-setup
jest.mock('@shopgate/pwa-core', () => {});

jest.mock('@shopgate/pwa-common/actions/modal/showModal', () =>
  jest.fn().mockReturnValue('showModal'));

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  fetchProductsById: jest.fn(),
}));

jest.mock('../actions/fetchFavorites', () =>
  jest.fn().mockReturnValue('fetchFavoritesResult'));

// Mock all used selectors to avoid mocking the store
let mockedGetFavoritesProductsIdsReturnValue;
let mockedGetFavoritesCountReturnValue;
let mockedGetFavoritesProductsReturnValue;
let mockedGetProductRelativesOnFavoritesReturnValue;
jest.mock('../selectors', () => ({
  getFavoritesProductsIds: jest.fn(() => mockedGetFavoritesProductsIdsReturnValue),
  getFavoritesProducts: jest.fn(() => mockedGetFavoritesProductsReturnValue),
  getFavoritesCount: jest.fn(() => mockedGetFavoritesCountReturnValue),
  getProductRelativesOnFavorites: jest.fn(() => mockedGetProductRelativesOnFavoritesReturnValue),
}));

jest.mock('../actions/addFavorites', () =>
  jest.fn().mockReturnValue('addFavoritesResult'));
jest.mock('../actions/removeFavorites', () =>
  jest.fn().mockReturnValue('removeFavoritesResult'));

let mockedHasFavorites = true;
let mockedFavoritesLimit = 100;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasFavorites() { return mockedHasFavorites; },
  get favorites() { return { limit: mockedFavoritesLimit }; },
}));

describe('Favorites - subscriptions', () => {
  describe('Favorites enabled', () => {
    const pipelineDependenciesSet = pipelineDependencies.set;

    beforeAll(() => {
      // Make sure no conflicting subscriptions exist
      resetSubscriptions();

      // Replace singleton object property with a mock
      pipelineDependencies.set = jest.fn();

      // Subscribe all streams
      favorites(subscribe);
    });

    afterAll(() => {
      // Clean up subscriptions
      resetSubscriptions();

      // Restore singleton
      pipelineDependencies.set = pipelineDependenciesSet;
    });

    // Dispatch always resolves it's promise by default
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue('getState');
    const productIds = ['prod1', 'prod2'];

    beforeEach(() => {
      jest.clearAllMocks();

      // Reset selector return values
      mockedGetFavoritesProductsIdsReturnValue = productIds;
      mockedGetFavoritesCountReturnValue = productIds.length;
      mockedGetProductRelativesOnFavoritesReturnValue = [];
      mockedGetFavoritesProductsReturnValue = {
        ids: productIds,
        isFetching: false,
      };
    });

    describe('appDidStart$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(appDidStart$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(appDidStart$, { dispatch })).toBeUndefined();
      });

      it('should set up pipeline dependencies correctly', () => {
        invoke(appDidStart$, { dispatch });

        // Expect pipeline dependencies to be set correctly
        expect(pipelineDependencies.set).toHaveBeenCalledTimes(2);
        expect(pipelineDependencies.set.mock.calls[0][0]).toBe(SHOPGATE_USER_ADD_FAVORITES);
        expect(pipelineDependencies.set.mock.calls[0][1]).toEqual([
          SHOPGATE_USER_ADD_FAVORITES,
          SHOPGATE_USER_DELETE_FAVORITES,
        ]);
        expect(pipelineDependencies.set.mock.calls[1][0]).toBe(SHOPGATE_USER_DELETE_FAVORITES);
        expect(pipelineDependencies.set.mock.calls[1][1]).toEqual([
          SHOPGATE_USER_ADD_FAVORITES,
          SHOPGATE_USER_DELETE_FAVORITES,
        ]);
      });

      it('should fetch favorites', () => {
        invoke(appDidStart$, { dispatch });

        // Expect fetch favorites action to be dispatched
        expect(fetchFavorites).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(fetchFavorites());
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('favoritesWillEnter$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(favoritesWillEnter$)).toBe(1);
      });

      it('should not return any value', async () => {
        expect(await invoke(favoritesWillEnter$, {
          dispatch,
          getState,
        })).toBeUndefined();
      });

      it('should handle fetch and map favorites', async () => {
        dispatch.mockResolvedValue();
        // eslint-disable-next-line extra-rules/no-single-line-objects
        await invoke(favoritesWillEnter$, { dispatch, getState });

        // Expect products to be fetched correctly
        expect(getState).toHaveBeenCalledTimes(1);
        expect(getFavoritesProductsIds).toHaveBeenCalledWith(getState());
        expect(getFavoritesProductsIds).toHaveBeenCalledTimes(1);
        expect(fetchProductsById).toHaveBeenCalledWith(productIds, null, false);
        expect(fetchProductsById).toHaveBeenCalledTimes(1);

        // Expect the correct actions to be dispatched
        expect(dispatch.mock.calls[0][0]).toBe(fetchFavorites());
        expect(dispatch.mock.calls[1][1]).toBe(fetchProductsById());
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });

    describe('shouldFetchFreshFavorites$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(shouldFetchFreshFavorites$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(shouldFetchFreshFavorites$, { dispatch })).toBeUndefined();
      });

      it('should fetch fresh favorites without using the cache', () => {
        invoke(shouldFetchFreshFavorites$, { dispatch });

        expect(fetchFavorites).toHaveBeenCalledTimes(1);
        expect(fetchFavorites).toHaveBeenCalledWith(true);

        // Expect the correct actions to be dispatched
        expect(dispatch.mock.calls[0][0]).toBe(fetchFavorites(true));
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('addProductToFavoritesDebounced$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(addProductToFavoritesDebounced$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(addProductToFavoritesDebounced$, {
          action: addProductToFavorites('prod3'),
          dispatch,
          getState,
        })).toBeUndefined();
      });

      it('should cancel the request when the product is already there', () => {
        invoke(addProductToFavoritesDebounced$, {
          action: addProductToFavorites('prod1'),
          dispatch,
          getState,
        });
        expect(getState).toHaveBeenCalledTimes(1);
        expect(getFavoritesProducts).toHaveBeenCalledWith(getState());
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(cancelRequestSyncFavorites(0));
        expect(dispatch).toHaveBeenCalledTimes(1);
      });

      it('should proceed and dispatch an error if the product is not yet on the list and the limit is reached', () => {
        const favoritesLimit = mockedFavoritesLimit;

        const productId = 'prod3';
        mockedFavoritesLimit = 2;
        mockedGetFavoritesCountReturnValue = 2;

        invoke(addProductToFavoritesDebounced$, {
          action: addProductToFavorites(productId),
          dispatch,
          getState,
        });

        expect(getState).toHaveBeenCalledTimes(2);
        expect(getFavoritesProducts).toHaveBeenCalledWith(getState());
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(getFavoritesCount).toHaveBeenCalledWith(getState());
        expect(getFavoritesCount).toHaveBeenCalledTimes(1);

        const error = new Error('Limit exceeded');
        error.code = FAVORITES_LIMIT_ERROR;
        expect(dispatch).toHaveBeenCalledWith(errorFavorites(productId, error));
        expect(dispatch).toHaveBeenCalledTimes(1);
        mockedFavoritesLimit = favoritesLimit;
      });

      it('should proceed and dispatch an add request if all is good', () => {
        const productId = 'prod3';
        invoke(addProductToFavoritesDebounced$, {
          action: addProductToFavorites(productId),
          dispatch,
          getState,
        });

        expect(getState).toHaveBeenCalledTimes(2);
        expect(getFavoritesProducts).toHaveBeenCalledWith(getState());
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(getFavoritesCount).toHaveBeenCalledWith(getState());
        expect(getFavoritesCount).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenCalledWith(requestAddFavorites(productId));
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('removeProductFromFavoritesDebounced$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(removeProductFromFavoritesDebounced$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', true),
          dispatch,
          getState,
        })).toBeUndefined();
        expect(invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', false),
          dispatch,
          getState,
        })).toBeUndefined();
      });

      it('should not do anything if no products are on the list and currently fetching', () => {
        mockedGetFavoritesCountReturnValue = 0;
        mockedGetFavoritesProductsReturnValue.isFetching = true;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', false),
          dispatch,
          getState,
        });

        expect(getFavoritesCount).toHaveBeenCalledTimes(1);
        expect(getProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledTimes(0);
      });

      it('should idle-sync when no products are on the list and not fetching', () => {
        mockedGetFavoritesCountReturnValue = 0;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', false),
          dispatch,
          getState,
        });

        expect(getFavoritesCount).toHaveBeenCalledTimes(1);
        expect(getProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(idleSyncFavorites(true));
      });

      it('should dispatch a remove request for each relative', () => {
        const productId = 'prod0';
        mockedGetProductRelativesOnFavoritesReturnValue = productIds;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites(productId, true),
          dispatch,
          getState,
        });

        // Expect multiple remove requests to be dispatched
        expect(getProductRelativesOnFavorites).toHaveBeenCalledTimes(1);
        expect(getProductRelativesOnFavorites).toHaveBeenCalledWith(getState(), { productId });
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch.mock.calls[0][0]).toEqual(requestRemoveFavorites(productIds[0]));
        expect(dispatch.mock.calls[1][0]).toEqual(requestRemoveFavorites(productIds[1]));
      });

      it('should cancel the remove request if the product is not on the list', () => {
        const productId = 'prod0';
        mockedGetProductRelativesOnFavoritesReturnValue = productIds;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites(productId, false),
          dispatch,
          getState,
        });

        // Don't expect any remove requests to be triggered
        expect(getProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(cancelRequestSyncFavorites(0));
      });

      it('should request the removal of the single favorite item', () => {
        const productId = 'prod0';
        mockedGetFavoritesProductsReturnValue = {
          ...mockedGetFavoritesProductsReturnValue,
          ids: [
            ...mockedGetFavoritesProductsReturnValue.ids,
            productId,
          ],
        };
        mockedGetProductRelativesOnFavoritesReturnValue = productIds;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites(productId, false),
          dispatch,
          getState,
        });

        // Only one removal request is expected
        expect(getProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(requestRemoveFavorites(productId));
      });
    });

    describe('errorFavoritesLimit$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(errorFavoritesLimit$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(errorFavoritesLimit$, { dispatch })).toBeUndefined();
      });

      it('should dispatch an action to show a modal', () => {
        invoke(errorFavoritesLimit$, { dispatch });

        expect(showModal).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(showModal({
          confirm: null,
          dismiss: 'modal.ok',
          title: 'modal.title_error',
          message: 'favorites.error_limit',
        }));
      });
    });

    describe('refreshFavorites$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(refreshFavorites$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(refreshFavorites$, { dispatch })).toBeUndefined();
      });

      it('should refresh favorites by fetching them without using the cache', () => {
        invoke(refreshFavorites$, { dispatch });

        expect(fetchFavorites).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(fetchFavorites(true));
      });
    });

    describe('didReceiveFlushFavoritesBuffer$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(didReceiveFlushFavoritesBuffer$)).toBe(1);
      });

      it('should not return any value', async () => {
        const productId = 'prod1';
        expect(await invoke(didReceiveFlushFavoritesBuffer$, null)).toBeUndefined();
        expect(await invoke(didReceiveFlushFavoritesBuffer$, [])).toBeUndefined();
        expect(await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites(productId),
          dispatch,
          getState,
        }])).toBeUndefined();
        expect(await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites(productId),
          dispatch,
          getState,
        },
        {
          action: requestRemoveFavorites(productId),
          dispatch,
          getState,
        }])).toBeUndefined();
      });

      it('should cancel all redundant requests', async () => {
        const productId = 'prod1';

        // Add and remove the same product to make both redundant
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites(productId),
          dispatch,
          getState,
        },
        {
          action: requestRemoveFavorites(productId),
          dispatch,
          getState,
        }]);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(cancelRequestSyncFavorites(2));
      });

      it('should filter out duplicated add requests', async () => {
        const productId = 'prod1';

        // Add the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites(productId),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites(productId),
          dispatch,
          getState,
        }]);

        // One cancel and one add action call as well as one idle-sync afterwards
        expect(addFavorites).toHaveBeenCalledTimes(1);
        expect(addFavorites.mock.calls[0][0]).toBe(productId);
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch.mock.calls[0][0]).toEqual(cancelRequestSyncFavorites(1));
        expect(dispatch.mock.calls[1][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[2][0]).toEqual(idleSyncFavorites());
      });

      it('should filter out duplicated remove requests', async () => {
        const productId = 'prod1';

        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestRemoveFavorites(productId),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites(productId),
          dispatch,
          getState,
        }]);

        // One cancel and one add action call as well as one idle-sync afterwards
        expect(removeFavorites).toHaveBeenCalledTimes(1);
        expect(removeFavorites.mock.calls[0][0]).toBe(productId);
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch.mock.calls[0][0]).toEqual(cancelRequestSyncFavorites(1));
        expect(dispatch.mock.calls[1][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[2][0]).toEqual(idleSyncFavorites());
      });

      it('should not filter out unique add or remove requests', async () => {
        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3'),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod4'),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod1'),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod2'),
          dispatch,
          getState,
        }]);

        // Only dispatch add and remove actions, no cancellation
        expect(addFavorites).toHaveBeenCalledTimes(2);
        expect(addFavorites.mock.calls[0][0]).toBe('prod3');
        expect(addFavorites.mock.calls[1][0]).toBe('prod4');
        expect(removeFavorites).toHaveBeenCalledTimes(2);
        expect(removeFavorites.mock.calls[0][0]).toBe('prod1');
        expect(removeFavorites.mock.calls[1][0]).toBe('prod2');
        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch.mock.calls[0][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[1][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[2][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[3][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[4][0]).toEqual(idleSyncFavorites());
      });

      it('should properly handle conflicts and duplicates when they occur at once', async () => {
        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3'),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod4'),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod4'), // duplicated
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod1'),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod1'), // conflict
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod2'),
          dispatch,
          getState,
        }]);

        // Cancel three calls (conflict -> 2 + duplicate -> 1 => 3), handle the rest
        expect(addFavorites).toHaveBeenCalledTimes(2);
        expect(addFavorites.mock.calls[0][0]).toBe('prod3');
        expect(addFavorites.mock.calls[1][0]).toBe('prod4');
        expect(removeFavorites).toHaveBeenCalledTimes(1);
        expect(removeFavorites.mock.calls[0][0]).toBe('prod2');
        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch.mock.calls[0][0]).toEqual(cancelRequestSyncFavorites(3));
        expect(dispatch.mock.calls[1][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[2][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[3][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[4][0]).toEqual(idleSyncFavorites());
      });

      it('should not break on any failing request', async () => {
        dispatch.mockImplementation(async (action) => {
          if (action === addFavorites() || action === removeFavorites()) {
            throw new Error('Failed to add/remove favorite');
          }
        });

        // Remove the same product twice
        await expect(invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3'),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod1'),
          dispatch,
          getState,
        }])).resolves.toBeUndefined();
      });

      it('should dispatch only therequests and one idle-sync if any error occurs', async () => {
        dispatch.mockImplementation(async (action) => {
          if (action === addFavorites() || action === removeFavorites()) {
            throw new Error('Failed to add/remove favorite');
          }
        });

        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3'),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod1'),
          dispatch,
          getState,
        }]);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch.mock.calls[0][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[1][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[2][0]).toEqual(idleSyncFavorites());
      });
    });
  });

  describe('Favorites disabled', () => {
    it('should not subscribe to anything', () => {
      const hasFavorites = mockedHasFavorites;
      mockedHasFavorites = false;

      favorites(subscribe);
      expect(getSubscriptionCount()).toBe(0);

      mockedHasFavorites = hasFavorites;
    });
  });
});
