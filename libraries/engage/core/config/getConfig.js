import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Provides the global theme configuration.
 * @returns {Object}
 */
export function getConfig() {
  const { theme: { pages: ignore, ...config } = {} } = appConfig;
  return config || {};
}
