import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { ELIMIT } from '@shopgate/pwa-core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import * as pipelines from '../constants/Pipelines';
import {
  requestAddFavorites,
  requestRemoveFavorites,
  errorFavorites,
} from '../action-creators';
import {
  getProductRelativesOnFavorites,
  getFavoritesCount,
} from '../selectors/';

const { favorites: { limit = 100 } = {} } = appConfig;

/**
 * Add favorites action.
 * @param {string} productId Product identifier.
 * @returns {Promise} PipelineRequest dispatch.
 */
const addFavorites = productId => (dispatch, getState) => {
  const count = getFavoritesCount(getState());
  if (count > limit) {
    const error = new Error('Limit exceeded');
    error.code = ELIMIT;
    dispatch(errorFavorites(productId, error));
    return;
  }

  new PipelineRequest(pipelines.SHOPGATE_USER_ADD_FAVORITES)
    .setInput({ productId })
    .setRetries(0)
    .dispatch()
    .then(() => {
      dispatch(requestAddFavorites(productId));
    })
    .catch((error) => {
      dispatch(errorFavorites(productId, error));
    });
};
/**
 * Removes single product from favorites.
 * @param {string} productId Product id.
 * @param {Function} dispatch Dispatch function.
 */
const removeProductFromFavorites = (productId, dispatch) => {
  new PipelineRequest(pipelines.SHOPGATE_USER_DELETE_FAVORITES)
    .setInput({ productId })
    .setRetries(0)
    .dispatch()
    .then(() => {
      dispatch(requestRemoveFavorites(productId));
    })
    .catch((error) => {
      dispatch(errorFavorites(productId, error));
    });
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
