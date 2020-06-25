// @flow
import { type Location } from '../locations.types';

/**
 * Check if product inventory is orderable.
 * @param {Object} location The location to check.
 * @returns {boolean}
 */
export function isProductAvailable(location: Location = {}) {
  const {
    productInventory: {
      isAvailable = false,
      visible = 0,
    } = {},
    isComingSoon,
  } = location;

  if (isComingSoon) {
    return false;
  }

  if (isAvailable === false) {
    return false;
  }

  if (visible === null) {
    // Blind mode
    return true;
  }
  return visible > 0;
}
