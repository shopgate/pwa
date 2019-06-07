import { getConfig } from './getConfig';

/**
 * Retrieves the global theme settings.
 * @param {string|null} [key=null] settings key
 * @returns {Object}
 */
export function getSettings(key = null) {
  const { settings } = getConfig();
  return key ? settings[key] : settings;
}
