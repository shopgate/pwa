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
const parseLabels = (value: string): string[] => (value || '')
  .split(',')
  .map(label => label.trim().toLowerCase())
  .filter(Boolean);

/**
 * Resolves the variant selector settings with parsed characteristic lists.
 * @returns The variant selector settings.
 */
const useVariantSelectorSettings = (): VariantSelectorSettings => {
  const settings = useSelector(getVariantSelectorSettings);

  return useMemo(() => ({
    ...settings,
    swatchCharacteristics: settings.swatchesEnabled
      ? parseLabels(settings.swatchCharacteristics)
      : [],
  }), [settings]);
};

export default useVariantSelectorSettings;
