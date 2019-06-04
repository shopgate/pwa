import { getThemeSettings } from '../config/getThemeSettings';

/**
 * Retrieves the global theme settings.
 * @returns {Object}
 */
export function useSettings() {
  return getThemeSettings();
}
