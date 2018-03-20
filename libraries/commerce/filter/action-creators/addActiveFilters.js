import { ADD_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched ADD_ACTIVE_FILTERS action object.
 * @param {Object} [params] Parameters for the action object
 * @param {string} [params.categoryId] A category id which the filters relate to
 * @param {string} [params.searchPhrase] A search phrase which the filters relate to
 * @return {Object} The ADD_ACTIVE_FILTERS action.
 */
const addActiveFilters = ({ categoryId, searchPhrase } = {}) => ({
  type: ADD_ACTIVE_FILTERS,
  ...categoryId && { categoryId },
  ...searchPhrase && { searchPhrase },
});

export default addActiveFilters;
