import { RECEIVE_PRODUCT_MEDIA } from '../constants';

/**
 * Dispatches the RECEIVE_PRODUCT_MEDIA action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @param {Object[]} media collection
 * @return {Object}
 */
const receiveProductMedia = (productId, media) => ({
  type: RECEIVE_PRODUCT_MEDIA,
  productId,
  media,
});

export default receiveProductMedia;
