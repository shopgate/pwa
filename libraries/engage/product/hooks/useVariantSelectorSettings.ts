import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVariantSelectorSettings } from '@shopgate/engage/settings/selectors/appSettings';
import type { ProductVariantSelectorSettings } from '@shopgate/engage/settings/types/appSettings';

export interface VariantSelectorSettings
  extends Omit<ProductVariantSelectorSettings, 'swatchCharacteristics'> {
  /** Lower cased labels of characteristics that are shown as swatches, empty when disabled. */
  swatchCharacteristics: string[];
}

/**
 * Splits a comma separated list of characteristic labels.
 * @param value The configured list.
 * @returns The lower cased labels.
 */
const parseLabels = (value: unknown): string[] => (typeof value === 'string' ? value : '')
  .split(',')
  .map(label => label.trim().toLowerCase())
  .filter(Boolean);

const MIN_ZOOM = 100;
const MAX_ZOOM = 600;

/**
 * Limits the image swatch zoom to the supported range.
 * @param value The configured zoom.
 * @returns The zoom in percent.
 */
const clampZoom = (value: unknown): number => {
  const zoom = Number(value);
  return Number.isFinite(zoom) ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) : MIN_ZOOM;
};

/**
 * Resolves the variant selector settings with parsed characteristic lists.
 * @returns The variant selector settings.
 */
const useVariantSelectorSettings = (): VariantSelectorSettings => {
  const settings = useSelector(getVariantSelectorSettings);

  return useMemo(() => ({
    ...settings,
    preselect: settings.preselect === true,
    swatchProperty: typeof settings.swatchProperty === 'string' ? settings.swatchProperty : '',
    swatchImageZoom: clampZoom(settings.swatchImageZoom),
    swatchCharacteristics: settings.swatchesEnabled
      ? parseLabels(settings.swatchCharacteristics)
      : [],
  }), [settings]);
};

export default useVariantSelectorSettings;
