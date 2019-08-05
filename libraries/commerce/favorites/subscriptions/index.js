import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { fetchProductsById } from '@shopgate/pwa-common-commerce/product';
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
import fetchFavorites from '../actions/fetchFavorites';
import addFavorites from '../actions/addFavorites';
import removeFavorites from '../actions/removeFavorites';
import {
  requestAddFavorites,
  requestRemoveFavorites,
  cancelRequestSyncFavorites,
  errorFavorites,
  idleSyncFavorites,
} from '../action-creators';
import {
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  FAVORITES_LIMIT_ERROR,
} from '../constants';
import {
  getFavoritesProductsIds,
  getFavoritesProducts,
  getFavoritesCount,
  getProductRelativesOnFavorites,
} from '../selectors';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  /** App start */
  subscribe(appDidStart$, ({ dispatch }) => {
    // Setup sync pipeline dependencies (concurrency to each other and themselves)
    pipelineDependencies.set(SHOPGATE_USER_ADD_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);
    pipelineDependencies.set(SHOPGATE_USER_DELETE_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);

    dispatch(fetchFavorites());
  });

  /** Favorites route enter */
  subscribe(favoritesWillEnter$, async ({ dispatch, getState }) => {
    await dispatch(fetchFavorites());
    const productIds = getFavoritesProductsIds(getState());
    dispatch(fetchProductsById(productIds, null, false));
  });

  /** User login / logout */
  subscribe(shouldFetchFreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites(true));
  });

  subscribe(addProductToFavoritesDebounced$, ({ action, dispatch, getState }) => {
    // Nothing to do, when the store already contains the item
    if (getFavoritesProducts(getState()).ids.find(id => id === action.productId)) {
      // Call cancel action with "zero" count, because request was even dispatched
      dispatch(cancelRequestSyncFavorites(0));
      return;
    }

    const { favorites: { limit = 100 } = {} } = appConfig;

    const count = getFavoritesCount(getState());
    if (count >= limit) {
      // Dispatch a local error only, because the request to add is prevented
      const error = new Error('Limit exceeded');
      error.code = FAVORITES_LIMIT_ERROR;
      dispatch(errorFavorites(action.productId, error));
    } else {
      dispatch(requestAddFavorites(action.productId));
    }
  });

  subscribe(removeProductFromFavoritesDebounced$, ({ action, dispatch, getState }) => {
    const count = getFavoritesCount(getState());
    if (count > 0) {
      if (action.withRelatives) {
        // Will only handle ids which are present in the store, no additional check needed
        getProductRelativesOnFavorites(getState(), { productId: action.productId })
          .forEach(id => dispatch(requestRemoveFavorites(id)));
        return;
      }

      // Avoids trying to remove something that was already removed (incoming fetch response)
      if (!getFavoritesProducts(getState()).ids.find(id => id === action.productId)) {
        // Call cancel action with "zero" count, because request was even dispatched
        dispatch(cancelRequestSyncFavorites(0));
        return;
      }

      dispatch(requestRemoveFavorites(action.productId));
    } else if (!getFavoritesProducts(getState()).isFetching) {
      // Remove should not be possible when no favorites available
      // Refresh to fix inconsistencies, by dispatching an idleSync action when not fetching
      dispatch(idleSyncFavorites(true));
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
  subscribe(refreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites(true));
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
      // Initialize data structure for each requested product id
      // -> use object because of easy access and unique keys
      if (bufferedProductIdsToSync[action.productId] === undefined) {
        bufferedProductIdsToSync[action.productId] = {
          id: action.productId,
          count: 0,
        };
      }

      if (action.type === REQUEST_ADD_FAVORITES) {
        bufferedProductIdsToSync[action.productId].count += 1;
      } else if (action.type === REQUEST_REMOVE_FAVORITES) {
        bufferedProductIdsToSync[action.productId].count -= 1;
      }
    });

    // Filter out all products that sum up to a neutral sync state
    const productIdsToSync = Object.values(bufferedProductIdsToSync)
      .filter(p => p.count !== 0);

    // Cancel filtered out requests (incoming_from_buffer - outgoing)
    const countRemoved = actionBuffer.length - productIdsToSync.length;
    if (countRemoved > 0) {
      dispatch(cancelRequestSyncFavorites(countRemoved));
    }

    if (!productIdsToSync.length) {
      // No requests are left to be processed.
      return;
    }

    try {
      // Dispatch all add or remove (delete) pipeline requests at once and wait for all to complete
      await Promise.all(productIdsToSync.map((p) => {
        if (p.count > 0) {
          return dispatch(addFavorites(p.id));
        }
        return dispatch(removeFavorites(p.id));
      }));

      // Add and delete handle success and failure already.
      // Ignore 'fetching' state and force fetch every time (fetch request can be outdated)
      dispatch(idleSyncFavorites());
    } catch (err) {
      // Errors are handled for each pipeline call. Just mark as idle here.
      // Ignore 'fetching' state and force fetch every time (fetch request can be outdated)
      dispatch(idleSyncFavorites());
    }
  });
}
