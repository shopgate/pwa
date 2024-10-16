import { mutable } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import { SHOPGATE_USER_UPDATE_FAVORITES } from '../constants/Pipelines';
import { errorUpdateFavorites, successUpdateFavorites } from '../action-creators';
import {
  getHasMultipleFavoritesListsSupport,
  getFavoritesDefaultList,
} from '../selectors';
/**
 * Updates a single product on the favorite list using the `updateFavorites` pipeline.
 * @param {string} productId The id of the product.
 * @param {string} listId Id of the list to be updated.
 * @param {number} quantity New favorites quantity to set
 * @param {string} notes ew favorites notes to set
 * @returns {Function} A redux thunk.
 */
function updateFavorites(productId, listId = null, quantity, notes) {
  return async (dispatch, getState) => {
    const state = getState();
    const hasMultiSupport = getHasMultipleFavoritesListsSupport(state);

    // Fallback for deprecated calls without list id.
    const defaultList = getFavoritesDefaultList(state);
    const takenListId = listId || defaultList.id;

    const request = new PipelineRequest(SHOPGATE_USER_UPDATE_FAVORITES)
      .setInput({
        productId,
        ...hasMultiSupport ? { favoritesListId: takenListId } : null,
        ...(isNumber(quantity) ? { quantity } : {}),
        ...(isString(notes) ? { notes } : {}),
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch(successUpdateFavorites(productId, takenListId));
    } catch (error) {
      dispatch(errorUpdateFavorites(productId, error, takenListId));
    }

    return request;
  };
}

export default mutable(updateFavorites);
