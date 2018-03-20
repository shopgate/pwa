import { REQUEST_PRODUCT_VARIANTS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_VARIANTS action.
 * @param {string} productId The ID of the product for which the variants are requested.
 * @return {Object} The REQUEST_PRODUCT_VARIANTS action.
 */
const requestProductVariants = productId => ({
  type: REQUEST_PRODUCT_VARIANTS,
  productId,
});

export default requestProductVariants;
