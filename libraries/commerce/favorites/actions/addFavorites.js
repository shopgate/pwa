import { mutable } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  getWishlistItemNotesEnabled,
  getWishlistItemQuantityEnabled,
} from '@shopgate/engage/core/selectors';
import { SHOPGATE_USER_ADD_FAVORITES } from '../constants/Pipelines';
import { successAddFavorites, errorAddFavorites } from '../action-creators';
import {
  getHasMultipleFavoritesListsSupport,
  getFavoritesDefaultList,
} from '../selectors';

/**
 * Adds a single product to the favorite list using the `addFavorites` pipeline.
 * @param {string} productId Id of the product to be added.
 * @param {string} listId Id of the list to be added.
 * @param {number} quantity New favorites quantity to set
 * @param {string} notes New favorites notes to set
 * @param {boolean} showToast Whether to show a confirmation toast after product was added
 * @returns {Function} A redux thunk.
 */
function addFavorites(productId, listId = null, quantity, notes, showToast = true) {
  return async (dispatch, getState) => {
    const state = getState();
    const hasMultiSupport = getHasMultipleFavoritesListsSupport(state);
    const quantityEnabled = getWishlistItemQuantityEnabled(state);
    const notesEnabled = getWishlistItemNotesEnabled(state);

    // Fallback for deprecated calls without list id.
    const defaultList = getFavoritesDefaultList(state);
    const takenListId = listId || defaultList.id;

    const request = new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES)
      .setInput({
        productId,
        ...hasMultiSupport ? { favoritesListId: takenListId } : null,
        ...quantityEnabled ? { quantity } : null,
        ...notesEnabled ? { notes } : null,
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch(successAddFavorites(productId, takenListId, showToast));
    } catch (error) {
      dispatch(errorAddFavorites(productId, error, takenListId));
    }

    return request;
  };
}

export default mutable(addFavorites);
