/* eslint-disable no-param-reassign */
const mockEffectiveDates = require('./mockEffectiveDates');
const mockMapPrice = require('./mockMapPrice');
const mockMinMaxOrder = require('./mockMinMaxOrder');
const mockNotFoundProduct = require('./mockNotFoundProduct');

/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { products = [] }) => {
  if (!context.config.enableMocks) {
    return { products };
  }

  if (!products.length || products.length === 1) {
    return { products };
  }

  products = mockEffectiveDates(products);
  products = mockMapPrice(products);
  products = mockMinMaxOrder(products);
  products = mockNotFoundProduct(products);

  return {
    products,
  };
};
/* eslint-enable no-param-reassign */
