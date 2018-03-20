import { MERGE_TEMPORARY_FILTERS } from '../constants';

/**
 * Creates the dispatched MERGE_TEMPORARY_FILTERS action object.
 * @param {Object} temporaryFilters Temporary filters.
 * @returns {Object} The MERGE_TEMPORARY_FILTERS action.
 */
const mergeTemporaryFilters = temporaryFilters => ({
  type: MERGE_TEMPORARY_FILTERS,
  temporaryFilters,
});

export default mergeTemporaryFilters;
