import { ADD_PRODUCTS_TO_CART } from '../constants';

/**
 * Creates the dispatched ADD_PRODUCTS_TO_CART action object.
 * @param {Array} products The products to be added.
 * @returns {Object} The dispatched action object.
 */
const addProductsToCart = products => ({
  type: ADD_PRODUCTS_TO_CART,
  products,
});

export default addProductsToCart;
