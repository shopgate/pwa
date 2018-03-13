import { RESET_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched RESET_ACTIVE_FILTERS action object.
 * @return {Object} The RESET_ACTIVE_FILTERS action.
 */
const resetActiveFilters = () => ({
  type: RESET_ACTIVE_FILTERS,
});

export default resetActiveFilters;
