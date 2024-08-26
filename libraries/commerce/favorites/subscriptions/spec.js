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
  updateProductInFavoritesDebounced$,
} from '../streams';
import favorites from './index';
import fetchFavorites from '../actions/fetchFavorites';
import addFavorites from '../actions/addFavorites';
import removeFavorites from '../actions/removeFavorites';
import updateFavorites from '../actions/updateFavorites';
import { FAVORITES_LIMIT_ERROR } from '../constants';
import {
  SHOPGATE_USER_ADD_FAVORITES,
  SHOPGATE_USER_DELETE_FAVORITES,
} from '../constants/Pipelines';
import {
  addProductToFavorites,
  removeProductFromFavorites,
  requestAddFavorites,
  requestRemoveFavorites,
  cancelRequestSyncFavorites,
  errorFavorites,
  idleSyncFavorites,
  updateProductInFavorites,
  requestUpdateFavorites,
} from '../action-creators';
import {
  getFavoritesProducts,
  getFavoritesCount,
  makeGetProductRelativesOnFavorites,
} from '../selectors';
import fetchFavoritesListsWithItems from '../actions/fetchFavoritesListsWithItems';

// Required for custom runner without env-setup
jest.mock('@shopgate/pwa-core', () => {});

jest.mock('@shopgate/pwa-common/actions/modal/showModal', () =>
  jest.fn().mockReturnValue('showModal'));

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  fetchProductsById: jest.fn(),
}));

jest.mock('@shopgate/pwa-common/providers', () => ({
  LoadingProvider: {
    setLoading: jest.fn(),
    unsetLoading: jest.fn(),
  },
}));

const mockedDefaultListId = 'DEFAULT';

jest.mock('../actions/fetchFavorites', () =>
  jest.fn().mockReturnValue('fetchFavoritesResult'));
jest.mock('../actions/fetchFavoritesList', () =>
  jest.fn().mockResolvedValue([{
    id: 'DEFAULT',
    name: 'Wish List',
  }]));

jest.mock('../actions/fetchFavoritesListsWithItems', () => {
  const original = jest.requireActual('../actions/fetchFavoritesListsWithItems');
  return {
    __esModule: true,
    default: jest.fn(original.default),
  };
});

// Mock all used selectors to avoid mocking the store
let mockedGetFavoritesProductsIdsReturnValue;
let mockedGetFavoritesCountReturnValue;
let mockedGetFavoritesCountByListReturnValue;
let mockedGetFavoritesProductsReturnValue;
let mockedGetProductRelativesOnFavoritesReturnValue;
let mockedMakeGetFavoritesReturnValue;

const mockedMakeGetFavoritesCountByList = jest.fn(
  () => mockedGetFavoritesCountByListReturnValue || 0
);

jest.mock('../selectors', () => ({
  getFavoritesProductsIds: jest.fn(() => mockedGetFavoritesProductsIdsReturnValue),
  getFavoritesProducts: jest.fn(() => mockedGetFavoritesProductsReturnValue),
  getFavoritesCount: jest.fn(() => mockedGetFavoritesCountReturnValue),
  makeGetFavoritesCountByList: jest.fn(() => mockedMakeGetFavoritesCountByList),
  makeGetFavorites: jest.fn(() => mockedMakeGetFavoritesReturnValue),
  makeGetProductRelativesOnFavorites: jest.fn(() =>
    jest.fn().mockReturnValue(mockedGetProductRelativesOnFavoritesReturnValue)),
  getUseGetFavoriteIdsPipeline: jest.fn().mockReturnValue(false),
}));

jest.mock('../actions/addFavorites', () =>
  jest.fn().mockReturnValue('addFavoritesResult'));
jest.mock('../actions/removeFavorites', () =>
  jest.fn().mockReturnValue('removeFavoritesResult'));
jest.mock('../actions/updateFavorites', () =>
  jest.fn().mockReturnValue('updateFavoritesResult'));

