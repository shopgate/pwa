import { UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched UPDATE_PRODUCTS_IN_CART action object.
 * @param {Array} updateData The update data.
 * @returns {Object} The dispatched action object.
 */
const updateProductsInCart = updateData => ({
  type: UPDATE_PRODUCTS_IN_CART,
  updateData,
});

export default updateProductsInCart;
