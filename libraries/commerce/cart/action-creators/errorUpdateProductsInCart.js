import { ERROR_UPDATE_PRODUCTS_IN_CART } from '../constants';

/**
 * Creates the dispatched ERROR_UPDATE_PRODUCTS_IN_CART action object.
 * @param {Array} updateData The update data from the failed UPDATE_PRODUCTS_IN_CART action.
 * @param {PipelineErrorElement[]} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
const errorUpdateProductsInCart = (updateData, errors = []) => ({
  type: ERROR_UPDATE_PRODUCTS_IN_CART,
  updateData,
  errors,
});

export default errorUpdateProductsInCart;
