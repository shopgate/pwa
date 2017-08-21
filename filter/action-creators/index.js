import {
  REQUEST_FILTERS,
  RECEIVE_FILTERS,
  ERROR_FILTERS,
  ADD_ACTIVE_FILTERS,
  SET_ACTIVE_FILTERS,
  SLICE_ACTIVE_FILTERS,
  MERGE_TEMPORARY_FILTERS,
  SET_TEMPORARY_FILTERS,
  REMOVE_TEMPORARY_FILTER,
} from '../constants';

/**
 * Creates the dispatched REQUEST_FILTERS action object.
 * @param {string} hash The product list hash.
 * @return {Object} The REQUEST_PRODUCT action.
 */
export const requestFilters = hash => ({
  type: REQUEST_FILTERS,
  hash,
});

/**
 * Creates the dispatched RECEIVE_FILTERS action object.
 * @param {string} hash The product list hash.
 * @param {Object} filters The available filters.
 * @return {Object} The RECEIVE_PRODUCT action.
 */
export const receiveFilters = (hash, filters) => ({
  type: RECEIVE_FILTERS,
  hash,
  filters,
});

/**
 * Creates the dispatched ERROR_FILTERS action object
 * @param {string} hash The product list hash.
 * @return {Object} The ERROR_PRODUCT action.
 */
export const errorFilters = hash => ({
  type: ERROR_FILTERS,
  hash,
});

/**
 * Creates the dispatched ADD_ACTIVE_FILTERS action object.
 * @return {Object} The ADD_ACTIVE_FILTERS action.
 */
export const addActiveFilters = () => ({
  type: ADD_ACTIVE_FILTERS,
});

/**
 * Creates the dispatched SLICE_ACTIVE_FILTERS action object.
 * @param {number} version Version number of the active filters that should be checked out.
 * @return {Object} The SLICE_ACTIVE_FILTERS action.
 */
export const sliceActiveFilters = version => ({
  type: SLICE_ACTIVE_FILTERS,
  version,
});

/**
 * Creates the dispatched SET_ACTIVE_FILTERS action object.
 * @param {Object} activeFilters Active filters.
 * @returns {Object} The SET_ACTIVE_FILTERS action.
 */
export const setActiveFilters = activeFilters => ({
  type: SET_ACTIVE_FILTERS,
  activeFilters,
});

/**
 * Creates the dispatched MERGE_TEMPORARY_FILTERS action object.
 * @param {Object} temporaryFilters Temporary filters.
 * @returns {Object} The MERGE_TEMPORARY_FILTERS action.
 */
export const mergeTemporaryFilters = temporaryFilters => ({
  type: MERGE_TEMPORARY_FILTERS,
  temporaryFilters,
});

/**
 * Creates the dispatched SET_TEMPORARY_FILTERS action object.
 * @param {Object} temporaryFilters Temporary filters.
 * @returns {Object} The SET_TEMPORARY_FILTERS action.
 */
export const setTemporaryFilters = temporaryFilters => ({
  type: SET_TEMPORARY_FILTERS,
  temporaryFilters,
});

/**
 * Creates the dispatched REMOVE_TEMPORARY_FILTER action object.
 * @param {string} id A filter attribute id.
 * @param {number} index The index of the appropriate value.
 * @returns {Object} The REMOVE_TEMPORARY_FILTER action.
 */
export const removeTemporaryFilter = (id, index = null) => ({
  type: REMOVE_TEMPORARY_FILTER,
  id,
  index,
});
