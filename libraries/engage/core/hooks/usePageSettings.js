import { useRoute } from './useRoute';
import { getPageSettings } from '../config/getPageSettings';

/**
 * Retrieves the settings for the current page. If a key is given, inheritance is enabled for it.
 * @param {string} [key] Optional key to read and inherit from theme settings
 * @returns {Object}
 */
export function usePageSettings(key = null) {
  const { pattern: pagePattern } = useRoute();
  return getPageSettings(pagePattern, key);
}
