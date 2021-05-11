import {
  getSubscriptionCount, invoke, resetSubscriptions, subscribe,
} from '@shopgate/pwa-common/subscriptions/mock';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import {
  addOrRemoveFavoritesDebounced$,
  favoritesWillEnter$,
  shouldFetchFreshFavorites$,
  addOrRemoveFavorites$,
} from '../streams';
import favorites from './index';
import fetchFavoriteIds from '../actions/fetchFavoriteIds';
import addFavorites from '../actions/addFavorites';
import removeFavorites from '../actions/removeFavorites';
import { SHOPGATE_USER_ADD_FAVORITES, SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import { addProductToFavorites, removeProductFromFavorites } from '../action-creators';
import { getFavoritesProducts, getProductRelativesOnFavorites } from '../selectors';

jest.mock('@shopgate/pwa-core', () => {});

jest.mock('../actions/fetchFavoriteIds', () =>
  jest.fn().mockReturnValue('fetchFavoriteIdsResult'));

// Mock all used selectors to avoid mocking the store
let mockedGetFavoritesProductsReturnValue;
let mockedGetProductRelativesOnFavoritesReturnValue;
jest.mock('../selectors', () => ({
  getFavoritesProducts: jest.fn(() => mockedGetFavoritesProductsReturnValue),
  getProductRelativesOnFavorites: jest.fn(() => mockedGetProductRelativesOnFavoritesReturnValue),
}));

jest.mock('../actions/addFavorites', () =>
  jest.fn().mockReturnValue('addFavoritesResult'));
jest.mock('../actions/removeFavorites', () =>
  jest.fn().mockReturnValue('removeFavoritesResult'));

let mockedHasFavorites = true;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasFavorites() { return mockedHasFavorites; },
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
      mockedGetProductRelativesOnFavoritesReturnValue = [];
      mockedGetFavoritesProductsReturnValue = {
        ids: productIds,
        originalIds: productIds,
        isFetching: false,
      };
    });

    describe('appDidStart$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(appDidStart$)).toBe(1);
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
        expect(fetchFavoriteIds).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(fetchFavoriteIds());
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('favoritesWillEnter$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(favoritesWillEnter$)).toBe(1);
      });

      it('should handle fetch and map favorites', () => {
        // eslint-disable-next-line extra-rules/no-single-line-objects
        invoke(favoritesWillEnter$, { dispatch, getState });

        expect(fetchFavoriteIds).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('shouldFetchFreshFavorites$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(shouldFetchFreshFavorites$)).toBe(1);
      });

      it('should fetch fresh favorites without using the cache', () => {
        invoke(shouldFetchFreshFavorites$, { dispatch });

        expect(fetchFavoriteIds).toHaveBeenCalledTimes(1);
        expect(fetchFavoriteIds).toHaveBeenCalledWith(true);
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('addOrRemoveFavoritesRequests$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(addOrRemoveFavoritesDebounced$)).toBe(1);
      });

      it('should dispatch add favorites', () => {
        mockedGetFavoritesProductsReturnValue = {
          ids: ['prod3', ...productIds],
          originalIds: productIds,
        };
        invoke(addOrRemoveFavoritesDebounced$, {
          action: addProductToFavorites('prod3'),
          dispatch,
          getState,
        });
        expect(getState).toHaveBeenCalledTimes(1);
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(addFavorites).toHaveBeenCalledWith(['prod3']);
        expect(dispatch).toHaveBeenCalledTimes(1);
      });

      it('should dispatch remove favorites', () => {
        mockedGetFavoritesProductsReturnValue = {
          ids: ['prod1'],
          originalIds: productIds,
        };
        invoke(addOrRemoveFavoritesDebounced$, {
          action: removeProductFromFavorites('prod2'),
          dispatch,
          getState,
        });
        expect(getState).toHaveBeenCalledTimes(1);
        expect(getFavoritesProducts).toHaveBeenCalledTimes(1);
        expect(removeFavorites).toHaveBeenCalledWith(['prod2']);
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('addOrRemoveFavoritesRelatives$', () => {
      it('should subscribe to the stream', () => {
        expect(getSubscriptionCount(addOrRemoveFavorites$)).toBe(1);
      });

      it('should dispatch a remove request for each relative', () => {
        const productId = 'prod0';
        mockedGetProductRelativesOnFavoritesReturnValue = productIds;

        invoke(addOrRemoveFavorites$, {
          action: removeProductFromFavorites(productId, true),
          dispatch,
          getState,
        });

        // Expect multiple remove requests to be dispatched
        expect(getProductRelativesOnFavorites).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch.mock.calls[0][0]).toEqual(
          removeProductFromFavorites(productIds, false)
        );
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
