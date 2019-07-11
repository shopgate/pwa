import { logger } from '@shopgate/pwa-core';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import {
  SHOPGATE_USER_ADD_FAVORITES,
  SHOPGATE_USER_DELETE_FAVORITES,
} from '../constants/Pipelines';
import { successAddFavorites, errorAddFavorites } from '../action-creators';

/**
 * Calls addFavorites pipeline and dispatches action based on the result.
 * @param {string} productId Id of the product to be added.
 * @returns {Promise} Dispatched PipelineRequest.
 */
export default productId => (dispatch) => {
  // This pipeline is concurrent to itself and to delete
  pipelineDependencies.set(SHOPGATE_USER_ADD_FAVORITES, [
    SHOPGATE_USER_ADD_FAVORITES,
    SHOPGATE_USER_DELETE_FAVORITES,
  ]);

  const promise = new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES)
    .setInput({ productId })
    .setRetries(0)
    .dispatch();

  promise
    .then(() => {
      dispatch(successAddFavorites(productId));
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorAddFavorites(productId, err));
    });

  return promise;
};
