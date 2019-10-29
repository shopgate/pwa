/**
 * Determines if an item has expired and therefore should fetch or re-fetch it's data.
 * @param {Object} item The item to determine if it has expired.
 * @return {boolean}
 */
export function hasExpired(item) {
  if (!item.isFetching) {
    // If the expiry date has expired or is set to 0 (initial value).
    if (item.expires === 0 || (item.expires && item.expires > 0 && item.expires < Date.now())) {
      return true;
    }
  }

  return false;
}
