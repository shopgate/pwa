import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  EFAVORITE,
  EUNKNOWN,
  EBIGAPI,
  ELIMIT,
} from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { SHOPGATE_USER_GET_FAVORITES } from '../constants/Pipelines';
import {
  receiveFavorites,
  requestFavorites,
  errorFetchFavorites,
} from '../action-creators';
import {
  getHasMultipleFavoritesListsSupport,
  makeGetFavoritesProductsByList,
} from '../selectors';

import receiveProducts from '../../product/action-creators/receiveProducts';

/**
 * Fetch favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @param {string} listId The id of the list that needs to be fetched.
 * @returns {Function} A redux thunk.
 */
function fetchFavorites(ignoreCache = false, listId = undefined) {
  return async (dispatch, getState) => {
    // Fallback for deprecated calls without list id.
    const { lists } = getState().favorites.lists;
    const defaultList = lists?.[0] || { code: 'DEFAULT' };
    const takenListId = listId || defaultList.code;

    const hasMultiSupport = getHasMultipleFavoritesListsSupport(getState());
    const getFavoritesProductsByList = makeGetFavoritesProductsByList(() => takenListId);
    const data = getFavoritesProductsByList(getState());

    if (!ignoreCache && !shouldFetchData(data)) {
      return null;
    }

    const timestamp = Date.now();
    dispatch(requestFavorites(takenListId));

    // v2 of the getFavorites pipeline doesn't exist right now within the old services
    const pipelineVersion = hasNewServices() ? 2 : 1;

    const request = new PipelineRequest(SHOPGATE_USER_GET_FAVORITES)
      .setVersion(pipelineVersion)
      .setInput({
        ...hasMultiSupport ? { favoritesListId: takenListId } : null,
      })
      .setErrorBlacklist([EFAVORITE, EUNKNOWN, EBIGAPI, ELIMIT])
      .dispatch();

    try {
      const result = await request;

      if (pipelineVersion === 1) {
        // Convert response data based on the pipeline version
        result.items = (result?.products || []).map(product => ({
          product,
          note: null,
          quantity: 1,
        }));

        delete result.products;
      }

      dispatch(receiveProducts({
        products: result.items.map(({ product }) => product),
        fetchInventory: false,
      }));
      dispatch(receiveFavorites(result.items, timestamp, takenListId));
      return result;
    } catch (err) {
      dispatch(errorFetchFavorites(err, takenListId));
      return null;
    }
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavorites);
