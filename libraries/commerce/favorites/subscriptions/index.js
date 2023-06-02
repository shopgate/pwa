import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import groupBy from 'lodash/groupBy';
import ToastProvider from '@shopgate/pwa-common/providers/toast';
import {
  getLoadWishlistOnAppStartEnabled,
  getWishlistItemQuantityEnabled,
} from '@shopgate/engage/core/selectors/shopSettings';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import {
  favoritesWillEnter$,
  shouldFetchFreshFavorites$,
  addProductToFavoritesDebounced$,
  removeProductFromFavoritesDebounced$,
  errorFavoritesLimit$,
  refreshFavorites$,
  didReceiveFlushFavoritesBuffer$,
  updateProductInFavoritesDebounced$,
  favoritesDidAddItem$,
  favoritesSyncIdle$,
} from '../streams';
import {
  SHOPGATE_USER_ADD_FAVORITES,
  SHOPGATE_USER_DELETE_FAVORITES,
} from '../constants/Pipelines';
import addFavorites from '../actions/addFavorites';
import updateFavorites from '../actions/updateFavorites';
import removeFavorites from '../actions/removeFavorites';
import fetchFavoritesListsWithItems from '../actions/fetchFavoritesListsWithItems';
import fetchFavorites from '../actions/fetchFavorites';

