import { useContext } from 'react';
import { ThemeContext } from '@shopgate/pwa-common/context';

/**
 * Provides the current product context props.
 * @returns {Object}
 */
export function useCurrentProduct() {
  // The contexts are left out in favor of other hooks.
  const { contexts: { ProductContext } } = useContext(ThemeContext);
  const productProps = useContext(ProductContext);
  return productProps;
}
