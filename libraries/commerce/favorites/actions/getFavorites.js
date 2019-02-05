import fetchFavorites from './fetchFavorites';

/**
 * Get favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Promise|undefined}
 * @deprecated
 */
const getFavorites = fetchFavorites;

export default getFavorites;
