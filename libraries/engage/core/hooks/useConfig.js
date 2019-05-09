import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Provides the global theme configuration.
 * @returns {Object}
 */
export function useConfig() {
  const { theme: { pages, ...config } = {} } = appConfig;
  return config || {};
}
