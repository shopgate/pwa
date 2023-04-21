import { mutable } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_ADD_FAVORITES } from '../constants/Pipelines';
import { successAddFavorites, errorAddFavorites } from '../action-creators';
import { DEFAULT_FAVORITES_LIST_ID } from '../constants';
import {
  getHasMultipleFavoritesListsSupport,
  getFavoritesLists,
} from '../selectors';

/**
 * Adds a single product to the favorite list using the `addFavorites` pipeline.
 * @param {string} productId Id of the product to be added.
 * @param {string} [listId] Id of the list to be added.
 * @returns {Function} A redux thunk.
 */
function addFavorites(productId, listId = DEFAULT_FAVORITES_LIST_ID) {
  return (dispatch, getState) => {
    const state = getState();

    const hasMultiSupport = getHasMultipleFavoritesListsSupport(state);
    const lists = getFavoritesLists(state);

    const favoritesListId = lists.find(list => list.id === listId)?.id ?? DEFAULT_FAVORITES_LIST_ID;

    const request = new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES)
      .setInput({
        productId,
        ...hasMultiSupport ? { favoritesListId } : null,
      })
      .setRetries(0)
      .dispatch();

    request
      .then(() => {
        dispatch(successAddFavorites(productId, favoritesListId));
      })
      .catch((error) => {
        dispatch(errorAddFavorites(productId, error, favoritesListId));
      });

    return request;
  };
}

export default mutable(addFavorites);
