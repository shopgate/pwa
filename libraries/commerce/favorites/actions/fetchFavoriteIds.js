import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { EFAVORITE, EUNKNOWN } from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_USER_GET_FAVORITE_IDS } from '../constants/Pipelines';
import { requestFavoriteIds, receiveFavoriteIDs, errorFetchFavoriteIds } from '../action-creators';
import { makeGetFavoritesProductsByList } from '../selectors';

/**
 * Fetch favorite IDs of a favorites list action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @param {string} favoritesListId The ID of the favorites list
 * @returns {Function} A redux thunk.
 */
function fetchFavoriteIds(ignoreCache = false, favoritesListId) {
  return (dispatch, getState) => {
    const getFavoritesProductsByList = makeGetFavoritesProductsByList(() => favoritesListId);
    const data = getFavoritesProductsByList(getState());

    if (!ignoreCache && !shouldFetchData(data)) {
      return Promise.resolve(data);
    }

    dispatch(requestFavoriteIds(favoritesListId));
    return new PipelineRequest(SHOPGATE_USER_GET_FAVORITE_IDS)
      .setInput({ favoritesListId })
      .setErrorBlacklist([EFAVORITE, EUNKNOWN])
      .dispatch()
      .then(({ productIds }) => dispatch(receiveFavoriteIDs(favoritesListId, productIds)))
      .catch(err => dispatch(errorFetchFavoriteIds(favoritesListId, err)));
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavoriteIds);
