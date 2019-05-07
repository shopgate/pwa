import { useConfig } from './useConfig';

/**
 * Retrieves the global theme settings.
 * @returns {Object}
 */
export function useSettings() {
  const { settings = {} } = useConfig();

  return settings;
}
