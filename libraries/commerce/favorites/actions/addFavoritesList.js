import { mutable } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SHOPGATE_USER_ADD_FAVORITES_LIST } from '../constants/Pipelines';
import { SUCCESS_ADD_FAVORITES_LIST } from '../constants';

/**
 * Adds a new favorite list.
 * @param {string} name Name of the wishlist.
 * @returns {Function} A redux thunk.
 */
function addFavoritesList(name) {
  return async (dispatch) => {
    const request = new PipelineRequest(SHOPGATE_USER_ADD_FAVORITES_LIST)
      .setInput({ name })
      .setRetries(0)
      .dispatch();

    try {
      const { id } = await request;
      dispatch({
        type: SUCCESS_ADD_FAVORITES_LIST,
        listId: id,
        name,
      });
    } catch (_) {
      // Fail silently
    }
  };
}

export default mutable(addFavoritesList);
