import { useRoute } from './useRoute';
import { getPageConfig } from '../config/getPageConfig';

/**
 * Retrieves the pure configuration for the current page.
 * See documentation of `getPageConfig` for further details.
 *
 * @returns {Object}
 */
export function usePageConfig() {
  const { pattern: pagePattern } = useRoute();
  return getPageConfig(pagePattern);
}