import {
  requestAddFavorites,
  requestRemoveFavorites,
  cancelRequestSyncFavorites,
  errorFavorites,
  idleSyncFavorites,
  requestUpdateFavorites,
} from '../action-creators';
import {
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  FAVORITES_LIMIT_ERROR,
  REQUEST_UPDATE_FAVORITES,
  FAVORITES_PATH,
} from '../constants';
import {
  getFavoritesCount,
  makeGetProductRelativesOnFavorites,
  getFavoritesProducts,
} from '../selectors';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  /** App start */
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    // Setup sync pipeline dependencies (concurrency to each other and themselves)
    pipelineDependencies.set(SHOPGATE_USER_ADD_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);
    pipelineDependencies.set(SHOPGATE_USER_DELETE_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);

    const loadWishlistOnAppStartEnabled = getLoadWishlistOnAppStartEnabled(getState());
    if (loadWishlistOnAppStartEnabled) {
      await dispatch(fetchFavoritesListsWithItems(false));
    }
  });

  /** Favorites route enter */
  subscribe(favoritesWillEnter$, async ({ dispatch }) => {
    await dispatch(fetchFavoritesListsWithItems(true));
  });

  /** User login / logout */
  subscribe(shouldFetchFreshFavorites$, async ({ dispatch }) => {
    await dispatch(fetchFavoritesListsWithItems(true));
  });

  subscribe(addProductToFavoritesDebounced$, ({ action, dispatch, getState }) => {
    const state = getState();
    const wishlistItemQuantityEnabled = getWishlistItemQuantityEnabled(state);

    // Nothing to do, when the store already contains the item
    const activeProductInList = getFavoritesProducts(state)
      .byList[action.listId]
        ?.items.find(({ productId }) => productId === action.productId);

    if (activeProductInList && !wishlistItemQuantityEnabled) {
      // Call cancel action with "zero" count, because request was even dispatched
      dispatch(cancelRequestSyncFavorites(0, action.listId));
      return;
    }

    const { favorites: { limit = 100 } = {} } = appConfig;

    const count = getFavoritesCount(state);
    if (count >= limit) {
      // Dispatch a local error only, because the request to add is prevented
      const error = new Error('Limit exceeded');
      error.code = FAVORITES_LIMIT_ERROR;
      dispatch(errorFavorites(action.productId, error));
    } else {
      dispatch(requestAddFavorites(action.productId, action.listId, action.quantity, action.notes));
    }
  });

  subscribe(updateProductInFavoritesDebounced$, ({ action, dispatch }) => {
    dispatch(requestUpdateFavorites(
      action.productId, action.listId, action.quantity, action.notes
    ));
  });

  subscribe(removeProductFromFavoritesDebounced$, ({ action, dispatch, getState }) => {
    const count = getFavoritesCount(getState());
    if (count > 0) {
      if (action.withRelatives) {
        // Will only handle ids which are present in the store, no additional check needed
        const allOnList = makeGetProductRelativesOnFavorites(() => action.listId)(
          getState(),
          { productId: action.productId }
        );

        allOnList.forEach(id =>
          dispatch(requestRemoveFavorites(id, action.listId)));
        return;
      }

      // Avoids trying to remove something that was already removed (incoming fetch response)
      const list = getFavoritesProducts(getState()).byList[action.listId];
      if (!list?.items.find(({ productId }) => productId === action.productId)) {
        // Call cancel action with "zero" count, because request was even dispatched
        dispatch(cancelRequestSyncFavorites(0, action.listId));
        return;
      }

      dispatch(requestRemoveFavorites(action.productId, action.listId));
    } else if (!getFavoritesProducts(getState()).byList[action.listId]?.isFetching) {
      // Remove should not be possible when no favorites available
      // Refresh to fix inconsistencies, by dispatching an idleSync action when not fetching
      dispatch(idleSyncFavorites(action.listId));
    }
  });

  // Catch local limit errors (backend errors are handled autonomously)
  subscribe(errorFavoritesLimit$, ({ dispatch }) => {
    dispatch(showModal({
      confirm: null,
      dismiss: 'modal.ok',
      title: 'modal.title_error',
      message: 'favorites.error_limit',
    }));
  });

  /**
   * Request after N seconds since last add or remove request to make sure
   * backend did actually save it
   */
  subscribe(refreshFavorites$, async ({ dispatch, action }) => {
    if (action.listId) {
      dispatch(fetchFavorites(true, action.listId));
      return;
    }

    await dispatch(fetchFavoritesListsWithItems(true));
  });

  /**
   * Takes an action buffer of the request-add, request-remove and request-update favorites actions
   * and triggers Pipeline requests for all of them. Errors are handled autonomously.
   * After all pipeline requests are done it resets the favorite page's state to "idle".
   */
  subscribe(didReceiveFlushFavoritesBuffer$, async (actionBuffer) => {
    // This subscription handles bulk actions only
    if (!Array.isArray(actionBuffer) || !actionBuffer.length) {
      return;
    }
    LoadingProvider.setLoading(FAVORITES_PATH);

    // All actions provide the same functionality, just take the first entry
    const { dispatch } = actionBuffer[0];

    // Group all buffered actions by listId and productID
    const actions = actionBuffer.map(({ action }) => action);
    const actionsByListAndProduct = groupBy(actions, (({ listId, productId }) => `${listId}-${productId}}`));
    const idleLists = [];

    await Object.values(actionsByListAndProduct).forEach(async (groupedActions) => {
      const [{
        productId,
        listId,
        quantity,
        notes,
      } = {}] = groupedActions;

      const updateActions = groupedActions
        .filter(action => action.type === REQUEST_UPDATE_FAVORITES);
      const addActions = groupedActions
        .filter(action => action.type === REQUEST_ADD_FAVORITES);
      const removeActions = groupedActions
        .filter(action => action.type === REQUEST_REMOVE_FAVORITES);

      try {
        // If there are any update actions we only dispatch the last one
        if (updateActions.length > 0) {
          const [lastUpdateAction] = updateActions.slice(-1);
          await dispatch(updateFavorites(
            lastUpdateAction.productId,
            lastUpdateAction.listId,
            lastUpdateAction.quantity,
            lastUpdateAction.notes
          ));
        }

        // Sum up all adds and removes, based on sum dispatch add / remove
        const addRemoveBalance = addActions.length - removeActions.length;
        if (addRemoveBalance > 0) {
          await dispatch(addFavorites(productId, listId, quantity, notes));
        }
        if (addRemoveBalance < 0) {
          await dispatch(removeFavorites(productId, listId, quantity, notes));
        }

        if (updateActions.length === 0 && addRemoveBalance === 0) {
          dispatch(cancelRequestSyncFavorites(groupedActions.length, listId));
        } else if (!idleLists.includes(listId)) {
          idleLists.push(listId);
          await dispatch(idleSyncFavorites(listId));
        }
      } catch (error) {
        if (!idleLists.includes(listId)) {
          idleLists.push(listId);
          await dispatch(idleSyncFavorites(listId));
        }
      }
    });
  });

  subscribe(favoritesSyncIdle$, () => {
    LoadingProvider.resetLoading(FAVORITES_PATH);
  });

  subscribe(favoritesDidAddItem$, ({ events }) => {
    const shouldShowToast = true;
    if (shouldShowToast) {
      events.emit(ToastProvider.ADD, {
        id: 'favorites.added',
        message: 'favorites.added',
      });
    }
  });
}
