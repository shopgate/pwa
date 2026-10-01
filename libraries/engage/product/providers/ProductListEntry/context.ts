import { createContext } from 'react';
import type {
  ProductListTypeContextType,
  ProductListTypeContextSubType,
} from '../ProductListType/context';

/**
 * Context value provided by the ProductListEntryProvider.
 */
export interface ProductListEntryContextValue {
  /**
   * A product identifier.
   */
  productId: string | null;
  /**
   * Type of the surrounding product list, e.g. "productSlider" or "productGrid".
   */
  productListType: ProductListTypeContextType | null;
  /**
   * Optional sub type of the surrounding product list, e.g. "widgets".
   */
  productListSubType: ProductListTypeContextSubType | null;
}

export default createContext<ProductListEntryContextValue>({
  productListType: null,
  productListSubType: null,
  productId: null,
});
