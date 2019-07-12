import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import { successRemoveFavorites, errorRemoveFavorites } from '../action-creators';

/**
 * Calls deleteFavorites pipeline and dispatches an action based on the result.
 * @param {string} productId Id of the product to be added.
 * @returns {Promise} Dispatched PipelineRxequest.
 */
export default productId => async (dispatch) => {
  let result;
  try {
    // This is an exception to the rule of calling the action by the pipeline name,
    // because of consistency reasons
    result = await new PipelineRequest(SHOPGATE_USER_DELETE_FAVORITES)
      .setInput({ productId })
      .setRetries(0)
      .dispatch();

    dispatch(successRemoveFavorites(productId));
  } catch (err) {
    logger.error(err);
    dispatch(errorRemoveFavorites(productId, err));
  }

  return result;
};
