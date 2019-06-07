import { getConfig } from '../config/getConfig';

/**
 * Provides the global theme configuration.
 * @returns {Object}
 */
export function useConfig() {
  return getConfig();
}
