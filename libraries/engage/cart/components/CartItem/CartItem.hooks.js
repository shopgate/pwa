import { useContext } from 'react';
import CartItemProductContext from './CartItemProductProvider.context';
import CartItemContext from './CartItemProvider.context';

/**
 * Returns the value of the cart item product provider state.
 * @returns {Object}
 */
export const useCartItemProduct = () => useContext(CartItemProductContext);
/**
 * Returns the value of the cart item provider state.
 * @returns {Object}
 */
export const useCartItem = () => useContext(CartItemContext);
