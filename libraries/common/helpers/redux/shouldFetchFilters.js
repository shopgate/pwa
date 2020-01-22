import { isObject } from '../validation';
import { hasExpired } from './hasExpired';

/**
 * Determine if there should be a request to fetch the filter data.
 * @param {Object} item The filter object.
 * @returns {boolean}
 */
export function shouldFetchFilters(item) {
  // Get data if we no item.
  if (!item) {
    return true;
  }

  // Fetch data if we have an empty object in the store.
  if (isObject(item) && Object.keys(item).length === 0) {
    return true;
  }

  return hasExpired(item);
}
