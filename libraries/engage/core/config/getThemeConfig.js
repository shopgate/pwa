import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Provides the global theme configuration.
 * @returns {Object}
 */
export function getThemeConfig() {
  return appConfig.theme || {};
}
