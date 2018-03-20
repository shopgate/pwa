import { REQUEST_FILTERS } from '../constants';

/**
 * Creates the dispatched REQUEST_FILTERS action object.
 * @param {string} hash The product list hash.
 * @return {Object} The REQUEST_PRODUCT action.
 */
const requestFilters = hash => ({
  type: REQUEST_FILTERS,
  hash,
});

export default requestFilters;
