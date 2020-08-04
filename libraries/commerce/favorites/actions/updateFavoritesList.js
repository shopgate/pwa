import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_UPDATE_FAVORITES_LIST } from '../constants/Pipelines';
import { SUCCESS_UPDATE_FAVORITES_LIST } from '../constants';

/**
 * Adds a new favorite list.
 * @param {string} listId Id of the wishlist.
 * @param {string} name Name of the wishlist.
 * @returns {Function} A redux thunk.
 */
function updateFavoritesList(listId, name) {
  return async (dispatch) => {
    const request = new PipelineRequest(SHOPGATE_USER_UPDATE_FAVORITES_LIST)
      .setInput({
        favoritesListId: listId,
        name,
      })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch({
        type: SUCCESS_UPDATE_FAVORITES_LIST,
        listId,
        name,
      });
    } catch (_) {
      // Fail silently
    }
  };
}

export default updateFavoritesList;
