/**
 * Checks if the given child is a descendant of the given parent.
 * @param {Object} parent The parent element.
 * @param {Object} child The child element.
 * @return {boolean}
 */
export const isDescendant = (parent, child) => {
  let node = child.parentNode;

  while (node !== null) {
    if (node === parent) return true;
    node = node.parentNode;
  }

  return false;
};

/**
 * Retrieves the offset of a element.
 * @param {Object} element The element to retrieve the offset for.
 * @returns {Object} The offset of the element contain `top` and `left` position values.
 */
export const getOffset = element => element.getBoundingClientRect();

/**
 * Calculate the height of an element including it's y-axis margins.
 * @param {HTMLElement} element The DOM element.
 * @returns {number} The absolute height of the element.
 */
export const getAbsoluteHeight = (element) => {
  // Get the styles of the element.
  const styles = window.getComputedStyle(element);
  // Isolate the y-axis margins.
  const margins = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  // Add the margins to the element's height and return it.
  return Math.ceil(element.offsetHeight + margins);
};
