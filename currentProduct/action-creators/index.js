import {
  SET_PRODUCT_ID,
  SET_PRODUCT_VARIANT_ID,
  SET_PRODUCT_QUANTITY,
  SET_PRODUCT_OPTION,
  RESET_CURRENT_PRODUCT,
} from '../../product/constants';

/**
 * Creates the dispatched SET_PRODUCT_ID action object.
 * @param {string|null} productId The product id.
 * @returns {Object} The dispatched action object.
 */
export const setProductId = productId => ({
  type: SET_PRODUCT_ID,
  productId,
});

/**
 * Creates the dispatched SET_PRODUCT_VARIANTS_ID action object.
 * @param {string|null} productVariantId The product variant id.
 * @returns {Object} The dispatched action object.
 */
export const setProductVariantId = productVariantId => ({
  type: SET_PRODUCT_VARIANT_ID,
  productVariantId,
});

/**
 * Creates the dispatched SET_PRODUCT_QUANTITY action object.
 * @param {number} quantity The product variant id.
 * @returns {Object} The dispatched action object.
 */
export const setProductQuantity = quantity => ({
  type: SET_PRODUCT_QUANTITY,
  quantity,
});

/**
 * Dispatches the SET_PRODUCT_OPTION action.
 * @param {string} optionId The ID of the option.
 * @param {string} valueId The ID of the selected value.
 * @return {Object} The SET_PRODUCT_OPTIONS action.
 */
export const setProductOption = (optionId, valueId) => ({
  type: SET_PRODUCT_OPTION,
  optionId,
  valueId,
});

/**
 * Dispatches the RESET_CURRENT_PRODUCT action.
 * @return {Object} The RESET_CURRENT_PRODUCT action.
 */
export const resetCurrentProduct = () => ({
  type: RESET_CURRENT_PRODUCT,
});
