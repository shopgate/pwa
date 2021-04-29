import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { EFAVORITE, EUNKNOWN } from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_USER_GET_FAVORITE_IDS } from '../constants/Pipelines';
import { requestFavoriteIds, receiveFavoriteIDs, errorFetchFavoriteIds } from '../action-creators';
import { getFavoritesProducts } from '../selectors';

/**
 * Fetch favorite IDs action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Function} A redux thunk.
 */
function fetchFavoriteIds(ignoreCache = false) {
  return (dispatch, getState) => {
    const data = getFavoritesProducts(getState());

    if (!ignoreCache && !shouldFetchData(data)) {
      return Promise.resolve(data);
    }

    dispatch(requestFavoriteIds());

    return new PipelineRequest(SHOPGATE_USER_GET_FAVORITE_IDS)
      .setErrorBlacklist([EFAVORITE, EUNKNOWN])
      .dispatch()
      .then(({ productIds }) => dispatch(receiveFavoriteIDs(productIds)))
      .catch(err => dispatch(errorFetchFavoriteIds(err)));
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavoriteIds);
