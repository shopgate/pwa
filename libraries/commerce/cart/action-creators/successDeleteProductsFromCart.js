import { SUCCESS_DELETE_PRODUCTS_FROM_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_DELETE_PRODUCTS_FROM_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successDeleteProductsFromCart = () => ({
  type: SUCCESS_DELETE_PRODUCTS_FROM_CART,
});

export default successDeleteProductsFromCart;
