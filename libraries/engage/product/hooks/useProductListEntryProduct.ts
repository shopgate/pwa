import { useSelector } from 'react-redux';
import { getProduct } from '../selectors/product';
import type { ProductListEntryContextValue } from '../providers/ProductListEntry/context';
import useProductListEntry from './useProductListEntry';

/**
 * A product entity of the product state. Only the id is needed by the hook.
 */
export interface ProductListEntryProduct {
  id: string;
}

/**
 * The product list entry together with its product, as the withProductListEntryProduct HOC
 * injects them.
 */
export interface ProductListEntryWithProduct<T extends ProductListEntryProduct> {
  /**
   * The product of the entry, or null when it is not available.
   */
  product: T | null;
  /**
   * The surrounding product list entry.
   */
  productListEntry: ProductListEntryContextValue;
}

/**
 * Provides the surrounding product list entry together with its product. It is the hook
 * counterpart of the withProductListEntryProduct HOC.
 * @param product A product that is already available, e.g. from the props of a component. When it
 * belongs to the product list entry, it is returned instead of selecting the product again.
 * @returns The product list entry and its product.
 */
export default function useProductListEntryProduct<
  T extends ProductListEntryProduct = ProductListEntryProduct
>(product?: T | null): ProductListEntryWithProduct<T> {
  const productListEntry = useProductListEntry();
  const { productId } = productListEntry;
  const reuseProduct = !!product
    && typeof product.id !== 'undefined'
    && product.id === productId;

  const selectedProduct = useSelector((state: object) => (
    reuseProduct ? null : getProduct(state, { productId })
  )) as T | null;

  return {
    product: reuseProduct ? product : selectedProduct,
    productListEntry,
  };
}
