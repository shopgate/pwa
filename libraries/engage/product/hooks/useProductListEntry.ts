import { useContext } from 'react';
import ProductListEntryContext, {
  // eslint-disable-next-line import/named, no-unused-vars
  ProductListEntryContextValue,
} from '../providers/ProductListEntry/context';

/**
 * Provides the properties of the ProductListEntryContext.
 * @returns {ProductListEntryContextValue}
 */
export default function useProductListEntry() {
  const context = useContext(ProductListEntryContext);
  return context;
}
