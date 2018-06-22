import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { getCurrentParams } from '@shopgate/pwa-common/selectors/router';
import * as pipelines from '../constants/Pipelines';
import { getCurrentCategoryId } from '../../category/selectors';

/**
 * Gets the filters reducer.
 * @param {Object} state The application state.
 * @return {Object}
 */
export const getFilters = state => state.filter;

/**
 * Gets the filter hash from the history state.
 * @param {Object} state The application state.
 * @returns {string}
 */
export const getStoredFilterHash = createSelector(
  getFilters,
  filter => filter.activeHash
);

/**
 * Gets all active filters stacks.
 * @param {Object} state The application state.
 * @returns {Array}
 */
export const getActiveFiltersStack = createSelector(
  getFilters,
  filter => filter.activeFilters
);

/**
 * Gets the currently active filters.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object|null}
 */
export const getActiveFilters = createSelector(
  getCurrentParams,
  getActiveFiltersStack,
  (params, activeFilters) => {
    let stack;

    if (params && params.categoryId) {
      // If the params contain a categoryId, it's used to search the filter stack for a match
      const paramCategoryId = hex2bin(params.categoryId) || null;
      stack = activeFilters.find(({ categoryId }) => paramCategoryId === categoryId);
    } else {
      // Otherwise the most recent entry is taken from the stack
      stack = activeFilters[activeFilters.length - 1];
    }

    if (!stack) {
      return null;
    }

    return stack.filters;
  }
);

/**
 * Gets the filter hash for the given params.
 * @param {Object} state State of the application (not used)
 * @param {Object} props Parameters that describe the list.
 * @returns {string}
 */
export const getFilterHash = createSelector(
  getStoredFilterHash,
  getCurrentCategoryId,
  getSearchPhrase,
  getActiveFilters,
  (storedHash, categoryId, searchPhrase, filters) => {
    if (storedHash) {
      return storedHash;
    }

    const hashParams = {
      pipeline: pipelines.SHOPGATE_CATALOG_GET_FILTERS,
      ...categoryId && { categoryId },
      ...searchPhrase && { searchPhrase },
      ...filters && { filters: {} },
    };

    return generateResultHash(hashParams, false);
  }
);

/**
 * Gets all the available filter stacks.
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getAvailableFiltersStack = createSelector(
  getFilters,
  filter => filter.availableFilters
);

/**
 * Gets all available filters for the given product list.
 * @param {Object} state The application state.
 * @returns {Array}
 */
export const getAvailableFilters = createSelector(
  getAvailableFiltersStack,
  getFilterHash,
  (availableFilters, hash) => {
    if (!availableFilters[hash] || !availableFilters[hash].filters) {
      return null;
    }

    return availableFilters[hash].filters;
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

/**
 * Gets the temporary stored filter settings.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getTemporaryFilters = createSelector(
  getFilters,
  filter => filter.temporaryFilters
);

/**
 * Gets the temporary stored filter settings and rounds the display amounts. The minimum amount
 * is rounded down, and the maximum amount is rounded up to the next full number.
 * @return {Object}
 */
export const getTemporaryFiltersWithRoundedDisplayAmounts = createSelector(
  getTemporaryFilters,
  (filters) => {
    // Create a clone of the filters to avoid reference issues.
    const result = {
      ...filters,
    };

    let { display_amount: displayAmount } = result;

    if (displayAmount) {
      const { minimum, maximum } = displayAmount;
      // Round the minimum an and the maximum display amounts.
      displayAmount = {
        ...displayAmount,
        minimum: Math.floor(minimum / 100) * 100,
        maximum: Math.ceil(maximum / 100) * 100,
      };
    }

    return {
      ...result,
      ...displayAmount && { display_amount: displayAmount },
    };
  }
);

/**
 * Finds a single filter in a list of filters by id.
 * @param {Array} filters A list of filters.
 * @param {string} id The filter id
 * @returns {Object}
 */
export const findFilterById = (filters, id) => (
  filters.find(filter => filter.id === id)
);

/**
 * Checks if the temporary filters changed compared to the active filters.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const haveFiltersChanged = createSelector(
  getActiveFilters,
  getTemporaryFilters,
  getAvailableFilters,
  (activeFilters, tempFilters, availableFilters) => {
    if (isEqual(activeFilters, tempFilters)) {
      return false;
    }

    if (!availableFilters) {
      return false;
    }

    const numTempFilters = Object.keys(tempFilters).length;
    const numActiveFilters = !activeFilters ? 0 : Object.keys(activeFilters).length;

    // Compare each temporary filter to it's available default.
    const changedFromDefault = !Object.keys(tempFilters).every(key => (
      isEqual(
        tempFilters[key],
        findFilterById(availableFilters, key)
      )
    ));

    // Check if the filters might have been reset.
    const resetFilters = numActiveFilters > numTempFilters && numTempFilters === 0;

    return changedFromDefault || resetFilters;
  }
);

/**
 * Gets the current filter.
 * @param {Object} state The current application state.
 * @returns {Object}
 */
export const getCurrentFilterAttribute = createSelector(
  (state, props) => props.url,
  getAvailableFilters,
  (url, filters) => {
    if (!url || !filters || !filters.length) {
      return null;
    }

    return find(filters, { url });
  }
);

/**
 * Gets the current selected values for the current active filter.
 * @param {Object} state The current application state.
 * @returns {Array|null}
 */
export const getCurrentActiveValues = createSelector(
  getCurrentFilterAttribute,
  getActiveFilters,
  (currentFilter, activeFilters) => {
    if (!currentFilter) {
      return null;
    }

    const filter = activeFilters[currentFilter.id];

    if (!filter) {
      return null;
    }

    return filter.values;
  }
);
