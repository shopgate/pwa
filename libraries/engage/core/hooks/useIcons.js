import { useAssets } from './useAssets';

/**
 * Retrieves the global theme icons from the assets.
 * @returns {Object}
 */
export function useIcons() {
  const { icons = {} } = useAssets();

  return icons;
}
