import { useRef } from 'react';

/**
 * Keeps returning the last value that was not null while a new value is loading.
 * @param value The current value, null while it is loading.
 * @returns The current value or the last loaded one.
 */
const useStickyValue = <T>(value: T | null): T | null => {
  const lastValue = useRef<T | null>(value);

  if (value !== null) {
    lastValue.current = value;
  }

  return value ?? lastValue.current;
};

export default useStickyValue;
