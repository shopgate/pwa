import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme colors. Returns an empty object if no theme colors exist.
 *
 * @param {string|null} [key=null] settings key
 * @returns {Object}
 */
export function getThemeColors(key = null) {
  const { colors = {} } = getThemeConfig();
  return key ? (colors[key] || {}) : colors;
}
