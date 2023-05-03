import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import { SHOPGATE_USER_UPDATE_FAVORITES } from '../constants/Pipelines';
import { errorUpdateFavorites, successUpdateFavorites } from '../action-creators';
/**
 * Updates a single product on the favorite list using the `updateFavorites` pipeline.
 * @param {Object} product Id of the product to be updated.
 * @param {string} listId Id of the list to be updated.
 * @param {number} quantity New favorites quantity to set
 * @param {string} notes ew favorites notes to set
 * @returns {Function} A redux thunk.
 */
function updateFavorites(product, listId = null, quantity, notes) {
  return async (dispatch, getState) => {
    // Fallback for deprecated calls without list id.
    const { lists } = getState().favorites.lists;
    const defaultList = lists?.[0] || { id: 'DEFAULT' };
    const takenListId = listId || defaultList.id;

    const request = new PipelineRequest(SHOPGATE_USER_UPDATE_FAVORITES)
      .setInput({
        productId: product.id,
        favoritesListId: takenListId,
        ...(isNumber(quantity) ? { quantity } : {}),
        ...(isString(notes) ? { notes } : {}),
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch(successUpdateFavorites(product, takenListId));
    } catch (error) {
      dispatch(errorUpdateFavorites(product, error, takenListId));
    }

    return request;
  };
}

export default updateFavorites;
