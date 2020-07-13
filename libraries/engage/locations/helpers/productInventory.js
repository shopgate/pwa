/**
 * Check if product inventory is orderable.
 * @param {Object} location The location to check.
 * @param {Object} inventory The location inventory to check.
 * @returns {boolean}
 */
export function isProductAvailable(location = {}, inventory = {}) {
  const { isComingSoon } = location || {};
  const {
    isAvailable = false,
    visible = 0,
  } = inventory || {};

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
