import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { EFAVORITE, EUNKNOWN } from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_USER_GET_FAVORITE_IDS } from '../constants/Pipelines';
import {
  receiveFavorites,
  requestFavorites,
  errorFetchFavorites,
} from '../action-creators';
import {
  getHasMultipleFavoritesListsSupport,
  makeGetFavoritesProductsByList,
} from '../selectors';

/**
 * Fetch favorite IDs of a favorites list action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @param {string} [favoritesListId] The ID of the favorites list
 * @returns {Function} A redux thunk.
 */
function fetchFavoriteIds(ignoreCache = false, favoritesListId = 'DEFAULT') {
  return (dispatch, getState) => {
    const hasMultiSupport = getHasMultipleFavoritesListsSupport(getState());
    const getFavoritesProductsByList = makeGetFavoritesProductsByList(() => favoritesListId);
    const data = getFavoritesProductsByList(getState());

    if (!ignoreCache && !shouldFetchData(data)) {
      return Promise.resolve(data);
    }

    const timestamp = Date.now();

    dispatch(requestFavorites(favoritesListId));

    return new PipelineRequest(SHOPGATE_USER_GET_FAVORITE_IDS)
      .setInput({
        ...hasMultiSupport ? { favoritesListId } : null,
      })
      .setErrorBlacklist([EFAVORITE, EUNKNOWN])
      .dispatch()
      .then(({ productIds }) => {
        /**
         * Sanitize the pipeline return value to archive compatibility with the reducers for the
         * fetchFavorites pipeline.
         */
        const items = productIds.map(productId => ({
          product: {
            id: productId,
          },
        }));

        const sanitizedResponse = {
          items,
          itemCount: items.length,
        };

        dispatch(receiveFavorites(sanitizedResponse.items, timestamp, favoritesListId));
        return sanitizedResponse;
      })
      .catch((err) => {
        dispatch(errorFetchFavorites(err, favoritesListId));
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavoriteIds);