let mockedHasFavorites = true;
let mockedFavoritesLimit = 100;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasFavorites() { return mockedHasFavorites; },
  get favorites() { return { limit: mockedFavoritesLimit }; },
  get themeConfig() { return {}; },
}));

/**
 * Flushes the promise queue.
 * @returns {Promise}
 */
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

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

    const getState = jest.fn().mockReturnValue(() => {});
    // Dispatch always resolves it's promise by default
    const dispatch = jest.fn((result) => {
      if (typeof result === 'function') {
        return result(dispatch, getState);
      }

      return result;
    });
    const productIds = ['prod1', 'prod2'];
    const defaultListItems = [{
      quantity: 1,
      notes: null,
      productId: productIds[0],
    },
    {
      quantity: 1,
      notes: null,
      productId: productIds[1],
    }];

    beforeEach(() => {
      jest.clearAllMocks();

      // Reset selector return values
      mockedGetFavoritesProductsIdsReturnValue = productIds;
      mockedGetFavoritesCountReturnValue = productIds.length;
      mockedGetProductRelativesOnFavoritesReturnValue = [];
      mockedGetFavoritesProductsReturnValue = {
        byList: {
          DEFAULT: {
            items: defaultListItems,
            isFetching: false,
          },
        },
      };
      mockedMakeGetFavoritesReturnValue = jest.fn().mockReturnValue(defaultListItems);
    });

    describe('appDidStart$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(appDidStart$)).toBe(1);
      });

      it('should not return any value', async () => {
        await expect(invoke(appDidStart$, {
          dispatch,
          getState,
        })).resolves.toBeUndefined();
      });

      it('should set up pipeline dependencies correctly', () => {
        invoke(appDidStart$, {
          dispatch,
          getState,
        });

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

      it('should fetch favorites', async () => {
        await invoke(appDidStart$, {
          dispatch,
          getState,
        });

        expect(fetchFavoritesListsWithItems).toHaveBeenCalledTimes(1);
        expect(fetchFavoritesListsWithItems).toHaveBeenCalledWith(false);
        expect(dispatch).toHaveBeenCalledTimes(3);
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
        // eslint-disable-next-line extra-rules/no-single-line-objects
        await invoke(favoritesWillEnter$, { dispatch, getState });

        expect(fetchFavoritesListsWithItems).toHaveBeenCalledTimes(1);
        expect(fetchFavoritesListsWithItems).toHaveBeenCalledWith(true);
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    describe('shouldFetchFreshFavorites$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(shouldFetchFreshFavorites$)).toBe(1);
      });

      it('should not return any value', async () => {
        await expect(invoke(shouldFetchFreshFavorites$, { dispatch })).resolves.toBeUndefined();
      });

      it('should fetch fresh favorites without using the cache', async () => {
        await invoke(shouldFetchFreshFavorites$, {
          dispatch,
          getState,
        });

        expect(fetchFavoritesListsWithItems).toHaveBeenCalledTimes(1);
        expect(fetchFavoritesListsWithItems).toHaveBeenCalledWith(true);
        expect(dispatch).toHaveBeenCalledTimes(3);
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
          action: addProductToFavorites('prod1', mockedDefaultListId),
          dispatch,
          getState,
        });
        expect(getState).toHaveBeenCalledTimes(1);
        expect(getFavoritesProducts).toHaveBeenCalledWith(getState());
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(cancelRequestSyncFavorites(0, mockedDefaultListId));
        expect(dispatch).toHaveBeenCalledTimes(1);
      });

      it('should proceed and dispatch an error if the product is not yet on the list and the limit is reached', () => {
        const favoritesLimit = mockedFavoritesLimit;

        const productId = 'prod3';
        mockedFavoritesLimit = 2;
        mockedGetFavoritesCountByListReturnValue = 2;

        invoke(addProductToFavoritesDebounced$, {
          action: addProductToFavorites(productId, 'DEFAULT'),
          dispatch,
          getState,
        });

        expect(getState).toHaveBeenCalledTimes(1);
        expect(getFavoritesProducts).toHaveBeenCalledWith(getState());
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);

        expect(mockedMakeGetFavoritesCountByList).toHaveBeenCalledWith(getState());
        expect(mockedMakeGetFavoritesCountByList).toHaveBeenCalledTimes(1);
        expect(mockedMakeGetFavoritesCountByList)
          .toHaveReturnedWith(mockedGetFavoritesCountByListReturnValue);

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

        expect(getState).toHaveBeenCalledTimes(1);
        expect(getFavoritesProducts).toHaveBeenCalledWith(getState());
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(mockedMakeGetFavoritesCountByList).toHaveBeenCalledWith(getState());
        expect(mockedMakeGetFavoritesCountByList).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenCalledWith(requestAddFavorites(productId));
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('updateProductInFavoritesDebounced$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(updateProductInFavoritesDebounced$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(updateProductInFavoritesDebounced$, {
          action: updateProductInFavorites('prod3'),
          dispatch,
          getState,
        })).toBeUndefined();
      });

      it('should proceed and dispatch an add request if all is good', () => {
        const productId = 'prod3';
        invoke(updateProductInFavoritesDebounced$, {
          action: updateProductInFavorites(productId),
          dispatch,
          getState,
        });
        expect(dispatch).toHaveBeenCalledWith(requestUpdateFavorites(productId));
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('removeProductFromFavoritesDebounced$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(removeProductFromFavoritesDebounced$)).toBe(1);
      });

      it('should not return any value', () => {
        expect(invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', true, mockedDefaultListId),
          dispatch,
          getState,
        })).toBeUndefined();
        expect(invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', false, mockedDefaultListId),
          dispatch,
          getState,
        })).toBeUndefined();
      });

      it('should not do anything if no products are on the list and currently fetching', () => {
        mockedGetFavoritesCountReturnValue = 0;
        mockedGetFavoritesProductsReturnValue.isFetching = true;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', false, mockedDefaultListId),
          dispatch,
          getState,
        });

        expect(getFavoritesCount).toHaveBeenCalledTimes(1);
        expect(makeGetProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledTimes(1);
      });

      it('should idle-sync when no products are on the list and not fetching', () => {
        mockedGetFavoritesCountReturnValue = 0;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites('prod1', false, mockedDefaultListId),
          dispatch,
          getState,
        });

        expect(getFavoritesCount).toHaveBeenCalledTimes(1);
        expect(makeGetProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(idleSyncFavorites(mockedDefaultListId));
      });

      it('should dispatch a remove request for each relative', () => {
        const productId = 'prod0';
        const mock = jest.fn(() => productIds);
        makeGetProductRelativesOnFavorites.mockReturnValueOnce(mock);

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites(productId, true, mockedDefaultListId),
          dispatch,
          getState,
        });

        // Expect multiple remove requests to be dispatched
        expect(makeGetProductRelativesOnFavorites).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(dispatch.mock.calls[1][0]).toEqual(
          requestRemoveFavorites(productIds[0], mockedDefaultListId)(dispatch, getState)
        );
        expect(dispatch.mock.calls[3][0]).toEqual(
          requestRemoveFavorites(productIds[1], mockedDefaultListId)(dispatch, getState)
        );
      });

      it('should cancel the remove request if the product is not on the list', () => {
        const productId = 'prod0';
        mockedGetProductRelativesOnFavoritesReturnValue = productIds;

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites(productId, false, mockedDefaultListId),
          dispatch,
          getState,
        });

        // Don't expect any remove requests to be triggered
        expect(makeGetProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(cancelRequestSyncFavorites(0, mockedDefaultListId));
      });

      it('should request the removal of the single favorite item', () => {
        const productId = 'prod0';
        mockedGetFavoritesProductsReturnValue = {
          byList: {
            DEFAULT: {
              items: [
                ...mockedGetFavoritesProductsReturnValue.byList.DEFAULT.items,
                {
                  productId,
                  quantity: 1,
                  notes: null,
                },
              ],
            },
          },
        };

        const mock = jest.fn(() => productIds);
        makeGetProductRelativesOnFavorites.mockReturnValueOnce(mock);

        invoke(removeProductFromFavoritesDebounced$, {
          action: removeProductFromFavorites(productId, false, mockedDefaultListId),
          dispatch,
          getState,
        });

        // Only one removal request is expected
        expect(makeGetProductRelativesOnFavorites).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch.mock.calls[1][0]).toEqual(
          requestRemoveFavorites(productId, mockedDefaultListId)(dispatch, getState)
        );
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

      it('should not return any value', async () => {
        await expect(invoke(refreshFavorites$, {
          dispatch,
          action: { listId: mockedDefaultListId },
          getState,
        })).resolves.toBeUndefined();
      });

      it('should refresh favorites by fetching them without using the cache', async () => {
        await invoke(refreshFavorites$, {
          dispatch,
          action: { listId: mockedDefaultListId },
          getState,
        });

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
          action: requestAddFavorites(productId, mockedDefaultListId),
          dispatch,
          getState,
        }])).toBeUndefined();
        expect(await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites(productId, mockedDefaultListId),
          dispatch,
          getState,
        },
        {
          action: requestUpdateFavorites(productId, mockedDefaultListId),
          dispatch,
          getState,
        },
        {
          action: requestRemoveFavorites(productId, mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }])).toBeUndefined();
      });

      it('should cancel all redundant requests', async () => {
        const productId = 'prod1';

        // Add and remove the same product to make both redundant
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites(productId, mockedDefaultListId),
          dispatch,
          getState,
        },
        {
          action: requestRemoveFavorites(productId, mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }]);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith(cancelRequestSyncFavorites(2, mockedDefaultListId));
      });

      it('should filter out duplicated add requests', async () => {
        const productId = 'prod1';

        // Add the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites(productId, mockedDefaultListId),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites(productId, mockedDefaultListId),
          dispatch,
          getState,
        }]);

        await flushPromises();

        // One cancel and one add action call as well as one idle-sync afterwards
        expect(addFavorites).toHaveBeenCalledTimes(1);
        expect(addFavorites.mock.calls[0][0]).toBe(productId);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch.mock.calls[0][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[1][0]).toEqual(idleSyncFavorites(mockedDefaultListId));
      });

      it('should filter out duplicated remove requests', async () => {
        const productId = 'prod1';

        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestRemoveFavorites(productId, mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites(productId, mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }]);

        await flushPromises();

        // One cancel and one add action call as well as one idle-sync afterwards
        expect(removeFavorites).toHaveBeenCalledTimes(1);
        expect(removeFavorites.mock.calls[0][0]).toBe(productId);
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(dispatch.mock.calls[2][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[3][0]).toEqual(idleSyncFavorites(mockedDefaultListId));
      });

      it('should not filter out unique add or remove requests', async () => {
        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3', mockedDefaultListId),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod4', mockedDefaultListId),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod1', mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod2', mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }]);

        await flushPromises();

        // Only dispatch add and remove actions, no cancellation
        expect(addFavorites).toHaveBeenCalledTimes(2);
        expect(addFavorites.mock.calls[0][0]).toBe('prod3');
        expect(addFavorites.mock.calls[1][0]).toBe('prod4');
        expect(removeFavorites).toHaveBeenCalledTimes(2);
        expect(removeFavorites.mock.calls[0][0]).toBe('prod1');
        expect(removeFavorites.mock.calls[1][0]).toBe('prod2');
        expect(dispatch).toHaveBeenCalledTimes(7);
        expect(dispatch.mock.calls[2][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[3][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[4][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[5][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[6][0]).toEqual(idleSyncFavorites(mockedDefaultListId));
      });

      it('should filter out duplicated update requests', async () => {
        const productId = 'prod1';

        // Add the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestUpdateFavorites(productId, mockedDefaultListId, 2),
          dispatch,
          getState,
        }, {
          action: requestUpdateFavorites(productId, mockedDefaultListId, 3),
          dispatch,
          getState,
        }]);

        await flushPromises();

        // One cancel and one add action call as well as one idle-sync afterwards
        expect(updateFavorites).toHaveBeenCalledTimes(1);
        expect(updateFavorites.mock.calls[0][0]).toBe(productId);
        expect(updateFavorites.mock.calls[0][1]).toBe(mockedDefaultListId);
        expect(updateFavorites.mock.calls[0][2]).toBe(3);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch.mock.calls[0][0]).toEqual(updateFavorites());
        expect(dispatch.mock.calls[1][0]).toEqual(idleSyncFavorites(mockedDefaultListId));
      });

      it('should properly handle conflicts and duplicates when they occur at once', async () => {
        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3', mockedDefaultListId),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod4', mockedDefaultListId),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod4', mockedDefaultListId), // duplicated
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod1', mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }, {
          action: requestAddFavorites('prod1', mockedDefaultListId), // conflict
          dispatch,
          getState,
        }, {
          action: requestRemoveFavorites('prod2', mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }]);

        await flushPromises();

        // Cancel three calls (conflict -> 2 + duplicate -> 1 => 3), handle the rest
        expect(addFavorites).toHaveBeenCalledTimes(2);
        expect(addFavorites.mock.calls[0][0]).toBe('prod3');
        expect(addFavorites.mock.calls[1][0]).toBe('prod4');
        expect(removeFavorites).toHaveBeenCalledTimes(1);
        expect(removeFavorites.mock.calls[0][0]).toBe('prod2');
        expect(dispatch).toHaveBeenCalledTimes(7);
        expect(dispatch.mock.calls[2][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[3][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[4][0]).toEqual(
          cancelRequestSyncFavorites(2, mockedDefaultListId)
        );
        expect(dispatch.mock.calls[5][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[6][0]).toEqual(idleSyncFavorites(mockedDefaultListId));
      });

      it('should not break on any failing request', async () => {
        dispatch.mockImplementation(async (action) => {
          if (
            action === addFavorites() ||
            action === removeFavorites() ||
            action === updateFavorites()) {
            throw new Error('Failed to add/remove favorite');
          }
        });

        // Remove the same product twice
        await expect(invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3'),
          dispatch,
          getState,
        },
        {
          action: requestUpdateFavorites('prod3'),
          dispatch,
          getState,
        },
        {
          action: requestRemoveFavorites('prod1')(dispatch, getState),
          dispatch,
          getState,
        }])).resolves.toBeUndefined();
      });

      it('should dispatch only the requests and one idle-sync if any error occurs', async () => {
        dispatch.mockImplementation(async (action) => {
          if (
            action === addFavorites() ||
            action === updateFavorites() ||
            action === removeFavorites()) {
            throw new Error('Failed to add/remove favorite');
          }

          if (typeof action === 'function') {
            return action(dispatch, getState);
          }

          return action;
        });

        // Remove the same product twice
        await invoke(didReceiveFlushFavoritesBuffer$, [{
          action: requestAddFavorites('prod3', mockedDefaultListId),
          dispatch,
          getState,
        },
        {
          action: requestUpdateFavorites('prod2', mockedDefaultListId, 3),
          dispatch,
          getState,
        },
        {
          action: await requestRemoveFavorites('prod1', mockedDefaultListId)(dispatch, getState),
          dispatch,
          getState,
        }]);

        await flushPromises();
        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch.mock.calls[1][0]).toEqual(addFavorites());
        expect(dispatch.mock.calls[2][0]).toEqual(updateFavorites());
        expect(dispatch.mock.calls[3][0]).toEqual(removeFavorites());
        expect(dispatch.mock.calls[4][0]).toEqual(idleSyncFavorites(mockedDefaultListId));
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
