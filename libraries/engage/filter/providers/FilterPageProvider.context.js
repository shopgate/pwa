import { createContext } from 'react';
import noop from 'lodash/noop';

/**
 * @typedef {Object} APIFilterValue
 * @property {string} id Filter value id
 * @property {string} label Filter value label
 * @property {number} hits Number of hits for the filter value
 */
export {};

/**
 * @typedef {Object} APIFilter
 * @property {string} id Filter id
 * @property {string} label Filter label
 * @property {"range"|"multiselect"|"single_select"} type Filter type
 * @property {string} [source] Filter source
 * @property {number} [minimum] Minimum value for a range filter
 * @property {number} [maximum] Maximum value for a range filter
 * @property {APIFilterValue[]} values
 */
export {};

/**
 * @typedef {Object} RouteFilterValue
 * @property {string} id Filter value id
 * @property {string} label Filter value label
 */

/**
 * @typedef {Object} RouteFilter
 * @property {string} id Filter id
 * @property {string} label Filter label
 * @property {string} source Filter source
 * @property {"range"|"multiselect"|"single_select"} type Filter type
 * @property {RouteFilterValue[]} values Selected values for the filter
 */

/**
 * @typedef {Object.<string, RouteFilter>} RouteFilters
 * Object with the active filters for a route with filtered product list
 */
export {};

/**
 * @callback GetSelectedFilterValuesFn
 * @param {string} filterId The id of the filter
 */

/**
 * @callback UpdateSelectedFilterValuesFn
 * @param {string} filterId The id of the filter to be updated
 * @param {string[]} selectedValues The updated selected values
 * @returns {void}
 */
/**
 * @typedef {Object} FilterPageContext
 * @property {boolean} hasChanged Whether the filter selection has changed since the filters page
 * was opened
 * @property {boolean} resetPossible Whether a reset of the active filters is possible
 * @property {APIFilter[]} apiFilters List of available filters from the API
 * @property {RouteFilters} filters Object that represents the current state of all filters
 * @property {function():void} resetAllFilters Resets all filters which have been changed by the
 * user
 * @property {function():void} resetChangedFilters Resets all filters which have been changed by the
 * user since the filters page was opened
 * @property {function():void} applyFilters Applies the current filter selection to the parent route
 * with a product list to be filtered
 * @property {GetSelectedFilterValuesFn} getSelectedFilterValues Retrieves a list of currently
 * selected values for a filter
 * @property {UpdateSelectedFilterValuesFn} updateSelectedFilterValues Updates the selection for a
 * filter
 */

/** @type {import('react').Context<FilterPageContext>} */
const context = createContext({
  hasChanged: false,
  resetPossible: false,
  apiFilters: [],
  filters: {},
  resetAllFilters: noop,
  resetChangedFilters: noop,
  applyFilters: noop,
  getSelectedFilterValues: noop,
  updateSelectedFilterValues: noop,
});

export default context;

