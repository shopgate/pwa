import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Provides the global theme configuration. Returns an empty object if no theme config exists.
 *
 * @returns {Object}
 */
export function getThemeConfig() {
  return appConfig.theme || {};
}
