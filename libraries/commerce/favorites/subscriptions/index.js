import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { makeGetRoutePattern } from '@shopgate/pwa-common/selectors/router';
import {
  favoritesWillEnter$,
  shouldFetchFreshFavorites$,
  addProductToFavoritesDebounced$,
  removeProductFromFavoritesDebounced$,
  errorFavoritesLimit$,
  refreshFavorites$,
  didReceiveFlushFavoritesBuffer$,
} from '../streams';
import {
  SHOPGATE_USER_ADD_FAVORITES,
  SHOPGATE_USER_DELETE_FAVORITES,
} from '../constants/Pipelines';
import fetchFavoritesLists from '../actions/fetchFavoritesLists';
import addFavorites from '../actions/addFavorites';
import removeFavorites from '../actions/removeFavorites';
import {
  requestAddFavorites,
  requestRemoveFavorites,
  cancelRequestSyncFavorites,
  idleSyncFavorites,
  flushFavorites,
} from '../action-creators';
import {
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  FAVORITES_PATH,
} from '../constants';
import {
  getFavoritesProducts,
  getFavoritesCount,
  makeGetProductRelativesOnFavorites,
} from '../selectors';
import fetchFavoriteIds from '../actions/fetchFavoriteIds';

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

    if (makeGetRoutePattern()(getState()) !== FAVORITES_PATH) {
      const lists = await dispatch(fetchFavoritesLists());
      lists.forEach(list => dispatch(fetchFavoriteIds(false, list.id)));
    }
  });

  /** Favorites route enter */
  subscribe(favoritesWillEnter$, async ({ dispatch }) => {
    const lists = await dispatch(fetchFavoritesLists());
    lists.forEach(list => dispatch(fetchFavoriteIds(false, list.id)));
  });

  /** User login / logout */
  subscribe(shouldFetchFreshFavorites$, async ({ dispatch }) => {
    await dispatch(flushFavorites());
    const lists = await dispatch(fetchFavoritesLists(true));
    lists.forEach(list => dispatch(fetchFavoriteIds(true, list.id)));
  });

  subscribe(addProductToFavoritesDebounced$, ({ action, dispatch, getState }) => {
    // Nothing to do, when the store already contains the item
    const activeProductInList = getFavoritesProducts(getState())
      .byList[action.listId]
      ?.ids.find(id => id === action.productId);

    if (activeProductInList) {
      // Call cancel action with "zero" count, because request was even dispatched
      dispatch(cancelRequestSyncFavorites(0, action.listId));
      return;
    }

    dispatch(requestAddFavorites(action.productId, action.listId));
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
        allOnList.forEach(id => dispatch(requestRemoveFavorites(id, action.listId)));
        return;
      }

      // Avoids trying to remove something that was already removed (incoming fetch response)
      const list = getFavoritesProducts(getState()).byList[action.listId];
      if (!list?.ids.find(id => id === action.productId)) {
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
      dispatch(fetchFavoriteIds(false, action.listId));
      return;
    }

    const lists = await dispatch(fetchFavoritesLists(true));
    lists.forEach(list => dispatch(fetchFavoriteIds(false, list.id)));
  });

  /**
   * Takes an action buffer of the request-add and request-remove favorites actions and triggers
   * Pipeline requests for all of them. Errors are handled autonomously.
   * After all pipeline requests are done it resets the favorite page's state to "idle".
   */
  subscribe(didReceiveFlushFavoritesBuffer$, async (actionBuffer) => {
    // This subscription handles bulk actions only
    if (!Array.isArray(actionBuffer) || !actionBuffer.length) {
      return;
    }

    // All actions provide the same functionality, just take the first entry
    const { dispatch } = actionBuffer[0];

    // Compute a list of product ids that were in the action buffer
    const bufferedProductIdsToSync = {};
    actionBuffer.forEach(({ action }) => {
      // Initialize data structure for each affected list.
      if (bufferedProductIdsToSync[action.listId] === undefined) {
        bufferedProductIdsToSync[action.listId] = {};
      }

      // Initialize data structure for each requested product id
      // -> use object because of easy access and unique keys
      if (bufferedProductIdsToSync[action.listId][action.productId] === undefined) {
        bufferedProductIdsToSync[action.listId][action.productId] = {
          id: action.productId,
          listId: action.listId,
          count: 0,
        };
      }

      if (action.type === REQUEST_ADD_FAVORITES) {
        bufferedProductIdsToSync[action.listId][action.productId].count += 1;
      } else if (action.type === REQUEST_REMOVE_FAVORITES) {
        bufferedProductIdsToSync[action.listId][action.productId].count -= 1;
      }
    });

    Object.keys(bufferedProductIdsToSync).forEach(async (listId) => {
      const pendingProductIdsToSync = bufferedProductIdsToSync[listId];

      // Filter out all products that sum up to a neutral sync state
      const productIdsToSync = Object.values(pendingProductIdsToSync)
        .filter(p => p.count !== 0);

      // Cancel filtered out requests (incoming_from_buffer - outgoing)
      const countRemoved = actionBuffer.length - productIdsToSync.length;
      if (countRemoved > 0) {
        dispatch(cancelRequestSyncFavorites(countRemoved, listId));
      }

      if (!productIdsToSync.length) {
        // No requests are left to be processed.
        return;
      }

      try {
        // Dispatch all add or remove (delete) pipeline requests
        // at once and wait for all to complete
        await Promise.all(productIdsToSync.map((p) => {
          if (p.count > 0) {
            return dispatch(addFavorites(p.id, listId));
          }
          return dispatch(removeFavorites(p.id, listId));
        }));

        // Add and delete handle success and failure already.
        // Ignore 'fetching' state and force fetch every time (fetch request can be outdated)
        dispatch(idleSyncFavorites(listId));
      } catch (err) {
        // Errors are handled for each pipeline call. Just mark as idle here.
        // Ignore 'fetching' state and force fetch every time (fetch request can be outdated)
        dispatch(idleSyncFavorites(listId));
      }
    });
  });
}
