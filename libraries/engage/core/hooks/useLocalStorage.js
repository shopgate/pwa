import {
  useCallback, useEffect, useState, useMemo,
} from 'react';

import { appConfig } from '@shopgate/engage';

const { appId } = appConfig;

/**
 * Custom hook to manage and persist state in localStorage.
 * @param {string} key The key under which the value is stored in localStorage.
 * @param {Object} options Optional configuration object.
 * @param {*} options.initialValue The initial value to use if there is no value in localStorage.
 * @param {boolean} options.sync Whether to sync state across multiple tabs/windows.
 * @returns {[any, Function]} A tuple containing the stored value and a function to update it.
 */
export default function useLocalStorage(key, options = {}) {
  const { initialValue = null, sync = true } = options;

  const storageKey = useMemo(() => `${appId}_${key}`, [key]);

  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item == null) return initialValue;
      return JSON.parse(item);
    } catch (error) {
      return initialValue;
    }
  }, [storageKey, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  /**
   * Sets a new value both in state and in localStorage.
   * @param {any} value The new value to store.
   */
  const setValue = useCallback((value) => {
    try {
      const valueToStore =
          typeof value === 'function' ? value(readValue()) : value;

      setStoredValue(valueToStore);

      if (valueToStore == null) {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify(valueToStore)
        );
      }
    } catch (error) {
      //
    }
  }, [storageKey, readValue]);

  useEffect(() => {
    if (!sync) return undefined;

    /**
     * Handles cross-document localStorage updates.
     *
     * Fired when the same localStorage key is modified in another
     * browsing context (e.g. a different tab or window).
     *
     * Note:
     * - This event does NOT fire in the same tab that performed the update.
     * - `event.newValue` is null when the key was removed.
     *
     * @param {StorageEvent} event The native storage event.
     * @returns {void}
     */
    const handleStorageChange = (event) => {
      if (event.key !== storageKey) return;

      try {
        const newValue = event.newValue
          ? JSON.parse(event.newValue)
          : initialValue;

        setStoredValue(newValue);
      } catch {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [storageKey, initialValue, sync]);

  return [storedValue, setValue];
}

