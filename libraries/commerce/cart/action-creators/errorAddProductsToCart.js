import { ERROR_ADD_PRODUCTS_TO_CART } from '../constants';

/**
 * Creates the dispatched ERROR_ADD_PRODUCTS_TO_CART action object.
 * @param {Array} products The products that where supposed to be added within
 *   an ADD_PRODUCTS_TO_CART action.
 * @param {PipelineErrorElement[]} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
const errorAddProductsToCart = (products, errors = []) => ({
  type: ERROR_ADD_PRODUCTS_TO_CART,
  products,
  errors,
});

export default errorAddProductsToCart;
