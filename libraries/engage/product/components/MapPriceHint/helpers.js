import { isBetween } from '@shopgate/pwa-common/helpers/date';

/**
 * Decide is map price hint should be shown for exact product
 * @param {Object} productPrice product.price object
 * @param {Object} mapPrice product.price.mapPricing
 * @returns {boolean}
 */
export const showHint = (productPrice, mapPrice) => {
  const { unitPrice = 0 } = productPrice || {};
  const { price = 0, startDate, endDate } = mapPrice || {};

  // MAP price is active and higher than the actual price
  if (!price || price <= unitPrice) {
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (!start.getDate() || !end.getDate()) {
    // dates invalid
    return false;
  }

  return isBetween(new Date(), start, end);
};

