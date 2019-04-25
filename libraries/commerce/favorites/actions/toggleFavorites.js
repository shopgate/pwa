import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { ELIMIT } from '@shopgate/pwa-core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import * as pipelines from '../constants/Pipelines';
import {
  requestAddFavorites,
  requestRemoveFavorites,
  requestSyncFavorites,
  receiveSyncFavorites,
  errorSyncFavorites,
  idleSyncFavorites,
  errorFavorites,
} from '../action-creators';
import {
  getProductRelativesOnFavorites,
  getFavoritesProductsIds,
  getFavoritesCount,
} from '../selectors/';

const { favorites: { limit = 100 } = {} } = appConfig;

let syncPendingCount = 0;
let syncInProgress = false;

/**
 * Sends putFavorites requests. Maintains queue and throttling.
 * @returns {Function}
 */
export const requestSync = () => (dispatch, getState) => {
  // Syncing in progress. Will request next one on response.
  if (syncInProgress) {
    return;
  }
  // Nothing to sync. Dispatching idle to trigger stream.
  if (!syncPendingCount) {
    dispatch(idleSyncFavorites());
    return;
  }

  // Reset pending count since we always send entire list.
  // Whatever was added before is being synced now.
  syncPendingCount = 0;
  syncInProgress = true;

  const state = getState();
  dispatch(requestSyncFavorites());

  new PipelineRequest(pipelines.SHOPGATE_USER_PUT_FAVORITES)
    .setInput({ productIds: getFavoritesProductsIds(state) })
    .setRetries(0)
    .dispatch()
    .then(() => {
      dispatch(receiveSyncFavorites());
    })
    .catch(() => {
      dispatch(errorSyncFavorites());
    })
    .then(() => {
      syncInProgress = false;
      dispatch(requestSync());
    });
};

/**
 * Add favorites action.
 * @param {string} productId Product identifier.
 * @returns {Promise} PipelineRequest dispatch.
 */
const addFavorites = productId => (dispatch, getState) => {
  dispatch(requestAddFavorites(productId));

  const count = getFavoritesCount(getState());
  if (count > limit) {
    const error = new Error('Limit exceeded');
    error.code = ELIMIT;
    dispatch(errorFavorites(productId, error));
    return;
  }

  syncPendingCount += 1;
  dispatch(requestSync());
};
/**
 * Removes single product from favorites.
 * @param {string} productId Product id.
 * @param {Function} dispatch Dispatch function.
 */
const removeProductFromFavorites = (productId, dispatch) => {
  dispatch(requestRemoveFavorites(productId));
  syncPendingCount += 1;
  dispatch(requestSync());
};

/**
 * Remove favorites action.
 * @param {string} productId Product identifier.
 * @param {boolean} withRelatives When true relatives which are on list are also removed.
 * @returns {Promise} PipelineRequest dispatch.
 */
const removeFavorites = (productId, withRelatives = false) => (dispatch, getState) => {
  if (withRelatives) {
    const allIds = getProductRelativesOnFavorites(getState(), { productId });
    allIds.forEach(id => removeProductFromFavorites(id, dispatch));
    return;
  }
  removeProductFromFavorites(productId, dispatch);
};

export {
  addFavorites,
  removeFavorites,
};
