import { useWidgetSettings } from '../../../core';

/**
 * @param {Object} [productStock={}] product.stock object
 * @returns {Object}
 */
export const useQuantityRange = (productStock = {}) => {
  const settings = useWidgetSettings('@shopgate/engage/product/QuantityPicker');

  if (!productStock) {
    return null;
  }

  let min = settings?.minOrderQuantity ?? 1;
  if (productStock.minOrderQuantity > 0) {
    min = productStock.minOrderQuantity;
  }

  let max = settings?.maxOrderQuantity ?? 50;
  if (productStock.maxOrderQuantity > 0) {
    max = Math.min(
      Math.max(min, max),
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

