import { getThemeConfig } from './getThemeConfig';

/**
 * Retrieves the global theme assets. Returns undefined when the given key doesn't exist in assets.
 *
 * @param {string|null} [key=null] settings key
 * @returns {Object|undefined|*}
 */
export function getThemeAssets(key = null) {
  const { assets = {} } = getThemeConfig();
  return key ? assets[key] : assets;
}
