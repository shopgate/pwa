import { i18n } from '@shopgate/engage/core/helpers/i18n';
import type { VariantSelectorValue } from '../types';

/**
 * Returns the spoken state of a value that is sold out or not available in the selection.
 * @param value The value.
 * @returns The state text or an empty string.
 */
export const getValueStateText = (value: VariantSelectorValue): string => {
  if (value.available === false) {
    return i18n.text('product.variant_unavailable');
  }

  if (value.soldOut) {
    return i18n.text('product.variant_sold_out');
  }

  return '';
};
