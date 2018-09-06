import { UPDATE_FILTERS } from '../constants';

/**
 * @param {Object} filters The set filers.
 * @return {Object}
 */
export const updateFilters = filters => ({
  type: UPDATE_FILTERS,
  filters,
});
