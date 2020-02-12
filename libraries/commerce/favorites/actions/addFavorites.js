import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_ADD_FAVORITES } from '../constants/Pipelines';
import { successAddFavorites, errorAddFavorites } from '../action-creators';

/**
 * Adds a single product to the favorite list using the `addFavorites` pipeline.
 * @param {string} productId Id of the product to be added.
 * @returns {Function} A redux thunk.
 */
function addFavorites(productId) {
  return (dispatch) => {
    const request = new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES)
      .setInput({ productId })
      .setRetries(0)
      .dispatch();

    request
      .then(() => {
        dispatch(successAddFavorites(productId));
      })
      .catch((error) => {
        dispatch(errorAddFavorites(productId, error));
      });

    return request;
  };
}

export default addFavorites;
