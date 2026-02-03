import { setGlobalDevModeChecks } from 'reselect';

// In Reselect v5, dev-mode checks call input selectors multiple times.
// In unit tests (where input selectors are often mocked with `mockReturnValueOnce`),
// this can cause noisy warnings/failures unrelated to the memoization behavior we want to test.
if (process.env.NODE_ENV === 'test') {
  setGlobalDevModeChecks({
    inputStabilityCheck: 'never',
    identityFunctionCheck: 'never',
  });
}

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
