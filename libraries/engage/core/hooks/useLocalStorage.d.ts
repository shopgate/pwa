/**
 * Options for useLocalStorage.
 */
export interface UseLocalStorageOptions<T> {
  /**
   * Fallback value used when nothing is stored or when parsing fails.
   */
  initialValue?: T;

  /**
   * Whether to sync value changes across tabs via the StorageEvent listener.
   * @default true
   */
  sync?: boolean;
}

/**
 * Custom hook to manage and persist state in localStorage.
 *
 * @param key The key under which the value is stored in localStorage.
 * @param options Optional configuration.
 * @returns A tuple containing the stored value and a function to update it.
 */
export default function useLocalStorage<T = any>(
  key: string,
  options?: UseLocalStorageOptions<T>
): [
  T | null,
  (value: T | ((prev: T | null) => T)) => void
];
