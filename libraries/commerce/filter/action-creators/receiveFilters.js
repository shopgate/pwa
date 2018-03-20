import { RECEIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched RECEIVE_FILTERS action object.
 * @param {string} hash The product list hash.
 * @param {Object} filters The available filters.
 * @return {Object} The RECEIVE_PRODUCT action.
 */
const receiveFilters = (hash, filters) => ({
  type: RECEIVE_FILTERS,
  hash,
  filters,
});

export default receiveFilters;
