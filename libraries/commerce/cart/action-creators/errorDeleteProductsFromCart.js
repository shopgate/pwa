import { ERROR_DELETE_PRODUCTS_FROM_CART } from '../constants';

/**
 * Creates the dispatched ERROR_DELETE_PRODUCTS_FROM_CART action object.
 * @param {Array} products The products that where supposed to be deleted within
 *   an DELETE_PRODUCTS_FROM_CART action.
 * @param {PipelineErrorElement[]} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
const errorDeleteProductsFromCart = (products, errors = []) => ({
  type: ERROR_DELETE_PRODUCTS_FROM_CART,
  products,
  errors,
});

export default errorDeleteProductsFromCart;
