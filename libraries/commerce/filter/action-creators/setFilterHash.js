import { SET_FILTER_HASH } from '../constants';

/**
 * Creates the dispatched SET_FILTER_HASH action object.
 * @param {Object} hash The filter hash.
 * @returns {Object} The SET_FILTER_HASH action.
 */
const setFilterHash = hash => ({
  type: SET_FILTER_HASH,
  hash,
});

export default setFilterHash;
