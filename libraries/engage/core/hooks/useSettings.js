import { getSettings } from '../config/getSettings';

/**
 * Retrieves the global theme settings.
 * @returns {Object}
 */
export function useSettings() {
  return getSettings();
}
