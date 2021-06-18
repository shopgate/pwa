import { PROVIDE_PRODUCT_ALTERNATIVE_LOCATION } from '../constants/ActionTypes';

/**
 * @param {string} productId .
 * @param {Object} params for fetching product locations.
 * @return {Object}
 */
export const provideProductAlternativeLocation = (productId, params) => ({
  type: PROVIDE_PRODUCT_ALTERNATIVE_LOCATION,
  productId,
  params,
});
