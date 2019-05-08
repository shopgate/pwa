import { ERROR_PRODUCT_MEDIA } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_MEDIA action.
 * @param {string} productId The ID of the product for which the options are requested.
 * @param {string} errorCode error code
 * @return {Object}
 */
const errorProductMedia = (productId, errorCode) => ({
  type: ERROR_PRODUCT_MEDIA,
  productId,
  errorCode,
});

export default errorProductMedia;
