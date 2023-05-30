import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import { successRemoveFavorites, errorRemoveFavorites } from '../action-creators';

/**
 * Removes a single product from the favorite list using the `deleteFavorites` pipeline.
 * @param {string} productId Id of the product to be deleted.
 * @param {string} listId Id of the list to be deleted.
 * @param {number} quantity Quantity of the favorite
 * @param {string} notes Notes of the favorite
 * @returns {Function} A redux thunk.
 */
function removeFavorites(productId, listId, quantity, notes) {
  return async (dispatch, getState) => {
    // Fallback for deprecated calls without list id.
    const { lists } = getState().favorites.lists;
    const defaultList = lists?.[0] || { id: 'DEFAULT' };
    const takenListId = listId || defaultList.id;

    const request = new PipelineRequest(SHOPGATE_USER_DELETE_FAVORITES)
      .setInput({
        productId,
        favoritesListId: takenListId,
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch(successRemoveFavorites(productId, takenListId));
    } catch (error) {
      dispatch(errorRemoveFavorites(
        productId,
        takenListId,
        error,
        quantity,
        notes
      ));
    }

    return request;
  };
}

export default removeFavorites;
