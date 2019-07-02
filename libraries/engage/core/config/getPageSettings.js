import defaultsDeep from 'lodash/defaultsDeep';
import { getThemeSettings } from './getThemeSettings';
import { getPageConfig } from './getPageConfig';

/**
 * This function reads the settings for a given page pattern and an optional key.
 * If a key is set, then the result is filtered to it, to only return contents defined under it and
 * will also enable inheritance for values coming from theme settings for that key.
 * Settings containing arrays will not be deeply inherited.
 * When the given key (if any is given) does not exist in any scope the return will be undefined.
 * Omitting the key will result in returning the pure page settings with all keys inside or an
 * empty object if the settings prop does not exist or is empty.
 *
 * @param {string} pagePattern The page to look for in the theme config
 * @param {string} [key=null] Optional key to read and inherit from theme settings
 * @returns {Object|undefined|*}
 */
export function getPageSettings(pagePattern, key = null) {
  const inheritedThemeSettings = getThemeSettings(key);
  const { settings: localPageSettings = {} } = getPageConfig(pagePattern);

  // When providing a key, it automatically inherits settings from the global scope, if any exist
  if (key) {
    // Requesting settings by key can yield undefined values (which is correct)
    // Merge settings if at least the higher scope contains any for the given key
    if (inheritedThemeSettings !== undefined) {
      return defaultsDeep(localPageSettings[key] || {}, inheritedThemeSettings);
    }
    return localPageSettings[key];
  }

  // Return local (pure) page settings only when no key is set
  return localPageSettings;
}
