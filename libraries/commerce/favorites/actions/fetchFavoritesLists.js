import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { getFavoritesListState, getHasMultipleFavoritesListsSupport } from '../selectors';
import { SHOPGATE_USER_GET_FAVORITES_LIST } from '../constants/Pipelines';
import { RECEIVE_FAVORITES_LISTS } from '../constants';

/**
 * Fetch favorites list action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Function} A redux thunk.
 */
function fetchFavoritesLists(ignoreCache = false) {
  return async (dispatch, getState) => {
    const hasMultiSupport = getHasMultipleFavoritesListsSupport(getState());

    if (!hasMultiSupport) {
      /**
       * If the doesn't have support for multiple favorite lists, we just mock the pipeline response
       * and don't dispatch the request. So we can keep backwards compatibility with older
       * extensions that don't support the pipeline.
       */
      const favoritesLists = [{
        id: 'DEFAULT',
        name: '',
      }];

      dispatch({
        type: RECEIVE_FAVORITES_LISTS,
        favoritesLists,
      });

      return favoritesLists;
    }

    const data = getFavoritesListState(getState());

    if (!ignoreCache && !shouldFetchData(data)) {
      return data?.lists || [];
    }

    try {
      const { favoritesLists } = await (
        new PipelineRequest(SHOPGATE_USER_GET_FAVORITES_LIST).dispatch()
      );
      dispatch({
        type: RECEIVE_FAVORITES_LISTS,
        favoritesLists,
      });

      return favoritesLists;
    } catch (err) {
      // Fail silently
      return [];
    }
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavoritesLists);
