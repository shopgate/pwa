import { getThemeSettings } from './getThemeSettings';

/**
 * Whether colour/image swatches are enabled for the shop.
 * @returns {boolean}
 */
export function swatchesEnabled() {
  const swatches = getThemeSettings('swatches');
  return !!(swatches && swatches.enabled === true);
}
