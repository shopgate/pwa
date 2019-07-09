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
  errorFavorites,
  idleSyncFavorites,
  shouldFlushFavoritesBuffer,
} from '../action-creators';
import {
  getProductRelativesOnFavorites,
  getFavoritesCount,
} from '../selectors/';

import {
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
} from '../constants';

const { favorites: { limit = 100 } = {} } = appConfig;

/**
 * Add favorites action.
 * @param {string} productId Product identifier.
 * @return {Function}
 */
const addFavorites = productId => (dispatch, getState) => {
  dispatch(requestAddFavorites(productId));
  const count = getFavoritesCount(getState());
  if (count > limit) {
    const error = new Error('Limit exceeded');
    error.code = ELIMIT;
    dispatch(errorFavorites(productId, error));
  }
};
/**
 * Calls Add Favorites pipeline
 * @param {string} productId Product identifier
 * @returns {Promise} PipelineRequest dispatch.
 */
const sendAddFavorite = productId => (
  new PipelineRequest(pipelines.SHOPGATE_USER_ADD_FAVORITES)
    .setInput({ productId })
    .setRetries(0)
    .dispatch()
);

/**
 * Calls Add Favorites pipeline
 * @param {string} productId Product identifier
 * @returns {Promise} PipelineRequest dispatch.
 */
const sendDeleteFavorite = productId => (
  new PipelineRequest(pipelines.SHOPGATE_USER_DELETE_FAVORITES)
    .setInput({ productId })
    .setRetries(0)
    .dispatch()
);
/**
 * Parse buffered actions and send net changes to the backend
 * @param {Object[]} bufferedActions Actions that have been buffered
 * @return {Function}
 */
const handleBufferedFavoriteActions = bufferedActions => (dispatch) => {
  const uniqueProductIds = [...new Set(bufferedActions
    .filter(action => !!action.productId)
    .map(action => action.productId))];
  const productIdsToAdd = [];
  const productIdsToRemove = [];
  uniqueProductIds.forEach((productId) => {
    const addActions = bufferedActions.filter(action => (
      productId === action.productId && REQUEST_ADD_FAVORITES === action.type
    ));
    const removeActions = bufferedActions.filter(action => (
      productId === action.productId && REQUEST_REMOVE_FAVORITES === action.type
    ));
    // push product id to productIdsToAdd array if there are more
    // add actions than remove actions for this product
    if (addActions.length > removeActions.length) {
      productIdsToAdd.push(productId);
    }
    // push product id to productIdsToRemove array if there are more
    // remove actions than add actions for this product
    if (removeActions.length > addActions.length) {
      productIdsToRemove.push(productId);
    }
    // product id is not added to either productIdsToAdd or productIdsToRemove
    // when there are as many add actions as remove actions
  });

  if (productIdsToAdd.length < 1 && productIdsToRemove.length < 1) {
    // since there are no product to add or remove bale out
    dispatch(idleSyncFavorites());
    return;
  }

  dispatch(requestSyncFavorites(productIdsToAdd, productIdsToRemove));
  const addPromises = productIdsToAdd.map(productId => sendAddFavorite(productId));
  const removePromises = productIdsToRemove
    .map(productId => sendDeleteFavorite(productId));
  Promise.all([...addPromises, ...removePromises])
    .then(() => {
      dispatch(receiveSyncFavorites(productIdsToAdd, productIdsToRemove));
    }).catch((error) => {
      dispatch(errorSyncFavorites(productIdsToAdd, productIdsToRemove, error));
    });
};

/**
 * Removes single product from favorites.
 * @param {string} productId Product id.
 * @param {Function} dispatch Dispatch function.
 */
const removeProductFromFavorites = (productId, dispatch) => {
  dispatch(requestRemoveFavorites(productId));
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

/**
 * Force the a sync of favorites by flushing buffered addFavorites and RemoveFavorites actions.
 * @return {Function}
 */
const requestSync = () => (dispatch) => {
  dispatch(shouldFlushFavoritesBuffer());
};

export {
  addFavorites,
  removeFavorites,
  handleBufferedFavoriteActions,
  requestSync,
};
