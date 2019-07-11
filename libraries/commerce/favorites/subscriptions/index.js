import { ELIMIT } from '@shopgate/pwa-core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import {
  addProductsToFavoritesDebounced$,
  removeProductFromFavoritesDebounced$,
  shouldFetchFavorites$,
  shouldFetchFreshFavorites$,
  favoritesSyncIdle$,
  favoritesError$,
  didReceiveFlushFavoritesBuffer$,
} from '../streams';
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
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  FETCH_FAVORITES_THROTTLE,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
} from '../constants';
import {
  getFavoritesProducts,
  getFavoritesCount,
  getProductRelativesOnFavorites,
} from '../selectors/';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  /** App start / favorites route enter */
  subscribe(shouldFetchFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites());
  });

  /** User login / logout */
  subscribe(shouldFetchFreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites(true));
  });

  subscribe(addProductsToFavoritesDebounced$, ({ action, dispatch, getState }) => {
    const { favorites: { limit = 100 } = {} } = appConfig;

    const count = getFavoritesCount(getState());
    if (count >= limit) {
      // Simulate a pipeline limit error, which will clean up the store.
      const error = new Error('Limit exceeded');
      error.code = ELIMIT;

      // Dispatch a local error because request to add is prevented
      dispatch(errorFavorites(action.productId, error));
    } else {
      dispatch(requestAddFavorites(action.productId));
    }
  });

  // Catch limit errors (either from a network call or locally detected)
  const errorFavoritesLimit$ = favoritesError$
    .filter(({ action }) => (action.error && action.error.code === ELIMIT));
  subscribe(errorFavoritesLimit$, ({ dispatch }) => {
    dispatch(showModal({
      confirm: null,
      dismiss: 'modal.ok',
      title: 'modal.title_error',
      message: 'favorites.error_limit',
    }));
  });

  // Catch backend "add" errors (except exceeded limit)
  const errorAddFavorites$ = favoritesError$.filter(({ action }) => (
    action.type === ERROR_ADD_FAVORITES && action.error && action.error.code !== ELIMIT
  ));
  subscribe(errorAddFavorites$, ({ dispatch }) => {
    dispatch(showModal({
      confirm: null,
      dismiss: 'modal.ok',
      title: 'modal.title_error',
      message: 'favorites.error_add',
    }));
  });

  // Catch backend "delete" errors
  const errorRemoveFavorites$ = favoritesError$
    .filter(({ action }) => action.type === ERROR_REMOVE_FAVORITES);
  subscribe(errorRemoveFavorites$, ({ dispatch }) => {
    dispatch(showModal({
      confirm: null,
      dismiss: 'modal.ok',
      title: 'modal.title_error',
      message: 'favorites.error_remove',
    }));
  });

  subscribe(removeProductFromFavoritesDebounced$, ({ action, dispatch, getState }) => {
    const count = getFavoritesCount(getState());
    if (count > 0) {
      if (action.withRelatives) {
        const allIds = getProductRelativesOnFavorites(getState(), { productId: action.productId });
        allIds.forEach(id => dispatch(requestRemoveFavorites(id)));
        return;
      }

      dispatch(requestRemoveFavorites(action.productId));
    } else if (!getFavoritesProducts(getState()).isFetching) {
      // Remove should not be possible when no favorites available
      // Refresh to fix inconsistencies, by dispatching an idleSync action when not fetching
      dispatch(idleSyncFavorites(true));
    }
  });

  /**
   * Request after N seconds since last add or remove request to make sure
   * backend did actually save it
   */
  const refreshFavorites$ = favoritesSyncIdle$.debounceTime(FETCH_FAVORITES_THROTTLE);
  subscribe(refreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites(true));
  });

  /**
   * Takes an action buffer of the request-add and request-remove favorites actions and triggers
   * Pipeline requests for all of them. Errors are handled autonomously.
   * After all pipeline requests are done it resets the favorite page's state to "idle".
   */
  subscribe(didReceiveFlushFavoritesBuffer$, (actionBuffer) => {
    // This subscription handles bulk actions only
    if (!Array.isArray(actionBuffer) || !actionBuffer.length) {
      return;
    }

    // Every action has a dispatch function, they are al equal, so just take the first
    const { dispatch, getState } = actionBuffer[0];

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

    // Dispatch individual add or remove (delete) pipeline requests
    Promise.all(productIdsToSync.map(p => (
      p.count > 0 ? dispatch(addFavorites(p.id)) : dispatch(removeFavorites(p.id))
    )))
      .then(() => {
        // Add and delete handle success and failure already.
        if (!getFavoritesProducts(getState()).isFetching) {
          dispatch(idleSyncFavorites());
        }
      }).catch(() => {
        // Errors are handled for each pipeline call. Just mark as idle here.
        if (!getFavoritesProducts(getState()).isFetching) {
          dispatch(idleSyncFavorites());
        }
      });
  });
}
