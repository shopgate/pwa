import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  EFAVORITE,
  EUNKNOWN,
  EBIGAPI,
  ELIMIT,
} from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_USER_GET_FAVORITES } from '../constants/Pipelines';
import {
  receiveFavorites,
  requestFavorites,
  errorFetchFavorites,
} from '../action-creators';

/**
 * Fetch favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @param {string} listId The id of the list that needs to be fetched.
 * @returns {Function} A redux thunk.
 */
function fetchFavorites(ignoreCache = false, listId = undefined) {
  return (dispatch, getState) => {
    // Fallback for deprecated calls without list id.
    const { lists } = getState().favorites.lists;
    const defaultList = lists?.[0] || { code: 'DEFAULT' };
    const takenListId = listId || defaultList.code;

    // Check cache.
    const data = getState().favorites.products.byList[takenListId];
    if (!ignoreCache && !shouldFetchData(data)) {
      return Promise.resolve(null);
    }

    const timestamp = Date.now();
    dispatch(requestFavorites(takenListId));

    return new PipelineRequest(SHOPGATE_USER_GET_FAVORITES)
      .setInput({ favoritesListId: takenListId })
      .setErrorBlacklist([EFAVORITE, EUNKNOWN, EBIGAPI, ELIMIT])
      .dispatch()
      .then((result) => {
        dispatch(receiveFavorites(result.products, timestamp, takenListId));
      })
      .catch((err) => {
        dispatch(errorFetchFavorites(err, takenListId));
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavorites);
