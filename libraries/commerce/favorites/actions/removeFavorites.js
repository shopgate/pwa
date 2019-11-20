import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import { successRemoveFavorites, errorRemoveFavorites } from '../action-creators';

/**
 * Removes a single product from the favorite list using the `deleteFavorites` pipeline.
 * @param {string} productId Id of the product to be deleted.
 * @returns {Function} A redux thunk.
 */
function removeFavorites(productId) {
  return (dispatch) => {
    const request = new PipelineRequest(SHOPGATE_USER_DELETE_FAVORITES)
      .setInput({ productId })
      .setRetries(0)
      .dispatch();

    request
      .then(() => {
        dispatch(successRemoveFavorites(productId));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorRemoveFavorites(productId, error));
      });

    return request;
  };
}

export default removeFavorites;
