import {
  useCallback, useEffect, useState, useMemo,
} from 'react';

import { appConfig } from '@shopgate/engage';

// @ts-expect-error - appConfig is not typed yet
const { appId } = appConfig;

/**
 * Options for useLocalStorage.
 */
interface UseLocalStorageOptions<T> {
  /**
   * Fallback value used when nothing is stored or when parsing fails.
   */
  initialValue?: T;

  /**
   * Whether to sync value changes across tabs via the StorageEvent listener.
   * @default true
   */
  sync?: boolean;

  /**
   * Whether the value is written to localStorage at all. Set to false in contexts that must not
   * leak state into the visitor's browser and should stay ephemeral. With this off the hook is a
   * plain useState: it neither reads nor writes localStorage, and it ignores updates from other
   * tabs.
   * @default true
   */
  persist?: boolean;
}

type SetValueAction<T> = T | null | ((prev: T | null) => T | null);

/**
 * Custom hook to manage and persist state in localStorage.
 * @param key The key under which the value is stored in localStorage.
 * @param options Optional configuration object.
 * @returns A tuple containing the stored value and a function to update it.
 */
export default function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): readonly [T | null, (value: SetValueAction<T>) => void] {
  const { initialValue = null, sync = true, persist = true } = options;

  const storageKey = useMemo(() => `${appId}_${key}`, [key]);

  const readValue = useCallback(() => {
    if (!persist) return initialValue;

    try {
      const item = window.localStorage.getItem(storageKey);
      if (item == null) return initialValue;
      return JSON.parse(item);
    } catch (error) {
      return initialValue;
    }
  }, [storageKey, initialValue, persist]);

  const [storedValue, setStoredValue] = useState<T|null>(readValue);

  /**
   * Sets a new value both in state and in localStorage.
   * @param value The new value to store.
   */
  const setValue = useCallback((value) => {
    // Resolve an updater against the live React state, so it sees the current value whether or not
    // the value is persisted (when persist is off there is nothing to read back from storage).
    setStoredValue((prev) => {
      const valueToStore = typeof value === 'function' ? value(prev) : value;

      if (!persist) return valueToStore;

      try {
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

      return valueToStore;
    });
  }, [storageKey, persist]);

  useEffect(() => {
    if (!sync || !persist) return undefined;

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
     * @param event The native storage event.
     */
    const handleStorageChange = (event: StorageEvent) => {
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
  }, [storageKey, initialValue, sync, persist]);

  return [storedValue, setValue];
}

