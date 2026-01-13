import { useCallback, useEffect, useState } from 'react';

import { appConfig } from '@shopgate/engage';

const { appId } = appConfig;

/**
 * Custom hook to manage and persist state in localStorage.
 * @param {string} key The key under which the value is stored in localStorage.
 * @returns {[any, Function]} A tuple containing the stored value and a function to update it.
 */
export default function useLocalStorage(key) {
  const readValue = useCallback(() => {
    try {
      return JSON.parse(window.localStorage.getItem(`${appId}_${key}`));
    } catch (error) {
      return null;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);

  /**
   * Sets a new value both in state and in localStorage.
   * @param {any} value The new value to store.
   */
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(`${appId}_${key}`, JSON.stringify(value));
    } catch (error) {
      //
    }
  }, [key]);

  useEffect(() => {
    setValue(readValue());
  }, [readValue, setValue]);

  return [storedValue, setValue];
}

