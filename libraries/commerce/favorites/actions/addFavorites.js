import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_ADD_FAVORITES } from '../constants/Pipelines';
import { successAddFavorites, errorAddFavorites } from '../action-creators';

/**
 * Adds a single product to the favorite list using the `addFavorites` pipeline.
 * @param {string} productId Id of the product to be added.
 * @param {string} listId Id of the list to be added.
 * @param {number} quantity New favorites quantity to set
 * @param {string} notes New favorites notes to set
 * @returns {Function} A redux thunk.
 */
function addFavorites(productId, listId = null, quantity, notes) {
  return async (dispatch, getState) => {
    // Fallback for deprecated calls without list id.
    const { lists } = getState().favorites.lists;
    const defaultList = lists?.[0] || { id: 'DEFAULT' };
    const takenListId = listId || defaultList.id;

    const request = new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES)
      .setInput({
        productId,
        favoritesListId: takenListId,
        quantity,
        notes,
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch(successAddFavorites(productId, takenListId));
    } catch (error) {
      dispatch(errorAddFavorites(productId, error, takenListId));
    }

    return request;
  };
}

export default addFavorites;
