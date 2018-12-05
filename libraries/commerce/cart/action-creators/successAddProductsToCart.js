import { SUCCESS_ADD_PRODUCTS_TO_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_ADD_PRODUCTS_TO_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successAddProductsToCart = () => ({
  type: SUCCESS_ADD_PRODUCTS_TO_CART,
});

export default successAddProductsToCart;
