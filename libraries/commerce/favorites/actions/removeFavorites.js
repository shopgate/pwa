import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import { successRemoveFavorites, errorRemoveFavorites } from '../action-creators';

/**
 * Removes a single product from the favorite list using the `deleteFavorites` pipeline.
 * @param {string} productId Id of the product to be deleted.
 * @param {string} listId Id of the list to be deleted.
 * @returns {Function} A redux thunk.
 */
function removeFavorites(productId, listId) {
  return async (dispatch, getState) => {
    // Fallback for deprecated calls without list id.
    const { lists } = getState().favorites.lists;
    const defaultList = lists?.[0] || { code: 'DEFAULT' };
    const takenListId = listId || defaultList.code;

    const request = new PipelineRequest(SHOPGATE_USER_DELETE_FAVORITES)
      .setInput({
        productId,
        favoritesListId: takenListId,
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch(successRemoveFavorites(productId));
    } catch (error) {
      dispatch(errorRemoveFavorites(productId, error));
    }
  };
}

export default removeFavorites;
