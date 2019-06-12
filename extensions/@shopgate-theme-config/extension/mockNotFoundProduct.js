/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { products = [] }) => {
  if (!context.config.mocks.enabled) {
    return { products };
  }

  if (!products.length || products.length === 1) {
    return { products };
  }
  return {
    products: [{
      ...products[0],
      id: `${products[0].id}-${Math.round(Math.random() * 1000000)}`,
      name: `${products[0].id}-ENOTFOUND`,
    }].concat(products),
  };
};
