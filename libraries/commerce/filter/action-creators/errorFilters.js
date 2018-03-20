import { ERROR_FILTERS } from '../constants';

/**
 * Creates the dispatched ERROR_FILTERS action object
 * @param {string} hash The product list hash.
 * @return {Object} The ERROR_PRODUCT action.
 */
const errorFilters = hash => ({
  type: ERROR_FILTERS,
  hash,
});

export default errorFilters;
