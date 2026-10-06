import { createContext } from 'react';

/**
 * Type of a product list. Lists the types used by the PWA; extensions can use their own.
 */
export type ProductListTypeContextType =
  | 'productSlider'
  | 'productGrid'
  | 'productList'
  | 'favoritesList'
  | 'cart'
  | 'liveshopping'
  | 'pdp'
  | 'productGallery'
  | (string & NonNullable<unknown>);

/**
 * Sub type of a product list. Lists the sub types used by the PWA; extensions can use their own.
 */
export type ProductListTypeContextSubType =
  | 'widgets'
  | 'category'
  | 'mediaSection'
  | (string & NonNullable<unknown>);

/**
 * Context value provided by the ProductListTypeProvider.
 */
export interface ProductListTypeContextValue {
  /**
   * Type of the product list, e.g. "productSlider" or "productGrid".
   */
  type: ProductListTypeContextType | null;
  /**
   * Optional sub type that tells in which context the product list is used, e.g. "widgets".
   */
  subType: ProductListTypeContextSubType | null;
  /**
   * Optional meta information that can be used by child components.
   */
  meta: object | null;
}

export default createContext<ProductListTypeContextValue>({
  type: null,
  subType: null,
  meta: null,
});
