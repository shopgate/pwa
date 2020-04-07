import React from 'react';

/**
 * General purpose hook that allow a `React.useMemo` hook with
 * extended async support. The output contains the output value
 * from promise and a potential error object.
 * @param {Function} asyncFunction The function that will be executed to generate memoized output.
 * @param {Array} asyncFunctionDependencies
 *  A list of dependencies (same behavior as with `React.useMemo`)
 * @param {Any} initialValue The initial value that is set before promise is fulfilled.
 * @returns {Array}
 */
export function useAsyncMemo(
  asyncFunction,
  asyncFunctionDependencies = [],
  initialValue = null
) {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    /**
     * Wraps the async function as React doesn't allow direct async usage.
     */
    const fn = async () => {
      try {
        const output = await asyncFunction();
        setValue(output);
      } catch (incomingError) {
        setError(incomingError);
      }
    };
    fn();
  }, asyncFunctionDependencies);
  /* eslint-enable react-hooks/exhaustive-deps */

  return [value, error];
}
