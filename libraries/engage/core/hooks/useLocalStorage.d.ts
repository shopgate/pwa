  /**
   * Custom hook to manage and persist state in localStorage.
   * @param key The key under which the value is stored in localStorage.
   * @returns A tuple containing the stored value and a function to update it.
   */
  export default function useLocalStorage<T = any>(
    key: string
  ): [T | null, (value: T) => void];
