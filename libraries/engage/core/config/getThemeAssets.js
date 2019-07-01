import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme assets. Returns an empty object if no theme assets exist.
 *
 * @param {string|null} [key=null] settings key
 * @returns {Object}
 */
export function getThemeAssets(key = null) {
  const { assets = {} } = getThemeConfig();
  return key ? (assets[key] || {}) : assets;
}
