import { ERROR_PRODUCT_DESCRIPTION } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that received description.
 * @return {Object} The ERROR_PRODUCT_DESCRIPTION action.
 */
const errorProductDescription = productId => ({
  type: ERROR_PRODUCT_DESCRIPTION,
  productId,
});

export default errorProductDescription;
