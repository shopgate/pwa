import { SET_STORE_FINDER_SEARCH_RADIUS } from '../constants';

/**
 * Creates the dispatched SET_USER_SEARCH_POSTAL_CODE action object.
 * @param {number} radius The radius.
 * @returns {Object}
 */
const setStoreFinderSearchRadius = radius => ({
  type: SET_STORE_FINDER_SEARCH_RADIUS,
  radius,
});

export default setStoreFinderSearchRadius;
