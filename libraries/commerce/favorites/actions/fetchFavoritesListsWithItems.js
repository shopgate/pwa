import { getUseGetFavoriteIdsPipeline } from '../selectors';
import fetchFavorites from './fetchFavorites';
import fetchFavoriteIds from './fetchFavoriteIds';
import fetchFavoritesList from './fetchFavoritesList';

/**
 *
 * Combine fetch favorites list action and fetch favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Function} A redux thunk.
 */
function fetchFavoritesListsWithItems(ignoreCache = false) {
  return async (dispatch, getState) => {
    const lists = await dispatch(fetchFavoritesList(ignoreCache)) || [];
    const useGetFavoriteIdsPipeline = getUseGetFavoriteIdsPipeline(getState());

    const itemPromises = lists.map((list) => {
      /**
       * In PWA6 the fetchFavoriteIds pipelines was used to retrieve the contents of the
       * favorites list. Its response doesn't contain product objects, but only product ids.
       * For compatibility reasons and simplification, the action returns an object that's similar
       * to the fetchFavorites response, so that the existing reducers can be used.
       */
      if (useGetFavoriteIdsPipeline) {
        return dispatch(fetchFavoriteIds(ignoreCache, list.id));
      }

      return dispatch(fetchFavorites(ignoreCache, list.id));
    });

    const wishlistItems = await Promise.all(itemPromises);
    return lists.map(({ id, name }, index) => ({
      id,
      name,
      itemCount: (wishlistItems[index] || {}).itemCount,
      items: (wishlistItems[index] || {}).items,
    }));
  };
}

export default fetchFavoritesListsWithItems;
