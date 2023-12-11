import { useContext } from 'react';
import ProductListTypeContext, {
  // eslint-disable-next-line import/named, no-unused-vars
  ProductListTypeContextValue,
} from '../providers/ProductListType/context';

/**
 * Provides the properties of the ProductListTypeContext.
 * @returns {ProductListTypeContextValue}
 */
export default function useProductListType() {
  const context = useContext(ProductListTypeContext);
  return context;
}
