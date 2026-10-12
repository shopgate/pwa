import { useSelector } from 'react-redux';
import { getProduct } from '../selectors/product';
import useProductListEntry from './useProductListEntry';

/**
 * A product entity of the product state. Only the id is needed by the hook.
 */
export interface ProductListEntryProduct {
  id: string;
}

/**
 * Provides the product of the surrounding product list entry. It is the hook counterpart of the
 * withProductListEntryProduct HOC.
 * @param product A product that is already available, e.g. from the props of a component. When it
 * belongs to the product list entry, it is returned instead of selecting the product again.
 * @returns The product, or null when it is not available.
 */
export default function useProductListEntryProduct<
  T extends ProductListEntryProduct = ProductListEntryProduct
>(product?: T | null): T | null {
  const { productId } = useProductListEntry();
  const reuseProduct = !!product
    && typeof product.id !== 'undefined'
    && product.id === productId;

  const selectedProduct = useSelector((state: object) => (
    reuseProduct ? null : getProduct(state, { productId })
  )) as T | null;

  return reuseProduct ? product : selectedProduct;
}
