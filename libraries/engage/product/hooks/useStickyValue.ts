import { useRef } from 'react';

/**
 * Keeps the last loaded value while the next one is loading, so the UI does not fall back to a
 * placeholder on every change.
 * @param value The current value.
 * @param isLoading Whether the current value is still loading.
 * @param scope Identifies what the value belongs to, e.g. the product. The last value is dropped
 * when it changes.
 * @returns The current value or, while loading, the last loaded one.
 */
const useStickyValue = <T>(value: T | null, isLoading: boolean, scope?: unknown): T | null => {
  const lastValue = useRef<T | null>(value);
  const lastScope = useRef(scope);

  if (lastScope.current !== scope) {
    lastScope.current = scope;
    lastValue.current = null;
  }

  if (value !== null) {
    lastValue.current = value;
  }

  if (!isLoading) {
    return value;
  }

  return value ?? lastValue.current;
};

export default useStickyValue;
