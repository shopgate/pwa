import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme settings.
 * @param {string|null} [key=null] settings key
 * @returns {Object}
 */
export function getThemeSettings(key = null) {
  const { settings = {} } = getThemeConfig();
  return key ? settings[key] : settings;
}
