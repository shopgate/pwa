import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme colors.
 * @param {string|null} [key=null] settings key
 * @returns {Object}
 */
export function getThemeColors(key = null) {
  const { colors = {} } = getThemeConfig();
  return key ? colors[key] : colors;
}
