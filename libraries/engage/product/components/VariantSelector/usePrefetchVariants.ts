import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import fetchProductsById from '@shopgate/pwa-common-commerce/product/actions/fetchProductsById';
import type { ProductVariants, VariantSelection } from './types';

const PREFETCH_DELAY = 300;
const PREFETCH_LIMIT = 20;

/**
 * Returns the variants that are at most one selection away from the current selection, the
 * selected variant first.
 * @param variants The variants.
 * @param selection The current selection.
 * @param limit The maximum number of variants.
 * @returns The variant IDs.
 */
export const getNearbyVariantIds = (
  variants: ProductVariants,
  selection: VariantSelection,
  limit = PREFETCH_LIMIT
): string[] => {
  const selectedIds = Object.keys(selection);

  if (!selectedIds.length) {
    return [];
  }

  return variants.products
    .map(product => ({
      id: product.id,
      distance: selectedIds
        .filter(charId => product.characteristics[charId] !== selection[charId]).length,
    }))
    .filter(({ distance }) => distance <= 1)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ id }) => id);
};

/**
 * Loads the product data of the variants that are one selection away, so switching to them
 * shows their data without waiting for a request.
 * @param variants The variants.
 * @param selection The current selection.
 */
const usePrefetchVariants = (
  variants: ProductVariants | null,
  selection: VariantSelection
): void => {
  const dispatch = useDispatch() as unknown as (action: unknown) => unknown;

  useEffect(() => {
    if (!variants) {
      return undefined;
    }

    const productIds = getNearbyVariantIds(variants, selection);

    if (!productIds.length) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      dispatch(fetchProductsById({ productIds }));
    }, PREFETCH_DELAY);

    return () => clearTimeout(timeout);
  }, [dispatch, selection, variants]);
};

export default usePrefetchVariants;
