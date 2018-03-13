import { REMOVE_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched REMOVE_ACTIVE_FILTERS action object.
 * @return {Object} The REMOVE_ACTIVE_FILTERS action.
 */
const removeActiveFilters = () => ({
  type: REMOVE_ACTIVE_FILTERS,
});

export default removeActiveFilters;
