import { useContext } from 'react';
import { ThemeContext } from '@shopgate/pwa-common/context';

/**
 * Provides the product props.
 * @returns {Object}
 */
export function useProduct() {
  // The contexts are left out in favor of other hooks.
  const { contexts: { ProductContext } } = useContext(ThemeContext);
  const productProps = useContext(ProductContext);
  return productProps;
}
