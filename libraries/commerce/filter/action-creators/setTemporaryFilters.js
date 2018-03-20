import { SET_TEMPORARY_FILTERS } from '../constants';

/**
 * Creates the dispatched SET_TEMPORARY_FILTERS action object.
 * @param {Object} temporaryFilters Temporary filters.
 * @returns {Object} The SET_TEMPORARY_FILTERS action.
 */
const setTemporaryFilters = temporaryFilters => ({
  type: SET_TEMPORARY_FILTERS,
  temporaryFilters,
});

export default setTemporaryFilters;
