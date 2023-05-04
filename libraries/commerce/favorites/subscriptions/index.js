import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import groupBy from 'lodash/groupBy';
import {
  favoritesWillEnter$,
  shouldFetchFreshFavorites$,
  addProductToFavoritesDebounced$,
  removeProductFromFavoritesDebounced$,
  errorFavoritesLimit$,
  refreshFavorites$,
  didReceiveFlushFavoritesBuffer$,
  updateProductInFavoritesDebounced$,
} from '../streams';
import {
  SHOPGATE_USER_ADD_FAVORITES,
  SHOPGATE_USER_DELETE_FAVORITES,
} from '../constants/Pipelines';
import fetchFavorites from '../actions/fetchFavorites';
import fetchFavoritesLists from '../actions/fetchFavoritesList';
import addFavorites from '../actions/addFavorites';
import updateFavorites from '../actions/updateFavorites';
import removeFavorites from '../actions/removeFavorites';
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
} from '../constants';
import {
  getFavoritesItemsByList,
  getFavoritesCount,
  makeGetProductRelativesOnFavorites,
  makeGetProductFromFavorites,
} from '../selectors';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  /** App start */
  subscribe(appDidStart$, async ({ dispatch }) => {
    // Setup sync pipeline dependencies (concurrency to each other and themselves)
    pipelineDependencies.set(SHOPGATE_USER_ADD_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);
    pipelineDependencies.set(SHOPGATE_USER_DELETE_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);

    const lists = await dispatch(fetchFavoritesLists());
    lists.forEach(list => dispatch(fetchFavorites(false, list.id)));
  });

  /** Favorites route enter */
  subscribe(favoritesWillEnter$, async ({ dispatch }) => {
    const lists = await dispatch(fetchFavoritesLists());
    const items = lists.map(list => dispatch(fetchFavorites(true, list.id)));
    await Promise.all(items);
  });

  /** User login / logout */
  subscribe(shouldFetchFreshFavorites$, async ({ dispatch }) => {
    const lists = await dispatch(fetchFavoritesLists(true));
    lists.forEach(list => dispatch(fetchFavorites(true, list.id)));
  });

  subscribe(addProductToFavoritesDebounced$, ({ action, dispatch, getState }) => {
    // Nothing to do, when the store already contains the item
    const activeProductInList = getFavoritesItemsByList(getState())
      .byList[action.listId]
        ?.items.find(({ product }) => product.id === action.productId);

    if (activeProductInList && !appConfig.hasExtendedFavorites) {
      // Call cancel action with "zero" count, because request was even dispatched
      dispatch(cancelRequestSyncFavorites(0, action.listId));
      return;
    }

    const { favorites: { limit = 100 } = {} } = appConfig;

    const getProductFromFavorites = makeGetProductFromFavorites(action.listId, action.productId);
    const product = getProductFromFavorites(getState());

    const count = getFavoritesCount(getState());
    if (count >= limit) {
      // Dispatch a local error only, because the request to add is prevented
      const error = new Error('Limit exceeded');
      error.code = FAVORITES_LIMIT_ERROR;
      dispatch(errorFavorites(action.product.id, error));
    } else {
      dispatch(requestAddFavorites(product, action.listId));
    }
  });

  subscribe(updateProductInFavoritesDebounced$, ({ action, dispatch, getState }) => {
    const getProductFromFavorites = makeGetProductFromFavorites(action.listId, action.productId);
    const product = getProductFromFavorites(getState());

    dispatch(requestUpdateFavorites(
      product, action.listId, action.quantity, action.notes
    ));
  });

  subscribe(removeProductFromFavoritesDebounced$, ({ action, dispatch, getState }) => {
    const getProductFromFavorites = makeGetProductFromFavorites(action.listId, action.productId);
    const product = getProductFromFavorites(getState());

    const count = getFavoritesCount(getState());
    if (count > 0) {
      if (action.withRelatives) {
        // Will only handle ids which are present in the store, no additional check needed
        const allOnList = makeGetProductRelativesOnFavorites(() => action.listId)(
          getState(),
          { productId: action.productId }
        );

        allOnList.forEach(listProduct =>
          dispatch(requestRemoveFavorites(listProduct, action.listId)));
        return;
      }

      // Avoids trying to remove something that was already removed (incoming fetch response)
      const list = getFavoritesItemsByList(getState()).byList[action.listId];
      if (!list?.items.find(({ product: listProduct }) => listProduct.id === action.productId)) {
        // Call cancel action with "zero" count, because request was even dispatched
        dispatch(cancelRequestSyncFavorites(0, action.listId));
        return;
      }

      dispatch(requestRemoveFavorites(product, action.listId));
    } else if (!getFavoritesItemsByList(getState()).byList[action.listId]?.isFetching) {
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

    const lists = await dispatch(fetchFavoritesLists(true));
    lists.forEach(list => dispatch(fetchFavorites(true, list.id)));
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

    // All actions provide the same functionality, just take the first entry
    const { dispatch } = actionBuffer[0];

    // Group all buffered actions by listId and productID
    const actions = actionBuffer.map(({ action }) => action);
    const actionsByListAndProduct = groupBy(actions, (({ listId, product }) => `${listId}-${product.id}`));

    Object.values(actionsByListAndProduct).forEach(async (groupedActions) => {
      const { product } = groupedActions[0];
      const { listId } = groupedActions[0];

      const updateActions = groupedActions
        .filter(action => action.type === REQUEST_UPDATE_FAVORITES);
      const addActions = groupedActions
        .filter(action => action.type === REQUEST_ADD_FAVORITES);
      const removeActions = groupedActions
        .filter(action => action.type === REQUEST_REMOVE_FAVORITES);

      // If there are any update actions we only dispatch the last one
      if (updateActions.length > 0) {
        const [lastUpdateAction] = updateActions.slice(-1);
        await dispatch(updateFavorites(
          lastUpdateAction.product,
          lastUpdateAction.listId,
          lastUpdateAction.quantity,
          lastUpdateAction.notes
        ));
      }

      // Sum up all adds and removes, based on sum dispatch add / remove
      const addRemoveBalance = addActions.length - removeActions.length;
      if (addRemoveBalance > 0) {
        await dispatch(addFavorites(product, listId));
      }
      if (addRemoveBalance < 0) {
        await dispatch(removeFavorites(product, listId));
      }

      // Fetch after there was any update / add / remove
      if (updateActions.length > 0 || addRemoveBalance > 0 || addRemoveBalance < 0) {
        await dispatch(idleSyncFavorites(listId));
      }
    });
  });
}
