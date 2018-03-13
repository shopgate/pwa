import { RECEIVE_PRODUCT_DESCRIPTION } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_DESCRIPTION action object.
 * @param {string} productId The ID of the product that received description.
 * @param {string} description The description for the product.
 * @return {Object} The RECEIVE_PRODUCT_DESCRIPTION action.
 */
const receiveProductDescription = (productId, description) => ({
  type: RECEIVE_PRODUCT_DESCRIPTION,
  productId,
  description,
});

export default receiveProductDescription;
