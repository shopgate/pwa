import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme colors. Returns undefined when the given key doesn't exist in colors.
 *
 * @param {string|null} [key=null] settings key
 * @returns {Object|undefined|*}
 */
export function getThemeColors(key = null) {
  const { colors = {} } = getThemeConfig();
  return key ? colors[key] : colors;
}
