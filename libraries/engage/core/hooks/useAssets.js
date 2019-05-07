import { useConfig } from './useConfig';

/**
 * Retrieves the global theme assets.
 * @returns {Object}
 */
export function useAssets() {
  const { assets = {} } = useConfig();

  return assets;
}
