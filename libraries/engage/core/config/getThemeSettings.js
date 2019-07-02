import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme settings. Returns undefined when the given key doesn't exist there.
 *
 * @param {string|null} [key=null] settings key
 * @returns {Object|undefined|*}
 */
export function getThemeSettings(key = null) {
  const { settings = {} } = getThemeConfig();
  return key ? settings[key] : settings;
}
