import { REQUEST_PRODUCT_MEDIA } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_MEDIA action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @return {Object}
 */
const requestProductMedia = productId => ({
  type: REQUEST_PRODUCT_MEDIA,
  productId,
});

export default requestProductMedia;
