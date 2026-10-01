import { useMemo, type ReactNode } from 'react';
import useProductListType from '../../hooks/useProductListType';
import Context from './context';

export interface ProductListEntryProviderProps {
  /**
   * Identifier of the product the entry renders.
   */
  productId: string;
  /**
   * Content that renders the product.
   */
  children?: ReactNode;
}

/**
 * The ProductListEntryProvider is usually wrapped around components that render products and
 * provides basic information about them.
 *
 * Context values can be accessed via the `useProductListEntry` hook, or injected into a class
 * component via the `withProductListEntry` HOC. Both can be imported via `@shopgate/engage/product`
 */
const ProductListEntryProvider = ({
  productId,
  children = null,
}: ProductListEntryProviderProps) => {
  const {
    type,
    subType,
  } = useProductListType();

  const value = useMemo(() => ({
    productListType: type,
    productListSubType: subType,
    productId,
  }), [productId, subType, type]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default ProductListEntryProvider;
