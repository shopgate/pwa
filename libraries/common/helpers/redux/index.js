import { DEFAULT_SORT } from '../../constants/DisplayOptions';
import * as pipelines from '../../constants/Pipelines';
import { isObject } from '../validation';
import { sortObject } from '../data';

/**
 * Determines if an item has expired and therefore should fetch or re-fetch it's data.
 * @param {Object} item The item to determine if it has expired.
 * @return {boolean}
 */
export const hasExpired = (item) => {
  if (!item.isFetching) {
    // If the expiry date has expired or is set to 0 (initial value).
    if (item.expires === 0 || (item.expires && item.expires > 0 && item.expires < Date.now())) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if an item can be fetched or (only when the itemKey parameter is set) if there is a
 * certain key inside the item that is filled with data.
 * @param {Object} item The item to check.
 * @param {string} [itemKey=null] A key of a property to check additionally.
 * @param {string} [requiredCount=null] The number of required products that should be in the store.
 * @return {boolean} Whether it can be fetched.
 */
export const shouldFetchData = (item, itemKey = null, requiredCount = null) => {
  // Get data if we have none.
  if (!item) {
    return true;
  }

  // Fetch data if we have an empty object in the store.
  if (isObject(item) && Object.keys(item).length === 0) {
    return true;
  }

  // Check that the item is not fetching currently.
  if (!item.isFetching) {
    // Fetch data if the expiry date has expired or is set to 0 (initially set).
    if (item.expires === 0 || (item.expires && item.expires > 0 && item.expires < Date.now())) {
      return true;
    }

    // Check for parameters that enable sub item counting
    const checkSubItems = typeof item.totalResultCount !== 'undefined' || requiredCount !== null;

    // Check for a specific key inside items and fetch it if it's not found.
    if (checkSubItems && itemKey && Array.isArray(item[itemKey])) {
      let maxItems = requiredCount || item.totalResultCount;

      // Check if we are requesting more items that there is available.
      if (maxItems > item.totalResultCount) {
        maxItems = item.totalResultCount;
      }

      // Check if we have enough items in the store.
      if (item[itemKey].length !== maxItems) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Determine if there should be a request to fetch the filter data.
 * @param {Object} item The filter object.
 * @returns {boolean}
 */
export const shouldFetchFilters = (item) => {
  // Get data if we no item.
  if (!item) {
    return true;
  }

  // Fetch data if we have an empty object in the store.
  if (isObject(item) && Object.keys(item).length === 0) {
    return true;
  }

  return hasExpired(item);
};

/**
 * Generates a hash from an object with sorted values.
 * @param {Object} input The input object.
 * @return {string} The generated hash.
 */
export const generateSortedHash = input => JSON.stringify(sortObject(input));

/**
 * Deep compares two objects.
 * @param {Object} input1 The first object.
 * @param {Object} input2 The second object.
 * @return {boolean}
 */
export const compareObjects = (input1, input2) => (
  (generateSortedHash(input1) === generateSortedHash(input2))
);

/**
 * Generates a hash for product collection results.
 * @param {Object} params The request parameters.
 * @param {boolean} [includeSort=true] Whether to include the sorting in the hash.
 * @param {boolean} [includeFilters=true] Whether to include the filters in the hash.
 * @return {string} The generated hash.
 */
export const generateResultHash = (params, includeSort = true, includeFilters = true) => {
  const defaultParams = {
    pipeline: pipelines.SHOPGATE_CATALOG_GET_PRODUCTS,
    ...includeFilters && { filters: {} },
    ...includeSort && { sort: DEFAULT_SORT },
  };

  const mergedParams = {
    ...defaultParams,
    ...params,
  };

  const { searchPhrase } = mergedParams;

  if (searchPhrase) {
    /**
     * We trim the search phrase here, because otherwise we will create different hash and cache
     * entries for the same search term (because whitespaces don't influence the search results)
     */
    mergedParams.searchPhrase = searchPhrase.trim();
  }

  return generateSortedHash(mergedParams);
};
