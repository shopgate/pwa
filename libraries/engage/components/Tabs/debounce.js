// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.

/**
 * Corresponds to 10 frames at 60 Hz.
 * A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
 * @param {Function} func function
 * @param {number} wait wait time
 * @returns {Function}
 */
export default function debounce(func, wait = 166) {
  let timeout;
  // eslint-disable-next-line require-jsdoc
  function debounced(...args) {
    // eslint-disable-next-line require-jsdoc
    const later = () => {
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced;
}
