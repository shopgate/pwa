import fetchFavorites from './fetchFavorites';
import fetchFavoritesList from './fetchFavoritesList';

/**
 *
 * Combine fetch favorites list action and fetch favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Function} A redux thunk.
 */
function fetchFavoritesListsWithItems(ignoreCache = false) {
  return async (dispatch) => {
    const lists = await dispatch(fetchFavoritesList(ignoreCache)) || [];
    const itemPromises = lists.map(list => dispatch(fetchFavorites(ignoreCache, list.id)));
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
