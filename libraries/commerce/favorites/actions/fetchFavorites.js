import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  EFAVORITE,
  EUNKNOWN,
  EBIGAPI,
  ELIMIT,
} from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_USER_GET_FAVORITES } from '../constants/Pipelines';
import { DEFAULT_FAVORITES_LIST_ID } from '../constants';
import {
  receiveFavorites,
  requestFavorites,
  errorFetchFavorites,
} from '../action-creators';
import {
  getHasMultipleFavoritesListsSupport,
  makeGetFavoritesProductsByList,
  getFavoritesListState,
} from '../selectors';

/**
 * Fetch favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @param {string} [listId] The id of the list that needs to be fetched.
 * @returns {Function} A redux thunk.
 */
function fetchFavorites(ignoreCache = false, listId = DEFAULT_FAVORITES_LIST_ID) {
  return async (dispatch, getState) => {
    const state = getState();

    const hasMultiSupport = getHasMultipleFavoritesListsSupport(state);
    const lists = getFavoritesListState(state);

    const favoritesListId = lists.find(list => list.id === listId)?.id ?? DEFAULT_FAVORITES_LIST_ID;

    // Check cache.
    const getFavoritesProductsByList = makeGetFavoritesProductsByList(() => favoritesListId);
    const data = getFavoritesProductsByList(state);

    if (!ignoreCache && !shouldFetchData(data)) {
      return null;
    }

    const timestamp = Date.now();
    dispatch(requestFavorites(favoritesListId));

    const request = new PipelineRequest(SHOPGATE_USER_GET_FAVORITES)
      .setInput({
        ...hasMultiSupport ? { favoritesListId } : null,
      })
      .setErrorBlacklist([EFAVORITE, EUNKNOWN, EBIGAPI, ELIMIT])
      .dispatch();

    try {
      const result = await request;
      dispatch(receiveFavorites(result.products, timestamp, favoritesListId));
      return result;
    } catch (err) {
      dispatch(errorFetchFavorites(err, favoritesListId));
      return null;
    }
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavorites);
