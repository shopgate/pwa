import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVariantSelectorSettings } from '@shopgate/engage/settings/selectors/appSettings';
import type { ProductVariantSelectorSettings } from '@shopgate/engage/settings/types/appSettings';

export interface VariantSelectorSettings
  extends Omit<ProductVariantSelectorSettings, 'swatchCharacteristics' | 'chipCharacteristics'> {
  /** Lower cased labels of characteristics that are shown as swatches. */
  swatchCharacteristics: string[];
  /** Lower cased labels of characteristics that are shown as chips. */
  chipCharacteristics: string[];
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
    swatchCharacteristics: parseLabels(settings.swatchCharacteristics),
    chipCharacteristics: parseLabels(settings.chipCharacteristics),
  }), [settings]);
};

export default useVariantSelectorSettings;
