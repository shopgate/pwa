import { mutable } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import { successRemoveFavorites, errorRemoveFavorites } from '../action-creators';
import { DEFAULT_FAVORITES_LIST_ID } from '../constants';
import {
  getHasMultipleFavoritesListsSupport,
  getFavoritesLists,
} from '../selectors';

/**
 * Removes a single product from the favorite list using the `deleteFavorites` pipeline.
 * @param {string} productId Id of the product to be deleted.
 * @param {string} [listId] Id of the list to be deleted.
 * @returns {Function} A redux thunk.
 */
function removeFavorites(productId, listId = DEFAULT_FAVORITES_LIST_ID) {
  return async (dispatch, getState) => {
    const state = getState();

    const hasMultiSupport = getHasMultipleFavoritesListsSupport(state);
    const lists = getFavoritesLists(state);

    const favoritesListId = lists.find(list => list.id === listId)?.id ?? DEFAULT_FAVORITES_LIST_ID;

    const request = new PipelineRequest(SHOPGATE_USER_DELETE_FAVORITES)
      .setInput({
        productId,
        ...hasMultiSupport ? { favoritesListId } : null,
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch(successRemoveFavorites(productId, favoritesListId));
    } catch (error) {
      dispatch(errorRemoveFavorites(productId, favoritesListId, error));
    }

    return request;
  };
}

export default mutable(removeFavorites);
