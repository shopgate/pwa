import { REQUEST_PRODUCT_DESCRIPTION } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that requests description.
 * @return {Object} The REQUEST_PRODUCT_DESCRIPTION action.
 */
const requestProductDescription = productId => ({
  type: REQUEST_PRODUCT_DESCRIPTION,
  productId,
});

export default requestProductDescription;
