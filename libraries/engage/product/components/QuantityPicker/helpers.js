import { useWidgetSettings } from '../../../core';

/**
 * @param {Object} productStock product.stock object
 * @returns {Object}
 */
export const getQuantityRange = (productStock) => {
  const settings = useWidgetSettings('@shopgate/engage/product/QuantityPicker');

  return {
    min: productStock.minOrderQuantity > 0
      ? Math.min(settings.minOrderQuantity, productStock.minOrderQuantity)
      : settings.minOrderQuantity,
    max: productStock.maxOrderQuantity > 0
      ? Math.min(settings.maxOrderQuantity, productStock.maxOrderQuantity)
      : settings.maxOrderQuantity,
  };
};

