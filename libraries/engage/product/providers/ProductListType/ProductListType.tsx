import React, { useMemo, type ReactNode } from 'react';
import Context, {
  type ProductListTypeContextSubType,
  type ProductListTypeContextType,
} from './context';

export interface ProductListTypeProviderProps {
  /**
   * Type of the product list, e.g. "productSlider" or "productGrid".
   */
  type: ProductListTypeContextType;
  /**
   * Optional sub type that tells in which context the product list is used, e.g. "widgets".
   */
  subType?: ProductListTypeContextSubType | null;
  /**
   * Optional meta information that can be used by child components.
   */
  meta?: Record<string, unknown> | null;
  /**
   * Content that renders the product list.
   */
  children?: ReactNode;
}

/**
 * The ProductListTypeProvider is usually wrapped around components that render product lists.
 * It provides information about the type / purpose of those product lists which can be used
 * by child components or extensions to determine how they are supposed to render their content.
 *
 * Context values can be accessed via the `useProductListType` hook, or injected into a class
 * component via the `withProductListType` HOC. Both can be imported from `@shopgate/engage/product`
 */
const ProductListTypeProvider = ({
  type,
  subType = null,
  meta = null,
  children = null,
}: ProductListTypeProviderProps) => {
  const value = useMemo(() => ({
    type,
    subType,
    meta,
  }), [meta, subType, type]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default ProductListTypeProvider;
