import { RECEIVE_PRODUCT_SHIPPING } from '../constants';

/**
 * Dispatches the RECEIVE_PRODUCT_SHIPPING action.
 * @param {string} productId The ID of the product for which the shipping is requested.
 * @param {Object} shipping The data of the received product shipping.
 * @return {Object} The RECEIVE_PRODUCT_SHIPPING action.
 */
const receiveProductShipping = (productId, shipping) => ({
  type: RECEIVE_PRODUCT_SHIPPING,
  productId,
  shipping,
});

export default receiveProductShipping;
