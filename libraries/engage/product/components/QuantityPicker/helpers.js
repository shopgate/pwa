import { useWidgetSettings } from '../../../core';

/**
 * @param {Object} [productStock={}] product.stock object
 * @returns {Object}
 */
export const getQuantityRange = (productStock = {}) => {
  const settings = useWidgetSettings('@shopgate/engage/product/QuantityPicker');

  let min = settings.minOrderQuantity;
  if (productStock.minOrderQuantity > 0) {
    min = productStock.minOrderQuantity;
  }

  let max = settings.maxOrderQuantity;
  if (productStock.maxOrderQuantity > 0) {
    max = Math.min(
      Math.max(min, settings.maxOrderQuantity),
      productStock.maxOrderQuantity
    );
  }
  // Normalize min if max is finally less then min
  min = Math.min(min, max);

  return {
    min,
    max,
  };
};

