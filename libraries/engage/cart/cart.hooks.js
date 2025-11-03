import { useContext } from 'react';
import { CartContext } from './cart.context';

/**
 * @typedef {import('./cart.context').CartContextProps} CartContextProps
 */

/**
 * Returns the cart context.
 * @returns {CartContextProps}
 */
export function useCartContext() {
  return useContext(CartContext);
}
