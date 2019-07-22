import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_ADD_FAVORITES } from '../constants/Pipelines';
import { successAddFavorites, errorAddFavorites } from '../action-creators';

/**
 * Adds a single product to the favorite list using the `addFavorites` pipeline.
 * @param {string} productId Id of the product to be added.
 * @returns {Promise} Dispatched PipelineRequest.
 */
export default productId => async (dispatch) => {
  let result;
  try {
    result = await new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES)
      .setInput({ productId })
      .setRetries(0)
      .dispatch();

    dispatch(successAddFavorites(productId));
  } catch (err) {
    logger.error(err);
    dispatch(errorAddFavorites(productId, err));
  }

  return result;
};
