import { useRoute } from './useRoute';
import { getPageSettings } from '../config/getPageSettings';

/**
 * Retrieves the settings for the current page. If a key is given, values are inherited from the
 * upper config hierarchy, scoped by the given key.
 *
 * @param {string} [key=null] Optional key to read and inherit from theme settings
 * @returns {Object}
 */
export function usePageSettings(key = null) {
  const { pattern: pagePattern } = useRoute();
  return getPageSettings(pagePattern, key);
}
