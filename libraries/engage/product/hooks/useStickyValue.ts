import { useRef } from 'react';

/**
 * Keeps returning the last value that was not null while a new value is loading.
 * @param value The current value, null while it is loading.
 * @param isLoading Whether the current value is still loading.
 * @returns The current value or, while loading, the last loaded one.
 */
const useStickyValue = <T>(value: T | null, isLoading: boolean): T | null => {
  const lastValue = useRef<T | null>(value);

  if (value !== null) {
    lastValue.current = value;
  }

  if (!isLoading) {
    return value;
  }

  return value ?? lastValue.current;
};

export default useStickyValue;
