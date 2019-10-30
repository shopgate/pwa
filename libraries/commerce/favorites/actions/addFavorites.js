import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_ADD_FAVORITES } from '../constants/Pipelines';
import { successAddFavorites, errorAddFavorites } from '../action-creators';

/**
 * Adds a single product to the favorite list using the `addFavorites` pipeline.
 * @param {string} productId Id of the product to be added.
 * @returns {Function} A redux thunk.
 */
function addFavorites(productId) {
  return dispatch => (
    new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES)
      .setInput({ productId })
      .setRetries(0)
      .dispatch()
      .then((result) => {
        dispatch(successAddFavorites(productId));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorAddFavorites(productId, error));
        return error;
      })
  );
}

export default addFavorites;
