import { i18n } from '@shopgate/engage/core/helpers/i18n';

/**
 * Builds the accessible name of a cart or favorites button that announces its product count.
 * @param label The translated label of the button.
 * @param count The number of products.
 * @returns The label followed by the number of products.
 */
export const getCountAriaLabel = (label: string, count: number): string => (
  `${label}. ${i18n.text('common.products')}: ${count}.`
);
