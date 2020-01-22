import { isObject } from '../validation';

/**
 * Checks if an item can be fetched or (only when the itemKey parameter is set) if there is a
 * certain key inside the item that is filled with data.
 * @param {Object} item The item to check.
 * @param {string} [itemKey=null] A key of a property to check additionally.
 * @param {string} [requiredCount=null] The number of required products that should be in the store.
 * @return {boolean} Whether it can be fetched.
 */
export function shouldFetchData(item, itemKey = null, requiredCount = null) {
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
}
