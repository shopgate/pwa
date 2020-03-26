// @flow
import * as React from 'react';
import { CartContext, type CartContextProps } from './cart.context';

/**
 * Returns the cart context.
 * @returns {Object}
 */
export function useCartContext(): CartContextProps {
  return React.useContext(CartContext);
}
