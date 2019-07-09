import { useRoute } from './useRoute';
import { getPageSettings } from '../config/getPageSettings';

/**
 * Retrieves the settings for the current page.
 * See documentation of `getPageSettings` for further details.
 *
 * @param {string} [key=null] Optional key to read and inherit from theme settings
 * @returns {Object}
 */
export function usePageSettings(key = null) {
  const { pattern: pagePattern } = useRoute();
  return getPageSettings(pagePattern, key);
}
