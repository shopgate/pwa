import { SET_PRODUCT_VARIANT_ID } from '../constants';

/**
 * Creates the dispatched SET_PRODUCT_VARIANTS_ID action object.
 * @param {string|null} productVariantId The product variant id.
 * @returns {Object} The dispatched action object.
 */
const setProductVariantId = productVariantId => ({
  type: SET_PRODUCT_VARIANT_ID,
  productVariantId,
});

export default setProductVariantId;
