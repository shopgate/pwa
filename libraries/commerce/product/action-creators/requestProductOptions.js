import { REQUEST_PRODUCT_OPTIONS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_OPTIONS action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @return {Object} The REQUEST_PRODUCT_OPTIONS action.
 */
const requestProductOptions = productId => ({
  type: REQUEST_PRODUCT_OPTIONS,
  productId,
});

export default requestProductOptions;
