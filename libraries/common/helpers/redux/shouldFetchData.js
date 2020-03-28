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

    // Check for a specific key inside items and fetch it if it's not found.
    if (itemKey && Array.isArray(item[itemKey])) {
      const {
        totalResultCount = item[itemKey].length, // fallback to original items length
      } = item;

      // 1. Fetch by requiredCount.
      if (requiredCount) {
        const assertCount = Math.min(requiredCount, totalResultCount);

        // Fetch is needed to assert N of items in store.
        if (item[itemKey].length !== assertCount) {
          return true;
        }
      }

      // 2. Sync items when totalResultCount is less
      if (!requiredCount && item[itemKey].length > totalResultCount) {
        return true;
      }
    }
  }

  return false;
}
