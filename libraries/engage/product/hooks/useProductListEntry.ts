import { useContext } from 'react';
import ProductListEntryContext, {
  type ProductListEntryContextValue,
} from '../providers/ProductListEntry/context';

/**
 * Provides the properties of the ProductListEntryContext.
 * @returns The context value.
 */
export default function useProductListEntry(): ProductListEntryContextValue {
  return useContext(ProductListEntryContext);
}
