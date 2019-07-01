import defaultsDeep from 'lodash/defaultsDeep';
import { getThemeSettings } from './getThemeSettings';
import { getPageConfig } from './getPageConfig';

/**
 * This function reads the settings for a given page pattern and an optional key.
 * If a key is set, then the result is filtered to it, to only return contents defined under it and
 * will also enable inheritance for values coming from theme settings for the given key.
 * Settings containing arrays will not be deeply inherited.
 * Omitting the key will result the pure page settings with all keys inside.
 *
 * @param {string} pagePattern The page to look for in the theme config
 * @param {string} [key=null] Optional key to read and inherit from theme settings
 * @returns {Object}
 */
export function getPageSettings(pagePattern, key = null) {
  const inheritedThemeSettings = getThemeSettings(key);
  const { settings: localPageSettings = {} } = getPageConfig(pagePattern);

  // When providing a key, it automatically inherits settings from the global scope
  if (key) {
    return defaultsDeep(localPageSettings[key] || {}, inheritedThemeSettings[key] || {});
  }

  // Return local (pure) page settings when no key is set
  return localPageSettings;
}
