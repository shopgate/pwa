import { createSelector } from 'reselect';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getCurrentState } from '@shopgate/pwa-common/selectors/router';
import * as pipelines from '../constants/Pipelines';
import buildRequestFilters from '../actions/helpers/buildRequestFilters';

/**
 * Gets the filters reducer.
 * @param {Object} state The application state.
 * @return {Object}
 */
export const getFilters = state => state.filter;

/**
 * Gets the filter results.
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getFilterResults = createSelector(
  getFilters,
  filter => filter.resultsByHash
);

/**
 * Gets filters by a result hash.
 * @param {Object} state The current application state.
 * @param {Object} props The props.
 * @return {Object}
 */
export const getFiltersByHash = createSelector(
  getFilterResults,
  (state, props) => props.categoryId,
  (state, props) => props.searchPhrase,
  (state, props) => props.filters,
  (results, categoryId, searchPhrase, filters) => {
    const hash = generateResultHash({
      pipeline: pipelines.SHOPGATE_CATALOG_GET_FILTERS,
      ...categoryId && { categoryId: hex2bin(categoryId) },
      ...searchPhrase && { searchPhrase },
      ...filters && { filters: buildRequestFilters(filters) },
    }, false, false);

    return (results[hash] && results[hash].filters) || null;
  }
);

/**
 * Gets the currently active filters.
 * @returns {Object|null}
 */
export const getActiveFilters = createSelector(
  getCurrentState,
  ({ filters }) => {
    if (!filters) {
      return null;
    }

    return filters;
  }
);

/**
 * Checks if currently filters are active.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const hasActiveFilters = createSelector(
  getActiveFilters,
  activeFilters => activeFilters !== null && !!Object.keys(activeFilters).length
);

