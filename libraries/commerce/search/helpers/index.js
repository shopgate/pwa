import { SEARCH_PATH } from '../constants';

/**
 * Generate product route for navigation.
 * @param {string} query search term
 * @returns {string}
 */
export const getSearchRoute = query => `${SEARCH_PATH}?s=${encodeURIComponent(query)}`;

