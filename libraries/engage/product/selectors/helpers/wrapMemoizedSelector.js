/**
 * Memoization test
 * @param {Function} selector selector
 * @returns {Function}
 */
export const wrapMemoizedSelector = selector => (...args) => {
  const result = selector(...args);
  if (selector(...args) !== result) {
    throw new Error('Memoization check failed.');
  }
  return result;
};
