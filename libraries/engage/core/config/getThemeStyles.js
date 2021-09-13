import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme styles. Returns undefined when the given key doesn't exist there.
 *
 * @param {string|null} [key=null] settings key
 * @returns {Object|undefined|*}
 */
export function getThemeStyles(key = null) {
  const { styles = {} } = getThemeConfig();
  return key ? styles[key] : styles;
}
