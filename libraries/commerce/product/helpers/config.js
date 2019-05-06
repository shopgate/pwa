import appConfig from '@shopgate/pwa-common/helpers/config';

const {
  product: {
    minOrderQuantity = 1,
    maxOrderQuantity = 1,
  } = {},
} = appConfig;

/**
 * Check if PDP has qiantity picker
 * @returns {boolean}
 */
export const hasQuantityPicker = () => maxOrderQuantity > 1;

/**
 * @param {Object} productStock product.stock object
 * @returns {Object}
 */
export const getQuantityRange = productStock => ({
  min: productStock.quantity > 0
    ? Math.min(minOrderQuantity, productStock.quantity)
    : minOrderQuantity,
  max: productStock.quantity > 0
    ? Math.min(maxOrderQuantity, productStock.quantity)
    : maxOrderQuantity,
});

