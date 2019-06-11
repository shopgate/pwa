import { getThemeConfig } from '../config/getThemeConfig';

/**
 * Provides the global theme configuration.
 * @returns {Object}
 */
export function useConfig() {
  return getThemeConfig();
}
