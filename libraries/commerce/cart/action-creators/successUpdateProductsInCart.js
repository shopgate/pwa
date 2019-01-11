import { SUCCESS_UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @returns {Object} The dispatched action object.
 */
const successUpdateProductsInCart = () => ({
  type: SUCCESS_UPDATE_PRODUCTS_IN_CART,
});

export default successUpdateProductsInCart;
