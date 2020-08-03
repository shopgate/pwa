import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_REMOVE_FAVORITES_LIST } from '../constants/Pipelines';
import { SUCCESS_REMOVE_FAVORITES_LIST } from '../constants';

/**
 * Adds a new favorite list.
 * @param {string} listId Id of the wishlist.
 * @returns {Function} A redux thunk.
 */
function removeFavoritesList(listId) {
  return async (dispatch) => {
    const request = new PipelineRequest(SHOPGATE_USER_REMOVE_FAVORITES_LIST)
      .setInput({ favoritesListId: listId })
      .setRetries(0)
      .dispatch();

    try {
      await request;
      dispatch({
        type: SUCCESS_REMOVE_FAVORITES_LIST,
        listId,
      });
    } catch (_) {
      // Fail silently
    }
  };
}

export default removeFavoritesList;
