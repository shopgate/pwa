import { useContext } from 'react';
import ProductListTypeContext, {
  type ProductListTypeContextValue,
} from '../providers/ProductListType/context';

/**
 * Provides the properties of the ProductListTypeContext.
 * @returns The context value.
 */
export default function useProductListType(): ProductListTypeContextValue {
  return useContext(ProductListTypeContext);
}
