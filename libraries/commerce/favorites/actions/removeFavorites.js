import { logger } from '@shopgate/pwa-core';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import {
  SHOPGATE_USER_ADD_FAVORITES,
  SHOPGATE_USER_DELETE_FAVORITES,
} from '../constants/Pipelines';
import { successRemoveFavorites, errorRemoveFavorites } from '../action-creators';

/**
 * Calls deleteFavorites pipeline and dispatches action based on the result.
 * @param {string} productId Id of the product to be added.
 * @returns {Promise} Dispatched PipelineRxequest.
 */
export default productId => (dispatch) => {
  // This pipeline is concurrent to itself and to add
  pipelineDependencies.set(SHOPGATE_USER_DELETE_FAVORITES, [
    SHOPGATE_USER_DELETE_FAVORITES,
    SHOPGATE_USER_ADD_FAVORITES,
  ]);

  // This is an exception to the rule of calling the action by the pipeline name,
  // because of consistency reasons
  const promise = new PipelineRequest(SHOPGATE_USER_DELETE_FAVORITES)
    .setInput({ productId })
    .setRetries(0)
    .dispatch();

  promise
    .then(() => {
      dispatch(successRemoveFavorites(productId));
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorRemoveFavorites(productId, err));
    });

  return promise;
};
